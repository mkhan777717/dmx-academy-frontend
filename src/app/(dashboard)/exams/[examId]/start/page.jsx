"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import { 
  ArrowLeft, Lock, Play, AlertCircle, FileText, 
  ShieldAlert, Clock, CheckCircle2 
} from "lucide-react";

export default function ExamStartGateway() {
  const { examId } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = getApiBase();

  useEffect(() => {
    fetchExamMetadata();
  }, [examId]);

  const fetchExamMetadata = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/exams/${examId}`, { headers });
      const json = await res.json();
      if (json.success) {
        setExam(json.data);
      } else {
        setError(json.message || "Failed to load exam details");
      }
    } catch (err) {
      console.error(err);
      setError("Network error pulling exam details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (e) => {
    e.preventDefault();
    try {
      setStarting(true);
      setError(null);
      
      const headers = buildAuthHeaders(token, user);
      const res = await fetch(`${API_BASE}/api/v1/attempts/${examId}/start`, {
        method: "POST",
        headers,
        body: JSON.stringify({ password })
      });

      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(`/exams/${examId}/attempt/${json.data.id}`);
      } else {
        setError(json.message || "Failed to start attempt");
      }
    } catch (err) {
      console.error(err);
      setError("Network connection issue initializing attempt");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading instructions check...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 p-6 space-y-6 max-w-2xl mx-auto font-sans">
      <button
        onClick={() => router.push("/exams")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Exams List
      </button>

      {exam && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-2xs font-extrabold text-indigo-400 uppercase">
              Assigned Candidate Gateway
            </span>
            <h1 className="text-3xl font-black text-white">{exam.title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed">{exam.description}</p>
          </div>

          {/* Secure details card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-white/5 py-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block">Assessment Duration</span>
              <span className="font-bold text-white">120 Minutes (Server Sync)</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block">Total Permitted Attempts</span>
              <span className="font-bold text-white">
                {exam.settings?.maxAttempts || 1} Attempt limit
              </span>
            </div>
          </div>

          {/* Warning / Honor Code */}
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-5 flex gap-3 text-xs leading-relaxed text-amber-400">
            <ShieldAlert size={20} className="shrink-0" />
            <div className="space-y-1">
              <h5 className="font-bold">Honor Code & Proctored Restrictions</h5>
              <p className="text-2xs text-slate-400">
                This exam enforces strict anti-cheat restrictions. Tab switches, copy-paste bypasses, and leaving fullscreen mode will log proctor violations immediately.
              </p>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Candidate Instructions</h4>
            <div className="space-y-2">
              {(exam.instructions && exam.instructions.length > 0) ? (
                exam.instructions.map((inst, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{inst.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No instructions specified by the instructor.</p>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Password Gateway Form */}
          <form onSubmit={handleStartExam} className="space-y-4 pt-4 border-t border-white/5">
            {exam.settings?.password && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lock size={12} /> Access Password Required
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter authorized exam password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={starting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {starting ? "Starting Attempt..." : "Acknowledge Rules & Start Exam"}
              {!starting && <Play size={14} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
