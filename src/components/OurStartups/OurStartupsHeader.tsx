'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Oswald } from 'next/font/google';
import { Skeleton } from '@/components/ui/skeleton';

type Sector = {
  id: number;
  documentId: string;
  name: string;
};

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const OurStartupsHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchSectors = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sectors', {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to load sectors');
        }

        if (isMounted) {
          const sectorSource = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

          const normalizedSectors: Sector[] = sectorSource.map(
            (item: any, index: number) => {
              const base = item?.attributes ?? item ?? {};
              const name =
                base?.name ??
                base?.sector_name ??
                item?.name ??
                'Unnamed Sector';

              return {
                id: base?.id ?? item?.id ?? index,
                documentId:
                  base?.documentId ?? item?.documentId ?? `${base?.id ?? index}`,
                name,
              };
            }
          );

          setSectors(
            normalizedSectors.filter(
              (sector) =>
                typeof sector.name === 'string' &&
                sector.name.trim().length > 0
            )
          );
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to fetch sectors'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSectors();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      },
    }),
    []
  );

  const staggeredFadeVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: -30 },
      visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay: custom * 0.2,
        },
      }),
    }),
    []
  );

  const chipVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: 12 },
      visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
          delay: custom * 0.05,
        },
      }),
    }),
    []
  );

  return (
    <motion.section
      className="relative overflow-hidden my-16 px-4 flex flex-col justify-center items-center sm:my-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 max-w-6xl w-full">
        <div className="flex flex-1 flex-col items-center gap-8 text-center w-full">

          {/* Heading */}
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={staggeredFadeVariants}
            custom={0}
          >
            <motion.h1
              className={`${oswald.className} font-semibold tracking-tight text-white text-[40px] sm:text-[60px] md:text-[74px] leading-tight`}
              variants={staggeredFadeVariants}
              custom={0}
            >
              Portfolio
            </motion.h1>

            <motion.p
              className="max-w-xl text-sm sm:text-base md:text-lg text-white/70 px-2"
              variants={staggeredFadeVariants}
              custom={0.5}
            >
              Find the founders, sectors, and cities shaping the next wave of innovation.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="w-full max-w-3xl px-1"
            variants={staggeredFadeVariants}
            custom={1}
          >
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_25px_60px_rgba(2,6,23,0.65)] backdrop-blur">
              
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for founders, sectors, destinations"
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none"
              />

              <button className="rounded-full bg-white/90 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#05070f] transition hover:bg-white">
                Search
              </button>
            </div>
          </motion.div>

          {/* Sector Chips */}
          <motion.div
            className="w-full max-w-3xl px-1"
            variants={staggeredFadeVariants}
            custom={2}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
              {loading &&
                Array.from({ length: 8 }).map((_, idx) => (
                  <Skeleton
                    key={`sector-skeleton-${idx}`}
                    className="h-7 w-20 sm:h-8 sm:w-24 rounded-full bg-white/10"
                  />
                ))}

              {error && <span className="text-red-300">{error}</span>}
              {!loading && !error && sectors.length === 0 && (
                <span className="text-white/60">No sectors available.</span>
              )}

              {!loading &&
                !error &&
                sectors.map((sector, index) => (
                  <motion.span
                    key={sector.documentId ?? sector.id}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 sm:px-4 sm:py-1"
                    variants={chipVariants}
                    custom={index}
                  >
                    {sector.name}
                  </motion.span>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
