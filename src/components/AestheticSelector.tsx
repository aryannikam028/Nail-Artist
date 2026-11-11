import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NAIL_AESTHETICS,
  GALLERY_DESIGNS,
  buildWhatsAppLink,
  getAestheticWhatsAppMessage,
} from "../data/brandConfig";
import { Sparkles, MessageCircle, ArrowRight, Check } from "lucide-react";

interface AestheticSelectorProps {
  onSelectDesignForBooking: (designName: string) => void;
}

export const AestheticSelector: React.FC<AestheticSelectorProps> = ({
  onSelectDesignForBooking,
}) => {
  const [selectedId, setSelectedId] = useState<string>("soft-girl");

  const currentAesthetic =
    NAIL_AESTHETICS.find((a) => a.id === selectedId) || NAIL_AESTHETICS[0];

  const matchingDesigns = GALLERY_DESIGNS.filter(
    (design) =>
      design.aestheticId === selectedId ||
      currentAesthetic.sampleDesignIds.includes(design.id)
  ).slice(0, 2); // Show only 2 recommended designs for a compact, balanced look

  const handleWhatsAppBooking = (designName?: string) => {
    const message = getAestheticWhatsAppMessage(currentAesthetic.name, designName);
    window.open(buildWhatsAppLink(message), "_blank");
  };

  const scrollToGallery = () => {
    const galleryEl = document.getElementById("gallery");
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="aesthetic-finder" className="py-14 sm:py-18 relative overflow-hidden bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5]/40 to-[#FFF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#F8C8DC] shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
              Interactive Style Matcher
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-2.5">
            What Is Your Nail Aesthetic?
          </h2>
          <p className="text-xs sm:text-sm text-[#57243B]/75 leading-relaxed font-normal">
            Tap a style below to see curated design recommendations that match your vibe.
          </p>
        </div>

        {/* 8 Compact Aesthetic Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mb-8">
          {NAIL_AESTHETICS.map((aesthetic) => {
            const isSelected = aesthetic.id === selectedId;
            return (
              <button
                key={aesthetic.id}
                onClick={() => setSelectedId(aesthetic.id)}
                className={`relative p-2 sm:p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${
                  isSelected
                    ? "bg-white border-2 border-[#B76E79] shadow-rosegold-glow scale-[1.02] z-10"
                    : "glass-card hover:border-[#EFA6C8] hover:scale-[1.01]"
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B76E79] text-white flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                
                {/* Visual Thumbnail */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mb-1.5 border border-white shadow-sm">
                  <img
                    src={aesthetic.image}
                    alt={aesthetic.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <span className="font-serif font-bold text-[11px] sm:text-xs text-[#57243B] leading-tight">
                  {aesthetic.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Result Spotlight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAesthetic.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl glass-card border border-[#F8C8DC] p-4 sm:p-7 shadow-luxury max-w-4xl mx-auto bg-white/80"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Aesthetic Details */}
              <div className="md:col-span-5 text-center md:text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#8E2C58] font-semibold bg-[#FFF0F5] px-2.5 py-0.5 rounded-full border border-[#F8C8DC]">
                  Selected Aesthetic
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#57243B] mt-2 mb-1">
                  {currentAesthetic.name}
                </h3>
                <p className="font-script text-base text-[#B76E79] mb-2">
                  “{currentAesthetic.tagline}”
                </p>
                <p className="text-xs text-[#57243B]/80 leading-relaxed mb-4">
                  {currentAesthetic.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                  <button
                    onClick={() => handleWhatsAppBooking()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm hover:shadow-rosegold-glow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Book "{currentAesthetic.name}" Look</span>
                  </button>

                  <button
                    onClick={scrollToGallery}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-full text-xs font-medium text-[#57243B] bg-white border border-[#F8C8DC] hover:bg-[#FFF0F5] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View in Gallery</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 2 Recommended Design Cards */}
              <div className="md:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {matchingDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="group relative rounded-2xl overflow-hidden bg-white border border-[#F8C8DC]/80 shadow-sm flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={design.image}
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/95 text-[#8E2C58] border border-white/80">
                            {design.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <h4 className="font-serif font-bold text-xs text-[#57243B] mb-1 line-clamp-1">
                          {design.name}
                        </h4>
                        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F8C8DC]/40">
                          <button
                            onClick={() => handleWhatsAppBooking(design.name)}
                            className="flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-white bg-[#B76E79] hover:bg-[#8E2C58] transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          
                          <button
                            onClick={() => onSelectDesignForBooking(design.name)}
                            className="py-1.5 px-2.5 rounded-lg text-[11px] font-medium text-[#57243B] bg-[#FFF0F5] hover:bg-[#F8C8DC] transition-colors"
                          >
                            Form
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
