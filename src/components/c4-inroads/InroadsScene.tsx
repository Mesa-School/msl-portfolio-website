"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface InroadsSceneProps {
  /** Photo URLs per slide: one for a solo founder, two for co-founders. */
  slides: string[][];
  /** Slide on stage. Changing it flips the cards and sends a ripple across the landscape. */
  index: number;
  /** Hide the cards during the intro and finale; the landscape keeps moving. */
  showCards: boolean;
}

/** `three` is shimmed as `any` in src/types/three-glb.d.ts, so type the teardown walk locally. */
interface Disposable3D {
  geometry?: { dispose(): void };
  material?: { dispose(): void };
}

const MINT = new THREE.Color("#22C891");
const CARD_W = 2.72;
const CARD_H = 3.4;
const PAIR_SCALE = 0.8; // each card's size when two founders share the stage
const PAIR_GAP = 0.55;

const CAMERA_Z = 10;

// Dotted landscape rolling out to the horizon under the stage. It ripples on
// every slide change and on clicks, and swells up under the cursor.
const FIELD_X = 190;
const FIELD_Z = 96;
const FIELD_W = 66;
const FIELD_D = 62;
const FIELD_Y = -2.4;
const RIPPLES = 4;

const fieldVertex = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRipples[${RIPPLES}];  // x, z, age, strength (0 = unused)
  uniform vec3 uCursor;             // x, z, strength
  varying float vGlow;
  varying float vFade;

  void main() {
    vec3 p = position;
    float swell = sin(p.x * 0.22 + uTime * 0.35) * 0.45
                + cos(p.z * 0.28 - uTime * 0.25) * 0.4
                + sin((p.x + p.z) * 0.12 + uTime * 0.2) * 0.35;

    // Expanding rings from slide changes and clicks.
    float ring = 0.0;
    for (int i = 0; i < ${RIPPLES}; i++) {
      vec4 r = uRipples[i];
      float d = length(p.xz - r.xy);
      ring += exp(-pow(d - r.z * 9.0, 2.0) * 0.35) * exp(-r.z * 0.6) * r.w;
    }

    // A glowing swell of dots under the cursor.
    float cd = length(p.xz - uCursor.xy);
    float hover = exp(-cd * cd * 0.12) * uCursor.z;

    p.y += swell + ring * 1.1 + hover * 0.9;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + ring * 2.5 + hover * 2.0) * (24.0 / -mv.z);

    vGlow = clamp(0.55 + (swell + 1.2) * 0.3 + ring * 1.4 + hover * 1.2, 0.0, 1.8);
    // Fade toward the horizon, at the side edges and right under the camera.
    vFade = smoothstep(-62.0, -24.0, p.z) * (1.0 - smoothstep(22.0, 33.0, abs(p.x))) * (1.0 - smoothstep(3.0, 6.0, p.z));
  }
`;

const fieldFragment = /* glsl */ `
  uniform vec3 uMint;
  varying float vGlow;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    vec3 col = mix(uMint * 0.6, vec3(0.8, 1.0, 0.92), clamp(vGlow - 1.0, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vFade * vGlow * 0.9);
  }
`;

const FLIP_MS = 1100;
const FLIP_TURN = 0.42; // fraction of the flip spent turning away before the swap

const cardVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The card plane is larger than the card itself so the outer glow has room.
const CARD_PAD_X = 1.22;
const CARD_PAD_Y = 1.18;

const cardFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uAlpha;
  uniform float uTime;
  uniform vec3 uMint;
  uniform vec2 uGlare;    // cursor position in card UV space
  uniform vec2 uTilt;     // smoothed pointer, drives the foil shift
  uniform float uHover;   // 1 while the cursor is over this card
  varying vec2 vUv;

  const float PI = 3.14159265;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Map the padded plane back onto the card's own 0..1 UVs.
    vec2 cuv = (vUv - 0.5) * vec2(${CARD_PAD_X}, ${CARD_PAD_Y}) + 0.5;
    vec2 p = (cuv - 0.5) * vec2(0.8, 1.0);
    float d = sdRoundBox(p, vec2(0.4, 0.5), 0.07);
    float inside = 1.0 - smoothstep(-0.0015, 0.0015, d);

    // ---- Panel: near-black, dot grid, halo behind the head ----
    vec3 panel = mix(vec3(0.008, 0.016, 0.013), vec3(0.02, 0.15, 0.105), smoothstep(1.0, 0.0, cuv.y));
    vec2 g = fract(cuv * vec2(22.0, 27.5)) - 0.5;
    panel += uMint * smoothstep(0.1, 0.0, length(g)) * 0.09 * (1.1 - cuv.y);
    panel += uMint * 0.24 * smoothstep(0.42, 0.0, length((cuv - vec2(0.5, 0.64)) * vec2(1.0, 0.9)));

    // ---- Founder cutout with a mint rim light that follows the tilt ----
    vec4 tex = texture2D(uTex, clamp(cuv, 0.0, 1.0));
    vec2 lightDir = normalize(vec2(uTilt.x * 0.8 + 0.25, 0.9 - uTilt.y * 0.4));
    float behind = texture2D(uTex, cuv + lightDir * 0.006).a;
    // Only where the silhouette meets the panel, not where the photo was cropped.
    float edgeFade = smoothstep(0.0, 0.03, cuv.y) * smoothstep(1.0, 0.97, cuv.y) * smoothstep(0.0, 0.03, cuv.x) * smoothstep(1.0, 0.97, cuv.x);
    float rim = tex.a * (1.0 - behind) * edgeFade;
    vec3 col = mix(panel, tex.rgb, tex.a);
    col += mix(uMint, vec3(1.0), 0.35) * rim * 0.55;

    // ---- Holographic foil: iridescent bands that slide as you tilt ----
    float h = (cuv.x * 1.2 + cuv.y * 0.7) * 2.2 + uTilt.x * 1.6 - uTilt.y * 1.1 + uTime * 0.08;
    vec3 iri = 0.5 + 0.5 * cos(2.0 * PI * (h + vec3(0.0, 0.33, 0.67)));
    iri = mix(iri, uMint * 1.3, 0.45);
    float foil = (1.0 - tex.a * 0.8) * (0.07 + uHover * 0.13);
    col += (iri - 0.35) * foil;

    // ---- Gloss: a sharp sheen sweeps across every few seconds ----
    float sweep = cuv.x * 0.7 + cuv.y - mod(uTime * 0.32, 4.2) + 1.1;
    col += smoothstep(0.14, 0.0, abs(sweep)) * 0.12 + smoothstep(0.018, 0.0, abs(sweep)) * 0.35;

    // Cursor glare, stronger on hover.
    float glare = smoothstep(0.55, 0.0, length((cuv - uGlare) * vec2(0.8, 1.0)));
    col += glare * (0.04 + uHover * 0.12);

    // Inner edge shading gives the panel depth.
    col *= mix(0.7, 1.0, smoothstep(0.0, 0.05, -d));

    // ---- Corner brackets, the logo frame's motif ----
    vec2 ap = abs(p);
    vec2 inset = vec2(0.4, 0.5) - 0.032;
    float lx = step(abs(ap.x - inset.x), 0.0022) * step(inset.y - 0.06, ap.y) * step(ap.y, inset.y + 0.0022);
    float ly = step(abs(ap.y - inset.y), 0.0022) * step(inset.x - 0.06, ap.x) * step(ap.x, inset.x + 0.0022);
    col = mix(col, vec3(0.9, 1.0, 0.96), max(lx, ly) * 0.85);

    // ---- Border with two comets of light racing around it ----
    float ring = smoothstep(0.0055, 0.0, abs(d + 0.002));
    float ang = atan(p.y, p.x);
    float comet = pow(0.5 + 0.5 * cos(ang - uTime * 1.1), 28.0)
                + pow(0.5 + 0.5 * cos(ang - uTime * 1.1 + PI), 28.0);
    vec3 borderCol = mix(uMint, vec3(1.0), clamp(comet * 1.3, 0.0, 1.0)) * (0.75 + comet * 1.6 + uHover * 0.4);
    col = mix(col, borderCol, ring);

    // ---- Outer glow beyond the edge ----
    float glow = exp(-max(d, 0.0) * 34.0) * (1.0 - inside) * (0.32 + uHover * 0.35 + comet * 0.25);

    float a = max(inside, ring);
    vec3 outCol = mix(uMint, col, a);
    gl_FragColor = vec4(outCol, (a + glow * (1.0 - a)) * uAlpha);
  }
`;

function roundedRectPoints(w: number, h: number, r: number) {
  const x = w / 2;
  const y = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.quadraticCurveTo(x, -y, x, -y + r);
  shape.lineTo(x, y - r);
  shape.quadraticCurveTo(x, y, x - r, y);
  shape.lineTo(-x + r, y);
  shape.quadraticCurveTo(-x, y, -x, y - r);
  shape.lineTo(-x, -y + r);
  shape.quadraticCurveTo(-x, -y, -x + r, -y);
  return shape.getPoints(12);
}


const easeIn = (x: number) => x * x * x;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export default function InroadsScene({ slides, index, showCards }: InroadsSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const showRef = useRef(showCards);
  const rippleRef = useRef(false);

  useEffect(() => {
    if (indexRef.current !== index) rippleRef.current = true;
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    showRef.current = showCards;
    rippleRef.current = true;
  }, [showCards]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
    camera.position.set(0, 0, CAMERA_Z);

    // ---- Dotted landscape ------------------------------------------------------------
    const fieldPos = new Float32Array(FIELD_X * FIELD_Z * 3);
    for (let ix = 0; ix < FIELD_X; ix++) {
      for (let iz = 0; iz < FIELD_Z; iz++) {
        const i = (ix * FIELD_Z + iz) * 3;
        fieldPos[i] = (ix / (FIELD_X - 1) - 0.5) * FIELD_W;
        fieldPos[i + 1] = FIELD_Y;
        fieldPos[i + 2] = 6 - (iz / (FIELD_Z - 1)) * FIELD_D;
      }
    }
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldPos, 3));
    const fieldMat = new THREE.ShaderMaterial({
      vertexShader: fieldVertex,
      fragmentShader: fieldFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uRipples: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector4()) },
        uCursor: { value: new THREE.Vector3() },
        uMint: { value: MINT },
      },
    });
    scene.add(new THREE.Points(fieldGeo, fieldMat));

    // Ripple slots, oldest reused first.
    const ripples = Array.from({ length: RIPPLES }, () => ({ x: 0, z: 0, start: -99, strength: 0 }));
    let rippleSlot = 0;
    const addRipple = (x: number, z: number, strength: number) => {
      ripples[rippleSlot] = { x, z, start: clock.elapsedTime, strength };
      rippleSlot = (rippleSlot + 1) % RIPPLES;
    };

    // ---- Stage: up to two founder cards that flip together --------------------------
    const loader = new THREE.TextureLoader();
    const textures = slides.map((photos) =>
      photos.map((src) => {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return tex;
      }),
    );

    const stage = new THREE.Group();
    scene.add(stage);
    const cardGeo = new THREE.PlaneGeometry(CARD_W * CARD_PAD_X, CARD_H * CARD_PAD_Y);
    const cards = [0, 1].map(() => {
      const material = new THREE.ShaderMaterial({
        vertexShader: cardVertex,
        fragmentShader: cardFragment,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTex: { value: null },
          uAlpha: { value: 0 },
          uTime: { value: 0 },
          uMint: { value: MINT },
          uGlare: { value: new THREE.Vector2(0.5, 0.5) },
          uHover: { value: 0 },
          uTilt: { value: new THREE.Vector2() },
        },
      });
      const mesh = new THREE.Mesh(cardGeo, material);
      mesh.renderOrder = 10;
      stage.add(mesh);
      return { mesh, material, hover: 0 };
    });


    // ---- Click bursts ------------------------------------------------------------------
    const BURST_MAX = 720;
    const bPos = new Float32Array(BURST_MAX * 3);
    const bVel = new Float32Array(BURST_MAX * 3);
    const bLife = new Float32Array(BURST_MAX);
    let bNext = 0;
    const burstGeo = new THREE.BufferGeometry();
    burstGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
    burstGeo.setAttribute("aLife", new THREE.BufferAttribute(bLife, 1));
    const burstMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uMint: { value: MINT } },
      vertexShader: /* glsl */ `
        attribute float aLife;
        varying float vLife;
        void main() {
          vLife = aLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.0 + aLife * 5.0) * (10.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uMint;
        varying float vLife;
        void main() {
          float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(mix(uMint, vec3(1.0), vLife * 0.6), a * vLife);
        }
      `,
    });
    scene.add(new THREE.Points(burstGeo, burstMat));

    const spawnBurst = (at: { x: number; y: number; z: number }) => {
      for (let n = 0; n < 90; n++) {
        const i = bNext;
        bNext = (bNext + 1) % BURST_MAX;
        const u = Math.random() * 2 - 1;
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(1 - u * u);
        const speed = 1.5 + Math.random() * 3.5;
        bPos.set([at.x, at.y, at.z], i * 3);
        bVel.set([r * Math.cos(a) * speed, r * Math.sin(a) * speed, u * speed * 0.6], i * 3);
        bLife[i] = 1;
      }
    };

    const updateBursts = (dt: number) => {
      const drag = Math.exp(-dt * 2.4);
      for (let i = 0; i < BURST_MAX; i++) {
        if (bLife[i] <= 0) continue;
        bLife[i] = Math.max(0, bLife[i] - dt * 0.75);
        bVel[i * 3] *= drag;
        bVel[i * 3 + 1] = bVel[i * 3 + 1] * drag - dt * 0.6; // a little gravity
        bVel[i * 3 + 2] *= drag;
        bPos[i * 3] += bVel[i * 3] * dt;
        bPos[i * 3 + 1] += bVel[i * 3 + 1] * dt;
        bPos[i * 3 + 2] += bVel[i * 3 + 2] * dt;
      }
      burstGeo.attributes.position.needsUpdate = true;
      burstGeo.attributes.aLife.needsUpdate = true;
    };

    let slideCount = 0;
    const applySlide = (i: number) => {
      const texs = textures[i] ?? [];
      slideCount = texs.length;
      const pair = slideCount === 2;
      cards.forEach((c, k) => {
        c.mesh.visible = k < slideCount;
        if (k < slideCount) c.material.uniforms.uTex.value = texs[k];
        c.mesh.scale.setScalar(pair ? PAIR_SCALE : 1);
        c.mesh.position.x = pair ? (k === 0 ? -1 : 1) * ((CARD_W * PAIR_SCALE + PAIR_GAP) / 2) : 0;
      });
    };
    applySlide(indexRef.current);

    // ---- Layout -------------------------------------------------------------------
    const layout = { y: 0, scale: 1, portrait: false, visibleW: 1 };
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visibleH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      layout.portrait = w / h < 0.8;
      layout.visibleW = visibleH * camera.aspect;
      // Card centre sits a little below the middle so the giant name reads above it.
      layout.y = -((layout.portrait ? 0.36 : 0.56) - 0.5) * visibleH;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const stageScale = () => {
      const width = slideCount === 2 ? 2 * CARD_W * PAIR_SCALE + PAIR_GAP : CARD_W;
      if (layout.portrait) return Math.min(0.62, (layout.visibleW * 0.8) / width);
      return Math.min(0.92, (layout.visibleW * 0.42) / width);
    };

    // Raw pointer (y down), a smoothed copy for tilt, and when it last moved.
    const pointer = { x: 0, y: 0, lastMove: -10 };
    const smooth = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.lastMove = clock.elapsedTime;
    };
    window.addEventListener("pointermove", onPointer);

    // Project the pointer onto a plane in world space (for the floor and bursts).
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const burstPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5);
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -FIELD_Y);
    const project = (x: number, y: number, plane: typeof floorPlane) => {
      ndc.set(x, -y);
      raycaster.setFromCamera(ndc, camera);
      return raycaster.ray.intersectPlane(plane, hit) ? { x: hit.x, y: hit.y, z: hit.z } : null;
    };

    const onDown = (e: PointerEvent) => {
      // Leave buttons alone; a click anywhere else throws sparks and ripples the floor.
      if ((e.target as HTMLElement | null)?.closest("button, a")) return;
      if (reducedMotion) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const at = project(x, y, burstPlane);
      if (at) spawnBurst(at);
      const floor = project(x, y, floorPlane);
      addRipple(floor ? floor.x : (at?.x ?? 0), floor ? floor.z : -6, 0.8);
    };
    window.addEventListener("pointerdown", onDown);

    // ---- Loop ---------------------------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    let shownIndex = indexRef.current;
    let flipStart = -1;
    let visible = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const ease = 1 - Math.exp(-dt * 4);

      if (rippleRef.current) {
        if (!reducedMotion) addRipple(0, -2, 1);
        rippleRef.current = false;
      }
      smooth.x += (pointer.x - smooth.x) * ease;
      smooth.y += (pointer.y - smooth.y) * ease;
      // The cursor only counts as present while it's actually being moved.
      const cursorActive = t - pointer.lastMove < 4;
      // Reduced motion: the landscape and sparks hold still.
      if (!reducedMotion) updateBursts(dt);

      fieldMat.uniforms.uTime.value = reducedMotion ? 0 : t;
      ripples.forEach((r, i) => {
        const age = t - r.start;
        fieldMat.uniforms.uRipples.value[i].set(r.x, r.z, age, age < 7 && !reducedMotion ? r.strength : 0);
      });
      const floorHit = cursorActive && !reducedMotion ? project(pointer.x, pointer.y, floorPlane) : null;
      const cursorU = fieldMat.uniforms.uCursor.value;
      if (floorHit && floorHit.z < 4) cursorU.set(floorHit.x, floorHit.z, Math.min(1, cursorU.z + dt * 3));
      else cursorU.z = Math.max(0, cursorU.z - dt * 2);

      // Flip: turn away, swap photos (and solo/pair layout) edge-on, turn back.
      const target = indexRef.current;
      if (target !== shownIndex && flipStart < 0) {
        if (reducedMotion || visible < 0.05) {
          shownIndex = target;
          applySlide(target);
        } else {
          flipStart = t;
        }
      }
      let flipAngle = 0;
      if (flipStart >= 0) {
        const p = Math.min((t - flipStart) / (FLIP_MS / 1000), 1);
        if (p < FLIP_TURN) {
          flipAngle = easeIn(p / FLIP_TURN) * (Math.PI / 2);
        } else {
          if (shownIndex !== indexRef.current) {
            shownIndex = indexRef.current;
            applySlide(shownIndex);
          }
          flipAngle = -(1 - easeOut((p - FLIP_TURN) / (1 - FLIP_TURN))) * (Math.PI / 2);
        }
        if (p >= 1) flipStart = -1;
      }

      visible += ((showRef.current ? 1 : 0) - visible) * ease;
      const motion = reducedMotion ? 0 : 1;
      // Gentle float: bob and sway so a held slide never sits dead still.
      const bob = (Math.sin(t * 0.8) * 0.14 + Math.sin(t * 1.9) * 0.03) * motion;
      stage.position.y += (layout.y + bob - (1 - visible) * 0.6 - stage.position.y) * ease;
      stage.rotation.z = Math.sin(t * 0.55) * 0.025 * motion;
      const s = stageScale();
      stage.scale.setScalar(s * (0.85 + 0.15 * visible));

      // Hover: which card is under the cursor?
      ndc.set(pointer.x, -pointer.y);
      raycaster.setFromCamera(ndc, camera);
      const hovered = cursorActive && visible > 0.5 ? raycaster.intersectObjects(cards.filter((c) => c.mesh.visible).map((c) => c.mesh))[0]?.object : null;

      cards.forEach((c, k) => {
        c.hover += ((c.mesh === hovered ? 1 : 0) - c.hover) * ease * 1.5;
        // Co-founder cards flip a beat apart so the pair doesn't move as one slab.
        const lag = k === 1 && flipStart >= 0 ? 0.12 : 0;
        const tilt = 0.18 + c.hover * 0.14;
        c.mesh.rotation.y = flipAngle * (1 - lag) + smooth.x * tilt + Math.sin(t * 0.6 + k) * 0.03 * motion;
        c.mesh.rotation.x = smooth.y * tilt * 0.7;
        c.mesh.position.z = c.hover * 0.35;
        c.material.uniforms.uAlpha.value = visible;
        c.material.uniforms.uTime.value = t + k * 1.3;
        c.material.uniforms.uHover.value = c.hover;
        c.material.uniforms.uGlare.value.set(0.5 + smooth.x * 0.6, 0.5 - smooth.y * 0.6);
        c.material.uniforms.uTilt.value.set(smooth.x, smooth.y);
      });


      camera.position.x += (smooth.x * 0.45 - camera.position.x) * ease * 0.4;
      camera.position.y += (-smooth.y * 0.3 - camera.position.y) * ease * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onDown);
      textures.flat().forEach((tex: { dispose(): void }) => tex.dispose());
      scene.traverse((obj: Disposable3D) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [slides]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
