"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getApiBase, buildAuthHeaders } from '@/utils/api';
import ResumeForm from '@/components/ResumeBuilder/ResumeForm';
import ResumePreview from '@/components/ResumeBuilder/ResumePreview';
import { Download, Save, Loader2, CheckCircle2 } from 'lucide-react';

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
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header - Hidden when printing */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-500">Create an ATS-friendly resume</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-gray-500" />
              ) : saveSuccess ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saveSuccess ? 'Saved!' : 'Save Progress'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
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
