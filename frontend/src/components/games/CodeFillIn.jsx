"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle,
  Trophy, RotateCcw, BookOpen, Lightbulb, Star,
  Clock, Zap, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Questions Library ─────────────────────────────────────────────────────────
// Format: { code } uses "____" for the blank, { options } 4 choices, { answer }, { hint }
const QUESTIONS = [
  // ── Python ──────────────────────────────────────────────────────────────────
  {
    id: "py1", lang: "Python",
    title: "Conditional Check",
    code: `age = 18\n____ age >= 18:\n    print("adult")`,
    blank: "____",
    options: ["if", "while", "for", "def"],
    answer: "if",
    hint: "Python uses `if` to start a conditional block. The syntax is `if condition:`.",
  },
  {
    id: "py2", lang: "Python",
    title: "Function Definition",
    code: `____ greet(name):\n    return f"Hello, {name}!"`,
    blank: "____",
    options: ["def", "fn", "function", "lambda"],
    answer: "def",
    hint: "Functions in Python are defined using the `def` keyword, followed by the function name.",
  },
  {
    id: "py3", lang: "Python",
    title: "Range Iteration",
    code: `for i in ____(10):\n    print(i)`,
    blank: "____",
    options: ["range", "len", "list", "iter"],
    answer: "range",
    hint: "`range(n)` generates a sequence from 0 to n-1. It's the standard way to iterate a fixed number of times.",
  },
  {
    id: "py4", lang: "Python",
    title: "Return Statement",
    code: `def square(x):\n    ____ x * x`,
    blank: "____",
    options: ["return", "yield", "print", "pass"],
    answer: "return",
    hint: "`return` exits the function and sends back a value to the caller.",
  },
  {
    id: "py5", lang: "Python",
    title: "List Length",
    code: `nums = [1, 2, 3, 4, 5]\ncount = ____(nums)\nprint(count)`,
    blank: "____",
    options: ["len", "count", "size", "length"],
    answer: "len",
    hint: "`len()` is a built-in function that returns the number of items in a sequence.",
  },
  // ── JavaScript ──────────────────────────────────────────────────────────────
  {
    id: "js1", lang: "JavaScript",
    title: "Block Variable",
    code: `____ score = 0;\nscore += 10;\nconsole.log(score);`,
    blank: "____",
    options: ["let", "var", "const", "set"],
    answer: "let",
    hint: "`let` declares a block-scoped variable that can be reassigned. `const` cannot be reassigned, and `var` is function-scoped.",
  },
  {
    id: "js2", lang: "JavaScript",
    title: "Arrow Function",
    code: `const double = x ____ x * 2;\nconsole.log(double(5));`,
    blank: "____",
    options: ["=>", "->", ":", "="],
    answer: "=>",
    hint: "Arrow functions use `=>` to separate parameters from the function body: `param => expression`.",
  },
  {
    id: "js3", lang: "JavaScript",
    title: "Array Filter",
    code: `const evens = [1,2,3,4,5]\n  .____( x => x % 2 === 0 );\nconsole.log(evens);`,
    blank: "____",
    options: ["filter", "map", "reduce", "find"],
    answer: "filter",
    hint: "`Array.filter()` returns a new array with only elements that pass the test function.",
  },
  {
    id: "js4", lang: "JavaScript",
    title: "Async Keyword",
    code: `____ function fetchUser(id) {\n  const data = await getUser(id);\n  return data;\n}`,
    blank: "____",
    options: ["async", "await", "defer", "sync"],
    answer: "async",
    hint: "A function that uses `await` must itself be declared with `async`. This enables Promise-based asynchronous code.",
  },
  {
    id: "js5", lang: "JavaScript",
    title: "Type Check",
    code: `const name = "Alice";\nconsole.log(____ name === "string");`,
    blank: "____",
    options: ["typeof", "instanceof", "typecheck", "isType"],
    answer: "typeof",
    hint: "`typeof` returns a string indicating the type of the operand (e.g. \"string\", \"number\", \"boolean\").",
  },
  // ── SQL ─────────────────────────────────────────────────────────────────────
  {
    id: "sql1", lang: "SQL",
    title: "Select All",
    code: `____ * FROM employees;`,
    blank: "____",
    options: ["SELECT", "GET", "FETCH", "PICK"],
    answer: "SELECT",
    hint: "`SELECT` retrieves data from a database table. `SELECT *` selects all columns.",
  },
  {
    id: "sql2", lang: "SQL",
    title: "Filter Rows",
    code: `SELECT name, salary\nFROM employees\n____ salary > 50000;`,
    blank: "____",
    options: ["WHERE", "HAVING", "IF", "FILTER"],
    answer: "WHERE",
    hint: "`WHERE` filters rows before grouping. `HAVING` filters after grouping (used with GROUP BY).",
  },
  {
    id: "sql3", lang: "SQL",
    title: "Sort Results",
    code: `SELECT name, age\nFROM users\n____ age DESC;`,
    blank: "____",
    options: ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE BY"],
    answer: "ORDER BY",
    hint: "`ORDER BY column DESC` sorts results in descending order. Use `ASC` for ascending (the default).",
  },
  {
    id: "sql4", lang: "SQL",
    title: "Count Rows",
    code: `SELECT department, ____(id)\nFROM employees\nGROUP BY department;`,
    blank: "____",
    options: ["COUNT", "SUM", "AVG", "TOTAL"],
    answer: "COUNT",
    hint: "`COUNT(column)` counts non-null values in a column. `COUNT(*)` counts all rows.",
  },
  {
    id: "sql5", lang: "SQL",
    title: "Inner Join",
    code: `SELECT e.name, d.name\nFROM employees e\n____ JOIN departments d\nON e.dept_id = d.id;`,
    blank: "____",
    options: ["INNER", "LEFT", "RIGHT", "CROSS"],
    answer: "INNER",
    hint: "`INNER JOIN` returns rows where there is a match in both tables. Other joins (LEFT, RIGHT) include unmatched rows.",
  },
];

const STORAGE_KEY = "game_progress_code-fill-in";
const POINTS_PER_CORRECT = 100;
const SPEED_BONUS_THRESHOLD = 5; // seconds for full speed bonus

function loadProgress() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Shuffle options for each question (stable per session)
function shuffleOptions(q) {
  const opts = [...q.options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { ...q, options: opts };
}

export default function CodeFillIn({ onBack }) {
  const [questions] = useState(() => QUESTIONS.map(shuffleOptions));
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState("playing"); // playing | correct | wrong | finished
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [progress] = useState(loadProgress);
  const [results, setResults] = useState([]); // { correct, speedBonus }

  const timerRef = useRef(null);

  const q = questions[qIdx];
  const total = questions.length;

  // Timer
  useEffect(() => {
    if (phase !== "playing") { clearInterval(timerRef.current); return; }
    setStartTime(Date.now());
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIdx, phase]);

  function handleSelect(opt) {
    if (phase !== "playing") return;
    clearInterval(timerRef.current);
    const timeTaken = (Date.now() - startTime) / 1000;
    const correct = opt === q.answer;
    const speedBonus = correct && timeTaken <= SPEED_BONUS_THRESHOLD
      ? Math.round(POINTS_PER_CORRECT * (1 - timeTaken / (SPEED_BONUS_THRESHOLD * 2)))
      : 0;

    setSelected(opt);
    if (correct) {
      const gained = POINTS_PER_CORRECT + speedBonus;
      setScore(s => s + gained);
      setStreak(s => s + 1);
      setResults(r => [...r, { correct: true, speedBonus, time: Math.round(timeTaken) }]);
    } else {
      setStreak(0);
      setResults(r => [...r, { correct: false, speedBonus: 0, time: Math.round(timeTaken) }]);
    }
    setPhase(correct ? "correct" : "wrong");
  }

  function next() {
    if (qIdx + 1 >= total) {
      // Save progress
      const completedIds = [...(progress.completedLevels || []), q.id];
      const newProg = { ...progress, completedLevels: completedIds, score, completedAll: true };
      saveProgress(newProg);
      setPhase("finished");
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
      setShowHint(false);
      setPhase("playing");
    }
  }

  // Render code with highlighted blank
  function renderCode(code, blank, answer, selectedOpt, ph) {
    const fillText = ph === "playing" || ph === "wrong" || ph === "correct"
      ? (selectedOpt || blank)
      : blank;
    const highlighted = code.replace(blank, `⟨${fillText}⟩`);
    return highlighted.split("⟨").map((part, i) => {
      if (i === 0) return <span key="pre" className="text-white/60">{part}</span>;
      const [fill, rest] = part.split("⟩");
      const fillColor =
        ph === "correct" ? "text-emerald-300 bg-emerald-500/20" :
        ph === "wrong"   ? "text-rose-300 bg-rose-500/20" :
        "text-cyan-300 bg-cyan-500/15 animate-pulse";
      return (
        <React.Fragment key={i}>
          <span className={`font-black px-1 py-0.5 rounded mx-0.5 ${fillColor}`}>{fill}</span>
          <span className="text-white/60">{rest}</span>
        </React.Fragment>
      );
    });
  }

  const langColor = {
    Python: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    JavaScript: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    SQL: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  if (phase === "finished") {
    const correct = results.filter(r => r.correct).length;
    const accuracy = Math.round((correct / total) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090B14] via-[#0C1021] to-[#070A12] text-white p-4 md:p-8 flex items-center justify-center">
        <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-gradient-to-br from-violet-900/30 to-cyan-900/30 border border-violet-500/20 rounded-3xl p-8 text-center space-y-6 relative z-10"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-amber-500/15 border border-amber-500/25">
              <Trophy size={36} className="text-amber-300" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">Quiz Complete!</h2>
            <p className="text-sm text-white/40 font-mono mt-1">{correct}/{total} correct answers</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/6 rounded-2xl p-4">
              <div className="text-3xl font-black text-cyan-300">{score}</div>
              <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mt-1">Score</div>
            </div>
            <div className="bg-white/5 border border-white/6 rounded-2xl p-4">
              <div className="text-3xl font-black text-emerald-300">{accuracy}%</div>
              <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mt-1">Accuracy</div>
            </div>
            <div className="bg-white/5 border border-white/6 rounded-2xl p-4">
              <div className="text-3xl font-black text-violet-300">{Math.max(...results.map((_, i) => {
                let s = 0; for (let j = i; j >= 0 && results[j].correct; j--) s++; return s;
              }))}</div>
              <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mt-1">Best Streak</div>
            </div>
          </div>

          {/* Per-question results */}
          <div className="space-y-1.5 max-h-44 overflow-y-auto text-left">
            {questions.map((qq, i) => (
              <div key={qq.id} className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs ${
                results[i]?.correct ? "bg-emerald-500/8 border-emerald-500/15" : "bg-rose-500/8 border-rose-500/15"
              }`}>
                <span className="font-mono text-white/50">{qq.title}</span>
                {results[i]?.correct
                  ? <CheckCircle2 size={13} className="text-emerald-400" />
                  : <XCircle size={13} className="text-rose-400" />}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setQIdx(0); setSelected(null); setShowHint(false); setScore(0); setStreak(0); setResults([]); setPhase("playing"); }}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={13} /> Retry
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft size={13} /> Arcade Hub
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090B14] via-[#0C1021] to-[#070A12] text-white p-4 md:p-8">
      <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-cyan-500/6 blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">

        {/* ── Nav ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-950/20 text-violet-300 hover:text-white hover:border-violet-400/40 transition-all text-xs font-bold font-mono cursor-pointer"
          >
            <ArrowLeft size={13} />
            Exit Arena
          </button>

          {/* Score + Streak */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Zap size={13} />
              <span className="font-black">{score}</span>
              <span className="text-white/30">pts</span>
            </div>
            {streak >= 2 && (
              <div className="flex items-center gap-1 text-orange-400 font-black">
                <Star size={12} className="fill-orange-400" />
                {streak}x streak
              </div>
            )}
          </div>
        </div>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <BookOpen size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Code Fill-In</h1>
            <p className="text-xs text-white/35 font-mono">Question {qIdx + 1} of {total}</p>
          </div>
        </div>

        {/* ── Progress Bar ───────────────────────────────────────────── */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
            animate={{ width: `${((qIdx) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* ── Question Card ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono ${langColor[q.lang]}`}>
                  {q.lang}
                </span>
                <span className="text-xs text-white/40 font-mono">{q.title}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-white/30">
                <Clock size={11} />
                <span>{elapsed}s</span>
              </div>
            </div>

            {/* Code display */}
            <div className="bg-[#0D1117]/80 border border-white/8 rounded-2xl p-5 overflow-x-auto">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
              </div>
              <pre className="font-mono text-sm leading-7 whitespace-pre-wrap">
                {renderCode(q.code, q.blank, q.answer, selected, phase)}
              </pre>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = phase !== "playing" && opt === q.answer;
                const isWrong = isSelected && phase === "wrong";
                return (
                  <motion.button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={phase !== "playing"}
                    whileHover={phase === "playing" ? { scale: 1.02 } : {}}
                    whileTap={phase === "playing" ? { scale: 0.98 } : {}}
                    className={`px-4 py-3.5 rounded-xl border font-mono font-bold text-sm transition-all cursor-pointer text-left ${
                      isCorrect
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.2)]"
                        : isWrong
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                        : phase !== "playing"
                        ? "bg-white/2 border-white/6 text-white/25 cursor-not-allowed"
                        : "bg-white/4 border-white/10 text-white/70 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/8"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isCorrect && <CheckCircle2 size={14} className="shrink-0" />}
                      {isWrong && <XCircle size={14} className="shrink-0" />}
                      {opt}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {phase !== "playing" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl border p-4 flex items-start gap-3 ${
                    phase === "correct"
                      ? "bg-emerald-500/8 border-emerald-500/20"
                      : "bg-rose-500/8 border-rose-500/20"
                  }`}
                >
                  {phase === "correct"
                    ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  }
                  <div className="space-y-1">
                    <p className={`text-sm font-bold ${phase === "correct" ? "text-emerald-300" : "text-rose-300"}`}>
                      {phase === "correct" ? "Correct!" : `Wrong — the answer is "${q.answer}"`}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">{q.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint toggle */}
            {phase === "playing" && (
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-amber-400 transition-colors cursor-pointer font-mono"
              >
                <Lightbulb size={13} />
                {showHint ? "Hide hint" : "Show hint (−10 pts)"}
              </button>
            )}

            <AnimatePresence>
              {showHint && phase === "playing" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                    <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/70 leading-relaxed">{q.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue button */}
            {phase !== "playing" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={next}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm transition-all hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                {qIdx + 1 >= total ? (
                  <><Trophy size={15} /> View Results</>
                ) : (
                  <>Next Question <ArrowRight size={15} /></>
                )}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
