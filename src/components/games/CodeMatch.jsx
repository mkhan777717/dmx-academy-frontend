"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Trophy, RotateCcw, Play, Clock, Zap, Star,
  Volume2, VolumeX, RefreshCw, CheckCircle2, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getApiBase, buildAuthHeaders } from "@/utils/api";

// ─── Web Audio Synth Sounds ───────────────────────────────────────────────────
const playSynthSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;

    const makeOsc = (oscType, freqs, gainVal, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = oscType;
      freqs.forEach(([freq, time]) => osc.frequency.setValueAtTime(freq, now + time));
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    };

    if (type === "match")    makeOsc("sine",     [[587.33, 0], [880, 0.08]], 0.08, 0.35);
    if (type === "mismatch") makeOsc("triangle", [[330, 0], [220, 0.08]],   0.08, 0.25);
    if (type === "flip")     makeOsc("sine",     [[700, 0], [350, 0.05]],   0.04, 0.05);
    if (type === "click")    makeOsc("sine",     [[500, 0], [250, 0.05]],   0.04, 0.05);
    if (type === "complete") makeOsc("sine",     [[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.3]], 0.1, 0.7);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CodeMatch({ onProgressChange, savedProgress, onBack }) {
  const { token, user } = useAuth();
  const API_BASE = getApiBase();

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [phase, setPhase] = useState("lobby"); // lobby | playing | checking | finished
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moves, setMoves] = useState(0);

  const [matchPool, setMatchPool] = useState([]);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);
  const tracks = ["JavaScript", "React.js", "Node.js", "MongoDB"];

  // ─── Fetch question pool ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchPool = async () => {
      if (!token || !user) { setLoading(false); return; }
      try {
        const headers = buildAuthHeaders(token, user);
        const res = await fetch(`${API_BASE}/api/arcade/questions?type=match`, { headers });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setMatchPool(json.data.map((p, idx) => ({ ...p, level: p.level || Math.floor(idx / 6) + 1 })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPool();
  }, [token, user, API_BASE]);

  const getLevelsForTrack = (track) => {
    const pool = matchPool.filter(p => p.track === track);
    const lvls = [...new Set(pool.map(p => p.level))].sort((a, b) => a - b);
    return lvls.length > 0 ? lvls : [1];
  };

  const loadMatchPairs = (track, levelNum) => {
    const levelPairs = matchPool.filter(p => p.track === track && p.level === levelNum);
    if (levelPairs.length === 0) return [];
    if (levelPairs.length < 6) {
      const others = matchPool.filter(p => p.track === track && p.level !== levelNum);
      return [...levelPairs, ...others].slice(0, 6);
    }
    return [...levelPairs].sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  const handleStartGame = (track, levelNum) => {
    playSynthSound("click", soundEnabled);
    const pairs = loadMatchPairs(track, levelNum);
    if (pairs.length < 6) { alert(`No concept pairs found for Level ${levelNum} in ${track}.`); return; }

    const cardList = [];
    pairs.forEach(pair => {
      cardList.push({ id: `term_${pair.id}`, pairId: pair.id, type: "term",       content: pair.term,       isFlipped: false, isMatched: false });
      cardList.push({ id: `def_${pair.id}`,  pairId: pair.id, type: "definition", content: pair.definition, isFlipped: false, isMatched: false });
    });

    setSelectedTrack(track);
    setCurrentLevel(levelNum);
    setCards(cardList.sort(() => 0.5 - Math.random()));
    setSelectedIndices([]);
    setScore(0); setStreak(0); setBestStreak(0); setElapsedTime(0); setMoves(0);
    setPhase("playing");
  };

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing" && phase !== "checking") return;
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ─── Card click handler ───────────────────────────────────────────────────
  const handleCardClick = (idx) => {
    if (phase !== "playing" || cards[idx].isFlipped || cards[idx].isMatched || selectedIndices.includes(idx)) return;
    playSynthSound("flip", soundEnabled);

    const updated = [...cards];
    updated[idx].isFlipped = true;
    setCards(updated);

    const next = [...selectedIndices, idx];
    setSelectedIndices(next);

    if (next.length === 2) {
      setPhase("checking");
      setMoves(m => m + 1);
      setTimeout(() => checkMatch(next), 700);
    }
  };

  const checkMatch = (indices) => {
    const [a, b] = indices;
    const c1 = cards[a], c2 = cards[b];
    const correct = c1.pairId === c2.pairId && c1.type !== c2.type;
    const updated = [...cards];

    if (correct) {
      playSynthSound("match", soundEnabled);
      updated[a].isMatched = true;
      updated[b].isMatched = true;

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const gained = 150 + (newStreak - 1) * 30;
      setScore(s => s + gained);

      if (updated.every(c => c.isMatched)) {
        clearInterval(timerRef.current);
        playSynthSound("complete", soundEnabled);
        const finalScore = score + gained + Math.max(0, 500 - elapsedTime * 5) + Math.max(0, 300 - (moves - 6) * 20);
        setScore(Math.round(finalScore));

        const existingLevels = savedProgress?.completedLevels || [];
        const levelKey = `match_${selectedTrack.toLowerCase()}_level_${currentLevel}`;
        onProgressChange({
          completedLevels: [...new Set([...existingLevels, levelKey])],
          highScore: Math.max(savedProgress?.highScore || 0, Math.round(finalScore)),
          lastTimeSeconds: elapsedTime,
          completedAll: true
        });
        setPhase("finished");
      } else {
        setPhase("playing");
      }
    } else {
      playSynthSound("mismatch", soundEnabled);
      updated[a].isFlipped = false;
      updated[b].isFlipped = false;
      setStreak(0);
      setPhase("playing");
    }

    setCards(updated);
    setSelectedIndices([]);
  };

  const fmt = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-[70vh] w-full rounded-3xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
    >
      {/* 3D card flip CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cm-card { perspective: 1000px; }
        .cm-inner { position:relative; width:100%; height:100%; transition: transform 0.42s cubic-bezier(.4,0,.2,1); transform-style:preserve-3d; }
        .cm-flipped .cm-inner { transform: rotateY(180deg); }
        .cm-front, .cm-back { position:absolute; inset:0; backface-visibility:hidden; border-radius:14px; }
        .cm-back { transform: rotateY(180deg); }
      `}} />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] pointer-events-none opacity-30" style={{ background: "var(--accent-glow)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] pointer-events-none opacity-20" style={{ background: "var(--accent-glow)" }} />

      {/* Sound toggle */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setSoundEnabled(v => !v)}
          className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105"
          style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════════════
            LOBBY
        ═══════════════════════════════════════════════════════════════════ */}
        {phase === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 md:p-14 text-center min-h-[70vh] space-y-8 relative z-10"
          >
            {loading ? (
              /* Loading state */
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
                  <RefreshCw size={20} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading match pairs…</p>
              </div>

            ) : !selectedTrack ? (
              /* Track selection */
              <>
                <div className="space-y-3">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ color: "var(--accent-primary)", borderColor: "var(--border-primary)", backgroundColor: "var(--accent-glow)" }}>
                    <Layers size={10} />
                    Code Match
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Concepts Match
                  </h2>
                  <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Flip cards and match coding terms with their definitions. Fewer moves = higher score.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                  {tracks.map(track => {
                    const lvCount = getLevelsForTrack(track).length;
                    return (
                      <motion.button
                        key={track}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTrack(track)}
                        className="relative p-5 rounded-2xl border text-left cursor-pointer group overflow-hidden transition-colors"
                        style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-primary)"}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all" style={{ background: "var(--accent-glow)" }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Track</p>
                        <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{track}</h4>
                        <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>{lvCount} level{lvCount !== 1 ? "s" : ""} available</p>
                      </motion.button>
                    );
                  })}
                </div>

                <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                  <ArrowLeft size={13} /> Back to Hub
                </button>
              </>

            ) : (
              /* Level selection */
              <>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ color: "var(--accent-primary)", borderColor: "var(--border-primary)", backgroundColor: "var(--accent-glow)" }}>
                    {selectedTrack}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Select Level
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Complete levels in order to unlock the next.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
                  {getLevelsForTrack(selectedTrack).map(lvl => {
                    const isUnlocked = lvl === 1 || (savedProgress?.completedLevels || []).includes(`match_${selectedTrack.toLowerCase()}_level_${lvl - 1}`);
                    const isCompleted = (savedProgress?.completedLevels || []).includes(`match_${selectedTrack.toLowerCase()}_level_${lvl}`);
                    return (
                      <motion.button
                        key={lvl}
                        disabled={!isUnlocked}
                        onClick={() => handleStartGame(selectedTrack, lvl)}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        whileTap={isUnlocked ? { scale: 0.97 } : {}}
                        className="p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-colors"
                        style={{
                          borderColor: isCompleted ? "var(--accent-primary)" : "var(--border-primary)",
                          backgroundColor: isCompleted ? "var(--accent-glow)" : "var(--bg-secondary)",
                          opacity: isUnlocked ? 1 : 0.4,
                          cursor: isUnlocked ? "pointer" : "not-allowed"
                        }}
                      >
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Level</span>
                        <span className="text-xl font-black" style={{ color: isCompleted ? "var(--accent-primary)" : "var(--text-primary)" }}>{lvl}</span>
                        {isCompleted
                          ? <CheckCircle2 size={13} style={{ color: "var(--accent-primary)" }} />
                          : <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>{isUnlocked ? "Play" : "Locked"}</span>
                        }
                      </motion.button>
                    );
                  })}
                </div>

                <button onClick={() => setSelectedTrack(null)} className="flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                  <ArrowLeft size={13} /> Back to Tracks
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            GAMEPLAY
        ═══════════════════════════════════════════════════════════════════ */}
        {(phase === "playing" || phase === "checking") && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 md:p-7 flex flex-col min-h-[70vh] relative z-10 gap-5"
          >
            {/* HUD */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
              {/* Left — track + level + timer */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedTrack}</span>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full border" style={{ color: "var(--text-secondary)", borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
                  Level {currentLevel}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1" style={{ color: "var(--accent-primary)", borderColor: "var(--border-primary)", backgroundColor: "var(--accent-glow)" }}>
                  <Clock size={10} /> {fmt(elapsedTime)}
                </span>
              </div>

              {/* Right — score + moves + streak */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  <Zap size={13} style={{ color: "var(--accent-primary)" }} />
                  {score} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>pts</span>
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Moves: <strong style={{ color: "var(--text-primary)" }}>{moves}</strong>
                </div>
                <AnimatePresence>
                  {streak > 1 && (
                    <motion.div
                      key={streak}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-xs font-bold"
                      style={{ color: "#f97316" }}
                    >
                      <Star size={11} fill="#f97316" /> {streak}x
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 content-center">
              {cards.map((card, idx) => {
                const isFlipped = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`cm-card h-28 md:h-36 w-full cursor-pointer ${isFlipped ? "cm-flipped" : ""}`}
                  >
                    <div className="cm-inner">
                      {/* FRONT — face down */}
                      <div
                        className="cm-front flex flex-col items-center justify-center gap-2 transition-colors"
                        style={{ border: "1px solid var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--accent-glow)", border: "1px solid var(--border-primary)" }}>
                          <Layers size={14} style={{ color: "var(--accent-primary)", opacity: 0.7 }} />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest font-medium" style={{ color: "var(--text-muted)", opacity: 0.5 }}>Match</span>
                      </div>

                      {/* BACK — face up */}
                      <div
                        className="cm-back flex items-center justify-center p-3 text-center"
                        style={{
                          border: card.isMatched ? "1px solid var(--accent-primary)" : "1px solid var(--border-primary)",
                          backgroundColor: card.isMatched ? "var(--accent-glow)" : "var(--bg-primary)",
                        }}
                      >
                        <div className="flex flex-col justify-between h-full w-full">
                          <span className="text-[8px] uppercase tracking-wider font-semibold self-start" style={{ color: card.isMatched ? "var(--accent-primary)" : "var(--text-muted)", opacity: 0.7 }}>
                            {card.type}
                          </span>
                          <span className="flex-1 flex items-center justify-center text-center text-[10px] md:text-xs font-medium leading-snug py-1" style={{ color: card.isMatched ? "var(--accent-primary)" : "var(--text-primary)" }}>
                            {card.content}
                          </span>
                          {card.isMatched
                            ? <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "var(--accent-primary)" }}>✓ Matched</span>
                            : <span className="h-3" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint bar */}
            <div className="border-t pt-3 text-center text-[10px]" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
              Click a card to flip it — find the matching term & definition pair
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            FINISHED
        ═══════════════════════════════════════════════════════════════════ */}
        {phase === "finished" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="flex flex-col items-center justify-center p-8 text-center min-h-[70vh] space-y-6 relative z-10"
          >
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl border flex items-center justify-center"
              style={{ background: "rgba(234,179,8,0.08)", borderColor: "rgba(234,179,8,0.2)" }}
            >
              <Trophy size={32} style={{ color: "#eab308" }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Level {currentLevel} Cleared</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Code Match Complete!</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{selectedTrack} Track</p>
            </motion.div>

            {/* Stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-3 gap-3 w-full max-w-sm"
            >
              {[
                { label: "Score", value: score, color: "var(--accent-primary)" },
                { label: "Time",  value: fmt(elapsedTime), color: "var(--text-primary)" },
                { label: "Moves", value: moves, color: "#f97316" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
                  <div className="text-2xl font-black" style={{ color }}>{value}</div>
                  <div className="text-[9px] uppercase tracking-wider font-semibold mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {(() => {
                const nextLvl = currentLevel + 1;
                if (getLevelsForTrack(selectedTrack).includes(nextLvl)) {
                  return (
                    <button
                      onClick={() => handleStartGame(selectedTrack, nextLvl)}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md cursor-pointer"
                      style={{ background: "var(--accent-gradient)", color: "var(--text-on-accent)" }}
                    >
                      <Play size={13} /> Level {nextLvl}
                    </button>
                  );
                }
                return null;
              })()}

              <button
                onClick={() => handleStartGame(selectedTrack, currentLevel)}
                className="px-5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
              >
                <RotateCcw size={13} /> Replay
              </button>

              <button
                onClick={() => setPhase("lobby")}
                className="px-5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                All Levels
              </button>
            </motion.div>

            <button
              onClick={onBack}
              className="text-xs font-medium transition-colors cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              Exit to Arcade Lobby
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
