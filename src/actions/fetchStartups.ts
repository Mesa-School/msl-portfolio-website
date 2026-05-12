'use server';

import { API_URL } from '@/config/apiUrl';
import { toProxyUrl } from '@/lib/imageProxy';
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

type V2ListItem = {
  id: string;
  slug: string;
  startup_name: string;
  tagline: string;
  two_liner: string;
  location: string;
  cohort: string;
  sector_name: string | null;
  company_logo: string | null;
  founders: string[];
  published: boolean;
  published_at: string | null;
};

type V2ListPayload = {
  success: boolean;
  data: V2ListItem[];
  pagination: PaginationData;
};

export async function fetchStartupsAction(
  page: number = 1,
  sectors: string[] = [],
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

    const startups: Startup[] = payload.data.map((item) => ({
      id: item.id,
      documentId: item.id,
      slug: item.slug ?? null,
      name: item.startup_name ?? 'Untitled Startup',
      summary: item.two_liner ?? item.tagline ?? '',
      location: item.location ?? null,
      cohort: item.cohort ?? null,
      sectorName: item.sector_name ?? null,
      logoUrl: (toProxyUrl(item.company_logo) ?? item.company_logo) as string | null,
      founders: (item.founders ?? []).map((name, index) => ({
        id: index,
        name,
        designation: null,
      })),
    }));

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
