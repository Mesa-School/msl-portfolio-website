import type { Brand } from './types';

export const Masthead = ({
  cohort,
  sectorName,
  location,
  brand,
}: {
  cohort: string;
  sectorName: string;
  location: string;
  brand: Brand;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/8">
    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55">
      Portfolio File · No. 003 · {cohort}
    </div>
    <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
      <span>{sectorName}</span>
      <span className="h-1 w-1 rounded-full bg-white/30" />
      <span>{location}</span>
      <span className="h-1 w-1 rounded-full bg-white/30" />
      <span style={{ color: brand.accent }}>● Pilot live</span>
    </div>
  </div>
);
