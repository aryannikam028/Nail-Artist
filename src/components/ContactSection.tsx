import React from "react";
import { BRAND_CONFIG, buildWhatsAppLink } from "../data/brandConfig";
import { MessageCircle, Sparkles, Calendar } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

interface ContactSectionProps {
  onOpenBookingModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenBookingModal,
}) => {
  const whatsappUrl = buildWhatsAppLink(
    "Hello Sanu! I found your website and I am interested in booking an appointment for nail art. Please share your availability. Thank you!"
  );

  return (
    <section id="contact" className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5]/60 to-[#FFF9FC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Contact Container Card */}
        <div className="rounded-3xl glass-card p-6 sm:p-10 border border-[#F8C8DC] shadow-luxury relative overflow-hidden text-center bg-white/95">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF0F5] border border-[#F8C8DC] shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
              Appointments & Inquiries
            </span>
          </div>

          {/* Requested Final CTA Heading */}
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-2.5">
            Ready for Your Next Nail Look?
          </h2>

          <p className="text-xs sm:text-sm text-[#57243B]/80 max-w-lg mx-auto leading-relaxed mb-6 font-normal">
            Send your reference photo or preferred style directly to Sanu on WhatsApp or Instagram to confirm availability and discuss your appointment.
          </p>

          {/* Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-6">
            {/* WhatsApp Box */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] hover:border-[#25D366] hover:bg-white shadow-sm transition-all duration-200 group flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#57243B]/60 font-medium block">
                  Official WhatsApp
                </span>
                <span className="font-semibold text-xs text-[#57243B]">
                  +91 {BRAND_CONFIG.whatsappNumber}
                </span>
              </div>
            </a>

            {/* Instagram Box */}
            <a
              href={BRAND_CONFIG.instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] hover:border-[#E1306C] hover:bg-white shadow-sm transition-all duration-200 group flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#57243B]/60 font-medium block">
                  Instagram
                </span>
                <span className="font-semibold text-xs text-[#57243B]">
                  @{BRAND_CONFIG.instagramUsername}
                </span>
              </div>
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Book on WhatsApp</span>
            </a>

            <button
              onClick={onOpenBookingModal}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-[#57243B] bg-white border border-[#F8C8DC] shadow-sm hover:bg-[#FFF0F5] transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Book via Appointment Form</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
