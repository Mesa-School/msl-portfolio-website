'use client';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';

const OurStartupsPage = () => {
  return (
    <PortfolioFilterProvider>
      <main className="min-h-screen bg-[#05070f] px-4 py-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <OurStartupsHeader />
          <StartupOverviewGrid />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#5d5cff]/40 blur-[150px]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ff5dc8]/30 blur-[140px]" />
        </div>
      </main>
    </PortfolioFilterProvider>
  );
};

export default OurStartupsPage;