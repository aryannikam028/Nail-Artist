import React, { useState, useEffect } from "react";
import { BRAND_CONFIG } from "../data/brandConfig";
import { Sparkles, Menu, X, MessageCircle, Calendar } from "lucide-react";

interface NavbarProps {
  onOpenBooking: (designName?: string, serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Nail Aesthetic", href: "#aesthetic-finder" },
    { name: "Gallery", href: "#gallery" },
    { name: "Services", href: "#services" },
    { name: "Meet Sanu", href: "#about" },
    { name: "Instagram", href: "#instagram" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav py-2.5 shadow-glass"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Sparkle Motif */}
          <a
            href="#home"
            className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01]"
            aria-label="Nails by Sanu Homepage"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#EFA6C8] to-[#B76E79] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#57243B] leading-none group-hover:text-[#B76E79] transition-colors">
                Nails by Sanu
              </span>
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#B76E79] font-medium mt-0.5">
                Luxury Nail Art
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-xs sm:text-sm font-medium text-[#57243B]/80 hover:text-[#57243B] transition-colors py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#EFA6C8] to-[#B76E79] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={BRAND_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-[#57243B]/70 hover:text-[#25D366] hover:bg-white transition-all border border-[#F8C8DC]/60"
              title="Chat with Sanu on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm hover:shadow-rosegold-glow transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#B76E79] shadow-sm flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Book</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#57243B] hover:bg-white/60 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-nav border-t border-[#F8C8DC]/40 px-5 pt-3 pb-5 mt-2 shadow-lg animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#57243B] hover:text-[#B76E79] py-1.5 border-b border-[#F8C8DC]/30 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-[#EFA6C8] text-xs">✦</span>
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 rounded-full text-center text-xs font-semibold text-white bg-gradient-to-r from-[#B76E79] to-[#BD5082] shadow-sm"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
