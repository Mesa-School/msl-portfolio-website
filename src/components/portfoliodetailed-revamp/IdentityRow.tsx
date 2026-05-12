import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Brand, FounderVideo } from './types';
import { stripTodo } from './utils';

export const IdentityRow = ({
  tagline,
  twoLiner,
  startupWebsite,
  founderVideo,
  brand,
}: {
  tagline: string;
  twoLiner: string;
  startupWebsite: string;
  founderVideo: FounderVideo | null;
  brand: Brand;
}) => (
  <div className="mt-6">
    <div className="grid grid-cols-12 gap-6 items-center">
      <div className="col-span-12 lg:col-span-9">
        <h2 className="font-display font-light leading-[1.05] tracking-[-0.02em] text-[clamp(28px,4vw,48px)]">
          <span className="italic" style={{ color: brand.accent }}>
            &ldquo;
          </span>
          {stripTodo(tagline)}
          <span className="italic" style={{ color: brand.accent }}>
            &rdquo;
          </span>
        </h2>
      </div>

      <div className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col gap-2 lg:items-end">
        <Link
          href={startupWebsite || '#'}
          target="_blank"
          className="group inline-flex items-center justify-between gap-3 w-full lg:w-auto px-4 py-2.5 rounded-full transition-transform hover:scale-[1.02]"
          style={{
            background: brand.primary,
            color: brand.ink,
            opacity: startupWebsite ? 1 : 0.4,
            pointerEvents: startupWebsite ? 'auto' : 'none',
          }}
        >
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
            {startupWebsite ? 'Visit site' : 'Site soon'}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        {founderVideo?.url ? (
          <Link
            href={founderVideo.url}
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

    <p className="mt-4 text-sm md:text-[15px] leading-[1.6] text-white/75">
      {twoLiner}
    </p>
  </div>
);
