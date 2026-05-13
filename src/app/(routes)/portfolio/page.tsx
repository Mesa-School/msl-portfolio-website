import type { Metadata } from 'next';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';
import { fetchStartupsAction } from '@/actions/fetchStartups';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PORTFOLIO_DESCRIPTION =
  'Explore the Mesa Startup Lab portfolio — student- and early-stage founders building across D2C, AI, services and more.';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'MSL Portfolio',
    description: PORTFOLIO_DESCRIPTION,
    url: '/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSL Portfolio',
    description: PORTFOLIO_DESCRIPTION,
  },
};

const OurStartupsPage = async () => {
  const { startups, pagination } = await fetchStartupsAction(1, []);

  return (
    <PortfolioFilterProvider>
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
