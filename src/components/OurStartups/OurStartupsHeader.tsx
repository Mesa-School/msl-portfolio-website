'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Oswald } from 'next/font/google';

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
          const normalizedSectors: Sector[] = (payload?.data ?? []).map(
            (item: any, index: number) => {
              const name =
                item?.name ??
                item?.attributes?.name ??
                item?.sector_name ??
                'Sector';

              return {
                id: item?.id ?? index,
                documentId: item?.documentId ?? `${item?.id ?? index}`,
                name,
              };
            },
          );

          setSectors(
            normalizedSectors.filter(
              (sector) => Boolean(sector.name) && sector.name !== 'Sector',
            ),
          );
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to fetch sectors',
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
    [],
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
    [],
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
    [],
  );

  return (
    <motion.section
      className="relative overflow-hidden my-20 flex flex-col justify-center items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-1 flex-col items-center gap-8 text-center">
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={staggeredFadeVariants}
            custom={0}
          >
            <motion.h1
              className={`${oswald.className} text-5xl font-semibold tracking-tight text-white sm:text-[74px]`}
              variants={staggeredFadeVariants}
              custom={0}
            >
              Our Startups
            </motion.h1>
            <motion.p
              className="max-w-2xl text-base text-white/70 sm:text-lg"
              variants={staggeredFadeVariants}
              custom={0.5}
            >
              Find the founders, sectors, and cities shaping the next wave of innovation.
            </motion.p>
          </motion.div>

          <motion.div
            className="w-full max-w-3xl"
            variants={staggeredFadeVariants}
            custom={1}
          >
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 shadow-[0_25px_60px_rgba(2,6,23,0.65)] backdrop-blur">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6 text-white/60"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" strokeLinecap="round" />
              </svg>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for founders, sectors, destinations"
                className="flex-1 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
              />
              <button className="rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-[#05070f] transition hover:bg-white">
                Search
              </button>
            </div>
          </motion.div>

          <motion.div
            className="w-full max-w-3xl"
            variants={staggeredFadeVariants}
            custom={2}
          >
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
              {loading && <span className="text-white/60">Loading sectors…</span>}
              {error && <span className="text-red-300">{error}</span>}
              {!loading && !error && sectors.length === 0 && (
                <span className="text-white/60">No sectors available.</span>
              )}
              {sectors.map((sector, index) => (
                <motion.span
                  key={sector.documentId ?? sector.id}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-1"
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

