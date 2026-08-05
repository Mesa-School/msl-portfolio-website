'use server';

import { API_URL } from '@/config/apiUrl';
import { toStartup, type V2ListPayload } from '@/lib/startupListItem';
import type { Startup } from '@/components/OurStartups/StartupOverviewCard';

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type FetchStartupsResult = {
  startups: Startup[];
  pagination: PaginationData;
  error?: string;
};

const DEFAULT_PAGINATION: PaginationData = {
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 1,
};

export async function fetchStartupsAction(
  page: number = 1,
  sectors: string[] = [],
  tracks: string[] = [],
): Promise<FetchStartupsResult> {
  if (!API_URL) {
    return {
      startups: [],
      pagination: DEFAULT_PAGINATION,
      error: 'API configuration is missing.',
    };
  }

  const token = process.env.API_BEARER_TOKEN;

  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', '10');
  params.set('published', 'true');
  sectors.forEach((s) => params.append('sector', s));
  if (tracks.length > 0) {
    params.set('service_track', tracks.join(','));
  }

  try {
    const res = await fetch(`${API_URL}/api/v2/startups/?${params.toString()}`, {
      cache: 'no-store',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });

    if (!res.ok) {
      return {
        startups: [],
        pagination: DEFAULT_PAGINATION,
        error: 'Failed to fetch startups.',
      };
    }

    const payload = (await res.json()) as V2ListPayload;

    if (!payload?.success || !Array.isArray(payload.data)) {
      return {
        startups: [],
        pagination: DEFAULT_PAGINATION,
        error: 'Invalid response shape.',
      };
    }

    const startups: Startup[] = payload.data.map(toStartup);

    return {
      startups,
      pagination: payload.pagination ?? DEFAULT_PAGINATION,
    };
  } catch {
    return {
      startups: [],
      pagination: DEFAULT_PAGINATION,
      error: 'Unable to reach startups endpoint.',
    };
  }
}
