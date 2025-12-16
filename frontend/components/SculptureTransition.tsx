'use client';

import { useEffect, useState, useMemo } from 'react';
import { Sculpture3D } from './Sculpture3D';

interface SculptureTransitionProps {
  firstBlockId: string;
  secondBlockId: string;
}

const MOVEMENT_START = 0.2;
const FADE_IN_THRESHOLD = 0.1;

export function SculptureTransition({ firstBlockId, secondBlockId }: SculptureTransitionProps) {
  const [scrollProgress, setScrollProgress] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const firstBlock = document.getElementById(firstBlockId);
      const secondBlock = document.getElementById(secondBlockId);
      
      if (!firstBlock || !secondBlock) {
        setScrollProgress(-1);
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
      const isAfterSecondBlock = secondRect.bottom < windowHeight * 0.7 || 
                                 scrollTop > secondBlockBottom - windowHeight * 0.4;
      const isOutOfViewport = firstRect.top > windowHeight || secondRect.bottom < 0;
      
      if (isBeforeFirstBlock || isAfterSecondBlock || isOutOfViewport) {
        setScrollProgress(-1);
        return;
      }

      const totalDistance = secondBlockOffset - firstBlockOffset;
      const traveledDistance = scrollTop - firstBlockOffset;
      const progress = totalDistance > 0 
        ? Math.max(0, Math.min(1, traveledDistance / totalDistance))
        : 0;
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [firstBlockId, secondBlockId]);

  const { isVisible, opacity, movementProgress } = useMemo(() => {
    const visible = scrollProgress >= 0 && scrollProgress <= 1;
    const fadeIn = Math.min(1, scrollProgress / FADE_IN_THRESHOLD);
    const movement = scrollProgress < MOVEMENT_START
      ? 0
      : (scrollProgress - MOVEMENT_START) / (1 - MOVEMENT_START);
    
    return {
      isVisible: visible,
      opacity: visible ? fadeIn : 0,
      movementProgress: Math.max(0, Math.min(1, movement))
    };
  }, [scrollProgress]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity, transition: 'opacity 0.3s ease-in-out' }}
    >
      <div className="absolute inset-0 flex items-center">
        <div 
          className="w-[55%] h-full absolute"
          style={{ right: `${movementProgress * 45}%` }}
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

