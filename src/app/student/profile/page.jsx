"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Activity, Award, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Activity Heatmap Component
const Heatmap = ({ data, totalActiveDays, maxStreak }) => {
  const weeks = 52;
  const days = 7;
  const today = new Date();
  
  // Generate last 365 days
  const grid = [];
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - (weeks * days) + 1);
  
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const count = data[dateStr] || 0;
      week.push({ date: dateStr, count });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    grid.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return "var(--bg-primary)";
    if (count < 2) return "rgba(16, 185, 129, 0.3)";
    if (count < 4) return "rgba(16, 185, 129, 0.6)";
    if (count < 6) return "rgba(16, 185, 129, 0.8)";
    return "rgba(16, 185, 129, 1)";
  };

  return (
    <div className="p-8 rounded-2xl border border-[var(--border-primary)] flex flex-col gap-8 relative overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>Activity Heatmap</h2>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{totalActiveDays} submissions in the past year</p>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
            <span>Total: {totalActiveDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-sm animate-pulse"></span>
            <span>Max Streak: {maxStreak}</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-[3px] min-w-max">
          {grid.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dIdx) => (
                <div 
                  key={dIdx} 
                  className="w-3.5 h-3.5 rounded-[2px] transition-all hover:ring-2 hover:ring-white/50 cursor-crosshair"
                  style={{ backgroundColor: getColor(day.count) }}
                  title={`${day.count} submissions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          <span>Learn</span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "var(--bg-primary)" }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "rgba(16, 185, 129, 0.3)" }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "rgba(16, 185, 129, 0.6)" }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "rgba(16, 185, 129, 1)" }} />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentProfile() {
  const router = useRouter();
  const { user, token, API_BASE } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        ...(token && !token.startsWith("demo-") && !token.startsWith("local-")
          ? { Authorization: `Bearer ${token}` }
          : { "x-bypass-auth": "true", "x-bypass-role": user.role === "ADMIN" ? "ADMIN" : "USER" }),
      };

      try {
        const statsRes = await fetch(`${API_BASE}/api/auth/student/stats`, { headers });
        if (statsRes.ok) {
          const data = await statsRes.json();
          if (data.success) setStats(data.stats);
        }

        const subsRes = await fetch(`${API_BASE}/api/submissions?userId=${user.id}`, { headers });
        if (subsRes.ok) {
          const data = await subsRes.json();
          if (data.success) {
            setRecentSubs((data.submissions || []).slice(0, 15));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile stats:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [user, token, API_BASE]);

  if (loading || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center space-x-3 text-[var(--text-muted)]">
        <Activity size={20} className="animate-spin" />
        <span className="text-sm font-bold tracking-wider uppercase">Loading Profile...</span>
      </div>
    );
  }

  const { totalProblems, solvedProblems, languages, heatmap, streaks } = stats;
  
  const easyPct = totalProblems.easy ? (solvedProblems.easy / totalProblems.easy) * 100 : 0;
  const mediumPct = totalProblems.medium ? (solvedProblems.medium / totalProblems.medium) * 100 : 0;
  const hardPct = totalProblems.hard ? (solvedProblems.hard / totalProblems.hard) * 100 : 0;
  
  const totalSolved = solvedProblems.easy + solvedProblems.medium + solvedProblems.hard;
  
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── Page Header ───────────────────────────── */}
      <div className="flex flex-col gap-2 pb-6 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <h1 className="text-3xl font-black font-serif-display tracking-tight" style={{ color: "var(--text-primary)" }}>Student Profile</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Manage your account and view your learning statistics.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: User Card */}
        <div className="w-full lg:w-1/3 space-y-8">
          {/* Main User Card */}
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-xl bg-zinc-500 text-white font-serif-display font-black text-4xl flex items-center justify-center shadow-lg transform -rotate-3">
                {user?.username?.[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>{user?.username}</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Rank: ~10,000</p>
              </div>
            </div>
            <div className="pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
              <button className="w-full py-3 rounded-xl font-bold text-xs bg-[var(--text-primary)] text-[var(--bg-primary)] hover:-translate-y-0.5 transition-transform">
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Community Stats */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-secondary)" }}>Community Stats</h2>
            <div className="space-y-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)] border" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-3">
                  <Award size={16} className="text-amber-500" />
                  <span>Views</span>
                </div>
                <span className="font-serif-display font-black text-lg text-amber-500">0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)] border" style={{ borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-emerald-500" />
                  <span>Reputation</span>
                </div>
                <span className="font-serif-display font-black text-lg text-emerald-500">0</span>
              </div>
            </div>
          </div>
          
          {/* Languages */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-secondary)" }}>Languages</h2>
            <div className="space-y-3">
              {languages.length > 0 ? languages.map(lang => (
                <div key={lang.language} className="flex items-center justify-between text-xs font-semibold p-2 border-b last:border-0" style={{ borderColor: "var(--border-primary)" }}>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-primary)" }}>{lang.language}</span>
                  <span className="text-[var(--text-secondary)]">
                    <span className="font-black text-[var(--text-primary)]">{lang.problemsSolved}</span> problems
                  </span>
                </div>
              )) : (
                <p className="text-xs text-[var(--text-muted)] italic">No languages used yet.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Solved Problems Ring */}
            <div className="p-8 rounded-2xl border border-[var(--border-primary)] flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="var(--bg-secondary)" strokeWidth="4" fill="transparent" />
                  
                  <circle cx="64" cy="64" r="44" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="4" fill="transparent" />
                  <circle cx="64" cy="64" r="44" stroke="#f43f5e" strokeWidth="4" fill="transparent" strokeDasharray="276.46" strokeDashoffset={276.46 - (276.46 * hardPct) / 100} strokeLinecap="square" />
                  
                  <circle cx="64" cy="64" r="51" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="4" fill="transparent" />
                  <circle cx="64" cy="64" r="51" stroke="#f59e0b" strokeWidth="4" fill="transparent" strokeDasharray="320.44" strokeDashoffset={320.44 - (320.44 * mediumPct) / 100} strokeLinecap="square" />
                  
                  <circle cx="64" cy="64" r="58" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="4" fill="transparent" />
                  <circle cx="64" cy="64" r="58" stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray="364.42" strokeDashoffset={364.42 - (364.42 * easyPct) / 100} strokeLinecap="square" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-serif-display text-[var(--text-primary)] leading-none">{totalSolved}</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-1">Solved</span>
                </div>
              </div>
              <div className="flex-1 ml-8 space-y-4 text-xs font-semibold">
                <div className="flex flex-col gap-1 text-emerald-500">
                  <div className="flex justify-between uppercase tracking-widest text-[9px]"><span>Easy</span><span>{totalProblems.easy} total</span></div>
                  <div className="w-full bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${easyPct}%` }} />
                  </div>
                  <div className="font-black text-right">{solvedProblems.easy}</div>
                </div>
                <div className="flex flex-col gap-1 text-amber-500">
                  <div className="flex justify-between uppercase tracking-widest text-[9px]"><span>Medium</span><span>{totalProblems.medium} total</span></div>
                  <div className="w-full bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${mediumPct}%` }} />
                  </div>
                  <div className="font-black text-right">{solvedProblems.medium}</div>
                </div>
                <div className="flex flex-col gap-1 text-rose-500">
                  <div className="flex justify-between uppercase tracking-widest text-[9px]"><span>Hard</span><span>{totalProblems.hard} total</span></div>
                  <div className="w-full bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${hardPct}%` }} />
                  </div>
                  <div className="font-black text-right">{solvedProblems.hard}</div>
                </div>
              </div>
            </div>
            
            {/* Badges Box */}
            <div className="p-8 rounded-2xl border border-[var(--border-primary)] flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-primary)] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
                <Award size={32} />
              </div>
              <div>
                <h2 className="text-lg font-black font-serif-display" style={{ color: "var(--text-primary)" }}>Badges</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-[200px]">0 Earned. Compete in arenas to unlock exclusive badges.</p>
              </div>
            </div>
          </div>
          
          {/* Heatmap Section */}
          <Heatmap data={heatmap} totalActiveDays={streaks.totalActiveDays} maxStreak={streaks.max} />
          
          {/* Recent Submissions */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] pb-2 border-b" style={{ color: "var(--text-secondary)", borderColor: "var(--border-primary)" }}>
              Recent Submissions
            </h2>
            
            {recentSubs.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {recentSubs.map((sub, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-[var(--border-primary)] premium-card hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group" style={{ borderColor: "var(--border-primary)" }} onClick={() => router.push(`/practice/${sub.problem?.slug || sub.problemId}`)}>
                    <div className="space-y-1">
                      <p className="text-sm font-bold group-hover:underline" style={{ color: "var(--text-primary)" }}>
                        {sub.problem?.title || `Problem #${sub.problemId}`}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {timeAgo(sub.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${sub.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {sub.status === 'ACCEPTED' ? 'Accepted' : 'Failed'}
                      </span>
                      <span className="px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest" style={{ borderColor: "var(--border-primary)" }}>
                        {sub.language}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-[var(--border-primary)] rounded-xl text-center" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-card)" }}>
                <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">No recent submissions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
