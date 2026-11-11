import React from "react";
import { NAIL_SERVICES } from "../data/brandConfig";
import { Sparkles } from "lucide-react";
import { CardFanCarousel } from "./CardFanCarousel";

interface ServicesProps {
  onOpenBookingModal: (designName?: string, serviceName?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenBookingModal }) => {
  return (
    <section
      id="services"
      className="pt-4 pb-12 sm:pt-6 sm:pb-16 relative overflow-hidden bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5]/30 to-[#FFF9FC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Preserved exactly with zero changes */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#F8C8DC] shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
              Artistry Menu
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-2.5">
            Nail Art & Services
          </h2>

          <p className="text-xs sm:text-sm text-[#57243B]/75 leading-relaxed font-normal">
            Professional nail care, extensions, and custom artistry designed around your aesthetic.
          </p>
        </div>

        {/* Interactive Fanned Arc Card Scroll */}
        <div className="w-full flex justify-center">
          <CardFanCarousel
            services={NAIL_SERVICES}
            onOpenBookingModal={onOpenBookingModal}
          />
        </div>

      </div>
    </section>
  );
};
