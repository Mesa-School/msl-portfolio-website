'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import { Startup, StartupOverviewCard } from './StartupOverviewCard';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';
import { fetchStartupsAction } from '@/actions/fetchStartups';
import type { PaginationData } from '@/actions/fetchStartups';

const DEFAULT_PAGINATION: PaginationData = { 
  total: 0, 
  page: 1, 
  limit: 10, 
  total_pages: 1 
};

type Props = {
  initialStartups?: Startup[];
  initialPagination?: PaginationData;
};

export const StartupOverviewGrid = ({
  initialStartups = [],
  initialPagination = DEFAULT_PAGINATION,
}: Props) => {
  const { selectedSectors, selectedTracks, searchTerm } = usePortfolioFilters();
  const [startups, setStartups] = useState<Startup[]>(initialStartups);
  const [loading, setLoading] = useState(initialStartups.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.page < initialPagination.total_pages);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const skipFirstFetch = useRef(initialStartups.length > 0);

  // Reset everything when filters change
  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setStartups([]);
      setCurrentPage(1);
      try {
        const result = await fetchStartupsAction(1, selectedSectors, selectedTracks);
        if (result.error) throw new Error(result.error);
        if (isMounted) {
          setStartups(result.startups);
          setHasMore(result.pagination.page < result.pagination.total_pages);
          setCurrentPage(result.pagination.page);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to fetch startups right now.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [selectedSectors, selectedTracks]);

  // Load next page (append)
  const loadNextPage = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = currentPage + 1;
    setLoadingMore(true);

    try {
      const result = await fetchStartupsAction(nextPage, selectedSectors, selectedTracks);
      if (result.error) throw new Error(result.error);

      setStartups((prev) => {
        const existingIds = new Set(prev.map((s) => s.documentId));
        const newStartups = result.startups.filter((s) => !existingIds.has(s.documentId));
        return [...prev, ...newStartups];
      });
      setCurrentPage(result.pagination.page);
      setHasMore(result.pagination.page < result.pagination.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch more startups.');
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, selectedSectors, selectedTracks, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadNextPage]);

  // Client-side search filter
  const filteredStartups = useMemo(() => {
    let filtered = [...startups];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((startup) => {
        return (
          startup.name.toLowerCase().includes(searchLower) ||
          startup.summary.toLowerCase().includes(searchLower) ||
          startup.location?.toLowerCase().includes(searchLower) ||
          startup.founders.some((f) => f.name.toLowerCase().includes(searchLower)) ||
          startup.sectorName?.toLowerCase().includes(searchLower) ||
          startup.cohort?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [startups, searchTerm]);

  return (
    <section className="relative mx-auto mt-20 flex w-full flex-col gap-10 overflow-hidden ">

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

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="relative grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <StartupOverviewCard
              key={`loading-more-skeleton-${idx}`}
              index={idx}
              isLoading
              startup={{
                id: idx,
                documentId: `skeleton-more-${idx}`,
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

      {/* Sentinel element for infinite scroll trigger */}
      <div ref={sentinelRef} className="h-1" />
    </section>
  );
};