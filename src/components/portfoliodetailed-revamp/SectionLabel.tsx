import type { Brand } from './types';

export const SectionLabel = ({
  number,
  eyebrow,
  title,
  brand,
  compact = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  brand: Brand;
  compact?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase tabular-nums">
      <span className="font-semibold" style={{ color: brand.accent }}>
        {number}
      </span>
      <span className="h-px w-5" style={{ background: brand.accent, opacity: 0.5 }} />
      <span style={{ color: brand.accent }}>{eyebrow}</span>
    </div>
    <h2
      className={`font-display leading-none tracking-[-0.025em] font-normal text-white ${
        compact ? 'text-[20px]' : 'text-[26px] md:text-[30px]'
      }`}
    >
      {title}
    </h2>
  </div>
);
