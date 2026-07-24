"use client";

import React from "react";
import { Camera, Mic, Monitor, ShieldAlert, AlertTriangle } from "lucide-react";

export default function AntiCheatGrid({
  cameraActive = true,
  micActive = true,
  screenActive = true,
  tabSwitches = 0
}) {
  const cards = [
    {
      id: "camera",
      label: "Camera",
      status: cameraActive ? "Active" : "Inactive",
      active: cameraActive,
      icon: <Camera size={18} />
    },
    {
      id: "mic",
      label: "Microphone",
      status: micActive ? "Active" : "Inactive",
      active: micActive,
      icon: <Mic size={18} />
    },
    {
      id: "screen",
      label: "Screen",
      status: screenActive ? "Active" : "Inactive",
      active: screenActive,
      icon: <Monitor size={18} />
    },
    {
      id: "tab",
      label: "Tab Switch",
      status: tabSwitches.toString(),
      active: tabSwitches === 0,
      icon: <ShieldAlert size={18} />
    }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cards.map(c => (
          <div
            key={c.id}
            className="bg-[#0e1017]/90 border border-slate-800/80 hover:border-emerald-500/30 rounded-xl p-3 flex items-center space-x-3 transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              {c.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-300 truncate leading-none mb-1">
                {c.label}
              </p>
              <span className={`text-[10px] font-semibold tracking-wide ${c.active ? "text-emerald-400" : "text-amber-400"}`}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Red Warning Disclaimer */}
      <div className="flex items-center space-x-2 text-[11px] font-medium text-rose-500/90 pt-1">
        <AlertTriangle size={14} className="shrink-0 text-rose-500" />
        <span>
          Do not leave the browser or switch tabs. Violations may result in disqualification.
        </span>
      </div>
    </div>
  );
}
