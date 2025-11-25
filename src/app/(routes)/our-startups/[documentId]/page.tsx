import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Globe, Award, Target, Rocket, Share2, BarChart3, LinkIcon } from 'lucide-react';

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
  founders: Array<{
    id: number | string;
    name: string;
    designation?: string | null;
    linkedin?: string | null;
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
    };
  });

  const achievements = coalesceArray(source.key_achievements).map(
    (entry: any) =>
      entry?.attributes?.achievement_summary ??
      entry?.achievement_summary ??
      null,
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
    sector:
      source.sector?.data?.attributes?.name ??
      source.sector?.name ??
      null,
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
      isRevenue: source.revenue_status?.isRevenue ?? null,
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
    '&populate[founder][fields]=name,designation,linkedin_url' +
    '&populate[company_logo][fields]=url,formats' +
    '&populate[company_header][fields]=url,formats' +
    '&populate[social_media_links][fields]=instagram,linkedin,twitter' +
    '&populate[key_achievements][fields]=achievement_summary' +
    '&populate[revenue_status][fields]=isRevenue,revenue,current_revenue';

  const response = await fetch(
    `${API_URL}/startup2/${documentId}?${query}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return normalizeStartupDetail(payload);
};

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_80px_rgba(5,7,15,0.65)] backdrop-blur">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <div className="mt-3 text-sm text-white/80">{children}</div>
  </section>
);

const FoundersList = ({ founders }: { founders: StartupDetail['founders'] }) => {
  if (!founders.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_80px_rgba(5,7,15,0.65)] backdrop-blur">
      <h3 className="text-xl font-semibold text-white">Founding Team</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {founders.map((founder) => (
          <div
            key={founder.id}
            className="rounded-2xl border border-white/10 bg-[#05070f]/60 p-4"
          >
            <p className="text-lg font-semibold">{founder.name}</p>
            <p className="text-sm text-white/60">
              {founder.designation ?? 'Founder'}
            </p>
            {founder.linkedin && (
              <Link
                href={founder.linkedin}
                className="mt-2 inline-flex items-center gap-2 text-sm text-white/70 underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4" /> LinkedIn
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const SocialLinks = ({
  social,
}: {
  social: StartupDetail['social'];
}) => {
  const links = [
    { label: 'Instagram', href: social.instagram },
    { label: 'LinkedIn', href: social.linkedin },
    { label: 'Twitter / X', href: social.twitter },
  ].filter((item) => item.href);

  if (!links.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white hover:text-[#05070f]"
        >
          <Share2 className="h-4 w-4" /> {link.label}
        </Link>
      ))}
    </div>
  );
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
    <main className="relative min-h-screen mt-20 bg-[#05070f] px-4 py-10 text-white sm:px-8 lg:px-16">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-10 top-20 h-72 w-72 rounded-full bg-[#5d5cff]/30 blur-[160px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#ff5dc8]/25 blur-[180px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex items-center gap-4 text-sm text-white/60">
          <Link
            href="/our-startups"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Startups
          </Link>
          {detail.website && (
            <Link
              href={detail.website}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white hover:text-[#05070f]"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" /> Visit Website
            </Link>
          )}
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_35px_120px_rgba(5,7,15,0.65)]">
          <div className="relative h-72 w-full">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={`${detail.name} hero`}
                fill
                className="object-cover opacity-80"
                priority
              />
            ) : (
              <div className="h-full w-full bg-linear-to-r from-[#15192a] to-[#0a0c14]" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#05070f] via-[#05070f]/60 to-transparent" />
            {detail.companyLogo && (
              <div className="absolute -bottom-12 left-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 p-4 shadow-lg backdrop-blur">
                <Image
                  src={detail.companyLogo}
                  alt={`${detail.name} logo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
          <div className="px-6 pb-8 pt-16 sm:px-10">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              {detail.sector ?? 'Emerging Sector'}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white sm:text-[46px]">
              {detail.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-white/75">
              {detail.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
              {detail.location && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                  <MapPin className="h-4 w-4" /> {detail.location}
                </span>
              )}
              {detail.cohort && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                  <Target className="h-4 w-4" /> {detail.cohort}
                </span>
              )}
              {detail.website && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                  <Globe className="h-4 w-4" /> Website Live
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <DetailSection title="Overview">
            {detail.overview ?? 'Overview coming soon.'}
          </DetailSection>
          <DetailSection title="Key Progress">
            {detail.keyProgress ?? 'Progress metrics are being updated.'}
          </DetailSection>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DetailSection title="Problem / Market Gap">
            {detail.problemGap ?? 'Problem statement not provided yet.'}
          </DetailSection>
          <DetailSection title="10x Betterment">
            {detail.betterment ?? 'Differentiation details coming soon.'}
          </DetailSection>
        </div>

        <DetailSection title="Future Growth Vision">
          {detail.vision ?? 'Vision statement is being crafted.'}
        </DetailSection>

        <div className="grid gap-6 lg:grid-cols-3">
          <DetailSection title="Revenue Snapshot">
            {detail.revenue?.isRevenue ? (
              <ul className="space-y-1 text-sm text-white/80">
                <li>
                  <span className="text-white/60">Lifetime Revenue:</span>{' '}
                  {detail.revenue.revenue ?? '—'}
                </li>
                <li>
                  <span className="text-white/60">Current Revenue:</span>{' '}
                  {detail.revenue.current ?? '—'}
                </li>
              </ul>
            ) : (
              'Pre-revenue or undisclosed.'
            )}
          </DetailSection>
          <DetailSection title="Key Achievements">
            {detail.achievements.length ? (
              <ul className="space-y-3 text-sm">
                {detail.achievements.map((achievement, idx) => (
                  <li
                    key={`achievement-${idx}`}
                    className="inline-flex items-start gap-2"
                  >
                    <Award className="mt-1 h-4 w-4 text-white/50" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              'Achievements will appear here once shared.'
            )}
          </DetailSection>
          <DetailSection title="Social Presence">
            <SocialLinks social={detail.social} />
          </DetailSection>
        </div>

        <FoundersList founders={detail.founders} />
      </div>
    </main>
  );
};

export default StartupDetailPage;

