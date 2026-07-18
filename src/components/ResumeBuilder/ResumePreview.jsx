import React from 'react';

// Helper to render bullet lists
const renderBullets = (text, className) => {
  if (!text) return null;
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return (
    <ul className={className || "list-disc ml-5 mt-1 space-y-1"}>
      {lines.map((line, i) => (
        <li key={i}>{line.replace(/^[-*]\s*/, '')}</li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------
// TEMPLATE 1: Executive (Alice Thompson style)
// ---------------------------------------------------------
const TemplateExecutive = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-sans text-gray-900 leading-tight">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-1 text-slate-900">{fullName || 'Your Name'}</h1>
          {(personalInfo?.location) && (
            <div className="text-indigo-600 uppercase text-xs tracking-wider font-semibold">
              {personalInfo?.title || 'Professional Title'}
            </div>
          )}
        </div>
        <div className="text-right text-[9pt] text-gray-700 space-y-0.5">
          {personalInfo?.phone && <div>{personalInfo.phone}</div>}
          {personalInfo?.email && <div>{personalInfo.email}</div>}
          {personalInfo?.location && <div>{personalInfo.location}</div>}
          {personalInfo?.linkedin && <div>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</div>}
        </div>
      </div>

      {summary && (
        <div className="mb-5 text-[10pt] leading-relaxed text-gray-800">
          {summary}
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-center font-bold uppercase tracking-widest text-[11pt] mb-3 text-indigo-900">Work Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[10.5pt]">
                  <span>{exp.position}</span>
                  <span className="font-normal text-gray-600 text-[9.5pt]">
                    {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                  </span>
                </div>
                <div className="font-semibold text-gray-800 text-[10pt] mb-1">{exp.company}</div>
                {renderBullets(exp.description, "list-disc ml-5 mt-1 text-[10pt] text-gray-800 space-y-0.5")}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-center font-bold uppercase tracking-widest text-[11pt] mb-3 text-indigo-900">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[10.5pt]">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="font-normal text-gray-600 text-[9.5pt]">
                    {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                  </span>
                </div>
                <div className="text-gray-800 text-[10pt]">{edu.institution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-center font-bold uppercase tracking-widest text-[11pt] mb-3 text-indigo-900">Skills</h2>
          <ul className="list-disc ml-5 grid grid-cols-2 text-[10pt] text-gray-800 gap-y-1">
            {skills.map((skill, i) => (
              <li key={i}>{skill.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-center font-bold uppercase tracking-widest text-[11pt] mb-3 text-indigo-900">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="font-bold text-[10.5pt]">{proj.name} {proj.link && <span className="font-normal text-gray-500 text-[9pt]">| {proj.link}</span>}</div>
                {proj.tools && <div className="text-[9.5pt] italic text-gray-600 mb-1">{proj.tools}</div>}
                {renderBullets(proj.description, "list-disc ml-5 mt-1 text-[10pt] text-gray-800 space-y-0.5")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// TEMPLATE 2: Professional (Emily Roberts style)
// ---------------------------------------------------------
const TemplateProfessional = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-sans text-gray-900 leading-tight">
      <div className="text-center mb-3">
        <h1 className="text-4xl font-black uppercase tracking-wide mb-1 text-slate-800">{fullName || 'Your Name'}</h1>
        {personalInfo?.title && <div className="text-teal-700 uppercase tracking-widest text-[10pt] font-bold mt-1">{personalInfo.title}</div>}
      </div>
      
      {(personalInfo?.location || personalInfo?.phone || personalInfo?.email || personalInfo?.linkedin) && (
        <div className="bg-slate-800 text-white text-[9.5pt] py-1.5 px-4 mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 font-medium">
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.location && personalInfo?.phone && <span>•</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.phone && personalInfo?.email && <span>•</span>}
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.email && personalInfo?.linkedin && <span>•</span>}
          {personalInfo?.linkedin && <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
        </div>
      )}

      {summary && (
        <div className="text-[10pt] leading-relaxed mb-5 text-justify">
          {summary}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="bg-slate-800 text-teal-50 font-bold uppercase text-[10.5pt] py-1 px-3 mb-3">Key Skills</h2>
          <ul className="list-disc ml-6 grid grid-cols-2 text-[9.5pt] gap-y-1.5 font-medium">
            {skills.map((skill, i) => (
              <li key={i}>{skill.name}</li>
            ))}
          </ul>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="bg-slate-800 text-teal-50 font-bold uppercase text-[10.5pt] py-1 px-3 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[10pt]">
                  <span>{exp.position}</span>
                  <span className="font-normal text-[9.5pt]">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                </div>
                <div className="font-bold text-[9.5pt] mb-1.5 text-gray-700">{exp.company}</div>
                {renderBullets(exp.description, "list-disc ml-6 mt-1 text-[9.5pt] space-y-1")}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="bg-slate-800 text-teal-50 font-bold uppercase text-[10.5pt] py-1 px-3 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[10pt]">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="font-normal text-[9.5pt]">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
                </div>
                <div className="font-medium text-[9.5pt] text-gray-700">{edu.institution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="bg-slate-800 text-teal-50 font-bold uppercase text-[10.5pt] py-1 px-3 mb-3">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="font-bold text-[10pt]">{proj.name} {proj.link && <span className="font-normal text-[9pt]">| {proj.link}</span>}</div>
                {proj.tools && <div className="text-[9pt] font-semibold text-gray-600 mb-1">{proj.tools}</div>}
                {renderBullets(proj.description, "list-disc ml-6 mt-1 text-[9.5pt] space-y-1")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// TEMPLATE 3: Contemporary (Jonathan Christensen style)
// ---------------------------------------------------------
const TemplateContemporary = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-sans text-gray-900 leading-tight">
      <div className="mb-4">
        <h1 className="text-4xl font-light uppercase tracking-widest text-slate-500">{personalInfo?.firstName || 'YOUR'} <span className="font-medium text-slate-800">{personalInfo?.lastName || 'NAME'}</span></h1>
        {personalInfo?.title && <div className="text-sky-700 uppercase tracking-widest text-[11pt] mt-1">{personalInfo.title}</div>}
      </div>

      {(personalInfo?.phone || personalInfo?.email || personalInfo?.location || personalInfo?.linkedin) && (
        <div className="bg-sky-50 p-2.5 text-[9pt] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mb-6 rounded-sm border-l-2 border-sky-600">
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.phone && personalInfo?.email && <span>|</span>}
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.email && personalInfo?.location && <span>|</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <><span>|</span><span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span></>}
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <h2 className="uppercase font-bold text-gray-700 tracking-widest text-[11pt] mb-2 border-b border-gray-300 pb-1">Professional Profile</h2>
          <div className="text-[9.5pt] leading-relaxed text-gray-700">
            {summary}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase font-bold text-gray-700 tracking-widest text-[11pt] mb-2 border-b border-gray-300 pb-1">Skills & Expertise</h2>
          <div className="grid grid-cols-3 gap-y-1 text-[9.5pt] text-gray-700">
            {skills.map((skill, i) => (
              <div key={i}>{skill.name}</div>
            ))}
          </div>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase font-bold text-gray-700 tracking-widest text-[11pt] mb-2 border-b border-gray-300 pb-1">Work Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <div className="text-[10pt]"><span className="font-bold text-gray-900">{exp.position}</span> <span className="text-gray-400 mx-1">|</span> <span className="text-gray-600">{exp.company}</span></div>
                  <span className="text-gray-500 text-[9pt]">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                </div>
                {renderBullets(exp.description, "list-disc ml-5 text-[9.5pt] text-gray-700 space-y-1 marker:text-gray-400")}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase font-bold text-gray-700 tracking-widest text-[11pt] mb-2 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="text-[10pt] font-bold text-gray-900 mb-0.5">{proj.name} {proj.link && <span className="text-gray-400 font-normal text-[9pt]">({proj.link})</span>}</div>
                {proj.tools && <div className="text-[9pt] text-gray-500 mb-1">{proj.tools}</div>}
                {renderBullets(proj.description, "list-disc ml-5 text-[9.5pt] text-gray-700 space-y-1 marker:text-gray-400")}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase font-bold text-gray-700 tracking-widest text-[11pt] mb-2 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between text-[10pt]">
                <div>
                  <span className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-gray-400 mx-1">|</span>
                  <span className="text-gray-600">{edu.institution}</span>
                </div>
                <span className="text-gray-500 text-[9pt]">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// TEMPLATE 4: Elegant (Carter Hayes style)
// ---------------------------------------------------------
const TemplateElegant = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-serif text-slate-800 leading-tight">
      <div className="text-center mb-6">
        <h1 className="text-4xl uppercase tracking-[0.2em] mb-2 text-indigo-950">{fullName || 'Your Name'}</h1>
        {personalInfo?.title && <div className="text-indigo-700 uppercase tracking-[0.3em] text-[9pt] mb-2 font-semibold">{personalInfo.title}</div>}
        
        <div className="flex flex-wrap justify-center gap-2 text-[9pt] text-slate-600 font-sans">
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.phone && personalInfo?.email && <span>•</span>}
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.email && personalInfo?.location && <span>•</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <><span>•</span><span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span></>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="uppercase tracking-widest text-[10.5pt] mb-2 text-slate-700 border-b border-slate-200 pb-1">Summary</h2>
          <div className="text-[10pt] leading-relaxed text-slate-600 font-sans">
            {summary}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase tracking-widest text-[10.5pt] mb-2 text-slate-700 border-b border-slate-200 pb-1">Skills</h2>
          <div className="font-sans text-[9.5pt] text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
            {skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">{skill.name}</span>
            ))}
          </div>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase tracking-widest text-[10.5pt] mb-3 text-slate-700 border-b border-slate-200 pb-1">Work Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[10.5pt] uppercase tracking-wide">
                    <span className="font-bold text-slate-700">{exp.position}</span>
                    <span className="mx-2 text-slate-400">|</span>
                    <span className="text-slate-600">{exp.company}</span>
                  </div>
                  <span className="text-slate-500 text-[9pt] font-sans">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                </div>
                {renderBullets(exp.description, "list-disc ml-5 mt-1 text-[9.5pt] text-slate-600 font-sans space-y-1")}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase tracking-widest text-[10.5pt] mb-3 text-slate-700 border-b border-slate-200 pb-1">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="text-[10.5pt] uppercase tracking-wide font-bold text-slate-700 mb-0.5">{proj.name}</div>
                {proj.tools && <div className="text-[9pt] text-slate-500 font-sans mb-1">{proj.tools} {proj.link && `• ${proj.link}`}</div>}
                {renderBullets(proj.description, "list-disc ml-5 mt-1 text-[9.5pt] text-slate-600 font-sans space-y-1")}
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="uppercase tracking-widest text-[10.5pt] mb-3 text-slate-700 border-b border-slate-200 pb-1">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div className="text-[10.5pt] uppercase tracking-wide">
                  <span className="font-bold text-slate-700">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="mx-2 text-slate-400">|</span>
                  <span className="text-slate-600">{edu.institution}</span>
                </div>
                <span className="text-slate-500 text-[9pt] font-sans">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// TEMPLATE 5: Split (Malin Fransiska style - 2 columns)
// ---------------------------------------------------------
const TemplateSplit = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-sans text-gray-800 leading-tight w-full relative clearfix" style={{ minHeight: '297mm', borderRight: '70mm solid #f9fafb', boxSizing: 'border-box' }}>
      {/* Left Column */}
      <div style={{ float: 'left', width: '140mm' }} className="pt-[15mm] pb-[15mm] pl-[10mm] pr-6">
        <div className="mb-8">
          <h1 className="text-[28pt] font-black uppercase leading-none mb-1 text-gray-900">{fullName || 'Your Name'}</h1>
          {personalInfo?.title && <div className="uppercase tracking-widest text-gray-500 text-[9pt] font-bold">{personalInfo.title}</div>}
        </div>
        
        {summary && (
          <div className="mb-6 text-[9.5pt] leading-relaxed text-gray-600">
            {summary}
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="uppercase font-bold text-gray-900 text-[12pt] mb-3 border-b-2 border-gray-200 pb-1">Work Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[10.5pt] text-gray-900">{exp.position}</h3>
                  <div className="text-[9.5pt] text-gray-600 mb-1">{exp.company} <span className="mx-1">|</span> {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</div>
                  {renderBullets(exp.description, "list-disc ml-4 mt-1 text-[9pt] text-gray-700 space-y-1")}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="uppercase font-bold text-gray-900 text-[12pt] mb-3 border-b-2 border-gray-200 pb-1">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[10.5pt] text-gray-900">{proj.name}</h3>
                  {(proj.tools || proj.link) && (
                    <div className="text-[9pt] text-gray-500 mb-1">
                      {proj.tools} {proj.tools && proj.link && ' | '} {proj.link}
                    </div>
                  )}
                  {renderBullets(proj.description, "list-disc ml-4 mt-1 text-[9pt] text-gray-700 space-y-1")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div style={{ float: 'right', width: '70mm', marginRight: '-70mm' }} className="pt-[15mm] pb-[15mm] pr-[10mm] pl-6 border-l border-gray-200">
        
        <div className="mb-8">
          <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-3 border-b border-gray-300 pb-1">Contact</h2>
          <div className="space-y-2 text-[9pt] text-gray-600 font-medium">
            {personalInfo?.phone && <div className="flex items-center gap-2"><span className="text-gray-400">📞</span> {personalInfo.phone}</div>}
            {personalInfo?.email && <div className="flex items-center gap-2"><span className="text-gray-400">✉️</span> {personalInfo.email}</div>}
            {personalInfo?.location && <div className="flex items-center gap-2"><span className="text-gray-400">📍</span> {personalInfo.location}</div>}
            {personalInfo?.linkedin && <div className="flex items-center gap-2"><span className="text-gray-400">🔗</span> {personalInfo.linkedin.replace(/^https?:\/\//, '')}</div>}
          </div>
        </div>

        {education && education.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-3 border-b border-gray-300 pb-1">Education</h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[9.5pt] text-gray-900 leading-snug">{edu.degree}</h3>
                  <div className="text-[9pt] text-gray-700">{edu.fieldOfStudy}</div>
                  <div className="text-[8.5pt] text-gray-500 mt-0.5">{edu.institution}</div>
                  <div className="text-[8.5pt] text-gray-400">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-3 border-b border-gray-300 pb-1">Expertise</h2>
            <div className="space-y-1.5 text-[9pt] text-gray-700 font-medium">
              {skills.map((skill, i) => (
                <div key={i}>{skill.name}</div>
              ))}
            </div>
          </div>
        )}

      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

// ---------------------------------------------------------
// TEMPLATE 6: Creative (Jack Kingsley style - Gray left column)
// ---------------------------------------------------------
const TemplateCreative = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();

  return (
    <div className="font-sans text-gray-800 leading-tight w-full relative clearfix" style={{ minHeight: '297mm', borderLeft: '70mm solid #f0f0f0', boxSizing: 'border-box' }}>
      {/* Left Column (Gray) */}
      <div style={{ float: 'left', width: '70mm', marginLeft: '-70mm' }} className="pt-[15mm] pb-[15mm] pl-[10mm] pr-6">
        
        {education && education.length > 0 && (
          <div className="mb-8 mt-12">
            <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-4 flex items-center gap-2">
              Education
              <span className="h-1 w-12 bg-amber-400"></span>
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[9.5pt] text-gray-900 leading-snug">{edu.degree}</h3>
                  <div className="text-[9pt] text-gray-700">{edu.institution} {edu.fieldOfStudy && `| ${edu.fieldOfStudy}`}</div>
                  <div className="text-[8.5pt] text-gray-500">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-4 flex items-center gap-2">
              Expertise
              <span className="h-1 w-12 bg-amber-400"></span>
            </h2>
            <div className="space-y-1.5 text-[9pt] text-gray-700 font-medium">
              {skills.map((skill, i) => (
                <div key={i}>{skill.name}</div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="uppercase font-bold text-gray-900 text-[11pt] mb-4 flex items-center gap-2">
            Follow Me
            <span className="h-1 w-12 bg-amber-400"></span>
          </h2>
          <div className="space-y-2 text-[8.5pt] text-gray-600 font-medium break-all">
            {personalInfo?.linkedin && (
              <div>
                <div className="font-bold text-gray-900">Linkedin</div>
                <div>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</div>
              </div>
            )}
            {personalInfo?.github && (
              <div>
                <div className="font-bold text-gray-900">Github</div>
                <div>{personalInfo.github.replace(/^https?:\/\//, '')}</div>
              </div>
            )}
            {personalInfo?.portfolio && (
              <div>
                <div className="font-bold text-gray-900">Portfolio</div>
                <div>{personalInfo.portfolio.replace(/^https?:\/\//, '')}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (White) */}
      <div style={{ float: 'right', width: '140mm' }} className="pt-[15mm] pb-[15mm] pr-[10mm] pl-8">
        
        <div className="mb-10 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-[32pt] font-black uppercase leading-tight mb-2 text-gray-900 font-sans tracking-tight">
              {personalInfo?.firstName || 'YOUR'}<br/>
              {personalInfo?.lastName || 'NAME'}
            </h1>
            {personalInfo?.title && (
              <div className="inline-block bg-amber-400 px-2 py-1 uppercase tracking-widest text-gray-900 text-[10pt] font-bold">
                {personalInfo.title}
              </div>
            )}
          </div>
          <div className="text-right text-[8.5pt] text-gray-600 font-medium space-y-1 mt-2">
            {personalInfo?.phone && <div>{personalInfo.phone} 📞</div>}
            {personalInfo?.email && <div>{personalInfo.email} ✉️</div>}
            {personalInfo?.location && <div>{personalInfo.location} 📍</div>}
          </div>
        </div>
        
        {summary && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[12pt] mb-3">About Me</h2>
            <div className="flex gap-3">
              <div className="text-4xl text-gray-400 font-serif leading-none mt-1">"</div>
              <div className="text-[9.5pt] leading-relaxed text-gray-600 italic">
                {summary}
              </div>
            </div>
            <div className="mt-4 border-b border-gray-300"></div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[12pt] mb-4">Work Experience</h2>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="font-bold text-[10.5pt] text-gray-900 mb-0.5">
                    {exp.company}
                  </div>
                  <div className="text-[9pt] text-gray-600 mb-2 font-medium">
                    {exp.position} <span className="mx-1">|</span> {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                  </div>
                  {renderBullets(exp.description, "list-disc ml-4 text-[9pt] text-gray-600 space-y-1")}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-gray-900 text-[12pt] mb-4">Projects</h2>
            <div className="space-y-5">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="font-bold text-[10.5pt] text-gray-900 mb-0.5">
                    {proj.name}
                  </div>
                  {(proj.tools || proj.link) && (
                    <div className="text-[9pt] text-gray-500 mb-2 font-medium">
                      {proj.tools} {proj.tools && proj.link && ' | '} {proj.link}
                    </div>
                  )}
                  {renderBullets(proj.description, "list-disc ml-4 text-[9pt] text-gray-600 space-y-1")}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};


// ---------------------------------------------------------
// MAIN PREVIEW COMPONENT
// ---------------------------------------------------------
export default function ResumePreview({ data, template = 'executive' }) {
  
  const renderTemplate = () => {
    switch (template) {
      case 'professional':
        return <TemplateProfessional data={data} />;
      case 'contemporary':
        return <TemplateContemporary data={data} />;
      case 'elegant':
        return <TemplateElegant data={data} />;
      case 'split':
        return <TemplateSplit data={data} />;
      case 'creative':
        return <TemplateCreative data={data} />;
      case 'executive':
      default:
        return <TemplateExecutive data={data} />;
    }
  };

  const isEdgeToEdge = template === 'split' || template === 'creative';

  return (
    <div className="bg-white mx-auto shadow-2xl print:shadow-none transition-all duration-300 relative" style={{ width: '210mm', minHeight: '297mm', padding: isEdgeToEdge ? '0' : '15mm 10mm' }}>
      {renderTemplate()}
    </div>
  );
}
