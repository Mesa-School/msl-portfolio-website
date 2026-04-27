'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type IgniteTrack = 'D2C Track' | 'AI Track' | 'Services Track';

type IgniteFilterContextType = {
  selectedTrack: IgniteTrack | '';
  searchTerm: string;
  setSelectedTrack: (track: IgniteTrack | '') => void;
  setSearchTerm: (term: string) => void;
  toggleTrack: (track: IgniteTrack) => void;
  clearFilters: () => void;
};

const IgniteFilterContext = createContext<IgniteFilterContextType | undefined>(undefined);

export const IgniteFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTrack, setSelectedTrack] = useState<IgniteTrack | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTrack = (track: IgniteTrack) => {
    setSelectedTrack((prev) => (prev === track ? '' : track));
  };

  const clearFilters = () => {
    setSelectedTrack('');
    setSearchTerm('');
  };

  return (
    <IgniteFilterContext.Provider
      value={{
        selectedTrack,
        searchTerm,
        setSelectedTrack,
        setSearchTerm,
        toggleTrack,
        clearFilters,
      }}
    >
      {children}
    </IgniteFilterContext.Provider>
  );
};

export const useIgniteFilters = () => {
  const context = useContext(IgniteFilterContext);
  if (context === undefined) {
    throw new Error('useIgniteFilters must be used within an IgniteFilterProvider');
  }
  return context;
};
