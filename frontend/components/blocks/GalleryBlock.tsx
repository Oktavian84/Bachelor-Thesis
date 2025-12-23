"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrapiImage } from "../StrapiImage";
import type { GalleryBlockProps } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";

const DRAG_ANIMATION_DURATION = 1200;
const WHEEL_ANIMATION_DURATION = 200;
const WHEEL_SENSITIVITY = 50;
const WHEEL_THROTTLE_MS = 16;

export function GalleryBlock({ gallery_items }: Readonly<GalleryBlockProps>) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [clickedImageRect, setClickedImageRect] = useState<DOMRect | null>(
    null
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mouseDownAtRef = useRef<number>(0);
  const prevPercentageRef = useRef<number>(0);
  const percentageRef = useRef<number>(0);
  const wheelThrottleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const { addItem } = useCart();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const selectedItem = selectedImage
    ? gallery_items.find((item) => item.id === selectedImage)
    : null;

  const currentIndex = selectedItem
    ? gallery_items.findIndex((item) => item.id === selectedItem.id)
    : -1;

  const handleClose = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setClickedImageRect(null);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedImage(gallery_items[currentIndex - 1].id);
      } else if (
        e.key === "ArrowRight" &&
        currentIndex < gallery_items.length - 1
      ) {
        setSelectedImage(gallery_items[currentIndex + 1].id);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 1280) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isLightboxOpen, currentIndex, gallery_items, handleClose]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";

      if (window.innerWidth < 1280) {
        const header = document.querySelector("header") as HTMLElement | null;
        const footer = document.querySelector("footer") as HTMLElement | null;
        const closeButton = document.querySelector(
          ".close-button-sm"
        ) as HTMLElement | null;
        const lightboxContainer = document.querySelector(
          ".lightbox-container"
        ) as HTMLElement | null;

        if (footer) {
          footer.style.opacity = "0";
          footer.style.pointerEvents = "none";
        }

        const updateUI = () => {
          if (!lightboxContainer) return;

          const scrollTop = lightboxContainer.scrollTop;
          const scrollHeight = lightboxContainer.scrollHeight;
          const clientHeight = lightboxContainer.clientHeight;
          const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
          const isMenuOpen =
            document.body.getAttribute("data-menu-open") === "true";

          if (header) {
            header.style.transform =
              scrollTop > 15 ? "translateY(-100%)" : "translateY(0)";
          }

          if (closeButton) {
            const shouldHide = scrollTop > 15 || isMenuOpen;
            closeButton.style.opacity = shouldHide ? "0" : "1";
            closeButton.style.pointerEvents = shouldHide ? "none" : "auto";
          }

          if (footer) {
            footer.style.opacity = isNearBottom ? "1" : "0";
            footer.style.pointerEvents = isNearBottom ? "auto" : "none";
          }
        };

        updateUI();

        if (lightboxContainer) {
          lightboxContainer.addEventListener("scroll", updateUI);
        }

        const menuObserver = new MutationObserver(() => {
          requestAnimationFrame(updateUI);
        });
        menuObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ["data-menu-open"],
        });

        return () => {
          if (lightboxContainer) {
            lightboxContainer.removeEventListener("scroll", updateUI);
          }
          menuObserver.disconnect();

          if (header) header.style.transform = "";
          if (footer) {
            footer.style.opacity = "";
            footer.style.pointerEvents = "";
          }
          if (closeButton) {
            closeButton.style.opacity = "";
            closeButton.style.pointerEvents = "";
          }
        };
      }
    } else {
      document.body.style.overflow = "";

      const header = document.querySelector("header") as HTMLElement | null;
      const footer = document.querySelector("footer") as HTMLElement | null;
      const closeButton = document.querySelector(
        ".close-button-sm"
      ) as HTMLElement | null;

      if (header) header.style.transform = "";
      if (footer) {
        footer.style.opacity = "";
        footer.style.pointerEvents = "";
      }
      if (closeButton) {
        closeButton.style.opacity = "";
        closeButton.style.pointerEvents = "";
      }
    }
  }, [isLightboxOpen]);

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    return "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const updateImagePositions = useCallback((duration: number) => {
    if (!trackRef.current) return;

    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;

    const imageContainers = trackRef.current.querySelectorAll<HTMLElement>(
      ".gallery-image-container"
    );
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

  const updateGalleryPosition = useCallback(
    (nextPercentage: number, useSmoothAnimation: boolean = false) => {
      if (!trackRef.current) return;

      percentageRef.current = nextPercentage;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (!trackRef.current) return;

        const duration = useSmoothAnimation
          ? WHEEL_ANIMATION_DURATION
          : DRAG_ANIMATION_DURATION;

        trackRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;

        updateImagePositions(duration);
      });
    },
    [updateImagePositions]
  );

  const handleOnDown = useCallback((e: MouseEvent | TouchEvent) => {
    mouseDownAtRef.current = getClientX(e);
  }, []);

  const handleOnUp = useCallback(() => {
    mouseDownAtRef.current = 0;
    prevPercentageRef.current = percentageRef.current;
  }, []);

  const handleOnMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (mouseDownAtRef.current === 0 || !trackRef.current) return;

      const clientX = getClientX(e);
      const mouseDelta = mouseDownAtRef.current - clientX;
      const maxDelta = window.innerWidth / 2;

      const percentage = (mouseDelta / maxDelta) * -100;
      const nextPercentageUnconstrained =
        prevPercentageRef.current + percentage;
      const nextPercentage = Math.max(
        Math.min(nextPercentageUnconstrained, 0),
        -100
      );

      updateGalleryPosition(nextPercentage, false);
    },
    [updateGalleryPosition]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!trackRef.current) return;

      e.preventDefault();

      const now = Date.now();
      if (now - wheelThrottleRef.current < WHEEL_THROTTLE_MS) {
        return;
      }
      wheelThrottleRef.current = now;

      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const percentageChange = (delta / WHEEL_SENSITIVITY) * -1;

      const nextPercentageUnconstrained =
        percentageRef.current + percentageChange;
      const nextPercentage = Math.max(
        Math.min(nextPercentageUnconstrained, 0),
        -100
      );

      prevPercentageRef.current = nextPercentage;
      updateGalleryPosition(nextPercentage, true);
    },
    [updateGalleryPosition]
  );

  useEffect(() => {
    if (!trackRef.current) return;

    percentageRef.current = 0;
    prevPercentageRef.current = 0;
    trackRef.current.style.transform = "translate(0%, -50%)";
    trackRef.current.style.transition = "none";

    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;

    const imageContainers = trackRef.current.querySelectorAll<HTMLElement>(
      ".gallery-image-container"
    );
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

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
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

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevItem = gallery_items[currentIndex - 1];
      const prevElement = trackRef.current?.querySelector(
        `[data-item-id="${prevItem.id}"]`
      ) as HTMLElement;
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
      const nextElement = trackRef.current?.querySelector(
        `[data-item-id="${nextItem.id}"]`
      ) as HTMLElement;
      if (nextElement) {
        const rect = nextElement.getBoundingClientRect();
        setClickedImageRect(rect);
      }
      setSelectedImage(nextItem.id);
    }
  };

  if (!gallery_items || gallery_items.length === 0) {
    return (
      <section className={`w-full flex items-center justify-center py-24 ${isLight ? 'bg-white' : 'bg-black'}`}>
        <p className={`text-2xl ${isLight ? 'text-black' : 'text-white'}`}>No gallery items found</p>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className={`w-full relative overflow-hidden h-[calc(100vh-200px)] sm:h-[calc(100vh-100px)] ${isLight ? 'bg-white' : 'bg-black'}`}
      >
        <div
          ref={trackRef}
          id="image-track"
          className="gallery-track max-[639px]:top-1/2"
          style={{ transform: "translate(0%, -50%)" }}
        >
          {gallery_items.map((item) => (
            <div
              key={item.id}
              data-item-id={item.id}
              onClick={(e) => handleImageClick(item.id, e)}
              className="gallery-image-container w-[65vw] h-[calc(65vw*1.625)] sm:w-[40vmin] sm:h-[65vmin]"
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
                transition: { duration: 1.0 },
              }}
              transition={{ duration: 0.1 }}
              className={`fixed inset-0 z-50 ${isLight ? 'bg-white' : 'bg-black'}`}
              onClick={() => {
                if (window.innerWidth >= 1280) {
                  handleClose();
                }
              }}
            />

            {isLightboxOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="close-button-sm fixed top-25 right-8 w-8 h-8 rounded-full p-0 bg-white z-100 text-black text-3xl font-bold hover:opacity-70 transition-opacity xl:hidden pointer-events-auto flex items-center justify-center leading-none"
                aria-label="Close"
              >
                ×
              </motion.button>
            )}

            <div className="lightbox-container fixed inset-0 z-50 flex items-start xl:items-center justify-start xl:justify-center pointer-events-none overflow-y-auto xl:overflow-hidden pt-26 xl:pt-0">
              <div
                className="w-full flex flex-col xl:items-center justify-start xl:justify-center pointer-events-auto min-h-[calc(100vh+100px)] xl:min-h-0 pb-20 xl:pb-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex flex-col xl:flex-row">
                  <motion.div
                    initial={{
                      x:
                        clickedImageRect.left +
                        clickedImageRect.width / 2 -
                        window.innerWidth / 2,
                      y:
                        clickedImageRect.top +
                        clickedImageRect.height / 2 -
                        window.innerHeight / 2,
                      width: clickedImageRect.width,
                      height: clickedImageRect.height,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      width: window.innerWidth < 1280 ? "90%" : "60%",
                      height: "75vh",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      mass: 0.8,
                    }}
                    exit={{
                      x:
                        clickedImageRect.left +
                        clickedImageRect.width / 2 -
                        window.innerWidth / 2,
                      y:
                        clickedImageRect.top +
                        clickedImageRect.height / 2 -
                        window.innerHeight / 2,
                      width: clickedImageRect.width,
                      height: clickedImageRect.height,
                      opacity: 0,
                      transition: {
                        type: "tween",
                        duration: 0.25,
                        ease: "easeIn",
                      },
                    }}
                    className="w-[90%] xl:w-[60%] h-[50vh] xl:h-[75vh] ml-0 xl:mx-0"
                  >
                    <div className="relative w-full h-full rounded-tr-[8rem] xl:rounded-br-[8rem] rounded-br-[8rem] xl:rounded-tr-[8rem] overflow-hidden">
                      <StrapiImage
                        src={selectedItem.image.url}
                        alt={
                          selectedItem.image.alternativeText ||
                          selectedItem.title
                        }
                        fill
                        className="object-cover"
                      />
                      {currentIndex > 0 && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{
                            opacity: 0,
                            transition: {
                              type: "tween",
                              duration: 0.25,
                              ease: "easeIn",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                          }}
                          className={`absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 text-6xl font-bold hover:opacity-70 transition-all duration-300 z-100 cursor-pointer py-8 ${isLight ? 'text-black' : 'text-white'}`}
                          aria-label="Previous"
                        >
                          ‹
                        </motion.button>
                      )}
                      {currentIndex < gallery_items.length - 1 && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{
                            opacity: 0,
                            transition: {
                              type: "tween",
                              duration: 0.25,
                              ease: "easeIn",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className={`absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 text-6xl font-bold hover:opacity-70 transition-all duration-300 z-100 cursor-pointer py-8 ${isLight ? 'text-black' : 'text-white'}`}
                          aria-label="Next"
                        >
                          ›
                        </motion.button>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{
                      x: clickedImageRect.right,
                      y:
                        clickedImageRect.top +
                        clickedImageRect.height / 2 -
                        window.innerHeight / 2,
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
                      y:
                        clickedImageRect.top +
                        clickedImageRect.height / 2 -
                        window.innerHeight / 2,
                      scaleX: 0,
                      opacity: 0,
                      transition: {
                        type: "tween",
                        duration: 0.25,
                        ease: "easeIn",
                      },
                    }}
                    className="w-full xl:w-[35%] xl:ml-auto mt-4 xl:mt-0"
                    style={{
                      transformOrigin: "left center",
                    }}
                  >
                    <div className={`p-6 xl:p-12 h-auto xl:h-[75vh] flex flex-col xl:justify-center ${isLight ? 'bg-white' : 'bg-black'}`}>
                      <h2 className={`font-caudex text-center text-3xl sm:text-4xl font-bold mb-8 ${isLight ? 'text-black' : 'text-white'}`}>
                        {selectedItem.title}
                      </h2>
                      <div className={`font-caudex md:text-[1.16rem] text-center leading-relaxed mb-2 whitespace-pre-line ${isLight ? 'text-black' : 'text-white'}`}>
                        {selectedItem.description}
                      </div>
                      <div className="pt-4">
                        <div className="flex flex-wrap items-center justify-center gap-6 xl:flex-col xl:gap-6">
                          {selectedItem.Dimensions && (
                            <div className={`text-center ${isLight ? 'text-black' : 'text-white'}`}>
                              <p className="font-caudex text-xl md:text-2xl font-bold">
                                {selectedItem.Dimensions}
                              </p>
                            </div>
                          )}
                          <div className={`text-center ${isLight ? 'text-black' : 'text-white'}`}>
                            <p className="font-caudex text-xl md:text-2xl font-bold">
                              Price: {selectedItem.price} SEK
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedItem) {
                                addItem({
                                  id: selectedItem.id,
                                  documentId: selectedItem.documentId,
                                  title: selectedItem.title,
                                  image: selectedItem.image,
                                  price: selectedItem.price,
                                  slug: selectedItem.slug,
                                });
                                setIsLightboxOpen(false);
                              }
                            }}
                            className={`font-caudex px-20 py-2 mb-2 xl:mb-0 rounded-lg text-xl md:text-2xl font-bold border hover:scale-110 transition-all duration-300 ease-in-out ${
                              isLight
                                ? 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-white shadow-sm shadow-black'
                                : 'bg-black text-white border-white hover:bg-white hover:text-black hover:border-black shadow-sm shadow-white'
                            }`}
                          >
                            Buy
                          </button>
                        </div>
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
