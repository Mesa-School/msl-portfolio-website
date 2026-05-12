import type { Brand, KeyMetric } from './types';
import { isPresent } from './utils';

export const StatsGrid = ({
  metrics,
  brand,
}: {
  metrics: KeyMetric[];
  brand: Brand;
}) => (
  <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-2xl overflow-hidden border border-white/[0.07]">
    {metrics.map((metric) => (
      <div
        key={metric.id}
        className="group relative p-5 transition-colors hover:bg-white/2"
        style={{ background: 'var(--color-msl-card)' }}
      >
        <div
          className="font-mono text-[9px] tracking-[0.22em] uppercase mb-3"
          style={{ color: brand.accent }}
        >
          / {String(metric.id).padStart(2, '0')}
        </div>
        <div className="font-display text-[40px] leading-[0.9] tracking-[-0.04em] font-light tabular-nums text-white">
          {metric.value}
        </div>
        <div className="mt-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-white/65">
          {metric.label}
        </div>
        {isPresent(metric.description) && (
          <p className="mt-2 text-[11px] leading-normal text-white/55 line-clamp-2">
            {metric.description}
          </p>
        )}
      </div>
    ))}
  </div>
);
