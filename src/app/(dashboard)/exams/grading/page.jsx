"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { 
  FileText, Award, User, Clock, CheckCircle2, 
  AlertCircle, RefreshCw, X, MessageSquare, BookOpen 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherGradingDesk() {
  const { user, token } = useAuth();
  const API_BASE = getApiBase();

  const [pendingGrades, setPendingGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected answer for modal grading desk
  const [activeGrade, setActiveGrade] = useState(null);
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingGrades();
  }, [user, token]);

  const fetchPendingGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = buildAuthHeaders(token, user);
      // Calls /api/v1/exams/grading/pending
      const res = await fetch(`${API_BASE}/api/v1/exams/grading/pending`, { headers });
      const json = await res.json();
      if (json.success) {
        setPendingGrades(json.data || []);
      } else {
        setError(json.message || "Failed to load pending manual grading lists");
      }
    } catch (err) {
      console.error(err);
      setError("Network issue loading grading workspace");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradingDesk = (answer) => {
    setActiveGrade(answer);
    setScore(answer.score || "");
    setComments(answer.comments || "");
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!activeGrade) return;

    const parsedScore = parseFloat(score);
    const maxMarks = activeGrade.question?.marks || 10;

    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > maxMarks) {
      alert(`Invalid Score. Score must be between 0 and maximum marks (${maxMarks} Marks).`);
      return;
    }

    try {
      setSubmitting(true);
      const headers = buildAuthHeaders(token, user);
      // PATCH /api/v1/exams/answers/:id/manual-grade
      const res = await fetch(`${API_BASE}/api/v1/exams/answers/${activeGrade.id}/manual-grade`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ score: parsedScore, comments })
      });

      const json = await res.json();
      if (json.success) {
        alert("Grade recorded and attempt totals recalculated successfully!");
        setActiveGrade(null);
        fetchPendingGrades();
      } else {
        alert(json.message || "Failed to save manual grade");
      }
    } catch (err) {
      alert("Network error connecting to manual grading API");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading pending answers list...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Award size={12} />
            Grading Desk
          </span>
          <h1 className="text-3xl font-extrabold text-white">Manual Essay Review</h1>
          <p className="max-w-md text-xs text-slate-400">
            Grade candidate essay answers, review criteria rubrics side-by-side, and leave feedback comments.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {pendingGrades.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-white/10 bg-slate-900/20">
          <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">All caught up!</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-2">
            No descriptive questions are currently pending manual reviewer scoring for this institute.
          </p>
        </div>
      )}

      {/* Pending Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingGrades.map((ans) => (
          <div
            key={ans.id}
            onClick={() => handleOpenGradingDesk(ans)}
            className="group cursor-pointer rounded-2xl border border-white/5 bg-slate-900/30 p-6 space-y-4 hover:border-white/10 hover:bg-slate-900/50 transition-all shadow-md"
          >
            <div className="flex justify-between items-center text-3xs text-slate-500 font-extrabold uppercase">
              <span>Section: {ans.question?.title || "Essay"}</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                Pending Grade
              </span>
            </div>

            <h3 className="text-sm font-bold text-white line-clamp-1">
              Question: {ans.question?.text || "Descriptive Essay Response"}
            </h3>

            <div className="space-y-2 border-t border-white/5 pt-4 text-2xs text-slate-400">
              <div className="flex items-center gap-2">
                <User size={12} className="text-slate-500" />
                <span>Candidate Attempt #{ans.attemptId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={12} className="text-slate-500" />
                <span>Weight: {ans.question?.marks} Max Marks</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenGradingDesk(ans)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 py-2.5 text-2xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              Open Grading Desk
            </button>
          </div>
        ))}
      </div>

      {/* ── Grading Desk Modal Overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {activeGrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900 p-6 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-hidden"
            >
              
              {/* Left Column: Reference parameters & Question details */}
              <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2 border-r border-white/5">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-white text-md">Grading Workspace</h3>
                  <span className="text-2xs font-extrabold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                    Max Score: {activeGrade.question?.marks} Marks
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-3xs font-extrabold uppercase text-slate-500">Question Title</span>
                    <h4 className="text-sm font-bold text-white">{activeGrade.question?.title}</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xs font-extrabold uppercase text-slate-500">Statement</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-white/5">
                      {activeGrade.question?.text}
                    </p>
                  </div>

                  {activeGrade.question?.descriptiveQuestion?.rubric && (
                    <div className="space-y-1">
                      <span className="text-3xs font-extrabold uppercase text-slate-500 flex items-center gap-1">
                        <BookOpen size={12} /> Grading Rubric Guideline
                      </span>
                      <p className="text-xs text-indigo-400 leading-relaxed bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/15">
                        {activeGrade.question.descriptiveQuestion.rubric}
                      </p>
                    </div>
                  )}

                  {activeGrade.question?.descriptiveQuestion?.sampleAnswer && (
                    <div className="space-y-1">
                      <span className="text-3xs font-extrabold uppercase text-slate-500 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Reference Sample Solution
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-xl border border-white/5">
                        {activeGrade.question.descriptiveQuestion.sampleAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Student Response workspace and Score submission */}
              <div className="flex-1 flex flex-col justify-between space-y-6 overflow-y-auto pl-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-white text-md">Student Answer</h3>
                  <button onClick={() => setActiveGrade(null)} className="text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-3xs font-extrabold uppercase text-slate-500">Candidate Response Input</span>
                  <div className="text-xs text-slate-200 bg-slate-950 p-5 rounded-xl border border-white/5 min-h-36 leading-relaxed whitespace-pre-wrap">
                    {activeGrade.descriptiveAnswer || "No text answer response provided."}
                  </div>
                </div>

                {/* File Attachment reference */}
                {activeGrade.descriptiveFileUrl && (
                  <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-between text-2xs text-indigo-400">
                    <span>Attached Document: {activeGrade.descriptiveFileName || "File submission"}</span>
                    <a
                      href={activeGrade.descriptiveFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                      View File Attachment
                    </a>
                  </div>
                )}

                {/* Scoring Form */}
                <form onSubmit={handleSubmitGrade} className="space-y-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Awarded Score</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        placeholder="Marks"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Review Comments</label>
                      <input
                        type="text"
                        placeholder="Add scoring feedback comments..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg transition-colors hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? "Recalculating Grade..." : "Submit Manual Grade & Lock"}
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
