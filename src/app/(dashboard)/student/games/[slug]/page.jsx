"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gamesRegistry } from "@/lib/games/registry";

export default function GamePageWrapper() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [savedProgress, setSavedProgress] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Find game definition from registry
  const game = gamesRegistry.find(g => g.slug === slug);

  // Load progress on mount
  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      const stored = localStorage.getItem(`game_progress_${slug}`);
      if (stored) {
        try {
          setSavedProgress(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse progress details:", e);
        }
      }
    }
  }, [slug]);

  // Callback to persist progress updates
  const handleProgressChange = (newProgress) => {
    if (typeof window !== "undefined" && slug) {
      localStorage.setItem(`game_progress_${slug}`, JSON.stringify(newProgress));
      setSavedProgress(newProgress);
    }
  };

  const handleExitRequest = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    router.push("/student/games");
  };

  if (!game) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center text-[#E8E6E1] bg-[#12141C] p-6 rounded-3xl border border-[var(--border-primary)] border-[#2A2D3D]">
        <AlertCircle size={40} className="text-[#FF6B6B]" />
        <h2 className="text-lg font-bold text-white">Game Quad Not Found</h2>
        <p className="text-xs text-[#6B7080]">The interactive challenge you are looking for does not exist in our grid.</p>
        <button
          onClick={() => router.push("/student/games")}
          className="px-4 py-2 text-xs font-bold text-[#12141C] bg-[#7CFFB2] rounded-xl cursor-pointer"
        >
          Back to Games Hub
        </button>
      </div>
    );
  }

  if (game.status !== "live") {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center text-[#E8E6E1] bg-[#12141C] p-6 rounded-3xl border border-[var(--border-primary)] border-[#2A2D3D]">
        <AlertCircle size={40} className="text-[#FFB86B]" />
        <h2 className="text-lg font-bold text-white">{game.title} is Offline</h2>
        <p className="text-xs text-[#6B7080]">This level quadrant is currently locked by the Dojo Masters. Check back soon!</p>
        <button
          onClick={() => router.push("/student/games")}
          className="px-4 py-2 text-xs font-bold text-[#12141C] bg-[#7CFFB2] rounded-xl cursor-pointer"
        >
          Back to Games Hub
        </button>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-[#190C2F] via-[#0E061E] to-[#04010A] overflow-y-auto p-4 md:p-8 text-[#E8E6E1] select-none">
      {/* Immersive Space Ambient Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-slate-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[var(--accent-primary)]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Back to Hub Nav */}
        <button
          onClick={handleExitRequest}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[var(--border-primary)] border-slate-500/20 bg-slate-950/25 text-[#D8B4FE] hover:text-white hover:border-slate-500/40 hover:bg-slate-950/40 hover:scale-102 transition-all cursor-pointer text-xs font-bold font-mono shadow-sm w-fit"
        >
          <ArrowLeft size={14} className="mr-0.5" />
          <span>Exit to Arcade Lobby</span>
        </button>

        {/* Render selected live game component */}
        <GameComponent 
          onProgressChange={handleProgressChange} 
          savedProgress={savedProgress}
          onBack={handleExitRequest}
        />
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="w-full max-w-sm rounded-2xl p-6 border shadow-2xl text-center space-y-5"
              style={{ backgroundColor: "#1A1025", borderColor: "rgba(139,92,246,0.25)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
                <AlertTriangle size={22} className="text-amber-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-white">Exit Game?</h3>
                <p className="text-xs leading-relaxed text-[#A0A8C0]">
                  Your current game progress will be lost. Are you sure you want to leave?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-[#A0A8C0] hover:text-white"
                  style={{ borderColor: "rgba(139,92,246,0.25)", backgroundColor: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(139,92,246,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Keep Playing
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}
                >
                  Exit Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
