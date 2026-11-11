import React from "react";
import { BRAND_CONFIG } from "../data/brandConfig";
import { Sparkles, MessageCircle, Heart, ArrowUp } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5] to-[#FDE2EC] border-t border-[#F8C8DC] pt-16 pb-12 overflow-hidden">
      {/* Decorative Top Sparkles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col items-center text-center mb-12">
          
          {/* Wordmark Logo */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EFA6C8] to-[#B76E79] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight text-[#57243B]">
              Nails by Sanu
            </span>
          </div>

          {/* Tagline */}
          <p className="font-script text-xl sm:text-2xl text-[#B76E79] max-w-md mb-6">
            “{BRAND_CONFIG.tagline}”
          </p>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#57243B]/80 font-medium mb-8">
            <a href="#home" className="hover:text-[#B76E79] transition-colors">
              Home
            </a>
            <a href="#gallery" className="hover:text-[#B76E79] transition-colors">
              Nail Designs
            </a>
            <a href="#services" className="hover:text-[#B76E79] transition-colors">
              Services
            </a>
            <a href="#aesthetic-finder" className="hover:text-[#B76E79] transition-colors">
              Aesthetic Finder
            </a>
            <a href="#about" className="hover:text-[#B76E79] transition-colors">
              About Sanu
            </a>
            <a href="#instagram" className="hover:text-[#B76E79] transition-colors">
              Instagram
            </a>
            <a href="#contact" className="hover:text-[#B76E79] transition-colors">
              Contact
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href={BRAND_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#F8C8DC] flex items-center justify-center transition-all shadow-sm hover:scale-105"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <a
              href={BRAND_CONFIG.instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white text-[#E1306C] hover:bg-[#E1306C] hover:text-white border border-[#F8C8DC] flex items-center justify-center transition-all shadow-sm hover:scale-105"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-white text-[#57243B] hover:bg-[#57243B] hover:text-white border border-[#F8C8DC] flex items-center justify-center transition-all shadow-sm hover:scale-105"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-[#F8C8DC]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#57243B]/60 gap-4">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName}. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-current" />
            <span>for luxury nail lovers.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
