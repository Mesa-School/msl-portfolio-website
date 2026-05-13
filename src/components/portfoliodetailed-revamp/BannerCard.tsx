import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Brand, FounderVideo, SocialLinks } from './types';
import { MediaImage } from './MediaImage';
import { SocialIcon } from './SocialIcon';
import { Linkedin, Instagram, Twitter } from './icons';

export const BannerCard = ({
  startupName,
  companyLogo,
  companyHeaderImage,
  sectorName,
  brand,
  startupWebsite,
  socialLinks,
  founderVideo,
}: {
  startupName: string;
  companyLogo: string;
  companyHeaderImage: string;
  sectorName: string;
  brand: Brand;
  startupWebsite?: string;
  socialLinks?: SocialLinks;
  founderVideo?: FounderVideo | null;
}) => {
  const hasSocial = Boolean(
    socialLinks?.instagram || socialLinks?.linkedin || socialLinks?.twitter,
  );
  const hasActions = Boolean(startupWebsite || hasSocial || founderVideo?.url);

  const logoChip = (
    <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-xl shadow-inner shadow-black/20 border-2 border-white/20 bg-white shrink-0 flex items-center justify-center">
      {companyLogo ? (
        <MediaImage
          src={companyLogo}
          alt={startupName}
          fill
          className="object-contain"
          brandTint={brand.primary}
          rounded="rounded-xl"
        />
      ) : (
        <span
          className="font-display font-semibold text-[24px] md:text-[28px] leading-none"
          style={{ color: brand.primary }}
        >
          {startupName.charAt(0)}
        </span>
      )}
    </div>
  );

  const sectorText = (withShadow: boolean) => (
    <div
      className={`font-mono text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase mb-1 md:mb-1.5 ${
        withShadow
          ? '[text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]'
          : ''
      }`}
      style={{ color: brand.accent }}
    >
      {sectorName}
    </div>
  );

  const nameText = (withShadow: boolean) => (
    <h1
      className={`font-display font-medium text-[22px] md:text-[36px] leading-tight md:leading-none tracking-[-0.02em] wrap-break-word ${
        withShadow
          ? '[text-shadow:0_2px_6px_rgba(0,0,0,0.7),0_4px_16px_rgba(0,0,0,0.5)]'
          : ''
      }`}
    >
      {startupName}
    </h1>
  );

  const actionsRow = (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {startupWebsite && (
        <Link
          href={startupWebsite}
          target="_blank"
          className="group inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/15 transition-transform hover:scale-[1.03]"
          style={{ background: brand.primary, color: brand.ink }}
        >
          <span className="font-bold text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
            Visit site
          </span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}

      {founderVideo?.url && (
        <Link
          href={founderVideo.url}
          target="_blank"
          aria-label="90-second pitch"
          className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:bg-black/60 hover:border-white/40 transition-all"
        >
          <Play className="h-3 w-3 fill-white text-white" />
        </Link>
      )}

      {socialLinks?.instagram && (
        <SocialIcon href={socialLinks.instagram} brand={brand} label="Instagram">
          <Instagram className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </SocialIcon>
      )}
      {socialLinks?.linkedin && (
        <SocialIcon href={socialLinks.linkedin} brand={brand} label="LinkedIn">
          <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </SocialIcon>
      )}
      {socialLinks?.twitter && (
        <SocialIcon href={socialLinks.twitter} brand={brand} label="Twitter">
          <Twitter className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </SocialIcon>
      )}
    </div>
  );

  return (
    <div className="mt-5">
      {/* Banner image */}
      <div
        className="relative aspect-5/1 w-full overflow-hidden rounded-2xl"
        style={{ background: 'var(--color-msl-card)' }}
      >
        {companyHeaderImage ? (
          <MediaImage
            src={companyHeaderImage}
            alt={`${startupName} — header`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1152px"
            brandTint={brand.primary}
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

        {/* Desktop overlay — gradient + identity row absolutely positioned over banner */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-msl-page to-transparent" />
        <div className="hidden md:flex absolute left-7 right-7 bottom-4 items-end justify-between gap-4">
          <div className="flex items-end gap-4 min-w-0">
            {logoChip}
            <div className="min-w-0">
              {sectorText(true)}
              {nameText(true)}
            </div>
          </div>
          {hasActions && actionsRow}
        </div>
      </div>

      {/* Mobile-only: stacked rows below banner */}
      <div className="md:hidden mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logoChip}
          <div className="min-w-0 flex-1">
            {sectorText(false)}
            {nameText(false)}
          </div>
        </div>
        {hasActions && actionsRow}
      </div>
    </div>
  );
};
