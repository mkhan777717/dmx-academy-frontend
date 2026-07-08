"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import LiveBanner from "@/components/LiveBanner";

export default function LiveClassesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <div className="pt-28 pb-16">
        <LiveBanner />
      </div>
    </div>
  );
}
