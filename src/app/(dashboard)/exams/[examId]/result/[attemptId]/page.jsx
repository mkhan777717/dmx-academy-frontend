"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { ArrowLeft, Clock, Award, CheckCircle2, AlertTriangle } from "lucide-react";

export default function StudentScorecard() {
  const { attemptId } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const API_BASE = getApiBase();

  const [scorecard, setScorecard] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScorecardDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${attemptId}/result`, { headers });
      const json = await res.json();
      
      if (json.success && json.data) {
        setScorecard(json.data);
        setBreakdown(json.breakdown || []);
      } else {
        setError(json.message || "Failed to load exam scorecard. Grading might still be in progress.");
      }
    } catch (err) {
      console.error(err);
      setError("Network issue loading candidate scorecard");
    } finally {
      setLoading(false);
    }
  }, [token, user, API_BASE, attemptId]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchScorecardDetails();
    });
    return () => {
      isMounted = false;
    };
  }, [fetchScorecardDetails]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4 font-sans">
        <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading exam scorecard sheet...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center font-sans">
        <AlertTriangle size={36} className="text-rose-500" />
        <h3 className="text-md font-bold text-white">Scorecard Unavailable</h3>
        <p className="text-xs text-slate-400 max-w-xs">{error}</p>
        <button
          onClick={() => router.push("/exams")}
          className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const maxMarksVal = scorecard?.totalMarks || scorecard?.examVersion?.maxMarks || scorecard?.attempt?.examVersion?.maxMarks || 0;
  const passedExam = scorecard && scorecard.score >= (maxMarksVal * 0.4);

  return (
    <div className="min-h-screen text-slate-100 p-6 space-y-6 max-w-4xl mx-auto font-sans">
      
      <button
        onClick={() => router.push("/exams")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Exams List
      </button>

      {scorecard && (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 size={12} />
                Assessment Results released
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{scorecard.examVersion?.title || scorecard.attempt?.examVersion?.title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Candidate assessment card verified by grading reviewers.
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-6 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center shrink-0 min-w-36 shadow-sm">
              <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">Final Score</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {scorecard.score}
              </span>
              <span className="text-3xs text-slate-500 font-bold">out of {maxMarksVal} Marks</span>
            </div>
          </div>

          {/* Time parameters detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-200 dark:border-white/5 py-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block">Assessment Duration limit</span>
              <span className="font-bold text-slate-900 dark:text-white">{scorecard.examVersion?.duration || scorecard.attempt?.examVersion?.duration || 120} Minutes</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block">Submission Date</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {new Date(scorecard.endTime || scorecard.startTime || scorecard.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Passing Indicator Banners */}
          <div className={`rounded-2xl p-5 flex gap-3 text-xs leading-relaxed ${
            passedExam 
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400"
          }`}>
            <Award size={20} className="shrink-0 animate-bounce" />
            <div className="space-y-1">
              <h5 className="font-bold">{passedExam ? "Congratulations! Pass Standard Met" : "Revision Suggested"}</h5>
              <p className="text-2xs text-slate-600 dark:text-slate-400">
                {passedExam 
                  ? "You have successfully achieved the minimum marks boundary required for this assessment."
                  : "Your marks score fell below the target passing baseline. Review incorrect answers below."
                }
              </p>
            </div>
          </div>

          {/* Breakdown Section lists */}
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-white/5">
            <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Breakdown of Question Responses</h3>
            
            <div className="space-y-6">
              {breakdown.map((ans, idx) => {
                const q = ans.question || {};
                const marksAwarded = ans.score || 0;

                const rawSelections = ans.mcqOptionIds || ans.mcqAnswers?.map(m => m.optionIdRef ?? m.optionId) || [];
                const studentSelectedStrIds = rawSelections.map(id => String(id));

                return (
                  <div key={ans.id} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-3xs text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">
                          Question #{idx + 1} • {q.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.title}</h4>
                      </div>
                      
                      {/* Points Card */}
                      {q.type !== "MCQ" && !ans.isGraded && !ans.manualGrade ? (
                        <span className="text-2xs font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-600 dark:text-amber-400">
                          Pending Evaluation
                        </span>
                      ) : (
                        <span className={`text-2xs font-extrabold px-2.5 py-1 rounded border ${
                          marksAwarded > 0 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                        }`}>
                          {marksAwarded} / {q.marks} Marks
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{q.text}</p>

                    {/* Renders dynamic choices details */}
                    {q.type === "MCQ" && (
                      <div className="space-y-2 pt-2 text-2xs">
                        {q.mcqOptions?.map((opt) => {
                          const isStudentChecked = studentSelectedStrIds.includes(String(opt.id));
                          const isCorrectOption = opt.isCorrect;

                          let borderClass = "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400";
                          if (isStudentChecked && isCorrectOption) {
                            borderClass = "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs";
                          } else if (isStudentChecked && !isCorrectOption) {
                            borderClass = "border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold shadow-xs";
                          } else if (isCorrectOption) {
                            borderClass = "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
                          }

                          return (
                            <div key={opt.id} className={`p-3.5 rounded-xl border flex justify-between items-center transition-all ${borderClass}`}>
                              <span>{opt.text}</span>
                              <div className="flex items-center gap-2 font-extrabold text-3xs uppercase">
                                {isStudentChecked && (
                                  <span className={`px-2 py-0.5 rounded ${isCorrectOption ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/20 text-rose-700 dark:text-rose-300"}`}>
                                    Your Answer
                                  </span>
                                )}
                                {isCorrectOption && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "DESCRIPTIVE" && (
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <span className="text-3xs font-extrabold uppercase text-slate-500">Your Submission</span>
                          <p className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {ans.descriptiveAnswer || "No answer text inputed."}
                          </p>
                        </div>

                        {ans.manualGrade && (
                          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1 text-xs">
                            <span className="font-extrabold text-indigo-400">Grader Comments:</span>
                            <p className="text-slate-300">{ans.manualGrade.comments || "No comments provided."}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {q.type === "CODING" && (
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <span className="text-3xs font-extrabold uppercase text-slate-500">Submitted Code Solution ({ans.codingLanguage || "JavaScript"})</span>
                          <pre className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-950 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                            {ans.codingCode || "// No code submitted"}
                          </pre>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
