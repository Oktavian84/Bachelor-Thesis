'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Sculpture3D } from './Sculpture3D';
import { useScrollSnap } from '@/contexts/ScrollSnapContext';

interface SculptureTransitionProps {
  firstBlockId: string;
  secondBlockId: string;
}

const MOVEMENT_START = 0.05;

export function SculptureTransition({ firstBlockId, secondBlockId }: SculptureTransitionProps) {
  const [scrollProgress, setScrollProgress] = useState(-1);
  const { hasSnapped } = useScrollSnap();
  const hasSnappedRef = useRef(hasSnapped);
  const scrollProgressRef = useRef(-1);

  useEffect(() => {
    hasSnappedRef.current = hasSnapped;
  }, [hasSnapped]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const handleScroll = useCallback(() => {
    if (hasSnappedRef.current && scrollProgressRef.current < 0) {
      setScrollProgress(0);
    }

    const firstBlock = document.getElementById(firstBlockId);
    const secondBlock = document.getElementById(secondBlockId);
    
    if (!firstBlock || !secondBlock) {
      if (!hasSnappedRef.current) {
        setScrollProgress(-1);
      }
      return;
    }

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const firstBlockOffset = firstBlock.offsetTop;
    const secondBlockOffset = secondBlock.offsetTop;
    const firstRect = firstBlock.getBoundingClientRect();
    const secondRect = secondBlock.getBoundingClientRect();
    const secondBlockBottom = secondBlockOffset + secondRect.height;
    
    const isBeforeFirstBlock = scrollTop < firstBlockOffset - 100;
    const isAfterSecondBlock = secondRect.bottom < windowHeight * 0.7 || scrollTop > secondBlockBottom - windowHeight * 0.4;
    const isOutOfViewport = firstRect.top > windowHeight || secondRect.bottom < 0;
    
    if (isBeforeFirstBlock || isAfterSecondBlock || isOutOfViewport) {
      setScrollProgress(-1);
      return;
    }

    const totalDistance = secondBlockOffset - firstBlockOffset;
    const traveledDistance = scrollTop - firstBlockOffset;
    const progress = totalDistance > 0 ? Math.max(0, Math.min(1, traveledDistance / totalDistance)) : 0;
    
    setScrollProgress(progress);
  }, [firstBlockId, secondBlockId]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    requestAnimationFrame(() => {
      handleScroll();
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const movementProgress = useMemo(() => {
    if (!hasSnapped || scrollProgress < 0) return 0;
    
    if (scrollProgress < MOVEMENT_START) return 0;
    return Math.max(0, Math.min(1, (scrollProgress - MOVEMENT_START) / (1 - MOVEMENT_START)));
  }, [scrollProgress, hasSnapped]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10 hidden xl:block"
      style={{ 
        opacity: hasSnapped ? 1 : 0,
        transition: hasSnapped ? 'opacity 0.2s ease-in-out' : 'opacity 0s'
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <div 
          className="w-[55%] h-full absolute"
          style={{ 
            right: `${movementProgress * 45}%`,
            top: '-3%'
          }}
        >
          <Sculpture3D 
            modelPath="/models/abstract_shape.glb" 
            scrollProgress={movementProgress}
          />
        </div>
      </div>
    </div>
  );
}

