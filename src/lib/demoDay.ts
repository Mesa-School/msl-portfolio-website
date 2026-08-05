/**
 * Mesa Demo Day — the curated line-up shown at /demo-day.
 *
 * The startups API has no "demo day" flag (it only filters by `sector` and
 * `service_track`), so the line-up is curated here in the frontend. This file is
 * the single source of truth: to retire the event, delete DEMO_DAY_SLUGS and the
 * /demo-day route.
 */

/**
 * Startup slugs in pitch order. Order is meaningful — it drives the running
 * order badges on the cards, so don't sort this list.
 */
export const DEMO_DAY_SLUGS = [
  'fyn', // FYN Wellness
  'spriggle', // Spriggle
  'miomi-1', // Miomi
  'studojo', // Studojo
  'wingmann', // Wingmann Connections
  'playroot', // Playroot Golf
  'knacks', // Knacks
  'vetqure-ai-1', // Vetqure AI
  'ai-job-hunter', // Open Secure
  'whisperwave', // Whisperwave
  'squareup', // SquareUp
  'the-thrift-store-1', // The Thrift Store
  'orange-invest', // Orange Invest
] as const;

export type DemoDaySlug = (typeof DEMO_DAY_SLUGS)[number];

/** Copy for the /demo-day hero and its metadata. */
export const DEMO_DAY = {
  eyebrow: 'Mesa Demo Day',
  titleLead: 'Demo',
  titleAccent: 'Day',
  subtitle: 'Thirteen startups. One stage.',
  description:
    'Mesa Demo Day — the startups pitching live from Mesa Startup Lab, across the AI, D2C and Services tracks.',
} as const;

const ORDER = new Map<string, number>(
  DEMO_DAY_SLUGS.map((slug, index) => [slug, index]),
);

/** True when the slug is part of the Demo Day line-up. */
export function isDemoDaySlug(slug?: string | null): boolean {
  return slug != null && ORDER.has(slug);
}

/**
 * Sorts items into pitch order. Anything not in the line-up sorts last, so a
 * stray record can never silently reorder the run of show.
 */
export function byDemoDayOrder<T>(getSlug: (item: T) => string | null | undefined) {
  return (a: T, b: T) => {
    const aIndex = ORDER.get(getSlug(a) ?? '') ?? Number.MAX_SAFE_INTEGER;
    const bIndex = ORDER.get(getSlug(b) ?? '') ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  };
}
