"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, ArrowRight, RefreshCw, Trophy, Zap, Target,
  CheckCircle2, Flame, Clock, RotateCcw, Star, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Snippet Library ──────────────────────────────────────────────────────────
const SNIPPETS = {
  python: [
    { level: 1, title: "Hello World",        code: 'print("Hello, World!")' },
    { level: 2, title: "For Loop",            code: "for i in range(5):\n    print(i)" },
    { level: 3, title: "Simple Function",     code: "def add(a, b):\n    return a + b" },
    { level: 4, title: "List Comprehension",  code: "squares = [x ** 2 for x in range(10)]" },
    { level: 5, title: "If / Else",           code: "x = 42\nif x > 0:\n    print(\"positive\")\nelse:\n    print(\"non-positive\")" },
    { level: 6, title: "Lambda",              code: "double = lambda x: x * 2\nprint(double(7))" },
    { level: 7, title: "Dictionary",          code: "person = {\"name\": \"Alice\", \"age\": 30}\nprint(person[\"name\"])" },
    { level: 8, title: "Class Definition",    code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(f\"{self.name} says woof!\")" },
    { level: 9, title: "Try / Except",        code: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")" },
    { level: 10, title: "Decorator",          code: "def log(func):\n    def wrapper(*args):\n        print(f\"Calling {func.__name__}\")\n        return func(*args)\n    return wrapper\n\n@log\ndef greet(name):\n    print(f\"Hello, {name}!\")" },
  ],
  javascript: [
    { level: 1, title: "Hello World",         code: 'console.log("Hello, World!");' },
    { level: 2, title: "For Loop",             code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}" },
    { level: 3, title: "Arrow Function",       code: "const add = (a, b) => a + b;" },
    { level: 4, title: "Array Map",            code: "const squares = [1,2,3,4,5].map(x => x ** 2);" },
    { level: 5, title: "Ternary + Template",   code: "const x = 42;\nconst msg = x > 0 ? \"positive\" : \"non-positive\";\nconsole.log(`x is ${msg}`);" },
    { level: 6, title: "Destructuring",        code: "const { name, age } = { name: \"Alice\", age: 30 };\nconsole.log(name);" },
    { level: 7, title: "Spread & Rest",        code: "const sum = (...nums) => nums.reduce((a, b) => a + b, 0);\nconsole.log(sum(1, 2, 3, 4));" },
    { level: 8, title: "Class + Constructor",  code: "class Dog {\n  constructor(name) {\n    this.name = name;\n  }\n  bark() {\n    console.log(`${this.name} says woof!`);\n  }\n}" },
    { level: 9, title: "Async / Await",        code: "async function fetchData(url) {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n}" },
    { level: 10, title: "Higher-Order Fn",     code: "const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\nconst double = x => x * 2;\nconst inc = x => x + 1;\nconst transform = compose(double, inc);\nconsole.log(transform(5));" },
  ],
};

const STORAGE_KEY = "game_progress_type-racer";

function loadProgress() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Character-level diff helper ──────────────────────────────────────────────
function buildCharMap(target, typed) {
  return target.split("").map((ch, i) => {
    if (i >= typed.length) return "pending";
    if (typed[i] === ch) return "correct";
    return "wrong";
  });
}

// ─── WPM Calculation ──────────────────────────────────────────────────────────
function calcWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds < 1) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TypeRacer({ onBack }) {
  const [lang, setLang] = useState("python");
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState("lobby"); // lobby | playing | complete | finished
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [progress, setProgress] = useState(loadProgress);
  const [showSummary, setShowSummary] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const snippets = SNIPPETS[lang];
  const snippet = snippets[levelIdx];
  const target = snippet.code;
  const totalLevels = snippets.length;

  // Computed stats
  const charMap = buildCharMap(target, typed);
  const correctChars = charMap.filter(s => s === "correct").length;
  const progressPct = Math.round((typed.length / target.length) * 100);

  // ─── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      const secs = (Date.now() - startTime) / 1000;
      setElapsed(secs);
      setWpm(calcWPM(correctChars, secs));
    }, 300);
    return () => clearInterval(timerRef.current);
  }, [phase, startTime, correctChars]);

  // ─── Input handler ──────────────────────────────────────────────────────────
  const handleInput = useCallback((e) => {
    const val = e.target.value;

    if (phase === "lobby") return;

    if (phase !== "playing") return;

    // Count new mistakes
    const prevLen = typed.length;
    if (val.length > prevLen) {
      const newChar = val[prevLen];
      const expected = target[prevLen];
      if (newChar !== expected) {
        setMistakes(m => m + 1);
      }
    }

    setTyped(val);

    // Accuracy calc
    const totalTyped = val.length;
    const wrongCount = val.split("").filter((c, i) => c !== target[i]).length;
    const acc = totalTyped > 0 ? Math.round(((totalTyped - wrongCount) / totalTyped) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val === target) {
      clearInterval(timerRef.current);
      const finalElapsed = (Date.now() - startTime) / 1000;
      const finalWpm = calcWPM(target.length, finalElapsed);

      // Save progress
      const key = `${lang}_${levelIdx}`;
      const best = progress[key]?.bestWpm || 0;
      const newProg = {
        ...progress,
        completedLevels: Array.from(new Set([...(progress.completedLevels || []), `${lang}_${levelIdx}`])),
        [key]: { bestWpm: Math.max(finalWpm, best), bestAccuracy: acc },
      };
      setProgress(newProg);
      saveProgress(newProg);
      setWpm(finalWpm);
      setPhase("complete");
    }
  }, [phase, typed, target, startTime, lang, levelIdx, progress]);

  // ─── Start game ─────────────────────────────────────────────────────────────
  function startGame() {
    setTyped("");
    setMistakes(0);
    setAccuracy(100);
    setElapsed(0);
    setWpm(0);
    setStartTime(Date.now());
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // ─── Restart ────────────────────────────────────────────────────────────────
  function restart() {
    setTyped("");
    setMistakes(0);
    setAccuracy(100);
    setElapsed(0);
    setWpm(0);
    setStartTime(Date.now());
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // ─── Next level ─────────────────────────────────────────────────────────────
  function nextLevel() {
    if (levelIdx + 1 >= totalLevels) {
      setPhase("finished");
    } else {
      setLevelIdx(l => l + 1);
      setPhase("lobby");
      setTyped("");
      setMistakes(0);
      setAccuracy(100);
      setElapsed(0);
      setWpm(0);
    }
  }

  // ─── Language switch ────────────────────────────────────────────────────────
  function switchLang(l) {
    setLang(l);
    setLevelIdx(0);
    setPhase("lobby");
    setTyped("");
    setMistakes(0);
    setAccuracy(100);
    setElapsed(0);
    setWpm(0);
  }

  const completedForLang = (progress.completedLevels || []).filter(k => k.startsWith(lang + "_")).length;
  const bestKey = `${lang}_${levelIdx}`;
  const bestWpm = progress[bestKey]?.bestWpm || 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090B14] via-[#0C1021] to-[#070A12] text-white p-4 md:p-8 select-none">
      {/* Ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-cyan-500/6 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-violet-600/8 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">

        {/* ── Nav Bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] border-cyan-500/20 bg-cyan-950/20 text-cyan-300 hover:text-white hover:border-cyan-400/40 transition-all text-xs font-bold font-mono cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Exit Arena</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-white/3 border border-[var(--border-primary)] border-white/8 rounded-full p-1">
            {["python", "javascript"].map(l => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                  lang === l
                    ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {l === "python" ? "Python" : "JavaScript"}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/40">
            <Flame size={12} className="text-orange-400" />
            <span>{completedForLang}/{totalLevels} done</span>
          </div>
        </div>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-[var(--border-primary)] border-cyan-500/20">
              <Zap size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">TypeRacer Pro</h1>
              <p className="text-xs text-white/35 font-mono">
                Level {levelIdx + 1}/{totalLevels} · {snippet.title}
              </p>
            </div>
          </div>
        </div>

        {/* ── Level Dots ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {snippets.map((s, i) => {
            const done = (progress.completedLevels || []).includes(`${lang}_${i}`);
            const isActive = i === levelIdx;
            return (
              <button
                key={i}
                onClick={() => { setLevelIdx(i); setPhase("lobby"); setTyped(""); }}
                className={`w-7 h-7 rounded-full text-[10px] font-bold font-mono border border-[var(--border-primary)] transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    : done
                    ? "bg-cyan-900/40 border-cyan-500/30 text-cyan-400"
                    : "bg-white/3 border-white/10 text-white/30 hover:text-white/60"
                }`}
              >
                {done && !isActive ? <CheckCircle2 size={12} className="mx-auto" /> : i + 1}
              </button>
            );
          })}
        </div>

        {/* ── Stats Row ───────────────────────────────────────────────── */}
        {phase === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-3"
          >
            {[
              { label: "WPM", value: wpm, icon: <Zap size={14} className="text-cyan-400" />, accent: "text-cyan-300" },
              { label: "Accuracy", value: `${accuracy}%`, icon: <Target size={14} className="text-emerald-400" />, accent: "text-emerald-300" },
              { label: "Progress", value: `${progressPct}%`, icon: <ChevronRight size={14} className="text-violet-400" />, accent: "text-violet-300" },
              { label: "Mistakes", value: mistakes, icon: <RefreshCw size={14} className="text-rose-400" />, accent: "text-rose-300" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/3 border border-[var(--border-primary)] border-white/6 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className={`text-xl font-black font-mono ${stat.accent}`}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Code Display ─────────────────────────────────────────────── */}
        <div className="relative bg-[#0D1117]/80 border border-[var(--border-primary)] border-white/8 rounded-3xl p-6 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[10px] font-mono text-white/20">
              {lang === "python" ? "snippet.py" : "snippet.js"}
            </span>
          </div>

          {/* Progress bar */}
          {phase === "playing" && (
            <div className="mb-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}

          {/* Characters */}
          <pre className="font-mono text-sm leading-7 whitespace-pre-wrap break-all select-none">
            {target.split("").map((ch, i) => {
              const state = charMap[i];
              const isCursor = i === typed.length && phase === "playing";
              return (
                <span
                  key={i}
                  className={`relative ${
                    state === "correct" ? "text-cyan-300" :
                    state === "wrong"   ? "text-rose-400 bg-rose-500/20 rounded" :
                    "text-white/20"
                  } ${isCursor ? "border-l-2 border-cyan-400" : ""}`}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              );
            })}
          </pre>

          {/* Overlay when not playing */}
          {phase === "lobby" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1117]/75 backdrop-blur-sm rounded-3xl">
              <div className="text-center space-y-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-[var(--border-primary)] border-cyan-500/20 inline-block">
                  <Zap size={28} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Level {levelIdx + 1}: {snippet.title}</p>
                  {bestWpm > 0 && (
                    <p className="text-xs text-white/40 font-mono mt-1">Personal best: {bestWpm} WPM</p>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer"
                >
                  Start Typing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Hidden Textarea Input ────────────────────────────────────── */}
        {phase === "playing" && (
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Type the code snippet here"
          />
        )}

        {/* Click-to-focus overlay */}
        {phase === "playing" && (
          <div
            className="fixed inset-0 cursor-text z-0"
            onClick={() => inputRef.current?.focus()}
          />
        )}

        {/* ── Completion Card ──────────────────────────────────────────── */}
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-cyan-900/30 to-violet-900/30 border border-[var(--border-primary)] border-cyan-500/25 rounded-3xl p-8 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-cyan-500/15 border border-[var(--border-primary)] border-cyan-500/25">
                  <Trophy size={32} className="text-cyan-300" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Level Complete!</h2>
                <p className="text-sm text-white/40 font-mono mt-1">{snippet.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-[var(--border-primary)] border-white/8 rounded-2xl p-4">
                  <div className="text-3xl font-black text-cyan-300 font-mono">{wpm}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mt-1">WPM</div>
                </div>
                <div className="bg-white/5 border border-[var(--border-primary)] border-white/8 rounded-2xl p-4">
                  <div className="text-3xl font-black text-emerald-300 font-mono">{accuracy}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mt-1">Accuracy</div>
                </div>
                <div className="bg-white/5 border border-[var(--border-primary)] border-white/8 rounded-2xl p-4">
                  <div className="text-3xl font-black text-violet-300 font-mono">{Math.round(elapsed)}s</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mt-1">Time</div>
                </div>
              </div>

              {bestWpm === wpm && wpm > 0 && (
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold">
                  <Star size={14} className="fill-amber-400" />
                  <span>New Personal Best!</span>
                  <Star size={14} className="fill-amber-400" />
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={restart}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-primary)] border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw size={13} />
                  Retry
                </button>
                {levelIdx + 1 < totalLevels ? (
                  <button
                    onClick={nextLevel}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2"
                  >
                    Next Level
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => setPhase("finished")}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2"
                  >
                    Finish
                    <Trophy size={13} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Finished Screen ──────────────────────────────────────────── */}
        <AnimatePresence>
          {phase === "finished" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 border border-[var(--border-primary)] border-violet-500/25 rounded-3xl p-10 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-5 rounded-full bg-amber-500/15 border border-[var(--border-primary)] border-amber-500/25">
                  <Trophy size={40} className="text-amber-300" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Course Complete!</h2>
                <p className="text-sm text-white/40 font-mono mt-2">
                  You finished all {totalLevels} levels in {lang === "python" ? "Python" : "JavaScript"} mode.
                </p>
              </div>

              {/* Per-level summary */}
              <div className="grid grid-cols-2 gap-2 text-left max-h-64 overflow-y-auto">
                {snippets.map((s, i) => {
                  const k = `${lang}_${i}`;
                  const b = progress[k];
                  return (
                    <div key={i} className="bg-white/4 border border-[var(--border-primary)] border-white/6 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-white/50">{s.title}</span>
                      <span className="text-xs font-black text-cyan-300">{b?.bestWpm || "—"} WPM</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setLevelIdx(0); setPhase("lobby"); }}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-primary)] border-white/10 bg-white/5 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw size={13} />
                  Play Again
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black text-xs transition-all hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft size={13} />
                  Arcade Hub
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Restart / Hint controls while playing ───────────────────── */}
        {phase === "playing" && (
          <div className="flex items-center justify-between text-xs font-mono text-white/30">
            <span>Click anywhere on screen to focus · Press any key to type</span>
            <button
              onClick={restart}
              className="flex items-center gap-1 hover:text-white/60 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              Restart
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
