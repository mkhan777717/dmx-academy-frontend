"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { 
  ArrowLeft, Calendar, FileText, ChevronRight, AlertCircle, Clock 
} from "lucide-react";

export default function CreateExamWizard() {
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [resultReleasePolicy, setResultReleasePolicy] = useState("IMMEDIATE");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isTeacher = user?.role === "ADMIN" || user?.role === "MENTOR" || user?.role === "INSTITUTE_ADMIN";

  React.useEffect(() => {
    if (user && !isTeacher) {
      router.push("/exams");
    }
  }, [user, isTeacher, router]);

  const API_BASE = getApiBase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Exam Title is required");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and End dates are required");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End Date must be after the Start Date");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          description,
          duration: parseInt(duration, 10) || 60,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          timezone,
          resultReleasePolicy,
          settings: {
            shuffleQuestions: false,
            shuffleOptions: false,
            negativeMarking: false,
            autoSubmit: true,
            fullscreenEnforcement: false,
            allowNavigation: true,
            allowReview: true,
            randomQuestionOrder: false,
            multipleAttempts: false,
            maxAttempts: 1,
            calculatorAllowed: false,
            copyPasteRestriction: false,
            webcamRequirement: false
          },
          instructions: ["Read all questions carefully.", "Do not switch tabs during code execution."]
        })
      });

      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(`/exams/${json.data.id}/build`);
      } else {
        setError(json.message || "Failed to initialize exam draft");
      }
    } catch (err) {
      console.error(err);
      setError("Network connection issue creating draft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-6 space-y-6 max-w-2xl mx-auto font-sans">
      <button
        onClick={() => router.push("/exams")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Exam Wizard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up the basic information, duration timings, and policies for your new examination.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-500 dark:text-rose-400 font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Exam Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Midterm Algorithms Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Description</label>
              <textarea
                rows={3}
                placeholder="Provide instructions or background about this assessment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock size={13} className="text-indigo-500" /> Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                max="600"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Start Date & Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">End Date & Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Policies & Timezones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                <option value="America/New_York">EST (America/New_York)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Result Release Policy</label>
              <select
                value={resultReleasePolicy}
                onChange={(e) => setResultReleasePolicy(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="IMMEDIATE">Immediate (MCQ Auto-grade)</option>
                <option value="MANUAL">Manual Reviewer Release</option>
                <option value="AFTER_DEADLINE">After Window Deadline</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Create Draft & Open Builder"}
            {!loading && <ChevronRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
