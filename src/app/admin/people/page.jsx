"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Trash2, Mail, Shield, GraduationCap, X,
  CheckCircle2, AlertCircle, Calendar, Briefcase, Award, Layers
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ManagePeoplePage() {
  const router = useRouter();
  const { token, API_BASE, user } = useAuth();

  // Tab state: 'managers' | 'mentors' | 'students'
  const [activeTab, setActiveTab] = useState("managers");

  // In-memory mock database state for UI phase
  const [people, setPeople] = useState([
    { id: 1, name: "Aditya", email: "aditya@dmx.com", role: "BATCH_MANAGER", dateAdded: "2026-06-15" },
    { id: 2, name: "Mohammed Majeed Khan", email: "majeed@dmx.com", role: "MENTOR", dateAdded: "2026-06-16" },
    { id: 3, name: "Arhan Khan", email: "arhan@dmx.com", role: "STUDENT", dateAdded: "2026-06-20" },
    { id: 4, name: "Sakshi", email: "sakshi@dmx.com", role: "BATCH_MANAGER", dateAdded: "2026-06-18" },
    { id: 5, name: "Nitin Singh", email: "nitin@dmx.com", role: "MENTOR", dateAdded: "2026-06-19" },
    { id: 6, name: "Divyashant Kumar", email: "divyashant@dmx.com", role: "MENTOR", dateAdded: "2026-06-20" },
    { id: 7, name: "Shahazadi Syed", email: "shahazadi@dmx.com", role: "STUDENT", dateAdded: "2026-06-21" },
    { id: 8, name: "Abhishek Kumar", email: "abhishek@dmx.com", role: "STUDENT", dateAdded: "2026-06-22" },
    { id: 9, name: "Ishaan Khandelwaal", email: "ishaan@dmx.com", role: "STUDENT", dateAdded: "2026-06-23" },
  ]);

  // Form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [memberRole, setMemberRole] = useState("BATCH_MANAGER");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Security Check: Redirect if not institute admin or admin
  useEffect(() => {
    if (user && user.role !== "INSTITUTE_ADMIN" && user.role !== "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  const handleAddMember = (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("All fields are required.");
      return;
    }

    if (people.some(p => p.email.toLowerCase() === email.trim().toLowerCase())) {
      setFormError("Email is already in use by another member.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: memberRole,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    // Save locally
    setPeople(prev => [...prev, newMember]);
    setFormSuccess("Member registered successfully!");

    // Clear inputs
    setName("");
    setEmail("");
    setPassword("");

    setTimeout(() => {
      setIsAddModalOpen(false);
      setFormSuccess("");
    }, 1200);
  };

  const triggerDelete = (member) => {
    setItemToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setPeople(prev => prev.filter(p => p.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const getRoleLabel = (role) => {
    if (role === "BATCH_MANAGER") return "batch manager";
    if (role === "MENTOR") return "mentor";
    return "student";
  };

  // Helper to resolve the assigned batches for each member
  const getBatchesForUser = (userId, role) => {
    const mockBatches = [
      { name: "Batch-A", managerId: 1, mentorIds: [2, 5], studentIds: [3, 7] },
      { name: "Batch-B", managerId: 4, mentorIds: [5, 6], studentIds: [8, 9] }
    ];
    const matched = [];
    for (const b of mockBatches) {
      if (role === "BATCH_MANAGER" && b.managerId === userId) matched.push(b.name);
      if (role === "MENTOR" && b.mentorIds.includes(userId)) matched.push(b.name);
      if (role === "STUDENT" && b.studentIds.includes(userId)) matched.push(b.name);
    }
    return matched.length > 0 ? matched.join(", ") : "None";
  };

  const filteredPeople = people.filter(p => {
    if (activeTab === "managers") return p.role === "BATCH_MANAGER";
    if (activeTab === "mentors") return p.role === "MENTOR";
    return p.role === "STUDENT";
  });

  if (!user || (user.role !== "INSTITUTE_ADMIN" && user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 min-h-0 flex flex-col flex-1" style={{ color: "var(--text-primary)" }}>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-badge)] text-[var(--text-accent)] text-[10px] font-extrabold uppercase tracking-wider">
              Institute Directory
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Manage People
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Register and configure accounts for batch managers, mentors, and students within your institute.
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
          <UserPlus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 p-1.5 rounded-2xl w-fit border shrink-0 bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
        <button
          onClick={() => setActiveTab("managers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "managers"
            ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
            : "hover:bg-[var(--bg-primary)]"
            }`}
        >
          <Briefcase size={14} />
          <span>Batch Managers</span>
        </button>
        <button
          onClick={() => setActiveTab("mentors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "mentors"
            ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
            : "hover:bg-[var(--bg-primary)]"
            }`}
        >
          <Award size={14} />
          <span>Mentors</span>
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "students"
            ? "bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-glow)]"
            : "hover:bg-[var(--bg-primary)]"
            }`}
        >
          <GraduationCap size={14} />
          <span>Students</span>
        </button>
      </div>

      {/* Directory Table Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border bg-[var(--bg-card)]" style={{ borderColor: "var(--border-primary)" }}>
        {filteredPeople.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[var(--bg-badge)] flex items-center justify-center text-[var(--text-accent)]">
              <Users size={28} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>No members found</h3>
              <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
                No active records matched this role criteria. Add a member to begin populating the list.
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
                  <th className="px-6 py-4">Assigned Batch</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-semibold" style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                {filteredPeople.map((member) => (
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Layers size={12} className="text-[var(--text-muted)] shrink-0" />
                        <span className="font-extrabold text-[var(--text-secondary)]">
                          {getBatchesForUser(member.id, member.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{new Date(member.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => triggerDelete(member)}
                        className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors cursor-pointer border border-rose-500/20 bg-rose-500/5 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden bg-[var(--bg-card)]"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[var(--bg-badge)] text-[var(--text-accent)]">
                    <UserPlus size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                    Register Member
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleAddMember} className="p-6 space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold animate-shake">
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

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Mishra"
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all placeholder:text-[var(--text-muted)]"
                    style={{ borderColor: "var(--border-primary)" }}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@dmx.com"
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all placeholder:text-[var(--text-muted)]"
                    style={{ borderColor: "var(--border-primary)" }}
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all placeholder:text-[var(--text-muted)]"
                    style={{ borderColor: "var(--border-primary)" }}
                  />
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    Role Category
                  </label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--border-accent)] transition-all"
                    style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                  >
                    <option value="BATCH_MANAGER">Batch Manager</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
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
                    className="px-5 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs font-black uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                  >
                    Register Member
                  </button>
                </div>
              </form>
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
                  Are u sure want to delete this {getRoleLabel(itemToDelete?.role)}
                </h3>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  This action will permanently remove <strong className="font-extrabold" style={{ color: "var(--text-primary)" }}>{itemToDelete?.name}</strong> from the institute database immediately.
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
