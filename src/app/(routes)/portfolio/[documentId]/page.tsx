import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Globe, Award, Target, Rocket, Share2, BarChart3, Users, TrendingUp, Lightbulb, Eye, Linkedin, Instagram } from 'lucide-react';
import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';

// Type definitions
interface StartupDetail {
  id: number;
  documentId: string;
  startupName: string;
  name: string;
  startupSummary: string;
  startupOverview: string;
  startupProblemGap: string;
  location: string;
  startupWebsite: string;
  keyProgress: string;
  competitors: string;
  startup10xBetterment: string;
  futureGrowthVision: string;
  cohort: string;
  sector: {
    name: string;
    description?: string;
  };
  companyLogo: string;
  companyHeader: string;
  socialMediaLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  revenueStatus: {
    isRevenue: boolean;
    revenue: string;
    currentRevenue: string;
  };
  founders: Array<{
    name: string;
    designation: string;
    linkedinUrl: string;
    email?: string;
    profileImage: string;
  }>;
  keyAchievements: Array<{
    achievementSummary: string;
    achievementImage: string;
  }>;
}

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
    competitors: data.competitors,
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

const fetchStartupDetail = async (documentId: string) => {
  if (!API_URL || !AUTH_TOKEN) {
    return null;
  }
  const response = await fetch(`${API_URL}/startup2/${documentId}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }
  const payload = await response.json();
  return normalizeStartupDetail(payload);
};

const formatCurrency = (value: string | null | undefined) => {
  if (!value) return '—';
  const num = parseFloat(value.replace(/,/g, ''));
  if (isNaN(num)) return value;
  return `₹${num.toLocaleString('en-IN')}`;
};

type DetailPageProps = {
  params: Promise<{ documentId: string }>;
};

const StartupDetailPage = async ({ params }: DetailPageProps) => {
  const { documentId } = await params;
  const detail = await fetchStartupDetail(documentId);

  if (!detail) {
    notFound();
  }

  const heroImage = detail.companyHeader || detail.companyLogo;

  return (
    <div className="relative w-full md:w-[75%] mx-auto min-h-screen mt-12 md:mt-20 text-white px-4 md:px-0">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Link 
          href="/portfolio" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm md:text-base">Back to Startups</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[250px] md:h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#05070f]" />
        {heroImage && (
          <Image
            src={heroImage}
            alt={detail.startupName}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Company Header Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                {detail.companyLogo && (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                    <Image
                      src={detail.companyLogo}
                      alt={detail.startupName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="w-full">
                      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white">
                        {detail.startupName}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                          {detail.location}
                        </span>
                        <span className="px-2 md:px-3 py-1 bg-white/10 text-white/80 rounded-full border border-white/20">
                          {detail.cohort}
                        </span>
                        <span className="px-2 md:px-3 py-1 bg-white/10 text-white/80 rounded-full border border-white/20">
                          {detail.sector.name}
                        </span>
                      </div>
                    </div>
                    {detail.startupWebsite && (
                      <Link 
                        href={detail.startupWebsite}
                        target="_blank"
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm md:text-base"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Visit Website</span>
                        <span className="sm:hidden">Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
                    {detail.startupSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Overview</h2>
              </div>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {detail.startupOverview}
              </p>
            </div>

            {/* Problem & Solution */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Problem & Solution</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">The Problem</h3>
                  <p className="text-white/80 leading-relaxed text-sm md:text-base">
                    {detail.startupProblemGap}
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Our Advantage</h3>
                  <p className="text-white/80 leading-relaxed text-sm md:text-base">
                    {detail.startup10xBetterment}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision & Growth */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Future Vision</h2>
              </div>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {detail.futureGrowthVision}
              </p>
            </div>

            {/* Key Achievements */}
            {detail.keyAchievements.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">Key Achievements</h2>
                </div>
                <div className="space-y-6">
                  {detail.keyAchievements.map((achievement, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 items-start">
                      {achievement.achievementImage && (
                        <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={achievement.achievementImage}
                            alt="Achievement"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                          {achievement.achievementSummary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Revenue Stats */}
            {detail.revenueStatus.isRevenue && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Revenue</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs md:text-sm text-white/80 mb-1">Total Revenue</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      {formatCurrency(detail.revenueStatus.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/80 mb-1">Current Monthly</p>
                    <p className="text-xl md:text-2xl font-bold text-white">
                      {formatCurrency(detail.revenueStatus.currentRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Progress */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <h3 className="text-lg md:text-xl font-bold text-white">Key Progress</h3>
              </div>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                {detail.keyProgress}
              </p>
            </div>

            {/* Founders */}
            {detail.founders.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Founders</h3>
                </div>
                <div className="space-y-4">
                  {detail.founders.map((founder, index) => (
                    <div key={index} className="flex items-center gap-3 md:gap-4">
                      {founder.profileImage && (
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                          <Image
                            src={founder.profileImage}
                            alt={founder.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm md:text-base truncate">{founder.name}</h4>
                        <p className="text-xs md:text-sm text-white/80 truncate">{founder.designation}</p>
                        {founder.linkedinUrl && (
                          <Link 
                            href={founder.linkedinUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white mt-1"
                          >
                            <Linkedin className="w-3 h-3" />
                            LinkedIn
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competition */}
            {detail.competitors && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Competition</h3>
                </div>
                <p className="text-white/80 text-xs md:text-sm">
                  {detail.competitors}
                </p>
              </div>
            )}

            {/* Social Links */}
            {(detail.socialMediaLinks.instagram || detail.socialMediaLinks.linkedin) && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h3 className="text-lg md:text-xl font-bold text-white">Connect</h3>
                </div>
                <div className="flex gap-3">
                  {detail.socialMediaLinks.instagram && (
                    <Link
                      href={detail.socialMediaLinks.instagram}
                      target="_blank"
                      className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </Link>
                  )}
                  {detail.socialMediaLinks.linkedin && (
                    <Link
                      href={detail.socialMediaLinks.linkedin}
                      target="_blank"
                      className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12 md:h-20" />
    </div>
  );
};

export default StartupDetailPage;