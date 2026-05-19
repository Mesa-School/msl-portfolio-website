import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { API_URL } from '@/config/apiUrl';
import { normalizeStartupV2, type V2Envelope } from '@/lib/normalizeStartupV2';
import { serializeJsonLd } from '@/lib/jsonLd';
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msl.mesaschool.co.in';

const buildStartupJsonLd = (detail: StartupData, slug: string) => {
  const canonical = `${SITE_URL}/portfolio/${detail.slug ?? slug}`;
  const sameAs = [
    detail.social_media_links?.linkedin,
    detail.social_media_links?.twitter,
    detail.social_media_links?.instagram,
    detail.social_media_links?.facebook,
  ].filter((u): u is string => typeof u === 'string' && u.length > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: detail.startup_name,
    url: detail.startup_website || canonical,
    description:
      detail.two_liner?.trim() ||
      detail.brief_description?.trim() ||
      `${detail.startup_name} — part of the Mesa Startup Lab portfolio.`,
    ...(detail.company_logo && { logo: detail.company_logo }),
    ...(detail.company_header_image && { image: detail.company_header_image }),
    ...(detail.location && {
      address: { '@type': 'PostalAddress', addressLocality: detail.location },
    }),
    ...(detail.keywords?.length && { keywords: detail.keywords.join(', ') }),
    ...(sameAs.length && { sameAs }),
    ...(detail.founders?.length && {
      founder: detail.founders.map((f) => ({
        '@type': 'Person',
        name: f.name,
        ...(f.designation && { jobTitle: f.designation }),
        ...(f.linkedin && { sameAs: [f.linkedin] }),
      })),
    }),
    memberOf: {
      '@type': 'Organization',
      name: 'Mesa Startup Lab',
      url: SITE_URL,
    },
  };
};

const buildBreadcrumbJsonLd = (detail: StartupData, slug: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Portfolio',
      item: `${SITE_URL}/portfolio`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: detail.startup_name,
      item: `${SITE_URL}/portfolio/${detail.slug ?? slug}`,
    },
  ],
});

const StartupDetailPage = async ({ params }: DetailPageProps) => {
  const { slug } = await params;
  const detail = await fetchStartup(slug);

  if (!detail) notFound();

  const orgJsonLd = buildStartupJsonLd(detail, slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(detail, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <PortfolioDetailRevamp data={detail} />
    </>
  );
};

export default StartupDetailPage;
