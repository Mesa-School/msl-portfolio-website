import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Brand, Founder, FounderVideo } from './types';
import { SectionLabel } from './SectionLabel';
import { FounderCard } from './FounderCard';

export const PitchAndBuilders = ({
  founderVideo,
  founders,
  brand,
}: {
  founderVideo: FounderVideo | null;
  founders: Founder[];
  brand: Brand;
}) => {
  const hasVideo = Boolean(founderVideo?.embed_url);

  return (
    <section className="mt-9 pt-9 border-t border-white/6">
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
        {hasVideo && founderVideo ? (
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-end justify-between gap-4 mb-5">
              <SectionLabel
                number="05"
                eyebrow="Pitch"
                title="The 90-second pitch"
                brand={brand}
              />
              <Link
                href={founderVideo.url}
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
                src={founderVideo.embed_url}
                title={founderVideo.title}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        ) : null}

        <div className={hasVideo ? 'col-span-12 lg:col-span-5' : 'col-span-12'}>
          <SectionLabel
            number="06"
            eyebrow="People"
            title={founders.length > 1 ? 'The builders' : 'The builder'}
            brand={brand}
          />

          {!hasVideo && founders.length > 1 ? (
            <div
              className={`mt-5 grid gap-4 ${
                founders.length >= 2 && founders.length <= 4
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {founders.map((founder, index) => {
                const isLastOdd =
                  founders.length === 3 && index === founders.length - 1;
                return (
                  <FounderCard
                    key={founder.id}
                    founder={founder}
                    brand={brand}
                    layout="row"
                    className={isLastOdd ? 'md:col-span-2' : ''}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {founders.map((founder) => (
                <FounderCard key={founder.id} founder={founder} brand={brand} layout="row" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
