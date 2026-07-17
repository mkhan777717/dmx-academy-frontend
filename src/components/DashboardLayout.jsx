"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Trophy, LogOut,
  Menu, X, ChevronLeft, ChevronRight, BookOpen, ArrowLeftRight,
  Code, Brain, Radio, AlertTriangle, FileText, Gamepad2, FileCheck, Activity, Settings, Paintbrush,
  ShieldAlert, Layers, Users, PlusCircle, List
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import useThemeStore from "@/store/useThemeStore";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user, token, API_BASE, activeSession, setActiveSession } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [dashboardUser, setDashboardUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Role & Session States
  const [roleName, setRoleName] = useState("Scholar");
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState(null);

  const effectiveRole = user?.role || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("eduvantix_auth_user") || "{}")?.role : null);
  const isSuperAdmin = effectiveRole === "ADMIN";
  const isInstAdmin = effectiveRole === "INSTITUTE_ADMIN";
  const isBatchMgr = effectiveRole === "BATCH_MANAGER";
  const isMentor = effectiveRole === "MENTOR";
  const isStudent = effectiveRole === "USER";
  const { isDark, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);
  const isStudentSession = typeof window !== "undefined" && localStorage.getItem("synapse_student_session") === "true";
  const isAdminSession = typeof window !== "undefined" && localStorage.getItem("synapse_admin_session") === "true";
  const isMentorSession = typeof window !== "undefined" && localStorage.getItem("synapse_mentor_session") === "true";

  useEffect(() => {
    if (!user || !isStudentSession) return;
    async function fetchRank() {
      const headers = {
        "Content-Type": "application/json",
        ...(token && !token.startsWith("demo-") && !token.startsWith("local-")
          ? { Authorization: `Bearer ${token}` }
          : { "x-bypass-auth": "true", "x-bypass-role": "USER" }),
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
  }, [user, token, API_BASE, isStudentSession]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoginRoute = pathname === "/student" || pathname === "/admin" || pathname === "/mentor";

      const hasSession = isStudentSession || isAdminSession || isMentorSession;

      if (!hasSession && !pathname.startsWith('/practice') && !pathname.startsWith('/contest') && !pathname.startsWith('/courses') && !pathname.startsWith('/live-classes')) {
        if (pathname.startsWith('/admin') || pathname.startsWith('/mentor') || pathname.startsWith('/student')) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }
      }

      if (hasSession && isLoginRoute) {
        if (isAdminSession) router.push("/admin/dashboard");
        else if (isMentorSession) router.push("/mentor/dashboard");
        else router.push("/student/dashboard");
      } else if (hasSession) {
        const name = user?.username || "Eduvantix User";
        const email = user?.email || "user@synapse.com";
        const avatarUrl = user?.avatarUrl || null;
        const initials = name.slice(0, 2).toUpperCase();

        let displayRole = "User";
        if (isStudentSession) displayRole = roleName;
        else if (isMentorSession) displayRole = "Mentor";
        else if (isSuperAdmin) displayRole = "Super Admin";
        else if (isInstAdmin) displayRole = "Institute Admin";
        else if (isBatchMgr) displayRole = "Batch Manager";

        setDashboardUser({ name, email, role: displayRole, initials, avatarUrl });
      }
      setCheckingAuth(false);
    }
  }, [pathname, router, user, roleName, isStudentSession, isAdminSession, isMentorSession]);

  const handleLogout = () => setShowLogoutConfirm(true);

  const handleSafeNavigation = (target) => {
    if (activeSession && target !== "/admin/live") {
      setPendingNavAction({ action: target });
      setShowEndConfirmModal(true);
    } else {
      if (typeof target === "string") {
        router.push(target);
      } else if (typeof target === "function") {
        target();
      }
    }
  };

  const handleConfirmEndSession = async () => {
    setShowEndConfirmModal(false);
    if (activeSession) {
      try {
        await fetch(`${API_BASE}/api/livekit/session/${activeSession.id}/end`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Failed to end session:", err);
      }
      setActiveSession(null);
    }
    if (pendingNavAction && pendingNavAction.action) {
      const action = pendingNavAction.action;
      if (typeof action === "string") router.push(action);
      else if (typeof action === "function") action();
    }
    setPendingNavAction(null);
  };

  const isLoginRoute = pathname === "/student" || pathname === "/admin" || pathname === "/mentor";

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

  const isPracticeWorkspace = pathname.startsWith("/practice/");
  if (isPracticeWorkspace) return <>{children}</>;

  const isPublicRoute = !dashboardUser && (pathname.startsWith('/practice') || pathname.startsWith('/contest') || pathname.startsWith('/courses') || pathname.startsWith('/live-classes'));

  if (isPublicRoute) {
    return <>{children}</>;
  }

  let sidebarLinks = [];

  if (isStudentSession) {
    sidebarLinks = [
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
  } else {
    sidebarLinks = [
      {
        label: "Dashboard",
        href: isMentor ? "/mentor/dashboard" : "/admin/dashboard",
        icon: LayoutDashboard
      },
      isSuperAdmin && { label: "Institutes & Admins", href: "/admin/institutes", icon: ShieldAlert },
      isInstAdmin && { label: "Manage Batches", href: "/admin/batches", icon: Layers },
      isInstAdmin && { label: "Manage People", href: "/admin/people", icon: Users },
      isBatchMgr && { label: "My Batches", href: "/admin/batch-manager", icon: Layers },
      (isBatchMgr || isInstAdmin || isMentor) && { label: "AI Viva", href: "/mentor/viva/questions", icon: Brain },
      (isBatchMgr || isInstAdmin || isMentor) && { label: "Study Materials", href: "/mentor/viva/materials", icon: FileText },
      isSuperAdmin && { label: "AI Settings", href: "/admin/viva/ai-settings", icon: Settings },
      (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && { label: "Contests", href: "/admin/contests", icon: Trophy },
      (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && { label: "Problems", href: "/admin/problems", icon: Code },
      (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && { label: "Go Live", href: "/admin/live", icon: Radio },
      (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && { label: "Arcade Questions", href: "/admin/arcade", icon: Gamepad2 },
      { label: "Course Catalog", href: "/courses", icon: BookOpen }
    ].filter(Boolean);
  }

  const pageTitle = pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ") || "Dashboard";

  const isLiveStudioMode = (activeSession && pathname === "/admin/live") || pathname === "/live";

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {!isLiveStudioMode && (
        <aside
        className="hidden md:flex flex-col h-full border-r transition-all duration-300 relative z-30"
        style={{ width: isSidebarCollapsed ? "60px" : "195px", backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border-primary)" }}
      >
        <div className={`flex items-center h-14 border-b ${isSidebarCollapsed ? "justify-center px-0" : "justify-between px-4"}`} style={{ borderColor: "var(--border-primary)" }}>
          <Link href="/" className={`flex items-center gap-3 py-4 mb-2 ${isSidebarCollapsed ? "px-0" : "px-2"}`}>
            <div className={`flex items-center overflow-hidden transition-all ${isSidebarCollapsed ? "w-6" : "w-32"}`}>
              <img
                src={isDark ? "/logo-white-text.webp" : "/logo-black-text.webp"}
                alt="Eduvantix Logo"
                className="h-6 object-contain object-left shrink-0 max-w-none"
                style={{ display: "block" }}
              />
            </div>
          </Link>
        </div>

        <nav className={`flex-1 px-2 py-2 space-y-0.5 ${isSidebarCollapsed ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/student/dashboard" && link.href !== "/admin/dashboard" && link.href !== "/mentor/dashboard" && pathname.startsWith(link.href));

            return (
              <a
                key={link.href}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (activeSession && link.href !== "/admin/live") {
                    handleSafeNavigation(link.href);
                  } else {
                    router.push(link.href);
                  }
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative group"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--bg-hover)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-primary)" }} />}
                <LinkIcon size={15} className="flex-shrink-0" style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }} />
                {!isSidebarCollapsed && <span>{link.label}</span>}

                {isSidebarCollapsed && (
                  <div className="absolute left-14 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] text-[10px] py-1.5 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {link.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

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
      )}

      {isMobileMenuOpen && !isLiveStudioMode && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-72 h-full flex flex-col p-5 shadow-2xl"
            style={{ backgroundColor: "var(--bg-sidebar)", borderRight: "1px solid var(--border-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src={isDark ? "/logo-white-text.webp" : "/logo-black-text.webp"}
                  alt="Eduvantix Logo"
                  className="h-6 object-contain object-left"
                  style={{ display: "block" }}
                />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5">
              {sidebarLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <a key={link.href} href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); if (activeSession && link.href !== "/admin/live") handleSafeNavigation(link.href); else router.push(link.href); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)", backgroundColor: isActive ? "var(--bg-hover)" : "transparent", fontWeight: isActive ? 600 : 400 }}
                  >
                    <LinkIcon size={14} style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }} />
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {!isLiveStudioMode && (
          <header
            className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg md:hidden" style={{ color: "var(--text-secondary)" }}>
              <Menu size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{isStudentSession ? "Student" : isAdminSession ? "Admin" : "Mentor"}</span>
              <span>/</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {dashboardUser && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {dashboardUser.avatarUrl ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--border-primary)] shadow-sm shrink-0">
                      <img src={dashboardUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-[var(--text-on-accent)] shrink-0" style={{ background: "var(--accent-gradient)" }}>
                      {dashboardUser.initials}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{dashboardUser.name}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{dashboardUser.role}</div>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border-primary)] shadow-xl z-50 overflow-hidden"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>

                      <div className="p-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
                        <div className="flex items-center gap-3">
                          {dashboardUser.avatarUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--border-primary)] shadow-md shrink-0">
                              <img src={dashboardUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[var(--text-on-accent)] shrink-0" style={{ background: "var(--accent-gradient)" }}>
                              {dashboardUser.initials}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{dashboardUser.name}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{dashboardUser.role}</div>
                          </div>
                        </div>
                      </div>

                      {isStudentSession && (
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
                      )}

                      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--border-primary)" }}>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <Paintbrush size={13} />
                          <span>Appearance</span>
                        </div>
                        <div className="scale-[0.85] origin-right"><ThemeToggle /></div>
                      </div>

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
        )}

        <main className={`flex-1 overflow-y-auto ${isLiveStudioMode ? 'bg-[var(--bg-primary)]' : ''}`}>
          <div className={isLiveStudioMode ? "h-full p-2 md:p-4" : "max-w-7xl mx-auto p-6 md:p-8"}>
            {children}
          </div>
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl p-6 border border-[var(--border-primary)] shadow-2xl text-center space-y-5"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-[var(--border-primary)] border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black" style={{ color: "var(--text-primary)" }}>Sign out?</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>You'll need to sign back in to access your portal.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)] text-xs font-semibold transition-all cursor-pointer"
                style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                Cancel
              </button>
              <button type="button" onClick={() => { setShowLogoutConfirm(false); logout(); router.push("/login"); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">End Session First?</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                You are currently in a live session. Navigating away will end the session for everyone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowEndConfirmModal(false);
                  setPendingNavAction(null);
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-[var(--border-primary)] text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                Stay
              </button>
              <button
                onClick={handleConfirmEndSession}
                className="flex-1 py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
