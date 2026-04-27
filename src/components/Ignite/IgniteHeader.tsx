'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useIgniteFilters, type IgniteTrack } from '@/contexts/IgniteFilterContext';

const IGNITE_TRACKS: IgniteTrack[] = ['D2C Track', 'AI Track', 'Services Track'];

export const IgniteHeader = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTrack,
    toggleTrack,
    clearFilters,
  } = useIgniteFilters();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTerm) {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const filteredTracks = useMemo(() => {
    if (!searchTerm.trim()) return IGNITE_TRACKS;
    const searchLower = searchTerm.toLowerCase();
    return IGNITE_TRACKS.filter((track) => track.toLowerCase().includes(searchLower));
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

  const handleTrackSelect = (track: IgniteTrack) => {
    toggleTrack(track);
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
      visible: { opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
    }),
    []
  );

  const staggeredFadeVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: -30 },
      visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: custom * 0.2 },
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
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: custom * 0.05 },
      }),
    }),
    []
  );

  return (
    <motion.section
      className="relative overflow-hidden my-12 px-4 flex flex-col justify-center items-center sm:mt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 max-w-6xl w-full">
        <div className="flex flex-1 flex-col items-center gap-8 text-center w-full">
          <motion.div
            className="flex flex-col items-center gap-2 md:gap-4"
            variants={staggeredFadeVariants}
            custom={0}
          >
            <motion.h1
              className="font-bold tracking-tight text-white text-4xl sm:text-5xl md:text-6xl leading-tight"
              variants={staggeredFadeVariants}
              custom={0}
            >
              Mesa Startup Lab - Ignite
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg text-white/70 px-2"
              variants={staggeredFadeVariants}
              custom={0.5}
            >
              Spotlighting the next wave of Ignite founders.
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
                  placeholder="Search Ignite startups"
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none"
                />
                {(searchTerm || selectedTrack) && (
                  <button
                    onClick={() => clearFilters()}
                    className="rounded-full p-1 hover:bg-white/10 transition"
                    aria-label="Clear filters"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                )}
              </div>

              {showSuggestions && filteredTracks.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/15 bg-msl-card backdrop-blur-xl shadow-[0_25px_60px_rgba(2,6,23,0.65)] overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredTracks.map((track) => (
                      <button
                        key={track}
                        onClick={() => handleTrackSelect(track)}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm text-white/80 hover:text-white"
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Track Chips */}
          <motion.div
            className="w-full max-w-3xl px-1"
            variants={staggeredFadeVariants}
            custom={2}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
              {IGNITE_TRACKS.map((track, index) => {
                const isSelected = selectedTrack === track;
                return (
                  <motion.button
                    key={track}
                    onClick={() => toggleTrack(track)}
                    className={`rounded-full border px-3 py-1 sm:px-4 sm:py-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-msl-accent/50 bg-msl-accent text-white'
                        : 'border-white/15 bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                    }`}
                    variants={chipVariants}
                    custom={index}
                  >
                    {track}
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
