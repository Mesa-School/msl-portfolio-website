'use client';

import { motion, type Variants } from 'framer-motion';
import CountUp from '@/components/animated/Countup';
import type { Brand, KeyMetric } from './types';
import { isPresent, parseMetricValue } from './utils';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
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

export const StatsGrid = ({
  metrics,
  brand,
}: {
  metrics: KeyMetric[];
  brand: Brand;
}) => {
  const gridCols = (() => {
    switch (metrics.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-3';
      default:
        return 'grid-cols-2 lg:grid-cols-4';
    }
  })();

  return (
    <motion.div
      className={`mt-7 grid ${gridCols} rounded-2xl overflow-hidden backdrop-blur-md border divide-x divide-y divide-white/10`}
      style={{
        background: `radial-gradient(circle at top left, ${brand.primary}1a 0%, transparent 38%), radial-gradient(circle at bottom right, ${brand.primary}14 0%, transparent 38%), rgba(255, 255, 255, 0.05)`,
        borderColor: `${brand.primary}33`,
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {metrics.map((metric) => {
        const { prefix, number, suffix, hasGrouping } = parseMetricValue(metric.value);
        return (
          <motion.div
            key={metric.id}
            className="group relative p-5 transition-colors hover:bg-white/5"
            variants={itemVariants}
          >
            <div
              className="font-mono text-[9px] tracking-[0.22em] uppercase mb-3"
              style={{ color: brand.accent }}
            >
              / {String(metric.id).padStart(2, '0')}
            </div>
            <div className="font-display text-[40px] leading-[0.9] tracking-[-0.04em] font-light tabular-nums text-white">
              {prefix}
              {number !== null ? (
                <CountUp
                  to={number}
                  duration={1.5}
                  separator={hasGrouping ? ',' : ''}
                />
              ) : (
                metric.value
              )}
              {suffix}
            </div>
            <div className="mt-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-white/65">
              {metric.label}
            </div>
            {isPresent(metric.description) && (
              <p className="mt-2 text-[11px] leading-normal text-white/55 line-clamp-2">
                {metric.description}
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
