import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GALLERY_CATEGORIES,
  GALLERY_DESIGNS,
  buildWhatsAppLink,
  getDesignWhatsAppMessage,
} from "../data/brandConfig";
import { Sparkles, MessageCircle, Eye, Grid, Layers } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { Curved3DCarousel } from "./Curved3DCarousel";

interface GalleryProps {
  onOpenBookingModal: (designName: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onOpenBookingModal }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [viewMode, setViewMode] = useState<"cylinder" | "grid">("cylinder");

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    if (activeCategory === "All") {
      return GALLERY_DESIGNS;
    }
    return GALLERY_DESIGNS.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  const displayedDesigns = filteredDesigns.slice(0, visibleCount);

  const handleDirectWhatsAppBooking = (designName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = getDesignWhatsAppMessage(designName);
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <section id="gallery" className="pt-10 pb-4 sm:pt-14 sm:pb-6 relative overflow-hidden bg-[#FFF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Gallery Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#F8C8DC] shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
              Portfolio Showcase
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-2.5">
            Explore the Nail Gallery
          </h2>

          <p className="text-xs sm:text-sm text-[#57243B]/75 leading-relaxed font-normal mb-5">
            Handcrafted luxury nail designs, delicate accents, and statement sets designed by Sanu.
          </p>

          {/* View Mode Switcher: 3D Cylinder vs Classic Grid */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#F8C8DC] shadow-sm">
            <button
              onClick={() => setViewMode("cylinder")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "cylinder"
                  ? "bg-gradient-to-r from-[#B76E79] to-[#BD5082] text-white shadow-sm"
                  : "text-[#57243B]/75 hover:text-[#57243B] hover:bg-[#FFF0F5]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Curved Cylinder</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-[#B76E79] to-[#BD5082] text-white shadow-sm"
                  : "text-[#57243B]/75 hover:text-[#57243B] hover:bg-[#FFF0F5]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Category Filters Bar - Smooth Horizontal Scrolling / Flex Wrapping */}
        <div className="w-full overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
          <div className="flex items-center gap-2 min-w-max px-1 sm:justify-center">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(12);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm scale-100"
                      : "text-[#57243B]/80 bg-white border border-[#F8C8DC]/70 hover:border-[#B76E79] hover:bg-[#FFF0F5]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode 1: 3D Curved Cylinder Carousel (Default) */}
        {viewMode === "cylinder" ? (
          <div className="w-full transition-opacity duration-300">
            <Curved3DCarousel
              items={filteredDesigns}
              onOpenBookingModal={onOpenBookingModal}
              onOpenLightbox={(idx) => setLightboxIndex(idx)}
            />
          </div>
        ) : (
          /* View Mode 2: Classic Grid */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <AnimatePresence>
                {displayedDesigns.map((design, index) => (
                  <motion.div
                    key={design.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-2xl overflow-hidden glass-card border border-[#F8C8DC] shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between bg-white"
                    onClick={() => setLightboxIndex(index)}
                  >
                    {/* Image Container with Consistent Aspect Ratio */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF0F5]/50">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Category Pill */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#8E2C58] shadow-sm border border-white/80">
                          {design.category}
                        </span>
                      </div>

                      {/* Quick View Icon */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="w-8 h-8 rounded-full bg-white/95 text-[#57243B] flex items-center justify-center shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Single Primary Booking Button */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#57243B] group-hover:text-[#B76E79] transition-colors mb-1">
                          {design.name}
                        </h3>
                        <p className="text-xs text-[#57243B]/70 line-clamp-2 mb-3.5 font-normal">
                          {design.description}
                        </p>
                      </div>

                      {/* ONE CLEAR PRIMARY BOOKING BUTTON */}
                      <div className="pt-2.5 border-t border-[#F8C8DC]/50">
                        <button
                          onClick={(e) => handleDirectWhatsAppBooking(design.name, e)}
                          className="w-full py-2.5 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm hover:shadow-rosegold-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          title={`Book ${design.name} on WhatsApp`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Book This Design</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More Button in Grid View */}
            {visibleCount < filteredDesigns.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#57243B] bg-white border border-[#F8C8DC] shadow-sm hover:bg-[#FFF0F5] transition-all hover:scale-[1.01]"
                >
                  Load More Designs
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        designs={displayedDesigns}
        currentIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        onOpenBookingModal={onOpenBookingModal}
      />
    </section>
  );
};
