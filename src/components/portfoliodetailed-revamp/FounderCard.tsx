import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { Brand, Founder } from './types';
import { stripTodo, isPresent } from './utils';
import { Linkedin } from './icons';
import { FounderBio } from './FounderBio';
import { MediaImage } from './MediaImage';

export const FounderCard = ({
  founder,
  brand,
  layout,
  className = '',
}: {
  founder: Founder;
  brand: Brand;
  layout: 'row' | 'card';
  className?: string;
}) => {
  const cleanName = stripTodo(founder.name) || founder.name;
  const initials = cleanName
    .replace(/\[.*?\]/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const portrait = (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ${
        layout === 'row'
          ? 'h-44 w-44 mx-auto sm:mx-0 sm:h-36 sm:w-36'
          : 'aspect-4/5 w-full'
      }`}
      style={{
        background: founder.founder_profile_pic
          ? 'var(--color-msl-card)'
          : `linear-gradient(135deg, ${brand.primary}33, var(--color-msl-card))`,
      }}
    >
      {founder.founder_profile_pic ? (
        <MediaImage
          src={founder.founder_profile_pic}
          alt={founder.name}
          fill
          priority
          quality={92}
          className={
            layout === 'row'
              ? 'object-contain sm:object-cover'
              : 'object-cover'
          }
          sizes={layout === 'row' ? '(min-width: 1024px) 192px, 160px' : '(min-width: 1024px) 360px, (min-width: 768px) 33vw, 50vw'}
          brandTint={brand.primary}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-light tracking-[-0.03em]"
            style={{
              color: brand.accent,
              fontSize: layout === 'row' ? '52px' : '64px',
            }}
          >
            {initials || '?'}
          </span>
        </div>
      )}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-10"
        style={{ background: brand.primary }}
      />
    </div>
  );

  const hasSocial = Boolean(founder.linkedin || founder.email);
  const headerPad = hasSocial ? 'pr-24' : '';

  const bio = (
    <div className="min-w-0 flex-1 relative">
      {hasSocial && (
        <div className="absolute top-0 right-0 flex gap-1.5">
          {founder.linkedin && (
            <Link
              href={founder.linkedin}
              target="_blank"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/3 hover:bg-white/[0.07] transition-colors"
              style={{ color: brand.accent }}
            >
              <Linkedin className="h-3.5 w-3.5" />
            </Link>
          )}
          {founder.email && (
            <Link
              href={`mailto:${founder.email}`}
              aria-label="Email"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/3 hover:bg-white/[0.07] transition-colors"
              style={{ color: brand.accent }}
            >
              <Mail className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      <div
        className={`font-mono text-[10px] font-semibold tracking-[0.22em] uppercase mb-2 ${headerPad}`}
        style={{ color: brand.accent }}
      >
        {founder.designation}
      </div>
      <h3 className={`font-display font-normal leading-tight tracking-[-0.02em] text-white text-[22px] md:text-[24px] ${headerPad}`}>
        {founder.name}
      </h3>
      {isPresent(stripTodo(founder.description)) && (
        <FounderBio
          description={stripTodo(founder.description) as string}
          brand={brand}
        />
      )}
    </div>
  );

  return (
    <div
      className={`rounded-2xl border border-white/[0.07] p-4 sm:p-5 ${
        layout === 'row'
          ? 'flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5'
          : 'flex flex-col gap-5'
      } ${className}`}
      style={{ background: 'var(--color-msl-card)' }}
    >
      {portrait}
      {bio}
    </div>
  );
};
