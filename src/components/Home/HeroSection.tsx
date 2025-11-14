"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  return (
    <section className="relative  flex min-h-screen items-center justify-center overflow-hidden text-white">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="heading-font text-sm uppercase tracking-[0.4em] text-purple-300 md:text-base">
          Founder-First Platform
        </p>
        <h1 className="heading-font mt-6 text-3xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
          Where India’s best founders build conviction.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
          Founder-first. India-first. Future-focused. We back bold ideas with capital,
          community, and conviction to scale the next generation of category-defining
          companies.
        </p>
        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#contact"
            className="heading-font inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 via-purple-400 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]"
          >
            Join MSL
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;