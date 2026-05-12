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
    className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/2 hover:bg-white/6 transition-all"
    style={{ color: brand.accent }}
  >
    {children}
  </Link>
);
