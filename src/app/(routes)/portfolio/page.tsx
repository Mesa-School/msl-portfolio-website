import type { Metadata } from 'next';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';
import { fetchStartupsAction } from '@/actions/fetchStartups';
import { trackBySlug } from '@/lib/track';
import { buildPortfolioMetadata } from '@/lib/portfolioMeta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ track?: string }>;
};

export async function generateMetadata(
  { searchParams }: PageProps,
): Promise<Metadata> {
  const { track } = await searchParams;
  return buildPortfolioMetadata(track);
}

const OurStartupsPage = async ({ searchParams }: PageProps) => {
  const { track } = await searchParams;
  const entry = trackBySlug(track);
  const tracksForApi = entry ? [entry.apiValue] : [];

  const { startups, pagination } = await fetchStartupsAction(1, [], tracksForApi);

  return (
    <PortfolioFilterProvider initialTracks={tracksForApi}>
      <main className="min-h-screen bg-msl-page text-white px-4 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <OurStartupsHeader />
          <StartupOverviewGrid
            initialStartups={startups}
            initialPagination={pagination}
          />
        </div>
      </main>
    </PortfolioFilterProvider>
  );
};

export default OurStartupsPage;
