import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FloatingDecorations } from "./components/FloatingDecorations";
import { AestheticSelector } from "./components/AestheticSelector";
import { Gallery } from "./components/Gallery";
import { Services } from "./components/Services";
import { AboutSanu } from "./components/AboutSanu";
import { InstagramShowcase } from "./components/InstagramShowcase";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { BookingModal } from "./components/BookingModal";

export function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDesignForBooking, setSelectedDesignForBooking] = useState<string>("");
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>("");

  const handleOpenBooking = (designName?: string, serviceName?: string) => {
    setSelectedDesignForBooking(designName || "");
    setSelectedServiceForBooking(serviceName || "");
    setBookingModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9FC] text-[#57243B] selection:bg-[#F8C8DC] selection:text-[#57243B]">
      {/* Subtle Ambient Decorative Glows */}
      <FloatingDecorations />

      {/* Sticky Navigation Bar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Page Flow */}
      <main id="main-content">
        {/* 1. Dimensional 3D Studio Hero with Automated Cinematic Sequence */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Interactive "What Is Your Nail Aesthetic?" Finder */}
        <AestheticSelector
          onSelectDesignForBooking={(designName) => handleOpenBooking(designName)}
        />

        {/* 3. Main Gallery: Explore the Nail Gallery */}
        <Gallery
          onOpenBookingModal={(designName) => handleOpenBooking(designName)}
        />

        {/* 4. Services Menu: Nail Art & Services */}
        <Services
          onOpenBookingModal={(designName, serviceName) =>
            handleOpenBooking(designName, serviceName)
          }
        />

        {/* 5. Artist Bio: Meet Sanu */}
        <AboutSanu onOpenBookingModal={() => handleOpenBooking()} />

        {/* 6. Instagram Showcase: More Nail Inspiration on Instagram */}
        <InstagramShowcase />

        {/* 7. Final Action: Ready for Your Next Nail Look? */}
        <ContactSection onOpenBookingModal={() => handleOpenBooking()} />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Central Booking & Inquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialDesign={selectedDesignForBooking}
        initialService={selectedServiceForBooking}
      />
    </div>
  );
}

export default App;
