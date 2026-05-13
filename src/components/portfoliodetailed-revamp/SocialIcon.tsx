import Link from 'next/link';
import type { Brand } from './types';

export const SocialIcon = ({
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
    className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/25 bg-black/40 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:bg-black/60 hover:border-white/40 transition-all"
    style={{ color: brand.accent }}
  >
    {children}
  </Link>
);
