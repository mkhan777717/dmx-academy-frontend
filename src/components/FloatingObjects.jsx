"use client";

import React from "react";

export default function FloatingObjects() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.25, filter: "blur(2px)" }}
    >
      <div className="absolute top-[20%] left-[20%] text-6xl text-white/20 font-mono" style={{ animation: "animFloatMd 8s ease-in-out infinite" }}>
        &#123; &#125;
      </div>
      <div className="absolute top-[30%] right-[20%] w-16 h-16 rounded-full border-4 border-white/20" style={{ animation: "animFloatSm 10s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] left-[30%] text-6xl text-white/20 font-mono" style={{ animation: "animFloatMd 9s ease-in-out infinite" }}>
        &lt; &gt;
      </div>
      <div className="absolute bottom-[30%] right-[30%] w-16 h-16 border-4 border-white/20" style={{ animation: "spin 12s linear infinite" }} />
      <div className="absolute top-[40%] right-[40%] text-6xl text-white/20 font-mono" style={{ animation: "animFloatSm 11s ease-in-out infinite" }}>
        &lt;/&gt;
      </div>
    </div>
  );
}
