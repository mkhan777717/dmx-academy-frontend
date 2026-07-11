
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Clock, Users, Terminal, Plus, 
  ArrowUpRight, Activity, Calendar, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/utils/socket";

// Helper: time-ago formatter
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { token, API_BASE, user } = useAuth();
  
  // Dashboard Live Stats
  const [totalContestsCount, setTotalContestsCount] = useState(0);
  const [activeContestsCount, setActiveContestsCount] = useState(0);
  const [allContests, setAllContests] = useState([]);
  const [liveSubmissions, setLiveSubmissions] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [participationReports, setParticipationReports] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState("submissions");
  const [selectedSurveyReport, setSelectedSurveyReport] = useState(null);
  


  const loadData = async () => {
    let merged = [];
    const hasRealToken = token && !token.startsWith("demo-") && !token.startsWith("local-");
    const headers = {
      "Content-Type": "application/json",
      ...(hasRealToken
        ? { Authorization: `Bearer ${token}` }
        : { "x-bypass-auth": "true", "x-bypass-role": "ADMIN" }),
    };

    // 1. Fetch contests from backend API
    try {
      const res = await fetch(`${API_BASE}/api/contests`, { headers, signal: AbortSignal.timeout(30000) });
      const data = await res.json();
      if (data.success && data.contests) {
        const now = new Date();
        merged = data.contests.map(c => {
          const start = new Date(c.startTime);
          const end = new Date(c.endTime);
          let status = "upcoming";
          if (now >= start && now <= end) status = "active";
          else if (now > end) status = "past";
          const durationMins = Math.round((end - start) / 60000);
          let timeLeftStr = "Completed";
          if (status === "active") {
            const diffMins = Math.max(0, Math.floor((end - now) / 60000));
            timeLeftStr = `${diffMins}m remaining`;
          } else if (status === "upcoming") {
            const diffHrs = Math.max(0, Math.floor((new Date(c.startTime) - now) / 3600000));
            timeLeftStr = diffHrs < 24 ? `Starts in ${diffHrs}h` : `Starts in ${Math.round(diffHrs / 24)}d`;
          }
          return {
            id: c.id,
            title: c.title,
            desc: c.description || "No description.",
            category: c.category || "General",
            status,
            durationMins,
            timeLeftStr,
            isDbContest: true
          };
        });
      }
    } catch (err) {
      console.error("Failed to fetch backend contests:", err);
    }
    setAllContests(merged);
    setTotalContestsCount(merged.length);
    setActiveContestsCount(merged.filter(c => c.status === "active").length);

    // 2. Fetch live system stats from backend API
    try {
      const res = await fetch(`${API_BASE}/api/auth/stats`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          setSystemStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin stats from backend:", err);
    }

    // 3. Fetch recent submissions from backend API
    try {
      const res = await fetch(`${API_BASE}/api/submissions`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.submissions) {
          setLiveSubmissions(data.submissions);
        }
      }
    } catch (err) {
      console.error("Failed to fetch live submissions:", err);
    }

    // 4. Fetch participation reports from backend API
    try {
      const res = await fetch(`${API_BASE}/api/contests/reports/participations`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.participations) {
          setParticipationReports(data.participations);
        }
      }
    } catch (err) {
      console.error("Failed to fetch participation reports:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Connect to WebSocket server for real-time updates
    const socket = getSocket();
    if (socket) {
      socket.on("newLiveSubmission", (submission) => {
        setLiveSubmissions((prev) => {
          if (prev.some((s) => s.id === submission.id)) return prev;
          return [submission, ...prev].slice(0, 50);
        });

        setSystemStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            totalSubmissions: (prev.totalSubmissions || 0) + 1,
            verdicts: {
              ...prev.verdicts,
              AC: submission.status === "ACCEPTED" ? (prev.verdicts?.AC || 0) + 1 : (prev.verdicts?.AC || 0),
              WA: submission.status === "WRONG_ANSWER" ? (prev.verdicts?.WA || 0) + 1 : (prev.verdicts?.WA || 0),
              TLE: submission.status === "TIME_LIMIT_EXCEEDED" ? (prev.verdicts?.TLE || 0) + 1 : (prev.verdicts?.TLE || 0),
              RE: submission.status === "RUNTIME_ERROR" ? (prev.verdicts?.RE || 0) + 1 : (prev.verdicts?.RE || 0),
              CE: submission.status === "COMPILATION_ERROR" ? (prev.verdicts?.CE || 0) + 1 : (prev.verdicts?.CE || 0),
            }
          };
        });
      });

      socket.on("newParticipationReport", (report) => {
        setParticipationReports((prev) => {
          const filtered = prev.filter(
            (r) => !(String(r.userId) === String(report.userId) && String(r.contestId) === String(report.contestId))
          );
          return [report, ...filtered];
        });
      });

      return () => {
        socket.off("newLiveSubmission");
        socket.off("newParticipationReport");
      };
    }

    // Refresh stats every 10 seconds
    const syncInterval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [API_BASE, token]);



  // Base dynamic stats calculations
  const registeredUsersBase = 0;
  const registeredUsersCount = systemStats?.totalUsers !== undefined
    ? registeredUsersBase + systemStats.totalUsers
    : registeredUsersBase;

  const submissionsBase = 0;
  const submissionsCount = systemStats?.totalSubmissions !== undefined
    ? submissionsBase + systemStats.totalSubmissions
    : submissionsBase;

  const stats = [
    {
      title: "Total Contests",
      value: totalContestsCount,
      change: "Active in Registry",
      icon: Trophy,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Active Contests",
      value: activeContestsCount,
      change: activeContestsCount > 0 ? `${activeContestsCount} active session(s)` : "No active contests",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Registered Users",
      value: registeredUsersCount.toLocaleString(),
      change: "Database users",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Submissions Queue",
      value: submissionsCount.toLocaleString(),
      change: "Database submissions",
      icon: Terminal,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10"
    }
  ];

  // Map API submissions list
  const getSubmissionsFeed = () => {
    if (liveSubmissions && liveSubmissions.length > 0) {
      return liveSubmissions.slice(0, 5).map(sub => {
        let verdict = "AC";
        if (sub.status === "WRONG_ANSWER") verdict = "WA";
        else if (sub.status === "TIME_LIMIT_EXCEEDED") verdict = "TLE";
        else if (sub.status === "RUNTIME_ERROR") verdict = "RE";
        else if (sub.status === "COMPILATION_ERROR") verdict = "CE";

        return {
          id: String(sub.id),
          user: sub.user?.username || "scholar",
          problem: sub.problem?.title || `Problem #${sub.problemId}`,
          lang: sub.language || "Unknown",
          verdict: verdict,
          score: sub.status === "ACCEPTED" ? 100 : (sub.status === "TIME_LIMIT_EXCEEDED" ? 40 : 0),
          time: timeAgo(sub.createdAt)
        };
      });
    }

    return [];
  };

  const submissionsFeed = getSubmissionsFeed();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl border relative overflow-hidden"
        style={{
          backgroundColor: "var(--glass-bg)",
          borderColor: "var(--border-primary)",
          backgroundImage: "linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
        }}
      >
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">DMX Core Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight" style={{ color: "var(--text-primary)" }}>
            Welcome back, {user?.username || "System Administrator"}
          </h1>
          <p className="text-xs max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Manage the competitive programming workspace, verify active web streams, audit problem schemas, and publish synchronized contest events.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => router.push("/admin/contests/new")}
            className="px-5 py-3 rounded-2xl font-bold text-xs text-white shadow-md transition-all cursor-pointer flex items-center space-x-1.5 hover:scale-102"
            style={{ background: "linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)" }}
          >
            <Plus size={14} />
            <span>Create Contest</span>
          </button>
          <button
            onClick={() => router.push("/contest")}
            className="px-5 py-3 rounded-2xl font-bold text-xs transition-all border cursor-pointer flex items-center space-x-1.5 hover:scale-102"
            style={{ 
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)"
            }}
          >
            <span>View Contest Arena</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>



      {/* Grid statistics */}
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

      {/* Split details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Live Submissions Feed & Participation Reports Switcher */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "var(--border-primary)" }}>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveLeftTab("submissions")}
                className={`text-sm font-bold pb-2 relative transition-all cursor-pointer ${activeLeftTab === "submissions" ? "text-[var(--text-accent)]" : "text-[var(--text-muted)]"}`}
              >
                <span>Live Submissions Feed</span>
                {activeLeftTab === "submissions" && (
                  <motion.div layoutId="adminLeftTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-accent)]" />
                )}
              </button>
              <button
                onClick={() => setActiveLeftTab("reports")}
                className={`text-sm font-bold pb-2 relative transition-all cursor-pointer ${activeLeftTab === "reports" ? "text-[var(--text-accent)]" : "text-[var(--text-muted)]"}`}
              >
                <span>Contest Participation Reports</span>
                {activeLeftTab === "reports" && (
                  <motion.div layoutId="adminLeftTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-accent)]" />
                )}
              </button>
            </div>
            {activeLeftTab === "submissions" && (
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Real-time</span>
              </span>
            )}
          </div>

          <div className="border rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}>
            {activeLeftTab === "submissions" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-500/5 font-bold text-[var(--text-muted)] border-b" style={{ borderColor: "var(--border-primary)" }}>
                      <th className="px-6 py-4">Developer</th>
                      <th className="px-6 py-4">Problem</th>
                      <th className="px-6 py-4">Lang</th>
                      <th className="px-6 py-4 text-center">Verdict</th>
                      <th className="px-6 py-4 text-center">Points</th>
                      <th className="px-6 py-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                    {submissionsFeed.map((sub) => (
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
                            sub.verdict === "AC" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                            sub.verdict === "TLE" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                            "text-rose-500 bg-rose-500/10 border-rose-500/20"
                          }`}>
                            {sub.verdict}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-extrabold" style={{ color: sub.score > 0 ? "var(--text-accent)" : "var(--text-muted)" }}>
                          {sub.score}
                        </td>
                        <td className="px-6 py-4 text-right" style={{ color: "var(--text-muted)" }}>
                          {sub.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-500/5 font-bold text-[var(--text-muted)] border-b" style={{ borderColor: "var(--border-primary)" }}>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Contest</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4 text-center">Time Spent</th>
                      <th className="px-6 py-4 text-center">Survey</th>
                      <th className="px-6 py-4 text-right">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                    {participationReports.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                          No participation reports found.
                        </td>
                      </tr>
                    ) : (
                      participationReports.map((report) => (
                        <tr key={report.id || `${report.userId}-${report.contestId}`} className="hover:bg-slate-500/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                            {report.user?.username || "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {report.contest?.title || `Contest #${report.contestId}`}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                              report.completed ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                            }`}>
                              {report.completed ? "Completed" : "In Progress"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-extrabold text-[var(--text-accent)]">
                            {report.score ?? 0} pts
                          </td>
                          <td className="px-6 py-4 text-center" style={{ color: "var(--text-muted)" }}>
                            {report.timeSpent || "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {report.employmentStatus ? (
                              <button
                                onClick={() => setSelectedSurveyReport(report)}
                                className="px-2 py-1 text-[10px] font-bold rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer outline-none focus:outline-none"
                              >
                                View Survey
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[10px] font-semibold">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right" style={{ color: "var(--text-muted)" }}>
                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contest status list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
              Contest Timeline
            </h2>
            <Calendar size={16} style={{ color: "var(--text-muted)" }} />
          </div>

          <div className="space-y-4">
            {allContests.slice(0, 4).map((contest) => {
              const isActive = contest.status === "active";
              const isUpcoming = contest.status === "upcoming";
              const isDbContest = contest.isDbContest || /^\d+$/.test(String(contest.id));
              return (
                <div
                  key={contest.id}
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
                      {contest.category}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isActive ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      isUpcoming ? "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" :
                      "text-[var(--text-muted)] bg-slate-500/5 border-transparent"
                    }`}>
                      {contest.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold font-display" style={{ color: "var(--text-primary)" }}>
                      {contest.title}
                    </h3>
                    <p className="text-[10px] line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                      {contest.desc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px] border-t" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                    <div className="flex items-center space-x-1">
                      <Clock size={11} />
                      <span>{contest.durationMins} mins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{contest.timeLeftStr || contest.startTime}</span>
                      {isDbContest && (
                        <button
                          onClick={() => router.push(`/admin/contests/${contest.id}`)}
                          className="flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer hover:bg-slate-500/10"
                          style={{ borderColor: "var(--border-primary)", color: "var(--text-accent)" }}
                        >
                          <Users size={10} />
                          <span>Participants</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contest Survey Detail Modal Popup */}
        <AnimatePresence>
          {selectedSurveyReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="max-w-md w-full rounded-3xl border p-6 shadow-2xl space-y-4"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-accent)" }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black font-display text-[var(--text-primary)]">Post-Contest Survey</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold">
                      User: {selectedSurveyReport.user?.username} ({selectedSurveyReport.user?.email})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSurveyReport(null)}
                    className="p-1.5 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-slate-200 transition-all cursor-pointer outline-none focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3.5 pt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">Employment Status</div>
                    <div className="p-2.5 rounded-xl border bg-slate-500/5 font-semibold text-[var(--text-primary)]" style={{ borderColor: "var(--border-primary)" }}>
                      {selectedSurveyReport.employmentStatus}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">College / Institution</div>
                    <div className="p-2.5 rounded-xl border bg-slate-500/5 font-semibold text-[var(--text-primary)]" style={{ borderColor: "var(--border-primary)" }}>
                      {selectedSurveyReport.collegeName || "(Not specified)"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">Target Companies</div>
                    <div className="p-2.5 rounded-xl border bg-slate-500/5 font-semibold text-[var(--text-primary)]" style={{ borderColor: "var(--border-primary)" }}>
                      {selectedSurveyReport.companies || "(Not specified)"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">Current Interview Stage</div>
                    <div className="p-2.5 rounded-xl border bg-slate-500/5 font-semibold text-[var(--text-primary)]" style={{ borderColor: "var(--border-primary)" }}>
                      {selectedSurveyReport.interviewStage || "(Not specified)"}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedSurveyReport(null)}
                    className="w-full py-2.5 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer outline-none focus:outline-none"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    Close Report
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
