import React from "react";
import { Sparkles, Calendar, Heart, MapPin } from "lucide-react";

interface AboutSanuProps {
  onOpenBookingModal: () => void;
}

export const AboutSanu: React.FC<AboutSanuProps> = ({ onOpenBookingModal }) => {
  return (
    <section id="about" className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5]/50 to-[#FFF9FC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Studio Workspace Image */}
          <div className="md:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-luxury bg-white">
              <img
                src="/images/artist-workspace.jpg"
                alt="Nails by Sanu Studio Space"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#57243B]/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle Brand Tag */}
            <div className="absolute -bottom-3 right-0 sm:-right-3 glass-card px-3 sm:px-3.5 py-1.5 rounded-full shadow-sm border border-[#F8C8DC] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79]" />
              <span className="font-script text-base text-[#57243B] font-semibold">
                Nails by Sanu
              </span>
            </div>
          </div>

          {/* Biography & Primary CTA */}
          <div className="md:col-span-7 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#F8C8DC] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
                  Artist Introduction
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] border border-[#F8C8DC] text-[10px] font-semibold text-[#8E2C58]">
                <MapPin className="w-3 h-3 text-[#B76E79]" />
                <span>Satara</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-4">
              Meet Sanu
            </h2>

            {/* Exact requested short editable text mentioning Satara */}
            <p className="text-sm sm:text-base text-[#57243B]/80 leading-relaxed font-normal mb-6">
              Welcome to Nails by Sanu, based in Satara, where creativity meets elegance. Discover beautiful nail designs, delicate details, and styles that express your personality. Find your favourite look and get in touch to enquire about an appointment.
            </p>

            {/* Single Primary CTA */}
            <div className="flex justify-center md:justify-start">
              <button
                onClick={onOpenBookingModal}
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-luxury hover:shadow-rosegold-glow transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Nail Appointment</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
