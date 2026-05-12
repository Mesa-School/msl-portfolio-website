import type { Brand } from './types';

export const KeywordsMarquee = ({
  keywords,
  brand,
}: {
  keywords: string[];
  brand: Brand;
}) => (
  <div
    className="mt-6 relative overflow-hidden border-y py-3"
    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
  >
    <div
      className="flex gap-10 whitespace-nowrap font-mono text-[10px] tracking-[0.32em] uppercase"
      style={{ color: brand.accent, animation: 'marquee 40s linear infinite' }}
    >
      {[...Array(3)].flatMap((_, repeat) =>
        keywords.map((kw, i) => (
          <span key={`${repeat}-${i}`} className="flex items-center gap-10">
            <span>{kw}</span>
            <span className="text-white/25">✦</span>
          </span>
        ))
      )}
    </div>
  </div>
);
