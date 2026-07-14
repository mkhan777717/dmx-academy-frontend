"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Compass, Award, Clock, ArrowRight, ArrowLeft, CheckCircle2, Info, X, Zap, Target, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gamesRegistry } from "@/lib/games/registry";

const gameInstructions = {
  "quiz-blitz": {
    objective: "Test your coding knowledge under pressure in a fast-paced timed trivia challenge.",
    steps: [
      "Select a subject track (e.g., JavaScript, Python, CSS) to begin.",
      "Read each multiple-choice question and click the correct answer.",
      "A ticking timer countdown runs for each question. Speed is rewarded!",
      "Answering correctly builds your Streak Multiplier, compounding your score.",
      "The game ends when all levels/questions are answered or time runs out."
    ],
    proTip: "Maintain your streak! Getting answers wrong resets your score multiplier."
  },
  "code-match": {
    objective: "Improve your technical vocabulary by matching programming terms with their definitions.",
    steps: [
      "A grid of facedown neon cards will be displayed.",
      "Click a card to flip it and reveal either a programming term or a definition.",
      "Click another card to find its matching partner.",
      "If they match, they remain flipped open. If not, they turn facedown again.",
      "Match all pairs in the grid in the fewest turns possible to win."
    ],
    proTip: "Focus on memorizing card locations. A low move count earns higher ranking stars."
  },
  "flex-dojo": {
    objective: "Master CSS Flexbox layout values interactively by aligning items in visual puzzle grids.",
    steps: [
      "You will see visual elements and dashed 'ghost targets' representing where they should go.",
      "Write or select Flexbox CSS rules (like justify-content, align-items, flex-direction) in the console.",
      "Your elements will move in real-time as you write CSS code.",
      "Match all items to their correct target positions to pass each level."
    ],
    proTip: "Remember that changing flex-direction (e.g., from row to column) swaps the main axis and cross axis behaviors."
  },
  "debug-the-bug": {
    objective: "Act as a code reviewer to find and fix syntactic, logical, or runtime errors in code modules.",
    steps: [
      "An editor workspace displays a short function containing one or more bugs.",
      "Analyze the code structure, read the instructions, and identify what is broken.",
      "Edit the code directly in the code window to correct the bugs.",
      "Run the compiler tests. Once all test cases pass green, you can advance to the next level."
    ],
    proTip: "Look closely at console error logs and test outputs to pinpoint exactly where the code is returning incorrect values."
  },
  "type-racer": {
    objective: "Level up your muscle memory and typing speed for real-world syntax.",
    steps: [
      "A snippet of Python or JavaScript code will be shown on the screen.",
      "Begin typing the code exactly as written, including indentation, parentheses, and brackets.",
      "The system monitors your typing real-time. Typos will lock typing progress until you backspace and correct them.",
      "Complete the snippet to see your final Words Per Minute (WPM) speed and accuracy percentage."
    ],
    proTip: "Keep your eyes on the next characters instead of your keyboard, and focus on accuracy first — speed will follow."
  },
  "code-fill-in": {
    objective: "Test your quick reading comprehension of syntax patterns by filling in the missing code blanks.",
    steps: [
      "A code snippet is loaded with a missing blank placeholder marked as '___'.",
      "Look at the choices displayed below the code block.",
      "Click the correct option (e.g. `let`, `map`, `return`, `===`) to complete the code correctly.",
      "Answer quickly to earn speed score bonuses before the timer runs out."
    ],
    proTip: "Quickly scan variables, function calls, and control structures to infer what data type or keyword is expected in the missing slot."
  },
  "sql-dojo": {
    objective: "Learn relational database query writing against interactive tables.",
    steps: [
      "A database schema, visual tables, and a query prompt are provided.",
      "Write actual SQL queries (such as SELECT, WHERE, GROUP BY, JOIN) in the query editor.",
      "Execute the query. The system runs it against an in-memory SQL database and shows the resulting table.",
      "Compare your output table with the expected target table. If they match, the level is unlocked."
    ],
    proTip: "Start with simple SELECT statements, check your columns, and then incrementally add conditions or aggregations to debug step-by-step."
  }
};

export default function GamesHubPage() {
  const router = useRouter();
  const [filterTrack, setFilterTrack] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [progressMap, setProgressMap] = useState({});
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);

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
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-[#190C2F] via-[#0E061E] to-[#04010A] overflow-y-auto p-4 md:p-12 text-[#E8E6E1] select-none">
      {/* Immersive Space Ambient Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[35%] h-[35%] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none" />

      {/* Top Arcade Navigation Bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 relative z-10 border-b border-purple-500/10 pb-4">
        <button
          onClick={() => router.push("/student/dashboard")}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-950/25 text-[#D8B4FE] hover:text-white hover:border-purple-500/40 hover:bg-purple-950/40 hover:scale-102 transition-all cursor-pointer text-xs font-bold font-mono shadow-sm"
        >
          <ArrowLeft size={14} className="mr-0.5" />
          <span>Exit Arcade Lobby</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-[#7CFFB2] animate-pulse" />
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#7CFFB2]">
            System Online
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <Gamepad2 size={24} className="text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white uppercase">
              Synapse Arcade
            </h1>
          </div>
          <p className="text-sm text-purple-300/60 max-w-xl leading-relaxed">
            Level up your engineering skills through interactive, edge-to-edge game arenas. Solve layout puzzles, repair code bases, and hack endpoints in real-time.
          </p>
        </div>

        {/* Filters Toolbar - Glassmorphic Purple */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#22123C]/30 backdrop-blur-md p-4 rounded-2xl border border-purple-500/15">
          {/* Track Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 mr-2">
              Track:
            </span>
            {tracks.map(track => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTrack === track
                    ? "bg-purple-600 text-white border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                    : "bg-[#251347]/20 border border-purple-900/30 text-purple-300/80 hover:text-white"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 mr-2">
              Difficulty:
            </span>
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterDifficulty === diff
                    ? "bg-purple-600 text-white border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                    : "bg-[#251347]/20 border border-purple-900/30 text-purple-300/80 hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid - Purple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="bg-[#24133F]/35 hover:bg-[#2C184E]/45 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/35 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
                >
                  {/* Top Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300/70">
                        {game.track}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        game.difficulty === "Beginner" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                        game.difficulty === "Intermediate" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                        "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
                        <span>{game.title}</span>
                        {isLive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGameInfo(game);
                            }}
                            className="p-1 rounded-lg text-purple-400 hover:text-purple-200 hover:bg-purple-500/10 transition-colors cursor-pointer flex items-center justify-center"
                            title="How to play"
                          >
                            <Info size={15} />
                          </button>
                        )}
                        {isFullyCompleted && (
                          <CheckCircle2 size={16} className="text-[#7CFFB2] fill-[#7CFFB2]/10 ml-auto" />
                        )}
                      </h3>
                      <p className="text-xs text-purple-200/50 leading-relaxed font-sans">
                        {game.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Launch Action */}
                  <div className="flex items-center justify-between border-t border-purple-500/10 pt-4 mt-auto">
                    <div className="flex items-center space-x-4 text-[10px] font-mono text-purple-300/60">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{game.estimatedMinutes} Mins</span>
                      </span>
                      {isLive && (
                        <span className="flex items-center gap-1 font-bold text-[#7CFFB2]">
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
                        className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 border border-purple-400 hover:scale-102 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Start Arena</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <span className="px-4 py-2.5 rounded-xl font-bold text-xs border border-purple-900/30 bg-[#251347]/20 text-purple-400/50 cursor-not-allowed select-none">
                        Locked Node
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Modal overlay */}
      <AnimatePresence>
        {selectedGameInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGameInfo(null)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-[#1D0E36] p-6 text-[#E8E6E1] shadow-[0_0_50px_rgba(168,85,247,0.25)] z-10"
            >
              {/* Decorative side line */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedGameInfo(null)}
                className="absolute right-4 top-4 p-1.5 rounded-xl border border-purple-500/20 bg-purple-950/25 text-[#D8B4FE] hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-6 pl-2">
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
                      {selectedGameInfo.track}
                    </span>
                    <span className="text-[10px] font-mono">•</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                      selectedGameInfo.difficulty === "Beginner" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                      selectedGameInfo.difficulty === "Intermediate" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                      "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    }`}>
                      {selectedGameInfo.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-white tracking-tight uppercase flex items-center gap-2">
                    <Gamepad2 size={22} className="text-purple-400 animate-pulse" />
                    {selectedGameInfo.title}
                  </h3>
                </div>

                {/* Objective */}
                <div className="space-y-2 bg-purple-950/20 border border-purple-500/10 rounded-2xl p-4">
                  <h4 className="text-xs font-mono font-extrabold uppercase text-purple-300 flex items-center gap-1.5">
                    <Target size={14} className="text-purple-400" />
                    Objective
                  </h4>
                  <p className="text-xs text-purple-100/70 leading-relaxed font-sans">
                    {gameInstructions[selectedGameInfo.slug]?.objective || selectedGameInfo.description}
                  </p>
                </div>

                {/* How to Play */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-extrabold uppercase text-purple-300 flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-purple-400" />
                    How to Play
                  </h4>
                  <ul className="space-y-2.5">
                    {(gameInstructions[selectedGameInfo.slug]?.steps || [
                      "Start the game arena.",
                      "Read instructions and solve challenges.",
                      "Submit solutions to unlock next levels."
                    ]).map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs font-sans text-purple-200/80">
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro Tip */}
                {gameInstructions[selectedGameInfo.slug]?.proTip && (
                  <div className="space-y-1.5 bg-[#7CFFB2]/5 border border-[#7CFFB2]/10 rounded-2xl p-4">
                    <h4 className="text-[10px] font-mono font-extrabold uppercase text-[#7CFFB2] flex items-center gap-1.5">
                      <Zap size={12} className="fill-[#7CFFB2]/10" />
                      Pro Tip
                    </h4>
                    <p className="text-xs text-emerald-100/70 leading-relaxed font-sans">
                      {gameInstructions[selectedGameInfo.slug].proTip}
                    </p>
                  </div>
                )}

                {/* Got it button */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedGameInfo(null)}
                    className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 border border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Got it, Let's Play!</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
