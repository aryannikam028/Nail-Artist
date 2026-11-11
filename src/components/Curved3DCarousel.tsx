import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Eye,
  MessageCircle,
  MoveHorizontal,
  Sparkles,
} from "lucide-react";
import { buildWhatsAppLink, getDesignWhatsAppMessage } from "../data/brandConfig";

export interface CarouselCardItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  optionalPrice?: string;
  [key: string]: any;
}

interface Curved3DCarouselProps {
  items: CarouselCardItem[];
  onOpenBookingModal?: (designName: string) => void;
  onOpenLightbox?: (index: number) => void;
}

export const Curved3DCarousel: React.FC<Curved3DCarouselProps> = ({
  items,
  onOpenBookingModal,
  onOpenLightbox,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    cardWidth: 370,
    cardHeight: 530,
    containerHeight: 545,
    perspective: 1400,
  });

  // Ensure minimum items to complete a 360-degree cylinder
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    let list = [...items];
    while (list.length < 8) {
      list = [...list, ...items];
    }
    // Limit to reasonable count for performance if category is very large
    return list.slice(0, 16);
  }, [items]);

  const count = displayItems.length;
  const theta = 360 / count;

  // Calculate cylinder radius: chord length = cardWidth + gap
  const gap = 24;
  const radius = useMemo(() => {
    const chord = dimensions.cardWidth + gap;
    return Math.max(380, Math.round(chord / (2 * Math.tan(Math.PI / count))));
  }, [dimensions.cardWidth, count]);

  // Rotation and physics state
  const rotationRef = useRef<number>(0);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);

  // Drag tracking refs
  const dragStartRef = useRef<{ x: number; time: number; startRot: number }>({
    x: 0,
    time: 0,
    startRot: 0,
  });
  const lastXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const didDragMoveRef = useRef<boolean>(false);

  // Active index calculation
  const rawIndex = Math.round(-currentRotation / theta);
  const activeIndex = ((rawIndex % count) + count) % count;
  const activeItem = displayItems[activeIndex];

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile - Generous card size
        const cardW = Math.max(220, Math.min(270, width - 56));
        setDimensions({
          cardWidth: cardW,
          cardHeight: 410,
          containerHeight: 425,
          perspective: 900,
        });
      } else if (width < 1024) {
        // Tablet
        setDimensions({
          cardWidth: 320,
          cardHeight: 470,
          containerHeight: 485,
          perspective: 1200,
        });
      } else {
        // Desktop - Grand luxury scale
        setDimensions({
          cardWidth: 380,
          cardHeight: 530,
          containerHeight: 545,
          perspective: 1450,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update DOM transform directly for butter-smooth 60fps+ rendering
  const applyRotation = useCallback((rot: number) => {
    rotationRef.current = rot;
    setCurrentRotation(rot);
    if (rotatorRef.current) {
      rotatorRef.current.style.transform = `translateZ(-${radius}px) rotateY(${rot}deg)`;
    }
  }, [radius]);

  // Smooth rotation spring animation to target angle
  const animateToAngle = useCallback((targetAngle: number, duration = 600) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startAngle = rotationRef.current;
    const diff = targetAngle - startAngle;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextAngle = startAngle + diff * ease;

      applyRotation(nextAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        applyRotation(targetAngle);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [applyRotation]);

  // Snap to closest card
  const snapToClosest = useCallback(() => {
    const nearestStep = Math.round(rotationRef.current / theta);
    const target = nearestStep * theta;
    animateToAngle(target, 450);
  }, [theta, animateToAngle]);

  // Reset to first card when items list changes (e.g. category filtered)
  useEffect(() => {
    applyRotation(0);
  }, [items, applyRotation]);

  // Auto-rotation idle loop
  useEffect(() => {
    let lastTime = performance.now();

    const autoRotateLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isAutoPlaying && !isDragging && !isHoveredRef.current) {
        // Gentle drift speed: ~4 degrees per second
        const newRot = rotationRef.current - 4.5 * delta;
        applyRotation(newRot);
      }

      animationFrameRef.current = requestAnimationFrame(autoRotateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(autoRotateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, applyRotation]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsDragging(true);
    didDragMoveRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      time: performance.now(),
      startRot: rotationRef.current,
    };
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    if (Math.abs(deltaX) > 4) {
      didDragMoveRef.current = true;
    }

    // Dynamic rotation sensitivity based on container width
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const sensitivity = 160; // degrees per full container width
    const rotDelta = (deltaX / containerWidth) * sensitivity;

    const newRot = dragStartRef.current.startRot + rotDelta;
    applyRotation(newRot);

    // Track instantaneous velocity
    const now = performance.now();
    const timeDelta = Math.max(1, now - dragStartRef.current.time);
    const distDelta = e.clientX - lastXRef.current;
    velocityRef.current = distDelta / timeDelta;
    lastXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }

    // Momentum coasting if dragged with speed
    const initialVelocity = velocityRef.current;
    if (Math.abs(initialVelocity) > 0.15) {
      let vel = initialVelocity * 45; // scale velocity to degrees
      let currentRot = rotationRef.current;

      const frictionStep = () => {
        vel *= 0.91; // damping
        currentRot += vel * 0.15;
        applyRotation(currentRot);

        if (Math.abs(vel) > 0.4) {
          animationFrameRef.current = requestAnimationFrame(frictionStep);
        } else {
          snapToClosest();
        }
      };

      animationFrameRef.current = requestAnimationFrame(frictionStep);
    } else {
      snapToClosest();
    }
  };

  // Wheel horizontal/vertical scrolling support
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      // Horizontal scroll
      e.preventDefault();
      const delta = e.deltaX || e.deltaY;
      applyRotation(rotationRef.current - delta * 0.12);
    }
  };

  // Step controls
  const handlePrev = () => {
    const target = Math.round(rotationRef.current / theta + 1) * theta;
    animateToAngle(target);
  };

  const handleNext = () => {
    const target = Math.round(rotationRef.current / theta - 1) * theta;
    animateToAngle(target);
  };

  // Click on a card
  const handleCardClick = (index: number) => {
    if (didDragMoveRef.current) {
      // User was dragging, not clicking
      return;
    }

    if (index === activeIndex) {
      // Centered card clicked: open lightbox
      if (onOpenLightbox) {
        onOpenLightbox(index % items.length);
      }
    } else {
      // Side card clicked: rotate to center it
      let diff = index - activeIndex;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;

      const targetAngle = rotationRef.current - diff * theta;
      animateToAngle(targetAngle);
    }
  };

  // WhatsApp booking helper
  const handleWhatsAppBooking = (designName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = getDesignWhatsAppMessage(designName);
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden rounded-3xl bg-gradient-to-b from-white/95 via-[#FFF0F5]/50 to-white/95 pt-4 pb-4 sm:pt-6 sm:pb-5 border border-[#F8C8DC] shadow-luxury transition-all"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onWheel={handleWheel}
      style={{ touchAction: "pan-y" }}
    >
      {/* Ambient Atmospheric Glows (Soft Pink & Rose Gold) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-[#F8C8DC]/40 via-[#FFF0F5]/20 to-transparent blur-3xl opacity-75" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-t from-[#B76E79]/15 via-transparent to-transparent blur-3xl opacity-60" />

      {/* Top Status Header inside Carousel */}
      <div className="relative z-20 flex items-center justify-end px-4 sm:px-8 mb-2 sm:mb-3">
        {/* Counter & Play/Pause */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F8C8DC] shadow-sm text-[11px] font-medium text-[#57243B]">
            <span className="text-[#8E2C58] font-bold">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[#57243B]/40">/</span>
            <span className="text-[#57243B]/60">{String(count).padStart(2, "0")}</span>
          </div>

          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-[#FFF0F5] border border-[#F8C8DC] text-[#57243B] transition-all shadow-sm active:scale-95"
            title={isAutoPlaying ? "Pause Auto-Rotation" : "Play Auto-Rotation"}
            aria-label="Toggle Auto-Rotation"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing preserve-3d"
        style={{
          height: `${dimensions.containerHeight}px`,
          perspective: `${dimensions.perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Cylindrical Rotator Parent */}
        <div
          ref={rotatorRef}
          className="relative w-full h-full flex items-center justify-center preserve-3d will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${currentRotation}deg)`,
          }}
        >
          {displayItems.map((item, i) => {
            const cardAngle = i * theta;

            // Calculate angle relative to front center
            let relAngle = (cardAngle + currentRotation) % 360;
            if (relAngle > 180) relAngle -= 360;
            if (relAngle < -180) relAngle += 360;

            const isFrontArc = Math.abs(relAngle) <= 88;
            const isCenterCard = Math.abs(relAngle) < theta / 2;

            return (
              <div
                key={`${item.id}-${i}`}
                onClick={() => handleCardClick(i)}
                className={`absolute preserve-3d transition-shadow duration-300 ${
                  isFrontArc ? "pointer-events-auto" : "pointer-events-none opacity-0"
                }`}
                style={{
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Individual Card Container - White Luxury Card */}
                <div
                  className={`group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 bg-white flex flex-col justify-between ${
                    isCenterCard
                      ? "border-[#B76E79] shadow-luxury-lg ring-2 ring-[#B76E79]/30"
                      : "border-[#F8C8DC] shadow-sm hover:border-[#B76E79]/50 hover:shadow-luxury"
                  }`}
                >
                  {/* Image Container with Consistent Aspect Ratio */}
                  <div className="relative h-[60%] w-full overflow-hidden bg-[#FFF0F5] shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />

                    {/* Category Pill Top Left */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#8E2C58] shadow-sm border border-white/80">
                        {item.category}
                      </span>
                    </div>

                    {/* Quick View Button Top Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenLightbox) {
                          onOpenLightbox(i % items.length);
                        }
                      }}
                      className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 text-[#57243B] hover:text-[#B76E79] flex items-center justify-center border border-white/80 transition-all active:scale-95 shadow-md"
                      title="Quick Preview"
                      aria-label="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content & Action Buttons */}
                  <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 bg-white border-t border-[#F8C8DC]/40 text-left">
                    <div>
                      <h3 className="font-serif text-base sm:text-xl font-bold text-[#57243B] group-hover:text-[#B76E79] transition-colors mb-1.5 line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#57243B]/70 line-clamp-2 mb-3.5 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#F8C8DC]/50">
                      <button
                        onClick={(e) => handleWhatsAppBooking(item.name, e)}
                        className="flex-1 py-2.5 px-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm hover:shadow-rosegold-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Book Design</span>
                      </button>

                      {onOpenBookingModal && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBookingModal(item.name);
                          }}
                          className="py-2.5 px-4 rounded-full text-xs font-medium text-[#57243B] bg-[#FFF0F5] hover:bg-[#F8C8DC]/40 border border-[#F8C8DC] transition-all"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="relative z-20 flex items-center justify-between gap-3 px-4 sm:px-8 mt-2.5 sm:mt-3">
        {/* Active Title Highlight */}
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#B76E79] shrink-0" />
          <span className="text-xs sm:text-sm font-serif font-bold text-[#57243B] truncate">
            {activeItem?.name || "Curated Nail Art"}
          </span>
          <span className="text-[11px] text-[#8E2C58] hidden sm:inline-block font-semibold shrink-0">
            — {activeItem?.category}
          </span>
        </div>

        {/* Prev & Next Floating Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#FFF0F5] border border-[#F8C8DC] text-[#57243B] shadow-sm active:scale-95 transition-all"
            aria-label="Previous Design"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#FFF0F5] border border-[#F8C8DC] text-[#57243B] shadow-sm active:scale-95 transition-all"
            aria-label="Next Design"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtle Drag Hint at Bottom */}
      <div className="relative z-20 mt-1.5 text-center flex items-center justify-center gap-1.5 text-[11px] text-[#57243B]/65 font-medium">
        <MoveHorizontal className="w-3.5 h-3.5 text-[#B76E79] animate-pulse" />
        <span>Swipe left or right to explore in 3D perspective</span>
      </div>
    </div>
  );
};
