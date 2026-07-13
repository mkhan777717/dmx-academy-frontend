import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResumeForm({ data, onChange }) {
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

  return (
    <div className="space-y-8 print:hidden pb-20">
      {/* Personal Info */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" value={data.personalInfo.firstName || ''} onChange={e => handleChange('personalInfo', 'firstName', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" value={data.personalInfo.lastName || ''} onChange={e => handleChange('personalInfo', 'lastName', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={data.personalInfo.email || ''} onChange={e => handleChange('personalInfo', 'email', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={data.personalInfo.phone || ''} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+1 234 567 8900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={data.personalInfo.location || ''} onChange={e => handleChange('personalInfo', 'location', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="City, Country" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input type="text" value={data.personalInfo.linkedin || ''} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="linkedin.com/in/johndoe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input type="text" value={data.personalInfo.github || ''} onChange={e => handleChange('personalInfo', 'github', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="github.com/johndoe" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
            <input type="text" value={data.personalInfo.portfolio || ''} onChange={e => handleChange('personalInfo', 'portfolio', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="johndoe.com" />
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
          Professional Summary
        </h2>
        <div>
          <textarea value={data.summary || ''} onChange={e => handleSimpleChange('summary', e.target.value)} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="A brief summary of your professional background and goals..."></textarea>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">3</span>
            Work Experience
          </h2>
          <button onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {data.experience?.map((exp, index) => (
            <div key={exp.id || index} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm relative group">
              <button onClick={() => removeArrayItem('experience', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                  <input type="text" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Google" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
                  <input type="text" value={exp.position} onChange={e => handleArrayChange('experience', index, 'position', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Software Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                  <input type="text" value={exp.startDate} onChange={e => handleArrayChange('experience', index, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Jan 2021" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                  <input type="text" value={exp.endDate} onChange={e => handleArrayChange('experience', index, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Present" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description (Bullet points)</label>
                  <textarea value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} rows="3" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="- Developed new features...&#10;- Improved performance by..."></textarea>
                </div>
              </div>
            </div>
          ))}
          {(!data.experience || data.experience.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No work experience added yet.</p>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">4</span>
            Education
          </h2>
          <button onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {data.education?.map((edu, index) => (
            <div key={edu.id || index} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm relative group">
              <button onClick={() => removeArrayItem('education', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Institution</label>
                  <input type="text" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="University Name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Degree</label>
                  <input type="text" value={edu.degree} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="B.S." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Field of Study</label>
                  <input type="text" value={edu.fieldOfStudy} onChange={e => handleArrayChange('education', index, 'fieldOfStudy', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Computer Science" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                  <input type="text" value={edu.startDate} onChange={e => handleArrayChange('education', index, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Aug 2018" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                  <input type="text" value={edu.endDate} onChange={e => handleArrayChange('education', index, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="May 2022" />
                </div>
              </div>
            </div>
          ))}
          {(!data.education || data.education.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No education added yet.</p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">5</span>
            Projects
          </h2>
          <button onClick={() => addArrayItem('projects', { name: '', description: '', link: '', tools: '' })} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Add Project
          </button>
        </div>
        <div className="space-y-4">
          {data.projects?.map((proj, index) => (
            <div key={proj.id || index} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm relative group">
              <button onClick={() => removeArrayItem('projects', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
                  <input type="text" value={proj.name} onChange={e => handleArrayChange('projects', index, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="E-commerce App" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Link (Optional)</label>
                  <input type="text" value={proj.link} onChange={e => handleArrayChange('projects', index, 'link', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="github.com/project" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tools / Technologies Used</label>
                  <input type="text" value={proj.tools} onChange={e => handleArrayChange('projects', index, 'tools', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description (Bullet points)</label>
                  <textarea value={proj.description} onChange={e => handleArrayChange('projects', index, 'description', e.target.value)} rows="3" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="- Built a full-stack application..."></textarea>
                </div>
              </div>
            </div>
          ))}
          {(!data.projects || data.projects.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No projects added yet.</p>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">6</span>
          Skills
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">List your skills (comma separated)</label>
          <textarea 
            value={Array.isArray(data.skills) ? data.skills.map(s => s.name).join(', ') : data.skills} 
            onChange={e => {
              const skillsArray = e.target.value.split(',').map(s => ({ name: s.trim() })).filter(s => s.name);
              handleSimpleChange('skills', skillsArray);
            }} 
            rows="3" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
            placeholder="JavaScript, React, Node.js, Python, SQL"
          ></textarea>
        </div>
      </section>

    </div>
  );
}
