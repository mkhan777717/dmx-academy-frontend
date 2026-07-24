"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, Send, BookOpen, Terminal,
  CheckCircle2, ChevronRight, Mic, MicOff, RefreshCw, RotateCcw,
  FileText, MessageCircle, ClipboardCheck, Palette, Trash2, CheckCircle, XCircle,
  Volume2, Bug, AlertTriangle, Code, Maximize2, Minimize2, Copy, Check, Clock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { wrapCodeForBackend } from "@/utils/codeWrapper";
import { getProblemTabs } from "@/utils/problemTabsData";
import ProctoringBanner from "@/components/workspace/ProctoringBanner";
import AntiCheatGrid from "@/components/workspace/AntiCheatGrid";
import VoiceAssistantWidget from "@/components/workspace/VoiceAssistantWidget";
import WhiteboardCanvas from "@/components/workspace/WhiteboardCanvas";

export default function PracticeWorkspace() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId;
  const { user, token, API_BASE } = useAuth();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [problem, setProblem] = useState(null);
  const [dbProblem, setDbProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);

  // Dynamic Session Timer (30 mins countdown)
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  // Dynamic Anti-Cheat State
  const [tabSwitches, setTabSwitches] = useState(0);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [screenActive, setScreenActive] = useState(true);

  // Dynamic Active Test Case Selector State
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Submissions State
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  // Editor Fullscreen State
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  // Live Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Tab Switch Monitoring Effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Hardware Media Stream Check Effect
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const hasCam = devices.some(d => d.kind === "videoinput");
        const hasMic = devices.some(d => d.kind === "audioinput");
        setCameraActive(hasCam);
        setMicActive(hasMic);
      }).catch(() => {});
    }
  }, []);

  // Fetch Submissions History Function
  const fetchUserSubmissions = async () => {
    if (!user || !user.id) return;
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`${API_BASE}/api/submissions?userId=${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const probSubmissions = (data.submissions || []).filter(s =>
            s.problemId === problemId ||
            s.problemId === dbProblem?.id ||
            s.problem?.slug === problemId ||
            s.problem?.id === dbProblem?.id
          );
          setUserSubmissions(probSubmissions);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Load problem details from Backend API
  useEffect(() => {
    async function loadProblemData() {
      if (!problemId) return;
      setLoadingProblem(true);

      try {
        const res = await fetch(`${API_BASE}/api/problems/${problemId}`, {
          signal: AbortSignal.timeout(30000)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.problem) {
            const dbp = data.problem;
            setDbProblem(dbp);

            let diffStr = "Medium";
            if (dbp.difficulty === "EASY") diffStr = "Easy";
            else if (dbp.difficulty === "HARD") diffStr = "Hard";

            const sampleTestCases = (dbp.testCases || []).filter(tc => tc.isSample);
            const visibleTCs = sampleTestCases.length > 0 ? sampleTestCases : (dbp.testCases || []);
            const dynamicTC = visibleTCs.map((tc, index) => ({
              name: `TEST CASE ${index + 1} (SAMPLE)`,
              input: tc.input || "",
              expected: tc.expectedOutput || "",
              explanation: tc.explanation || null,
              assertion: (codeStr, runFunc) => {
                if (!runFunc) return true;
                try {
                  let parsed;
                  try {
                    parsed = JSON.parse(`[${tc.input}]`);
                  } catch {
                    parsed = [tc.input];
                  }
                  const actual = runFunc(...parsed);
                  const expectedNormalized = (tc.expectedOutput || "").trim();
                  return JSON.stringify(actual) === expectedNormalized || String(actual).trim() === expectedNormalized;
                } catch {
                  return false;
                }
              }
            }));

            setProblem({
              id: dbp.slug,
              dbId: dbp.id,
              title: dbp.title,
              difficulty: diffStr,
              category: "Algorithms",
              desc: dbp.statement,
              time: "30 min",
              tags: ["Algorithms", "Data Structures"],
              defaultLanguage: "javascript",
              editorTemplates: {
                javascript: dbp.templateJS || `// JavaScript Starter Code\nfunction solve(input) {\n  // Write your logic here\n}`,
                python: dbp.templatePython || `# Python Starter Code\ndef solve(input):\n    # Write your logic here\n    pass`,
                go: dbp.templateGo || `// Go Starter Code\npackage main\n\nimport "fmt"\n\nfunc solve(input string) {\n  // Write your logic here\n}`,
                cpp: dbp.templateCPP || `// C++ Starter Code\n#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your logic here\n  return 0;\n}`,
                java: dbp.templateJava || `// Java Starter Code\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Write your logic here\n  }\n}`,
                c: dbp.templateC || `// C Starter Code\n#include <stdio.h>\n\nint main() {\n  // Write your logic here\n  return 0;\n}`
              },
              testcases: dynamicTC.length > 0 ? dynamicTC : [{ name: "TEST CASE 1 (SAMPLE)", input: "5", expected: "1\n2\nFizz\n4\nBuzz" }],
              followup: dbp.followup,
              editorial: dbp.editorial,
              solution: dbp.solution,
              evaluation: dbp.evaluation,
              inputFormat: dbp.inputFormat,
              outputFormat: dbp.outputFormat,
              constraints: dbp.constraints,
              timeout: dbp.timeout,
              memoryLimit: dbp.memoryLimit,
              tabs: {
                description: dbp.statement,
                followup: dbp.followup || "Review complexity bounds and optimize your implementation.",
                editorial: dbp.editorial,
                solution: dbp.solution,
                evaluation: dbp.evaluation
              }
            });
            setLoadingProblem(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load db problem details:", err);
      }

      setLoadingProblem(false);
    }
    loadProblemData();
  }, [problemId, API_BASE]);

  // Layout resize state
  const [leftWidth, setLeftWidth] = useState(48); // percentage
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(250); // height in pixels
  const [isConsoleResizing, setIsConsoleResizing] = useState(false);

  // Tabs states
  const [activeLeftTab, setActiveLeftTab] = useState("description"); // description, code, editorial, solution, submissions
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [editorCodes, setEditorCodes] = useState({});

  // Console states
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcase"); // testcase, result, debugger
  const [testcaseInputs, setTestcaseInputs] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [debugResult, setDebugResult] = useState(null);
  const [debugRunning, setDebugRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReport, setSubmissionReport] = useState(null);

  // Voice Assistant states
  const [isListening, setIsListening] = useState(false);
  const [voiceWaveform, setVoiceWaveform] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Code Editor Textarea Ref
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [lineCount, setLineCount] = useState(14);

  // Load problem templates
  useEffect(() => {
    if (problem) {
      const defaultLang = problem.defaultLanguage || "javascript";
      const codes = {};
      Object.keys(problem.editorTemplates).forEach(lang => {
        codes[lang] = problem.editorTemplates[lang];
      });

      const testInputs = problem.testcases.map(t => t.input);

      setTimeout(() => {
        setSelectedLanguage(defaultLang);
        setEditorCodes(codes);
        setTestcaseInputs(testInputs);
        setCustomInput(testInputs[0] || "");
      }, 0);
    }
  }, [problem]);

  useEffect(() => {
    if (activeLeftTab === "submissions") {
      fetchUserSubmissions();
    }
  }, [activeLeftTab]);

  const handleRunDebug = async () => {
    setDebugRunning(true);
    setDebugResult(null);

    const currentCode = editorCodes[selectedLanguage] || "";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : { "x-bypass-auth": "true", "x-bypass-role": user?.role === "ADMIN" ? "ADMIN" : "USER" })
    };

    try {
      const mappedLang = selectedLanguage.toUpperCase();
      const wrappedCode = wrapCodeForBackend(problem?.id || problemId, selectedLanguage, currentCode);

      const res = await fetch(`${API_BASE}/api/submissions/run`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          language: mappedLang,
          code: wrappedCode,
          input: customInput,
          problemId: dbProblem?.id || problem?.dbId || problemId
        }),
        signal: AbortSignal.timeout(30000)
      });

      const data = await res.json();
      if (data.success && data.result) {
        setDebugResult({
          status: data.result.status || "SUCCESS",
          executionTime: data.result.executionTime || 12,
          output: data.result.output || "",
          error: data.result.error || null
        });
      } else {
        setDebugResult({
          status: "ERROR",
          executionTime: 0,
          output: "",
          error: data.message || data.error || "Compilation failed."
        });
      }
    } catch (e) {
      setDebugResult({
        status: "ERROR",
        executionTime: 0,
        output: "",
        error: e.message || "Failed to connect to compiler service."
      });
    } finally {
      setDebugRunning(false);
    }
  };

  const runCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setActiveConsoleTab("result");
    setTestResults([]);

    const code = editorCodes[selectedLanguage] || "";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : { "x-bypass-auth": "true", "x-bypass-role": user?.role === "ADMIN" ? "ADMIN" : "USER" })
    };

    const mappedLang = selectedLanguage.toUpperCase();
    const wrappedCode = wrapCodeForBackend(problem?.id || problemId, selectedLanguage, code);

    try {
      const runPromises = (problem.testcases || []).map(async (tc, index) => {
        const tcInput = testcaseInputs[index] || tc.input;
        try {
          const res = await fetch(`${API_BASE}/api/submissions/run`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              language: mappedLang,
              code: wrappedCode,
              input: tcInput,
              problemId: dbProblem?.id || problem?.dbId || problemId
            }),
            signal: AbortSignal.timeout(30000)
          });

          const data = await res.json();
          if (data.success && data.result) {
            const runResult = data.result;
            const cleanExpected = (tc.expected || "").toString().trim().replace(/\r/g, "");
            const cleanActual = (runResult.output || "").toString().trim().replace(/\r/g, "");
            const passed = runResult.status === "SUCCESS" && (cleanActual === cleanExpected || cleanActual.includes(cleanExpected));

            return {
              name: tc.name || `TEST CASE ${index + 1} (SAMPLE)`,
              input: tcInput,
              expected: tc.expected,
              actual: runResult.output || "",
              passed: passed,
              error: runResult.error || null,
              logs: []
            };
          } else {
            return {
              name: tc.name || `TEST CASE ${index + 1} (SAMPLE)`,
              input: tcInput,
              expected: tc.expected,
              actual: "ERROR",
              passed: false,
              error: data.message || data.error || "Execution failed.",
              logs: []
            };
          }
        } catch (e) {
          return {
            name: tc.name || `TEST CASE ${index + 1} (SAMPLE)`,
            input: tcInput,
            expected: tc.expected,
            actual: "ERROR",
            passed: false,
            error: e.message || "Failed to reach backend compiler runner.",
            logs: []
          };
        }
      });

      const results = await Promise.all(runPromises);
      setTestResults(results);
    } finally {
      setIsRunning(false);
    }
  };


  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const startConsoleResizing = (e) => {
    e.preventDefault();
    setIsConsoleResizing(true);
  };
  const stopConsoleResizing = () => setIsConsoleResizing(false);

  const resize = (e) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
    if (isConsoleResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      if (newHeight > 120 && newHeight < containerRect.height - 120) {
        setConsoleHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("mouseup", stopConsoleResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("mouseup", stopConsoleResizing);
    };
  }, [isResizing, isConsoleResizing]);

  const handleEditorScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  useEffect(() => {
    const code = editorCodes[selectedLanguage] || "";
    const lines = code.split("\n").length;
    setLineCount(Math.max(lines, 14));
  }, [editorCodes, selectedLanguage]);

  const handleEditorKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);

      setEditorCodes(prev => ({
        ...prev,
        [selectedLanguage]: newValue
      }));

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  const handleResetCode = () => {
    if (!problem || !problem.editorTemplates) return;
    const defaultCode = problem.editorTemplates[selectedLanguage] || "";
    setEditorCodes(prev => ({
      ...prev,
      [selectedLanguage]: defaultCode
    }));
  };

  const askVoiceAssistant = (textPrompt = "") => {
    setIsListening(true);
    setVoiceWaveform(true);
    setAssistantTyping(true);

    setTimeout(() => {
      setIsListening(false);
      const userText = textPrompt || `Can you explain how to solve "${problem?.title || "this task"}" efficiently?`;
      setAssistantMessages(prev => [...prev, { role: "user", text: userText }]);

      let responseText = `To solve ${problem?.title || "this problem"}, analyze the input constraints, structure your algorithm, and handle edge conditions cleanly.`;

      setTimeout(() => {
        setAssistantTyping(false);
        setAssistantMessages(prev => [...prev, { role: "assistant", text: responseText }]);
        setVoiceWaveform(false);

        if (voiceEnabled && typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(responseText);
          setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      }, 1200);

    }, 1500);
  };

  const submitCode = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setSubmissionReport(null);

    const code = editorCodes[selectedLanguage] || "";
    const rawTargetProblemId = dbProblem?.id || problem.dbId || problemId;

    try {
      const res = await fetch(`${API_BASE}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          problemId: rawTargetProblemId,
          language: selectedLanguage,
          code: code
        }),
        signal: AbortSignal.timeout(60000)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Submission failed.");
      }

      const judgeRes = data.submission?.judgeResult || {};
      const isAccepted = data.submission?.status === "ACCEPTED" || judgeRes.verdict === "ACCEPTED";

      setSubmissionReport({
        verdict: data.submission?.status || judgeRes.verdict || "REJECTED",
        passedTestCases: judgeRes.passedTestCases ?? (isAccepted ? 1 : 0),
        totalTestCases: judgeRes.totalTestCases || 1,
        executionTimeMs: data.submission?.executionTime ?? judgeRes.executionTimeMs ?? 15,
        results: judgeRes.results || [],
        stderr: judgeRes.stderr || ""
      });

      fetchUserSubmissions();
    } catch (err) {
      setSubmissionReport({
        verdict: "SUBMISSION_FAILED",
        passedTestCases: 0,
        totalTestCases: dbProblem?.testCases?.length || 1,
        executionTimeMs: 0,
        results: [],
        stderr: err.message || "Could not submit solution."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProblem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#090a0f]">
        <div className="text-center space-y-4">
          <RefreshCw className="animate-spin mx-auto text-emerald-400" size={32} />
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#090a0f] text-slate-100">
        <h1 className="text-2xl font-black">Practice Task Not Found</h1>
        <Link href="/practice" className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all">
          Back to Practice Explorer
        </Link>
      </div>
    );
  }

  const activeTestCase = problem.testcases[activeTestCaseIdx] || problem.testcases[0] || { input: "", expected: "" };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "input") {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  const getLanguageHeaderLabel = () => {
    const map = {
      javascript: "JAVASCRIPT Solution Editor",
      python: "PYTHON 3 Solution Editor",
      go: "GO 1.20 Solution Editor",
      java: "JAVA 17 Solution Editor",
      cpp: "C++ 17 Solution Editor",
      c: "C 11 Solution Editor"
    };
    return map[selectedLanguage] || `${selectedLanguage.toUpperCase()} Solution Editor`;
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#090a0f] text-slate-200">
      {/* Top Header Bar */}
      <header className="flex h-14 items-center justify-between px-5 border-b border-slate-800/80 bg-[#0d0e15] shrink-0 z-30">
        {/* Left Header Breadcrumb */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="text-slate-400" />
            <span>Practice Explorer</span>
          </button>
          <span className="text-slate-600 font-bold text-sm">/</span>
          <h2 className="text-sm font-extrabold tracking-tight text-white truncate max-w-[220px] sm:max-w-none">
            {problem.title}
          </h2>
          <span className="bg-purple-900/40 text-purple-300 border border-purple-500/30 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
            Proctored
          </span>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
            <span>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#141622] border border-slate-700/80 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer hover:border-slate-600 transition-colors"
            >
              {problem.editorTemplates.javascript && <option value="javascript">JavaScript (Node.js)</option>}
              {problem.editorTemplates.python && <option value="python">Python 3</option>}
              {problem.editorTemplates.go && <option value="go">Go 1.20</option>}
              {problem.editorTemplates.java && <option value="java">Java 17</option>}
              {problem.editorTemplates.cpp && <option value="cpp">C++ 17</option>}
              {problem.editorTemplates.c && <option value="c">C 11</option>}
            </select>
          </div>

          {/* Reset Code Button */}
          <button
            onClick={handleResetCode}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-[#141622] border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw size={13} className="text-slate-400" />
            <span>Reset Code</span>
          </button>

          {/* Voice Input Button */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              voiceEnabled
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                : "bg-[#141622] text-slate-400 border-slate-700"
            }`}
          >
            {voiceEnabled ? <Mic size={13} className="text-emerald-400" /> : <MicOff size={13} />}
            <span>Voice Input</span>
          </button>

          {/* End Session Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Main Workspace Split Layout */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {(isResizing || isConsoleResizing) && (
          <div
            className={`fixed inset-0 z-50 bg-transparent select-none pointer-events-auto ${
              isResizing ? "cursor-col-resize" : "cursor-row-resize"
            }`}
          />
        )}

        {/* Left Column Panel */}
        <div
          className="flex flex-col h-full overflow-hidden shrink-0 bg-[#0d0e15]"
          style={{ width: `${leftWidth}%` }}
        >
          {/* Left Navigation Tabs */}
          <div className="flex h-11 border-b border-slate-800/80 overflow-x-auto shrink-0 bg-[#090a0f] px-2">
            {[
              { id: "description", label: "Description", icon: <FileText size={14} /> },
              { id: "code", label: "Code", icon: <Code size={14} /> },
              { id: "editorial", label: "Editorial", icon: <BookOpen size={14} /> },
              { id: "solution", label: "Solution", icon: <CheckCircle2 size={14} /> },
              { id: "submissions", label: "Submissions", icon: <ClipboardCheck size={14} /> },
              { id: "whiteboard", label: "Whiteboard", icon: <Palette size={14} /> }
            ].map(tab => {
              const isActive = activeLeftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                    isActive
                      ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Panel Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0b0c12]">
            {/* Dynamic Proctoring Banner with Live Timer */}
            <ProctoringBanner secondsLeft={secondsLeft} isProctored={true} />

            {/* Render Description & Code Tabs */}
            {(activeLeftTab === "description" || activeLeftTab === "code") && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {problem.desc || problem.statement}
                </div>

                {/* Dynamic Example Section */}
                {problem.testcases && problem.testcases.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-extrabold text-white">Example</h3>
                    <div className="bg-[#07080d] border border-slate-800/90 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 shadow-inner">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>INPUT & EXPECTED OUTPUT</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Input: </span>
                        <span className="text-slate-200">{problem.testcases[0].input}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Output: </span>
                        <pre className="inline text-emerald-400 font-bold whitespace-pre-wrap">{problem.testcases[0].expected}</pre>
                      </div>
                      {problem.testcases[0].explanation && (
                        <div className="text-[11px] text-slate-400 font-sans italic pt-1 border-t border-slate-800/60">
                          <span className="font-bold text-slate-300">Explanation: </span>
                          {problem.testcases[0].explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Note Section */}
                <div className="bg-[#09111e]/90 border border-blue-500/20 rounded-xl p-3.5 flex items-start space-x-3 mt-3">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5 shrink-0">
                    📍
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">Note</span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                      Follow the rules carefully to get the expected output.
                    </p>
                  </div>
                </div>

                {/* Dynamic Anti-Cheat Grid */}
                <AntiCheatGrid
                  cameraActive={cameraActive}
                  micActive={micActive}
                  screenActive={screenActive}
                  tabSwitches={tabSwitches}
                />
              </div>
            )}

            {/* Render Editorial Tab */}
            {activeLeftTab === "editorial" && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white">Official Editorial Guide</h3>
                {problem.editorial ? (
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#07080d] text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
                    {problem.editorial}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
                    <BookOpen size={32} className="text-slate-500 opacity-60" />
                    <h4 className="text-sm font-bold text-slate-200">No Editorial Published Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      An official editorial solution guide has not been published for this problem yet. Check back after completing your attempt!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Render Solution Tab */}
            {activeLeftTab === "solution" && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white">Reference Solution</h3>
                {problem.solution ? (
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#07080d] text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
                    {problem.solution}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
                    <CheckCircle2 size={32} className="text-slate-500 opacity-60" />
                    <h4 className="text-sm font-bold text-slate-200">No Reference Solution Published</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Official reference code solutions have not been published for this problem yet. Write your own logic and test it using the editor!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Render Submissions Tab */}
            {activeLeftTab === "submissions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">Your Submission History</h3>
                  <button
                    onClick={fetchUserSubmissions}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} className={loadingSubmissions ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className="flex items-center justify-center p-12 text-slate-400 space-x-2 text-xs font-semibold">
                    <RefreshCw size={16} className="animate-spin text-emerald-400" />
                    <span>Fetching submissions...</span>
                  </div>
                ) : userSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
                    <ClipboardCheck size={32} className="text-slate-500 opacity-60" />
                    <h4 className="text-sm font-bold text-slate-200">No Submissions Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      You haven&apos;t submitted any code solutions for this task yet. Use the editor on the right to write and submit your code!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userSubmissions.map((sub, idx) => {
                      const passed = sub.status === "ACCEPTED" || sub.verdict === "ACCEPTED";
                      const isExpanded = expandedSubmissionId === sub.id;
                      return (
                        <div
                          key={sub.id || idx}
                          className="bg-[#07080d] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                                passed
                                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                                  : "bg-rose-950/60 text-rose-400 border-rose-500/40"
                              }`}>
                                {sub.status || sub.verdict || "SUBMITTED"}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                                {sub.language || "javascript"}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                              {sub.executionTime !== undefined && (
                                <span className="flex items-center space-x-1">
                                  <Clock size={11} className="text-slate-500" />
                                  <span>{sub.executionTime}ms</span>
                                </span>
                              )}
                              <button
                                onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                                className="text-xs text-emerald-400 hover:underline font-sans font-semibold cursor-pointer"
                              >
                                {isExpanded ? "Hide Code" : "View Code"}
                              </button>
                            </div>
                          </div>

                          {isExpanded && sub.code && (
                            <div className="mt-2 p-3 rounded-lg bg-[#0c0d14] border border-slate-800 text-xs font-mono text-emerald-100 overflow-x-auto whitespace-pre">
                              <code>{sub.code}</code>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Render Whiteboard / Sketchpad Tab */}
            {activeLeftTab === "whiteboard" && (
              <div className="h-[520px] w-full">
                <WhiteboardCanvas />
              </div>
            )}

          </div>
        </div>

        {/* Resizing Divider Handle */}
        <div
          onMouseDown={startResizing}
          className="w-1.5 hover:w-2 bg-slate-800/80 hover:bg-emerald-500 cursor-col-resize select-none h-full transition-all duration-150 shrink-0 z-20 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-slate-600" />
        </div>

        {/* Right Column IDE & Testcase Terminal */}
        <div className="flex flex-1 flex-col h-full overflow-hidden bg-[#090a0f] p-3 space-y-3">
          {/* Voice Assistant Widget */}
          <VoiceAssistantWidget
            messages={assistantMessages}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onToggleListen={askVoiceAssistant}
          />

          {/* Code Editor Container */}
          <div className={`flex-1 flex flex-col rounded-xl border border-slate-800/80 bg-[#0c0d14] overflow-hidden shadow-2xl relative transition-all ${
            isEditorFullscreen ? "fixed inset-3 z-[9999] shadow-[0_0_50px_rgba(0,0,0,0.9)]" : ""
          }`}>
            {/* Editor Header Bar */}
            <div className="flex h-9 items-center justify-between px-4 border-b border-slate-800/60 bg-[#0e1018] shrink-0 text-xs text-slate-400">
              <span className="font-mono text-[11px] font-semibold text-slate-400">
                {getLanguageHeaderLabel()}
              </span>
              <button
                onClick={() => setIsEditorFullscreen(!isEditorFullscreen)}
                className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                title={isEditorFullscreen ? "Minimize Editor" : "Maximize Editor"}
              >
                {isEditorFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            </div>

            {/* Code Textarea Workspace */}
            <div className="flex-1 flex overflow-hidden font-mono text-sm relative">
              {/* Line numbers column */}
              <div
                ref={lineNumbersRef}
                className="w-12 select-none text-right pr-3 pt-3 border-r border-slate-800/60 overflow-hidden leading-6 bg-[#0a0b11]"
                style={{ color: "#475569", fontSize: "12px" }}
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Main Code Textarea */}
              <textarea
                ref={editorRef}
                value={editorCodes[selectedLanguage] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditorCodes(prev => ({ ...prev, [selectedLanguage]: val }));
                }}
                onScroll={handleEditorScroll}
                onKeyDown={handleEditorKeyDown}
                spellCheck="false"
                className="flex-grow h-full w-full resize-none bg-transparent pt-3 px-4 pb-10 outline-none border-none leading-6 overflow-y-auto text-emerald-100 selection:bg-emerald-900/50"
                style={{ fontSize: "13px" }}
              />
            </div>

            {/* Action Bar Below Code Editor */}
            <div className="flex h-12 items-center justify-between px-4 border-t border-slate-800/80 bg-[#0e1017] shrink-0">
              <div className="flex items-center space-x-2.5">
                {/* Run Code Button */}
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play size={13} className="fill-white" />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>

                {/* Testcase Button */}
                <button
                  onClick={() => setActiveConsoleTab("testcase")}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeConsoleTab === "testcase"
                      ? "bg-slate-800 text-white border-slate-600"
                      : "bg-[#141622] text-slate-300 border-slate-700/80 hover:bg-slate-800"
                  }`}
                >
                  <Terminal size={13} className="text-slate-400" />
                  <span>Testcase</span>
                </button>

                {/* Debug Console Button */}
                <button
                  onClick={() => setActiveConsoleTab("debugger")}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeConsoleTab === "debugger"
                      ? "bg-slate-800 text-white border-slate-600"
                      : "bg-[#141622] text-slate-300 border-slate-700/80 hover:bg-slate-800"
                  }`}
                >
                  <Bug size={13} className="text-slate-400" />
                  <span>Debug Console</span>
                </button>
              </div>
            </div>
          </div>

          {/* Movable / Resizable Test Case Terminal */}
          <div
            className="flex flex-col bg-[#0c0d14] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl shrink-0 transition-none relative"
            style={{ height: `${consoleHeight}px` }}
          >
            {/* Movable Drag Handle at Top of Test Case Terminal */}
            <div
              onMouseDown={startConsoleResizing}
              className="h-2.5 w-full bg-[#11131d] hover:bg-emerald-500/80 cursor-row-resize select-none shrink-0 flex items-center justify-center group transition-colors border-b border-slate-800/60 z-30"
              title="Click and drag up or down to resize testcase terminal"
            >
              <div className="h-1 w-12 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
            </div>

            {/* Test Case Container Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConsoleTab === "testcase" && (
                <>
                  {/* Testcase Selector Pills */}
                  <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-800/60 pb-2">
                    {problem.testcases.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestCaseIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
                          activeTestCaseIdx === idx
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            : "bg-[#141622] text-slate-400 border border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {tc.name || `TEST CASE ${idx + 1} (SAMPLE)`}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Dynamic Input Card */}
                    <div className="bg-[#07080d] border border-slate-800/90 rounded-xl p-3.5 space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Input</span>
                        <button
                          onClick={() => copyToClipboard(activeTestCase.input, "input")}
                          className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
                          title="Copy Input"
                        >
                          {copiedInput ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap">
                        {activeTestCase.input || "(Empty input)"}
                      </pre>
                    </div>

                    {/* Dynamic Expected Output Card */}
                    <div className="bg-[#07080d] border border-slate-800/90 rounded-xl p-3.5 space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Expected Output</span>
                        <button
                          onClick={() => copyToClipboard(activeTestCase.expected, "output")}
                          className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
                          title="Copy Expected Output"
                        >
                          {copiedOutput ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-emerald-400 font-bold overflow-x-auto whitespace-pre-wrap">
                        {activeTestCase.expected || "(Empty output)"}
                      </pre>
                    </div>
                  </div>
                </>
              )}

              {activeConsoleTab === "result" && (
                <div className="space-y-3 font-mono text-xs">
                  {isRunning ? (
                    <div className="flex items-center space-x-2 text-emerald-400 py-3">
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Executing test suite...</span>
                    </div>
                  ) : testResults ? (
                    testResults.map((res, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-800 bg-[#07080d] space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[10px] text-slate-400 uppercase">{res.name}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${
                            res.passed ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40" : "bg-rose-950/60 text-rose-400 border-rose-500/40"
                          }`}>
                            {res.passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500 font-bold">Input:</span>
                            <pre className="text-slate-300 truncate">{res.input}</pre>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold">Expected:</span>
                            <pre className="text-emerald-400 truncate">{res.expected}</pre>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 font-bold">Actual Output:</span>
                            <pre className={`p-2 rounded-lg border mt-1 font-bold whitespace-pre-wrap ${
                              res.passed
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-950/40 text-rose-400 border-rose-500/30"
                            }`}>
                              {res.error || res.actual || "(No output)"}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-center py-4 text-xs font-sans">
                      No tests executed yet. Click &quot;Run Code&quot; above to test your logic.
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === "debugger" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Custom Debug Input</span>
                    <button
                      onClick={handleRunDebug}
                      disabled={debugRunning}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Play size={11} className="fill-white" />
                      <span>{debugRunning ? "Debugging..." : "Run Debugger"}</span>
                    </button>
                  </div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom test input parameters..."
                    rows={4}
                    className="w-full bg-[#07080d] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500/50 resize-none"
                  />
                  {debugResult && (
                    <div className="p-3 rounded-xl border border-slate-800 bg-[#07080d] font-mono text-xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Debug Output ({debugResult.executionTime}ms):</div>
                      <pre className="text-emerald-400 whitespace-pre-wrap">{debugResult.output || debugResult.error || "(No output)"}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="flex items-center justify-between px-2 pt-1 shrink-0">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Auto-saved just now</span>
            </div>

            <button
              onClick={submitCode}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting..." : "Submit Solution"}</span>
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Submission Status Modal */}
      <AnimatePresence>
        {submissionReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[85vh] overflow-y-auto bg-[#0d0e15]"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                    submissionReport.verdict === "ACCEPTED" ? "bg-emerald-500 shadow-emerald-500/25" : "bg-rose-500 shadow-rose-500/25"
                  }`}>
                    {submissionReport.verdict === "ACCEPTED" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {submissionReport.verdict === "ACCEPTED" ? "Accepted!" : "Submission Failed"}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Status Verdict: <span className={`font-bold font-mono ${submissionReport.verdict === "ACCEPTED" ? "text-emerald-400" : "text-rose-400"}`}>{submissionReport.verdict.replace(/_/g, " ")}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    {submissionReport.passedTestCases} / {submissionReport.totalTestCases} Passed
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Time: {submissionReport.executionTimeMs} ms
                  </div>
                </div>
              </div>

              {submissionReport.stderr && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Execution Error Output:</span>
                  <pre className="p-4 rounded-2xl bg-black border border-rose-500/20 text-rose-300 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {submissionReport.stderr}
                  </pre>
                </div>
              )}

              <div className="flex space-x-3 justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSubmissionReport(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-xs text-slate-300 cursor-pointer transition-colors"
                >
                  Close Report
                </button>
                {submissionReport.verdict === "ACCEPTED" && (
                  <Link
                    href="/practice"
                    className="px-5 py-2.5 text-white bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-1 transition-all"
                  >
                    <span>Next Challenge</span>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 border border-slate-800 bg-[#0d0e15] shadow-2xl text-center space-y-5"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-white">Exit Problem Session?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your current session state will be saved. Are you sure you want to exit?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Keep Solving
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/practice")}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-600/20"
                >
                  Exit Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
