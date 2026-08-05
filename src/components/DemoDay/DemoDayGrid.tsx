'use client';

import { useMemo } from 'react';

import { Startup, StartupOverviewCard } from '@/components/OurStartups/StartupOverviewCard';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';

type DemoDayGridProps = {
  startups: Startup[];
};

/**
 * The Demo Day line-up is 13 fixed startups, so the whole set is fetched once on
 * the server and every filter runs in memory here. No pagination, no infinite
 * scroll, and switching tracks costs nothing.
 */
export const DemoDayGrid = ({ startups }: DemoDayGridProps) => {
  const { selectedSectors, selectedTracks, searchTerm } = usePortfolioFilters();

  const filteredStartups = useMemo(() => {
    let filtered = startups;

    if (selectedTracks.length > 0) {
      filtered = filtered.filter(
        (startup) => startup.serviceTrack && selectedTracks.includes(startup.serviceTrack),
      );
    }

    if (selectedSectors.length > 0) {
      filtered = filtered.filter(
        (startup) => startup.sectorName && selectedSectors.includes(startup.sectorName),
      );
    }

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(
        (startup) =>
          startup.name.toLowerCase().includes(term) ||
          startup.summary.toLowerCase().includes(term) ||
          startup.location?.toLowerCase().includes(term) ||
          startup.founders.some((founder) => founder.name.toLowerCase().includes(term)) ||
          startup.sectorName?.toLowerCase().includes(term) ||
          startup.cohort?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [startups, selectedSectors, selectedTracks, searchTerm]);

  if (filteredStartups.length === 0) {
    return (
      <section className="relative mx-auto mt-20 w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
          No Demo Day startups match your filters. Try another track or clear the search.
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto mt-20 flex w-full flex-col gap-10">
      <div className="relative grid gap-6 md:grid-cols-2">
        {filteredStartups.map((startup, index) => (
          <StartupOverviewCard
            key={startup.documentId ?? `${startup.id}`}
            startup={startup}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
