import { notFound } from 'next/navigation';

import { API_URL } from '@/config/apiUrl';
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
          competitor_image: competitor.competitor_image,
          competitor_website: competitor.competitor_website,
        }))
      : [],
    startup10xBetterment: data.startup_10x_betterment,
    futureGrowthVision: data.future_growth_vision,
    cohort: data.cohort,
    sector: {
      name: data.sector?.name || 'N/A',
    },
    companyLogo: data.company_logo || '',
    companyHeaderImage: data.company_header_image || '',
    socialMediaLinks: {
      instagram: data.social_media_links?.instagram,
      linkedin: data.social_media_links?.linkedin,
      twitter: data.social_media_links?.twitter,
      facebook: data.social_media_links?.facebook,
    },
    revenueStatus: {
      isGeneratingRevenue: data.revenue_status?.is_generating_revenue || false,
      revenueDetails: data.revenue_status?.revenue_details || null,
    },
    founders: (data.founder || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      linkedin: f.linkedin,
      email: f.email,
      bio: f.bio,
      founderProfilePic: f.founder_profile_pic || '',
    })),
    keyAchievements: (data.key_achievements || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      achievementImage: a.achievement_image || '',
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    publishedAt: data.published_at,
  };
};

const fetchStartupDetail = async (slug: string): Promise<StartupDetail | null> => {
  if (!API_URL) {
    return null;
  }

  // First, fetch all startups to find the ID for this slug
  const listResponse = await fetch(`${API_URL}/api/startups?limit=100`, {
    cache: 'no-store',
  });

  if (!listResponse.ok) {
    return null;
  }

  const listPayload = await listResponse.json();
  const startup = listPayload.data?.find((s: any) => s.slug === slug);

  if (!startup) {
    return null;
  }

  // Now fetch the detailed data using the ID
  const detailResponse = await fetch(`${API_URL}/api/startups/${startup.id}`, {
    cache: 'no-store',
  });

  console.log("Fetch the Startup Detailed Data", detailResponse);
  if (!detailResponse.ok) {
    return null;
  }

  const payload = await detailResponse.json();
  return normalizeStartupDetail(payload);
};

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

const StartupDetailPage = async ({ params }: DetailPageProps) => {
  const { slug } = await params;
  const detail = await fetchStartupDetail(slug);
  console.log("Startup Detailed Data", detail);

  if (!detail) {
    notFound();
  }

  return (
    <div className="relative  w-full md:w-[75%] mx-auto min-h-screen mt-12 md:mt-20 text-white">
      <HeaderSection detail={detail} />

      <div className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <LeftColumnSection detail={detail} />
          <RightColumnSection detail={detail} />
        </div>
      </div>

      <div className="h-12 md:h-20" />
    </div>
  );
};

export default StartupDetailPage;