"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { getSocket } from "@/utils/socket";
import Editor from "@monaco-editor/react";
import { 
  ShieldAlert, Clock, ChevronLeft, ChevronRight, 
  CheckCircle2, RefreshCw, AlertTriangle, Wifi, WifiOff,
  Terminal, Play, Send, CheckCircle, XCircle, Lock
} from "lucide-react";
import { motion } from "framer-motion";
// ── AI Proctoring ─────────────────────────────────────────────────────────────
import ConsentModal from "@/components/exam/proctor/ConsentModal";
import ProctoringCamera from "@/components/exam/proctor/ProctoringCamera";
import ProctoringToast from "@/components/exam/proctor/ProctoringToast";
import { useCamera } from "@/hooks/useCamera";
import { useProctor } from "@/hooks/useProctor";

export default function StudentExamRunner() {
  const { attemptId } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const API_BASE = getApiBase();

  // Lifecycle States
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Connection & Offline Cache
  const [isOnline, setIsOnline] = useState(true);

  // Navigation & Answers Index
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // local array matching questions list

  // Coding Compilation States
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [editorTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationResult, setCompilationResult] = useState(null);
  const executionTimer = useRef(null);
  const pollingInterval = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proctorCount, setProctorCount] = useState(0);

  // ── AI Proctoring State ───────────────────────────────────────────────────
  const [proctorConsented, setProctorConsented] = useState(null); // null=pending, true, false
  const [proctorSessionId, setProctorSessionId] = useState(null);
  const [proctorFlags, setProctorFlags] = useState([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const proctorSessionRef = useRef(null);

  // Camera hook
  const { videoRef, cameraState, isActive: isCameraActive, startCamera, stopCamera, captureFrame } = useCamera();

  // Proctor orchestration hook
  const { isConnected: isProctoringConnected, activeFlags, sendBrowserEvent } = useProctor({
    sessionId: proctorSessionId,
    user,
    token,
    captureFrame,
    isCameraActive,
    onFlag: (flags) => setProctorFlags(flags),
    enabled: proctorConsented === true && !!proctorSessionId,
  });

  const handleProctorConsentAccept = useCallback(async () => {
    setProctorConsented(true);
    setShowConsentModal(false);
    try {
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/proctor/session/start`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          attempt_id: parseInt(attemptId, 10),
          consent_given: true
        })
      });
      const data = await res.json();
      if (data.session_id) {
        setProctorSessionId(data.session_id);
        startCamera();
      }
    } catch (e) {
      console.error("[Proctor] Failed to start proctor session", e);
    }
  }, [API_BASE, attemptId, token, user, startCamera]);

  const handleProctorConsentDecline = useCallback(async () => {
    setProctorConsented(false);
    setShowConsentModal(false);
    try {
      const headers = buildAuthHeaders(token, user);
      await fetch(`${API_BASE}/api/v1/proctor/event/browser`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          session_id: `declined-${attemptId}`,
          flag: "CONSENT_DECLINED",
          metadata: { attemptId }
        })
      });
    } catch (e) {}
  }, [API_BASE, attemptId, token, user]);

  // Timer Ref
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const timerInterval = useRef(null);

  // Read-only state check
  const isReadOnly = attempt && attempt.status !== "IN_PROGRESS";
  const isReadOnlyRef = useRef(isReadOnly);
  useEffect(() => {
    isReadOnlyRef.current = isReadOnly;
  }, [isReadOnly]);

  const attemptRef = useRef(attempt);
  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  // ── Exam Submissions ───────────────────────────────────────────────────────

  const executeSubmit = useCallback(async (isAuto = false) => {
    if (isReadOnlyRef.current) {
      router.push("/exams");
      return;
    }
    // End proctoring session if active
    if (proctorSessionId) {
      try {
        const headers = buildAuthHeaders(token, user);
        await fetch(`${API_BASE}/api/v1/proctor/session/end`, {
          method: "POST",
          headers,
          body: JSON.stringify({ session_id: proctorSessionId, reason: isAuto ? "AUTO_SUBMIT" : "MANUAL_SUBMIT" }),
        });
      } catch {}
      stopCamera();
    }
    try {
      setSubmitting(true);
      console.log("[Workspace] Finalizing assessment submission...", { isAuto });
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify({ isAutoSubmit: isAuto })
      });
      const json = await res.json();
      if (json.success) {
        console.log("[Workspace] Assessment submitted successfully.");
        setSubmitSuccess(true);
      } else {
        alert(json.message || "Failed to finalize exam submission");
      }
    } catch (e) {
      console.error("[Workspace] Submission error:", e);
      alert("Network error finalizing exam submission");
    } finally {
      setSubmitting(false);
    }
  }, [router, token, user, API_BASE, attemptId, proctorSessionId, stopCamera]);

  const executeSubmitRef = useRef(executeSubmit);
  useEffect(() => {
    executeSubmitRef.current = executeSubmit;
  }, [executeSubmit]);

  const handleAutoSubmit = useCallback(() => {
    console.log("[Workspace] Timer expired. Auto-submitting assessment...");
    executeSubmitRef.current(true);
  }, []);

  // ── Anti-Cheat Proctor Lockdowns ───────────────────────────────────────────

  const logProctorEvent = useCallback(async (event, severity) => {
    if (isReadOnlyRef.current) return;
    setProctorCount(prev => prev + 1);
    try {
      const headers = buildAuthHeaders(token, user);
      await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/proctor`, {
        method: "POST",
        headers,
        body: JSON.stringify({ event, severity, metadata: { timestamp: new Date().toISOString() } })
      });
    } catch (e) {
      console.error("[Workspace] Proctor incident log failed:", e);
    }
  }, [token, user, API_BASE, attemptId]);

  const checkFullscreenState = useCallback(() => {
    if (isReadOnlyRef.current) return;
    const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    setIsFullscreen(isFull);
    
    if (attemptRef.current?.examVersion?.settingsSnapshot?.fullscreenEnforcement && !isFull) {
      logProctorEvent("FULLSCREEN_LEAVE", "HIGH");
    }
  }, [logProctorEvent]);

  const handleWindowBlur = useCallback(() => {
    if (isReadOnlyRef.current) return;
    logProctorEvent("TAB_SWITCH", "HIGH");
  }, [logProctorEvent]);

  const blockClipboard = useCallback((e) => {
    if (isReadOnlyRef.current) return;
    e.preventDefault();
    alert("Clipboard actions are restricted on this exam runner.");
  }, []);

  const blockRightClick = useCallback((e) => {
    if (isReadOnlyRef.current) return;
    e.preventDefault();
  }, []);

  // ── Network Offline Resilience ─────────────────────────────────────────────

  const syncOfflineCache = useCallback(async () => {
    if (isReadOnlyRef.current) return;
  }, []);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    syncOfflineCache();
  }, [syncOfflineCache]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // ── Ticking Clock Timer ────────────────────────────────────────────────────

  const startTimer = useCallback((seconds) => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    let remaining = seconds;
    console.log("[Workspace] Timer Started. Remaining seconds:", remaining);
    timerInterval.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerInterval.current);
        console.log("[Workspace] Clock reached zero. Triggering auto submit.");
        handleAutoSubmit();
      }
    }, 1000);
  }, [handleAutoSubmit]);

  // ── Fetch Attempt Config ───────────────────────────────────────────────────

  const fetchAttemptDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[Workspace] Fetching candidate assessment details for attempt:", attemptId);
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}`, { headers });
      const json = await res.json();
      
      if (json.success && json.data) {
        console.log("[Workspace] Assessment Loaded successfully. Status:", json.data.status);
        setAttempt(json.data);
        setAnswers(json.data.answers || []);
        
        if (json.data.status === "IN_PROGRESS") {
          const start = new Date(json.data.startTime).getTime();
          const durationMs = (json.data.examVersion?.duration || 120) * 60 * 1000;
          const elapsed = new Date().getTime() - start;
          const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
          
          console.log("[Workspace] Time calculation completed. Remaining seconds:", remaining);
          setTimeLeft(remaining);
          startTimer(remaining);
        } else {
          console.log("[Workspace] Attempt is not IN_PROGRESS. Setting timer to 0.");
          setTimeLeft(0);
        }
      } else {
        console.warn("[Workspace] Attempt query returned error response:", json.message);
        setError(json.message || "Attempt has expired or is invalid.");
      }
    } catch (err) {
      console.error("[Workspace] Network error loading assessment workspace:", err);
      setError("Network issue downloading candidate workspace");
    } finally {
      console.log("[Workspace] Initialization finished. Setting loading to false.");
      setLoading(false);
    }
  }, [token, user, API_BASE, attemptId, startTimer]);

  useEffect(() => {
    console.log("[Workspace] Workspace mounted / initialized for attempt:", attemptId);
    fetchAttemptDetails();
  }, [fetchAttemptDetails, attemptId]);

  // Show consent modal if in progress and consent not decided
  useEffect(() => {
    if (attempt && attempt.status === "IN_PROGRESS" && proctorConsented === null) {
      setShowConsentModal(true);
    }
  }, [attempt, proctorConsented]);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    document.addEventListener("copy", blockClipboard);
    document.addEventListener("paste", blockClipboard);
    document.addEventListener("contextmenu", blockRightClick);
    window.addEventListener("blur", handleWindowBlur);

    document.addEventListener("fullscreenchange", checkFullscreenState);

    const socket = getSocket();

    const processExecutionResult = (data) => {
      if (data && data.attemptId == attemptId) {
        if (executionTimer.current) clearTimeout(executionTimer.current);
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        console.log("[Workspace] Received coding execution result:", data);
        setCompilationResult(data);
        setIsCompiling(false);

        if (data.jobType === "SUBMIT_CODE" || data.jobType === "SUBMIT") {
          const scoreVal = data.score;
          const qId = data.questionId;
          setAnswers(prev => prev.map(ans => ans.questionId === qId ? { ...ans, score: scoreVal, isGraded: true } : ans));
        }
      }
    };

    const handleConnect = () => {
      if (user?.id) {
        console.log("[Workspace] WebSocket connected/reconnected for user:", user.id);
        socket.emit("joinUser", { userId: user.id });
      }
    };

    if (socket && user?.id) {
      console.log("[Workspace] Initializing WebSocket listeners for user:", user.id);
      socket.emit("joinUser", { userId: user.id });
      socket.on("connect", handleConnect);
      socket.on("codingResult", processExecutionResult);
    }

    return () => {
      console.log("[Workspace] Workspace unmounting / cleaning up timer and listeners");
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("paste", blockClipboard);
      document.removeEventListener("contextmenu", blockRightClick);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", checkFullscreenState);
      
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("codingResult", processExecutionResult);
      }
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (executionTimer.current) clearTimeout(executionTimer.current);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [attemptId, fetchAttemptDetails, handleOnline, handleOffline, blockClipboard, blockRightClick, handleWindowBlur, checkFullscreenState, user]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours > 0 ? hours + "h " : ""}${mins}m ${secs}s`;
  };

  const handleEnterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  };

  // ── Save Answer / Visited updates ──────────────────────────────────────────

  const handleOptionChange = (questionId, optionId) => {
    if (isReadOnly) return;
    const activeAns = answers.find(a => a.questionId === questionId) || {};
    const existing = activeAns.mcqOptionIds || activeAns.mcqAnswers || [];
    
    // Single choice selection: selecting an option replaces any previously selected choice
    const isAlreadySelected = existing.includes(optionId);
    const selected = isAlreadySelected ? [] : [optionId];

    updateLocalAnswerState(questionId, { mcqOptionIds: selected, mcqAnswers: selected });
  };

  const handleDescriptiveChange = (questionId, text) => {
    if (isReadOnly) return;
    updateLocalAnswerState(questionId, { descriptiveAnswer: text });
  };

  const handleCodingChange = (questionId, code) => {
    if (isReadOnly) return;
    updateLocalAnswerState(questionId, { codingCode: code, codingLanguage: selectedLanguage });
  };

  const handleToggleFlag = (questionId) => {
    const activeAns = answers.find(a => a.questionId === questionId) || {};
    updateLocalAnswerState(questionId, { flagged: !activeAns.flagged });
  };

  const updateLocalAnswerState = (questionId, payload) => {
    const updated = answers.map((ans) => {
      if (ans.questionId === questionId) {
        return { ...ans, ...payload, visited: true };
      }
      return ans;
    });
    setAnswers(updated);

    if (isReadOnly) return;

    if (isOnline) {
      saveAnswerToServer(questionId, payload);
    }
  };

  const saveAnswerToServer = async (questionId, payload) => {
    if (isReadOnly) return;
    try {
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/answer`, {
        method: "POST",
        headers,
        body: JSON.stringify({ questionId, ...payload })
      });
      const json = await res.json();
      if (!json.success) {
        console.warn("[Autosave] Failed to sync answer to database:", json.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Code Runner execution triggers ─────────────────────────────────────────

  const startResultPolling = (jobId) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    if (!jobId) return;

    let pollAttempts = 0;
    pollingInterval.current = setInterval(async () => {
      pollAttempts += 1;
      if (pollAttempts > 10) { // Stop after 15 seconds (10 * 1500ms)
        clearInterval(pollingInterval.current);
        return;
      }
      try {
        const headers = buildAuthHeaders(token, user);
        const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/coding-result/${jobId}`, { headers });
        const json = await res.json();
        if (json.success && !json.pending && json.data) {
          if (executionTimer.current) clearTimeout(executionTimer.current);
          clearInterval(pollingInterval.current);
          setCompilationResult(json.data);
          setIsCompiling(false);

          if (json.data.jobType === "SUBMIT_CODE" || json.data.jobType === "SUBMIT") {
            const scoreVal = json.data.score;
            const qId = json.data.questionId;
            setAnswers(prev => prev.map(ans => ans.questionId === qId ? { ...ans, score: scoreVal, isGraded: true } : ans));
          }
        }
      } catch (err) {
        console.warn("[Workspace] Polling error:", err);
      }
    }, 1500);
  };

  const handleRunCode = async (questionId, currentCode) => {
    if (isReadOnly) {
      alert("This attempt has been submitted and locked. You are viewing your code in Read-Only Review Mode.");
      return;
    }
    try {
      setCompilationResult({ status: "PROCESSING", message: "Queued in Redis. Sandboxed runner compiling & executing test cases..." });
      setIsCompiling(true);

      if (executionTimer.current) clearTimeout(executionTimer.current);
      if (pollingInterval.current) clearInterval(pollingInterval.current);

      executionTimer.current = setTimeout(() => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        setIsCompiling(false);
        setCompilationResult({
          status: "FAILED",
          error: "Execution timeout. Sandboxed execution worker did not return within 15 seconds."
        });
      }, 15000);

      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/run`, {
        method: "POST",
        headers,
        body: JSON.stringify({ questionId, code: currentCode, language: selectedLanguage })
      });
      const json = await res.json();
      if (!json.success) {
        if (executionTimer.current) clearTimeout(executionTimer.current);
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        setIsCompiling(false);
        alert(json.message || "Failed to trigger compilation run");
      } else if (json.data?.jobId) {
        startResultPolling(json.data.jobId);
      }
    } catch (err) {
      console.error(err);
      if (executionTimer.current) clearTimeout(executionTimer.current);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      setIsCompiling(false);
      alert("Network compilation run failure");
    }
  };

  const handleSubmitCode = async (questionId, currentCode) => {
    if (isReadOnly) {
      alert("This attempt has been submitted and locked. You are viewing your code in Read-Only Review Mode.");
      return;
    }
    try {
      setCompilationResult({ status: "PROCESSING", message: "Queued in Redis. Sandboxed runner compiling & executing test cases..." });
      setIsCompiling(true);

      if (executionTimer.current) clearTimeout(executionTimer.current);
      if (pollingInterval.current) clearInterval(pollingInterval.current);

      executionTimer.current = setTimeout(() => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        setIsCompiling(false);
        setCompilationResult({
          status: "FAILED",
          error: "Execution timeout. Sandboxed execution worker did not return within 15 seconds."
        });
      }, 15000);

      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/submit-code`, {
        method: "POST",
        headers,
        body: JSON.stringify({ questionId, code: currentCode, language: selectedLanguage })
      });
      const json = await res.json();
      if (!json.success) {
        if (executionTimer.current) clearTimeout(executionTimer.current);
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        setIsCompiling(false);
        alert(json.message || "Failed to trigger compilation submit");
      } else if (json.data?.jobId) {
        startResultPolling(json.data.jobId);
      }
    } catch (err) {
      console.error(err);
      if (executionTimer.current) clearTimeout(executionTimer.current);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      setIsCompiling(false);
      alert("Network compilation submission failure");
    }
  };

  const handleManualSubmit = () => {
    if (confirm("Are you sure you want to finalize and submit your assessment paper?")) {
      executeSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center space-y-4 font-sans text-slate-300">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-semibold">Initializing Candidate Assessment Workspace...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
        <AlertTriangle size={48} className="text-rose-500" />
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-black text-white">Assessment Error</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        </div>
        <button
          onClick={() => router.push("/exams")}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
        </motion.div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-black text-white">Assessment Submitted Successfully!</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your responses have been recorded and sent to automatic evaluation engines. Results will be released once grading review completes.
          </p>
        </div>
        <button
          onClick={() => router.push("/exams")}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-8 py-3 text-xs font-bold text-white shadow-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Find active question details
  let activeQ = null;
  let qCounter = 0;
  attempt?.examVersion?.sections?.forEach(sec => {
    sec.questions?.forEach(q => {
      if (qCounter === activeIndex) {
        activeQ = q;
      }
      qCounter++;
    });
  });
  const activeAns = answers.find(a => a.questionId === activeQ?.id || a.questionId === activeQ?.originalQuestionId) || answers[activeIndex];

  let starter = activeQ?.codingDetails?.starterCode;
  if (typeof starter === 'string' && starter.trim().startsWith('{')) {
    try { starter = JSON.parse(starter); } catch (e) {}
  }
  if (typeof starter === 'object' && starter !== null) {
    const targetLang = (selectedLanguage || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundKey = Object.keys(starter).find(k => {
      const kClean = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      return kClean.includes(targetLang) || targetLang.includes(kClean);
    });
    starter = (foundKey ? starter[foundKey] : null) || starter.python || starter.Python || starter.javascript || starter.default || "";
  }
  if (typeof starter !== 'string') starter = "";

  let rawActiveCode = activeAns?.codingCode || starter;
  if (typeof rawActiveCode === 'string' && rawActiveCode.trim().startsWith('{')) {
    const trimmed = rawActiveCode.trim();
    if (trimmed.includes('}') && (trimmed.includes('"Python"') || trimmed.includes('"python"') || trimmed.includes('"javascript"'))) {
      const braceEnd = trimmed.indexOf('}');
      if (braceEnd !== -1) {
        rawActiveCode = trimmed.substring(braceEnd + 1).trim();
      }
    }
  }
  const activeCodeVal = rawActiveCode;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-100 dark:bg-slate-950 flex flex-col font-sans select-none pointer-events-auto">
      
      {/* ── Read-Only Review Mode Banner ────────────────────────────────────── */}
      {isReadOnly && (
        <div className="bg-indigo-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <Lock size={16} />
            <span>
              Read-Only Review Mode: This attempt is locked (Status: <strong>{attempt.status}</strong>). You are viewing your submitted answers and code.
            </span>
          </div>
          <button
            onClick={() => router.push("/exams")}
            className="px-3.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-2xs font-extrabold transition-all"
          >
            Back to Exams List
          </button>
        </div>
      )}

      {/* ── Fullscreen Overlay Shield ────────────────────────────────────────── */}
      {!isReadOnly && attempt?.examVersion?.settingsSnapshot?.fullscreenEnforcement && !isFullscreen && (
        <div className="absolute inset-0 z-[10000] bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <ShieldAlert size={48} className="text-amber-500 animate-pulse" />
          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-black text-white">Fullscreen Containment Active</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This exam requires fullscreen containment. Leaving fullscreen triggers proctor warnings. Click below to unlock.
            </p>
          </div>
          <button
            onClick={handleEnterFullscreen}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-xs font-bold text-white"
          >
            Enter Fullscreen Mode
          </button>
        </div>
      )}

      {/* Top status header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{attempt?.examVersion?.title}</h2>
          
          <div className="flex items-center gap-1 text-2xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
            {isOnline ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Wifi size={10} /> Online</span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1"><WifiOff size={10} /> Offline (Caching)</span>
            )}
          </div>

          {proctorCount > 0 && !isReadOnly && (
            <span className="text-2xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
              Proctor Incident Flags: {proctorCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {!isReadOnly ? (
            <>
              <div className="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/20">
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={submitting}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-lg transition-all"
              >
                Submit Assessment
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/exams")}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              Submitted ({attempt.status})
            </button>
          )}
        </div>
      </div>

      {/* Workspace split columns layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Navigator column */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 p-6 flex flex-col space-y-4 overflow-y-auto shrink-0">
          <span className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">Question Navigator</span>

          <div className="space-y-4">
            {(() => {
              let globalIdx = 0;
              return attempt?.examVersion?.sections?.map((sec) => (
                <div key={sec.id} className="space-y-2">
                  <h4 className="text-2xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">{sec.title}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {sec.questions?.map((q) => {
                      const currentIdx = globalIdx++;
                      const ans = answers.find(a => a.questionId === q.id || a.questionId === q.originalQuestionId) || answers[currentIdx] || {};
                      const isCurrent = currentIdx === activeIndex;
                      const isAnswered = (ans.mcqOptionIds?.length > 0) || (ans.mcqAnswers?.length > 0) || 
                                        (ans.descriptiveAnswer && ans.descriptiveAnswer.trim().length > 0) ||
                                        (ans.codingCode && ans.codingCode.trim().length > 0);
                      const isFlagged = ans.flagged;

                      let bgClass = "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400";
                      if (isAnswered) bgClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold";
                      if (isFlagged) bgClass = "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold";
                      if (isCurrent) bgClass = "bg-indigo-600 border-indigo-500 text-white font-black scale-105 shadow-md";

                      return (
                        <button
                          key={q.id}
                          onClick={() => setActiveIndex(currentIdx)}
                          className={`w-10 h-10 rounded-xl text-xs font-extrabold flex items-center justify-center border transition-all ${bgClass}`}
                        >
                          {currentIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Right Workspace column */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto bg-white dark:bg-slate-950/80 p-8 space-y-6">
          {activeQ ? (
            <div className="space-y-6 flex-1 flex flex-col">
              
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-2xs text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest font-sans">
                    Question #{activeIndex + 1} of {answers.length}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeQ.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{activeQ.marks} Marks</span>
                  {!isReadOnly && (
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeAns?.flagged || false}
                        onChange={() => handleToggleFlag(activeQ.id)}
                        className="rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-white/10 text-indigo-600 w-4 h-4 focus:ring-0"
                      />
                      <span>Mark for Review</span>
                    </label>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeQ.text}</p>

              {/* Workspace Content boxes */}
              <div className="flex-1 flex flex-col">
                {activeQ.type === "MCQ" && (
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 space-y-3 shadow-sm">
                    {activeQ.mcqOptions?.map((opt, optIdx) => {
                      const isSelected = activeAns?.mcqOptionIds?.includes(opt.id) || activeAns?.mcqAnswers?.includes(opt.id);
                      const optionLabel = typeof opt === "string" ? opt : (opt.text || opt.optionText || opt.value || opt.label || opt.option || "");
                      return (
                        <label
                          key={opt.id || optIdx}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-950 dark:text-white font-semibold shadow-sm" 
                              : "bg-white dark:bg-slate-950/20 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question_${activeQ.id}`}
                            disabled={isReadOnly}
                            checked={isSelected || false}
                            onChange={() => handleOptionChange(activeQ.id, opt.id || optIdx)}
                            className="rounded-full bg-white dark:bg-slate-950 border-slate-300 dark:border-white/10 text-indigo-600 w-4 h-4 focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs">{optionLabel}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {activeQ.type === "DESCRIPTIVE" && (
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 space-y-2 shadow-sm">
                    <textarea
                      rows={8}
                      readOnly={isReadOnly}
                      placeholder="Type your descriptive essay answer here..."
                      value={activeAns?.descriptiveAnswer || ""}
                      onChange={(e) => handleDescriptiveChange(activeQ.id, e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                    <div className="flex justify-between text-3xs text-slate-500">
                      <span>Max words limit: {activeQ.descriptiveDetails?.wordLimit || 500} words</span>
                      <span>Words: {(activeAns?.descriptiveAnswer || "").split(/\s+/).filter(Boolean).length}</span>
                    </div>
                  </div>
                )}

                {activeQ.type === "CODING" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                    {/* IDE Column */}
                    <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden">
                      {/* IDE configs toolbar */}
                      <div className="bg-slate-950/60 p-3 border-b border-white/5 flex items-center justify-between text-2xs">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="bg-slate-900 text-slate-300 font-bold border border-white/5 rounded px-2.5 py-1"
                          >
                            <option value="JAVASCRIPT">JavaScript (Node.js)</option>
                            <option value="PYTHON">Python 3</option>
                            <option value="CPP">C++17</option>
                            <option value="JAVA">Java 17</option>
                            <option value="C">C11</option>
                            <option value="GO">Go 1.21</option>
                          </select>
                          <select
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="bg-slate-900 text-slate-300 border border-white/5 rounded px-2 py-1"
                          >
                            <option value="12">12px</option>
                            <option value="14">14px</option>
                            <option value="16">16px</option>
                          </select>
                        </div>

                        <span className="text-slate-500 font-mono text-3xs">
                          {isReadOnly ? "Read-Only Code Review Workspace" : "Monaco Workspace"}
                        </span>
                      </div>

                      {/* Monaco instance wrapper */}
                      <div className="flex-1 min-h-[300px]">
                        <Editor
                          height="100%"
                          theme={editorTheme}
                          language={selectedLanguage.toLowerCase() === 'cpp' ? 'cpp' : selectedLanguage.toLowerCase()}
                          value={activeCodeVal}
                          onChange={(val) => handleCodingChange(activeQ.id, val)}
                          options={{
                            fontSize,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            fontFamily: "Fira Code, monospace",
                            readOnly: isReadOnly
                          }}
                        />
                      </div>

                      {/* Compiler actions */}
                      {!isReadOnly && (
                        <div className="p-3 bg-slate-950/60 border-t border-white/5 flex gap-2">
                          <button
                            onClick={() => handleRunCode(activeQ.id, activeCodeVal)}
                            disabled={isCompiling}
                            className="flex-grow inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 text-xs transition-colors disabled:opacity-50"
                          >
                            <Play size={13} /> Run Sample Cases
                          </button>
                          <button
                            onClick={() => handleSubmitCode(activeQ.id, activeCodeVal)}
                            disabled={isCompiling}
                            className="flex-grow inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 text-xs transition-colors disabled:opacity-50"
                          >
                            <Send size={13} /> Submit Solution
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Console / Output logs Column */}
                    <div className="rounded-2xl border border-white/5 bg-slate-900/20 flex flex-col overflow-hidden">
                      <div className="bg-slate-950/40 p-3 border-b border-white/5 text-2xs font-extrabold text-slate-400 flex items-center gap-1.5">
                        <Terminal size={14} /> Output Console Logs
                      </div>

                      <div className="flex-grow p-4 font-mono text-2xs overflow-y-auto space-y-3 leading-relaxed text-slate-300">
                        {isCompiling && (
                          <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Queued in Redis. Sandboxed runner compiling & executing test cases...</span>
                          </div>
                        )}

                        {!isCompiling && !compilationResult && (
                          <p className="text-slate-500 italic">
                            {isReadOnly ? "Submitted code answer loaded in review mode." : "No output logged yet. Run code to compile."}
                          </p>
                        )}

                        {compilationResult && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-400">Status:</span>
                              <span className={`font-black uppercase flex items-center gap-1.5 ${
                                compilationResult.status === "FINISHED" && compilationResult.overallPass
                                  ? "text-emerald-400" 
                                  : (compilationResult.status === "PROCESSING" || compilationResult.status === "QUEUED" || compilationResult.status === "COMPILING" || isCompiling)
                                  ? "text-indigo-400"
                                  : "text-rose-400"
                              }`}>
                                {(compilationResult.status === "PROCESSING" || compilationResult.status === "QUEUED" || compilationResult.status === "COMPILING" || isCompiling) && (
                                  <RefreshCw size={13} className="animate-spin" />
                                )}
                                {compilationResult.status === "FINISHED" 
                                  ? (compilationResult.overallPass ? "ALL CASES PASSED" : "FAILED TEST CASES")
                                  : (compilationResult.status === "PROCESSING" || compilationResult.status === "QUEUED" || compilationResult.status === "COMPILING" || isCompiling)
                                  ? "PROCESSING"
                                  : "EXECUTION ERROR"
                                }
                              </span>
                            </div>

                            {/* Compiler Error / Stderr Banner */}
                            {compilationResult.status !== "PROCESSING" && compilationResult.status !== "QUEUED" && compilationResult.status !== "COMPILING" && !isCompiling && (compilationResult.stderr || compilationResult.error) && (
                              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1 font-mono text-3xs">
                                <span className="font-bold text-rose-400 block">Compiler / Runtime Stderr:</span>
                                <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-36">
                                  {compilationResult.stderr || compilationResult.error}
                                </pre>
                              </div>
                            )}

                            {compilationResult.status === "FINISHED" && (
                              <div className="space-y-2">
                                <p className="font-extrabold text-slate-400">
                                  Test Cases Passed: {compilationResult.passedCount} / {compilationResult.totalCount}
                                </p>

                                <div className="space-y-2">
                                  {compilationResult.results?.map((res, index) => (
                                    <div key={index} className="p-3 rounded-lg border bg-slate-950/60 border-white/5 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-400">Case #{index + 1}</span>
                                        {res.passed ? (
                                          <span className="text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle size={11} /> Pass ({res.executionTime || 0}ms)</span>
                                        ) : (
                                          <span className="text-rose-400 font-bold flex items-center gap-0.5"><XCircle size={11} /> Fail ({res.executionTime || 0}ms)</span>
                                        )}
                                      </div>
                                      
                                      {res.input && (
                                        <p className="text-slate-500">Input: <span className="text-slate-300">{res.input}</span></p>
                                      )}
                                      {res.expectedOutput && (
                                        <p className="text-slate-500">Expected: <span className="text-emerald-400">{res.expectedOutput}</span></p>
                                      )}
                                      {res.actualOutput !== undefined && (
                                        <p className="text-slate-500">Output: <span className={res.passed ? "text-slate-200" : "text-rose-400"}>{res.actualOutput || "(empty)"}</span></p>
                                      )}
                                      {res.stderr && (
                                        <p className="text-rose-400 text-3xs font-mono">Error: {res.stderr}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              Select a question from the left navigator to start.
            </div>
          )}

          {/* Bottom Prev / Next Navigation bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            <span className="text-2xs font-extrabold text-slate-500">
              Question {activeIndex + 1} of {answers.length}
            </span>

            <button
              onClick={() => setActiveIndex(Math.min(answers.length - 1, activeIndex + 1))}
              disabled={activeIndex === answers.length - 1}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs font-bold text-white disabled:opacity-30 transition-all shadow-md"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>

        </div>

      </div>

      {/* AI Proctoring Components */}
      {showConsentModal && (
        <ConsentModal
          examTitle={attempt?.examVersion?.exam?.title || "Assessment"}
          onAccept={handleProctorConsentAccept}
          onDecline={handleProctorConsentDecline}
        />
      )}

      {proctorConsented === true && (
        <>
          <ProctoringCamera
            videoRef={videoRef}
            cameraState={cameraState}
            isConnected={isProctoringConnected}
          />
          <ProctoringToast flags={proctorFlags} />
        </>
      )}

    </div>
  );
}
