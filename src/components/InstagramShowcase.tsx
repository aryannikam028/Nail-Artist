import React from "react";
import { BRAND_CONFIG } from "../data/brandConfig";
import { ExternalLink } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

export const InstagramShowcase: React.FC = () => {
  // 4 curated inspirational design images
  const instaPosts = [
    {
      id: "ig-1",
      image: "/images/hero-nail-art.jpg",
      title: "Glazed Blush Chrome Set",
    },
    {
      id: "ig-2",
      image: "/images/cute-girly.jpg",
      title: "3D Ribbon Bows & Jelly Charms",
    },
    {
      id: "ig-3",
      image: "/images/cat-eye-velvet.jpg",
      title: "Velvet Cat-Eye Magnetic Shift",
    },
    {
      id: "ig-4",
      image: "/images/bridal-pearl.jpg",
      title: "Freshwater Pearl Bridal Couture",
    },
  ];

  return (
    <section id="instagram" className="py-14 sm:py-20 relative overflow-hidden bg-[#FFF9FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#F8C8DC] shadow-sm mb-3">
            <InstagramIcon className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8E2C58]">
              Social Inspiration
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#57243B] mb-2.5">
            More Nail Inspiration on Instagram
          </h2>

          <p className="text-xs sm:text-sm text-[#57243B]/75 leading-relaxed font-normal mb-5">
            Discover ongoing design inspiration, recent client sets, and behind-the-scenes artistry.
          </p>

          {/* Single Clear Follow Button */}
          <a
            href={BRAND_CONFIG.instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] shadow-sm hover:shadow-md hover:scale-105 transition-all"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Follow @{BRAND_CONFIG.instagramUsername}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

        {/* 4 Clean Image Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {instaPosts.map((post) => (
            <a
              key={post.id}
              href={BRAND_CONFIG.instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-pink-50 shadow-sm border border-[#F8C8DC]/60 cursor-pointer block"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Clean Hover Overlay */}
              <div className="absolute inset-0 bg-[#57243B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-white text-center">
                <InstagramIcon className="w-6 h-6 mb-1.5 text-white" />
                <p className="text-xs font-medium text-white line-clamp-2">
                  {post.title}
                </p>
                <span className="text-[10px] text-[#F8C8DC] mt-1">
                  View on Instagram →
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
