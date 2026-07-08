"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Trophy, RotateCcw, Play, Clock, Zap, Star, AlertCircle, Volume2, VolumeX, Grid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import arcadeData from "@/data/learning-arcade-content.json";

// Web Audio API Retro Chimes
const playSynthSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === "match") {
      // Ascending two notes
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "mismatch") {
      // Descending buzz
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "flip") {
      // Quick woody click
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "click") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "complete") {
      // Fans out a major arpeggio
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
};

export default function CodeMatch({ onProgressChange, savedProgress, onBack }) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [phase, setPhase] = useState("lobby"); // lobby, playing, checking, finished
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moves, setMoves] = useState(0);

  const timerRef = useRef(null);
  const tracks = ["JavaScript", "React.js", "Node.js", "MongoDB"];

  // localStorage tracking for non-repeating matches
  const loadMatchPairs = (track) => {
    const allPairs = arcadeData.match || [];
    const pool = allPairs.filter(p => p.track === track);
    if (pool.length === 0) return [];

    const seenKey = `arcade_seen_match_${track}`;
    let seenIds = [];
    try {
      const stored = localStorage.getItem(seenKey);
      if (stored) seenIds = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Filter unseen
    let unseen = pool.filter(p => !seenIds.includes(p.id));

    // Reset pool tracker if exhausted or very small
    if (unseen.length < Math.min(6, pool.length)) {
      seenIds = [];
      unseen = [...pool];
    }

    // Shuffle and slice 6 pairs
    const shuffled = [...unseen].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    // Save newly seen IDs
    const newlySeen = [...seenIds, ...selected.map(p => p.id)];
    try {
      localStorage.setItem(seenKey, JSON.stringify(newlySeen));
    } catch (e) {
      console.error(e);
    }

    return selected;
  };

  const handleStartGame = (track) => {
    playSynthSound("click", soundEnabled);
    const selectedPairs = loadMatchPairs(track);
    if (selectedPairs.length < 6) {
      alert("At least 6 term/definition pairs are required for this track. Please check the content json.");
      return;
    }

    // Generate 12 cards
    const cardList = [];
    selectedPairs.forEach((pair) => {
      cardList.push({
        id: `term_${pair.id}`,
        pairId: pair.id,
        type: "term",
        content: pair.term,
        isFlipped: false,
        isMatched: false
      });
      cardList.push({
        id: `def_${pair.id}`,
        pairId: pair.id,
        type: "definition",
        content: pair.definition,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffledCards = cardList.sort(() => 0.5 - Math.random());

    setSelectedTrack(track);
    setCards(shuffledCards);
    setSelectedIndices([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setElapsedTime(0);
    setMoves(0);
    setPhase("playing");
  };

  // Timer Effect
  useEffect(() => {
    if (phase !== "playing" && phase !== "checking") return;

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleCardClick = (idx) => {
    // Prevent clicking during checking phase, or clicking already flipped/matched cards
    if (phase !== "playing" || cards[idx].isFlipped || cards[idx].isMatched || selectedIndices.includes(idx)) return;

    playSynthSound("flip", soundEnabled);

    // Flip card
    const updatedCards = [...cards];
    updatedCards[idx].isFlipped = true;
    setCards(updatedCards);

    const nextSelected = [...selectedIndices, idx];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setPhase("checking");
      setMoves((m) => m + 1);
      setTimeout(() => {
        checkMatch(nextSelected);
      }, 700);
    }
  };

  const checkMatch = (indices) => {
    const [firstIdx, secondIdx] = indices;
    const card1 = cards[firstIdx];
    const card2 = cards[secondIdx];
    const isCorrect = card1.pairId === card2.pairId && card1.type !== card2.type;

    const updatedCards = [...cards];

    if (isCorrect) {
      playSynthSound("match", soundEnabled);
      updatedCards[firstIdx].isMatched = true;
      updatedCards[secondIdx].isMatched = true;

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Scoring: 150 points for correct match + streak bonus. Fewer moves and faster times net higher score at complete.
      const gained = 150 + (newStreak - 1) * 30;
      setScore((s) => s + gained);

      // Check if all are matched
      const allMatched = updatedCards.every((c) => c.isMatched);
      if (allMatched) {
        clearInterval(timerRef.current);
        playSynthSound("complete", soundEnabled);
        
        // Speed bonus: max +500 points scaling down over time
        const speedBonus = Math.max(0, 500 - elapsedTime * 5);
        // Moves bonus: max +300 points scaling down if they took many moves
        const movesBonus = Math.max(0, 300 - (moves - 6) * 20);
        const finalScore = score + gained + Math.round(speedBonus + movesBonus);
        setScore(finalScore);

        // Persist progress to local storage
        const existingLevels = savedProgress?.completedLevels || [];
        const updatedLevels = [...new Set([...existingLevels, `match_${selectedTrack.toLowerCase()}`])];
        onProgressChange({
          completedLevels: updatedLevels,
          highScore: Math.max(savedProgress?.highScore || 0, finalScore),
          lastTimeSeconds: elapsedTime,
          completedAll: true
        });

        setPhase("finished");
      } else {
        setPhase("playing");
      }
    } else {
      playSynthSound("mismatch", soundEnabled);
      updatedCards[firstIdx].isFlipped = false;
      updatedCards[secondIdx].isFlipped = false;
      setStreak(0);
      setPhase("playing");
    }

    setCards(updatedCards);
    setSelectedIndices([]);
  };

  const getFormatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative min-h-[70vh] w-full bg-[#0a0714] border border-purple-500/20 rounded-3xl overflow-hidden font-mono text-[#E8E6E1]">
      {/* CSS 3D Card Flip Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .arcade-card-container {
          perspective: 1000px;
        }
        .arcade-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.4s;
          transform-style: preserve-3d;
        }
        .arcade-card-flipped .arcade-card-inner {
          transform: rotateY(180deg);
        }
        .arcade-card-front, .arcade-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
        }
        .arcade-card-back {
          transform: rotateY(180deg);
        }
      ` }} />

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
                Mode: Code Match
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 uppercase tracking-tight">
                Concepts Match
              </h2>
              <p className="text-xs text-purple-300/50 max-w-md mx-auto">
                A classic memory-flip term matching game. Click the cards to match 6 code terms with their definitions. Speed and accuracy net highest score.
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
                    <span>12 Cards (6 Pairs)</span>
                    <span>•</span>
                    <span>No Timer Limit</span>
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

        {/* PLAYING OR CHECKING PHASE */}
        {(phase === "playing" || phase === "checking") && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 md:p-8 flex flex-col justify-between min-h-[70vh] relative z-10"
          >
            {/* HUD */}
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                  {selectedTrack}
                </span>
                <span className="text-[10px] font-bold text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-500/5 uppercase flex items-center gap-1">
                  <Clock size={11} /> {getFormatTime(elapsedTime)}
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Zap size={14} className="fill-amber-400/10" />
                  <span>{score} pts</span>
                </div>
                <div className="text-purple-300/60 text-xs">
                  Moves: <span className="text-white font-bold">{moves}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-400 font-bold text-xs">
                    <Star size={12} className="fill-orange-400" />
                    <span>{streak}x Match</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-grow content-center my-auto min-h-[40vh]">
              {cards.map((card, idx) => {
                const isFlipped = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`arcade-card-container h-28 md:h-36 w-full cursor-pointer transition-all duration-150 ${
                      isFlipped ? "arcade-card-flipped" : "hover:scale-[1.02]"
                    }`}
                  >
                    <div className="arcade-card-inner w-full h-full">
                      {/* CARD FRONT (FACE DOWN - arcade design) */}
                      <div className="arcade-card-front flex flex-col items-center justify-center border border-purple-500/20 bg-gradient-to-br from-[#1b0a33] to-[#0a0414] hover:border-purple-500/40 text-purple-500 shadow-lg">
                        <Grid size={24} className="animate-pulse" />
                        <span className="text-[9px] uppercase tracking-wider text-purple-500/40 mt-2">DMX ARCADE</span>
                      </div>

                      {/* CARD BACK (FACE UP - details) */}
                      <div className={`arcade-card-back flex items-center justify-center p-3 text-center border text-[10px] md:text-xs font-bold leading-tight ${
                        card.isMatched
                          ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                          : "border-purple-500 bg-[#160c2b] text-white shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                      }`}>
                        <div className="w-full flex flex-col justify-between h-full">
                          <span className={`text-[8px] uppercase tracking-wide self-start ${card.isMatched ? "text-emerald-400/50" : "text-purple-400/50"}`}>
                            {card.type}
                          </span>
                          <span className="flex-grow flex items-center justify-center text-center leading-normal font-sans py-1">
                            {card.content}
                          </span>
                          {card.isMatched ? (
                            <span className="text-[8px] text-emerald-400 uppercase font-black tracking-widest mt-1">Matched</span>
                          ) : (
                            <span className="h-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom spacer */}
            <div className="border-t border-purple-500/10 pt-4 mt-6 text-center text-[10px] text-purple-300/40 font-sans">
              Match each terminology card on the left or right with its respective definition block.
            </div>
          </motion.div>
        )}

        {/* FINISHED PHASE */}
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
                CODE MATCH COMPLETE
              </h2>
              <p className="text-xs text-purple-300/40 font-mono mt-1 uppercase">
                Track: {selectedTrack}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-cyan-300">{score}</div>
                <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Score</div>
              </div>
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-[#7CFFB2]">{getFormatTime(elapsedTime)}</div>
                <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Time</div>
              </div>
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-orange-400">{moves}</div>
                <div className="text-[9px] uppercase tracking-wider text-purple-300/40 font-bold mt-1">Moves</div>
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
