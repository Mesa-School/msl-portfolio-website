'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

import { Startup, StartupOverviewCard } from './StartupOverviewCard';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';
import { reorderStartups } from '@/utils/startupOrdering';
import { fetchStartupsAction } from '@/actions/fetchStartups';
import type { PaginationData } from '@/actions/fetchStartups';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const DEFAULT_PAGINATION: PaginationData = { total: 0, page: 1, limit: 10, total_pages: 1 };

type Props = {
  initialStartups?: Startup[];
  initialPagination?: PaginationData;
};

export const StartupOverviewGrid = ({
  initialStartups = [],
  initialPagination = DEFAULT_PAGINATION,
}: Props) => {
  const { selectedSectors, searchTerm } = usePortfolioFilters();
  const [startups, setStartups] = useState<Startup[]>(initialStartups);
  const [loading, setLoading] = useState(initialStartups.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>(initialPagination);

  // Skip the very first effect run when SSR data covers it (page 1, no filters)
  const skipFirstFetch = useRef(initialStartups.length > 0);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        // Server action — runs on the server, no /api/startups request in the browser
        const result = await fetchStartupsAction(currentPage, selectedSectors);

        if (result.error) throw new Error(result.error);

        if (isMounted) {
          setStartups(result.startups);
          setPagination(result.pagination);
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
  }, [selectedSectors, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSectors, searchTerm]);

  // Client-side search filter (sectors are filtered on the server)
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

    return reorderStartups(filtered);
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

      {/* Pagination */}
      {!loading && !error && pagination.total_pages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={`cursor-pointer transition-colors ${
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'hover:bg-[#27614A] hover:text-white'
                }`}
              />
            </PaginationItem>

            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => {
              const showPage =
                page === 1 ||
                page === pagination.total_pages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter =
                page === currentPage + 2 && currentPage < pagination.total_pages - 2;

              if (showEllipsisBefore || showEllipsisAfter) {
                return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
              }

              if (!showPage) return null;

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer transition-colors ${
                      currentPage === page
                        ? 'bg-[#27614A] text-white border-[#27614A]'
                        : 'hover:bg-[#27614A]/20 hover:text-white'
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))}
                className={`cursor-pointer transition-colors ${
                  currentPage === pagination.total_pages
                    ? 'pointer-events-none opacity-50'
                    : 'hover:bg-[#27614A] hover:text-white'
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};
