"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface InroadsSceneProps {
  /** Photo URLs per slide: one for a solo founder, two for co-founders. */
  slides: string[][];
  /** Slide on stage. Changing it flips the cards and surges the tunnel. */
  index: number;
  /** Hide the cards during the intro and finale; the tunnel keeps running. */
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
const PAIR_GAP = 0.3;

// Tunnel of rounded squares, echoing the frame around the "m" in the MSL mark.
const LOOPS = 26;
const SPACING = 3.2;
const TUNNEL_LEN = LOOPS * SPACING;
const CAMERA_Z = 10;

const FLIP_MS = 1100;
const FLIP_TURN = 0.42; // fraction of the flip spent turning away before the swap

const cardVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cardFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uAlpha;
  uniform float uTime;
  uniform vec3 uMint;
  varying vec2 vUv;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(0.8, 1.0);
    float d = sdRoundBox(p, vec2(0.4, 0.5), 0.06);
    float inside = 1.0 - smoothstep(-0.0015, 0.0015, d);

    // Founders are background-removed cutouts: sit them on a deep-green panel
    // that lifts toward mint at the bottom, like stage light from below.
    vec4 tex = texture2D(uTex, vUv);
    vec3 panel = mix(vec3(0.016, 0.1, 0.075), vec3(0.06, 0.42, 0.3), smoothstep(0.95, 0.0, vUv.y));
    panel += uMint * 0.18 * smoothstep(0.55, 0.0, length((vUv - vec2(0.5, 0.62)) * vec2(1.0, 0.8)));
    vec3 col = mix(panel, tex.rgb, tex.a);

    // Inner mint keyline, same weight relationship as the logo frame.
    float line = smoothstep(0.004, 0.0, abs(d + 0.012));
    col = mix(col, uMint, line);

    // Slow light sweep so a held slide still feels alive.
    float sweep = vUv.x * 0.6 + vUv.y - mod(uTime * 0.25, 3.5) + 1.0;
    col += smoothstep(0.1, 0.0, abs(sweep)) * 0.08;

    gl_FragColor = vec4(col, inside * uAlpha);
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

const roundedSquarePoints = (size: number, r: number) => roundedRectPoints(size, size, r);

const easeIn = (x: number) => x * x * x;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export default function InroadsScene({ slides, index, showCards }: InroadsSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const showRef = useRef(showCards);
  const surgeRef = useRef(0);

  useEffect(() => {
    if (indexRef.current !== index) surgeRef.current = 0.8;
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    showRef.current = showCards;
    surgeRef.current = 1;
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

    // ---- Tunnel ----------------------------------------------------------------
    const loopGeo = new THREE.BufferGeometry().setFromPoints(roundedSquarePoints(11, 1.3));
    const loops = Array.from({ length: LOOPS }, (_, i) => {
      const material = new THREE.LineBasicMaterial({
        color: i % 6 === 0 ? 0xffffff : MINT,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.LineLoop(loopGeo, material);
      scene.add(line);
      return { line, material, offset: i * SPACING };
    });

    // ---- Dust --------------------------------------------------------------------
    const DUST = 900;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 7;
      dustPos.set([Math.cos(a) * r, Math.sin(a) * r, -Math.random() * TUNNEL_LEN + CAMERA_Z], i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: MINT, size: 0.045, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    scene.add(dust);

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
    const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
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
        },
      });
      const mesh = new THREE.Mesh(cardGeo, material);
      stage.add(mesh);
      return { mesh, material };
    });

    // Offset outline behind the photos: the logo's frame, lagging on parallax.
    const echoMat = new THREE.LineBasicMaterial({ color: MINT, transparent: true, opacity: 0 });
    const echoGeos = [1, 2].map((n) => {
      const w = n === 1 ? CARD_W : 2 * CARD_W * PAIR_SCALE + PAIR_GAP;
      const h = n === 1 ? CARD_H : CARD_H * PAIR_SCALE;
      return new THREE.BufferGeometry().setFromPoints(roundedRectPoints(w + 0.45, h + 0.45, 0.28));
    });
    const echo = new THREE.LineLoop(echoGeos[0], echoMat);
    stage.add(echo);

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
      echo.geometry = echoGeos[pair ? 1 : 0];
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

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    // ---- Loop ---------------------------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    let travel = 0;
    let surge = reducedMotion ? 0 : 2.5; // opening fly-through
    let shownIndex = indexRef.current;
    let flipStart = -1;
    let visible = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const ease = 1 - Math.exp(-dt * 4);

      if (surgeRef.current) {
        if (!reducedMotion) surge = Math.max(surge, surgeRef.current);
        surgeRef.current = 0;
      }
      surge *= Math.exp(-dt * 1.8);
      travel += dt * (reducedMotion ? 0.4 : 1.1 + surge * 14);

      const far = CAMERA_Z - 1 - TUNNEL_LEN;
      loops.forEach(({ line, material, offset }) => {
        // Loops travel toward the camera and wrap back to the far end.
        const z = far + ((offset + travel) % TUNNEL_LEN);
        line.position.z = z;
        line.rotation.z = z * 0.035 + t * 0.03;
        const nearFade = 1 - THREE.MathUtils.smoothstep(z, CAMERA_Z - 6, CAMERA_Z - 1.5);
        const farFade = THREE.MathUtils.smoothstep(z, far, far + 30);
        material.opacity = nearFade * farFade * (0.28 + surge * 0.25);
      });
      dust.position.z = (travel * 0.6) % 20;

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
      stage.position.y += (layout.y + Math.sin(t * 0.7) * 0.05 - (1 - visible) * 0.6 - stage.position.y) * ease;
      const s = stageScale();
      stage.scale.setScalar(s * (0.85 + 0.15 * visible));

      cards.forEach((c, k) => {
        // Co-founder cards flip a beat apart so the pair doesn't move as one slab.
        const lag = k === 1 && flipStart >= 0 ? 0.12 : 0;
        c.mesh.rotation.y = flipAngle * (1 - lag) + pointer.x * 0.12;
        c.mesh.rotation.x = pointer.y * 0.08;
        c.material.uniforms.uAlpha.value = visible;
        c.material.uniforms.uTime.value = t + k * 1.3;
      });
      echoMat.opacity = visible * 0.8 * (flipStart >= 0 ? 0.3 : 1);
      echo.position.set(0.12 - pointer.x * 0.1, -0.12 + pointer.y * 0.08, -0.6);
      echo.rotation.y = pointer.x * 0.18;
      echo.rotation.x = pointer.y * 0.12;

      camera.position.x += (pointer.x * 0.35 - camera.position.x) * ease * 0.4;
      camera.position.y += (-pointer.y * 0.25 - camera.position.y) * ease * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      textures.flat().forEach((tex: { dispose(): void }) => tex.dispose());
      echoGeos.forEach((g: { dispose(): void }) => g.dispose());
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
