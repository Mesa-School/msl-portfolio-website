'use client';

import { motion, type Variants } from 'framer-motion';
import CountUp from '@/components/animated/Countup';
import type { Brand, MarketStat } from './types';
import { SectionLabel } from './SectionLabel';
import { isPresent, parseMetricValue } from './utils';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

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
    { ...cagr, blurb: 'Compounding annual growth · 5-year forecast' },
    { ...indiaMarket, blurb: 'India total addressable market' },
    { ...globalMarket, blurb: 'Worldwide market opportunity' },
  ].filter((s) => isPresent(s.value));

  if (stats.length === 0 && !isPresent(paragraph)) return null;

  return (
    <motion.section
      className="mt-14"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div variants={itemVariants}>
        <SectionLabel number="01" eyebrow="Market" title="The opportunity" brand={brand} />
      </motion.div>

      <div className="mt-7 grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {stats.length > 0 && (
          <motion.div
            className="col-span-12 lg:col-span-5 rounded-2xl overflow-hidden backdrop-blur-md border divide-y divide-white/10 isolate"
            style={{
              background: `radial-gradient(circle at top left, ${brand.primary}1a 0%, transparent 38%), radial-gradient(circle at bottom right, ${brand.primary}14 0%, transparent 38%), rgba(255, 255, 255, 0.05)`,
              borderColor: `${brand.primary}33`,
              transform: 'translateZ(0)',
              contain: 'layout style',
            }}
            variants={itemVariants}
          >
            {stats.map((stat, i) => {
              const { prefix, number, suffix, hasGrouping } = parseMetricValue(stat.value);

              return (
                <div
                  key={i}
                  className="group relative px-4 py-3 transition-colors"
                  style={{ contain: 'layout style paint' }}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-white/30 w-6 shrink-0">
                        /0{i + 1}
                      </div>

                      <div className="font-display font-light leading-none tracking-[-0.03em] text-[clamp(20px,2.4vw,28px)] tabular-nums shrink-0">
                        {prefix && (
                          <span style={{ color: brand.accent }} className="opacity-90">
                            {prefix}
                          </span>
                        )}
                        {number !== null ? (
                          <span className="text-white">
                            <CountUp
                              to={number}
                              duration={1.5}
                              separator={hasGrouping ? ',' : ''}
                            />
                          </span>
                        ) : (
                          <span className="text-white">{stat.value}</span>
                        )}
                        {suffix && (
                          <span style={{ color: brand.accent }} className="opacity-90">
                            {suffix}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 pl-9 sm:pl-3">
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
          </motion.div>
        )}

        <motion.div
          className={`${
            stats.length > 0 ? 'col-span-12 lg:col-span-7' : 'col-span-12'
          } lg:pt-1`}
          variants={itemVariants}
        >
          <p className="text-[14.5px] leading-[1.7] text-white/80 font-light text-justify hyphens-auto">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
