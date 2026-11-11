import React from "react";

export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Soft Ambient Light Orbs - Subtle and Non-distracting */}
      <div className="absolute top-[8%] left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-[#F8C8DC]/20 to-[#EFA6C8]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[50%] right-[3%] w-96 h-96 rounded-full bg-gradient-to-bl from-[#E9DDF8]/20 to-[#F8C8DC]/15 blur-3xl pointer-events-none" />

      {/* Subtle Desktop-Only Sparkles */}
      <div className="hidden lg:block absolute top-[20%] left-[12%] text-[#B76E79]/40 text-sm select-none">
        ✦
      </div>
      <div className="hidden lg:block absolute top-[35%] right-[14%] text-[#EFA6C8]/50 text-xs select-none">
        ✧
      </div>
      <div className="hidden lg:block absolute bottom-[25%] left-[8%] text-[#BD5082]/35 text-xs select-none">
        ✦
      </div>
    </div>
  );
};
