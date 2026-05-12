'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { usePortfolioFilters } from '@/contexts/PortfolioFilterContext';
import { Search, X } from 'lucide-react';
import { fontVariables } from '@/components/portfoliodetailed-revamp/fonts';

type Sector = {
  id: number;
  name: string;
};

const HARDCODED_SECTORS: Sector[] = [
  { id: 1, name: 'AI' },
  { id: 2, name: 'D2C' },
  { id: 3, name: 'Agritech' },
  { id: 4, name: 'Quick Commerce/E Commerce' },
  { id: 5, name: 'Sports' },
  { id: 6, name: 'Mobility' },
];

type TrackTab = { id: string; name: string; value: string | null };

const TRACK_TABS: TrackTab[] = [
  { id: 'all', name: 'All', value: null },
  { id: 'ai', name: 'AI Track', value: 'AI Track' },
  { id: 'd2c', name: 'D2C Track', value: 'D2C Track' },
  { id: 'services', name: 'Services Track', value: 'Services Track' },
];

export const OurStartupsHeader = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedSectors,
    toggleSector,
    selectedTracks,
    setSelectedTracks,
    clearFilters,
  } = usePortfolioFilters();

  const activeTabId =
    selectedTracks.length === 0
      ? 'all'
      : (TRACK_TABS.find((t) => t.value === selectedTracks[0])?.id ?? 'all');

  const handleTabClick = (tab: TrackTab) => {
    setSelectedTracks(tab.value ? [tab.value] : []);
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTerm) {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const filteredSectors = useMemo(() => {
    if (!searchTerm.trim()) return HARDCODED_SECTORS;
    const searchLower = searchTerm.toLowerCase();
    return HARDCODED_SECTORS.filter((sector) =>
      sector.name.toLowerCase().includes(searchLower),
    );
  }, [searchTerm]);

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
    [],
  );

  const staggeredFadeVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: -24 },
      visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: custom * 0.15,
        },
      }),
    }),
    [],
  );

  return (
    <motion.section
      className={`${fontVariables} relative mt-16 sm:mt-20 px-4 flex flex-col items-center font-body`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <div className="w-full max-w-4xl flex flex-col items-center text-center gap-8">
        <motion.div
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/45"
          variants={staggeredFadeVariants}
          custom={0}
        >
          Startup Portfolio
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-5"
          variants={staggeredFadeVariants}
          custom={0.4}
        >
          <motion.h1
            className=" font-bold leading-[0.95] tracking-[-0.025em] text-white text-[clamp(44px,8vw,88px)]"
            variants={staggeredFadeVariants}
            custom={0.6}
          >
            Mesa Startup Lab
          </motion.h1>
          <motion.p
            className="font-display font-light italic text-[clamp(16px,1.6vw,22px)] leading-normal text-white/65 max-w-xl"
            variants={staggeredFadeVariants}
            custom={0.8}
          >
            Where India&rsquo;s best founders build conviction.
          </motion.p>
        </motion.div>

        <motion.div
          className="w-full max-w-2xl px-1 mt-2"
          variants={staggeredFadeVariants}
          custom={1.1}
          ref={searchRef}
        >
          <div className="relative">
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/3 px-5 py-3 sm:py-3.5 backdrop-blur transition-colors focus-within:border-white/25 focus-within:bg-white/5">
              <Search className="h-4 w-4 text-white/40 shrink-0" />
              <input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                placeholder="Search for startups"
                className="flex-1 bg-transparent text-sm sm:text-[15px] text-white placeholder:text-white/35 focus:outline-none"
              />
              {(searchTerm ||
                selectedSectors.length > 0 ||
                selectedTracks.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="rounded-full p-1 hover:bg-white/10 transition"
                  aria-label="Clear filters"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              )}
            </div>

            {showSuggestions && filteredSectors.length > 0 && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/12 bg-msl-card/95 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => handleSectorSelect(sector.name)}
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/8 transition font-mono text-[11px] tracking-[0.18em] uppercase text-white/75 hover:text-white"
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center -mt-3"
          variants={staggeredFadeVariants}
          custom={1.3}
        >
          <div className="relative inline-flex items-center rounded-full border border-white/12 bg-white/3 p-1 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            {TRACK_TABS.map((tab) => {
              const isSelected = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="relative px-4 sm:px-5 py-1.5 text-[13px] sm:text-sm cursor-pointer"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="track-tab-bg"
                      className="absolute inset-0 rounded-full bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isSelected ? 'text-white' : 'text-white/55 hover:text-white/85'
                    }`}
                  >
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
