"use client";

import React, { useState, useRef } from "react";
import { 
  FileUp, Download, CheckCircle2, AlertTriangle, X, 
  ArrowRight, Loader2, Sparkles, Database 
} from "lucide-react";
import { motion } from "framer-motion";
import { buildAuthHeaders, getApiBase } from "@/utils/api";

export default function ImportPaperModal({ examId, token, user, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState("DUPLICATE");
  const [questionBankId, setQuestionBankId] = useState("");
  
  const [previewData, setPreviewData] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);
  const API_BASE = getApiBase();

  const handleDownloadTemplate = (format) => {
    const hasRealToken = token && !token.startsWith("demo-") && !token.startsWith("local-");
    const authParams = hasRealToken
      ? `token=${token}`
      : `x-bypass-auth=true&x-bypass-role=${user?.role || 'ADMIN'}&x-bypass-userid=${user?.id || ''}`;
    window.open(`${API_BASE}/api/v1/exams/template?format=${format}&${authParams}`, "_blank");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewData(null);
      setPreviewError(null);
      runPreview(selected);
    }
  };

  const runPreview = async (selectedFile) => {
    try {
      setLoadingPreview(true);
      setPreviewError(null);
      setProgress(25);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const headers = buildAuthHeaders(token, user);
      delete headers['Content-Type']; // Let browser set multipart boundary

      const res = await fetch(`${API_BASE}/api/v1/exams/${examId}/import-paper/preview`, {
        method: "POST",
        headers,
        body: formData
      });

      const json = await res.json();
      setProgress(100);
      if (json.success) {
        setPreviewData(json);
      } else {
        setPreviewError(json.message || "Failed to preview file format");
      }
    } catch (err) {
      console.error(err);
      setPreviewError("Network error parsing file format");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!file) return;
    try {
      setLoadingImport(true);
      setProgress(40);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("duplicateMode", duplicateMode);
      if (questionBankId) formData.append("questionBankId", questionBankId);

      const headers = buildAuthHeaders(token, user);
      delete headers['Content-Type'];
      headers['X-Idempotency-Key'] = `import_${examId}_${Date.now()}`;

      const res = await fetch(`${API_BASE}/api/v1/exams/${examId}/import-paper`, {
        method: "POST",
        headers,
        body: formData
      });

      const json = await res.json();
      setProgress(100);
      if (json.success) {
        setImportSummary(json.data || json.summary || json);
        if (onSuccess) onSuccess();
      } else {
        alert(json.message || "Bulk import failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error executing bulk paper import");
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileUp size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Bulk Import Question Paper
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload CSV, Excel, or JSON files to automatically create sections and questions.
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

        {/* Template Downloads Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-white/5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              Download Sample Templates
            </span>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Fill offline and upload for instant multi-section import.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadTemplate("csv")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Download size={13} />
              CSV Template
            </button>
            <button
              onClick={() => handleDownloadTemplate("excel")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Download size={13} />
              Excel (.xlsx) Template
            </button>
          </div>
        </div>

        {/* Import Summary Success Screen */}
        {importSummary ? (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-4 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 animate-bounce" />
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Paper Imported Successfully!
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold pt-2">
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-emerald-500/20">
                <span className="block text-xl text-emerald-600 dark:text-emerald-400">{importSummary.questionsImported}</span>
                <span className="text-2xs text-slate-500">Questions Added</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-emerald-500/20">
                <span className="block text-xl text-emerald-600 dark:text-emerald-400">{importSummary.sectionsCreated}</span>
                <span className="text-2xs text-slate-500">Sections Created</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-emerald-500/20">
                <span className="block text-xl text-amber-600 dark:text-amber-400">{importSummary.questionsSkipped}</span>
                <span className="text-2xs text-slate-500">Skipped</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-emerald-500/20">
                <span className="block text-xl text-indigo-600 dark:text-indigo-400">{importSummary.durationSeconds || '<1'}s</span>
                <span className="text-2xs text-slate-500">Execution Time</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
            >
              Done & Return to Builder
            </button>
          </div>
        ) : (
          <>
            {/* File Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-indigo-500/5 transition-all text-center"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, .xlsx, .xls, .json"
                className="hidden"
              />
              <FileUp size={36} className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {file ? file.name : "Click or Drag & Drop Question Paper File"}
              </p>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1">
                Supports CSV, Excel (.xlsx), and JSON formats (Max 15MB)
              </p>
            </div>

            {/* Options Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Duplicate Question Strategy
                </label>
                <select
                  value={duplicateMode}
                  onChange={(e) => setDuplicateMode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DUPLICATE">Create Duplicate Questions</option>
                  <option value="SKIP">Skip Existing Duplicate Titles</option>
                  <option value="REPLACE">Replace & Re-create Section Content</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Database size={13} className="text-indigo-500" />
                  Optionally Link to Question Bank
                </label>
                <input
                  type="number"
                  placeholder="Question Bank ID (Optional)"
                  value={questionBankId}
                  onChange={(e) => setQuestionBankId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Progress Bar & Loader */}
            {(loadingPreview || loadingImport) && (
              <div className="space-y-2 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {loadingImport ? "Importing questions into sections..." : "Analyzing and validating paper format..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {previewError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{previewError}</span>
              </div>
            )}

            {previewData && (() => {
              const stats = previewData.data?.stats || previewData.stats || {};
              const estimates = previewData.data?.estimates || previewData.estimates || {};
              const errors = previewData.data?.validationErrors || previewData.validationErrors || [];
              const sections = previewData.data?.sectionsDetected || previewData.sectionsDetected || [];

              return (
                <div className="space-y-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Dry-Run Validation Estimates
                    </span>
                    {errors.length > 0 ? (
                      <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Validation Errors Found
                      </span>
                    ) : (
                      <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Valid Format Detected
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                      <span className="block text-xs font-extrabold text-slate-400">Total Questions</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{stats.totalQuestions ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                      <span className="block text-xs font-extrabold text-slate-400">MCQ / Coding / Essay</span>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {stats.mcqCount ?? 0} / {stats.codingCount ?? 0} / {stats.descriptiveCount ?? 0}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                      <span className="block text-xs font-extrabold text-slate-400">Sections Detected</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{estimates.sectionsCreated ?? sections.length ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                      <span className="block text-xs font-extrabold text-slate-400">Total Marks</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">{stats.totalMarks ?? 0}</span>
                    </div>
                  </div>

                  {/* Validation Warnings / Errors Log */}
                  {errors.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-2xs text-rose-600 dark:text-rose-400 space-y-1.5">
                      <strong className="block text-xs font-extrabold">Validation Errors Detected ({errors.length}):</strong>
                      {errors.slice(0, 5).map((err, i) => (
                        <div key={i}>• Row {err.row}: {err.message}</div>
                      ))}
                      <div className="pt-1 text-slate-600 dark:text-slate-400 font-semibold italic">
                        💡 Tip: Click &quot;CSV Template&quot; or &quot;Excel Template&quot; above to download the correct Question Paper layout.
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Footer actions */}
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
                disabled={!file || !previewData || loadingImport || (previewData.validationErrors?.length > 0 || previewData.data?.validationErrors?.length > 0)}
                onClick={handleExecuteImport}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                {loadingImport ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                {loadingImport ? "Importing Paper..." : "Confirm & Import Paper"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
