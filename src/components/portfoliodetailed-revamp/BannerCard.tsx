import Image from 'next/image';
import type { Brand } from './types';

export const BannerCard = ({
  startupName,
  companyLogo,
  companyHeaderImage,
  sectorName,
  brand,
}: {
  startupName: string;
  companyLogo: string;
  companyHeaderImage: string;
  sectorName: string;
  brand: Brand;
}) => (
  <div
    className="relative mt-5 aspect-5/1 w-full overflow-hidden rounded-2xl"
    style={{ background: 'var(--color-msl-card)' }}
  >
    {companyHeaderImage ? (
      <Image
        src={companyHeaderImage}
        alt={`${startupName} — header`}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 1152px"
      />
    ) : (
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${brand.primary}55, transparent 60%), radial-gradient(circle at 80% 30%, ${brand.accent}30, transparent 50%), var(--color-msl-card)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="font-display font-light tracking-[-0.04em] leading-none text-white opacity-15"
            style={{
              fontSize: 'clamp(80px, 14vw, 180px)',
            }}
          >
            {startupName}
          </div>
        </div>
        <div className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.22em] uppercase text-white/30">
          Header image · TBD
        </div>
      </div>
    )}

    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-msl-page to-transparent" />

    <div className="absolute left-5 bottom-3 md:left-7 md:bottom-4 flex items-end gap-4">
      <div
        className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20 shrink-0 flex items-center justify-center"
        style={{ background: 'var(--color-msl-card)' }}
      >
        {companyLogo ? (
          <Image src={companyLogo} alt={startupName} fill className="object-contain" />
        ) : (
          <span
            className="font-display font-semibold text-[24px] md:text-[28px] leading-none"
            style={{ color: brand.primary }}
          >
            {startupName.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <div
          className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase mb-1.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]"
          style={{ color: brand.accent }}
        >
          {sectorName}
        </div>
        <h1 className="font-display font-medium text-[28px] md:text-[36px] leading-none tracking-[-0.02em] [text-shadow:0_2px_6px_rgba(0,0,0,0.7),0_4px_16px_rgba(0,0,0,0.5)]">
          {startupName}
        </h1>
      </div>
    </div>
  </div>
);
