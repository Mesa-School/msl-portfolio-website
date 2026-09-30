"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { animate, createScope, splitText, stagger, utils } from "animejs";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import { C4_FOUNDERS, C4_INROADS, type InroadsStartup } from "@/data/c4Inroads";
import LightRays from "@/components/animated/LightRays";

const InroadsScene = dynamic(() => import("./InroadsScene"), { ssr: false });

const INTRO_MS = 5500;
const SLIDE_MS = 8000;
const FINALE_MS = 10000;

type Phase = "intro" | "show" | "finale";

const COUNT = C4_INROADS.length;
const wrapIndex = (i: number) => ((i % COUNT) + COUNT) % COUNT;
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

/**
 * Size the giant startup name so it fills the stage without clipping.
 * Desktop keeps it on one line; mobile wraps by word, so size by the longest word.
 */
function nameSize(name: string): CSSProperties {
  const longest = Math.max(...name.split(" ").map((w) => w.length));
  const desktop = Math.min(13.5, 122 / name.length);
  const mobile = Math.min(name.includes(" ") ? 10.5 : 14, 84 / longest);
  return { "--fs-d": `min(${desktop.toFixed(2)}vw, 20vh)`, "--fs-m": `${mobile.toFixed(2)}vw` } as CSSProperties;
}

/** "Karan Menon and Aryan Wadhwa" / "Ishaan Panchal" */
const founderNames = (s: InroadsStartup) => s.founders.map((f) => f.name).join(" and ");
/** "Co-founders" for a team, otherwise the solo founder's role. */
const founderRole = (s: InroadsStartup) => (s.founders.length > 1 ? `${s.founders[0].role}s` : s.founders[0].role);

export default function InroadsShow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = useMemo(() => C4_INROADS.map((s) => s.founders.map((f) => f.photo)), []);

  const next = useCallback(() => {
    if (phase === "intro") return setPhase("show");
    if (phase === "finale") {
      setIndex(0);
      return setPhase("intro");
    }
    if (index === COUNT - 1) return setPhase("finale");
    setIndex((i) => i + 1);
  }, [phase, index]);

  const prev = useCallback(() => {
    if (phase !== "show") return setPhase("show");
    setIndex((i) => wrapIndex(i - 1));
  }, [phase]);

  const goTo = (i: number) => {
    setPhase("show");
    setIndex(i);
  };

  useEffect(() => {
    if (paused) return;
    const ms = phase === "intro" ? INTRO_MS : phase === "finale" ? FINALE_MS : SLIDE_MS;
    const id = window.setTimeout(next, ms);
    return () => window.clearTimeout(id);
  }, [phase, index, paused, next]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = C4_INROADS[index];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#051510] text-white select-none">
      {/* Floor glow: the only gradient on the page, pooled under the stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_62%,rgba(34,200,145,0.2),transparent_70%)]"
      />

      {/* Mint light pouring down onto the stage; leans toward the cursor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#22C891"
          raysSpeed={1.2}
          lightSpread={1.1}
          rayLength={1.8}
          fadeDistance={1.1}
          followMouse
          mouseInfluence={0.12}
          noiseAmount={0.08}
          distortion={0.05}
        />
      </div>

      <InroadsScene slides={slides} index={index} showCards={phase === "show"} />

      {/* Giant startup name above the stage on desktop */}
      {phase === "show" && <StartupName key={current.startup} name={current.startup} />}

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-8">
        <Image src="/msl-mesa-logo.png" alt="Mesa Startup Lab" width={405} height={148} priority className="h-10 w-auto sm:h-12" />
        <p className="text-right text-xs leading-snug text-[#A8DCC6] sm:text-sm">
          MSL C4 Inroads, September
          {phase === "show" && (
            <span className="block font-semibold text-[#22C891] tabular-nums">
              {index + 1} of {COUNT}
            </span>
          )}
        </p>
      </header>

      {phase === "intro" && <Intro key="intro" />}
      {phase === "finale" && <Finale key="finale" onPick={goTo} />}
      {phase === "show" && <StartupDetails key={index} index={index} />}

      <p className="sr-only" aria-live="polite">
        {phase === "show" && `${index + 1} of ${COUNT}: ${current.startup}, by ${founderNames(current)}`}
      </p>

      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-end gap-4 px-5 pb-5 sm:px-10 sm:pb-8">
        <div className="flex shrink-0 items-center gap-1.5">
          <ControlButton label="Previous startup" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </ControlButton>
          <ControlButton label={paused ? "Play" : "Pause"} onClick={() => setPaused((p) => !p)}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </ControlButton>
          <ControlButton label="Next startup" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </ControlButton>
          <ControlButton label="Full screen" onClick={toggleFullscreen} className="hidden sm:inline-flex">
            <Maximize2 className="h-4 w-4" />
          </ControlButton>
        </div>
      </footer>

    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs an anime.js choreography once when the component mounts, scoped to its root
 * element, and reverts it (animations and any split text) on unmount. Layout effect,
 * so hidden start states apply before first paint instead of flashing.
 */
function useAnime(build: (root: HTMLElement, keep: (s: { revert(): unknown }) => void) => void) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const splits: { revert(): unknown }[] = [];
    const scope = createScope({ root: el }).add(() => build(el, (s) => splits.push(s)));
    return () => {
      scope.revert();
      splits.forEach((s) => s.revert());
    };
    // Each animated block is keyed, so it remounts (and re-runs) per slide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return root;
}

/** Split into characters, hide them below a clip mask, then rise them in on a stagger. */
function riseChars(target: HTMLElement, keep: (s: { revert(): unknown }) => void, start = 0) {
  const split = splitText(target, { words: true, chars: { wrap: "clip" } });
  keep(split);
  utils.set(split.chars, { y: "110%" });
  animate(split.chars, {
    y: "0%",
    rotate: { from: 7, to: 0 },
    duration: 950,
    ease: "outExpo",
    delay: stagger(26, { start }),
  });
}

/** Fade-and-lift every [data-reveal] element in order. */
function revealItems(start: number, gap = 110) {
  utils.set("[data-reveal]", { opacity: 0, y: 18 });
  animate("[data-reveal]", { opacity: 1, y: 0, duration: 850, ease: "out(3)", delay: stagger(gap, { start }) });
}

function StartupName({ name }: { name: string }) {
  const root = useAnime((el, keep) => {
    const h = el.querySelector<HTMLElement>("h1");
    if (h) riseChars(h, keep, 150);
  });
  return (
    <div ref={root} className="pointer-events-none absolute inset-x-0 top-[9vh] z-6 hidden px-[3vw] md:block">
      <h1
        style={nameSize(name)}
        className="text-center text-(length:--fs-d) leading-[0.95] font-extrabold tracking-[-0.045em] whitespace-nowrap"
      >
        {name}
      </h1>
    </div>
  );
}

function StartupDetails({ index }: { index: number }) {
  const s = C4_INROADS[index];
  const pair = s.founders.length > 1;
  const root = useAnime((el, keep) => {
    const mobileName = el.querySelector<HTMLElement>("[data-name]");
    if (mobileName && mobileName.offsetParent) riseChars(mobileName, keep, 150);
    revealItems(450);
  });
  return (
    <section ref={root} className="pointer-events-none absolute inset-0 z-10">
      {/* Mobile: name + details flow below the photos */}
      <div className="absolute inset-x-0 top-[56vh] px-5 md:hidden">
        <h1 data-name style={nameSize(s.startup)} className="text-(length:--fs-m) leading-[1.02] font-extrabold tracking-[-0.04em]">
          {s.startup}
        </h1>
        <p data-reveal className="mt-3 text-[15px] leading-relaxed text-white/90">
          {s.description}
        </p>
        <p data-reveal className="mt-3 text-sm">
          <span className="font-semibold">{founderNames(s)}</span>
          <span className="text-[#A8DCC6]">, {founderRole(s).toLowerCase()}</span>
        </p>
      </div>

      {/* Desktop: founders bottom-left, description bottom-right, flanking the photos */}
      <div className={`absolute bottom-[13vh] left-10 hidden max-w-sm md:block lg:left-16 ${pair ? "w-[22vw]" : "w-[27vw]"}`}>
        <p data-reveal className="text-[clamp(1.5rem,2.3vw,2.3rem)] leading-tight font-semibold tracking-[-0.02em]">
          {s.founders.map((f, i) => (
            <span key={f.name} className="block">
              {i > 0 && <span className="text-[#A8DCC6]">and </span>}
              {f.name}
            </span>
          ))}
        </p>
        <p data-reveal className="mt-2 text-base text-[#A8DCC6]">
          {founderRole(s)}, {s.startupFull ?? s.startup}
        </p>
        <p
          data-reveal
          className="mt-5 inline-flex items-center rounded-full border border-[#22C891]/50 px-3.5 py-1 text-sm font-medium text-[#22C891]"
        >
          {s.sector}
        </p>
      </div>
      <p
        data-reveal
        className={`absolute right-10 bottom-[13vh] hidden max-w-sm text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed font-light text-white md:block lg:right-16 ${
          pair ? "w-[22vw]" : "w-[27vw]"
        }`}
      >
        {s.description}
      </p>
    </section>
  );
}

function Intro() {
  const root = useAnime((el, keep) => {
    const split = splitText(el.querySelector<HTMLElement>("h1")!, { words: true, chars: true });
    keep(split);
    // Letters flip up out of the floor, one after another.
    utils.set(split.chars, { opacity: 0, y: "60%", rotateX: -90 });
    animate(split.chars, {
      opacity: 1,
      y: "0%",
      rotateX: 0,
      duration: 1100,
      ease: "outExpo",
      delay: stagger(55, { start: 450 }),
    });
    revealItems(1500);
  });
  return (
    <section ref={root} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
      <p
        data-reveal
        className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#22C891]/30 bg-[#051510]/60 px-4 py-1.5 text-[11px] font-medium tracking-[0.22em] text-[#A8DCC6] uppercase backdrop-blur-md sm:text-xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3EE6AC]/70" />
          <span className="relative h-2 w-2 rounded-full bg-[#3EE6AC]" />
        </span>
        Mesa Startup Lab · Cohort 04
      </p>

      <div className="relative">
        <h1 className="intro-title text-[clamp(2.2rem,6vw,6.5rem)] leading-[1.05] font-semibold tracking-[-0.035em] perspective-midrange">
          Welcome to <span className="accent block">MSL C4 Inroads</span>
        </h1>
        {/* A band of light sweeps across the letters; overlay blending keeps it off the dark background */}
        <span aria-hidden className="intro-shine pointer-events-none absolute inset-0" />
      </div>

      <div data-reveal className="mt-8 flex items-center gap-4 text-[#22C891]">
        <span className="h-px w-10 bg-linear-to-r from-transparent to-[#22C891]/70 sm:w-20" />
        <span className="text-xs font-semibold tracking-[0.4em] uppercase sm:text-sm">September 2026</span>
        <span className="h-px w-10 bg-linear-to-l from-transparent to-[#22C891]/70 sm:w-20" />
      </div>

      <p
        data-reveal
        className="mt-6 max-w-3xl rounded-2xl border border-[#22C891]/35 bg-[#22C891]/10 px-6 py-3.5 text-lg leading-snug text-balance font-medium text-white shadow-[0_0_40px_rgba(34,200,145,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:text-2xl"
      >
        <span className="font-semibold text-[#3EE6AC]">{NUMBER_WORDS[COUNT] ?? COUNT} startups</span> from PG C4 are into{" "}
        <span className="font-semibold text-[#3EE6AC]">Mesa Startup Lab</span>.
      </p>

      {/* A preview of the faces about to take the stage */}
      <div data-reveal className="mt-8 flex items-center gap-4">
        <ul className="flex">
          {C4_FOUNDERS.map((f, i) => (
            <li
              key={f.name}
              className="relative -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 border-[#051510] bg-linear-to-b from-[#0B3D2C] to-[#157a57] shadow-[0_0_0_1px_rgba(34,200,145,0.45)] first:ml-0 sm:h-12 sm:w-12"
              style={{ zIndex: C4_FOUNDERS.length - i }}
            >
              <Image src={f.photo} alt="" fill sizes="48px" className="object-cover object-top" />
            </li>
          ))}
        </ul>
        <span className="hidden text-left text-sm leading-tight text-[#A8DCC6] sm:block">
          <span className="block font-semibold text-white">{C4_FOUNDERS.length} founders</span>
          on stage next
        </span>
      </div>

      {/* Flat fill with a soft glow; solid colours stay safe with the split-letter animation */}
      <style>{`
        .intro-title {
          color: #eef9f4;
          text-shadow: 0 0 32px rgba(255, 255, 255, 0.18);
        }
        .intro-title .accent {
          color: #3ee6ac;
          text-shadow: 0 0 40px rgba(62, 230, 172, 0.4);
        }
        .intro-shine {
          background: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.95) 50%, transparent 58%);
          background-size: 260% 100%;
          background-position: 130% 0;
          mix-blend-mode: overlay;
          animation: intro-shine 3.2s ease-in-out 2.2s infinite;
        }
        @keyframes intro-shine {
          0% { background-position: 130% 0 }
          55%, 100% { background-position: -30% 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-shine { animation: none }
        }
      `}</style>
    </section>
  );
}

function Finale({ onPick }: { onPick: (i: number) => void }) {
  const root = useAnime((el, keep) => {
    riseChars(el.querySelector<HTMLElement>("h2")!, keep, 150);
    revealItems(700);
    // Founder tiles burst outward from the middle of the grid.
    utils.set("[data-tile]", { opacity: 0, scale: 0.6, y: 30 });
    animate("[data-tile]", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1000,
      ease: "outBack(1.4)",
      delay: stagger(80, { grid: [5, 2], from: "center", start: 900 }),
    });
  });
  return (
    <section ref={root} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-20 pb-24 text-center">
      <h2 className="text-[clamp(2.4rem,7vw,6.5rem)] leading-[1.05] font-extrabold tracking-[-0.045em]">Welcome to Inroads</h2>
      <p data-reveal className="mt-4 text-sm text-[#A8DCC6] sm:text-lg">
        Congratulations to every founder on the list.
      </p>
      <ul className="mt-8 grid w-full max-w-4xl grid-cols-5 gap-2 sm:mt-10 sm:gap-4">
        {C4_FOUNDERS.map((f) => (
          <li key={f.name} data-tile>
            <button
              type="button"
              onClick={() => onPick(C4_INROADS.findIndex((s) => s.startup === f.startup))}
              className="group w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22C891]"
            >
              <span className="relative block aspect-4/5 overflow-hidden rounded-[10px] border-[1.5px] border-[#22C891]/40 bg-linear-to-b from-[#060908] to-[#0B3D2C] transition-colors group-hover:border-[#22C891]">
                <Image src={f.photo} alt="" fill sizes="(min-width: 640px) 170px, 20vw" className="object-cover" />
              </span>
              <span className="mt-2 block truncate text-[10px] font-semibold sm:text-sm">{f.name}</span>
              <span className="block truncate text-[9px] text-[#A8DCC6] sm:text-xs">{f.startup}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ControlButton({
  label,
  onClick,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[11px] border-[1.5px] border-white/15 text-white/80 transition-colors hover:border-[#22C891] hover:text-[#22C891] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C891] ${className}`}
    >
      {children}
    </button>
  );
}
