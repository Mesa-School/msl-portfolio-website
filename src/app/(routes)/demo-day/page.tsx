import type { Metadata } from 'next';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { DemoDayGrid } from '@/components/DemoDay/DemoDayGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';
import { fetchDemoDayStartupsAction } from '@/actions/fetchDemoDayStartups';
import { DEMO_DAY } from '@/lib/demoDay';
import { trackBySlug } from '@/lib/track';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ track?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { track } = await searchParams;
  const entry = trackBySlug(track);

  if (entry) {
    return buildPageMetadata(
      `${DEMO_DAY.eyebrow} — ${entry.label}`,
      `${DEMO_DAY.description} Filtered to the ${entry.label}.`,
      `/demo-day?track=${entry.slug}`,
    );
  }

  const meta = buildPageMetadata(
    DEMO_DAY.eyebrow,
    DEMO_DAY.description,
    '/demo-day',
  );

  // Unknown junk param — keep crawlers off endless param permutations.
  if (typeof track === 'string' && track.length > 0) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
}

const DemoDayPage = async ({ searchParams }: PageProps) => {
  const { track } = await searchParams;
  const entry = trackBySlug(track);
  const tracksForFilter = entry ? [entry.apiValue] : [];

  const { startups, missingSlugs, error } = await fetchDemoDayStartupsAction();

  if (missingSlugs.length > 0) {
    console.warn(
      `[demo-day] ${missingSlugs.length} line-up slug(s) not returned by the API:`,
      missingSlugs.join(', '),
    );
  }

  return (
    <PortfolioFilterProvider initialTracks={tracksForFilter}>
      <main className="min-h-screen bg-msl-page text-white px-4 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <OurStartupsHeader
            basePath="/demo-day"
            eyebrow={DEMO_DAY.eyebrow}
            titleLead={DEMO_DAY.titleLead}
            titleAccent={DEMO_DAY.titleAccent}
            subtitle={DEMO_DAY.subtitle}
          />

          {error ? (
            <section className="relative mx-auto mt-20 w-full">
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-200">
                {error}
              </div>
            </section>
          ) : (
            <DemoDayGrid startups={startups} />
          )}

          {missingSlugs.length > 0 && (
            <p className="mt-16 text-center text-xs text-white/35">
              Some line-up entries are still being published.
            </p>
          )}

          <div className="pb-16" />
        </div>
      </main>
    </PortfolioFilterProvider>
  );
};

export default DemoDayPage;
