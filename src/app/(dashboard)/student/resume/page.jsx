"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getApiBase, buildAuthHeaders } from '@/utils/api';
import ResumeForm from '@/components/ResumeBuilder/ResumeForm';
import ResumePreview from '@/components/ResumeBuilder/ResumePreview';
import { Download, Save, Loader2, CheckCircle2, FileText, Target, LayoutTemplate, Star } from 'lucide-react';

const defaultResume = {
  personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

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
  const getATSBg = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-neutral-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] relative animate-fade-in px-0 sm:px-6 pb-12">
      {/* Header - Hidden when printing */}
      <section className="flex flex-col gap-2 border-b pb-6 shrink-0 print:hidden mb-6" style={{ borderColor: "var(--border-primary)" }}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--border-primary)] mb-3 w-fit"
            style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)" }}>
            <FileText size={12} className="text-violet-500" />
            Resume Builder
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-[var(--border-primary)] rounded-xl font-semibold text-sm transition-colors shadow-sm cursor-pointer hover:bg-[var(--bg-secondary)]"
              style={{ 
                backgroundColor: "var(--bg-primary)", 
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)"
              }}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[var(--text-muted)]" />
              ) : saveSuccess ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
              ) : (
                <Save className="w-4 h-4 mr-2 text-violet-500" />
              )}
              {saveSuccess ? 'Saved!' : 'Save Progress'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2.5 rounded-xl font-semibold text-[var(--text-on-accent)] text-sm transition-transform hover:-translate-y-0.5 shadow-md cursor-pointer"
              style={{ 
                background: "var(--accent-primary)"
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black font-display tracking-tight text-gradient">Resume Builder</h1>
            <p className="text-sm max-w-xl mt-1" style={{ color: "var(--text-secondary)" }}>
              Create an ATS-friendly resume to showcase your skills and experience.
            </p>
          </div>
          
          {/* ATS Score Indicator */}
          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 shadow-sm w-full sm:w-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4" style={{ borderColor: "var(--bg-primary)" }}>
              <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-lg text-white ${getATSBg(atsScore)} shadow-inner`}>
                {atsScore}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                <Target size={14} className={getATSColor(atsScore)} />
                ATS Score
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {atsScore >= 80 ? "Excellent! You're ready to apply." : atsScore >= 50 ? "Good, but add more details." : "Needs more sections & keywords."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Form Editor (Hidden when printing) */}
          <div className="print:hidden">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>

          {/* Right Column: Live Preview */}
          <div className="print:m-0 print:p-0 flex flex-col items-center xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto custom-scrollbar pb-20 print:pb-0">
            
            {/* Template Selector */}
            <div className="w-full max-w-[210mm] flex items-center justify-between mb-4 print:hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                <LayoutTemplate size={16} className="text-violet-500" />
                Templates
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {['executive', 'professional', 'contemporary', 'elegant', 'split', 'creative'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTemplate(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      selectedTemplate === t 
                        ? "bg-violet-500 text-white shadow-md shadow-violet-500/20" 
                        : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]"
                    }`}
                    style={selectedTemplate !== t ? { color: "var(--text-secondary)" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
