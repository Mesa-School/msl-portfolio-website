'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import { Startup, StartupOverviewCard } from './StartupOverviewCard';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';
import { reorderStartups } from '@/utils/startupOrdering';

const pickLogoUrl = (source: any, fallback?: any) =>
  source?.company_logo?.url ??
  source?.company_logo?.data?.attributes?.url ??
  source?.company_logo?.data?.attributes?.formats?.thumbnail?.url ??
  fallback?.company_logo?.url ??
  fallback?.company_logo?.data?.attributes?.url ??
  source?.company_logo ??
  null;

const pickFounders = (source: any) => {
  const founderCollection = Array.isArray(source?.founder?.data)
    ? source?.founder?.data
    : Array.isArray(source?.founder)
      ? source?.founder
      : Array.isArray(source?.founders)
        ? source?.founders
        : [];

  return founderCollection.map((entry: any, index: number) => {
    // If entry is a string (founder name), convert it to founder object
    if (typeof entry === 'string') {
      return {
        id: index,
        name: entry,
        designation: null,
      };
    }

    // Otherwise handle as object
    const node = entry?.attributes ?? entry;
    return {
      id: node?.id ?? entry?.id ?? index,
      name: node?.name ?? 'Founder',
      designation: node?.designation ?? null,
    };
  });
};

const normalizeStartups = (payload: any): Startup[] =>
  (payload?.data ?? []).map((item: any, index: number) => {
    const source = item?.attributes ?? item;
    const founders = pickFounders(source);
    const sectorName =
      source?.sector?.name ??
      source?.sector?.data?.attributes?.name ??
      item?.sector?.name ??
      source?.sector_name ??
      item?.sector_name ??
      null;

    return {
      id: item?.id ?? index,
      documentId: item?.documentId ?? `${item?.id ?? index}`,
      slug: item?.slug ?? source?.slug ?? null,
      name: source?.startup_name ?? 'Untitled Startup',
      summary: source?.startup_summary ?? '',
      location: source?.location ?? null,
      cohort: source?.cohort ?? null,
      sectorName,
      logoUrl: pickLogoUrl(source, item),
      founders,
    };
  });

export const StartupOverviewGrid = () => {
  const { selectedSectors, searchTerm } = usePortfolioFilters();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchStartups = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();

        // Add sector filters if any are selected
        if (selectedSectors.length > 0) {
          selectedSectors.forEach((sector) => {
            params.append('sector', sector);
          });
        }

        const queryString = params.toString();
        const url = `/api/startups${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to load startups');
        }

        if (isMounted) {
          setStartups(normalizeStartups(payload));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to fetch startups right now.',
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStartups();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedSectors]);

  // Filter startups based on search term (sectors are filtered on backend)
  const filteredStartups = useMemo(() => {
    let filtered = [...startups];

    // Filter by search term only (client-side)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((startup) => {
        const matchesName = startup.name.toLowerCase().includes(searchLower);
        const matchesSummary = startup.summary.toLowerCase().includes(searchLower);
        const matchesLocation = startup.location?.toLowerCase().includes(searchLower);
        const matchesFounders = startup.founders.some((founder) =>
          founder.name.toLowerCase().includes(searchLower)
        );
        const matchesSector = startup.sectorName?.toLowerCase().includes(searchLower);
        const matchesCohort = startup.cohort?.toLowerCase().includes(searchLower);

        return matchesName || matchesSummary || matchesLocation || matchesFounders || matchesSector || matchesCohort;
      });
    }

    // Apply custom ordering
    return reorderStartups(filtered);
  }, [startups, searchTerm]);

  return (
    <section className="relative mx-auto mt-20 flex w-full flex-col gap-10 overflow-hidden ">
     
      {/* <motion.div
        className="relative flex flex-col gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Startup Overview
        </p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Meet the founders building the future
        </h2>
        <p className="text-base text-white/70">
          Profiles are updated live from Strapi so you always see the latest companies in
          the lab.
        </p>
      </motion.div> */}

      {loading && (
        <div className="relative grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <StartupOverviewCard
              key={`startup-skeleton-${idx}`}
              index={idx}
              isLoading
              startup={{
                id: idx,
                documentId: `skeleton-${idx}`,
                slug: null,
                name: '',
                summary: '',
                location: '',
                cohort: '',
                sectorName: '',
                logoUrl: null,
                founders: [],
              }}
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="relative rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && startups.length === 0 && (
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
          Startups will appear here once they are published in Strapi.
        </div>
      )}

      {!loading && !error && startups.length > 0 && filteredStartups.length === 0 && (
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
          No startups found matching your filters. Try adjusting your search or sector selection.
        </div>
      )}

      <div className="relative grid gap-6 md:grid-cols-2">
        {filteredStartups.map((startup, index) => (
          <StartupOverviewCard key={startup.documentId ?? `${startup.id}`} startup={startup} index={index} />
        ))}
      </div>
    </section>
  );
};


