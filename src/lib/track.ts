export type TrackSlug = 'ai' | 'd2c' | 'services';

export interface TrackEntry {
  /** URL slug used in ?track=<slug> */
  slug: TrackSlug;
  /** Value the startups API expects for service_track filtering */
  apiValue: string;
  /** Human label used for tab text and the <title> */
  label: string;
  /** Per-track meta description (<=160 chars) */
  description: string;
}

export const TRACKS: readonly TrackEntry[] = [
  {
    slug: 'ai',
    apiValue: 'AI Track',
    label: 'AI Track',
    description:
      "Mesa Startup Lab's AI Track — student and early-stage founders building AI-first startups, from applied ML to AI-native products.",
  },
  {
    slug: 'd2c',
    apiValue: 'D2C Track',
    label: 'D2C Track',
    description:
      "Mesa Startup Lab's D2C Track — founders building consumer and direct-to-consumer brands across India.",
  },
  {
    slug: 'services',
    apiValue: 'Services Track',
    label: 'Services Track',
    description:
      "Mesa Startup Lab's Services Track — founders building service-led and B2B startups.",
  },
];

export function trackBySlug(slug?: string | null): TrackEntry | null {
  if (!slug) return null;
  return TRACKS.find((track) => track.slug === slug) ?? null;
}
