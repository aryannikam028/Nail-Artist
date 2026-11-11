import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type NailDesign, buildWhatsAppLink, getDesignWhatsAppMessage } from "../data/brandConfig";
import { X, ChevronLeft, ChevronRight, MessageCircle, Calendar } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  designs: NailDesign[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onOpenBookingModal: (designName: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  designs,
  currentIndex,
  onClose,
  onNavigate,
  onOpenBookingModal,
}) => {
  const currentDesign = designs[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < designs.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // loop
    }
  }, [currentIndex, designs.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(designs.length - 1); // loop
    }
  }, [currentIndex, designs.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentDesign) return null;

  const handleDirectWhatsApp = () => {
    const msg = getDesignWhatsAppMessage(currentDesign.name);
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#381324]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#F8C8DC] my-auto max-h-[96vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 text-[#57243B] hover:bg-[#F8C8DC] flex items-center justify-center shadow-md transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto max-h-[96vh] md:max-h-[85vh]">
            
            {/* Image Preview & Next/Prev Controls */}
            <div className="md:col-span-7 bg-[#FFF9FC] relative flex items-center justify-center overflow-hidden min-h-[220px]">
              <img
                src={currentDesign.image}
                alt={currentDesign.name}
                className="w-full h-auto max-h-[42vh] md:max-h-[85vh] object-contain p-2"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#57243B] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                aria-label="Previous design"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#57243B] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                aria-label="Next design"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Counter Pill */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-[#57243B] shadow-sm backdrop-blur-sm">
                {currentIndex + 1} of {designs.length}
              </div>
            </div>

            {/* Design Details & Booking Actions */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-white to-[#FFF9FC]">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FFF0F5] text-[#8E2C58] border border-[#F8C8DC] mb-3">
                  {currentDesign.category}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#57243B] mb-3 leading-tight">
                  {currentDesign.name}
                </h3>

                <p className="text-sm text-[#57243B]/80 leading-relaxed mb-6">
                  {currentDesign.description}
                </p>

                {currentDesign.optionalPrice && (
                  <div className="mb-6 p-3 rounded-xl bg-[#FFF0F5] border border-[#F8C8DC]">
                    <span className="text-xs text-[#57243B]/70 block">Estimated Starting Price</span>
                    <span className="font-serif text-xl font-bold text-[#8E2C58]">
                      {currentDesign.optionalPrice}
                    </span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#F8C8DC]/20 border border-[#F8C8DC]/60 mb-6">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#B76E79] text-base leading-none">✦</span>
                    <p className="text-xs text-[#57243B]/75 leading-normal">
                      Each design is custom-crafted to your natural nail length, desired shape, and personalized color nuances by Sanu.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-4 border-t border-[#F8C8DC]/50">
                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-luxury hover:shadow-rosegold-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book This Design on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenBookingModal(currentDesign.name);
                  }}
                  className="w-full py-3 px-4 rounded-full text-sm font-medium text-[#57243B] bg-white border border-[#F8C8DC] hover:bg-[#FFF0F5] transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#B76E79]" />
                  <span>Choose Date & Time via Form</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
