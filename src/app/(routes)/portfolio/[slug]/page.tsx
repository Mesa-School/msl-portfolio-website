import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { API_URL } from '@/config/apiUrl';
import { normalizeStartupV2, type V2Envelope } from '@/lib/normalizeStartupV2';
import {
  PortfolioDetailRevamp,
  type StartupData,
} from '@/components/portfoliodetailed-revamp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fetchStartup = cache(async (slug: string): Promise<StartupData | null> => {
  if (!API_URL) return null;

  const token = process.env.API_BEARER_TOKEN;

  try {
    const res = await fetch(`${API_URL}/api/v2/startups/slug/${slug}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) return null;

    const payload = (await res.json()) as V2Envelope;
    if (!payload?.success || !payload.data) return null;

    return normalizeStartupV2(payload);
  } catch {
    return null;
  }
});

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchStartup(slug);

  console.log('Detailed Data:\n' + JSON.stringify(detail, null, 2));
  console.log('Founders:\n' + JSON.stringify(detail?.founders, null, 2));
  console.log('Social media links:\n' + JSON.stringify(detail?.social_media_links, null, 2));
  console.log('Sector excitement:\n' + JSON.stringify(detail?.sector_excitement, null, 2));
  console.log('Founder gallery:\n' + JSON.stringify(detail?.founder_gallery, null, 2));

  if (!detail) {
    return {
      title: 'Startup not found',
      robots: { index: false, follow: false },
    };
  }

  const description =
    detail.two_liner?.trim() ||
    detail.brief_description?.trim() ||
    `${detail.startup_name} — part of the Mesa Startup Lab portfolio.`;
  const ogImage = detail.company_header_image || detail.company_logo || undefined;
  const canonical = `/portfolio/${detail.slug ?? slug}`;

  return {
    title: detail.startup_name,
    description,
    alternates: { canonical },
    openGraph: {
      title: detail.startup_name,
      description,
      url: canonical,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, alt: detail.startup_name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.startup_name,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

const StartupDetailPage = async ({ params }: DetailPageProps) => {
  const { slug } = await params;
  const detail = await fetchStartup(slug);

  if (!detail) notFound();

  return <PortfolioDetailRevamp data={detail} />;
};

export default StartupDetailPage;
