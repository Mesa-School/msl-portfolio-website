import Image from 'next/image';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

type Founder = {
  id: number | string;
  name: string;
  designation?: string | null;
};

export type Startup = {
  id: number | string;
  documentId: string;
  slug?: string | null;
  name: string;
  summary: string;
  location?: string | null;
  cohort?: string | null;
  sectorName?: string | null;
  logoUrl?: string | null;
  founders: Founder[];
};

type StartupOverviewCardProps = {
  startup: Startup;
  index: number;
  isLoading?: boolean;
};

const renderInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

const getGradientClass = (index: number): string => {
  const gradientIndex = index % 3;
  switch (gradientIndex) {
    case 0:
      return 'bg-gradient-to-br from-[#12422D] to-[#27614A]/90';
    case 1:
      return 'bg-gradient-to-br from-[#1A3A3A] to-[#115555]/90';
    case 2:
      return 'bg-gradient-to-br from-[#1A2D46] to-[#1B4377]/90';
    default:
      return 'bg-gradient-to-br from-[#12422D] to-[#27614A]/90';
  }
};

export const StartupOverviewCard = ({
  startup,
  index,
  isLoading = false,
}: StartupOverviewCardProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const hasLogo = Boolean(startup.logoUrl);
  const summary = startup.summary ?? '';
  const founderNames =
    startup.founders?.map((founder) => founder.name).filter(Boolean) ?? [];
  const displayedFounders = founderNames.slice(0, 2).join(', ');
  const hasFounders = founderNames.length > 0;
  const isSingleFounder = founderNames.length === 1;
  const detailHref = startup.slug
    ? `/portfolio/${startup.slug}`
    : null;
  const gradientClass = getGradientClass(index);

  const handleViewDetail = () => {
    if (detailHref) {
      setIsNavigating(true);
      router.push(detailHref);
    }
  };

  return (
    <article
      className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white/10 text-white transition duration-300 hover:bg-white/10"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-linear-to-br from-white/20 via-transparent to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-80" />
      <div className={`relative flex h-full flex-col ${gradientClass} gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl p-4 sm:p-6`}>
        {/* Tags - Repositioned for mobile */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:absolute sm:right-6 sm:top-6 sm:flex-col sm:items-end">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
            </>
          ) : (
            <>
              {startup.sectorName && (
                <span className="rounded-full text-sm border border-white/15 bg-black/50 px-3 py-1 text-white/80">
                  {startup.sectorName}
                </span>
              )}
            </>
          )}
        </div>

        {/* Logo and Title Section */}
        <div className="flex items-center gap-3 sm:gap-4 sm:pr-28">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-white/20 bg-white/5 shadow-inner shadow-black/20">
            {isLoading ? (
              <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-white/10" />
            ) : hasLogo ? (
              <Image
                src={startup.logoUrl ?? ''}
                alt={`${startup.name} logo`}
                width={72}
                height={72}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl object-cover bg-white"
              />
            ) : (
              <span className="text-lg sm:text-xl font-semibold text-white/80">
                {renderInitials(startup.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left min-w-0 flex-1">
            {isLoading ? (
              <>
                <Skeleton className="h-3 w-24 rounded-full bg-white/10" />
                <Skeleton className="h-6 w-40 rounded-lg bg-white/10" />
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold truncate">{startup.name}</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/45">
                  {startup.location ?? 'Global'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded bg-white/10" />
              <Skeleton className="h-3 w-5/6 rounded bg-white/10" />
              <Skeleton className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-white/75 line-clamp-3">
              {summary}
            </p>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2">
          {isLoading ? (
            <Skeleton className="h-5 w-44 rounded bg-white/10" />
          ) : (
            <div className="text-xs sm:text-sm text-white/55 truncate max-w-full">
              {hasFounders ? (
                <>
                  <span className="hidden sm:inline">
                    {isSingleFounder ? 'Founder: ' : 'Founders: '}
                  </span>
                  <span className="sm:hidden">👥 </span>
                  <span className="text-white/90 truncate">
                    {displayedFounders}
                  </span>
                </>
              ) : (
                <span className="text-white/60">—</span>
              )}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-10 w-full sm:w-32 rounded-full bg-white/10" />
          ) : detailHref ? (
            <button
              onClick={handleViewDetail}
              disabled={isNavigating}
              className="w-full sm:w-auto text-center cursor-pointer rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition duration-300 hover:scale-110 bg-white text-[#05070f] disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isNavigating ? (
                <>
                  <Spinner className="size-4" />
                  {/* <span>Loading...</span> */}
                </>
              ) : (
                'View Detail'
              )}
            </button>
          ) : (
            <span className="w-full sm:w-auto text-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm text-white/60">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
};