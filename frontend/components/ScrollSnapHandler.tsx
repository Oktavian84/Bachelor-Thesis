'use client';

import { useEffect, useRef } from 'react';
import { useScrollSnap } from '@/contexts/ScrollSnapContext';

interface ScrollSnapHandlerProps {
  firstInfoBlockId: string;
}

export function ScrollSnapHandler({ firstInfoBlockId }: ScrollSnapHandlerProps) {
  const { setHasSnapped } = useScrollSnap();
  const hasSnapped = useRef(false);
  const isScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    lastScrollTop.current = window.scrollY;
    
    const handleScroll = () => {
      if (isScrolling.current) return;

      const header = document.querySelector('header');
      const firstInfoBlock = document.getElementById(firstInfoBlockId);
      
      if (!header || !firstInfoBlock) return;

      const headerBottom = header.getBoundingClientRect().bottom;
      const scrollTop = window.scrollY;
      const firstInfoBlockRect = firstInfoBlock.getBoundingClientRect();
      const targetPosition = (firstInfoBlockRect.top + scrollTop) - (window.innerHeight - firstInfoBlockRect.height) / 2;
      const scrollingDown = scrollTop > lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      if (scrollingDown && headerBottom < 0 && !hasSnapped.current && scrollTop < targetPosition - 50) {
        hasSnapped.current = true;
        isScrolling.current = true;
        setHasSnapped(true);

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        scrollTimeoutRef.current = setTimeout(() => { isScrolling.current = false; }, 1000);
      }

      if (!scrollingDown && hasSnapped.current && scrollTop < targetPosition - 50 && scrollTop > 0) {
        hasSnapped.current = false;
        setHasSnapped(false);
        isScrolling.current = true;

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        scrollTimeoutRef.current = setTimeout(() => { isScrolling.current = false; }, 1000);
      }


      if (headerBottom >= 0 && scrollTop < 200) {
        hasSnapped.current = false;
        setHasSnapped(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [firstInfoBlockId, setHasSnapped]);

  return null;
}

