"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getApiBase, buildAuthHeaders } from '@/utils/api';
import ResumeForm from '@/components/ResumeBuilder/ResumeForm';
import ResumePreview from '@/components/ResumeBuilder/ResumePreview';
import { Download, Save, Loader2, CheckCircle2, FileText } from 'lucide-react';

const defaultResume = {
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
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
        <h1 className="text-4xl font-serif tracking-tight" style={{ color: "var(--text-primary)" }}>Resume Builder</h1>
        <p className="text-sm max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Create an ATS-friendly resume to showcase your skills and experience.
        </p>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Form Editor (Hidden when printing) */}
          <div className="print:hidden">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>

          {/* Right Column: Live Preview */}
          <div className="print:m-0 print:p-0 flex justify-center xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto custom-scrollbar pb-20 print:pb-0">
            <ResumePreview data={resumeData} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
