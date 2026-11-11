import React, { useState } from "react";
import { buildWhatsAppLink } from "../data/brandConfig";
import { MessageCircle, X } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = `Hello Sanu! I'm visiting your nail art website and would love to enquire about booking an appointment. Thank you!`;
  const whatsappUrl = buildWhatsAppLink(defaultMessage);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="mb-2 p-2.5 sm:p-3 rounded-2xl glass-card shadow-luxury border border-[#F8C8DC] max-w-[190px] sm:max-w-[210px] animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-white text-[#57243B] border border-[#F8C8DC] flex items-center justify-center text-[10px] hover:bg-[#F8C8DC]"
            aria-label="Dismiss chat tooltip"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-[10px] sm:text-[11px] font-medium text-[#57243B] leading-tight">
            Hi! Chat directly with Sanu for nail appointments & quotes ✨
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp with Nails by Sanu"
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 blur-sm animate-ping pointer-events-none" />
        
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Badge Dot */}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFF9FC] border-2 border-[#25D366] z-20" />
      </a>
    </div>
  );
};
