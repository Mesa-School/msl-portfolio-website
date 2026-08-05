import { toProxyUrl } from '@/lib/imageProxy';
import type { Startup } from '@/components/OurStartups/StartupOverviewCard';

/** A row as returned by GET /api/v2/startups/ (the list endpoint). */
export type V2ListItem = {
  id: string;
  slug: string;
  startup_name: string;
  tagline: string;
  two_liner: string;
  location: string;
  cohort: string;
  sector_name: string | null;
  service_track?: string | null;
  company_logo: string | null;
  founders: string[];
  published: boolean;
  published_at: string | null;
  brand?: { primary?: string | null } | null;
};

export type V2ListPayload = {
  success: boolean;
  data: V2ListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
};

/**
 * Maps a list row onto the shape StartupOverviewCard renders. Shared by the
 * portfolio and Demo Day fetchers so the two can't drift apart.
 */
export function toStartup(item: V2ListItem): Startup {
  return {
    id: item.id,
    documentId: item.id,
    slug: item.slug ?? null,
    name: item.startup_name ?? 'Untitled Startup',
    summary: item.two_liner ?? item.tagline ?? '',
    location: item.location ?? null,
    cohort: item.cohort ?? null,
    sectorName: item.sector_name ?? null,
    serviceTrack: item.service_track ?? null,
    logoUrl: (toProxyUrl(item.company_logo) ?? item.company_logo) as string | null,
    brandPrimary: item.brand?.primary ?? null,
    founders: (item.founders ?? []).map((name, index) => ({
      id: index,
      name,
      designation: null,
    })),
  };
}
