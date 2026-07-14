"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Trophy, LogOut,
  Menu, X, ChevronLeft, ChevronRight, BookOpen, ArrowLeftRight,
  Code, Brain, Radio, AlertTriangle, FileText, Gamepad2, FileCheck, Activity, Settings, Paintbrush
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user, token, API_BASE } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [studentUser, setStudentUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [roleName, setRoleName] = useState("Scholar");

  useEffect(() => {
    if (!user) return;
    async function fetchRank() {
      const headers = {
        "Content-Type": "application/json",
        ...(token && !token.startsWith("demo-") && !token.startsWith("local-")
          ? { Authorization: `Bearer ${token}` }
          : { "x-bypass-auth": "true", "x-bypass-role": user.role === "ADMIN" ? "ADMIN" : "USER" }),
      };
      try {
        const subRes = await fetch(`${API_BASE}/api/submissions?userId=${user.id}`, { headers });
        let uniqueSolved = 0;
        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.success) {
            const accepted = (subData.submissions || []).filter(s => s.status === "ACCEPTED");
            uniqueSolved = new Set(accepted.map(s => s.problemId)).size;
          }
        }
        const contestRes = await fetch(`${API_BASE}/api/contests`, { headers });
        let bestScore = 0;
        if (contestRes.ok) {
          const contestData = await contestRes.json();
          if (contestData.success) {
            const myParticipations = (contestData.contests || []).filter(c => c.userParticipation && c.userParticipation.completed);
            bestScore = myParticipations.length > 0 ? Math.max(...myParticipations.map(c => c.userParticipation?.score || 0)) : 0;
          }
        }
        const points = uniqueSolved * 10 + bestScore;
        const RANKS = [
          { name: "Novice Scholar", minPoints: 0, maxPoints: 100 },
          { name: "Bronze Scholar", minPoints: 100, maxPoints: 200 },
          { name: "Silver Scholar", minPoints: 200, maxPoints: 300 },
          { name: "Gold Scholar", minPoints: 300, maxPoints: 400 },
          { name: "Elite Scholar III", minPoints: 400, maxPoints: 500 },
          { name: "Elite Scholar II", minPoints: 500, maxPoints: 600 },
          { name: "Elite Scholar I", minPoints: 600, maxPoints: 750 },
          { name: "Grandmaster Scholar", minPoints: 750, maxPoints: 1000 },
          { name: "Legendary Coder", minPoints: 1000, maxPoints: Infinity }
        ];
        const matchedRank = RANKS.find(r => points >= r.minPoints && points < r.maxPoints) || RANKS[0];
        setRoleName(matchedRank.name);
      } catch (e) {
        console.error("Failed to fetch user rank for layout:", e);
      }
    }
    fetchRank();
  }, [user, token, API_BASE]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentSession = localStorage.getItem("synapse_student_session") === "true";
      const isLoginRoute = pathname === "/student";
      if (!studentSession) {
        router.push("/login?redirect=/student/dashboard");
      } else if (isLoginRoute) {
        router.push("/student/dashboard");
      } else {
        const name = user?.username || "DMX Student";
        const email = user?.email || "student@synapse.com";
        const avatar = name.slice(0, 2).toUpperCase();
        setStudentUser({ name, email, role: roleName, avatar });
      }
      setCheckingAuth(false);
    }
  }, [pathname, router, user, roleName]);

  const handleLogout = () => setShowLogoutConfirm(true);
  const isLoginRoute = pathname === "/student";

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 rounded-full border-t-transparent animate-spin mx-auto" style={{ borderColor: "var(--accent-primary)" }} />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Verifying authorization…</p>
        </div>
      </div>
    );
  }

  if (isLoginRoute) return <>{children}</>;

  const sidebarLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Practice Arena", href: "/practice", icon: Code },
    { label: "Contest Arena", href: "/contest", icon: Trophy },
    { label: "Course Catalog", href: "/courses", icon: BookOpen },
    { label: "AI Viva", href: "/student/viva", icon: Brain },
    { label: "Live Sessions", href: "/live-classes", icon: Radio },
    { label: "Learn with Games", href: "/student/games", icon: Gamepad2 },
    { label: "Study Materials", href: "/student/materials", icon: FileText },
    { label: "Resume Builder", href: "/student/resume", icon: FileCheck },
  ];

  const pageTitle = pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ") || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* ── DESKTOP SIDEBAR ─────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-full border-r transition-all duration-300 relative z-30"
        style={{ width: isSidebarCollapsed ? "68px" : "240px", backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border-primary)" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b" style={{ borderColor: "var(--border-primary)" }}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md flex items-center justify-center text-white flex-shrink-0" style={{ background: "var(--accent-gradient)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>DMX Academy</span>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="h-6 w-6 rounded-md flex items-center justify-center text-white mx-auto" style={{ background: "var(--accent-gradient)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          )}
        </div>

        {/* Section label */}
        {!isSidebarCollapsed && (
          <div className="px-4 pt-5 pb-2">
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--text-muted)" }}>Navigation</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/student/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all relative group"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--bg-hover)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {/* Active indicator */}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-primary)" }} />}
                <LinkIcon size={15} className="flex-shrink-0" style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }} />
                {!isSidebarCollapsed && <span>{link.label}</span>}

                {/* Collapsed tooltip */}
                {isSidebarCollapsed && (
                  <div className="absolute left-14 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] text-[10px] py-1.5 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: collapse toggle + theme */}
        <div className="p-2 border-t space-y-1" style={{ borderColor: "var(--border-primary)" }}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[11px] transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!isSidebarCollapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER ────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-72 h-full flex flex-col p-5 shadow-2xl"
            style={{ backgroundColor: "var(--bg-sidebar)", borderRight: "1px solid var(--border-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md flex items-center justify-center text-white" style={{ background: "var(--accent-gradient)" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>DMX Academy</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5">
              {sidebarLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)", backgroundColor: isActive ? "var(--bg-hover)" : "transparent", fontWeight: isActive ? 600 : 400 }}
                  >
                    <LinkIcon size={14} style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg md:hidden" style={{ color: "var(--text-secondary)" }}>
              <Menu size={16} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Student</span>
              <span>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{pageTitle}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Public site link */}
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium transition-colors px-3 py-1.5 rounded-lg border"
              style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <ArrowLeftRight size={11} />
              <span>Public Site</span>
            </Link>



            {/* Avatar + profile menu */}
            {studentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "var(--accent-gradient)" }}>
                    {studentUser.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{studentUser.name}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{roleName}</div>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-xl z-50 overflow-hidden"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>

                      {/* Profile header */}
                      <div className="p-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: "var(--accent-gradient)" }}>
                            {studentUser.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{studentUser.name}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{roleName}</div>
                          </div>
                        </div>
                      </div>

                      {/* Quick links */}
                      <div className="grid grid-cols-3 gap-1 p-2 border-b" style={{ borderColor: "var(--border-primary)" }}>
                        {[
                          { label: "My Lists", href: "/student/lists", icon: <BookOpen size={14} /> },
                          { label: "Notebook", href: "/student/notebook", icon: <FileText size={14} /> },
                          { label: "Profile", href: "/student/profile", icon: <Activity size={14} /> },
                        ].map(item => (
                          <Link key={item.href} href={item.href} onClick={() => setIsProfileMenuOpen(false)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-colors text-center"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <span style={{ color: "var(--accent-primary)" }}>{item.icon}</span>
                            <span className="text-[9px] font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Theme in menu */}
                      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--border-primary)" }}>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <Paintbrush size={13} />
                          <span>Appearance</span>
                        </div>
                        <div className="scale-[0.85] origin-right"><ThemeToggle /></div>
                      </div>

                      {/* Logout */}
                      <div className="p-2">
                        <button onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left"
                          style={{ color: "var(--text-secondary)" }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                        >
                          <LogOut size={13} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* ── LOGOUT MODAL ─────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl p-6 border shadow-2xl text-center space-y-5"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black" style={{ color: "var(--text-primary)" }}>Sign out?</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>You'll need to sign back in to access your study portal.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer"
                style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                Cancel
              </button>
              <button type="button" onClick={() => { setShowLogoutConfirm(false); logout(); router.push("/login?redirect=/student/dashboard"); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
