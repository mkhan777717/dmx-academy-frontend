import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ResumeForm({ data, onChange }) {
  const [localSkills, setLocalSkills] = useState('');

  // Sync incoming skills array to local string, preserving trailing spaces/commas while typing
  useEffect(() => {
    const dataSkills = Array.isArray(data.skills) ? data.skills.map(s => s.name) : [];
    const localParsed = localSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    // Only overwrite local string if the actual items changed from outside (e.g. initial load)
    if (dataSkills.join(',') !== localParsed.join(',')) {
      setLocalSkills(dataSkills.join(', '));
    }
  }, [data.skills]);

  const handleChange = (section, field, value) => {
    onChange({
      ...data,
      [section]: { ...data[section], [field]: value },
    });
  };

  const handleSimpleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...data[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    onChange({ ...data, [section]: newArray });
  };

  const addArrayItem = (section, emptyItem) => {
    onChange({
      ...data,
      [section]: [...data[section], { id: Date.now().toString(), ...emptyItem }],
    });
  };

  const removeArrayItem = (section, index) => {
    const newArray = [...data[section]];
    newArray.splice(index, 1);
    onChange({ ...data, [section]: newArray });
  };

  const handleSkillsChange = (e) => {
    const val = e.target.value;
    setLocalSkills(val);
    const skillsArray = val.split(/,|\n/).map(s => ({ name: s.trim() })).filter(s => s.name);
    handleSimpleChange('skills', skillsArray);
  };

  const handleBulletKeyDown = (e, value, onChangeCallback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.target;
      const cursor = textarea.selectionStart;
      const textBefore = value.substring(0, cursor);
      const textAfter = value.substring(cursor);
      
      const lines = textBefore.split('\n');
      const lastLine = lines[lines.length - 1];
      
      if (lastLine === '- ' || lastLine === '-') {
        // Remove empty bullet
        const newTextBefore = textBefore.substring(0, textBefore.length - lastLine.length);
        onChangeCallback(newTextBefore + textAfter);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = newTextBefore.length;
        }, 0);
      } else {
        // Add new bullet
        const newValue = textBefore + '\n- ' + textAfter;
        onChangeCallback(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = textBefore.length + 3;
        }, 0);
      }
    }
  };

  const handleBulletFocus = (e, value, onChangeCallback) => {
    if (!value || value.trim() === '') {
      onChangeCallback('- ');
    }
  };

  const inputClasses = "w-full px-4 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] outline-none transition-all placeholder:text-[var(--text-muted)]";
  const sectionClasses = "bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-primary)] glass-panel";
  const labelClasses = "block text-sm font-medium text-[var(--text-secondary)] mb-1";
  const smallLabelClasses = "block text-xs font-medium text-[var(--text-secondary)] mb-1";
  const smallInputClasses = "w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] outline-none text-sm placeholder:text-[var(--text-muted)]";

  return (
    <div className="space-y-8 print:hidden pb-20">
      {/* Personal Info */}
      <section className={sectionClasses}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">1</span>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>First Name</label>
            <input type="text" value={data.personalInfo.firstName || ''} onChange={e => handleChange('personalInfo', 'firstName', e.target.value)} className={inputClasses} placeholder="John" />
          </div>
          <div>
            <label className={labelClasses}>Last Name</label>
            <input type="text" value={data.personalInfo.lastName || ''} onChange={e => handleChange('personalInfo', 'lastName', e.target.value)} className={inputClasses} placeholder="Doe" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Professional Title</label>
            <input type="text" value={data.personalInfo.title || ''} onChange={e => handleChange('personalInfo', 'title', e.target.value)} className={inputClasses} placeholder="Software Engineer" />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input type="email" value={data.personalInfo.email || ''} onChange={e => handleChange('personalInfo', 'email', e.target.value)} className={inputClasses} placeholder="john@example.com" />
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input type="text" value={data.personalInfo.phone || ''} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} className={inputClasses} placeholder="+1 234 567 8900" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Location</label>
            <input type="text" value={data.personalInfo.location || ''} onChange={e => handleChange('personalInfo', 'location', e.target.value)} className={inputClasses} placeholder="City, Country" />
          </div>
          <div>
            <label className={labelClasses}>LinkedIn URL</label>
            <input type="text" value={data.personalInfo.linkedin || ''} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} className={inputClasses} placeholder="linkedin.com/in/johndoe" />
          </div>
          <div>
            <label className={labelClasses}>GitHub URL</label>
            <input type="text" value={data.personalInfo.github || ''} onChange={e => handleChange('personalInfo', 'github', e.target.value)} className={inputClasses} placeholder="github.com/johndoe" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Portfolio URL</label>
            <input type="text" value={data.personalInfo.portfolio || ''} onChange={e => handleChange('personalInfo', 'portfolio', e.target.value)} className={inputClasses} placeholder="johndoe.com" />
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className={sectionClasses}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">2</span>
          Professional Summary
        </h2>
        <div>
          <textarea value={data.summary || ''} onChange={e => handleSimpleChange('summary', e.target.value)} rows="4" className={`${inputClasses} resize-none`} placeholder="A brief summary of your professional background and goals..."></textarea>
        </div>
      </section>

      {/* Experience */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">3</span>
            Work Experience
          </h2>
          <button onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-sm font-bold text-[var(--text-accent)] bg-[var(--bg-badge)] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all cursor-pointer">
            <Plus className="w-4 h-4 mr-1" /> Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {data.experience?.map((exp, index) => (
            <div key={exp.id || index} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm relative group">
              <button onClick={() => removeArrayItem('experience', index)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className={smallLabelClasses}>Company</label>
                  <input type="text" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} className={smallInputClasses} placeholder="Google" />
                </div>
                <div>
                  <label className={smallLabelClasses}>Position</label>
                  <input type="text" value={exp.position} onChange={e => handleArrayChange('experience', index, 'position', e.target.value)} className={smallInputClasses} placeholder="Software Engineer" />
                </div>
                <div>
                  <label className={smallLabelClasses}>Start Date</label>
                  <input type="date" value={exp.startDate} onChange={e => handleArrayChange('experience', index, 'startDate', e.target.value)} className={smallInputClasses} />
                </div>
                <div>
                  <label className={smallLabelClasses}>End Date</label>
                  <input type="date" value={exp.endDate} onChange={e => handleArrayChange('experience', index, 'endDate', e.target.value)} className={smallInputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className={smallLabelClasses}>Description (Bullet points)</label>
                  <textarea 
                    value={exp.description} 
                    onChange={e => handleArrayChange('experience', index, 'description', e.target.value)}
                    onKeyDown={e => handleBulletKeyDown(e, exp.description, (val) => handleArrayChange('experience', index, 'description', val))}
                    onFocus={e => handleBulletFocus(e, exp.description, (val) => handleArrayChange('experience', index, 'description', val))}
                    rows="4" 
                    className={smallInputClasses} 
                    placeholder="- Developed new features...&#10;- Improved performance by..."
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
          {(!data.experience || data.experience.length === 0) && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-primary)] border-dashed border-[var(--border-primary)]">No work experience added yet.</p>
          )}
        </div>
      </section>

      {/* Education */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">4</span>
            Education
          </h2>
          <button onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className="flex items-center text-sm font-bold text-[var(--text-accent)] bg-[var(--bg-badge)] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all cursor-pointer">
            <Plus className="w-4 h-4 mr-1" /> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {data.education?.map((edu, index) => (
            <div key={edu.id || index} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm relative group">
              <button onClick={() => removeArrayItem('education', index)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <label className={smallLabelClasses}>Institution</label>
                  <input type="text" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} className={smallInputClasses} placeholder="University Name" />
                </div>
                <div>
                  <label className={smallLabelClasses}>Degree</label>
                  <input type="text" value={edu.degree} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} className={smallInputClasses} placeholder="B.S." />
                </div>
                <div>
                  <label className={smallLabelClasses}>Field of Study</label>
                  <input type="text" value={edu.fieldOfStudy} onChange={e => handleArrayChange('education', index, 'fieldOfStudy', e.target.value)} className={smallInputClasses} placeholder="Computer Science" />
                </div>
                <div>
                  <label className={smallLabelClasses}>Start Date</label>
                  <input type="date" value={edu.startDate} onChange={e => handleArrayChange('education', index, 'startDate', e.target.value)} className={smallInputClasses} />
                </div>
                <div>
                  <label className={smallLabelClasses}>End Date</label>
                  <input type="date" value={edu.endDate} onChange={e => handleArrayChange('education', index, 'endDate', e.target.value)} className={smallInputClasses} />
                </div>
              </div>
            </div>
          ))}
          {(!data.education || data.education.length === 0) && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-primary)] border-dashed border-[var(--border-primary)]">No education added yet.</p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">5</span>
            Projects
          </h2>
          <button onClick={() => addArrayItem('projects', { name: '', description: '', link: '', tools: '' })} className="flex items-center text-sm font-bold text-[var(--text-accent)] bg-[var(--bg-badge)] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all cursor-pointer">
            <Plus className="w-4 h-4 mr-1" /> Add Project
          </button>
        </div>
        <div className="space-y-4">
          {data.projects?.map((proj, index) => (
            <div key={proj.id || index} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm relative group">
              <button onClick={() => removeArrayItem('projects', index)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className={smallLabelClasses}>Project Name</label>
                  <input type="text" value={proj.name} onChange={e => handleArrayChange('projects', index, 'name', e.target.value)} className={smallInputClasses} placeholder="E-commerce App" />
                </div>
                <div>
                  <label className={smallLabelClasses}>Link (Optional)</label>
                  <input type="text" value={proj.link} onChange={e => handleArrayChange('projects', index, 'link', e.target.value)} className={smallInputClasses} placeholder="github.com/project" />
                </div>
                <div className="md:col-span-2">
                  <label className={smallLabelClasses}>Tools / Technologies Used</label>
                  <input type="text" value={proj.tools} onChange={e => handleArrayChange('projects', index, 'tools', e.target.value)} className={smallInputClasses} placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="md:col-span-2">
                  <label className={smallLabelClasses}>Description (Bullet points)</label>
                  <textarea 
                    value={proj.description} 
                    onChange={e => handleArrayChange('projects', index, 'description', e.target.value)}
                    onKeyDown={e => handleBulletKeyDown(e, proj.description, (val) => handleArrayChange('projects', index, 'description', val))}
                    onFocus={e => handleBulletFocus(e, proj.description, (val) => handleArrayChange('projects', index, 'description', val))}
                    rows="3" 
                    className={smallInputClasses} 
                    placeholder="- Built a full-stack application..."
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
          {(!data.projects || data.projects.length === 0) && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-primary)] border-dashed border-[var(--border-primary)]">No projects added yet.</p>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className={sectionClasses}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-[var(--bg-badge)] text-[var(--text-accent)] flex items-center justify-center mr-3 text-sm font-black">6</span>
          Skills
        </h2>
        <div>
          <label className={labelClasses}>List your skills (comma separated)</label>
          <textarea 
            value={localSkills} 
            onChange={handleSkillsChange} 
            rows="3" 
            className={`${inputClasses} resize-none`} 
            placeholder="JavaScript, React, Node.js, Python, SQL"
          ></textarea>
        </div>
      </section>

    </div>
  );
}
