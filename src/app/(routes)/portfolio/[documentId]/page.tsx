import { notFound } from 'next/navigation';

import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';
import type { StartupDetail } from '@/types/startupDetail';
import { HeaderSection, LeftColumnSection, RightColumnSection } from '@/components/PortfolioDetail';

const normalizeStartupDetail = (payload: any): StartupDetail => {
  const data = payload.data;
  return {
    id: data.id,
    documentId: data.documentId,
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
          company_name: competitor.company_name,
          company_logo: competitor.company_logo,
          company_website: competitor.company_website,
        }))
      : [],
    startup10xBetterment: data.startup_10x_betterment,
    futureGrowthVision: data.future_growth_vision,
    cohort: data.cohort,
    sector: {
      name: data.sector?.name || 'N/A',
      description: data.sector?.description,
    },
    companyLogo: data.company_logo?.url || '',
    companyHeader: data.company_header?.url || '',
    socialMediaLinks: {
      instagram: data.social_media_links?.instagram,
      linkedin: data.social_media_links?.linkedin,
      twitter: data.social_media_links?.twitter,
    },
    revenueStatus: {
      isRevenue: data.revenue_status?.isRevenue || false,
      revenue: data.revenue_status?.revenue || '0',
      currentRevenue: data.revenue_status?.current_revenue || '0',
    },
    founders: (data.founder || []).map((f: any) => ({
      name: f.name,
      designation: f.designation,
      linkedinUrl: f.linkedin_url,
      email: f.email,
      profileImage: f.profile_image?.url || '',
    })),
    keyAchievements: (data.key_achievements || []).map((a: any) => ({
      achievementSummary: a.achievement_summary,
      achievementImage: a.achievement_image?.url || '',
    })),
  };
};

const fetchStartupDetail = async (documentId: string): Promise<StartupDetail | null> => {
  if (!API_URL || !AUTH_TOKEN) {
    return null;
  }

  const response = await fetch(`${API_URL}/startup2/${documentId}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    cache: 'no-store',
  });

  console.log("Fetch the Startup Detailed Data", response);
  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return normalizeStartupDetail(payload);
};

type DetailPageProps = {
  params: Promise<{ documentId: string }>;
};

const StartupDetailPage = async ({ params }: DetailPageProps) => {
  const { documentId } = await params;
  const detail = await fetchStartupDetail(documentId);
  console.log("Startup Detailed Data", detail);

  if (!detail) {
    notFound();
  }

  return (
    <div className="relative w-full md:w-[75%] mx-auto min-h-screen mt-12 md:mt-20 text-white">
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