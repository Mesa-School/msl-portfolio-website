'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Oswald } from 'next/font/google';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';
import { Search, X } from 'lucide-react';

type Sector = {
  id: number;
  documentId: string;
  name: string;
};

// Hardcoded sectors data
const HARDCODED_SECTORS: Sector[] = [
  {
    id: 28,
    documentId: 'thubd0y8e90rhrigx3bg5y3j',
    name: 'AI',
  },
  {
    id: 30,
    documentId: 'gnoy5rjsikv1yyud7d72fwki',
    name: 'D2C ',
  },
  {
    id: 32,
    documentId: 'r7u8wl1ankilczky7nr0mfwz',
    name: 'Quick Commerce/ E-commerce',
  },
  {
    id: 34,
    documentId: 'y7abqy7g591ox36nfz5q7eoo',
    name: 'Sports ',
  },
  {
    id: 36,
    documentId: 'ztg7jxrd43qqegiletyid7ud',
    name: 'Mobility ',
  },
  {
    id: 38,
    documentId: 'g91hb6i2v6yaad7i3ahc65kb',
    name: 'Agritech',
  },
];

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const OurStartupsHeader = () => {
  const { searchTerm, setSearchTerm, selectedSectors, toggleSector, clearFilters } = usePortfolioFilters();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync search input with context
  useEffect(() => {
    if (!searchTerm) {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Filter sectors based on search term
  const filteredSectors = useMemo(() => {
    if (!searchTerm.trim()) return HARDCODED_SECTORS;
    const searchLower = searchTerm.toLowerCase();
    return HARDCODED_SECTORS.filter((sector) =>
      sector.name.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSectorSelect = (sectorName: string) => {
    toggleSector(sectorName);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

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
              className={`font-bold tracking-tight text-white text-[40px] sm:text-[60px] md:text-[74px] leading-tight`}
              variants={staggeredFadeVariants}
              custom={0}
            >
              Mesa Startup Lab
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg text-white/70 px-2"
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
            ref={searchRef}
          >
            <div className="relative">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_25px_60px_rgba(2,6,23,0.65)] backdrop-blur">
                <Search className="h-4 w-4 text-white/40 shrink-0" />
                <input
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  placeholder="Search for startups"
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none"
                />
                {(searchTerm || selectedSectors.length > 0) && (
                  <button
                    onClick={() => {
                      clearFilters();
                    }}
                    className="rounded-full p-1 hover:bg-white/10 transition"
                    aria-label="Clear filters"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                )}
              </div>

              {/* Sector Suggestions Dropdown */}
              {showSuggestions && filteredSectors.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/15 bg-[#091414] backdrop-blur-xl shadow-[0_25px_60px_rgba(2,6,23,0.65)] overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredSectors.map((sector) => (
                      <button
                        key={sector.documentId ?? sector.id}
                        onClick={() => handleSectorSelect(sector.name)}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm text-white/80 hover:text-white"
                      >
                        {sector.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sector Chips */}
          <motion.div
            className="w-full max-w-3xl px-1"
            variants={staggeredFadeVariants}
            custom={2}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
              {HARDCODED_SECTORS.map((sector, index) => {
                const isSelected = selectedSectors.includes(sector.name);
                return (
                  <motion.button
                    key={sector.documentId ?? sector.id}
                    onClick={() => toggleSector(sector.name)}
                    className={`rounded-full border px-3 py-1 sm:px-4 sm:py-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#27614A]/50 bg-[#27614A] text-white'
                        : 'border-white/15 bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                    }`}
                    variants={chipVariants}
                    custom={index}
                  >
                    {sector.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
