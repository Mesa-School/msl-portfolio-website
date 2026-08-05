'use server';

import { API_URL } from '@/config/apiUrl';
import { DEMO_DAY_SLUGS, byDemoDayOrder, isDemoDaySlug } from '@/lib/demoDay';
import { toStartup, type V2ListPayload } from '@/lib/startupListItem';
import type { Startup } from '@/components/OurStartups/StartupOverviewCard';

export type FetchDemoDayResult = {
  startups: Startup[];
  /** Line-up slugs the API didn't return — surfaced so a gap is never silent. */
  missingSlugs: string[];
  error?: string;
};

/**
 * The line-up is 13 startups out of a catalogue in the low tens, so this pulls
 * one generous page and filters locally rather than paging. Bump the limit if
 * the catalogue ever approaches it — `missingSlugs` is the canary.
 */
const PAGE_LIMIT = 100;

export async function fetchDemoDayStartupsAction(): Promise<FetchDemoDayResult> {
  if (!API_URL) {
    return {
      startups: [],
      missingSlugs: [...DEMO_DAY_SLUGS],
      error: 'API configuration is missing.',
    };
  }

  const token = process.env.API_BEARER_TOKEN;

  try {
    const res = await fetch(
      `${API_URL}/api/v2/startups/?page=1&limit=${PAGE_LIMIT}&published=true`,
      {
        cache: 'no-store',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      },
    );

    if (!res.ok) {
      return {
        startups: [],
        missingSlugs: [...DEMO_DAY_SLUGS],
        error: 'Failed to fetch the Demo Day line-up.',
      };
    }

    const payload = (await res.json()) as V2ListPayload;

    if (!payload?.success || !Array.isArray(payload.data)) {
      return {
        startups: [],
        missingSlugs: [...DEMO_DAY_SLUGS],
        error: 'Invalid response shape.',
      };
    }

    const startups = payload.data
      .filter((item) => isDemoDaySlug(item.slug))
      .map(toStartup)
      .sort(byDemoDayOrder((startup) => startup.slug));

    const found = new Set(startups.map((startup) => startup.slug));
    const missingSlugs = DEMO_DAY_SLUGS.filter((slug) => !found.has(slug));

    return { startups, missingSlugs };
  } catch {
    return {
      startups: [],
      missingSlugs: [...DEMO_DAY_SLUGS],
      error: 'Unable to reach the startups endpoint.',
    };
  }
}
