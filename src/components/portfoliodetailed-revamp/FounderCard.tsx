import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { Brand, Founder } from './types';
import { stripTodo, isPresent } from './utils';
import { Linkedin } from './icons';

export const FounderCard = ({
  founder,
  brand,
  layout,
}: {
  founder: Founder;
  brand: Brand;
  layout: 'row' | 'card';
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
        layout === 'row' ? 'h-28 w-28' : 'aspect-4/5 w-full'
      }`}
      style={{
        background: founder.founder_profile_pic
          ? 'var(--color-msl-card)'
          : `linear-gradient(135deg, ${brand.primary}33, var(--color-msl-card))`,
      }}
    >
      {founder.founder_profile_pic ? (
        <Image
          src={founder.founder_profile_pic}
          alt={founder.name}
          fill
          className="object-cover"
          sizes={layout === 'row' ? '80px' : '240px'}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-light tracking-[-0.03em]"
            style={{
              color: brand.accent,
              fontSize: layout === 'row' ? '40px' : '56px',
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

  const bio = (
    <div className="min-w-0 flex-1 relative">
      <div className="absolute top-0 right-0 flex gap-1.5">
        {founder.linkedin && (
          <Link
            href={founder.linkedin}
            target="_blank"
            aria-label="LinkedIn"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/3 hover:bg-white/[0.07] transition-colors"
            style={{ color: brand.accent }}
          >
            <Linkedin className="h-3 w-3" />
          </Link>
        )}
        {founder.email && (
          <Link
            href={`mailto:${founder.email}`}
            aria-label="Email"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/3 hover:bg-white/[0.07] transition-colors"
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
      <h3 className="font-display font-normal leading-none tracking-[-0.02em] text-white text-[18px] pr-20">
        {founder.name}
      </h3>
      {isPresent(stripTodo(founder.description)) && (
        <p className="mt-2 font-display font-light text-[12.5px] leading-normal tracking-[-0.005em] text-white/75 line-clamp-3">
          &ldquo;{stripTodo(founder.description)}&rdquo;
        </p>
      )}
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
