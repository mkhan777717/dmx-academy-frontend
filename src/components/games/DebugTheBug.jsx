"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, 
  RefreshCw, HelpCircle, Trophy, FolderOpen, FileCode, 
  Terminal as TerminalIcon, Sparkles, Volume2, VolumeX, Play,
  Heart, RotateCcw, ShieldCheck, Flame, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getApiBase, buildAuthHeaders } from "@/utils/api";

const DEFAULT_LEVELS = [];

export default function DebugTheBug({ onProgressChange, savedProgress, onBack }) {
  const { token, user } = useAuth();
  const API_BASE = getApiBase();

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [phase, setPhase] = useState("lobby"); // lobby, playing, finished

  const [levelQuestions, setLevelQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [userCodes, setUserCodes] = useState({});
  const [userCode, setUserCode] = useState("");
  const [completedLevels, setCompletedLevels] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lives, setLives] = useState(3);
  const [isDead, setIsDead] = useState(false);
  
  const [terminalLogs, setTerminalLogs] = useState([
    { text: "[SYSTEM] Booting Debugger sandbox v2.1.0...", type: "system" },
    { text: "[SANDBOX] Workspace initialized. Select target compile track to start.", type: "system" }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const [debugPool, setDebugPool] = useState([]);
  const [loading, setLoading] = useState(true);

  const editorRef = useRef(null);

  useEffect(() => {
    const fetchPool = async () => {
      if (!token || !user) return;
      try {
        const headers = buildAuthHeaders(token, user);
        const res = await fetch(`${API_BASE}/api/arcade/questions?type=debug`, { headers });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const normalized = json.data.map((q, idx) => ({
            ...q,
            language: q.track || "JavaScript",
            buggy_lines: q.buggyLines || [{ line_number: "", line_content: "" }],
            level: q.level || Math.floor(idx / 5) + 1
          }));
          setDebugPool(normalized);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPool();
  }, [token, user, API_BASE]);

  const addTerminalLog = (text, type = "info") => {
    setTerminalLogs(prev => [...prev.slice(-4), { text, type }]);
  };

  const tracks = ["JavaScript", "React.js", "Node.js", "MongoDB", "Python", "SQL"];

  // Helper normalizer
  const normaliseDebugQuestion = (q, trackName, lvlNum) => {
    const buggy_lines = Array.isArray(q.buggy_lines)
      ? q.buggy_lines
      : [
          {
            line_number: q.buggy_line_number,
            line_content: q.buggy_line_content
          }
        ].filter(b => b.line_number);

    return {
      ...q,
      level: Number(q.level) || lvlNum,
      title: q.title || `Debug ${q.file || 'Code'}`,
      language: q.language || q.track === "React.js" ? "JavaScript" : q.track || trackName,
      file: q.file || (q.track === "SQL" ? "query.sql" : q.track === "Python" ? "main.py" : "script.js"),
      instructions: q.instructions || `Fix the buggy lines in this ${q.track || trackName} file. Spot the logic or syntax errors, edit the code, and run test cases to confirm.`,
      hint: q.hint || q.explanation || "Correct the logic errors on the flagged lines.",
      defaultCode: q.code || q.defaultCode || "",
      buggy_lines: buggy_lines
    };
  };

  const getLevelsForTrack = (track) => {
    const pool = debugPool.filter(q => q.track === track || q.language === track);
    const lvls = [...new Set(pool.map(q => q.level))].sort((a, b) => a - b);
    return lvls.length > 0 ? lvls : [1];
  };

  const getQuestionsForTrackAndLevel = (track, lvlNum) => {
    const pool = debugPool.filter(q => q.track === track || q.language === track);
    return pool
      .filter(q => q.level === lvlNum)
      .map(q => normaliseDebugQuestion(q, track, lvlNum));
  };

  // Synth audio player
  const playRetroSound = useCallback((type) => {
    if (typeof window === "undefined" || !audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === "success") {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
        });
      } else if (type === "fail") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } else if (type === "heart-loss") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "victory") {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.3);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
        });
      }
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  }, [audioEnabled]);

  // Load progress and user codes on mount
  useEffect(() => {
    if (savedProgress) {
      setCompletedLevels(savedProgress.completedLevels || []);
      setStreak(savedProgress.streak || 0);
    }
    try {
      const storedCodes = localStorage.getItem("arcade_debug_bug_codes");
      if (storedCodes) {
        setUserCodes(JSON.parse(storedCodes));
      }
    } catch (e) {
      console.error(e);
    }
  }, [savedProgress]);

  const handleLoadLevel = (track, lvlNum) => {
    const questions = getQuestionsForTrackAndLevel(track, lvlNum);
    if (questions.length === 0) {
      alert(`Could not load level ${lvlNum} for track ${track}`);
      return;
    }
    setSelectedTrack(track);
    setCurrentLevel(lvlNum);
    setLevelQuestions(questions);
    setCurrentQuestionIdx(0);
    
    const q = questions[0];
    setActiveQuestion(q);
    
    const codeKey = `${track}_${lvlNum}_q${q.id || 0}`;
    const savedCode = userCodes[codeKey];
    setUserCode(savedCode !== undefined ? savedCode : q.defaultCode);
    
    setIsSuccess(false); // Reset completion status on entering level
    setLives(3);
    setIsDead(false);
    setShowHint(false);
    setTerminalLogs([
      { text: `[SYSTEM] Loaded workspace: '${q.file}' (${q.language})`, type: "system" },
      { text: `[SANDBOX] Compilation mode set to ${q.language}. Ready for testing.`, type: "info" }
    ]);
    setPhase("playing");
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < levelQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      const q = levelQuestions[nextIdx];
      setActiveQuestion(q);
      
      const codeKey = `${selectedTrack}_${currentLevel}_q${q.id || nextIdx}`;
      const savedCode = userCodes[codeKey];
      setUserCode(savedCode !== undefined ? savedCode : q.defaultCode);
      
      setIsSuccess(false);
      setLives(3);
      setIsDead(false);
      setShowHint(false);
      setTerminalLogs([
        { text: `[SYSTEM] Loaded next workspace: '${q.file}' (${q.language})`, type: "system" },
        { text: `[SANDBOX] Ready for compilation.`, type: "info" }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    playRetroSound("click");
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);
      setUserCode(newValue);
      
      const codeKey = `${selectedTrack}_${currentLevel}_q${activeQuestion.id || currentQuestionIdx}`;
      const updated = { ...userCodes, [codeKey]: newValue };
      setUserCodes(updated);
      try {
        localStorage.setItem("arcade_debug_bug_codes", JSON.stringify(updated));
      } catch (err) { console.error(err); }

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  const runCodeTests = async () => {
    if (isDead) return;
    setIsRunning(true);
    addTerminalLog(`[RUNNER] Compiling compiler trees...`, "system");
    playRetroSound("click");

    setTimeout(async () => {
      try {
        let validationResult = { success: true };
        
        // Use custom validation function if available (for DEFAULT_LEVELS)
        if (typeof activeQuestion.validate === "function") {
          validationResult = await activeQuestion.validate(userCode);
        } else if (activeQuestion.validateCode) {
          try {
            const runner = new Function("code", `
              try {
                ${activeQuestion.validateCode}
              } catch (e) {
                return { success: false, error: e.message };
              }
            `);
            validationResult = await runner(userCode);
            if (validationResult === true || (validationResult && validationResult.success)) {
              validationResult = { success: true };
            } else {
              validationResult = {
                success: false,
                error: (validationResult && validationResult.error) || "Validation check failed."
              };
            }
          } catch (e) {
            validationResult = { success: false, error: `Compilation error: ${e.message}` };
          }
        } else {
          // Smart generic validation logic for database / custom framed questions:
          // Checks if the user has modified/corrected the buggy lines.
          const userLines = userCode.split("\n");
          const buggyLines = activeQuestion.buggy_lines || [];
          
          for (const bug of buggyLines) {
            const lineIdx = Number(bug.line_number) - 1;
            if (lineIdx < 0 || lineIdx >= userLines.length) continue;
            
            const currentUserLine = userLines[lineIdx].trim();
            const originalBuggyLine = (bug.line_content || "").trim();
            
            if (originalBuggyLine && currentUserLine === originalBuggyLine) {
              validationResult = {
                success: false,
                error: `Validation Failed: The bug at line ${bug.line_number} ("${bug.line_content}") has not been corrected.`
              };
              break;
            }
            if (!currentUserLine && originalBuggyLine) {
              validationResult = {
                success: false,
                error: `Validation Failed: Line ${bug.line_number} is empty. Please correct the statement instead of deleting it.`
              };
              break;
            }
          }
        }

        if (validationResult.success) {
          setIsSuccess(true);
          playRetroSound("success");
          addTerminalLog(`[SUCCESS] Compilation successful! All test matches passed.`, "success");

          const isLastQuestion = currentQuestionIdx === levelQuestions.length - 1;
          if (isLastQuestion) {
            const levelKey = `debug_the_bug_${selectedTrack.toLowerCase()}_level_${currentLevel}`;
            if (!completedLevels.includes(levelKey)) {
              const updated = [...completedLevels, levelKey];
              setCompletedLevels(updated);
              const newStreak = streak + 1;
              setStreak(newStreak);

              if (onProgressChange) {
                onProgressChange({
                  completedLevels: updated,
                  streak: newStreak
                });
              }

              const trackLevels = getLevelsForTrack(selectedTrack);
              if (updated.filter(lvl => lvl.startsWith(`debug_the_bug_${selectedTrack.toLowerCase()}_`)).length === trackLevels.length) {
                playRetroSound("victory");
                addTerminalLog(`[VICTORY] You completed the Dojo Grid! Level 100 Code Master.`, "success");
              }
            }
          }
        } else {
          playRetroSound("fail");
          addTerminalLog(`[FAIL] ${validationResult.error}`, "error");
          
          const levelKey = `debug_the_bug_${selectedTrack.toLowerCase()}_level_${currentLevel}`;
          if (!completedLevels.includes(levelKey)) {
            const newLives = lives - 1;
            setLives(newLives);
            playRetroSound("heart-loss");
            if (newLives <= 0) {
              setIsDead(true);
              addTerminalLog(`[SYSTEM FAILURE] Main core overloaded. Health critical! Restart to reboot.`, "error");
            } else {
              addTerminalLog(`[WARNING] System warning. -1 Health node. ${newLives} nodes remaining.`, "error");
            }
          }
        }
      } catch (e) {
        playRetroSound("fail");
        addTerminalLog(`[CRASH] Runtime execution fault: ${e.message}`, "error");
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const resetWorkspace = () => {
    playRetroSound("click");
    setUserCode(activeQuestion.defaultCode);
    const levelKey = `debug_the_bug_${selectedTrack.toLowerCase()}_level_${currentLevel}`;
    if (!completedLevels.includes(levelKey)) {
      setIsSuccess(false);
    }
    
    const codeKey = `${selectedTrack}_${currentLevel}_q${activeQuestion.id || currentQuestionIdx}`;
    const updated = { ...userCodes };
    delete updated[codeKey];
    setUserCodes(updated);
    try {
      localStorage.setItem("arcade_debug_bug_codes", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    addTerminalLog(`[SYSTEM] Code reverted to baseline initial commit.`, "system");
  };

  const reviveSystem = () => {
    playRetroSound("success");
    setLives(3);
    setIsDead(false);
    setUserCode(activeQuestion.defaultCode);
    
    const codeKey = `${selectedTrack}_${currentLevel}_q${activeQuestion.id || currentQuestionIdx}`;
    const updated = { ...userCodes };
    delete updated[codeKey];
    setUserCodes(updated);
    try {
      localStorage.setItem("arcade_debug_bug_codes", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    addTerminalLog(`[SYSTEM] Hearts restored. Diagnostic engines rebooted.`, "system");
  };

  const getLanguageColor = (lang) => {
    switch (lang.toLowerCase()) {
      case "javascript":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "python":
        return "text-neutral-400 bg-neutral-400/10 border-neutral-400/20";
      case "sql":
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      default:
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    }
  };

  const lineCount = userCode.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  if (phase === "lobby") {
    return (
      <div className="min-h-[70vh] w-full bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl overflow-hidden font-mono text-[var(--text-primary)] flex flex-col items-center justify-center p-8 md:p-12 text-center relative select-none">
        
        {loading ? (
          <div className="flex flex-col items-center gap-3 relative z-30">
            <RefreshCw size={24} className="animate-spin text-slate-400" />
            <p className="text-xs text-[var(--text-muted)] font-mono">Syncing debugger levels from database...</p>
          </div>
        ) : !selectedTrack ? (
          <>
            <div className="space-y-3 relative z-30">
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent-primary)] border border-[var(--border-primary)] bg-[var(--accent-glow)] px-3 py-1 rounded-full uppercase">
                Mode: Debug the Bug
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--accent-primary)] uppercase tracking-tight">
                Bug Hunter IDE
              </h2>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                Repair syntax, logical and runtime errors directly in an interactive code compiler. Select your track to launch!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl relative z-30 mt-8">
              {tracks.map((track) => {
                const totalLvs = getLevelsForTrack(track).length;
                return (
                  <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className="relative p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-center hover:scale-[1.03] transition-all cursor-pointer hover:border-[var(--accent-primary)] group overflow-hidden shadow-lg"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-glow)] rounded-full blur-2xl group-hover:opacity-80 transition-all" />
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Track</span>
                    <h4 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{track}</h4>
                    <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-[var(--text-muted)]">
                      <span>{totalLvs} Level{totalLvs > 1 ? 's' : ''}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mt-8 relative z-30"
              >
                <ArrowLeft size={14} /> Back to Hub Lobby
              </button>
            )}
          </>
        ) : (
          <>
            <div className="space-y-3 relative z-30">
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent-primary)] border border-[var(--border-primary)] bg-[var(--accent-glow)] px-3 py-1 rounded-full uppercase">
                Track: {selectedTrack}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--accent-primary)] uppercase tracking-tight">
                Select Level
              </h2>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                Solve files sequentially. Correct errors to compile successfully and unlock the next level!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg relative z-30 mt-8">
              {getLevelsForTrack(selectedTrack).map((lvl) => {
                const isUnlocked = lvl === 1 || (completedLevels || []).includes(`debug_the_bug_${selectedTrack.toLowerCase()}_level_${lvl - 1}`);
                const isCompleted = (completedLevels || []).includes(`debug_the_bug_${selectedTrack.toLowerCase()}_level_${lvl}`);
                return (
                  <button
                    key={lvl}
                    disabled={!isUnlocked}
                    onClick={() => handleLoadLevel(selectedTrack, lvl)}
                    className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isUnlocked
                        ? "bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:scale-105 cursor-pointer text-[var(--text-primary)]"
                        : "bg-[var(--bg-primary)] opacity-40 border-[var(--border-primary)] text-[var(--text-muted)] cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider mb-2">Lvl {lvl}</span>
                    {isCompleted ? (
                      <span className="text-[9px] font-bold text-[var(--accent-primary)] bg-[var(--accent-glow)] border border-[var(--border-primary)] px-2 py-0.5 rounded uppercase">Cleared</span>
                    ) : isUnlocked ? (
                      <span className="text-[9px] font-bold text-[var(--text-primary)] bg-[var(--bg-hover)] border border-[var(--border-primary)] px-2 py-0.5 rounded uppercase">Play</span>
                    ) : (
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Locked</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedTrack(null)}
              className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mt-8 relative z-30"
            >
              <ArrowLeft size={14} /> Back to Tracks Selection
            </button>
          </>
        )}
      </div>
    );
  }

  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl relative select-none">
        <h2 className="text-lg font-black text-[var(--text-primary)] relative z-30">No Question Loaded</h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed relative z-30">
          Select another track or level.
        </p>
        <button
          onClick={() => setPhase("lobby")}
          className="relative z-30 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] border border-[var(--border-primary)] hover:scale-102 transition-all cursor-pointer font-bold text-xs"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="text-[var(--text-primary)] bg-[var(--bg-card)] p-1 md:p-4 rounded-3xl border border-[var(--border-primary)] space-y-6 select-none shadow-2xl relative overflow-hidden">
      
      {/* Game Bar - Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPhase("lobby")}
            className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h2 className="text-md font-black font-display text-[var(--text-primary)] tracking-tight flex items-center gap-2 uppercase font-mono">
              Debug the Bug
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-extrabold bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-primary)]">
                v2.1
              </span>
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] font-sans">Solve code errors and compile successfully inside our sandbox IDE</p>
          </div>
        </div>

        {/* Lives, Streak, Audio controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Health indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] mr-1 uppercase">Health:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart 
                key={i} 
                size={14} 
                className={`${
                  i < lives 
                    ? "text-rose-500 fill-rose-500" 
                    : "text-slate-900 fill-transparent"
                } transition-all duration-300`} 
              />
            ))}
          </div>

          {/* Streak indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]">
            <Flame size={14} className="text-amber-500 fill-amber-500/10" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]/60 uppercase">Streak:</span>
            <span className="text-xs font-black text-amber-500">{streak}</span>
          </div>

          {/* Volume toggle */}
          <button 
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              playRetroSound("click");
            }}
            className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      {/* Grid selector of levels */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {getLevelsForTrack(selectedTrack).map((lvl) => {
          const isLvlCompleted = completedLevels.includes(`debug_the_bug_${selectedTrack.toLowerCase()}_level_${lvl}`);
          const isLvlActive = currentLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => {
                if (isDead) return;
                playRetroSound("click");
                handleLoadLevel(selectedTrack, lvl);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                isLvlActive
                  ? "bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[var(--accent-primary)] shadow-sm"
                  : isLvlCompleted
                  ? "bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-hover)]"
                  : "bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {isLvlCompleted ? <CheckCircle2 size={12} className="text-[var(--accent-primary)]" /> : null}
              <span>Level {lvl}</span>
            </button>
          );
        })}
      </div>

      {/* Play Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left pane: Instructions, Target details, Hints */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-start">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl p-5 md:p-6 space-y-5 shadow-md relative overflow-hidden">
            
            {/* Level Title banner */}
            <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Level {currentLevel} • File {currentQuestionIdx + 1} of {levelQuestions.length}
                </span>
                <h3 className="text-md font-bold font-mono text-[var(--text-primary)] tracking-tight">{activeQuestion.title}</h3>
              </div>
              <span className="text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                {activeQuestion.language}
              </span>
            </div>

            {/* Instruction description */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                <BookOpen size={15} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                <p>{activeQuestion.instructions}</p>
              </div>
            </div>

            {/* Hint Box (Dynamic Reveal) */}
            <div className="border-t border-[var(--border-primary)] pt-4 mt-auto">
              {showHint ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[11px] text-[var(--text-secondary)] leading-relaxed relative font-mono"
                >
                  <div className="font-bold flex items-center gap-1.5 uppercase font-mono mb-1 tracking-wider text-[var(--text-muted)] text-[9px]">
                    <Sparkles size={11} /> Hint Decrypted
                  </div>
                  <p>{activeQuestion.hint}</p>
                </motion.div>
              ) : (
                <button
                  onClick={() => {
                    playRetroSound("click");
                    setShowHint(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <HelpCircle size={13} />
                  <span>Decrypt Compiler Hint</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Bug Recovery Sandbox Reboot */}
          {isDead && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 flex flex-col items-center justify-center text-center space-y-4 shadow-md"
            >
              <AlertTriangle size={28} className="text-rose-500 animate-pulse" />
              <div>
                <h4 className="text-xs font-black uppercase text-rose-500 font-mono">Sandbox Defeated</h4>
                <p className="text-[11px] text-rose-500/70 leading-normal mt-1 max-w-[200px]">The compilation workspace has crashed due to health exhaustion.</p>
              </div>
              <button
                onClick={reviveSystem}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 font-mono"
              >
                <RotateCcw size={12} /> Reboot Compiler
              </button>
            </motion.div>
          )}
        </div>

        {/* Right pane: Code Editor terminal workspace */}
        <div className="lg:col-span-3">
          <div className="flex flex-col rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-md overflow-hidden min-h-[440px]">
            
            {/* Tab header bar */}
            <div className="bg-[var(--bg-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderOpen size={13} className="text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)] font-semibold font-mono">WORKSPACE:</span>
                <span className="text-[10px] px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold border border-[var(--border-primary)] rounded-md font-mono flex items-center gap-1">
                  <FileCode size={11} />
                  {activeQuestion.file}
                </span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[var(--border-primary)] ${getLanguageColor(activeQuestion.language)} font-mono`}>
                {activeQuestion.language}
              </span>
            </div>

            {/* Simulated code editor wrapper */}
            <div className="flex-grow flex relative font-mono text-sm leading-6">
              
              {/* Line numbers column */}
              <div className="w-10 shrink-0 text-right pr-3 select-none text-[10px] text-[var(--text-muted)]/40 border-r border-[var(--border-primary)]/50 py-4 bg-[var(--bg-primary)] font-mono leading-6">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Editable Textarea overlaying formatted display */}
              <textarea
                ref={editorRef}
                value={userCode}
                onChange={(e) => {
                  if (!isDead && !isSuccess) {
                    const val = e.target.value;
                    setUserCode(val);
                    const codeKey = `${selectedTrack}_${currentLevel}_q${activeQuestion.id || currentQuestionIdx}`;
                    const updated = { ...userCodes, [codeKey]: val };
                    setUserCodes(updated);
                    try {
                      localStorage.setItem("arcade_debug_bug_codes", JSON.stringify(updated));
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
                onKeyDown={handleKeyDown}
                disabled={isDead || isSuccess}
                className="flex-grow p-4 bg-transparent text-[var(--text-primary)] font-mono outline-none border-none resize-none leading-6 scrollbar-thin whitespace-pre focus:ring-0 select-text"
                spellCheck="false"
                style={{
                  minHeight: "220px",
                  caretColor: "var(--accent-primary)"
                }}
              />
            </div>

            {/* Simulated compiler logs screen */}
            <div className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)] p-4 font-mono text-[11px] space-y-2 h-[120px] overflow-y-auto scrollbar-thin flex flex-col justify-start">
              <div className="flex items-center space-x-1.5 text-[var(--text-muted)]/40 border-b border-[var(--border-primary)] pb-1.5 mb-1.5 uppercase font-bold text-[9px] tracking-wide">
                <TerminalIcon size={12} />
                <span>Compiler Diagnostic Logs</span>
              </div>
              {terminalLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed ${
                    log.type === "system" 
                      ? "text-[var(--text-muted)]/40" 
                      : log.type === "success" 
                      ? "text-emerald-500 font-bold" 
                      : log.type === "error" 
                      ? "text-red-500 underline font-bold" 
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>

            {/* Action Bar controls */}
            <div className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={resetWorkspace}
                  disabled={isDead || isSuccess || isRunning}
                  className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 font-mono"
                >
                  <RefreshCw size={12} />
                  <span>Reset Commit</span>
                </button>
              </div>

              <div className="flex gap-2">
                {isSuccess ? (
                  (() => {
                    const isLastQuestion = currentQuestionIdx === levelQuestions.length - 1;
                    if (!isLastQuestion) {
                      return (
                        <button
                          onClick={() => {
                            playRetroSound("click");
                            handleNextQuestion();
                          }}
                          className="px-4 py-2 rounded-xl text-xs text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:opacity-95 hover:scale-102 transition-all cursor-pointer font-bold flex items-center gap-1.5 font-mono shadow-md"
                        >
                          <span>Next File / Question</span>
                          <ArrowRight size={13} />
                        </button>
                      );
                    }

                    const nextLvl = currentLevel + 1;
                    const trackLevels = getLevelsForTrack(selectedTrack);
                    const hasNextLvl = trackLevels.includes(nextLvl);
                    if (hasNextLvl) {
                      return (
                        <button
                          onClick={() => {
                            playRetroSound("click");
                            handleLoadLevel(selectedTrack, nextLvl);
                          }}
                          className="px-4 py-2 rounded-xl text-xs text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:opacity-95 hover:scale-102 transition-all cursor-pointer font-bold flex items-center gap-1.5 font-mono shadow-md"
                        >
                          <span>Proceed to Level {nextLvl}</span>
                          <ArrowRight size={13} />
                        </button>
                      );
                    }
                    return (
                      <div className="px-4 py-2 rounded-xl text-xs text-[var(--accent-primary)] bg-[var(--accent-glow)] border border-[var(--border-primary)] font-bold flex items-center gap-1.5 font-mono">
                        <ShieldCheck size={13} />
                        <span>Code Master Confirmed!</span>
                      </div>
                    );
                  })()
                ) : (
                  <button
                    onClick={runCodeTests}
                    disabled={isDead || isRunning}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:opacity-95 hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5 font-mono shadow-md"
                  >
                    {isRunning ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Play size={13} className="fill-[var(--text-on-accent)] text-[var(--text-on-accent)]" />
                    )}
                    <span>Run Test Cases</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
