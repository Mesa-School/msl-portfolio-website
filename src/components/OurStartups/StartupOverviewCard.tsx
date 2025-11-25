import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

import { Skeleton } from '@/components/ui/skeleton';

type Founder = {
    id: number | string;
    name: string;
    designation?: string | null;
};

export type Startup = {
    id: number | string;
    documentId: string;
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

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            delay: custom * 0.05,
            ease: easing,
        },
    }),
};

const renderInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

export const StartupOverviewCard = ({
  startup,
  index,
  isLoading = false,
}: StartupOverviewCardProps) => {
  const hasLogo = Boolean(startup.logoUrl);
  const summary = startup.summary ?? '';
  const foundersLabel =
    startup.founders?.map((founder) => founder.name).join(', ') || '—';
  const detailHref = startup.documentId
    ? `/our-startups/${startup.documentId}`
    : null;

  return (
    <Tilt
      glareEnable
      glareColor="rgba(168,85,247,0.25)"
      glareMaxOpacity={0.25}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      className="group block h-full"
      style={{ width: '100%', height: '100%' }}
    >
      <motion.article
        className="group relative h-full overflow-hidden rounded-3xl bg-white/5 p-px text-white shadow-[0_25px_80px_rgba(5,7,15,0.65)] backdrop-blur transition duration-300 hover:bg-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        variants={cardVariants}
        custom={index}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/20 via-transparent to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-80" />
        <div className="relative flex h-full flex-col gap-5 rounded-3xl bg-[#05070f]/90 p-6">
          <div className="absolute right-6 top-6 flex flex-col items-end gap-2 text-xs">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
                <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
              </>
            ) : (
              <>
                {startup.sectorName && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                    {startup.sectorName}
                  </span>
                )}
                {startup.cohort && (
                  <span className="rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-1 text-purple-200">
                    {startup.cohort}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4 pr-28">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 shadow-inner shadow-black/20">
              {isLoading ? (
                <Skeleton className="h-16 w-16 rounded-2xl bg-white/10" />
              ) : hasLogo ? (
                <Image
                  src={startup.logoUrl ?? ''}
                  alt={`${startup.name} logo`}
                  width={72}
                  height={72}
                  unoptimized
                  className="h-16 w-16 rounded-2xl object-contain"
                />
              ) : (
                <span className="text-xl font-semibold text-white/80">
                  {renderInitials(startup.name)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              {isLoading ? (
                <>
                  <Skeleton className="h-3 w-24 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-40 rounded-lg bg-white/10" />
                </>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
                    {startup.location ?? 'Global'}
                  </p>
                  <h3 className="text-2xl font-semibold">{startup.name}</h3>
                </>
              )}
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full rounded bg-white/10" />
                <Skeleton className="h-3 w-5/6 rounded bg-white/10" />
                <Skeleton className="h-3 w-2/3 rounded bg-white/10" />
              </div>
            ) : (
              <p className="text-sm text-white/75">
                {summary.length > 150 ? `${summary.slice(0, 120)}…` : summary}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            {isLoading ? (
              <Skeleton className="h-5 w-44 rounded bg-white/10" />
            ) : (
              <div className="text-sm text-white/55">
                Founded by <span className="text-white/90">{foundersLabel}</span>
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
            ) : detailHref ? (
              <Link
                href={detailHref}
                className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-110 hover:bg-white hover:text-[#05070f]"
              >
                View Startup
              </Link>
            ) : (
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60">
                Details unavailable
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Tilt>
  );
};

