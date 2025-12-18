'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollSnapContextType {
  hasSnapped: boolean;
  setHasSnapped: (value: boolean) => void;
}

const ScrollSnapContext = createContext<ScrollSnapContextType | undefined>(undefined);

export function ScrollSnapProvider({ children }: { children: ReactNode }) {
  const [hasSnapped, setHasSnapped] = useState(false);

  return (
    <ScrollSnapContext.Provider value={{ hasSnapped, setHasSnapped }}>
      {children}
    </ScrollSnapContext.Provider>
  );
}

export function useScrollSnap() {
  const context = useContext(ScrollSnapContext);
  if (context === undefined) {
    throw new Error('useScrollSnap must be used within a ScrollSnapProvider');
  }
  return context;
}

