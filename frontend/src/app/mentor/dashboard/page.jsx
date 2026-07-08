"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckSquare, Calendar, Star,
  ArrowUpRight, Clock, Award, Activity,
  ChevronRight, BookOpen, Send, CheckCircle,
  FileCode, Sparkles, MessageCircle, Plus, X
} from "lucide-react";

export default function MentorDashboard() {
  const router = useRouter();
  
  // Interactive Code Review States
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewScore, setReviewScore] = useState(100);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState([
    { id: "review-1", user: "quantum_coder", problem: "VDOM Reconciliation", lang: "JavaScript", status: "Needs Review", time: "10 mins ago", code: `// Virtual DOM Diff Implementation\nfunction diff(oldNode, newNode) {\n  if (!oldNode) return { type: 'CREATE', newNode };\n  if (!newNode) return { type: 'REMOVE' };\n  if (changed(oldNode, newNode)) {\n    return { type: 'REPLACE', newNode };\n  }\n  if (newNode.type) {\n    return {\n      type: 'UPDATE',\n      children: diffChildren(oldNode, newNode),\n      props: diffProps(oldNode, newNode)\n    };\n  }\n}` },
    { id: "review-2", user: "lex_dev", problem: "Rate Limiter Design", lang: "Go", status: "Needs Review", time: "30 mins ago", code: `package main\n\nimport (\n\t"sync"\n\t"time"\n)\n\ntype TokenBucket struct {\n\tcapacity  int64\n\trate      time.Duration\n\ttokens    int64\n\tlastRefill time.Time\n\tmu        sync.Mutex\n}` },
    { id: "review-3", user: "security_guru", problem: "Merkle Tree Verification", lang: "Rust", status: "Under Review", time: "1 hour ago", code: `pub fn verify_proof(root: &[u8; 32], leaf: &[u8; 32], proof: &Vec<[u8; 32]>, index: usize) -> bool {\n    let mut hash = *leaf;\n    let mut idx = index;\n    for sibling in proof {\n        if idx % 2 == 0 {\n            hash = hash_pair(&hash, sibling);\n        } else {\n            hash = hash_pair(sibling, &hash);\n        }\n        idx /= 2;\n    }\n    hash == *root\n}` },
    { id: "review-4", user: "byte_knight", problem: "Two Sum", lang: "C++", status: "Needs Review", time: "2 hours ago", code: `#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    for(int i = 0; i < nums.size(); ++i) {\n        int complement = target - nums[i];\n        if(seen.count(complement)) return {seen[complement], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}` }
  ]);

  // Office hours coordinator slots
  const [officeHours, setOfficeHours] = useState([
    { id: "slot-1", topic: "NextJS React Compiler Features", time: "Tomorrow at 2:00 PM", active: true },
    { id: "slot-2", topic: "System Design: Scaling Key-Value Stores", time: "Friday at 4:30 PM", active: false }
  ]);
  const [newSlotTopic, setNewSlotTopic] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");
  const [showAddSlot, setShowAddSlot] = useState(false);

  const [notification, setNotification] = useState(null);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddOfficeHour = (e) => {
    e.preventDefault();
    if (!newSlotTopic || !newSlotTime) return;
    const newSlot = {
      id: `slot-${Date.now()}`,
      topic: newSlotTopic,
      time: newSlotTime,
      active: false
    };
    setOfficeHours([...officeHours, newSlot]);
    setNewSlotTopic("");
    setNewSlotTime("");
    setShowAddSlot(false);
    triggerNotification("🎉 Scheduled new Office Hour slot!");
  };

  const handleSubmitReview = (reviewId) => {
    setReviewsList(reviewsList.map(r => 
      r.id === reviewId ? { ...r, status: "Reviewed" } : r
    ));
    setSelectedReview(null);
    setReviewComment("");
    triggerNotification(`✓ Submission graded! Final score: ${reviewScore} pts`);
  };

  const stats = [
    {
      title: "Scholars Guided",
      value: "45 Active",
      change: "+6 new scholars this week",
      icon: Users,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Reviews Conducted",
      value: `${reviewsList.filter(r => r.status === "Reviewed").length} Reviewed`,
      change: `${reviewsList.filter(r => r.status !== "Reviewed").length} remaining in queue`,
      icon: CheckSquare,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Office Hours",
      value: `${officeHours.length} Scheduled`,
      change: "Active slots coordinator",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Mentor Rating",
      value: "4.95 / 5.0",
      change: "Based on 84 review votes",
      icon: Star,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  const mentoredTracks = [
    { id: "m-1", name: "Web & Mobile Development", activeScholars: 24, activeReviews: 5, rating: 4.9, progress: 80 },
    { id: "m-2", name: "Creative Tech & Blockchain", activeScholars: 12, activeReviews: 2, rating: 5.0, progress: 65 },
    { id: "m-3", name: "Data & AI Systems", activeScholars: 9, activeReviews: 3, rating: 4.8, progress: 40 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl border relative overflow-hidden"
        style={{
          backgroundColor: "var(--glass-bg)",
          borderColor: "var(--border-primary)",
          backgroundImage: "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)"
        }}
      >
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400">Mentor Command Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight" style={{ color: "var(--text-primary)" }}>
            Welcome back, Instructor!
          </h1>
          <p className="text-xs max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Review pending code speedruns, coordinate live mentoring office hours, audit course tracks, and check scholar analytics.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => router.push("/contest")}
            className="px-5 py-3 rounded-2xl font-bold text-xs text-white shadow-md transition-all cursor-pointer flex items-center space-x-1.5 hover:scale-102"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}
          >
            <Award size={14} />
            <span>Manage Contests</span>
          </button>
          <button
            onClick={() => router.push("/courses")}
            className="px-5 py-3 rounded-2xl font-bold text-xs transition-all border cursor-pointer flex items-center space-x-1.5 hover:scale-102"
            style={{ 
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)"
            }}
          >
            <span>Browse Curriculum</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl border text-xs text-center font-bold bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-card)"
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <IconComponent size={16} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Pending Submissions review queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
              Pending Submissions Queue
            </h2>
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Awaiting Feedback</span>
            </span>
          </div>

          <div className="border rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-500/5 font-bold text-[var(--text-muted)] border-b" style={{ borderColor: "var(--border-primary)" }}>
                    <th className="px-6 py-4">Scholar</th>
                    <th className="px-6 py-4">Challenge</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                  {reviewsList.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                        {sub.user}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {sub.problem}
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px]">
                        {sub.lang}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          sub.status === "Reviewed" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                          sub.status === "Under Review" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                          "text-rose-500 bg-rose-500/10 border-rose-500/20"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {sub.status !== "Reviewed" ? (
                          <button
                            onClick={() => setSelectedReview(sub)}
                            className="px-3.5 py-1.5 rounded-xl border text-[10px] font-bold text-white transition-all cursor-pointer hover:scale-102 flex items-center space-x-1"
                            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}
                          >
                            <FileCode size={11} />
                            <span>Review Code</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Code IDE Viewer (Expandable overlay) */}
          <AnimatePresence>
            {selectedReview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-panel p-6 rounded-3xl border shadow-xl space-y-4"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-accent)" }}
              >
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-primary)" }}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                      <FileCode size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                        Speedrun Review Desk
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Assessing {selectedReview.user}&apos;s solution for <strong>{selectedReview.problem}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-500/10 cursor-pointer"
                  >
                    <X size={15} style={{ color: "var(--text-secondary)" }} />
                  </button>
                </div>

                {/* Simulated IDE code wrapper */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300">
                  <pre>{selectedReview.code}</pre>
                </div>

                {/* Score slider & review content */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Assign Score ({reviewScore} pts)
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        step="10"
                        value={reviewScore}
                        onChange={(e) => setReviewScore(Number(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-violet-400 pl-1">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>Suggested: 180-200 pts for dynamic optimal resolution</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Feedback/Review Comments
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder="Write constructive suggestions on performance optimization, structure, and readability..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full rounded-2xl p-3 text-xs outline-none border transition-all resize-none bg-slate-900/40 border-slate-800 text-[var(--text-primary)]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-1">
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="px-4 py-2 text-xs font-bold border rounded-xl hover:bg-slate-500/10 cursor-pointer"
                      style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReview(selectedReview.id)}
                      className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 flex items-center space-x-1.5"
                      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}
                    >
                      <Send size={11} />
                      <span>Submit Review Feedback</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Mentoring Cohorts & Office Hours Planner */}
        <div className="space-y-8">
          
          {/* Cohorts Progress cards */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
                Mentoring Cohorts
              </h2>
              <Activity size={16} style={{ color: "var(--text-muted)" }} />
            </div>

            <div className="space-y-4">
              {mentoredTracks.map((cohort) => (
                <div
                  key={cohort.id}
                  className="p-5 rounded-3xl border shadow-sm space-y-3 relative group overflow-hidden"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-card)"
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border bg-slate-500/5"
                      style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}
                    >
                      Active Group
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-500">
                      <Star size={12} className="fill-amber-500" />
                      <span>{cohort.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold font-display" style={{ color: "var(--text-primary)" }}>
                      {cohort.name}
                    </h3>
                    {/* Linear Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px]" style={{ color: "var(--text-secondary)" }}>
                        <span>Cohort Progress</span>
                        <span>{cohort.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-500/10 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400 transition-all duration-1000" style={{ width: `${cohort.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px] border-t" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>{cohort.activeScholars} scholars enrolled</span>
                    <button className="font-bold text-[var(--text-accent)] hover:underline">
                      Audit Cohort
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office hours scheduler widget */}
          <div className="glass-panel p-5 rounded-3xl border space-y-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Office Hours Calendar
              </h2>
              <button
                onClick={() => setShowAddSlot(!showAddSlot)}
                className="p-1.5 rounded-lg border hover:bg-slate-500/10 cursor-pointer"
                style={{ borderColor: "var(--border-primary)" }}
              >
                {showAddSlot ? <X size={12} style={{ color: "var(--text-secondary)" }} /> : <Plus size={12} style={{ color: "var(--text-accent)" }} />}
              </button>
            </div>

            {/* Quick scheduler form */}
            <AnimatePresence>
              {showAddSlot && (
                <motion.form
                  onSubmit={handleAddOfficeHour}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 p-3.5 rounded-2xl border bg-slate-500/5 overflow-hidden"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                      Topic Discussion
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Rate Limiting Algorithms"
                      value={newSlotTopic}
                      onChange={(e) => setNewSlotTopic(e.target.value)}
                      className="w-full rounded-xl py-2 px-3 text-[11px] outline-none border bg-slate-900/30 text-white"
                      style={{ borderColor: "var(--border-primary)" }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                      Date &amp; Time
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Monday at 3:00 PM"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="w-full rounded-xl py-2 px-3 text-[11px] outline-none border bg-slate-900/30 text-white"
                      style={{ borderColor: "var(--border-primary)" }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-[10px] text-white transition-all cursor-pointer hover:scale-101"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}
                  >
                    Confirm Event Slot
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {officeHours.map((slot) => (
                <div 
                  key={slot.id}
                  className="p-3.5 rounded-2xl border flex items-center justify-between"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>{slot.topic}</p>
                    <div className="flex items-center space-x-1.5 text-[9px]" style={{ color: "var(--text-secondary)" }}>
                      <Clock size={10} />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold shrink-0 ${
                    slot.active 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-slate-500/5 border-transparent text-slate-400"
                  }`}>
                    {slot.active ? "Upcoming" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
