"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Compass, Award, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gamesRegistry } from "@/lib/games/registry";

export default function GamesHubPage() {
  const router = useRouter();
  const [filterTrack, setFilterTrack] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [progressMap, setProgressMap] = useState({});

  // Fetch progress for each game from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const progress = {};
      gamesRegistry.forEach(game => {
        const key = `game_progress_${game.slug}`;
        const data = localStorage.getItem(key);
        if (data) {
          try {
            progress[game.slug] = JSON.parse(data);
          } catch (e) {
            console.error("Failed to parse progress for", game.slug, e);
          }
        }
      });
      setProgressMap(progress);
    }
  }, []);

  // Extract unique tracks
  const tracks = ["All", ...new Set(gamesRegistry.map(g => g.track))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  // Filter games registry
  const filteredGames = gamesRegistry.filter(game => {
    const matchesTrack = filterTrack === "All" || game.track === filterTrack;
    const matchesDiff = filterDifficulty === "All" || game.difficulty === filterDifficulty;
    return matchesTrack && matchesDiff;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-[#7CFFB2] bg-[#7CFFB2]/10 border-[#7CFFB2]/20";
      case "Intermediate":
        return "text-[#FFB86B] bg-[#FFB86B]/10 border-[#FFB86B]/20";
      case "Advanced":
        return "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20";
      default:
        return "text-[#6B7080] bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative animate-fade-in px-0 sm:px-6 pb-12">
      {/* Top Arcade Navigation Bar */}
      <section className="flex flex-col gap-2 border-b pb-6 shrink-0 mb-8" style={{ borderColor: "var(--border-primary)" }}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--border-primary)] mb-3 w-fit"
            style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)" }}>
            <Gamepad2 size={12} className="text-violet-500" />
            Arcade
          </div>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center space-x-2 px-4 py-2 border border-[var(--border-primary)] rounded-xl font-semibold text-sm transition-colors shadow-sm cursor-pointer hover:bg-[var(--bg-secondary)]"
            style={{ 
              backgroundColor: "var(--bg-primary)", 
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)"
            }}
          >
            <ArrowLeft size={14} className="mr-0.5" />
            <span>Exit Arcade</span>
          </button>
        </div>
        
        <h1 className="text-4xl font-serif tracking-tight" style={{ color: "var(--text-primary)" }}>Synapse Arcade</h1>
        <p className="text-sm max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Level up your engineering skills through interactive, edge-to-edge game arenas. Solve layout puzzles, repair code bases, and hack endpoints in real-time.
        </p>
      </section>

      <div className="space-y-8 relative z-10">
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border-primary)] shadow-sm" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}>
          {/* Track Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider mr-2" style={{ color: "var(--text-muted)" }}>
              Track:
            </span>
            {tracks.map(track => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-[var(--border-primary)] ${
                  filterTrack === track
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider mr-2" style={{ color: "var(--text-muted)" }}>
              Difficulty:
            </span>
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-[var(--border-primary)] ${
                  filterDifficulty === diff
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, idx) => {
              const isLive = game.status === "live";
              const prog = progressMap[game.slug];
              const completedCount = prog?.completedLevels?.length || 0;
              const isFullyCompleted = game.totalLevels
                ? completedCount === game.totalLevels
                : (game.slug === "flex-dojo" && completedCount === 8) ||
                  (game.slug === "debug-the-bug" && completedCount === 5);
              
              return (
                <motion.div
                  key={game.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-[var(--border-primary)] p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-md bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  {/* Top Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                        {game.track}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[var(--border-primary)] ${
                        game.difficulty === "Beginner" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                        game.difficulty === "Intermediate" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                        "border-rose-500/30 bg-rose-500/10 text-rose-500"
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold tracking-tight flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                        {game.title}
                        {isFullyCompleted && (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        )}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {game.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Launch Action */}
                  <div className="flex items-center justify-between border-t pt-4 mt-auto" style={{ borderColor: "var(--border-primary)" }}>
                    <div className="flex items-center space-x-4 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{game.estimatedMinutes} Mins</span>
                      </span>
                      {isLive && (
                        <span className="flex items-center gap-1 font-bold text-emerald-500">
                          <Award size={12} />
                          <span>
                            {game.totalLevels
                              ? `${completedCount}/${game.totalLevels} Levels`
                              : game.slug === "flex-dojo"
                              ? `${completedCount}/8 Levels`
                              : game.slug === "debug-the-bug"
                              ? `${completedCount}/5 Levels`
                              : `${completedCount} Completed`}
                          </span>
                        </span>
                      )}
                    </div>

                    {isLive ? (
                      <button
                        onClick={() => router.push(`/student/games/${game.slug}`)}
                        className="px-4 py-2 rounded-xl font-semibold text-xs text-[var(--text-on-accent)] transition-transform hover:-translate-y-0.5 shadow-md cursor-pointer flex items-center gap-1.5"
                        style={{ background: "var(--accent-primary)" }}
                      >
                        <span>Start</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg font-bold text-xs border border-[var(--border-primary)] cursor-not-allowed select-none"
                        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
                        Locked
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
