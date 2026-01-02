'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Sector = {
  id: number;
  documentId: string;
  name: string;
};

type PortfolioFilterContextType = {
  selectedSectors: string[];
  searchTerm: string;
  setSelectedSectors: (sectors: string[]) => void;
  setSearchTerm: (term: string) => void;
  toggleSector: (sectorName: string) => void;
  clearFilters: () => void;
};

const PortfolioFilterContext = createContext<PortfolioFilterContextType | undefined>(undefined);

export const PortfolioFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSector = (sectorName: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorName)
        ? prev.filter((s) => s !== sectorName)
        : [...prev, sectorName]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSearchTerm('');
  };

  return (
    <PortfolioFilterContext.Provider
      value={{
        selectedSectors,
        searchTerm,
        setSelectedSectors,
        setSearchTerm,
        toggleSector,
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
    throw new Error('usePortfolioFilters must be used within a PortfolioFilterProvider');
  }
  return context;
};

