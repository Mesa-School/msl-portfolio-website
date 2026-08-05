'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export type PortfolioView = 'portfolio' | 'demo-day';

const VIEWS: { id: PortfolioView; label: string; href: string }[] = [
  { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
  { id: 'demo-day', label: 'Demo Day', href: '/demo-day' },
];

/**
 * Resolves the active view from the pathname. Returns null on every other
 * route so the switch only appears on the two listings it moves between —
 * not on startup detail pages or the investor portal.
 */
export function viewForPathname(pathname?: string | null): PortfolioView | null {
  if (pathname === '/portfolio') return 'portfolio';
  if (pathname === '/demo-day') return 'demo-day';
  return null;
}

type ViewToggleProps = {
  active: PortfolioView;
};

/**
 * Portfolio ⇄ Demo Day switch. Lives in the navbar, so it stays on the Mesa
 * logo line and remains reachable while scrolling.
 *
 * Physical treatment: the track is a recessed groove (inset shadow + lower
 * bevel), the thumb a glossy raised cap (vertical gradient, specular highlight
 * across the top half, drop shadow for lift).
 */
export const ViewToggle = ({ active }: ViewToggleProps) => {
  return (
    <nav
      aria-label="Switch between the full portfolio and Demo Day"
      className="relative inline-flex items-center rounded-full border border-white/8 p-1 backdrop-blur-md"
      style={{
        background:
          'linear-gradient(180deg, rgba(3,5,8,0.94) 0%, rgba(22,27,35,0.94) 100%)',
        boxShadow:
          'inset 0 3px 9px rgba(0,0,0,1), inset 0 1px 2px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,255,255,0.12), 0 1px 1px rgba(255,255,255,0.07)',
      }}
    >
      {VIEWS.map((view) => {
        const isActive = active === view.id;
        return (
          <Link
            key={view.id}
            href={view.href}
            aria-current={isActive ? 'page' : undefined}
            className="relative rounded-full px-3.5 py-1.5 text-[12px] font-bold sm:px-4 sm:text-[13px] whitespace-nowrap"
          >
            {isActive && (
              <motion.span
                layoutId="view-toggle-thumb"
                className="absolute inset-0 overflow-hidden rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f2f5f9 47%, #d2dae5 53%, #b3bece 100%)',
                  boxShadow:
                    '0 7px 18px rgba(0,0,0,0.72), 0 2px 5px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -2px 2px rgba(0,0,0,0.2)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              >
                {/* Specular sheen across the upper half of the cap. */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-linear-to-b from-white via-white/85 to-white/30" />
              </motion.span>
            )}
            <span
              className={`relative z-10 transition-colors ${
                isActive
                  ? 'text-[#0a0f14] [text-shadow:0_1px_0_rgba(255,255,255,0.65)]'
                  : 'text-white/50 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)] hover:text-white/85'
              }`}
            >
              {view.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
