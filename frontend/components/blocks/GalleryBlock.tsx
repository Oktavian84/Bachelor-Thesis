"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrapiImage } from "../StrapiImage";
import type { GalleryBlockProps } from "@/types";

const DRAG_ANIMATION_DURATION = 1200;
const WHEEL_ANIMATION_DURATION = 50;
const WHEEL_SENSITIVITY = 50;

export function GalleryBlock({ gallery_items }: Readonly<GalleryBlockProps>) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [clickedImageRect, setClickedImageRect] = useState<DOMRect | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mouseDownAtRef = useRef<number>(0);
  const prevPercentageRef = useRef<number>(0);
  const percentageRef = useRef<number>(0);

  const selectedItem = selectedImage
    ? gallery_items.find((item) => item.id === selectedImage)
    : null;

  const currentIndex = selectedItem
    ? gallery_items.findIndex((item) => item.id === selectedItem.id)
    : -1;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedImage(gallery_items[currentIndex - 1].id);
      } else if (e.key === "ArrowRight" && currentIndex < gallery_items.length - 1) {
        setSelectedImage(gallery_items[currentIndex + 1].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, currentIndex, gallery_items]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    return 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const updateImagePositions = useCallback((duration: number) => {
    if (!trackRef.current) return;
    
    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;
    
    const imageContainers = trackRef.current.querySelectorAll<HTMLElement>(".gallery-image-container");
    imageContainers.forEach((container) => {
      const img = container.querySelector<HTMLElement>("img");
      if (img) {
       
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distanceFromCenter = containerCenter - viewportCenter;
        const normalizedDistance = distanceFromCenter / viewportWidth;
        const basePosition = 50;
        const positionAdjustment = normalizedDistance * 30;
        const objectPosition = basePosition + positionAdjustment;
        const clampedPosition = Math.max(40, Math.min(100, objectPosition));
        
        img.animate(
          {
            objectPosition: `${clampedPosition}% center`,
          },
          { duration, fill: "forwards" }
        );
      }
    });
  }, []);

  const updateGalleryPosition = useCallback((nextPercentage: number, useSmoothAnimation: boolean = false) => {
    if (!trackRef.current) return;

    percentageRef.current = nextPercentage;
    const duration = useSmoothAnimation ? WHEEL_ANIMATION_DURATION : DRAG_ANIMATION_DURATION;

    trackRef.current.animate(
      {
        transform: `translate(${nextPercentage}%, -50%)`,
      },
      { duration, fill: "forwards" }
    );

    updateImagePositions(duration);
  }, [updateImagePositions]);

  const handleOnDown = useCallback((e: MouseEvent | TouchEvent) => {
    mouseDownAtRef.current = getClientX(e);
  }, []);

  const handleOnUp = useCallback(() => {
    mouseDownAtRef.current = 0;
    prevPercentageRef.current = percentageRef.current;
  }, []);

  const handleOnMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (mouseDownAtRef.current === 0 || !trackRef.current) return;

    const clientX = getClientX(e);
    const mouseDelta = mouseDownAtRef.current - clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = prevPercentageRef.current + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    updateGalleryPosition(nextPercentage, false);
  }, [updateGalleryPosition]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!trackRef.current) return;
    
    e.preventDefault();
    
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const percentageChange = (delta / WHEEL_SENSITIVITY) * -1;
    
    const nextPercentageUnconstrained = percentageRef.current + percentageChange;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    
    prevPercentageRef.current = nextPercentage;
    updateGalleryPosition(nextPercentage, true);
  }, [updateGalleryPosition]);

  useEffect(() => {
    if (!trackRef.current) return;
    
    percentageRef.current = 0;
    prevPercentageRef.current = 0;
    trackRef.current.style.transform = 'translate(0%, -50%)';
    
    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;
    
    const imageContainers = trackRef.current.querySelectorAll<HTMLElement>(".gallery-image-container");
    imageContainers.forEach((container) => {
      const img = container.querySelector<HTMLElement>("img");
      if (img) {
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distanceFromCenter = containerCenter - viewportCenter;
        const normalizedDistance = distanceFromCenter / viewportWidth;
        
        const basePosition = 50;
        const positionAdjustment = normalizedDistance * 30;
        const objectPosition = basePosition + positionAdjustment;
        const clampedPosition = Math.max(40, Math.min(100, objectPosition));
        
        img.style.objectPosition = `${clampedPosition}% center`;
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleOnDown);
    window.addEventListener("touchstart", handleOnDown);
    window.addEventListener("mouseup", handleOnUp);
    window.addEventListener("touchend", handleOnUp);
    window.addEventListener("mousemove", handleOnMove);
    window.addEventListener("touchmove", handleOnMove);

    return () => {
      window.removeEventListener("mousedown", handleOnDown);
      window.removeEventListener("touchstart", handleOnDown);
      window.removeEventListener("mouseup", handleOnUp);
      window.removeEventListener("touchend", handleOnUp);
      window.removeEventListener("mousemove", handleOnMove);
      window.removeEventListener("touchmove", handleOnMove);
    };
  }, [handleOnDown, handleOnUp, handleOnMove]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  const handleImageClick = (itemId: number, event: React.MouseEvent) => {
    if (mouseDownAtRef.current === 0) {
      const clickedElement = event.currentTarget as HTMLElement;
      const rect = clickedElement.getBoundingClientRect();
      setClickedImageRect(rect);
      setSelectedImage(itemId);
      setIsLightboxOpen(true);
    }
  };

  const handleClose = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setClickedImageRect(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
     
      const prevItem = gallery_items[currentIndex - 1];
      const prevElement = trackRef.current?.querySelector(`[data-item-id="${prevItem.id}"]`) as HTMLElement;
      if (prevElement) {
        const rect = prevElement.getBoundingClientRect();
        setClickedImageRect(rect);
      }
      setSelectedImage(prevItem.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < gallery_items.length - 1) {
      
      const nextItem = gallery_items[currentIndex + 1];
      const nextElement = trackRef.current?.querySelector(`[data-item-id="${nextItem.id}"]`) as HTMLElement;
      if (nextElement) {
        const rect = nextElement.getBoundingClientRect();
        setClickedImageRect(rect);
      }
      setSelectedImage(nextItem.id);
    }
  };

  if (!gallery_items || gallery_items.length === 0) {
    return (
      <section className="w-full bg-black flex items-center justify-center py-24">
        <p className="text-white text-2xl">No gallery items found</p>
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="w-full bg-black relative overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
        <div 
          ref={trackRef}
          id="image-track"
          className="gallery-track"
          style={{ transform: 'translate(0%, -50%)' }}
        >
          {gallery_items.map((item) => (
            <div
              key={item.id}
              data-item-id={item.id}
              onClick={(e) => handleImageClick(item.id, e)}
              className="gallery-image-container"
            >
              <StrapiImage
                src={item.image.url}
                alt={item.image.alternativeText || item.title}
                fill
                className="gallery-image"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isLightboxOpen && selectedItem && clickedImageRect && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { duration: 1.0 }
              }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={handleClose}
            />
            
            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-full flex items-center justify-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  initial={{
                    x: clickedImageRect.right,
                    y: clickedImageRect.top,
                    scaleX: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    scaleX: 1,
                  }}
                  exit={{
                    x: clickedImageRect.right,
                    y: clickedImageRect.top,
                    scaleX: 0,
                    opacity: 0,
                    transition: {
                      type: "tween",
                      duration: 0.25,
                      ease: "easeIn",
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="absolute top-35 right-8 text-white text-4xl font-bold hover:opacity-70 transition-opacity z-100 cursor-pointer"
                  style={{ 
                    transformOrigin: "left center",
                  }}
                  aria-label="Close"
                >
                  ×
                </motion.button>

                {currentIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-6xl font-bold hover:opacity-70 transition-opacity z-100 cursor-pointer py-8"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                )}

                <div className="w-full flex">
                  <motion.div
                    initial={{
                      x: clickedImageRect.left + clickedImageRect.width / 2 - window.innerWidth / 2,
                      y: clickedImageRect.top + clickedImageRect.height / 2 - window.innerHeight / 2,
                      width: clickedImageRect.width,
                      height: clickedImageRect.height,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      width: "60%",
                      height: "75vh",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      mass: 0.8,
                    }}
                    exit={{
                      x: clickedImageRect.left + clickedImageRect.width / 2 - window.innerWidth / 2,
                      y: clickedImageRect.top + clickedImageRect.height / 2 - window.innerHeight / 2,
                      width: clickedImageRect.width,
                      height: clickedImageRect.height,
                      opacity: 0,
                      transition: {
                        type: "tween",
                        duration: 0.25,
                        ease: "easeIn",
                      },
                    }}
                    className="w-[60%] h-[75vh]"
                  >
                    <div className="relative w-full h-full rounded-tr-[8rem] rounded-br-[8rem] overflow-hidden">
                      <StrapiImage
                        src={selectedItem.image.url}
                        alt={selectedItem.image.alternativeText || selectedItem.title}
                        fill
                        className="object-cover"
                      />
                      {currentIndex < gallery_items.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-6xl font-bold hover:opacity-70 transition-opacity z-100 cursor-pointer py-8"
                          aria-label="Next"
                        >
                          ›
                        </button>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{
                      x: clickedImageRect.right,
                      y: clickedImageRect.top + clickedImageRect.height / 2 - window.innerHeight / 2,
                      scaleX: 0,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      scaleX: 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      mass: 0.8,
                    }}
                    exit={{
                      x: clickedImageRect.right,
                      y: clickedImageRect.top + clickedImageRect.height / 2 - window.innerHeight / 2,
                      scaleX: 0,
                      opacity: 0,
                      transition: {
                        type: "tween",
                        duration: 0.25,
                        ease: "easeIn",
                      },
                    }}
                    className="w-[35%] ml-auto"
                    style={{ 
                      transformOrigin: "left center",
                    }}
                  >
                    <div className="p-12 h-[75vh] flex flex-col justify-center">
                      <h2 className="text-white text-center text-4xl font-bold mb-8">{selectedItem.title}</h2>
                      <div className="text-white md:text-lg text-center leading-relaxed mb-14 whitespace-pre-line">
                        {selectedItem.description}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-black/20 mb-12">
                        <span className="text-3xl md:text-2xl font-bold text-white">{selectedItem.price} SEK</span>
                        <button
                          onClick={() => {
                            // TODO: Implement buy functionality
                            console.log("Buy clicked for:", selectedItem.title);
                          }}
                          className="bg-white text-black px-8 py-2 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

