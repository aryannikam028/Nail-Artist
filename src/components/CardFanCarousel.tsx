import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Star,
  MessageCircle,
  MoveHorizontal,
} from "lucide-react";
import {
  type NailService,
  buildWhatsAppLink,
  getServiceWhatsAppMessage,
} from "../data/brandConfig";

interface CardFanCarouselProps {
  services: NailService[];
  onOpenBookingModal?: (designName?: string, serviceName?: string) => void;
}

export const CardFanCarousel: React.FC<CardFanCarouselProps> = ({
  services,
  onOpenBookingModal,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Responsive device scale
  const [deviceSize, setDeviceSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  const total = services.length;
  const timerRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number>(0);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceSize("mobile");
      } else if (width < 1024) {
        setDeviceSize("tablet");
      } else {
        setDeviceSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Step navigation
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || isHovered || isDragging) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      handleNext();
    }, 4200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, isDragging, handleNext]);

  // Direct WhatsApp link
  const handleWhatsAppEnquiry = (serviceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = getServiceWhatsAppMessage(serviceName);
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  // Pointer drag handling for natural swipe feel
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    // Dampen drag preview
    setDragOffset(diff * 0.45);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }

    const diff = e.clientX - dragStartXRef.current;
    const threshold = deviceSize === "mobile" ? 35 : 55;

    if (diff < -threshold) {
      handleNext();
    } else if (diff > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Dimensions based on device
  const getCardDimensions = () => {
    if (deviceSize === "mobile") {
      const screenW = typeof window !== "undefined" ? window.innerWidth : 360;
      const cardW = Math.max(220, Math.min(250, screenW - 60));
      return { width: cardW, height: 380, xSpread: 46, angleSpread: 8, yCurve: 12 };
    }
    if (deviceSize === "tablet") {
      return { width: 300, height: 430, xSpread: 125, angleSpread: 12, yCurve: 20 };
    }
    return { width: 330, height: 460, xSpread: 175, angleSpread: 14, yCurve: 26 };
  };

  const { width, height, xSpread, angleSpread, yCurve } = getCardDimensions();

  return (
    <div
      className="relative w-full py-4 sm:py-8 flex flex-col items-center justify-center select-none overflow-x-clip"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {/* Upper Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#F8C8DC]/30 to-transparent blur-3xl opacity-70" />

      {/* Fan Cards Container */}
      <div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible touch-pan-y max-w-full"
        style={{
          height: `${height + 60}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {services.map((service, index) => {
          // Calculate cyclic offset relative to active card
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;

          // Drag adjustment influence
          const dragInfluence = isDragging ? dragOffset / 100 : 0;
          const adjustedOffset = offset + dragInfluence;

          // Fan geometry calculation
          const rotationAngle = adjustedOffset * angleSpread;
          const xPos = adjustedOffset * xSpread;
          const yPos = Math.abs(adjustedOffset) * yCurve + (isActive ? -10 : 10);
          const scale = isActive ? 1.03 : Math.max(0.86, 1 - Math.abs(adjustedOffset) * 0.07);
          const zIndex = total - Math.abs(Math.round(offset));
          const opacity = Math.abs(offset) > 2 ? 0.2 : (deviceSize === "mobile" && Math.abs(offset) > 1 ? 0.45 : 1);

          return (
            <motion.div
              key={service.id}
              className="absolute will-change-transform"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transformOrigin: "50% 120%",
                zIndex,
              }}
              animate={{
                x: xPos,
                y: yPos,
                rotate: rotationAngle,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                mass: 0.8,
              }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
            >
              {/* Card Shell */}
              <div
                className={`group relative w-full h-full rounded-3xl overflow-hidden glass-card border transition-all duration-300 flex flex-col justify-between bg-white ${
                  isActive
                    ? "border-[#B76E79] shadow-[0_20px_50px_rgba(183,110,121,0.28)] ring-2 ring-[#B76E79]/30"
                    : "border-[#F8C8DC]/70 shadow-md hover:border-[#B76E79]/50 hover:shadow-luxury cursor-pointer"
                }`}
              >
                {/* Image Container with Consistent Aspect Ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF0F5] shrink-0">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Gentle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#57243B]/30 via-transparent to-transparent pointer-events-none" />

                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#B76E79] text-white shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Popular</span>
                      </span>
                    </div>
                  )}

                  {/* Card Number Indicator */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-sm text-[#8E2C58] shadow-sm">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#57243B] group-hover:text-[#B76E79] transition-colors mb-1.5 leading-snug">
                      {service.name}
                    </h3>

                    <p className="text-xs text-[#57243B]/75 leading-relaxed mb-4 font-normal line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#F8C8DC]/50 flex items-center gap-2">
                    <button
                      onClick={(e) => handleWhatsAppEnquiry(service.name, e)}
                      className="flex-1 py-2.5 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm hover:shadow-rosegold-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      title={`Enquire about ${service.name} on WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire on WhatsApp</span>
                    </button>

                    {onOpenBookingModal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBookingModal(undefined, service.name);
                        }}
                        className="py-2.5 px-3 rounded-full text-xs font-medium text-[#57243B] bg-[#FFF0F5] hover:bg-[#F8C8DC]/40 border border-[#F8C8DC] transition-all"
                        title="Book Consultation"
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Center Control Pill (Matching Reference UI) */}
      <div className="relative z-20 mt-4 sm:mt-6 flex flex-col items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#F8C8DC] shadow-luxury backdrop-blur-md">
          {/* Counter Badge */}
          <div className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[11px] font-bold text-[#8E2C58] border border-[#F8C8DC]/70">
            0{activeIndex + 1} / 0{total}
          </div>

          <div className="h-4 w-px bg-[#F8C8DC]" />

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF0F5] text-[#57243B] border border-[#F8C8DC] flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label="Previous service"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B76E79] to-[#BD5082] text-white flex items-center justify-center transition-all active:scale-90 shadow-sm hover:shadow-rosegold-glow"
            aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF0F5] text-[#57243B] border border-[#F8C8DC] flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label="Next service"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Drag Hint */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#57243B]/60 font-medium">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#B76E79] animate-pulse" />
          <span>Swipe cards or click to view details</span>
        </div>
      </div>
    </div>
  );
};
