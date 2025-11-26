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
    <div className="relative md:w-[75%] mx-auto min-h-screen mt-20 text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/portfolio" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Startups
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
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
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Header Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-start gap-6">
                {detail.companyLogo && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-purple-500/20">
                    <Image
                      src={detail.companyLogo}
                      alt={detail.startupName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {detail.startupName}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {detail.location}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                          {detail.cohort}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                          {detail.sector.name}
                        </span>
                      </div>
                    </div>
                    {detail.startupWebsite && (
                      <Link 
                        href={detail.startupWebsite}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-4 text-gray-300 text-lg leading-relaxed">
                    {detail.startupSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">Overview</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {detail.startupOverview}
              </p>
            </div>

            {/* Problem & Solution */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">Problem & Solution</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">The Problem</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {detail.startupProblemGap}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Our Advantage</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {detail.startup10xBetterment}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision & Growth */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Future Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {detail.futureGrowthVision}
              </p>
            </div>

            {/* Key Achievements */}
            {detail.keyAchievements.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold">Key Achievements</h2>
                </div>
                <div className="space-y-6">
                  {detail.keyAchievements.map((achievement, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      {achievement.achievementImage && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={achievement.achievementImage}
                            alt="Achievement"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-gray-300 leading-relaxed">
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
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-green-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold">Revenue</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-400">
                      {formatCurrency(detail.revenueStatus.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Current Monthly</p>
                    <p className="text-2xl font-bold text-green-300">
                      {formatCurrency(detail.revenueStatus.currentRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Progress */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Key Progress</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {detail.keyProgress}
              </p>
            </div>

            {/* Founders */}
            {detail.founders.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">Founders</h3>
                </div>
                <div className="space-y-4">
                  {detail.founders.map((founder, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {founder.profileImage && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500/20 flex-shrink-0">
                          <Image
                            src={founder.profileImage}
                            alt={founder.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{founder.name}</h4>
                        <p className="text-sm text-gray-400">{founder.designation}</p>
                        {founder.linkedinUrl && (
                          <Link 
                            href={founder.linkedinUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
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
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold">Competition</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {detail.competitors}
                </p>
              </div>
            )}

            {/* Social Links */}
            {(detail.socialMediaLinks.instagram || detail.socialMediaLinks.linkedin) && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="w-6 h-6 text-pink-400" />
                  <h3 className="text-xl font-bold">Connect</h3>
                </div>
                <div className="flex gap-3">
                  {detail.socialMediaLinks.instagram && (
                    <Link
                      href={detail.socialMediaLinks.instagram}
                      target="_blank"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </Link>
                  )}
                  {detail.socialMediaLinks.linkedin && (
                    <Link
                      href={detail.socialMediaLinks.linkedin}
                      target="_blank"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
};

export default StartupDetailPage;