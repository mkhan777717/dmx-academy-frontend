"use client";

import React from "react";
import { ShieldCheck, Clock } from "lucide-react";

export default function ProctoringBanner({ timeRemaining = "00:30:00", secondsLeft, isProctored = true }) {
  if (!isProctored) return null;

  const formatSeconds = (totalSec) => {
    if (typeof totalSec !== "number") return timeRemaining;
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const displayTime = secondsLeft !== undefined ? formatSeconds(secondsLeft) : timeRemaining;

  return (
    <div className="w-full bg-[#0a1a14]/80 border border-emerald-500/30 rounded-xl p-3 px-4 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.07)] backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
          <ShieldCheck size={20} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              Proctoring Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight">
            Your session is being monitored for academic integrity.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-300 font-mono text-xs font-bold shrink-0">
        <Clock size={13} className="text-emerald-400 animate-pulse" />
        <span>{displayTime}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans ml-1 font-semibold">Time Left</span>
      </div>
    </div>
  );
}
