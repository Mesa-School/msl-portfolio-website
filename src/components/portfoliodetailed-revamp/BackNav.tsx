import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const BackNav = () => (
  <Link
    href="/portfolio"
    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/3 hover:bg-white/8 hover:border-white/25 transition-colors font-mono text-[10px] tracking-[0.22em] uppercase text-white/70 hover:text-white"
  >
    <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
    Back to all startups
  </Link>
);
