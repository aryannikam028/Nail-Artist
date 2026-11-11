import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BRAND_CONFIG,
  GALLERY_DESIGNS,
  NAIL_SERVICES,
  buildWhatsAppLink,
  getFullBookingMessage,
  getInstagramDmText,
  type BookingInquiryData,
} from "../data/brandConfig";
import {
  X,
  MessageCircle,
  Calendar,
  Clock,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDesign?: string;
  initialService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialDesign = "",
  initialService = "",
}) => {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "instagram">("whatsapp");
  
  // Form State
  const [formData, setFormData] = useState<BookingInquiryData>({
    customerName: "",
    selectedDesign: initialDesign,
    selectedService: initialService || "Custom Nail Art",
    preferredDate: "",
    preferredTime: "Afternoon (1 PM - 4 PM)",
    additionalMessage: "",
  });

  const [nameError, setNameError] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync initial props
  useEffect(() => {
    if (initialDesign) {
      setFormData((prev) => ({ ...prev, selectedDesign: initialDesign }));
    }
    if (initialService) {
      setFormData((prev) => ({ ...prev, selectedService: initialService }));
    }
  }, [initialDesign, initialService]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setNameError("Please enter your name so Sanu knows who is inquiring.");
      return;
    }
    setNameError("");

    // Trigger luxury pink celebration confetti!
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F8C8DC", "#EFA6C8", "#B76E79", "#57243B"],
    });

    const fullMessage = getFullBookingMessage(formData);
    const link = buildWhatsAppLink(fullMessage);

    setTimeout(() => {
      window.open(link, "_blank");
      onClose();
    }, 450);
  };

  const handleCopyInstagramText = () => {
    const textToCopy = getInstagramDmText(
      formData.selectedDesign || formData.selectedService
    );
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#381324]/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#F8C8DC] my-auto sm:my-8 flex flex-col max-h-[95vh] sm:max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-7 bg-gradient-to-r from-[#FFF0F5] via-[#FFF9FC] to-[#FDE2EC] border-b border-[#F8C8DC]/60 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[11px] font-semibold text-[#8E2C58] border border-[#F8C8DC] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Appointment Inquiry</span>
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#57243B]">
                Book Your Studio Session
              </h3>
              <p className="text-xs sm:text-sm text-[#57243B]/75 mt-1">
                Direct inquiry with Sanu via WhatsApp (+91 {BRAND_CONFIG.whatsappNumber}) or Instagram DM.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#57243B] hover:bg-[#F8C8DC] flex items-center justify-center shadow-sm transition-colors flex-shrink-0"
              aria-label="Close booking modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Booking Method Selector Tabs */}
          <div className="flex border-b border-[#F8C8DC]/60 bg-[#FFF9FC] p-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                activeTab === "whatsapp"
                  ? "bg-white text-[#25D366] shadow-sm border border-[#F8C8DC]"
                  : "text-[#57243B]/70 hover:text-[#57243B]"
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Inquiry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("instagram")}
              className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                activeTab === "instagram"
                  ? "bg-white text-[#E1306C] shadow-sm border border-[#F8C8DC]"
                  : "text-[#57243B]/70 hover:text-[#57243B]"
              }`}
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span>Instagram DM</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-7 overflow-y-auto flex-1">
            {activeTab === "whatsapp" ? (
              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData({ ...formData, customerName: e.target.value });
                      if (nameError) setNameError("");
                    }}
                    className={`w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border ${
                      nameError ? "border-red-400 ring-2 ring-red-200" : "border-[#F8C8DC]"
                    } text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all`}
                  />
                  {nameError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{nameError}</span>
                    </p>
                  )}
                </div>

                {/* Selected Design & Service Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider">
                      Selected Nail Design
                    </label>
                    <select
                      value={formData.selectedDesign}
                      onChange={(e) =>
                        setFormData({ ...formData, selectedDesign: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                    >
                      <option value="">I have my own reference photo</option>
                      {GALLERY_DESIGNS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider">
                      Service Category
                    </label>
                    <select
                      value={formData.selectedService}
                      onChange={(e) =>
                        setFormData({ ...formData, selectedService: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                    >
                      {NAIL_SERVICES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredDate: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>Preferred Time Window</span>
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredTime: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                    >
                      <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                      <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                      <option value="Flexible / Any available slot">Flexible / Any slot</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#57243B] mb-1.5 uppercase tracking-wider">
                    Additional Notes / Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need extension removal first, or customized colors to match my lehenga."
                    value={formData.additionalMessage}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalMessage: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FC] border border-[#F8C8DC] text-sm text-[#57243B] focus:outline-none focus:border-[#B76E79] focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn-shimmer w-full py-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Inquiry via WhatsApp (+91 {BRAND_CONFIG.whatsappNumber})</span>
                </button>

                {/* Clear Disclaimer */}
                <p className="text-[11px] text-center text-[#57243B]/65 leading-normal">
                  Note: This submits an inquiry directly to Sanu's official WhatsApp. Appointment is confirmed once availability and details are verified with you.
                </p>
              </form>
            ) : (
              /* Instagram DM Option */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E1306C] via-[#FD1D1D] to-[#F56040] text-white flex items-center justify-center mx-auto shadow-md">
                  <InstagramIcon className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-serif text-xl font-bold text-[#57243B] mb-1">
                    Book Directly via Instagram DM
                  </h4>
                  <p className="text-xs sm:text-sm text-[#57243B]/75 max-w-md mx-auto">
                    Prefer connecting on Instagram? Copy the prewritten message below and message Sanu directly on <strong>@{BRAND_CONFIG.instagramUsername}</strong>.
                  </p>
                </div>

                {/* Prewritten Box */}
                <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#F8C8DC] text-left max-w-md mx-auto relative group">
                  <p className="text-xs text-[#57243B] font-mono leading-relaxed">
                    {getInstagramDmText(
                      formData.selectedDesign || formData.selectedService
                    )}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={handleCopyInstagramText}
                    className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-semibold text-[#57243B] bg-white border border-[#B76E79] hover:bg-[#FFF0F5] transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-bold">Message Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#B76E79]" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={BRAND_CONFIG.instagramProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open @{BRAND_CONFIG.instagramUsername}</span>
                  </a>
                </div>

                <p className="text-[11px] text-[#57243B]/60">
                  Paste the copied message into Sanu's Instagram DM to start your consultation.
                </p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
