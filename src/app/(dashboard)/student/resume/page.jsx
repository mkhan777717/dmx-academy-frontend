"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getApiBase, buildAuthHeaders } from '@/utils/api';
import ResumeForm from '@/components/ResumeBuilder/ResumeForm';
import ResumePreview from '@/components/ResumeBuilder/ResumePreview';
import { Download, Save, Loader2, CheckCircle2, FileText, Target, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultResume = {
  personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

const TEMPLATES = ['executive', 'professional', 'contemporary', 'elegant', 'split', 'creative'];

// Small named swatches so each template pill hints at its actual look —
// structural information, not decoration.
const TEMPLATE_SWATCH = {
  executive: ['#1f2937', '#7c3aed'],
  professional: ['#1e3a5f', '#3b82f6'],
  contemporary: ['#0f172a', '#06b6d4'],
  elegant: ['#3f2d1f', '#d97757'],
  split: ['#111827', '#f43f5e'],
  creative: ['#312e81', '#f59e0b'],
};

function ATSRing({ score }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bg-primary)" strokeWidth="6" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={score}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="text-sm font-black"
          style={{ color: "var(--text-primary)" }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const { user, token } = useAuth();
  const [resumeData, setResumeData] = useState(defaultResume);
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('executive');

  const calculateATSScore = () => {
    let score = 20;

    if (resumeData.personalInfo) {
      if (resumeData.personalInfo.email && resumeData.personalInfo.phone) score += 5;
      if (resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.portfolio) score += 5;
    }

    if (resumeData.summary && resumeData.summary.length > 50) score += 15;

    if (resumeData.experience && resumeData.experience.length > 0) {
      score += 15;
      if (resumeData.experience.some(exp => exp.description && exp.description.length > 80)) score += 10;
    }

    if (resumeData.education && resumeData.education.length > 0) score += 10;
    if (resumeData.skills && resumeData.skills.length > 3) score += 10;

    if (resumeData.projects && resumeData.projects.length > 0) {
      score += 5;
      if (resumeData.projects.some(p => p.description && p.description.length > 50)) score += 5;
    }

    return Math.min(100, score);
  };

  const atsScore = calculateATSScore();

  const getATSColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const atsMessage = (score) =>
    score >= 80 ? "Excellent! You're ready to apply." :
    score >= 50 ? "Good, but add more details." :
    "Needs more sections & keywords.";

  useEffect(() => {
    if (!user) return;

    const fetchResume = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/resumes`, {
          headers: buildAuthHeaders(token, user),
        });
        const data = await res.json();

        if (data.success && data.resumes && data.resumes.length > 0) {
          const latestResume = data.resumes[0];
          setResumeId(latestResume.id);
          setResumeData({
            personalInfo: latestResume.personalInfo || defaultResume.personalInfo,
            summary: latestResume.summary || '',
            experience: latestResume.experience || [],
            education: latestResume.education || [],
            skills: latestResume.skills || [],
            projects: latestResume.projects || [],
            certifications: latestResume.certifications || []
          });
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [user, token]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const endpoint = resumeId
        ? `${getApiBase()}/api/resumes/${resumeId}`
        : `${getApiBase()}/api/resumes`;

      const method = resumeId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: buildAuthHeaders(token, user),
        body: JSON.stringify(resumeData),
      });

      const data = await res.json();

      if (data.success) {
        if (data.resume && data.resume.id) {
          setResumeId(data.resume.id);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving resume:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Loading your resume...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] relative px-0 sm:px-6 pb-12">
      {/* Header - Hidden when printing */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 border-b pb-6 shrink-0 print:hidden mb-6"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.35 }}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 w-fit shadow-sm"
              style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)" }}
            >
              <FileText size={12} className="text-violet-500" />
              Resume Builder
            </motion.div>
            <h1 className="text-4xl font-serif tracking-tight" style={{ color: "var(--text-primary)" }}>
              Resume Builder
            </h1>
            <p className="text-sm max-w-xl mt-1.5" style={{ color: "var(--text-secondary)" }}>
              Create an ATS-friendly resume to showcase your skills and experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-auto">
            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 border rounded-xl font-semibold text-sm shadow-sm cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)"
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSaving ? (
                    <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-[var(--text-muted)]" />
                      Saving...
                    </motion.span>
                  ) : saveSuccess ? (
                    <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                      Saved!
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                      <Save className="w-4 h-4 mr-2 text-violet-500" />
                      Save Progress
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ y: -2, boxShadow: "0 12px 24px -8px rgba(139,92,246,0.45)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-[var(--text-on-accent)] text-sm shadow-md shadow-violet-500/20 cursor-pointer"
                style={{ background: "var(--accent-primary)" }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </motion.button>
            </div>

            {/* ATS Score Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center gap-4 border rounded-xl p-3 shadow-sm w-full sm:w-auto"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
            >
              <ATSRing score={atsScore} />
              <div className="flex flex-col pr-2">
                <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                  <Target size={14} className={getATSColor(atsScore)} />
                  ATS Score
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {atsMessage(atsScore)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">

          {/* Left Column: Form Editor (Hidden when printing) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="print:hidden"
          >
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </motion.div>

          {/* Right Column: Live Preview */}
          <div className="print:m-0 print:p-0 flex flex-col items-center xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] pb-20 print:pb-0 w-full overflow-hidden">

            {/* Template Selector */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-full xl:max-w-[210mm] flex items-center mb-5 print:hidden border rounded-xl p-1.5 shadow-sm"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest shrink-0 px-3 border-r" style={{ color: "var(--text-secondary)", borderColor: "var(--border-primary)" }}>
                <LayoutTemplate size={14} className="text-violet-500" />
                Templates
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap pl-3 pr-2 scrollbar-hide py-1">
                {TEMPLATES.map(t => {
                  const isActive = selectedTemplate === t;
                  const [c1, c2] = TEMPLATE_SWATCH[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTemplate(t)}
                      className="relative px-4 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap shrink-0 flex items-center gap-2"
                      style={!isActive ? { color: "var(--text-secondary)" } : { color: "#fff" }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="templatePill"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-violet-500 shadow-md shadow-violet-500/20"
                        />
                      )}
                      <span
                        className="relative z-10 w-2 h-2 rounded-full ring-1 ring-black/10"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                      />
                      <span className="relative z-10">{t}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full overflow-x-auto custom-scrollbar pb-4"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="w-max mx-auto origin-top"
                >
                  <ResumePreview data={resumeData} template={selectedTemplate} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}