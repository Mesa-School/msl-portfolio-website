import type { MetadataRoute } from "next";

import { API_URL } from "@/config/apiUrl";
import { TRACKS } from "@/lib/track";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://msl.mesaschool.co.in";

const BUILD_DATE = new Date();

type SlugItem = { slug: string | null; updated_at?: string | null };

const fetchAllPortfolioSlugs = async (): Promise<SlugItem[]> => {
  if (!API_URL) return [];
  const token = process.env.API_BEARER_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const collected: SlugItem[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await fetch(
        `${API_URL}/api/v2/startups/?page=${page}&limit=50&published=true`,
        { cache: "no-store", headers },
      );
      if (!res.ok) break;
      const payload = await res.json();
      if (!payload?.success || !Array.isArray(payload.data)) break;
      payload.data.forEach(
        (item: { slug?: string | null; updated_at?: string }) => {
          if (item.slug)
            collected.push({ slug: item.slug, updated_at: item.updated_at });
        },
      );
      totalPages = payload.pagination?.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return collected;
  }

  return collected;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // `/` is intentionally omitted: it permanently redirects to /portfolio,
  // so listing it would waste crawl budget on a 308.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...TRACKS.map((t) => ({
      url: `${SITE_URL}/portfolio?track=${t.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/demo-day`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const portfolioSlugs = await fetchAllPortfolioSlugs();

  const portfolioEntries: MetadataRoute.Sitemap = portfolioSlugs.map(
    (item) => ({
      url: `${SITE_URL}/portfolio/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...portfolioEntries];
}
