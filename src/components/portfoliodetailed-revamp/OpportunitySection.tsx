import type { Brand, MarketStat } from './types';
import { SectionLabel } from './SectionLabel';
import { isPresent } from './utils';

export const OpportunitySection = ({
  paragraph,
  cagr,
  indiaMarket,
  globalMarket,
  brand,
}: {
  paragraph: string;
  cagr: MarketStat;
  indiaMarket: MarketStat;
  globalMarket: MarketStat;
  brand: Brand;
}) => {
  const stats = [
    { ...cagr, blurb: 'Compounding annual growth · 5-yr forecast' },
    { ...indiaMarket, blurb: 'India functional foods & supplements TAM' },
    { ...globalMarket, blurb: 'Worldwide wellness economy ceiling' },
  ].filter((s) => isPresent(s.value));

  if (stats.length === 0 && !isPresent(paragraph)) return null;

  return (
    <section className="mt-14">
      <SectionLabel number="01" eyebrow="Market" title="The opportunity" brand={brand} />

      <div className="mt-7 grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {stats.length > 0 && (
        <div className="col-span-12 lg:col-span-5 rounded-2xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {stats.map((stat, i) => {
            const m = stat.value.match(/^(\D*)([\d.,]+)(.*)$/) || ['', '', stat.value, ''];
            const prefix = m[1];
            const main = m[2];
            const suffix = m[3];

            return (
              <div
                key={i}
                className="group relative px-4 py-3 transition-colors"
                style={{ background: 'var(--color-msl-card)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-white/30 w-6 shrink-0">
                    /0{i + 1}
                  </div>

                  <div className="font-display font-light leading-none tracking-[-0.03em] text-[clamp(22px,2.4vw,28px)] tabular-nums shrink-0 min-w-[76px]">
                    {prefix && (
                      <span style={{ color: brand.accent }} className="opacity-90">
                        {prefix}
                      </span>
                    )}
                    <span className="text-white">{main}</span>
                    {suffix && (
                      <span style={{ color: brand.accent }} className="opacity-90">
                        {suffix}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pl-3 border-l border-white/10">
                    <div
                      className="font-mono text-[9.5px] tracking-[0.16em] uppercase leading-tight"
                      style={{ color: brand.accent }}
                    >
                      {stat.label}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-[1.4] text-white/55">
                      {stat.blurb}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        <div
          className={`${
            stats.length > 0 ? 'col-span-12 lg:col-span-7' : 'col-span-12'
          } lg:pt-1`}
        >
          <p className="text-[14.5px] leading-[1.7] text-white/80 font-light text-justify hyphens-auto">
            {paragraph}
          </p>
        </div>
      </div>
    </section>
  );
};
