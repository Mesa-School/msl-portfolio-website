import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const BackNav = () => (
  <Link
    href="/portfolio"
    className="group inline-flex items-center gap-2.5 text-[13px] sm:text-sm text-white/65 hover:text-white transition-colors"
  >
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/18 transition-colors">
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
    </span>
    <span className="underline underline-offset-4 decoration-1 decoration-white/30 group-hover:decoration-white/60 transition-colors">
      Back to startups
    </span>
  </Link>
);
