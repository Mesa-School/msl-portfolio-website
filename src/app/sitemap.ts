import type { MetadataRoute } from 'next';

import { API_URL } from '@/config/apiUrl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mesaschool.co';

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
        { cache: 'no-store', headers },
      );
      if (!res.ok) break;
      const payload = await res.json();
      if (!payload?.success || !Array.isArray(payload.data)) break;
      payload.data.forEach((item: { slug?: string | null; updated_at?: string }) => {
        if (item.slug) collected.push({ slug: item.slug, updated_at: item.updated_at });
      });
      totalPages = payload.pagination?.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return collected;
  }

  return collected;
};

const fetchAllIgniteSlugs = async (): Promise<SlugItem[]> => {
  if (!API_URL) return [];
  const token = process.env.API_BEARER_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const collected: SlugItem[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await fetch(
        `${API_URL}/api/ignite-startups/?page=${page}&limit=50&published=true`,
        { cache: 'no-store', headers },
      );
      if (!res.ok) break;
      const payload = await res.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];
      items.forEach((item: { slug?: string | null; attributes?: { slug?: string | null; updatedAt?: string } }) => {
        const slug = item.slug ?? item.attributes?.slug ?? null;
        if (slug) collected.push({ slug, updated_at: item.attributes?.updatedAt });
      });
      totalPages = payload?.pagination?.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return collected;
  }

  return collected;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ignite`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const [portfolioSlugs, igniteSlugs] = await Promise.all([
    fetchAllPortfolioSlugs(),
    fetchAllIgniteSlugs(),
  ]);

  const portfolioEntries: MetadataRoute.Sitemap = portfolioSlugs.map((item) => ({
    url: `${SITE_URL}/portfolio/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const igniteEntries: MetadataRoute.Sitemap = igniteSlugs.map((item) => ({
    url: `${SITE_URL}/ignite/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...portfolioEntries, ...igniteEntries];
}
