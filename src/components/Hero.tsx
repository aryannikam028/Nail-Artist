import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, Heart } from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;

    // Attempt unmuted playback; if browser restricts, play immediately and unlock audio on interaction
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: immediately play so video starts automatically without waiting for user click
        video.muted = true;
        video.play().catch(() => {});

        // Unmute automatically on first user gesture anywhere on the window
        const unlockAudio = () => {
          if (video && !video.ended) {
            video.muted = false;
            video.play().catch(() => {});
          }
          window.removeEventListener("pointerdown", unlockAudio);
          window.removeEventListener("touchstart", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("scroll", unlockAudio);
          window.removeEventListener("wheel", unlockAudio);
        };

        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
        window.addEventListener("click", unlockAudio, { once: true });
        window.addEventListener("scroll", unlockAudio, { once: true });
        window.addEventListener("wheel", unlockAudio, { once: true });
      });
    }
  }, []);

  const handleVideoEnded = () => {
    setHasEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply desktop mouse parallax if viewport is large enough
    if (window.innerWidth < 1024) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] lg:min-h-[92vh] pt-24 pb-12 sm:pt-28 sm:pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF9FC] via-[#FFF0F5]/70 to-[#FFF9FC]"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(248,200,220,0.4),rgba(255,249,252,0))] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 text-center lg:text-left"
          >
            {/* Delicate Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#F8C8DC] shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
                Bespoke Pink Luxury Nail Art
              </span>
            </div>

            {/* Bold High-Impact Luxury Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#57243B] leading-[1.14] mb-5">
              A Little Art. <br className="hidden sm:inline" />
              <span className="text-luxury-gradient">A Lot of Elegance.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#57243B]/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-7">
              Discover your signature nail style with beautiful designs, delicate details, and a touch of pink luxury.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#gallery"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#B76E79] via-[#EFA6C8] to-[#BD5082] shadow-luxury hover:shadow-rosegold-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Explore Nail Designs</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-[#57243B] bg-white/90 border border-[#F8C8DC] shadow-sm hover:border-[#B76E79] hover:bg-white transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-4 h-4 text-[#B76E79]" />
                <span>Book Your Appointment</span>
              </button>
            </div>

            {/* Clean Micro Indicators */}
            <div className="mt-8 pt-5 border-t border-[#F8C8DC]/50 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#57243B]/70">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EFA6C8]" />
                <span>Handcrafted Art</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
                <span>Salon-Grade Gels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BD5082]" />
                <span>Personalized Sessions</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Layered Editorial Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center"
          >
            <div
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
                transition: "transform 0.2s ease-out",
              }}
              className="relative w-full max-w-[460px] aspect-[4/4.2]"
            >
              {/* Back Glow Aura */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#F8C8DC] via-[#EFA6C8]/30 to-[#E9DDF8] rounded-[2.5rem] blur-2xl opacity-60 -z-10" />

              {/* Main Luxury Video Frame */}
              <div
                onClick={() => {
                  if (hasEnded && videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.muted = false;
                    setHasEnded(false);
                    videoRef.current.play().catch(() => {});
                  } else if (videoRef.current && videoRef.current.muted) {
                    videoRef.current.muted = false;
                  }
                }}
                className={`w-full h-full rounded-[2rem] overflow-hidden border-2 border-white/90 shadow-luxury-lg relative bg-[#FFF0F5] group ${
                  hasEnded ? "cursor-pointer" : ""
                }`}
              >
                <video
                  ref={videoRef}
                  src="/videos/hero-video.mp4"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover"
                />

                {/* Subtle Glass Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating 3D Nail Polish Bottle Element */}
              <div className="absolute -bottom-4 left-0 sm:-bottom-6 sm:-left-8 w-24 sm:w-36 aspect-square rounded-2xl p-1.5 glass-card shadow-luxury border-2 border-white/90 z-30 animate-float-slow">
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-white/80">
                  <img
                    src="/images/luxury-polish-bottle.jpg"
                    alt="Luxury Nail Lacquer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 text-[8px] bg-[#B76E79] text-white px-1.5 py-0.5 rounded-full font-medium">
                    Gel Luxury
                  </div>
                </div>
              </div>

              {/* Floating "Made with Love by Sanu" Badge */}
              <div className="absolute -top-3 right-0 sm:-top-4 sm:-right-5 glass-card px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full shadow-luxury border border-[#F8C8DC] flex items-center gap-1.5 z-30 animate-float-reverse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#F8C8DC] flex items-center justify-center text-[#8E2C58]">
                  <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#8E2C58]" />
                </div>
                <span className="font-script text-xs sm:text-base text-[#57243B] font-semibold tracking-wide">
                  Made with Love by Sanu
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
