import type { Metadata } from 'next';

import { trackBySlug } from '@/lib/track';
import { SITE_NAME, OG_IMAGE, TWITTER_IMAGE } from '@/lib/seo';

export const PORTFOLIO_DESCRIPTION =
  'Explore the Mesa Startup Lab portfolio — student- and early-stage founders building across AI, D2C, and services.';

function base(title: string, description: string, canonical: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: TWITTER_IMAGE,
    },
  };
}

/**
 * Pure metadata builder for the portfolio route.
 * - valid ?track=<slug>  -> per-track title + self canonical
 * - junk ?track=<other>  -> base title, canonical /portfolio, noindex
 * - no param             -> base title + /portfolio canonical
 */
export function buildPortfolioMetadata(rawTrack?: string | null): Metadata {
  const hasParam = typeof rawTrack === 'string' && rawTrack.length > 0;
  const entry = trackBySlug(rawTrack);

  if (entry) {
    return base(
      entry.label,
      entry.description,
      `/portfolio?track=${entry.slug}`,
    );
  }

  const meta = base('Startup Portfolio', PORTFOLIO_DESCRIPTION, '/portfolio');

  if (hasParam) {
    // unknown junk param — keep crawlers off infinite param URLs
    meta.robots = { index: false, follow: true };
  }

  return meta;
}
