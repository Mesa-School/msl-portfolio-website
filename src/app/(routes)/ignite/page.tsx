import { IgniteHeader } from '@/components/Ignite/IgniteHeader';
import { IgniteStartupGrid } from '@/components/Ignite/IgniteStartupGrid';
import { IgniteFilterProvider } from '@/contexts/IgniteFilterContext';
import { fetchIgniteStartupsAction } from '@/actions/fetchIgniteStartups';

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
