'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSearchParams } from 'next/navigation';

import { trackBySlug } from '@/lib/track';

type PortfolioFilterContextType = {
  selectedSectors: string[];
  selectedTracks: string[];
  searchTerm: string;
  setSelectedSectors: (sectors: string[]) => void;
  setSelectedTracks: (tracks: string[]) => void;
  setSearchTerm: (term: string) => void;
  toggleSector: (sectorName: string) => void;
  toggleTrack: (trackName: string) => void;
  clearFilters: () => void;
};

const PortfolioFilterContext = createContext<
  PortfolioFilterContextType | undefined
>(undefined);

export const PortfolioFilterProvider = ({
  children,
  initialTracks = [],
}: {
  children: ReactNode;
  initialTracks?: string[];
}) => {
  const searchParams = useSearchParams();
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] =
    useState<string[]>(initialTracks);
  const [searchTerm, setSearchTerm] = useState('');

  // URL is the single source of truth for the track filter.
  useEffect(() => {
    const entry = trackBySlug(searchParams.get('track'));
    const next = entry ? [entry.apiValue] : [];
    setSelectedTracks((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i])
        ? prev
        : next,
    );
  }, [searchParams]);

  const toggleSector = (sectorName: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorName)
        ? prev.filter((s) => s !== sectorName)
        : [...prev, sectorName],
    );
  };

  const toggleTrack = (trackName: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackName)
        ? prev.filter((t) => t !== trackName)
        : [...prev, trackName],
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedTracks([]);
    setSearchTerm('');
  };

  return (
    <PortfolioFilterContext.Provider
      value={{
        selectedSectors,
        selectedTracks,
        searchTerm,
        setSelectedSectors,
        setSelectedTracks,
        setSearchTerm,
        toggleSector,
        toggleTrack,
        clearFilters,
      }}
    >
      {children}
    </PortfolioFilterContext.Provider>
  );
};

export const usePortfolioFilters = () => {
  const context = useContext(PortfolioFilterContext);
  if (context === undefined) {
    throw new Error(
      'usePortfolioFilters must be used within a PortfolioFilterProvider',
    );
  }
  return context;
};
