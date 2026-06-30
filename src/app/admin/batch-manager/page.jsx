"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Users, Award, GraduationCap, Plus, Trash2, X, Check,
  AlertCircle, ChevronRight, Briefcase, Mail, ShieldAlert, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BatchManagerDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // Mock global lists of mentors in the institute
  const [instituteMentors] = useState([
    { id: 2, name: "Mohammed Majeed Khan", email: "majeed@dmx.com" },
    { id: 5, name: "Nitin Singh", email: "nitin@dmx.com" },
    { id: 6, name: "Divyashant Kumar", email: "divyashant@dmx.com" },
    { id: 10, name: "Siddharth Ray", email: "sid.fac@dmx.com" }
  ]);

  // Mock global students roster in the institute database
  const [instituteStudents] = useState([
    { id: 3, name: "Arhan Khan", email: "arhan@dmx.com" },
    { id: 7, name: "Shahazadi Syed", email: "shahazadi@dmx.com" },
    { id: 8, name: "Abhishek Kumar", email: "abhishek@dmx.com" },
    { id: 9, name: "Ishaan Khandelwaal", email: "ishaan@dmx.com" }
  ]);

  // Mock Batches Database state
  const [batches, setBatches] = useState([
    {
      id: 101,
      name: "Batch-A",
      managerId: 999, // Current logged-in manager (simulated)
      mentorIds: [2, 5],
      studentIds: [3, 7] 
    },
    {
      id: 102,
      name: "Batch-B",
      managerId: 999, // Current logged-in manager (simulated)
      mentorIds: [5, 6],
      studentIds: [8]
    }
  ]);

  // View Navigation States: 'list' | 'details'
  const [activeView, setActiveView] = useState("list");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("mentors"); // 'mentors' | 'students'

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignStudentOpen, setIsAssignStudentOpen] = useState(false);

  // Security check: Redirect if not Batch Manager or Admin
  useEffect(() => {
    if (user && user.role !== "BATCH_MANAGER" && user.role !== "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  const handleRemoveMentorFromBatch = (menId) => {
    if (!selectedBatch) return;

    const updatedMentorIds = selectedBatch.mentorIds.filter(id => id !== menId);

    // Update local state database
    setBatches(prev => prev.map(b => b.id === selectedBatch.id ? { ...b, mentorIds: updatedMentorIds } : b));

    // Update active details view state
    setSelectedBatch(prev => ({ ...prev, mentorIds: updatedMentorIds }));
  };

  const handleAddMentorToBatch = (menId) => {
    if (!selectedBatch) return;
    if (selectedBatch.mentorIds.includes(menId)) return;

    const updatedMentorIds = [...selectedBatch.mentorIds, menId];

    // Update database state
    setBatches(prev => prev.map(b => b.id === selectedBatch.id ? { ...b, mentorIds: updatedMentorIds } : b));

    // Update active details view state
    setSelectedBatch(prev => ({ ...prev, mentorIds: updatedMentorIds }));
  };

  const handleRemoveStudentFromBatch = (stdId) => {
    if (!selectedBatch) return;

    const updatedStudentIds = selectedBatch.studentIds.filter(id => id !== stdId);

    // Update database state
    setBatches(prev => prev.map(b => b.id === selectedBatch.id ? { ...b, studentIds: updatedStudentIds } : b));

    // Update active details view state
    setSelectedBatch(prev => ({ ...prev, studentIds: updatedStudentIds }));
  };

  const handleAddStudentToBatch = (stdId) => {
    if (!selectedBatch) return;
    if (selectedBatch.studentIds.includes(stdId)) return;

    const updatedStudentIds = [...selectedBatch.studentIds, stdId];

    // Update database state
    setBatches(prev => prev.map(b => b.id === selectedBatch.id ? { ...b, studentIds: updatedStudentIds } : b));

    // Update active details view state
    setSelectedBatch(prev => ({ ...prev, studentIds: updatedStudentIds }));
  };

  if (!user || (user.role !== "BATCH_MANAGER" && user.role !== "ADMIN")) {
    return null;
  }

  // Get list of members in active detail tab
  const getActiveRoster = () => {
    if (!selectedBatch) return [];
    if (activeDetailTab === "mentors") {
      return selectedBatch.mentorIds
        .map(mid => instituteMentors.find(m => m.id === mid))
        .filter(Boolean)
        .map(m => ({ ...m, role: "MENTOR" }));
    }
    return selectedBatch.studentIds
      .map(sid => instituteStudents.find(s => s.id === sid))
      .filter(Boolean)
      .map(s => ({ ...s, role: "STUDENT" }));
  };

  const detailsList = getActiveRoster();

  // Get list of mentors not currently assigned to this batch
  const getAvailableMentors = () => {
    if (!selectedBatch) return [];
    return instituteMentors.filter(m => !selectedBatch.mentorIds.includes(m.id));
  };

  const availableMentors = getAvailableMentors();

  // Get list of students not currently assigned to the active batch
  const getAvailableStudents = () => {
    if (!selectedBatch) return [];
    return instituteStudents.filter(std => !selectedBatch.studentIds.includes(std.id));
  };

  const availableStudents = getAvailableStudents();

  return (
    <div className="space-y-6 p-6 min-h-0 flex flex-col flex-1" style={{ color: "var(--text-primary)" }}>

      {activeView === "list" ? (
        <>
          {/* Header section */}
          <div className="space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[var(--bg-badge)] text-[var(--text-accent)] text-[10px] font-extrabold uppercase tracking-wider">
                Batch Manager Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              My Assigned Batches
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Oversee your dedicated student cohorts, monitor class rosters, and coordinate active mentors.
            </p>
          </div>

          {/* Grid view of batches */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map((batch) => {
                return (
                  <div
                    key={batch.id}
                    onClick={() => {
                      setSelectedBatch(batch);
                      setActiveDetailTab("mentors");
                      setActiveView("details");
                    }}
                    className="rounded-3xl border bg-[var(--bg-card)] p-6 space-y-4 hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wide">
                          Assigned Cohort
                        </span>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <h3 className="text-base font-black tracking-tight">{batch.name}</h3>
                    </div>

                    <div className="flex items-center gap-6 pt-2 border-t text-xs font-semibold" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-amber-400" />
                        <span>{batch.mentorIds.length} Mentors</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={14} className="text-emerald-400" />
                        <span>{batch.studentIds.length} Students</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Full Page Management View (identical to Manage People style) */
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
          {/* Header section with back link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveView("list");
                  setSelectedBatch(null);
                }}
                className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-accent)] hover:underline cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Back to batches</span>
              </button>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                Batch: {selectedBatch?.name}
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Manage mentors and coordinate assigned students inside this batch.
              </p>
            </div>

            {/* Dynamic Button depending on Active Tab */}
            {activeDetailTab === "mentors" ? (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-[var(--accent-glow)] border border-transparent shrink-0"
              >
                <Plus size={16} />
                <span>Configure Mentors</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAssignStudentOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-[var(--accent-glow)] border border-transparent shrink-0"
              >
                <Plus size={16} />
                <span>Configure Students</span>
              </button>
            )}
          </div>

          {/* Info Banner alert box */}
          <div className="flex gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shrink-0">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Batch Manager Permissions:</strong> You can assign/remove existing mentors and students to this specific batch. You cannot register new student accounts or delete core profiles from the database.
            </p>
          </div>

          {/* Roster Tab list */}
          <div className="flex gap-2 p-1.5 rounded-2xl w-fit border shrink-0 bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
            <button
              onClick={() => setActiveDetailTab("mentors")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeDetailTab === "mentors"
                ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
                : "hover:bg-[var(--bg-primary)] border border-transparent"
                }`}
            >
              <Award size={14} />
              <span>Mentors</span>
            </button>
            <button
              onClick={() => setActiveDetailTab("students")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeDetailTab === "students"
                ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
                : "hover:bg-[var(--bg-primary)] border border-transparent"
                }`}
            >
              <GraduationCap size={14} />
              <span>Students</span>
            </button>
          </div>

          {/* Roster Table list */}
          <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
            {detailsList.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[var(--bg-badge)] flex items-center justify-center text-[var(--text-accent)]">
                  <Users size={28} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>No members assigned</h3>
                  <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
                    No assigned profiles matched this role category for this batch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto min-w-0">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b text-[10px] font-extrabold uppercase tracking-wider select-none bg-[var(--bg-primary)]/30" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Role Permission</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs font-semibold" style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                    {detailsList.map((member) => (
                      <tr key={member.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="px-6 py-4 font-black">{member.name}</td>
                        <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${member.role === "MENTOR"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              if (activeDetailTab === "mentors") {
                                handleRemoveMentorFromBatch(member.id);
                              } else {
                                handleRemoveStudentFromBatch(member.id);
                              }
                            }}
                            className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors cursor-pointer border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assign Mentors Configuration Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden bg-[var(--bg-card)] flex flex-col max-h-[80vh]"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b shrink-0" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[var(--bg-badge)] text-[var(--text-accent)]">
                    <Award size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Assign Batch Mentors
                  </h3>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Roster Selector List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-0">
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
                  Available Institute Mentors
                </span>
                {availableMentors.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-6">
                    All mentors have already been assigned to this batch teaching roster.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableMentors.map((men) => (
                      <div
                        key={men.id}
                        onClick={() => handleAddMentorToBatch(men.id)}
                        className="flex items-center justify-between p-3 rounded-2xl border bg-[var(--bg-primary)]/40 hover:bg-[var(--bg-primary)] transition-all cursor-pointer"
                        style={{ borderColor: "var(--border-primary)" }}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{men.name}</span>
                          <span className="text-[9px] text-[var(--text-muted)]">{men.email}</span>
                        </div>
                        <span className="text-[9px] font-black text-[var(--text-accent)] bg-[var(--bg-badge)] px-2.5 py-1.5 rounded-xl border border-[var(--border-primary)] uppercase">
                          Assign
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t shrink-0 flex justify-end bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Students Configuration Modal */}
      <AnimatePresence>
        {isAssignStudentOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden bg-[var(--bg-card)] flex flex-col max-h-[80vh]"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b shrink-0" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[var(--bg-badge)] text-[var(--text-accent)]">
                    <GraduationCap size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Assign Batch Students
                  </h3>
                </div>
                <button
                  onClick={() => setIsAssignStudentOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Roster Selector List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
                    Add Students to Batch
                  </span>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Select students to enroll them in this cohort roster.
                  </p>
                </div>

                {availableStudents.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-6">
                    No unassigned students found. All registered students are already mapping to batches.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableStudents.map((std) => (
                      <div
                        key={std.id}
                        onClick={() => handleAddStudentToBatch(std.id)}
                        className="flex items-center justify-between p-3 rounded-2xl border bg-[var(--bg-primary)]/40 hover:bg-[var(--bg-primary)] transition-all cursor-pointer"
                        style={{ borderColor: "var(--border-primary)" }}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{std.name}</span>
                          <span className="text-[9px] text-[var(--text-muted)]">{std.email}</span>
                        </div>
                        <span className="text-[9px] font-black text-[var(--text-accent)] bg-[var(--bg-badge)] px-2.5 py-1.5 rounded-xl border border-[var(--border-primary)] uppercase">
                          Assign
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t shrink-0 flex justify-end bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
                <button
                  onClick={() => setIsAssignStudentOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
