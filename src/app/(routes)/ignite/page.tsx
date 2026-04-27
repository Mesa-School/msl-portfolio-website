import type { Metadata } from 'next';

import { IgniteHeader } from '@/components/Ignite/IgniteHeader';
import { IgniteStartupGrid } from '@/components/Ignite/IgniteStartupGrid';
import { IgniteFilterProvider } from '@/contexts/IgniteFilterContext';
import { fetchIgniteStartupsAction } from '@/actions/fetchIgniteStartups';

const IGNITE_DESCRIPTION =
  'Mesa Startup Lab — Ignite spotlights the next wave of student founders across D2C, AI, and services tracks.';

export const metadata: Metadata = {
  title: 'Ignite',
  description: IGNITE_DESCRIPTION,
  alternates: { canonical: '/ignite' },
  openGraph: {
    title: 'MSL Ignite',
    description: IGNITE_DESCRIPTION,
    url: '/ignite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSL Ignite',
    description: IGNITE_DESCRIPTION,
  },
};

const IgniteStartupsPage = async () => {
  const { startups, pagination } = await fetchIgniteStartupsAction(1, '');

  return (
    <IgniteFilterProvider>
      <main className="theme-ignite min-h-screen bg-msl-page px-4 py-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <IgniteHeader />
          <IgniteStartupGrid
            initialStartups={startups}
            initialPagination={pagination}
          />
        </div>
      </main>
    </IgniteFilterProvider>
  );
};

export default IgniteStartupsPage;
