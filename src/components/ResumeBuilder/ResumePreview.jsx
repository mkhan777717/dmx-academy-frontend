import React from 'react';

export default function ResumePreview({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  // Helper to split description by newlines for bullet points
  const renderBullets = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return (
      <ul className="list-disc ml-5 mt-1 text-[11pt] text-gray-800 space-y-0.5">
        {lines.map((line, i) => (
          <li key={i}>{line.replace(/^[-*]\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white mx-auto shadow-2xl print:shadow-none" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm' }}>
      <div className="font-sans text-gray-900 max-w-full">
        
        {/* Header / Personal Info */}
        <div className="text-center mb-5 border-b border-gray-400 pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-gray-900">
            {fullName || 'Your Name'}
          </h1>
          <div className="text-[11pt] text-gray-700 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.email && personalInfo?.phone && <span className="text-gray-400">|</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.phone && personalInfo?.location && <span className="text-gray-400">|</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
            {personalInfo?.linkedin && (
              <>
                <span className="text-gray-400">|</span>
                <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
              </>
            )}
            {personalInfo?.github && (
              <>
                <span className="text-gray-400">|</span>
                <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
              </>
            )}
            {personalInfo?.portfolio && (
              <>
                <span className="text-gray-400">|</span>
                <span>{personalInfo.portfolio.replace(/^https?:\/\//, '')}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-2 pb-0.5 text-gray-900 tracking-wider">
              Professional Summary
            </h2>
            <p className="text-[11pt] text-gray-800 leading-relaxed">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-3 pb-0.5 text-gray-900 tracking-wider">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[11pt] text-gray-900">{exp.position}</h3>
                    <span className="text-[10pt] text-gray-700 italic">
                      {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11pt] font-medium text-gray-800 italic mb-1">{exp.company}</div>
                  {renderBullets(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-3 pb-0.5 text-gray-900 tracking-wider">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[11pt] text-gray-900 flex items-center gap-2">
                      {proj.name}
                      {proj.link && <span className="text-[9pt] font-normal text-blue-600 underline">({proj.link})</span>}
                    </h3>
                  </div>
                  {proj.tools && <div className="text-[10pt] font-medium text-gray-700 mb-1">Technologies: {proj.tools}</div>}
                  {renderBullets(proj.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-3 pb-0.5 text-gray-900 tracking-wider">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[11pt] text-gray-900">{edu.institution}</h3>
                    <span className="text-[10pt] text-gray-700 italic">
                      {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[11pt] text-gray-800">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-3 pb-0.5 text-gray-900 tracking-wider">
              Skills
            </h2>
            <div className="text-[11pt] text-gray-800 leading-relaxed">
              {skills.map(s => s.name).join(', ')}
            </div>
          </section>
        )}

        {/* Certifications (if any) */}
        {certifications && certifications.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12pt] font-bold uppercase border-b border-gray-300 mb-3 pb-0.5 text-gray-900 tracking-wider">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-baseline text-[11pt] text-gray-800">
                  <span><span className="font-bold">{cert.name}</span>, {cert.issuer}</span>
                  <span className="text-[10pt] text-gray-700 italic">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
