import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';
import { fetchStartupsAction } from '@/actions/fetchStartups';

const OurStartupsPage = async () => {
  const { startups, pagination } = await fetchStartupsAction(1, []);

  return (
    <PortfolioFilterProvider>
      <main className="min-h-screen bg-[#0b1818] px-4 py-12 text-white sm:px-8 lg:px-16">
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
