"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Plus, Trash2, School, Users, Briefcase, Award, X,
  CheckCircle2, AlertCircle, Calendar, GraduationCap, Check, Mail, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ManageBatchesPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Mock list of registered members in the institute (aligned with people list)
  const [managers] = useState([
    { id: 1, name: "Aditya", email: "aditya@dmx.com" },
    { id: 4, name: "Sakshi", email: "sakshi@dmx.com" }
  ]);

  const [mentors] = useState([
    { id: 2, name: "Mohammed Majeed Khan", email: "majeed@dmx.com" },
    { id: 5, name: "Nitin Singh", email: "nitin@dmx.com" },
    { id: 6, name: "Divyashant Kumar", email: "divyashant@dmx.com" }
  ]);

  const [students] = useState([
    { id: 3, name: "Arhan Khan", email: "arhan@dmx.com" },
    { id: 7, name: "Shahazadi Syed", email: "shahazadi@dmx.com" },
    { id: 8, name: "Abhishek Kumar", email: "abhishek@dmx.com" },
    { id: 9, name: "Ishaan Khandelwaal", email: "ishaan@dmx.com" }
  ]);

  // Mock Batches Database State
  const [batches, setBatches] = useState([
    {
      id: 101,
      name: "Batch-A",
      managerId: 1, // Aditya
      mentorIds: [2, 5], // Mohammed Majeed Khan, Nitin Singh
      studentIds: [3, 7], // Arhan Khan, Shahazadi Syed (assigned to same batch)
      createdAt: "2026-06-20"
    },
    {
      id: 102,
      name: "Batch-B",
      managerId: 4, // Sakshi
      mentorIds: [5, 6], // Nitin Singh, Divyashant Kumar
      studentIds: [8, 9], // Abhishek Kumar, Ishaan Khandelwaal
      createdAt: "2026-06-22"
    }
  ]);

  // View Navigation State: 'list' | 'details'
  const [activeView, setActiveView] = useState("list");
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("manager"); // 'manager' | 'mentors' | 'students'

  // Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedMentorIds, setSelectedMentorIds] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  // Security check: Redirect if not institute admin or super admin
  useEffect(() => {
    if (user && user.role !== "INSTITUTE_ADMIN" && user.role !== "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  // Auto-select first available manager on open
  useEffect(() => {
    if (isAddModalOpen && managers.length > 0) {
      setSelectedManagerId(managers[0].id.toString());
      setSelectedMentorIds([]);
      setSelectedStudentIds([]);
      setBatchName("");
    }
  }, [isAddModalOpen, managers]);

  const handleToggleMentor = (id) => {
    setSelectedMentorIds(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleToggleStudent = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleCreateBatchSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!batchName.trim()) {
      setFormError("Batch name is required.");
      return;
    }
    if (!selectedManagerId) {
      setFormError("Please select a Batch Manager.");
      return;
    }



    const newBatch = {
      id: Date.now(),
      name: batchName.trim(),
      managerId: parseInt(selectedManagerId, 10),
      mentorIds: selectedMentorIds,
      studentIds: selectedStudentIds,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setBatches(prev => [...prev, newBatch]);
    setFormSuccess("Batch created and configured successfully!");

    setTimeout(() => {
      setIsAddModalOpen(false);
      setFormSuccess("");
    }, 1500);
  };

  const triggerDelete = (batch) => {
    setBatchToDelete(batch);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!batchToDelete) return;
    setBatches(prev => prev.filter(b => b.id !== batchToDelete.id));
    setIsDeleteModalOpen(false);
    setBatchToDelete(null);
    if (selectedBatchDetails?.id === batchToDelete.id) {
      setActiveView("list");
      setSelectedBatchDetails(null);
    }
  };

  if (!user || (user.role !== "INSTITUTE_ADMIN" && user.role !== "ADMIN")) {
    return null;
  }

  // Get active roster for details page view
  const getActiveRoster = () => {
    if (!selectedBatchDetails) return [];
    if (activeDetailTab === "manager") {
      const mgr = managers.find(m => m.id === selectedBatchDetails.managerId);
      return mgr ? [{ ...mgr, role: "BATCH_MANAGER" }] : [];
    }
    if (activeDetailTab === "mentors") {
      return selectedBatchDetails.mentorIds
        .map(mid => mentors.find(m => m.id === mid))
        .filter(Boolean)
        .map(m => ({ ...m, role: "MENTOR" }));
    }
    return selectedBatchDetails.studentIds
      .map(sid => students.find(s => s.id === sid))
      .filter(Boolean)
      .map(s => ({ ...s, role: "STUDENT" }));
  };

  const detailsList = getActiveRoster();

  return (
    <div className="space-y-6 p-6 min-h-0 flex flex-col flex-1" style={{ color: "var(--text-primary)" }}>

      {activeView === "list" ? (
        <>
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[var(--bg-badge)] text-[var(--text-accent)] text-[10px] font-extrabold uppercase tracking-wider">
                  Academy Batches
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                Manage Batches
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Create academic cohorts, bind dedicated Batch Managers, and map mentor/student rosters.
              </p>
            </div>

            <button
              onClick={() => {
                setFormError("");
                setFormSuccess("");
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-[var(--accent-glow)] border border-transparent shrink-0"
            >
              <Plus size={16} />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Grid of Batches */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {batches.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl border bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
                <div className="w-16 h-16 rounded-3xl bg-[var(--bg-badge)] flex items-center justify-center text-[var(--text-accent)]">
                  <Layers size={28} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>No active batches</h3>
                  <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
                    No cohorts registered yet. Create your first batch mapping to begin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {batches.map((batch) => {
                  const mgrName = managers.find(m => m.id === batch.managerId)?.name || "Unassigned";
                  return (
                    <motion.div
                      key={batch.id}
                      layout
                      onClick={() => {
                        setSelectedBatchDetails(batch);
                        setActiveDetailTab("manager");
                        setActiveView("details");
                      }}
                      className="rounded-3xl border bg-[var(--bg-card)] p-6 space-y-5 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                            {batch.name}
                          </h3>
                          <p className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                            Created on {new Date(batch.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDelete(batch);
                          }}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Association badges */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-[var(--bg-primary)]/50 border flex flex-col items-center text-center space-y-1" style={{ borderColor: "var(--border-primary)" }}>
                          <Briefcase size={14} className="text-purple-400" />
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">Manager</span>
                          <span className="text-[10px] font-black truncate max-w-full text-[var(--text-primary)]">{mgrName}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-primary)]/50 border flex flex-col items-center text-center space-y-1" style={{ borderColor: "var(--border-primary)" }}>
                          <Award size={14} className="text-amber-400" />
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">Mentors</span>
                          <span className="text-xs font-black text-[var(--text-primary)]">{batch.mentorIds.length} Instructors</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-primary)]/50 border flex flex-col items-center text-center space-y-1" style={{ borderColor: "var(--border-primary)" }}>
                          <GraduationCap size={14} className="text-emerald-400" />
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">Students</span>
                          <span className="text-xs font-black text-[var(--text-primary)]">{batch.studentIds.length} Assigned</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Full Page Details View (Looks exactly like Manage People) */
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
          {/* Header section with back button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveView("list");
                  setSelectedBatchDetails(null);
                }}
                className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-accent)] hover:underline cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Back to batches</span>
              </button>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                Batch: {selectedBatchDetails?.name}
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Roster table mapping Batch Manager, active Mentors, and assigned Students.
              </p>
            </div>

            <button
              onClick={() => triggerDelete(selectedBatchDetails)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg border border-transparent shrink-0"
            >
              <Trash2 size={16} />
              <span>Delete Batch</span>
            </button>
          </div>

          {/* Roster Tabs List */}
          <div className="flex gap-2 p-1.5 rounded-2xl w-fit border shrink-0 bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
            <button
              onClick={() => setActiveDetailTab("manager")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeDetailTab === "manager"
                ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
                : "hover:bg-[var(--bg-primary)] border border-transparent"
                }`}
            >
              <Briefcase size={14} />
              <span>Batch Manager</span>
            </button>
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

          {/* Table Body (Styled identically to Manage People page) */}
          <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
            {detailsList.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[var(--bg-badge)] flex items-center justify-center text-[var(--text-accent)]">
                  <Users size={28} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>No members found</h3>
                  <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
                    No assigned members matched this role category for this batch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto min-w-0">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b text-[10px] font-extrabold uppercase tracking-wider select-none" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Role Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs font-semibold" style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                    {detailsList.map((member) => (
                      <tr key={member.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="px-6 py-4 font-black">{member.name}</td>
                        <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${member.role === "BATCH_MANAGER"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : member.role === "MENTOR"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                            {member.role.replace("_", " ")}
                          </span>
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

      {/* Creation Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden bg-[var(--bg-card)] flex flex-col max-h-[85vh]"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b shrink-0" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[var(--bg-badge)] text-[var(--text-accent)]">
                    <Layers size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Configure Batch
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable form body */}
              <form onSubmit={handleCreateBatchSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                {formError && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Batch Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Batch Name / Cohort Title
                  </label>
                  <input
                    type="text"
                    required
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="e.g. Batch-A"
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all placeholder:text-[var(--text-muted)]"
                    style={{ borderColor: "var(--border-primary)" }}
                  />
                </div>

                {/* Manager Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Assign Batch Manager (1 Role Max)
                  </label>
                  <select
                    value={selectedManagerId}
                    onChange={(e) => setSelectedManagerId(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all"
                    style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                  >
                    {managers.map((mgr) => (
                      <option key={mgr.id} value={mgr.id}>
                        {mgr.name} ({mgr.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentors Checklist */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Select Mentors (Multi-Batch Enabled)
                  </label>
                  <div className="max-h-28 overflow-y-auto p-3 rounded-2xl bg-[var(--bg-primary)] border space-y-2" style={{ borderColor: "var(--border-primary)" }}>
                    {mentors.map((men) => (
                      <div
                        key={men.id}
                        onClick={() => handleToggleMentor(men.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{men.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{men.email}</span>
                        </div>
                        {selectedMentorIds.includes(men.id) && (
                          <Check size={16} className="text-[var(--text-accent)]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Checklist */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Select Students (Multi-Batch Enabled)
                  </label>
                  <div className="max-h-36 overflow-y-auto p-3 rounded-2xl bg-[var(--bg-primary)] border space-y-2" style={{ borderColor: "var(--border-primary)" }}>
                    {students.map((std) => (
                      <div
                        key={std.id}
                        onClick={() => handleToggleStudent(std.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{std.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{std.email}</span>
                        </div>
                        {selectedStudentIds.includes(std.id) && (
                          <Check size={16} className="text-[var(--text-accent)]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Modal Actions */}
              <div className="p-6 border-t shrink-0 flex justify-end gap-3 bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all hover:bg-[var(--bg-primary)] cursor-pointer text-[var(--text-secondary)]"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreateBatchSubmit}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  Configure Batch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden p-6 text-center space-y-4 bg-[var(--bg-card)]"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-rose-500">
                  Are u sure want to delete this batch
                </h3>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  This will delete the batch mapping <strong className="font-extrabold" style={{ color: "var(--text-primary)" }}>{batchToDelete?.name}</strong>. Students and mentors assigned to this batch will be unlinked, but their accounts in the institute will not be deleted.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all hover:bg-[var(--bg-primary)] cursor-pointer text-[var(--text-secondary)]"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
