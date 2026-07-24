"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { 
  X, CheckCircle2, AlertCircle, Clock, Award, 
  User, BookOpen, Code, FileText, Send, AlertTriangle, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentPaperCheckingModal({
  attemptId,
  examId,
  isOpen,
  onClose,
  onGradedSuccess
}) {
  const { user, token } = useAuth();
  const API_BASE = getApiBase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  
  // Local state for grading inputs: { [itemKey]: { score, comments, saving, saved } }
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    if (isOpen && attemptId) {
      loadPaperForChecking();
    }
  }, [isOpen, attemptId]);

  const getAnswerKey = (ans, idx) => {
    if (ans?.id) return String(ans.id);
    if (ans?.questionId) return `q_${ans.questionId}`;
    if (ans?.question?.id) return `q_${ans.question.id}`;
    return `item_${idx}`;
  };

  const loadPaperForChecking = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = buildAuthHeaders(token, user);

      // Fetch result breakdown which performs on-demand auto-grading calculation for MCQs & Coding
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/result`, { headers });
      const json = await res.json();

      let breakdownList = [];
      if (json.success) {
        setAttemptData(json.data || json.result);
        breakdownList = json.breakdown || json.answers || json.data?.answers || [];
        setBreakdown(breakdownList);
      } else {
        // Fallback to basic attempt details if result endpoint is pending
        const attemptRes = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}`, { headers });
        const attemptJson = await attemptRes.json();
        if (attemptJson.success && attemptJson.data) {
          setAttemptData(attemptJson.data);
          
          // Flatten questions from sections
          (attemptJson.data.examVersion?.sections || []).forEach(sec => {
            (sec.questions || []).forEach(q => {
              const matchedAns = (attemptJson.data.answers || []).find(a => a.questionId === q.id) || {};
              breakdownList.push({
                ...matchedAns,
                questionId: q.id,
                question: q
              });
            });
          });
          setBreakdown(breakdownList);
        } else {
          setError(json.message || "Failed to retrieve student attempt data for paper checking.");
          return;
        }
      }

      // Initialize grade inputs state for descriptive answers
      const initialInputs = {};
      breakdownList.forEach((ans, idx) => {
        const itemKey = getAnswerKey(ans, idx);
        initialInputs[itemKey] = {
          score: ans.manualGrade?.score !== undefined 
            ? String(ans.manualGrade.score) 
            : (ans.score !== undefined && ans.score !== null ? String(ans.score) : ""),
          comments: ans.manualGrade?.comments || "",
          saving: false,
          saved: ans.isGraded || ans.manualGrade !== null
        };
      });
      setGradeInputs(initialInputs);

    } catch (err) {
      console.error(err);
      setError("Network issue loading student paper for evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (itemKey, val) => {
    setGradeInputs((prev) => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || {}),
        score: val,
        saved: false
      }
    }));
  };

  const handleCommentsChange = (itemKey, val) => {
    setGradeInputs((prev) => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || {}),
        comments: val,
        saved: false
      }
    }));
  };

  const handleSaveIndividualGrade = async (ans, itemKey) => {
    const key = itemKey || getAnswerKey(ans, 0);
    const inputState = gradeInputs[key];
    if (!inputState) return;

    const parsedScore = parseFloat(inputState.score);
    const maxMarks = ans.question?.marks || 10;

    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > maxMarks) {
      alert(`Invalid score. Enter a mark between 0 and maximum question marks (${maxMarks}).`);
      return;
    }

    try {
      setGradeInputs((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || {}), saving: true }
      }));

      const headers = buildAuthHeaders(token, user);
      const targetAnsId = ans.id || 0;
      const qId = ans.question?.id || ans.questionId;

      const res = await fetch(`${API_BASE}/api/v1/exams/answers/${targetAnsId}/manual-grade`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          score: parsedScore,
          comments: inputState.comments,
          attemptId: parseInt(attemptId, 10),
          questionId: qId ? parseInt(qId, 10) : null
        })
      });

      const json = await res.json();
      if (json.success) {
        const newAnsId = json.data?.answerId || ans.id;
        setGradeInputs((prev) => ({
          ...prev,
          [key]: { ...(prev[key] || {}), saving: false, saved: true }
        }));
        
        // Dynamically update local breakdown items so card score badge updates immediately
        setBreakdown((prev) =>
          prev.map((item, idx) => {
            const k = getAnswerKey(item, idx);
            return k === key
              ? { ...item, id: newAnsId || item.id, score: parsedScore, isGraded: true }
              : item;
          })
        );

        if (onGradedSuccess) onGradedSuccess();
      } else {
        alert(json.message || "Failed to save score");
        setGradeInputs((prev) => ({
          ...prev,
          [key]: { ...(prev[key] || {}), saving: false }
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Network error saving grade");
      setGradeInputs((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || {}), saving: false }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 text-slate-100 p-6 flex flex-col max-h-[92vh] overflow-hidden shadow-2xl font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Award size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  Paper Checking & Evaluation Workspace
                </h2>
                <p className="text-2xs text-slate-400">
                  Candidate Attempt #{attemptId} • Auto-checked MCQs & Coding, Mentor-evaluated Descriptive questions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-3 py-16">
              <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="text-xs text-slate-400">Loading student paper & evaluating questions...</span>
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-3 py-16 text-center">
              <AlertTriangle size={36} className="text-rose-500" />
              <h3 className="text-sm font-bold text-white">Paper Load Failed</h3>
              <p className="text-xs text-slate-400 max-w-xs">{error}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 py-4">
              
              {/* Candidate Banner */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-3xs uppercase font-extrabold text-slate-500">Candidate Student</span>
                  <div className="font-bold text-white">
                    {attemptData?.user?.username || attemptData?.attempt?.user?.username || `Student #${attemptData?.userId || ''}`}
                    <span className="text-slate-400 text-3xs font-normal ml-2">
                      ({attemptData?.user?.email || attemptData?.attempt?.user?.email || ''})
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-3xs uppercase font-extrabold text-slate-500">Attempt Status</span>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase">
                      {attemptData?.status || attemptData?.attempt?.status || "SUBMITTED"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {breakdown.map((ans, idx) => {
                  const q = ans.question || {};
                  const itemKey = getAnswerKey(ans, idx);
                  const inputState = gradeInputs[itemKey] || { score: "", comments: "", saving: false, saved: false };
                  const isDescriptive = q.type === "DESCRIPTIVE";

                  return (
                    <div 
                      key={itemKey}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3"
                    >
                      {/* Question Title & Type Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-black text-indigo-400">Q{idx + 1}.</span>
                            <span className="text-xs font-bold text-white">{q.title || `Question #${q.id}`}</span>
                          </div>
                          <p className="text-2xs text-slate-400 leading-relaxed">{q.text}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-white/5 border border-white/10 text-slate-300 uppercase">
                            {q.type}
                          </span>
                          <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                            {ans.score !== undefined && ans.score !== null ? `${ans.score} / ${q.marks}` : `-- / ${q.marks}`} Marks
                          </span>
                        </div>
                      </div>

                      {/* Question Answer Content Preview */}
                      {q.type === "MCQ" && (
                        <div className="text-2xs space-y-1 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                          <span className="text-3xs font-extrabold text-slate-500 uppercase block">Auto-Checked MCQ Status</span>
                          {ans.score > 0 ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Correct Choice (+{ans.score} Marks)
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <X size={12} /> Incorrect / Unattempted Option
                            </span>
                          )}
                        </div>
                      )}

                      {q.type === "CODING" && (
                        <div className="text-2xs space-y-2 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                          <span className="text-3xs font-extrabold text-slate-500 uppercase block">Auto-Evaluated Code Execution</span>
                          <div className="flex items-center justify-between text-3xs">
                            <span className="font-mono text-slate-300">Lang: {ans.codingLanguage || "N/A"}</span>
                            <span className="font-bold text-indigo-400">Awarded: {ans.score || 0} / {q.marks} Marks</span>
                          </div>
                          {ans.codingCode && (
                            <pre className="p-2 rounded bg-slate-950 font-mono text-3xs text-slate-300 overflow-x-auto max-h-32">
                              {ans.codingCode}
                            </pre>
                          )}
                        </div>
                      )}

                      {isDescriptive && (
                        <div className="space-y-3">
                          {/* Student Response */}
                          <div className="space-y-1">
                            <span className="text-3xs font-extrabold text-slate-500 uppercase block">Student Descriptive Response</span>
                            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-200 min-h-[50px] whitespace-pre-wrap">
                              {ans.descriptiveAnswer || <span className="text-slate-500 italic">No descriptive response written by student</span>}
                            </div>
                            {ans.descriptiveFileUrl && (
                              <a 
                                href={ans.descriptiveFileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-3xs font-bold text-indigo-400 hover:underline"
                              >
                                <FileText size={10} /> View Attached Student Submission File
                              </a>
                            )}
                          </div>

                          {/* Mentor Grading Input Box */}
                          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-3">
                            <div className="flex items-center gap-1.5 text-2xs font-extrabold text-amber-400 uppercase">
                              <Award size={14} /> Assign Descriptive Score
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-3xs font-extrabold text-slate-400 uppercase">
                                  Awarded Score (Max {q.marks})
                                </label>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max={q.marks}
                                  value={inputState.score}
                                  onChange={(e) => handleScoreChange(itemKey, e.target.value)}
                                  placeholder="Score"
                                  className="w-full rounded-xl bg-slate-950 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="md:col-span-2 space-y-1">
                                <label className="text-3xs font-extrabold text-slate-400 uppercase">
                                  Evaluator Feedback Comments
                                </label>
                                <input
                                  type="text"
                                  value={inputState.comments}
                                  onChange={(e) => handleCommentsChange(itemKey, e.target.value)}
                                  placeholder="Add evaluation comments..."
                                  className="w-full rounded-xl bg-slate-950 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              {inputState.saved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xs font-extrabold">
                                  <CheckCircle2 size={12} />
                                  Grade Saved ({inputState.score} / {q.marks} Marks)
                                </span>
                              ) : <div />}

                              <button
                                type="button"
                                disabled={inputState.saving}
                                onClick={() => handleSaveIndividualGrade(ans, itemKey)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 shadow-md cursor-pointer ${
                                  inputState.saved
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                }`}
                              >
                                {inputState.saving ? (
                                  <>
                                    <Clock size={13} className="animate-spin" />
                                    Saving Score...
                                  </>
                                ) : inputState.saved ? (
                                  <>
                                    <CheckCircle2 size={13} />
                                    Score Saved!
                                  </>
                                ) : (
                                  <>
                                    <Send size={13} />
                                    Save Question Score
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-white/10 pt-4 shrink-0">
            <span className="text-2xs text-slate-400">
              Total questions reviewed: {breakdown.length}
            </span>

            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg"
            >
              Done & Close Desk
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
