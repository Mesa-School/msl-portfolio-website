import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Manrope, IBM_Plex_Mono } from 'next/font/google';
import {
  ArrowUpRight,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Play,
  ChevronLeft,
} from 'lucide-react';

import fynData from '@/data/fyn.json';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const stripTodo = (text: string | undefined): string =>
  text ? text.replace(/^\[TODO:[^\]]*\]\s*/, '').trim() : '';

const TestPage = () => {
  const d = fynData;
  const brand = d.brand;

  const themeStyle = {
    '--brand-primary': brand.primary,
    '--brand-accent': brand.accent,
    '--brand-ink': brand.ink,
  } as React.CSSProperties;

  const pullQuote = d.product_excitement.split('. ')[0] + '.';
  const pullQuoteRest = d.product_excitement.split('. ').slice(1).join('. ');

  return (
    <div
      style={themeStyle}
      className={`${fraunces.variable} ${manrope.variable} ${mono.variable} relative min-h-screen bg-msl-page text-white overflow-x-hidden font-body`}
    >
      {/* Subtle brand-color atmosphere (kept restrained — doesn't override site bg) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: `radial-gradient(circle, ${brand.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute top-[40vh] -left-40 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-3xl"
          style={{ background: `radial-gradient(circle, ${brand.accent} 0%, transparent 70%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 pt-24 pb-12">
        {/* ── Back nav ── */}
        <Link
          href="/portfolio"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white inline-flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="h-3 w-3" />
          Mesa Portfolio Index
        </Link>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 1 · IDENTITY + BANNER + STATS (one viewport)
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-6">
          {/* Masthead */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/8">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55">
              Portfolio File · No. 003 · {d.cohort}
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
              <span>{d.sector.name}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{d.location}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span style={{ color: brand.accent }}>● Pilot live</span>
            </div>
          </div>

          {/* Banner (5:2) — slightly compressed below for stats fit */}
          <div className="relative mt-5 aspect-5/2 w-full overflow-hidden rounded-2xl">
            <Image
              src="/fyn/fyn_image.jpg"
              alt={`${d.startup_name} — header`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1152px"
            />
            {/* Bottom fade for blending */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-msl-page to-transparent" />

            {/* Overlaid identity bottom-left (saves vertical space) */}
            <div className="absolute left-5 bottom-5 md:left-7 md:bottom-7 flex items-end gap-4">
              <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-white/20 shrink-0">
                <Image
                  src={d.company_logo}
                  alt={d.startup_name}
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.22em] uppercase mb-1"
                  style={{ color: brand.accent }}
                >
                  Subject
                </div>
                <h1 className="font-display font-medium text-[28px] md:text-[36px] leading-none tracking-[-0.02em]">
                  {d.startup_name}
                </h1>
              </div>
            </div>
          </div>

          {/* Identity row (tagline + 2-liner + CTAs) — sits below banner, dense */}
          <div className="mt-6 grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display font-light leading-[0.98] tracking-[-0.025em] text-[clamp(36px,5vw,64px)]">
                <span className="italic" style={{ color: brand.accent }}>&ldquo;</span>
                {stripTodo(d.tagline)}
                <span className="italic" style={{ color: brand.accent }}>&rdquo;</span>
              </h2>
              <p className="mt-3 max-w-[640px] text-sm md:text-[15px] leading-[1.55] text-white/75">
                {d.two_liner}
              </p>
            </div>

            {/* CTAs */}
            <div className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col gap-2 lg:items-end">
              <Link
                href={d.startup_website || '#'}
                target="_blank"
                className="group inline-flex items-center justify-between gap-3 w-full lg:w-auto px-4 py-2.5 rounded-full transition-transform hover:scale-[1.02]"
                style={{
                  background: brand.primary,
                  color: brand.ink,
                  opacity: d.startup_website ? 1 : 0.4,
                  pointerEvents: d.startup_website ? 'auto' : 'none',
                }}
              >
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                  {d.startup_website ? 'Visit site' : 'Site soon'}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              {d.founder_video?.url ? (
                <Link
                  href={d.founder_video.url}
                  target="_blank"
                  className="inline-flex items-center justify-between gap-3 w-full lg:w-auto px-4 py-2.5 rounded-full border border-white/15 bg-white/3 hover:bg-white/[0.07] transition-colors"
                >
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/85">
                    Pitch · 90s
                  </span>
                  <Play className="h-3 w-3 fill-white" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Stats data sheet — 4 metrics in compact connected grid */}
          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-2xl overflow-hidden border border-white/[0.07]">
            {d.key_metrics.map((metric) => (
              <div
                key={metric.id}
                className="group relative p-5 transition-colors hover:bg-white/2"
                style={{ background: 'var(--color-msl-card)' }}
              >
                <div
                  className="font-mono text-[9px] tracking-[0.22em] uppercase mb-3"
                  style={{ color: brand.accent }}
                >
                  / {String(metric.id).padStart(2, '0')}
                </div>
                <div
                  className="font-display text-[40px] leading-[0.9] tracking-[-0.04em] font-light tabular-nums"
                  style={{ color: brand.ink }}
                >
                  {metric.value}
                </div>
                <div className="mt-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-white/65">
                  {metric.label}
                </div>
                <p className="mt-2 text-[11px] leading-normal text-white/55 line-clamp-2">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* Marquee — sits at end of zone 1 as a transition ribbon */}
          <div
            className="mt-6 relative overflow-hidden border-y py-3"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="flex gap-10 whitespace-nowrap font-mono text-[10px] tracking-[0.32em] uppercase"
              style={{ color: brand.accent, animation: 'marquee 40s linear infinite' }}
            >
              {[...Array(3)].flatMap((_, repeat) =>
                d.keywords.map((kw, i) => (
                  <span key={`${repeat}-${i}`} className="flex items-center gap-10">
                    <span>{kw}</span>
                    <span className="text-white/25">✦</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 2A · THE OPPORTUNITY — stats stacked LEFT, paragraph RIGHT
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-14">
          <SectionLabel number="01" eyebrow="Market" title="The opportunity" brand={brand} />

          <div className="mt-7 grid grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* LEFT — compact stacked stats */}
            <div className="col-span-12 lg:col-span-5 rounded-2xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
              {[
                {
                  ...d.sector_excitement.cagr,
                  blurb: 'Compounding annual growth · 5-yr forecast',
                },
                {
                  ...d.sector_excitement.india_market,
                  blurb: 'India functional foods & supplements TAM',
                },
                {
                  ...d.sector_excitement.global_market,
                  blurb: 'Worldwide wellness economy ceiling',
                },
              ].map((stat, i) => {
                const m = stat.value.match(/^(\D*)([\d.,]+)(.*)$/) || ['', '', stat.value, ''];
                const prefix = m[1];
                const main = m[2];
                const suffix = m[3];

                return (
                  <div
                    key={i}
                    className="group relative px-4 py-3 transition-colors"
                    style={{ background: 'var(--color-msl-card)' }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Index marker */}
                      <div className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-white/30 w-6 shrink-0">
                        /0{i + 1}
                      </div>

                      {/* Number */}
                      <div className="font-display font-light leading-none tracking-[-0.03em] text-[clamp(22px,2.4vw,28px)] tabular-nums shrink-0 min-w-[76px]">
                        {prefix && (
                          <span style={{ color: brand.accent }} className="opacity-90">
                            {prefix}
                          </span>
                        )}
                        <span className="text-white">{main}</span>
                        {suffix && (
                          <span style={{ color: brand.accent }} className="opacity-90">
                            {suffix}
                          </span>
                        )}
                      </div>

                      {/* Label + blurb */}
                      <div className="flex-1 min-w-0 pl-3 border-l border-white/10">
                        <div
                          className="font-mono text-[9.5px] tracking-[0.16em] uppercase leading-tight"
                          style={{ color: brand.accent }}
                        >
                          {stat.label}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-[1.4] text-white/55">
                          {stat.blurb}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — paragraph aligned to stats baseline */}
            <div className="col-span-12 lg:col-span-7 lg:pt-1">
              <p className="text-[14.5px] leading-[1.7] text-white/80 font-light">
                {d.sector_excitement.paragraph}
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 2B · BRIEF + EDGE (12-col split, with separator above)
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-9 pt-9 border-t border-white/[0.06] grid grid-cols-12 gap-6 lg:gap-10">
          {/* The brief w/ drop cap */}
          <div className="col-span-12 lg:col-span-7">
            <SectionLabel number="02" eyebrow="Premise" title="The brief" brand={brand} />
            <p className="editorial-dropcap mt-5 font-display font-light text-[17px] leading-[1.6] tracking-[-0.005em] text-white/85">
              {d.brief_description}
            </p>
          </div>

          {/* The edge pull quote */}
          <div className="col-span-12 lg:col-span-5">
            <SectionLabel number="03" eyebrow="Differentiation" title="The edge" brand={brand} />
            <figure className="mt-5 relative">
              <span
                className="absolute -top-4 -left-1 font-display text-[80px] leading-none opacity-25 select-none pointer-events-none"
                style={{ color: brand.accent }}
              >
                &ldquo;
              </span>
              <blockquote
                className="font-display font-normal text-[clamp(20px,2vw,26px)] leading-[1.25] tracking-[-0.015em] pl-7 lg:pl-10"
                style={{ color: brand.ink }}
              >
                {pullQuote}
              </blockquote>
              {pullQuoteRest && (
                <div className="mt-3 pl-7 lg:pl-10 text-[13px] leading-[1.6] text-white/65">
                  {pullQuoteRest}
                </div>
              )}
            </figure>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 2C · WHY NOW (compact full-width band)
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-9 pt-9 border-t border-white/[0.06] grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <SectionLabel number="04" eyebrow="Timing" title="Why now" brand={brand} />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[16px] leading-[1.7] font-light text-white/85">
              {stripTodo(d.why_now)}
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 2D · THE PITCH (Loom embed)
             ════════════════════════════════════════════════════════════════════ */}
        {/* ════════════════════════════════════════════════════════════════════
             ZONE 3 · PITCH + BUILDER(S) — merged side-by-side grid
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-9 pt-9 border-t border-white/[0.06]">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT — Pitch video */}
            {d.founder_video?.embed_url ? (
              <div className="col-span-12 lg:col-span-7">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <SectionLabel
                    number="05"
                    eyebrow="Pitch"
                    title="The 90-second pitch"
                    brand={brand}
                  />
                  <Link
                    href={d.founder_video.url}
                    target="_blank"
                    className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white pb-1.5 inline-flex items-center gap-2 shrink-0"
                  >
                    Loom <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div
                  className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.07]"
                  style={{ background: 'var(--color-msl-card)' }}
                >
                  <iframe
                    src={d.founder_video.embed_url}
                    title={d.founder_video.title}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            ) : null}

            {/* RIGHT — Builder(s) */}
            <div
              className={
                d.founder_video?.embed_url
                  ? 'col-span-12 lg:col-span-5'
                  : 'col-span-12'
              }
            >
              <SectionLabel
                number="06"
                eyebrow="People"
                title={d.founders.length > 1 ? 'The builders' : 'The builder'}
                brand={brand}
              />

              {/* 1 founder: portrait + bio in one row card.
                  2-3 founders: vertical stack of compact rows.
                  When no video: cards span wider (grid below). */}
              {!d.founder_video?.embed_url && d.founders.length > 1 ? (
                <div
                  className={`mt-5 grid gap-3 ${
                    d.founders.length === 2
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {d.founders.map((founder) => (
                    <FounderCard key={founder.id} founder={founder} brand={brand} layout="card" />
                  ))}
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {d.founders.map((founder) => (
                    <FounderCard
                      key={founder.id}
                      founder={founder}
                      brand={brand}
                      layout="row"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             ZONE 4 · FIELD NOTES (full-width horizontal scroll)
             ════════════════════════════════════════════════════════════════════ */}
        <section className="mt-9 pt-9 border-t border-white/[0.06]">
          <div className="flex items-end justify-between gap-4">
            <SectionLabel number="07" eyebrow="Archive" title="Field notes" brand={brand} />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 pb-1.5">
              6 frames →
            </span>
          </div>
          {/* Auto-scrolling carousel — uniform heights, pause on hover */}
          <div className="mt-5 relative overflow-hidden -mx-4 sm:-mx-8 lg:-mx-12 group">
            {/* Edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-r from-msl-page to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-l from-msl-page to-transparent" />

            <div
              className="flex gap-3 w-max"
              style={{ animation: 'carousel-scroll 50s linear infinite' }}
            >
              {[...Array(2)].flatMap((_, dup) =>
                [
                  { src: '/fyn/header.jpg', caption: 'FYNERGY launch creative' },
                  { src: '/fyn/Hero.webp', caption: 'Hydra · studio shot' },
                  { src: '/fyn/1771970664127.jpg', caption: 'Core team of 5' },
                  { src: '/fyn/3.webp', caption: 'Antioxidant powerhouse' },
                  { src: '/fyn/1766041668219.jpg', caption: 'Pitch at Mesa' },
                  { src: '/fyn/1769460530070.jpg', caption: 'GTM in the wild' },
                ].map((shot, i) => (
                  <div
                    key={`${dup}-${shot.src}`}
                    className="relative shrink-0 w-[300px] h-[200px] rounded-xl overflow-hidden group/card"
                  >
                    <Image
                      src={shot.src}
                      alt={shot.caption}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      sizes="300px"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
                      style={{
                        background:
                          'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 p-3 translate-y-1 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all">
                      <div
                        className="font-mono text-[8px] tracking-[0.18em] uppercase"
                        style={{ color: brand.accent }}
                      >
                        / {String((i % 6) + 1).padStart(3, '0')}
                      </div>
                      <div className="mt-0.5 font-display text-[12px] text-white">
                        {shot.caption}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
             FOOTER
             ════════════════════════════════════════════════════════════════════ */}
        <footer className="mt-12 pt-5 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 mb-2">
              Connect
            </div>
            <div className="flex gap-1.5">
              {d.social_media_links.instagram && (
                <SocialIcon href={d.social_media_links.instagram} brand={brand} label="Instagram">
                  <Instagram className="h-3.5 w-3.5" />
                </SocialIcon>
              )}
              {d.social_media_links.linkedin && (
                <SocialIcon href={d.social_media_links.linkedin} brand={brand} label="LinkedIn">
                  <Linkedin className="h-3.5 w-3.5" />
                </SocialIcon>
              )}
              {d.social_media_links.twitter && (
                <SocialIcon href={d.social_media_links.twitter} brand={brand} label="Twitter">
                  <Twitter className="h-3.5 w-3.5" />
                </SocialIcon>
              )}
            </div>
          </div>

          <div className="md:text-center">
            <div
              className="font-display text-[24px] leading-none tracking-[-0.02em]"
              style={{ color: brand.accent }}
            >
              ✦
            </div>
          </div>

          <div className="md:text-right font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 leading-relaxed">
            <div>
              Filed ·{' '}
              {new Date(d.published_at).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div>Mesa Startup Lab · {d.cohort}</div>
            <div>Doc/{d.slug}/v2</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TestPage;

// ─────────────────── helper components ───────────────────

type Brand = {
  primary: string;
  accent: string;
  ink: string;
};

const SectionLabel = ({
  number,
  eyebrow,
  title,
  brand,
  compact = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  brand: Brand;
  compact?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase tabular-nums">
      <span
        className="font-semibold"
        style={{ color: brand.accent }}
      >
        {number}
      </span>
      <span className="h-px w-5" style={{ background: brand.accent, opacity: 0.5 }} />
      <span style={{ color: brand.accent }}>{eyebrow}</span>
    </div>
    <h2
      className={`font-display leading-none tracking-[-0.025em] font-normal text-white ${
        compact ? 'text-[20px]' : 'text-[26px] md:text-[30px]'
      }`}
    >
      {title}
    </h2>
  </div>
);

const SocialPill = ({
  href,
  brand,
  icon,
  label,
}: {
  href: string;
  brand: Brand;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    target="_blank"
    className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all"
    style={{
      borderColor: 'rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.02)',
    }}
  >
    <span style={{ color: brand.accent }}>{icon}</span>
    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/85 group-hover:text-white">
      {label}
    </span>
  </Link>
);

const SocialIcon = ({
  href,
  brand,
  label,
  children,
}: {
  href: string;
  brand: Brand;
  label: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    target="_blank"
    aria-label={label}
    className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-all"
    style={{ color: brand.accent }}
  >
    {children}
  </Link>
);

type Founder = {
  id: number;
  name: string;
  designation: string;
  linkedin?: string;
  email?: string | null;
  founder_profile_pic?: string;
  description?: string;
};

const FounderCard = ({
  founder,
  brand,
  layout,
}: {
  founder: Founder;
  brand: Brand;
  layout: 'row' | 'card';
}) => {
  const portrait = (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ${
        layout === 'row' ? 'h-20 w-20' : 'aspect-[4/5] w-full'
      }`}
      style={{ background: 'var(--color-msl-card)' }}
    >
      {founder.founder_profile_pic && (
        <Image
          src={founder.founder_profile_pic}
          alt={founder.name}
          fill
          className="object-cover"
          sizes={layout === 'row' ? '80px' : '240px'}
        />
      )}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-10"
        style={{ background: brand.primary }}
      />
    </div>
  );

  const bio = (
    <div className="min-w-0 flex-1 relative">
      {/* Social pills — top right */}
      <div className="absolute top-0 right-0 flex gap-1.5">
        {founder.linkedin && (
          <Link
            href={founder.linkedin}
            target="_blank"
            aria-label="LinkedIn"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
            style={{ color: brand.accent }}
          >
            <Linkedin className="h-3 w-3" />
          </Link>
        )}
        {founder.email && (
          <Link
            href={`mailto:${founder.email}`}
            aria-label="Email"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
            style={{ color: brand.accent }}
          >
            <Mail className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div
        className="font-mono text-[9px] tracking-[0.22em] uppercase mb-1 pr-20"
        style={{ color: brand.accent }}
      >
        {founder.designation}
      </div>
      <h3 className="font-display font-normal leading-[1] tracking-[-0.02em] text-white text-[18px] pr-20">
        {founder.name}
      </h3>
      <p className="mt-2 font-display font-light text-[12.5px] leading-[1.5] tracking-[-0.005em] text-white/75 line-clamp-3">
        &ldquo;{stripTodo(founder.description)}&rdquo;
      </p>
    </div>
  );

  return (
    <div
      className={`rounded-2xl border border-white/[0.07] p-4 ${
        layout === 'row' ? 'flex items-start gap-4' : 'flex flex-col gap-4'
      }`}
      style={{ background: 'var(--color-msl-card)' }}
    >
      {portrait}
      {bio}
    </div>
  );
};
