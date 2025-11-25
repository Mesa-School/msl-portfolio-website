import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Globe, Award, Target, Rocket, Share2, BarChart3, Users, TrendingUp, Lightbulb, Eye } from 'lucide-react';
import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';

type StartupDetail = {
  id: number | string;
  documentId: string;
  name: string;
  summary: string;
  overview?: string;
  problemGap?: string;
  keyProgress?: string;
  betterment?: string;
  vision?: string;
  location?: string;
  website?: string;
  cohort?: string;
  sector?: string;
  competitors?: string;
  founders: Array<{
    id: number | string;
    name: string;
    designation?: string | null;
    linkedin?: string | null;
    email?: string | null;
  }>;
  companyLogo?: string | null;
  companyHeader?: string | null;
  achievements: string[];
  social: {
    instagram?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  };
  revenue?: {
    isRevenue?: boolean;
    revenue?: string | null;
    current?: string | null;
  };
};

const pickImageUrl = (node: any) =>
  node?.url ??
  node?.data?.attributes?.url ??
  node?.data?.attributes?.formats?.large?.url ??
  node?.data?.attributes?.formats?.medium?.url ??
  node?.data?.attributes?.formats?.small?.url ??
  node?.data?.attributes?.formats?.thumbnail?.url ??
  node?.formats?.large?.url ??
  node?.formats?.medium?.url ??
  node?.formats?.small?.url ??
  node?.formats?.thumbnail?.url ??
  null;

const coalesceArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const normalizeStartupDetail = (payload: any): StartupDetail | null => {
  const source = payload?.data?.attributes ?? payload?.data ?? payload ?? null;
  if (!source) {
    return null;
  }

  const founderEntries = coalesceArray(source.founder);
  const founders = founderEntries.map((entry: any, idx: number) => {
    const node = entry?.attributes ?? entry ?? {};
    return {
      id: node?.id ?? entry?.id ?? idx,
      name: node?.name ?? 'Founder',
      designation: node?.designation ?? null,
      linkedin: node?.linkedin_url ?? null,
      email: node?.email ?? null,
    };
  });

  const achievements = coalesceArray(source.key_achievements).map(
    (entry: any) =>
      entry?.attributes?.achievement_summary ?? entry?.achievement_summary ?? null
  );

  return {
    id: source.id,
    documentId: source.documentId ?? `${source.id}`,
    name: source.startup_name ?? source.name ?? 'Untitled Startup',
    summary: source.startup_summary ?? 'Summary unavailable.',
    overview: source.startup_overview ?? null,
    problemGap: source.startup_problem_gap ?? null,
    betterment: source.startup_10x_betterment ?? null,
    vision: source.future_growth_vision ?? null,
    keyProgress: source.key_progress ?? null,
    location: source.location ?? null,
    website: source.startup_website ?? null,
    cohort: source.cohort ?? null,
    competitors: source.competitors ?? null,
    sector: source.sector?.data?.attributes?.name ?? source.sector?.name ?? null,
    founders,
    companyLogo: pickImageUrl(source.company_logo),
    companyHeader: pickImageUrl(source.company_header),
    achievements: achievements.filter(Boolean),
    social: {
      instagram: source.social_media_links?.instagram ?? null,
      linkedin: source.social_media_links?.linkedin ?? null,
      twitter: source.social_media_links?.twitter ?? null,
    },
    revenue: {
      isRevenue: source.revenue_status?.isRevenue ?? false,
      revenue: source.revenue_status?.revenue ?? null,
      current: source.revenue_status?.current_revenue ?? null,
    },
  };
};

const fetchStartupDetail = async (documentId: string) => {
  if (!API_URL || !AUTH_TOKEN) {
    return null;
  }

  const query =
    'populate[sector][fields]=name' +
    '&populate[founder][fields]=name,designation,linkedin_url,email' +
    '&populate[company_logo][fields]=url,formats' +
    '&populate[company_header][fields]=url,formats' +
    '&populate[social_media_links][fields]=instagram,linkedin,twitter' +
    '&populate[key_achievements][fields]=achievement_summary' +
    '&populate[revenue_status][fields]=isRevenue,revenue,current_revenue';

  const response = await fetch(`${API_URL}/startup2/${documentId}?${query}`, {
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

  const heroImage = detail.companyHeader ?? detail.companyLogo;

  return (
    <div className="relative min-h-screen mt-20 bg-[#05070f] text-white">
      {/* Navigation */}
      <nav className="">
        <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10 justify-between">
            <Link
              href="/our-startups"
              className="group flex items-center gap-2 text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Startups</span>
            </Link>
            {detail.website && (
              <a
                href={detail.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white hover:text-[#05070f]"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-80 w-[80%] mx-auto overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={detail.name}
            fill
            className="w-[80%] mx-auto object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#1c1f2d] to-[#05070f]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#05070f] via-transparent to-transparent" />
        
        {/* Logo Overlay */}
        {detail.companyLogo && (
          <div className="absolute bottom-6 left-8">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/40 bg-white/5 shadow-xl backdrop-blur">
              <Image
                src={detail.companyLogo}
                alt={`${detail.name} logo`}
                width={96}
                height={96}
                className="object-contain p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10  mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-[#0b0f1f] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.65)]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {detail.sector && (
                <span className="mb-3 inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
                  {detail.sector}
                </span>
              )}
              <h1 className="mb-3 text-4xl font-bold text-white">
                {detail.name}
              </h1>
              <p className="text-lg leading-relaxed text-white/70">
                {detail.summary}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-sm text-white/65">
            {detail.location && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-white/75">
                <MapPin className="h-4 w-4 text-white/50" />
                <span>{detail.location}</span>
              </div>
            )}
            {detail.cohort && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-white/75">
                <Award className="h-4 w-4 text-white/50" />
                <span>{detail.cohort}</span>
              </div>
            )}
            {detail.website && (
              <a
                href={detail.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/75 transition hover:bg-white hover:text-[#05070f]"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Social Links */}
          {(detail.social.instagram || detail.social.linkedin || detail.social.twitter) && (
            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              {detail.social.instagram && (
                <a
                  href={detail.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white hover:text-[#05070f]"
                >
                  Instagram
                </a>
              )}
              {detail.social.linkedin && (
                <a
                  href={detail.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white hover:text-[#05070f]"
                >
                  LinkedIn
                </a>
              )}
              {detail.social.twitter && (
                <a
                  href={detail.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white hover:text-[#05070f]"
                >
                  Twitter / X
                </a>
              )}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          {/* Main Content - Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview */}
            {detail.overview && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.45)]">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-white/60" />
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>
                <p className="leading-relaxed text-white/70">{detail.overview}</p>
              </section>
            )}

            {/* Problem & Gap */}
            {detail.problemGap && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.45)]">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-white/60" />
                  <h2 className="text-2xl font-bold text-white">Problem & Market Gap</h2>
                </div>
                <p className="leading-relaxed text-white/70">{detail.problemGap}</p>
              </section>
            )}

            {/* Solution / 10x Better */}
            {detail.betterment && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.45)]">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-6 w-6 text-white/60" />
                  <h2 className="text-2xl font-bold text-white">Why We're 10x Better</h2>
                </div>
                <p className="leading-relaxed text-white/70">{detail.betterment}</p>
              </section>
            )}

            {/* Vision */}
            {detail.vision && (
              <section className="rounded-3xl border border-white/15 bg-linear-to-br from-[#14172b] to-[#1f1335] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.55)]">
                <div className="mb-4 flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-purple-300" />
                  <h2 className="text-2xl font-bold text-white">Future Vision</h2>
                </div>
                <p className="leading-relaxed text-white/75">{detail.vision}</p>
              </section>
            )}

            {/* Competitors */}
            {detail.competitors && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-8 shadow-[0_35px_120px_rgba(5,7,15,0.45)]">
                <div className="mb-4 flex items-center gap-3">
                  <Users className="h-6 w-6 text-white/60" />
                  <h2 className="text-2xl font-bold text-white">Competitors</h2>
                </div>
                <p className="text-white/70">{detail.competitors}</p>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            {/* Revenue Metrics */}
            {detail.revenue?.isRevenue && (
              <section className="rounded-3xl border border-emerald-400/20 bg-linear-to-br from-[#0d1f1d] to-[#0c1a13] p-6 shadow-[0_35px_120px_rgba(5,7,15,0.45)]">
                <div className="mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-emerald-300" />
                  <h2 className="text-xl font-bold text-white">Revenue</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm text-white/50">Lifetime Revenue</p>
                    <p className="text-2xl font-bold text-emerald-300">
                      {formatCurrency(detail.revenue.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-white/50">Current Revenue</p>
                    <p className="text-2xl font-bold text-emerald-300">
                      {formatCurrency(detail.revenue.current)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Key Progress */}
            {detail.keyProgress && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-6 shadow-[0_35px_120px_rgba(5,7,15,0.35)]">
                <div className="mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-white/60" />
                  <h2 className="text-xl font-bold text-white">Key Progress</h2>
                </div>
                <p className="leading-relaxed text-white/70">{detail.keyProgress}</p>
              </section>
            )}

            {/* Achievements */}
            {detail.achievements.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-6 shadow-[0_35px_120px_rgba(5,7,15,0.35)]">
                <div className="mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-white/60" />
                  <h2 className="text-xl font-bold text-white">Key Achievements</h2>
                </div>
                <ul className="space-y-3">
                  {detail.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                      <span className="text-sm leading-relaxed text-white/70">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Founding Team */}
            {detail.founders.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-[#0b0f1f] p-6 shadow-[0_35px_120px_rgba(5,7,15,0.35)]">
                <div className="mb-4 flex items-center gap-3">
                  <Users className="h-6 w-6 text-white/60" />
                  <h2 className="text-xl font-bold text-white">Founding Team</h2>
                </div>
                <div className="space-y-4">
                  {detail.founders.map((founder) => (
                    <div key={founder.id} className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{founder.name}</p>
                        <p className="text-sm text-white/60">{founder.designation ?? 'Founder'}</p>
                        {founder.email && (
                          <p className="mt-1 text-xs text-white/40">{founder.email}</p>
                        )}
                      </div>
                      {founder.linkedin && (
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 transition hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailPage;