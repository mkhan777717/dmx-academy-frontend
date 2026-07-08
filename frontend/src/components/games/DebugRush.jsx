"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ArrowRight, Heart, Trophy, RotateCcw, Play, Clock, Zap, Star, AlertTriangle, Volume2, VolumeX, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import arcadeData from "@/data/learning-arcade-content.json";

// Web Audio API Retro Sound System
const playSynthSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === "correct") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "wrong") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "click") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(325, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "gameover") {
      // Mournful descending sequence
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(207.65, now + 0.15); // G#3
      osc.frequency.setValueAtTime(196.00, now + 0.3); // G3
      osc.frequency.setValueAtTime(164.81, now + 0.45); // E3
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } else if (type === "complete") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
};

export default function DebugRush({ onProgressChange, savedProgress, onBack }) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [sIdx, setSIdx] = useState(0);
  const [phase, setPhase] = useState("lobby"); // lobby, playing, snippet_reveal, finished, game_over
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Gameplay state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(35); // 35 seconds per debug snippet
  const [wrongLines, setWrongLines] = useState([]); // indices of wrong lines clicked
  const [isResolved, setIsResolved] = useState(false);

  const timerRef = useRef(null);
  const tracks = ["JavaScript", "React.js", "Node.js", "MongoDB"];

  // localStorage tracking for non-repeating debug items
  const loadDebugSnippets = (track) => {
    const allSnippets = arcadeData.debug || [];
    const pool = allSnippets.filter(s => s.track === track);
    if (pool.length === 0) return [];

    const seenKey = `arcade_seen_debug_${track}`;
    let seenIds = [];
    try {
      const stored = localStorage.getItem(seenKey);
      if (stored) seenIds = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Filter unseen
    let unseen = pool.filter(s => !seenIds.includes(s.id));

    // Reset pool tracker if exhausted or very small
    if (unseen.length < Math.min(5, pool.length)) {
      seenIds = [];
      unseen = [...pool];
    }

    // Shuffle and slice 5 snippets
    const shuffled = [...unseen].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    // Save newly seen IDs
    const newlySeen = [...seenIds, ...selected.map(s => s.id)];
    try {
      localStorage.setItem(seenKey, JSON.stringify(newlySeen));
    } catch (e) {
      console.error(e);
    }

    return selected;
  };

  const handleStartGame = (track) => {
    playSynthSound("click", soundEnabled);
    const selectedSnippets = loadDebugSnippets(track);
    if (selectedSnippets.length === 0) {
      alert("No debug snippets found for this track. Please check the JSON data file.");
      return;
    }

    setSelectedTrack(track);
    setSnippets(selectedSnippets);
    setSIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setWrongLines([]);
    setIsResolved(false);
    setTimeLeft(40); // 40 seconds for the first snippet
    setPhase("playing");
  };

  // Timer Effect
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sIdx]);

  const handleTimeOut = () => {
    playSynthSound("wrong", soundEnabled);
    setLives((l) => {
      const nextLives = l - 1;
      if (nextLives <= 0) {
        clearInterval(timerRef.current);
        playSynthSound("gameover", soundEnabled);
        setPhase("game_over");
      } else {
        setStreak(0);
        setIsResolved(true);
        setPhase("snippet_reveal");
      }
      return nextLives;
    });
  };

  const handleLineClick = (lineNum) => {
    if (phase !== "playing" || isResolved || wrongLines.includes(lineNum)) return;

    const currentSnippet = snippets[sIdx];
    const isBuggy = lineNum === currentSnippet.buggy_line_number;

    if (isBuggy) {
      playSynthSound("correct", soundEnabled);
      clearInterval(timerRef.current);
      setIsResolved(true);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Score calculation: 200 base + remaining time * 6 + streak multiplier
      const timeBonus = Math.round(timeLeft * 6);
      const streakBonus = Math.min((newStreak - 1) * 30, 150);
      const gained = 200 + timeBonus + streakBonus;
      setScore((s) => s + gained);

      setPhase("snippet_reveal");
    } else {
      playSynthSound("wrong", soundEnabled);
      setWrongLines((w) => [...w, lineNum]);
      setStreak(0);

      setLives((l) => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          clearInterval(timerRef.current);
          playSynthSound("gameover", soundEnabled);
          setPhase("game_over");
        }
        return nextLives;
      });
    }
  };

  const handleNextSnippet = () => {
    playSynthSound("click", soundEnabled);
    if (sIdx + 1 >= snippets.length) {
      playSynthSound("complete", soundEnabled);
      
      // Persist progress to local storage
      const existingLevels = savedProgress?.completedLevels || [];
      const updatedLevels = [...new Set([...existingLevels, `debug_${selectedTrack.toLowerCase()}`])];
      onProgressChange({
        completedLevels: updatedLevels,
        highScore: Math.max(savedProgress?.highScore || 0, score),
        completedAll: true
      });

      setPhase("finished");
    } else {
      setSIdx((idx) => idx + 1);
      setWrongLines([]);
      setIsResolved(false);
      setTimeLeft(40);
      setPhase("playing");
    }
  };

  const currentSnippet = snippets[sIdx];
  const codeLines = currentSnippet ? currentSnippet.code.split("\n") : [];

  return (
    <div className="relative min-h-[70vh] w-full bg-[#0a0714] border border-purple-500/20 rounded-3xl overflow-hidden font-mono text-[#E8E6E1]">
      {/* Retro Arcade Scanline overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,36,0)_97%,rgba(18,10,36,0.3)_98%)] bg-[size:100%_4px] opacity-35 z-20" />

      {/* sound toggle */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl border border-purple-500/20 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* LOBBY PHASE */}
        {phase === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-[70vh] space-y-8"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-[#7CFFB2] border border-[#7CFFB2]/20 bg-[#7CFFB2]/5 px-3 py-1 rounded-full uppercase">
                Mode: Debug Rush
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 uppercase tracking-tight">
                Bug Hunter Terminal
              </h2>
              <p className="text-xs text-purple-300/50 max-w-md mx-auto">
                Scan multi-line code files inside an interactive console and click on the single line containing a bug. Keep your lives intact and beat the clock!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {tracks.map((track) => (
                <button
                  key={track}
                  onClick={() => handleStartGame(track)}
                  className="relative p-5 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#1a0e30]/40 to-[#0e071e]/70 text-left hover:scale-[1.03] transition-all cursor-pointer hover:border-purple-400 group overflow-hidden shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
                  <span className="text-xs font-bold text-purple-400/60 uppercase">Track</span>
                  <h4 className="text-lg font-black text-white group-hover:text-[#7CFFB2] transition-colors">{track}</h4>
                  <div className="flex items-center gap-1 mt-3 text-[10px] text-purple-300/40">
                    <span>5 Snippets</span>
                    <span>•</span>
                    <span>3 Lives (Hearts)</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-white transition-colors cursor-pointer mt-4"
            >
              <ArrowLeft size={14} /> Back to Hub Lobby
            </button>
          </motion.div>
        )}

        {/* PLAYING OR REVEAL PHASE */}
        {(phase === "playing" || phase === "snippet_reveal") && currentSnippet && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 md:p-8 flex flex-col justify-between min-h-[70vh] relative z-10"
          >
            {/* Header / HUD */}
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                  {selectedTrack}
                </span>
                <span className="text-[10px] font-bold text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-500/5 uppercase flex items-center gap-1">
                  <Terminal size={11} /> File {sIdx + 1}/5
                </span>
              </div>

              {/* Lives */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((heartNum) => (
                  <Heart
                    key={heartNum}
                    size={16}
                    className={`transition-all ${
                      heartNum <= lives
                        ? "text-rose-500 fill-rose-500 filter drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]"
                        : "text-purple-950/40"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Zap size={14} className="fill-amber-400/10" />
                  <span>{score} pts</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-400 font-bold text-xs">
                    <Star size={12} className="fill-orange-400" />
                    <span>{streak}x streak</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                animate={{ width: `${(timeLeft / 40) * 100}%` }}
                transition={{ duration: phase === "playing" ? 1 : 0.2, ease: "linear" }}
              />
            </div>

            {/* Title / Instruction */}
            <div className="mb-4 bg-purple-950/10 border border-purple-500/10 p-3.5 rounded-xl">
              <h4 className="text-xs font-bold text-purple-300 uppercase">Target Scenario</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">{currentSnippet.title}</p>
            </div>

            {/* Code editor terminal */}
            <div className="relative rounded-2xl border border-purple-500/25 bg-[#0a0515] p-5 font-mono text-xs shadow-2xl overflow-x-auto flex-grow flex flex-col justify-start">
              <div className="absolute top-2 right-4 text-[9px] uppercase tracking-widest text-purple-500/40 font-bold">
                read_only_editor.tmp
              </div>

              <div className="space-y-1.5 mt-2 select-text w-full">
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isCorrectLine = lineNum === currentSnippet.buggy_line_number;
                  const isWrongClicked = wrongLines.includes(lineNum);
                  const isFlippedMode = phase === "snippet_reveal";

                  let lineStyle = "hover:bg-purple-500/5 hover:text-white";
                  let numStyle = "text-purple-500/30";

                  if (isFlippedMode && isCorrectLine) {
                    lineStyle = "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300";
                    numStyle = "text-emerald-400/50 font-bold";
                  } else if (isWrongClicked) {
                    lineStyle = "bg-rose-950/20 border border-rose-500/30 text-rose-300 line-through decoration-rose-500/40";
                    numStyle = "text-rose-400/50 font-bold";
                  } else if (isFlippedMode) {
                    lineStyle = "opacity-35 cursor-not-allowed";
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleLineClick(lineNum)}
                      className={`flex items-start rounded px-2 py-0.5 transition-all duration-100 ${
                        phase === "playing" ? "cursor-pointer" : ""
                      } ${lineStyle}`}
                    >
                      <span className={`w-8 shrink-0 text-right pr-3 select-none border-r border-purple-500/10 mr-3 text-[10px] ${numStyle}`}>
                        {lineNum}
                      </span>
                      <pre className="whitespace-pre flex-grow font-mono text-left">{line || " "}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom reveal section */}
            <div className="h-16 flex items-center justify-between border-t border-purple-500/10 pt-4 mt-4">
              {phase === "snippet_reveal" ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3">
                  <div className="text-[10px] text-purple-300/60 leading-relaxed font-sans max-w-2xl line-clamp-2">
                    <span className="font-bold text-[#7CFFB2] flex items-center gap-1">
                      <AlertTriangle size={11} className="inline text-[#7CFFB2]" /> BUG REPORT:
                    </span>{" "}
                    {currentSnippet.explanation}
                  </div>
                  <button
                    onClick={handleNextSnippet}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 self-end shrink-0 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                  >
                    <span>{sIdx + 1 === snippets.length ? "Finish Rush" : "Next File"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] text-purple-300/40 flex items-center gap-1">
                    <Clock size={11} /> Scan clock: {timeLeft}s
                  </span>
                  <span className="text-[10px] text-purple-500/60 font-bold uppercase blink animate-pulse">
                    Click the buggy line of code
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* GAME OVER PHASE */}
        {phase === "game_over" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center h-[70vh] space-y-6"
          >
            <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle size={36} className="text-rose-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                Mission Failed
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                SYSTEM CRITICAL: GAME OVER
              </h2>
              <p className="text-xs text-purple-300/40 font-mono mt-1 uppercase">
                Lives exhausted on {selectedTrack}
              </p>
            </div>

            {/* Score */}
            <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl px-8 py-4">
              <div className="text-3xl font-black text-cyan-300">{score}</div>
              <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Final Score</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => handleStartGame(selectedTrack)}
                className="px-5 py-2.5 rounded-xl border border-purple-500/25 bg-[#1b0d35]/30 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw size={13} /> Retry Arena
              </button>
              <button
                onClick={() => setPhase("lobby")}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                <Play size={13} /> Try Another
              </button>
            </div>

            <button
              onClick={onBack}
              className="text-xs font-bold text-purple-500 hover:text-white transition-colors cursor-pointer mt-2"
            >
              Exit to Arcade Lobby
            </button>
          </motion.div>
        )}

        {/* FINISHED PHASE (WIN) */}
        {phase === "finished" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center h-[70vh] space-y-6"
          >
            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Trophy size={36} className="text-amber-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                Arena Cleared
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                DEBUG RUSH COMPLETE
              </h2>
              <p className="text-xs text-purple-300/40 font-mono mt-1 uppercase">
                Track: {selectedTrack}
              </p>
            </div>

            {/* Performance metrics */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-cyan-300">{score}</div>
                <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Score</div>
              </div>
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-[#7CFFB2]">{lives}/3</div>
                <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Hearts Saved</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => handleStartGame(selectedTrack)}
                className="px-5 py-2.5 rounded-xl border border-purple-500/25 bg-[#1b0d35]/30 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw size={13} /> Replay Track
              </button>
              <button
                onClick={() => setPhase("lobby")}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                <Play size={13} /> Play Other Track
              </button>
            </div>

            <button
              onClick={onBack}
              className="text-xs font-bold text-purple-500 hover:text-white transition-colors cursor-pointer mt-2"
            >
              Exit to Arcade Lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
