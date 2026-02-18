'use client';
import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';

const OurStartupsPage = () => {

  const router = useRouter();
  
    useEffect(() => {
      router.replace('/maintenance');
    }, [router]);
  
  return (
    <PortfolioFilterProvider>
      <main className="min-h-screen bg-[#0b1818] px-4 py-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <OurStartupsHeader />
          <StartupOverviewGrid />
        </div>
      </main>
    </PortfolioFilterProvider>
  );
};

export default OurStartupsPage;