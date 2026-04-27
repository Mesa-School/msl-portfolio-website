'use server';

import { API_URL } from '@/config/apiUrl';
import { toProxyUrl } from '@/lib/imageProxy';
import type { Startup } from '@/components/OurStartups/StartupOverviewCard';

export type IgniteTrack = 'D2C Track' | 'AI Track' | 'Services Track';

export type IgnitePaginationData = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type IgniteStartup = Startup & {
  isIgnite?: boolean;
  igniteTrack?: string | null;
};

export type FetchIgniteStartupsResult = {
  startups: IgniteStartup[];
  pagination: IgnitePaginationData;
  error?: string;
};

const DEFAULT_PAGINATION: IgnitePaginationData = { total: 0, page: 1, limit: 10, total_pages: 1 };

const pickLogoUrl = (source: any): string | null =>
  source?.company_logo?.url ??
  source?.company_logo?.data?.attributes?.url ??
  source?.company_logo?.data?.attributes?.formats?.thumbnail?.url ??
  (typeof source?.company_logo === 'string' ? source.company_logo : null);

const pickFounders = (source: any) => {
  const collection = Array.isArray(source?.founder?.data)
    ? source.founder.data
    : Array.isArray(source?.founder)
      ? source.founder
      : Array.isArray(source?.founders)
        ? source.founders
        : [];

  return collection.map((entry: any, index: number) => {
    if (typeof entry === 'string') return { id: index, name: entry, designation: null };
    const node = entry?.attributes ?? entry;
    return {
      id: node?.id ?? entry?.id ?? index,
      name: node?.name ?? 'Founder',
      designation: node?.designation ?? null,
    };
  });
};

export async function fetchIgniteStartupsAction(
  page: number = 1,
  track: string = '',
): Promise<FetchIgniteStartupsResult> {
  if (!API_URL) {
    return { startups: [], pagination: DEFAULT_PAGINATION, error: 'API configuration is missing.' };
  }

  const token = process.env.API_BEARER_TOKEN;

  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', '10');
  params.set('published', 'true');
  if (track) params.set('track', track);

  try {
    const res = await fetch(`${API_URL}/api/ignite-startups/?${params.toString()}`, {
      cache: 'no-store',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });

    if (!res.ok) {
      return { startups: [], pagination: DEFAULT_PAGINATION, error: 'Failed to fetch ignite startups.' };
    }

    const payload = await res.json();

    const startups: IgniteStartup[] = (payload?.data ?? []).map((item: any, index: number) => {
      const source = item?.attributes ?? item;
      const rawLogo = pickLogoUrl(source);

      return {
        id: item?.id ?? index,
        documentId: item?.documentId ?? `${item?.id ?? index}`,
        slug: item?.slug ?? source?.slug ?? null,
        name: source?.startup_name ?? 'Untitled Startup',
        summary: source?.startup_summary ?? '',
        location: source?.location ?? null,
        cohort: source?.cohort ?? null,
        sectorName:
          source?.sector?.name ??
          source?.sector?.data?.attributes?.name ??
          item?.sector?.name ??
          source?.sector_name ??
          item?.sector_name ??
          null,
        logoUrl: (toProxyUrl(rawLogo) ?? rawLogo) as string | null,
        founders: pickFounders(source),
        isIgnite: source?.is_ignite ?? item?.is_ignite ?? true,
        igniteTrack: source?.ignite_track ?? item?.ignite_track ?? null,
      };
    });

    return { startups, pagination: payload?.pagination ?? DEFAULT_PAGINATION };
  } catch {
    return { startups: [], pagination: DEFAULT_PAGINATION, error: 'Unable to reach ignite startups endpoint.' };
  }
}
