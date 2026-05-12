import type { Brand } from './types';
import { SectionLabel } from './SectionLabel';
import { isPresent } from './utils';

export const BriefAndEdge = ({
  briefDescription,
  productExcitement,
  brand,
}: {
  briefDescription: string;
  productExcitement: string;
  brand: Brand;
}) => {
  const hasBrief = isPresent(briefDescription);
  const hasEdge = isPresent(productExcitement);
  if (!hasBrief && !hasEdge) return null;

  const sentences = productExcitement.split('. ');
  const pullQuote = sentences[0].endsWith('.') ? sentences[0] : sentences[0] + '.';
  const pullQuoteRest = sentences.slice(1).join('. ');

  return (
    <section className="mt-9 pt-9 border-t border-white/6 grid grid-cols-12 gap-6 lg:gap-10">
      {hasBrief && (
        <div className={hasEdge ? 'col-span-12 lg:col-span-7' : 'col-span-12'}>
          <SectionLabel number="02" eyebrow="Premise" title="The brief" brand={brand} />
          <p className="editorial-dropcap mt-5 font-display font-light text-[17px] leading-[1.6] tracking-[-0.005em] text-white/85 text-justify hyphens-auto">
            {briefDescription}
          </p>
        </div>
      )}

      {hasEdge && (
        <div className={hasBrief ? 'col-span-12 lg:col-span-5' : 'col-span-12'}>
          <SectionLabel number="03" eyebrow="Product Excitement" title="The edge" brand={brand} />
          <figure className="mt-5 relative">
            <span
              className="absolute -top-4 -left-1 font-display text-[80px] leading-none opacity-25 select-none pointer-events-none"
              style={{ color: brand.accent }}
            >
              &ldquo;
            </span>
            <blockquote className="font-display font-normal text-[clamp(16px,1.5vw,20px)] leading-snug tracking-[-0.01em] pl-7 lg:pl-10 text-white">
              {pullQuote}
            </blockquote>
            {isPresent(pullQuoteRest) && (
              <div className="mt-3 pl-7 lg:pl-10 text-[13px] leading-[1.6] text-white/65 text-justify hyphens-auto">
                {pullQuoteRest}
              </div>
            )}
          </figure>
        </div>
      )}
    </section>
  );
};
