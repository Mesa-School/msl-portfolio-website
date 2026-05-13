'use client';

import { useState } from 'react';
import type { Brand, GalleryImage } from './types';
import { SectionLabel } from './SectionLabel';

export const FieldNotes = ({
  images,
  startupName,
  brand,
}: {
  images: GalleryImage[];
  startupName: string;
  brand: Brand;
}) => {
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) return null;

  const validImages = images.filter((img) => !brokenIds.has(img.id));
  if (validImages.length === 0) return null;

  const markBroken = (id: number) =>
    setBrokenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <section className="mt-9 pt-9 border-t border-white/6">
      <div className="flex items-end justify-between gap-4">
        <SectionLabel number="06" eyebrow="Archive" title="Founder Gallery" brand={brand} />
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 pb-1.5">
          {validImages.length} frames →
        </span>
      </div>
      <div className="mt-5 relative overflow-hidden -mx-4 sm:-mx-8 lg:-mx-1 group">
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-r from-msl-page to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-linear-to-l from-msl-page to-transparent" />

        <div
          className="flex gap-3 w-max"
          style={{ animation: 'carousel-scroll 50s linear infinite' }}
        >
          {[...Array(2)].flatMap((_, dup) =>
            validImages.map((shot, i) => (
              <div
                key={`${dup}-${shot.url}-${i}`}
                className="relative shrink-0 h-[200px] rounded-xl overflow-hidden group/card"
                style={{ background: 'var(--color-msl-card)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.url}
                  alt={shot.caption || `${startupName} field note ${i + 1}`}
                  loading="lazy"
                  className="block h-full w-auto object-contain transition-transform duration-700 group-hover/card:scale-[1.03]"
                  onError={() => markBroken(shot.id)}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
                {shot.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-1 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all">
                    <div
                      className="font-mono text-[8px] tracking-[0.18em] uppercase"
                      style={{ color: brand.accent }}
                    >
                      / {String(i + 1).padStart(3, '0')}
                    </div>
                    <div className="mt-0.5 font-display text-[12px] text-white">
                      {shot.caption}
                    </div>
                  </div>
                )}
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
};
