import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { API_URL } from '@/config/apiUrl';
import { toProxyUrl } from '@/lib/imageProxy';
import type { StartupDetail } from '@/types/startupDetail';
import { HeaderSection, LeftColumnSection, RightColumnSection } from '@/components/PortfolioDetail';

const normalizeStartupDetail = (payload: any): StartupDetail => {
  const data = payload.data;
  return {
    id: data._id,
    slug: data.slug,
    startupName: data.startup_name,
    name: data.name,
    startupSummary: data.startup_summary,
    startupOverview: data.startup_overview,
    startupProblemGap: data.startup_problem_gap,
    location: data.location,
    startupWebsite: data.startup_website,
    keyProgress: data.key_progress,
    competitors: Array.isArray(data.competitors)
      ? data.competitors.map((competitor: any) => ({
          id: competitor.id,
          competitor_name: competitor.competitor_name,
          competitor_image: toProxyUrl(competitor.competitor_image) ?? competitor.competitor_image,
          competitor_website: competitor.competitor_website,
        }))
      : [],
    startup10xBetterment: data.startup_10x_betterment,
    futureGrowthVision: data.future_growth_vision,
    cohort: data.cohort,
    sector: {
      name: data.sector?.name || 'N/A',
    },
    companyLogo: toProxyUrl(data.company_logo) || '',
    companyHeaderImage: toProxyUrl(data.company_header_image) || '',
    socialMediaLinks: {
      instagram: data.social_media_links?.instagram,
      linkedin: data.social_media_links?.linkedin,
      twitter: data.social_media_links?.twitter,
      facebook: data.social_media_links?.facebook,
    },
    revenueStatus: {
      currently_generating_revenue: data.revenue_status?.currently_generating_revenue || false,
      revenueDetails: data.revenue_status?.revenue_details || null,
    },
    founders: (data.founder || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      linkedin: f.linkedin,
      email: f.email,
      bio: f.bio,
      founderProfilePic: toProxyUrl(f.founder_profile_pic) || '',
    })),
    keyAchievements: (data.key_achievements || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      achievementImage: toProxyUrl(a.achievement_image) || '',
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    publishedAt: data.published_at,
  };
};

const fetchStartupDetail = cache(async (slug: string): Promise<StartupDetail | null> => {
  if (!API_URL) {
    return null;
  }

  const token = process.env.API_BEARER_TOKEN;

  try {
    const detailResponse = await fetch(`${API_URL}/api/startups/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!detailResponse.ok) {
      console.error(`Failed to fetch ignite startup: ${detailResponse.status} ${detailResponse.statusText}`);
      return null;
    }

    const payload = await detailResponse.json();
    return normalizeStartupDetail(payload);
  } catch (error) {
    console.error('Error fetching ignite startup detail:', error);
    return null;
  }
});

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchStartupDetail(slug);

  if (!detail) {
    return {
      title: 'Ignite startup not found',
      robots: { index: false, follow: false },
    };
  }

  const description = detail.startupSummary?.trim() || `${detail.startupName} — Mesa Startup Lab Ignite founder.`;
  const ogImage = detail.companyHeaderImage || detail.companyLogo || undefined;
  const canonical = `/ignite/${detail.slug ?? slug}`;

  return {
    title: `${detail.startupName} — Ignite`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${detail.startupName} — MSL Ignite`,
      description,
      url: canonical,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, alt: detail.startupName }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${detail.startupName} — MSL Ignite`,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mesaschool.co';

const buildIgniteJsonLd = (detail: StartupDetail, slug: string) => {
  const canonical = `${SITE_URL}/ignite/${detail.slug ?? slug}`;
  const sameAs = [
    detail.socialMediaLinks?.linkedin,
    detail.socialMediaLinks?.twitter,
    detail.socialMediaLinks?.instagram,
    detail.socialMediaLinks?.facebook,
  ].filter((u): u is string => typeof u === 'string' && u.length > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: detail.startupName,
    url: detail.startupWebsite || canonical,
    description:
      detail.startupSummary?.trim() ||
      `${detail.startupName} — Mesa Startup Lab Ignite founder.`,
    ...(detail.companyLogo && { logo: detail.companyLogo }),
    ...(detail.companyHeaderImage && { image: detail.companyHeaderImage }),
    ...(detail.location && {
      address: { '@type': 'PostalAddress', addressLocality: detail.location },
    }),
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
      name: 'Mesa Startup Lab — Ignite',
      url: `${SITE_URL}/ignite`,
    },
  };
};

const buildIgniteBreadcrumbJsonLd = (detail: StartupDetail, slug: string) => ({
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
      name: 'Ignite',
      item: `${SITE_URL}/ignite`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: detail.startupName,
      item: `${SITE_URL}/ignite/${detail.slug ?? slug}`,
    },
  ],
});

const IgniteStartupDetailPage = async ({ params }: DetailPageProps) => {
  const { slug } = await params;
  const detail = await fetchStartupDetail(slug);

  if (!detail) {
    notFound();
  }

  const orgJsonLd = buildIgniteJsonLd(detail, slug);
  const breadcrumbJsonLd = buildIgniteBreadcrumbJsonLd(detail, slug);

  return (
    <div className="theme-ignite bg-msl-page min-h-screen">
      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      <div className="relative  w-full md:w-[75%] mx-auto min-h-screen pt-12 md:pt-20 text-white">
        <HeaderSection detail={detail} />

        <div className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <LeftColumnSection detail={detail} />
            <RightColumnSection detail={detail} />
          </div>
        </div>

        <div className="h-12 md:h-20" />
      </div>
    </div>
  );
};

export default IgniteStartupDetailPage;
