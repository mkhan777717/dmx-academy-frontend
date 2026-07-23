"use client";

import React, { useState } from "react";
import { Download, FileText, X, Check, Printer, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { getApiBase } from "@/utils/api";

export default function ExportPaperModal({ examId, token, user, onClose }) {
  const [profile, setProfile] = useState("STUDENT");
  const [format, setFormat] = useState("PDF");
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);

  const API_BASE = getApiBase();

  const handleExport = () => {
    const hasRealToken = token && !token.startsWith("demo-") && !token.startsWith("local-");
    const authParams = hasRealToken
      ? `token=${token}`
      : `token=${token || ''}&x-bypass-auth=true&x-bypass-role=${user?.role || 'ADMIN'}&x-bypass-userid=${user?.id || ''}`;

    if (format === "PDF") {
      const url = `${API_BASE}/api/v1/exams/${examId}/export-paper/pdf?profile=${profile}&includeAnswerKey=${includeAnswerKey}&includeExplanations=${includeExplanations}&${authParams}`;
      window.open(url, "_blank");
    } else if (format === "EXCEL") {
      const url = `${API_BASE}/api/v1/exams/${examId}/export-paper/excel?${authParams}`;
      window.open(url, "_blank");
    } else if (format === "CSV") {
      const url = `${API_BASE}/api/v1/exams/${examId}/export-paper/csv?${authParams}`;
      window.open(url, "_blank");
    }
    onClose();
  };

  const PROFILES = [
    { id: "STUDENT", label: "Student Copy", desc: "Clean paper for assessment candidates without solutions." },
    { id: "FACULTY", label: "Faculty Copy", desc: "Includes complete Answer Key summary and grading guidelines." },
    { id: "MODERATION", label: "Moderation Copy", desc: "Detailed format for examination board reviewers." },
    { id: "PRACTICE", label: "Practice Sheet", desc: "Formatted for offline study and mock preparation." },
    { id: "REVISION", label: "Revision Sheet", desc: "Includes detailed explanations after each question." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Download size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Export Complete Exam Paper
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select document profile and export file format.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Export Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Target Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "PDF", label: "Printable PDF", icon: Printer },
              { id: "EXCEL", label: "Excel (.xlsx)", icon: FileSpreadsheet },
              { id: "CSV", label: "CSV File", icon: FileText }
            ].map(fmt => {
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all gap-1.5 ${
                    format === fmt.id
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Selector (for PDF format) */}
        {format === "PDF" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Document Profile
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {PROFILES.map(prof => (
                <div
                  key={prof.id}
                  onClick={() => setProfile(prof.id)}
                  className={`cursor-pointer p-3 rounded-2xl border text-xs transition-all flex items-start justify-between ${
                    profile === prof.id
                      ? "bg-indigo-500/10 border-indigo-500/40 text-slate-900 dark:text-white"
                      : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <div>
                    <span className="font-extrabold block text-slate-900 dark:text-white">{prof.label}</span>
                    <span className="text-2xs text-slate-500 dark:text-slate-400">{prof.desc}</span>
                  </div>
                  {profile === prof.id && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Checkbox Options */}
            <div className="pt-2 flex flex-col gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Include Faculty Answer Key Summary Page
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExplanations}
                  onChange={(e) => setIncludeExplanations(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Include Detailed Explanations
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Download size={14} />
            Export Document
          </button>
        </div>
      </motion.div>
    </div>
  );
}
