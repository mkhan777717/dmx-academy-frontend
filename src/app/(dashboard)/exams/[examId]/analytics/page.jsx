"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { 
  ArrowLeft, BarChart4, Users, Award, Download, CheckCircle2, 
  AlertTriangle, Clock, ShieldAlert, BookOpen, Send, FileCheck
} from "lucide-react";
import { motion } from "framer-motion";
import StudentPaperCheckingModal from "@/components/exam/StudentPaperCheckingModal";
import ProctorReportModal from "@/components/exam/proctor/ProctorReportModal";

export default function ExamAnalyticsDashboard() {
  const { examId } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const API_BASE = getApiBase();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [rosterTab, setRosterTab] = useState("ATTEMPTED");

  const [evaluatingAnswer, setEvaluatingAnswer] = useState(null);
  const [evalScore, setEvalScore] = useState("");
  const [evalComment, setEvalComment] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState([]);

  // Student paper checking modal states
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [isCheckingModalOpen, setIsCheckingModalOpen] = useState(false);

  // Proctor report modal states
  const [proctorReportSessionId, setProctorReportSessionId] = useState(null);
  const [proctorStudentName, setProctorStudentName] = useState("");
  const [isProctorReportModalOpen, setIsProctorReportModalOpen] = useState(false);

  const handleCheckStudentPaper = (attemptId) => {
    setSelectedAttemptId(attemptId);
    setIsCheckingModalOpen(true);
  };

  useEffect(() => {
    fetchAnalytics();
    fetchPendingGrades();
  }, [examId]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams/${examId}/analytics`, { headers });
      const json = await res.json();
      
      if (json.success && json.data) {
        setAnalytics(json.data);
      } else {
        setError(json.message || "Failed to load exam analytics");
      }
    } catch (err) {
      console.error(err);
      setError("Network error pulling exam metrics");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPendingGrades() {
    try {
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams/grading/pending?examId=${examId}`, { headers });
      const json = await res.json();
      if (json.success) {
        setPendingAnswers(json.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleDownloadCSV = () => {
    const hasRealToken = token && !token.startsWith("demo-") && !token.startsWith("local-");
    const authParams = hasRealToken
      ? `token=${token}`
      : `token=${token || ''}&x-bypass-auth=true&x-bypass-role=${user?.role || 'ADMIN'}&x-bypass-userid=${user?.id || ''}`;
    window.open(`${API_BASE}/api/v1/exams/${examId}/reports/csv?${authParams}`, "_blank");
  };

  const handlePublishResults = async () => {
    const msg = "Are you sure you want to release final grades? All candidates will receive score sheet access.";
    if (!confirm(msg)) return;

    const numericExamId = parseInt(examId, 10);
    if (isNaN(numericExamId)) {
      alert("Invalid Exam ID parameter.");
      return;
    }

    try {
      setPublishing(true);
      const headers = {
        "Content-Type": "application/json",
        ...buildAuthHeaders(token, user)
      };
      const res = await fetch(`${API_BASE}/api/v1/exams/${numericExamId}/results/publish`, {
        method: "POST",
        headers,
        body: JSON.stringify({ examId: numericExamId, id: numericExamId })
      });
      const json = await res.json();
      if (json.success) {
        alert("Results released successfully to all candidates!");
        fetchAnalytics();
      } else {
        alert(json.message || "Failed to release results");
      }
    } catch (err) {
      alert("Network error publishing results");
    } finally {
      setPublishing(false);
    }
  };

  const handlePublishSingleAttempt = async (attemptId) => {
    try {
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams/attempts/${attemptId}/publish`, {
        method: "POST",
        headers
      });
      const json = await res.json();
      if (json.success) {
        alert("Candidate result published successfully!");
        fetchAnalytics();
        fetchPendingGrades();
      } else {
        alert(json.message || "Failed to publish attempt result");
      }
    } catch (err) {
      alert("Network error releasing candidate score");
    }
  };

  const handleOpenEvaluation = (answer) => {
    setEvaluatingAnswer(answer);
    setEvalScore(answer.manualGrade?.score !== undefined ? answer.manualGrade.score.toString() : "");
    setEvalComment(answer.manualGrade?.comments || "");
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!evaluatingAnswer) return;

    try {
      setSavingGrade(true);
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams/answers/${evaluatingAnswer.id}/manual-grade`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          score: parseFloat(evalScore),
          comments: evalComment
        })
      });
      const json = await res.json();
      if (json.success) {
        alert("Manual score saved successfully!");
        setEvaluatingAnswer(null);
        fetchAnalytics();
        fetchPendingGrades();
      } else {
        alert(json.message || "Failed to save score");
      }
    } catch (err) {
      alert("Network error saving manual grade");
    } finally {
      setSavingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-600 dark:text-slate-400">Aggregating exam report cards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
        <AlertTriangle size={36} className="text-rose-500 animate-pulse" />
        <h3 className="text-md font-bold text-slate-900 dark:text-white">Analytics Generation Error</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">{error}</p>
        <button
          onClick={() => router.push("/exams")}
          className="rounded-xl bg-slate-200 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Back Link */}
      <button
        onClick={() => router.push("/exams")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Exams Manager
      </button>

      {/* Header Banner */}
      {analytics && (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-2xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
              Operational Statistics & Evaluation Portal
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{analytics.examTitle}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Grade descriptive/essay submissions, inspect proctoring reports, and release published scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePublishResults}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-lg"
            >
              <Send size={14} />
              Publish Final Scores
            </button>

            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 px-5 py-3 text-xs font-bold text-slate-800 dark:text-white transition-colors"
            >
              <Download size={14} />
              Export CSV Report
            </button>
          </div>
        </div>
      )}

      {/* Metrics Cards Grid */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-6 space-y-2 shadow-sm">
            <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">Total Attempts</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalAttempts}</div>
            <p className="text-3xs text-slate-500">Candidates registered</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-6 space-y-2 shadow-sm">
            <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">Submissions</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalSubmitted}</div>
            <p className="text-3xs text-slate-500">Finalized and locked</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-6 space-y-2 shadow-sm">
            <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">Pending Evaluation</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingAnswers.length}</div>
            <p className="text-3xs text-slate-500">Descriptive answers to grade</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-6 space-y-2 shadow-sm">
            <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider font-sans">High / Low Score</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.highestScore} <span className="text-xs text-slate-400">/ {analytics.lowestScore}</span></div>
            <p className="text-3xs text-slate-500">Score boundaries spread</p>
          </div>
        </div>
      )}



      {/* Core Split Dashboard Content */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 1/3 column: Grade bracket SVG chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Score Bracket Distribution</h3>
            <p className="text-2xs text-slate-500 leading-relaxed">Percentage of candidates falling within grade brackets.</p>
            
            <div className="space-y-4 pt-4">
              {Object.keys(analytics.distribution).map((bracket) => {
                const count = analytics.distribution[bracket];
                const pct = analytics.totalSubmitted > 0 ? (count / analytics.totalSubmitted) * 100 : 0;
                return (
                  <div key={bracket} className="space-y-1.5">
                    <div className="flex justify-between text-3xs font-bold text-slate-600 dark:text-slate-400">
                      <span>{bracket}</span>
                      <span>{count} Students ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-indigo-600 dark:bg-indigo-500"
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2/3 column: Candidates roster details table */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 p-6 space-y-4 overflow-x-auto shadow-sm">
            
            {/* Roster Header Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Student Roster</h3>

              {(() => {
                const attemptedCount = (analytics.attempts || []).filter(att => {
                  const email = (att.email || '').toLowerCase();
                  const username = (att.username || '').toLowerCase();
                  return !(email.includes('admin') || email.includes('mentor') || email.includes('batchmanager') || email.startsWith('pst@') || username === 'admin' || username === 'mentor');
                }).length;

                const unattemptedCount = (analytics.unattempted || []).length;

                return (
                  <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-2xs font-extrabold">
                    <button
                      type="button"
                      onClick={() => setRosterTab("ATTEMPTED")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        rosterTab === "ATTEMPTED"
                          ? "bg-indigo-600 text-white shadow-xs font-black"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Attempted ({attemptedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosterTab("UNATTEMPTED")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        rosterTab === "UNATTEMPTED"
                          ? "bg-indigo-600 text-white shadow-xs font-black"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Unattempted ({unattemptedCount})
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Table 1: Attempted Candidates */}
            {rosterTab === "ATTEMPTED" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs leading-relaxed border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 font-extrabold uppercase text-3xs tracking-wider">
                      <th className="px-4 py-3 whitespace-nowrap">Candidate</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Score</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Proctor Logs</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.attempts || [])
                      .filter(att => {
                        const email = (att.email || '').toLowerCase();
                        const username = (att.username || '').toLowerCase();
                        const isStaff = email.includes('admin') || email.includes('mentor') || email.includes('batchmanager') || email.startsWith('pst@') || username === 'admin' || username === 'mentor';
                        return !isStaff;
                      })
                      .map((att) => (
                      <tr 
                        key={att.id} 
                        onClick={() => handleCheckStudentPaper(att.id)}
                        className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          <span className="block font-bold">{att.username}</span>
                          <span className="block text-3xs text-slate-500 font-normal">{att.email}</span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-3xs font-bold uppercase tracking-wide ${
                            att.status === "SUBMITTED" || att.status === "AUTO_SUBMITTED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {att.score !== null ? `${att.score} / ${att.examVersion?.maxMarks || analytics.maxMarks || 10}` : "--"}
                        </td>
                        <td className="px-4 py-3 text-center font-bold whitespace-nowrap">
                          <span className={att.proctorFlags > 0 ? "text-amber-600 dark:text-amber-500 font-extrabold" : "text-slate-500 font-normal"}>
                            {att.proctorFlags} Logs
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCheckStudentPaper(att.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-sm whitespace-nowrap"
                            >
                              <FileCheck size={14} />
                              Check Paper
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setProctorReportSessionId(att.proctorSessionId || String(att.id));
                                setProctorStudentName(att.username || "Candidate");
                                setIsProctorReportModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors whitespace-nowrap"
                            >
                              <ShieldAlert size={13} />
                              Proctor Report
                            </button>
                            {att.resultPublished ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                <CheckCircle2 size={12} />
                                Published
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePublishSingleAttempt(att.id)}
                                className="rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white transition-colors whitespace-nowrap"
                              >
                                Publish Result
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/exams/${examId}/result/${att.id}`)}
                              className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-3 py-1.5 font-bold text-slate-700 dark:text-white transition-colors text-xs whitespace-nowrap"
                            >
                              Scorecard
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table 2: Unattempted Candidates */}
            {rosterTab === "UNATTEMPTED" && (
              <table className="w-full text-left text-2xs leading-relaxed border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 font-extrabold uppercase">
                    <th className="pb-3">Student Name & Email</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Notice</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics.unattempted || []).length > 0 ? (
                    analytics.unattempted.map((st) => (
                      <tr key={st.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          {st.username}
                          <span className="block text-3xs text-slate-500 font-normal">{st.email}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded text-3xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                            NOT STARTED
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500 italic text-3xs">
                          No attempt started yet
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500 italic text-2xs">
                        All assigned students have attempted or started this assessment!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>

        </div>
      )}

      {/* Single Answer Evaluation Modal */}
      {evaluatingAnswer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual Paper Evaluation ({evaluatingAnswer.question?.type})</h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Candidate: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{evaluatingAnswer.attempt?.user?.username || evaluatingAnswer.attempt?.user?.email}</span> | Question: <span className="text-slate-800 dark:text-slate-200 font-semibold">{evaluatingAnswer.question?.title}</span> (Max {evaluatingAnswer.question?.marks} Marks)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-2xs font-bold text-slate-600 dark:text-slate-400">
                Student {evaluatingAnswer.question?.type === "CODING" ? "Submitted Code" : "Descriptive Response"}
              </label>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {evaluatingAnswer.descriptiveAnswer || evaluatingAnswer.codingCode || "No answer text provided."}
              </div>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div className="space-y-2">
                <label className="text-2xs font-bold text-slate-600 dark:text-slate-400">Assign Score (0 - {evaluatingAnswer.question?.marks})</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={evaluatingAnswer.question?.marks}
                  value={evalScore}
                  onChange={(e) => setEvalScore(e.target.value)}
                  required
                  placeholder="Enter numerical mark"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-2xs font-bold text-slate-600 dark:text-slate-400">Evaluator Feedback / Comments</label>
                <textarea
                  rows={3}
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  placeholder="Provide feedback to candidate..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingAnswer(null)}
                  className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGrade}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 text-xs font-bold text-white transition-colors shadow-lg"
                >
                  {savingGrade ? "Saving Grade..." : "Save Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Paper Checking Modal */}
      {isCheckingModalOpen && selectedAttemptId && (
        <StudentPaperCheckingModal
          attemptId={selectedAttemptId}
          examId={examId}
          isOpen={isCheckingModalOpen}
          onClose={() => {
            setIsCheckingModalOpen(false);
            setSelectedAttemptId(null);
            fetchAnalytics();
            fetchPendingGrades();
          }}
        />
      )}

      {/* Proctor Report Modal */}
      {isProctorReportModalOpen && proctorReportSessionId && (
        <ProctorReportModal
          sessionId={proctorReportSessionId}
          studentName={proctorStudentName}
          onClose={() => {
            setIsProctorReportModalOpen(false);
            setProctorReportSessionId(null);
          }}
        />
      )}

    </div>
  );
}
