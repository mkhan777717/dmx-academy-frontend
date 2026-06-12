"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, CheckCircle, Circle, Search, ArrowLeft, ArrowRight, 
  Menu, X, Sparkles, Glossary, HelpCircle, ChevronRight, Award,
  ExternalLink, FileText, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allPhases, resourcesList, glossary } from "@/data/courses/genai/resources";
import { PromptPlayground, TokenVisualizer, ClassifierSandbox } from "@/components/courses/Widgets";

export default function GenAICoursePage() {
  const [activeTab, setActiveTab] = useState("curriculum"); // "curriculum" | "glossary" | "resources"
  
  // Track indexes for active module and lesson
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mobile sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Progress tracker state
  const [completedLessons, setCompletedLessons] = useState([]);

  // Flat list of all lessons for easier indexing and prev/next logic
  const [flatLessons, setFlatLessons] = useState([]);
  
  const contentRef = useRef(null);

  // Parse and build flat list of lessons once
  useEffect(() => {
    const list = [];
    allPhases.forEach((p, pIdx) => {
      p.modules.forEach((m, mIdx) => {
        m.lessons.forEach((l, lIdx) => {
          list.push({
            id: l.id,
            title: l.title,
            phaseTitle: p.title,
            moduleTitle: m.title,
            moduleIdx: list.length === 0 ? 0 : null, // placeholders for index mapping
            lIdx: lIdx,
            mIndexInAll: allPhases.slice(0, pIdx).reduce((acc, curr) => acc + curr.modules.length, 0) + mIdx,
            lIndexInM: lIdx
          });
        });
      });
    });
    setFlatLessons(list);
  }, []);

  // Load progress on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("genai_course_progress");
      if (saved) {
        try {
          setCompletedLessons(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Sync state coordinates to URL search parameters to support bookmarking/deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mParam = parseInt(params.get("m"));
    const lParam = parseInt(params.get("l"));

    let targetM = 0;
    let targetL = 0;
    
    // Validate module index
    let totalModules = 0;
    allPhases.forEach(p => { totalModules += p.modules.length; });

    if (!isNaN(mParam) && mParam >= 0 && mParam < totalModules) {
      targetM = mParam;
    }
    
    // Resolve module object
    let currentModule = null;
    let tempMIdx = 0;
    for (let p = 0; p < allPhases.length; p++) {
      for (let m = 0; m < allPhases[p].modules.length; m++) {
        if (tempMIdx === targetM) {
          currentModule = allPhases[p].modules[m];
          break;
        }
        tempMIdx++;
      }
      if (currentModule) break;
    }

    if (currentModule && !isNaN(lParam) && lParam >= 0 && lParam < currentModule.lessons.length) {
      targetL = lParam;
    }

    setActiveModuleIdx(targetM);
    setActiveLessonIdx(targetL);
  }, []);

  // Scroll to top when active lesson changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeModuleIdx, activeLessonIdx]);

  // Set active lesson helper
  const selectLesson = (mIdx, lIdx) => {
    setActiveModuleIdx(mIdx);
    setActiveLessonIdx(lIdx);
    setActiveTab("curriculum");
    setIsSidebarOpen(false);
    
    // Update URL history parameters
    const params = new URLSearchParams();
    params.set("m", mIdx);
    params.set("l", lIdx);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  // Toggle lesson complete state
  const toggleComplete = (lessonId) => {
    let updated;
    if (completedLessons.includes(lessonId)) {
      updated = completedLessons.filter(id => id !== lessonId);
    } else {
      updated = [...completedLessons, lessonId];
    }
    setCompletedLessons(updated);
    localStorage.setItem("genai_course_progress", JSON.stringify(updated));
  };

  // Resolve current active lesson details
  let activePhase = null;
  let activeModule = null;
  let activeLesson = null;
  
  let currentGlobalModuleIdx = 0;
  for (let p = 0; p < allPhases.length; p++) {
    for (let m = 0; m < allPhases[p].modules.length; m++) {
      if (currentGlobalModuleIdx === activeModuleIdx) {
        activePhase = allPhases[p];
        activeModule = allPhases[p].modules[m];
        activeLesson = allPhases[p].modules[m].lessons[activeLessonIdx];
        break;
      }
      currentGlobalModuleIdx++;
    }
    if (activeLesson) break;
  }

  // Count total lessons
  const totalLessonsCount = flatLessons.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons.length / totalLessonsCount) * 100) : 0;

  // Resolve Next and Prev lesson targets
  const handlePrev = () => {
    if (flatLessons.length === 0 || !activeLesson) return;
    const currentFlatIdx = flatLessons.findIndex(l => l.id === activeLesson.id);
    if (currentFlatIdx > 0) {
      const prev = flatLessons[currentFlatIdx - 1];
      selectLesson(prev.mIndexInAll, prev.lIndexInM);
    }
  };

  const handleNext = () => {
    if (flatLessons.length === 0 || !activeLesson) return;
    const currentFlatIdx = flatLessons.findIndex(l => l.id === activeLesson.id);
    if (currentFlatIdx < flatLessons.length - 1) {
      const next = flatLessons[currentFlatIdx + 1];
      selectLesson(next.mIndexInAll, next.lIndexInM);
    }
  };

  const hasPrev = () => {
    if (flatLessons.length === 0 || !activeLesson) return false;
    return flatLessons.findIndex(l => l.id === activeLesson.id) > 0;
  };

  const hasNext = () => {
    if (flatLessons.length === 0 || !activeLesson) return false;
    return flatLessons.findIndex(l => l.id === activeLesson.id) < flatLessons.length - 1;
  };

  // Helper to parse inline styles (like backticks for code tags and double asterisks for bold text)
  const parseInlineStyles = (rawText) => {
    if (!rawText) return "";
    
    // Split on backticks first to extract inline code
    const parts = rawText.split(/`([^`]+)`/g);
    return parts.flatMap((part, index) => {
      if (index % 2 === 1) {
        return (
          <code key={`code-${index}`} className="rounded px-1.5 py-0.5 font-mono text-[11px] mx-0.5 whitespace-nowrap" style={{ backgroundColor: "var(--bg-code)", border: "1px solid var(--border-primary)", color: "var(--text-accent)" }}>
            {part}
          </code>
        );
      }
      
      // For non-code segments, parse **bold** text
      const boldParts = part.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((subPart, subIndex) => {
        if (subIndex % 2 === 1) {
          return (
            <strong key={`bold-${index}-${subIndex}`} className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {subPart}
            </strong>
          );
        }
        return subPart;
      });
    });
  };

  // Custom text formatter parsing ### headers, lists, code panels, and tables
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements = [];
    
    let currentBlockType = null; // null | "paragraph" | "list" | "code" | "table" | "note"
    let currentBlockLines = [];

    const flushBlock = (nextKey) => {
      if (currentBlockLines.length === 0) return;

      const blockText = currentBlockLines.join("\n").trim();
      if (!blockText) {
        currentBlockLines = [];
        return;
      }

      if (currentBlockType === "paragraph") {
        elements.push(
          <p key={nextKey} className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
            {parseInlineStyles(blockText)}
          </p>
        );
      } else if (currentBlockType === "note") {
        elements.push(
          <div key={nextKey} className="my-6 rounded-r-xl border-l-4 border-l-amber-500 p-5 shadow-sm text-sm leading-relaxed" style={{ backgroundColor: "var(--note-bg)", color: "var(--note-text)" }}>
            {parseInlineStyles(blockText)}
          </div>
        );
      } else if (currentBlockType === "list") {
        elements.push(
          <div key={nextKey} className="my-5 space-y-2.5 pl-1">
            {currentBlockLines.map((line, lIdx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;

              const leadingSpaces = line.search(/\S/);
              const isSubItem = leadingSpaces > 2;

              if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
                const cleanLine = trimmedLine.replace(/^[\*\-]\s+/, "");
                return (
                  <div 
                    key={lIdx} 
                    className="flex items-start text-sm leading-relaxed"
                    style={{ color: isSubItem ? "var(--text-muted)" : "var(--text-secondary)", paddingLeft: isSubItem ? "1.5rem" : "0.25rem", marginTop: isSubItem ? "0.25rem" : 0, fontSize: isSubItem ? "13px" : undefined }}
                  >
                    <span className="mr-2 font-bold select-none" style={{ color: "var(--accent-primary)" }}>•</span>
                    <span className="flex-1">{parseInlineStyles(cleanLine)}</span>
                  </div>
                );
              }

              const numberMatch = trimmedLine.match(/^(\d+)\.\s+/);
              if (numberMatch) {
                const cleanLine = trimmedLine.replace(/^\d+\.\s+/, "");
                return (
                  <div 
                    key={lIdx} 
                    className="flex items-start text-sm leading-relaxed"
                    style={{ color: isSubItem ? "var(--text-muted)" : "var(--text-secondary)", paddingLeft: isSubItem ? "1.5rem" : "0.25rem", marginTop: isSubItem ? "0.25rem" : 0, fontSize: isSubItem ? "13px" : undefined }}
                  >
                    <span className="mr-2.5 font-bold select-none" style={{ color: "var(--text-accent)" }}>{numberMatch[1]}.</span>
                    <span className="flex-1">{parseInlineStyles(cleanLine)}</span>
                  </div>
                );
              }

              return (
                <div 
                  key={lIdx} 
                  className="text-sm leading-relaxed"
                  style={{ color: isSubItem ? "var(--text-muted)" : "var(--text-secondary)", paddingLeft: isSubItem ? "1.5rem" : "1.25rem", marginTop: "0.25rem", fontSize: isSubItem ? "13px" : undefined }}
                >
                  {parseInlineStyles(trimmedLine)}
                </div>
              );
            })}
          </div>
        );
      } else if (currentBlockType === "code") {
        const codeText = currentBlockLines.join("\n");
        elements.push(
          <div key={nextKey} className="my-6 rounded-xl p-4 shadow-sm border-l-4 border-l-emerald-500" style={{ backgroundColor: "var(--bg-code)", border: "1px solid var(--border-primary)" }}>
            <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "1px solid var(--border-primary)" }}>
              <span className="text-xs font-semibold tracking-wider font-sans capitalize" style={{ color: "var(--text-muted)" }}>Example Code</span>
              <button 
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="rounded px-2.5 py-1 text-[10px] font-semibold transition-colors"
                style={{ backgroundColor: "var(--bg-badge)", border: "1px solid var(--border-accent)", color: "var(--text-accent)" }}
              >
                Copy Code
              </button>
            </div>
            <div className="rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-primary)" }}>
              <pre className="font-mono text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
                <code>{codeText}</code>
              </pre>
            </div>
          </div>
        );
      } else if (currentBlockType === "table") {
        const rows = currentBlockLines.map(r => r.split("|").map(c => c.trim()).filter(c => c !== ""));
        const headers = rows[0] || [];
        const bodyRows = rows.slice(2); // Skip separator row

        elements.push(
          <div key={nextKey} className="overflow-x-auto my-5 rounded-xl shadow-sm" style={{ border: "1px solid var(--border-primary)" }}>
            <table className="min-w-full text-left text-xs" style={{ borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}>
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-semibold" style={{ borderBottom: "1px solid var(--border-primary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)" }}>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: "1px solid var(--border-primary)" }}>
                    {row.map((val, vIdx) => (
                      <td key={vIdx} className="px-4 py-3 leading-relaxed">{parseInlineStyles(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      currentBlockLines = [];
      currentBlockType = null;
    };

    let inCodeFence = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Handle Code Fences
      if (trimmedLine.startsWith("@@@") || trimmedLine.startsWith("```")) {
        if (inCodeFence) {
          inCodeFence = false;
          flushBlock(`block-${i}`);
        } else {
          flushBlock(`block-${i}`);
          inCodeFence = true;
          currentBlockType = "code";
        }
        continue;
      }

      if (inCodeFence) {
        currentBlockLines.push(line);
        continue;
      }

      // Handle Headers
      if (trimmedLine.startsWith("### ")) {
        flushBlock(`block-${i}`);
        elements.push(
          <h3 key={`h3-${i}`} className="text-2xl font-bold font-display mt-8 mb-4 pb-2" style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border-primary)" }}>
            {trimmedLine.replace("### ", "")}
          </h3>
        );
        continue;
      }

      if (trimmedLine.startsWith("#### ")) {
        flushBlock(`block-${i}`);
        elements.push(
          <h4 key={`h4-${i}`} className="text-base font-bold font-display mt-6 mb-3 tracking-normal normal-case" style={{ color: "var(--text-primary)" }}>
            {trimmedLine.replace("#### ", "")}
          </h4>
        );
        continue;
      }

      // Handle Empty lines
      if (!trimmedLine) {
        if (currentBlockType === "paragraph" || currentBlockType === "note") {
          flushBlock(`block-${i}`);
        }
        continue;
      }

      // Handle list items
      const isListItem = trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ") || /^\d+\.\s+/.test(trimmedLine);
      if (isListItem) {
        if (currentBlockType !== "list") {
          flushBlock(`block-${i}`);
          currentBlockType = "list";
        }
        currentBlockLines.push(line);
        continue;
      }

      // Handle table rows
      if (trimmedLine.startsWith("|")) {
        if (currentBlockType !== "table") {
          flushBlock(`block-${i}`);
          currentBlockType = "table";
        }
        currentBlockLines.push(trimmedLine);
        continue;
      }

      // Handle Notes / Alerts
      const isNoteLine = 
        trimmedLine.startsWith("Important:") ||
        trimmedLine.startsWith("Note:") ||
        trimmedLine.startsWith("Warning:") ||
        trimmedLine.startsWith("Analogy:") ||
        trimmedLine.startsWith("Key Concepts") ||
        trimmedLine.startsWith("Key insight:");

      if (isNoteLine) {
        flushBlock(`block-${i}`);
        currentBlockType = "note";
        currentBlockLines.push(trimmedLine);
        continue;
      }

      // Otherwise, it is a paragraph line
      if (currentBlockType !== "paragraph") {
        flushBlock(`block-${i}`);
        currentBlockType = "paragraph";
      }
      currentBlockLines.push(trimmedLine);
    }

    flushBlock(`block-final`);

    return elements;
  };

  // Helper checking if a widget should render for specific lesson IDs
  const renderLessonWidget = (lessonId) => {
    if (!lessonId) return null;
    
    // Supervised Learning / How Machines Learn
    if (lessonId === "l-2-1" || lessonId === "l-2-2") {
      return (
        <div className="my-8">
          <ClassifierSandbox />
        </div>
      );
    }
    
    // Tokenization
    if (lessonId === "l-3-3" || lessonId === "l-5-1") {
      return (
        <div className="my-8">
          <TokenVisualizer />
        </div>
      );
    }
    
    // Prompting Sandbox
    if (lessonId === "l-6-8" || lessonId === "l-6-1") {
      return (
        <div className="my-8">
          <PromptPlayground />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r shadow-xl transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-0 -translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border-primary)" }}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-5" style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <a href="/" className="flex items-center space-x-2 text-lg font-bold font-display" style={{ color: "var(--text-primary)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md" style={{ background: "var(--accent-gradient)" }}>
              <Sparkles size={16} />
            </div>
            <span>Synapse Academy</span>
          </a>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Progress Indicators */}
        <div className="px-5 py-4 space-y-2" style={{ borderBottom: "1px solid var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            <span>Course Progress</span>
            <span>{completedLessons.length} / {totalLessonsCount} Lessons ({progressPercent}%)</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-primary)" }}>
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex px-4 py-2 gap-1 text-xs font-semibold" style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <button
            onClick={() => { setActiveTab("curriculum"); setSearchQuery(""); }}
            className="flex-1 py-2 rounded-lg text-center transition-colors"
            style={activeTab === "curriculum" ? { backgroundColor: "var(--bg-badge)", color: "var(--text-accent)" } : { color: "var(--text-muted)" }}
          >
            Syllabus
          </button>
          <button
            onClick={() => { setActiveTab("glossary"); setSearchQuery(""); }}
            className="flex-1 py-2 rounded-lg text-center transition-colors"
            style={activeTab === "glossary" ? { backgroundColor: "var(--bg-badge)", color: "var(--text-accent)" } : { color: "var(--text-muted)" }}
          >
            Glossary
          </button>
          <button
            onClick={() => { setActiveTab("resources"); setSearchQuery(""); }}
            className="flex-1 py-2 rounded-lg text-center transition-colors"
            style={activeTab === "resources" ? { backgroundColor: "var(--bg-badge)", color: "var(--text-accent)" } : { color: "var(--text-muted)" }}
          >
            Resources
          </button>
        </div>

        {/* Search Input bar */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={
                activeTab === "curriculum" 
                  ? "Search topics..." 
                  : activeTab === "glossary" 
                    ? "Search keywords..." 
                    : "Search resources..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Collapsible Syllabus/Glossary List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          
          {/* CURRICULUM DISPLAY */}
          {activeTab === "curriculum" && (() => {
            let globalMIndex = 0;
            return allPhases.map((phase, pIdx) => {
              // Check if search matches any lesson inside this phase
              const filteredModules = phase.modules.map(module => {
                const matchedLessons = module.lessons.filter(lesson => 
                  lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  lesson.summary.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return { ...module, matchedLessons };
              }).filter(m => searchQuery === "" || m.matchedLessons.length > 0);

              if (searchQuery !== "" && filteredModules.length === 0) return null;

              return (
                <div key={phase.id} className="space-y-2.5 border-b border-slate-100 pb-3 last:border-0">
                  <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 px-2 capitalize">
                    {phase.title}
                  </h4>
                  
                  <div className="space-y-1.5">
                    {phase.modules.map((module, mIdx) => {
                      const modIndex = globalMIndex;
                      globalMIndex++; // increment global indexing

                      const matchedLessons = module.lessons.filter(lesson => 
                        searchQuery === "" ||
                        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase())
                      );

                      if (searchQuery !== "" && matchedLessons.length === 0) return null;

                      const isCurrentModule = activeModuleIdx === modIndex;

                      return (
                        <div key={module.id} className="space-y-1 rounded-xl p-1.5" style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)" }}>
                          <button 
                            onClick={() => selectLesson(modIndex, 0)}
                            className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-bold transition-all"
                            style={isCurrentModule
                              ? { backgroundColor: "var(--bg-card)", color: "var(--text-accent)", border: "1px solid var(--border-accent)" }
                              : { color: "var(--text-primary)" }
                            }
                          >
                            <span className="truncate">{module.title.split(": ")[1]}</span>
                            <span className="text-[10px] font-semibold capitalize shrink-0" style={{ color: "var(--text-muted)" }}>{module.duration}</span>
                          </button>

                          {/* Lessons inside Module */}
                          <ul className="space-y-0.5 pl-1.5 pr-1.5 pb-1 pt-1">
                            {module.lessons.map((lesson, lIdx) => {
                              const isMatched = searchQuery === "" || 
                                lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());

                              if (!isMatched) return null;

                              const isCurrentLesson = activeModuleIdx === modIndex && activeLessonIdx === lIdx;
                              const isCompleted = completedLessons.includes(lesson.id);

                              return (
                                <li key={lesson.id}>
                                  <button
                                    onClick={() => selectLesson(modIndex, lIdx)}
                                    className="flex w-full items-center space-x-2 px-2.5 py-1.5 rounded-md text-left text-[11px] font-semibold transition-all"
                                    style={isCurrentLesson
                                      ? { background: "var(--accent-primary)", color: "#ffffff" }
                                      : { color: "var(--text-secondary)" }
                                    }
                                  >
                                    <span className="shrink-0">
                                      {isCompleted ? (
                                        <CheckCircle size={12} style={{ color: isCurrentLesson ? "#ffffff" : "var(--text-accent)" }} />
                                      ) : (
                                        <Circle size={12} style={{ color: "var(--text-muted)" }} />
                                      )}
                                    </span>
                                    <span className="truncate">{lesson.title}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}

          {/* GLOSSARY DISPLAY */}
          {activeTab === "glossary" && (() => {
            const filteredGlossary = glossary.filter(g =>
              g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
              g.def.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <div className="space-y-3 px-2">
                {filteredGlossary.length === 0 ? (
                  <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>No terms matched your search.</p>
                ) : (
                  filteredGlossary.map((g, idx) => (
                    <div key={idx} className="space-y-1 p-2 rounded-lg transition-colors" style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)" }}>
                      <h5 className="text-xs font-bold" style={{ color: "var(--text-accent)" }}>{g.term}</h5>
                      <p className="text-[10px] leading-normal" style={{ color: "var(--text-secondary)" }}>{g.def}</p>
                    </div>
                  ))
                )}
              </div>
            );
          })()}

          {/* RESOURCES DISPLAY */}
          {activeTab === "resources" && (() => {
            return resourcesList.map((res, rIdx) => {
              const filteredItems = res.items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (searchQuery !== "" && filteredItems.length === 0) return null;

              return (
                <div key={rIdx} className="space-y-2 pb-3">
                  <h5 className="text-[11px] font-semibold capitalize tracking-wider px-2" style={{ color: "var(--text-muted)" }}>
                    {res.category}
                  </h5>
                  <div className="space-y-1.5">
                    {(searchQuery !== "" ? filteredItems : res.items).map((item, idx) => (
                      <a
                        key={idx}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-2 rounded-lg transition-all group"
                        style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)" }}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold transition-colors" style={{ color: "var(--text-primary)" }}>
                            {item.name}
                          </span>
                          <ExternalLink size={10} style={{ color: "var(--text-muted)" }} />
                        </div>
                        <p className="text-[10px] leading-normal" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              );
            });
          })()}

        </div>

        {/* Sidebar Footer Link to Home */}
        <div className="p-4" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <a
            href="/"
            className="flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-semibold transition-colors shadow-sm"
            style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={12} />
            <span>Return to Landing Page</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Mobile Navbar Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-5 shadow-sm md:hidden" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <Menu size={22} />
            </button>
            <span className="font-bold text-sm font-display" style={{ color: "var(--text-primary)" }}>Gen AI Course</span>
          </div>
          <div className="h-2 w-24 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-primary)" }}>
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </header>

        {/* Main Tutorial Reader Panel */}
        <main ref={contentRef} className="flex-grow overflow-y-auto px-4 py-8 md:px-12 md:py-12" style={{ backgroundColor: "var(--bg-card)" }}>
          <div className="mx-auto max-w-3xl space-y-8">
            
            <AnimatePresence mode="wait">
              {activeTab === "curriculum" && activeLesson ? (
                <motion.div
                  key={`lesson-${activeLesson.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {/* Lesson Context Header */}
                  <div className="space-y-4">
                    {/* Category Path Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold capitalize tracking-wider" style={{ color: "var(--text-muted)" }}>
                      <span>{activePhase?.title.split(": ")[0]}</span>
                      <ChevronRight size={10} />
                      <span style={{ color: "var(--text-accent)" }}>{activeModule?.title.split(": ")[0]}</span>
                    </div>

                    {/* Lesson title */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
                        {activeLesson.title}
                      </h1>

                      {/* Meta info tags */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "var(--bg-badge)", border: "1px solid var(--border-accent)", color: "var(--text-accent)" }}>
                          {activeLesson.time}
                        </span>
                        <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}>
                          {activeModule?.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Checkbox Action Banner */}
                  <div className="flex items-center justify-between rounded-xl p-4" style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)" }}>
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Done studying this concept?</div>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Tick off this lesson to save progress and update the global tracker.</p>
                    </div>
                    <button
                      onClick={() => toggleComplete(activeLesson.id)}
                      className="flex items-center space-x-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all"
                      style={completedLessons.includes(activeLesson.id)
                        ? { backgroundColor: "var(--bg-badge)", color: "var(--text-accent)", border: "1px solid var(--border-accent)" }
                        : { backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }
                      }
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {completedLessons.includes(activeLesson.id) ? (
                          <motion.span
                            key="completed"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center space-x-1.5"
                          >
                            <CheckCircle size={14} style={{ color: "var(--text-accent)" }} />
                            <span>Completed!</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="incomplete"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center space-x-1.5"
                          >
                            <Circle size={14} style={{ color: "var(--text-muted)" }} />
                            <span>Mark Completed</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  {/* Parsed Lesson Tutorial Content */}
                  <article className="prose prose-slate max-w-none">
                    {renderFormattedText(activeLesson.content)}
                  </article>

                  {/* Injected Interactive Widget (if matched) */}
                  {renderLessonWidget(activeLesson.id)}

                  {/* Practice Exercise Highlight Panel */}
                  {activeLesson.exercise && (
                    <div className="rounded-xl p-5 space-y-3" style={{ border: "1px solid var(--border-accent)", backgroundColor: "var(--bg-badge)" }}>
                      <div className="flex items-center space-x-1.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-accent)" }}>
                          <Award size={14} />
                        </div>
                        <h4 className="font-bold font-display text-sm" style={{ color: "var(--text-primary)" }}>Practice Challenge</h4>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {activeLesson.exercise}
                      </p>
                    </div>
                  )}

                  {/* Nav buttons for Prev / Next Lesson */}
                  <div className="flex items-center justify-between pt-8 mt-12 gap-4" style={{ borderTop: "1px solid var(--border-primary)" }}>
                    <button
                      onClick={handlePrev}
                      disabled={!hasPrev()}
                      className="flex items-center space-x-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}
                    >
                      <ArrowLeft size={14} />
                      <span>Previous Lesson</span>
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!hasNext()}
                      className="flex items-center space-x-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "var(--accent-gradient)" }}
                    >
                      <span>Next Lesson</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : activeTab === "glossary" ? (
                // FULL GLOSSARY TAB
                <motion.div
                  key="glossary"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6 pt-4"
                >
                  <div className="space-y-2">
                    <h1 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                      Course Glossary of Key Terms
                    </h1>
                    <p className="text-sm text-slate-500 leading-normal">
                      Quickly look up key acronyms and terms mentioned throughout the Generative AI curriculum.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    {glossary.map((g, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-sm text-indigo-700 mb-1">{g.term}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{g.def}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // FULL RESOURCES TAB
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6 pt-4"
                >
                  <div className="space-y-2">
                    <h1 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                      Recommended Study Resources
                    </h1>
                    <p className="text-sm text-slate-500 leading-normal">
                      Free online resources, reference guides, tools, and newsletters to support your Generative AI learning pathway.
                    </p>
                  </div>

                  <div className="space-y-8 pt-4">
                    {resourcesList.map((cat, cIdx) => (
                      <div key={cIdx} className="space-y-3">
                        <h3 className="text-xs font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 capitalize font-sans">
                          {cat.category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.items.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                  <span>{item.name}</span>
                                  <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-400" />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                              <span className="text-[10px] text-indigo-600 font-semibold mt-4 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                                <span>Access Resource</span>
                                <ChevronRight size={10} />
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>

    </div>
  );
}
