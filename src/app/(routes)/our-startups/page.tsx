'use client';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';

const OurStartupsPage = () => {
  return (
    <main className="min-h-screen bg-[#05070f] px-4 py-12 text-white sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <OurStartupsHeader />
        <StartupOverviewGrid />
      </div>
    </main>
  );
};

export default OurStartupsPage;