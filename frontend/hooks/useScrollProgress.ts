'use client';

import { useEffect, useState } from 'react';

export function useScrollProgress(elementId?: string) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const startPoint = windowHeight;
        const endPoint = 0;
        const currentPoint = rect.top;
        const totalDistance = startPoint - endPoint;
        const traveledDistance = startPoint - currentPoint;
        const progress = Math.max(0, Math.min(1, traveledDistance / totalDistance));
        
        setScrollProgress(progress);
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId]);

  return scrollProgress;
}

