"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, PlusCircle, Trophy, LogOut,
  Menu, X, ChevronLeft, ChevronRight, ShieldAlert, ArrowLeftRight, Code, Radio, AlertTriangle, List,
  Users, Layers, Brain, FileText, Settings, Calendar, BookOpen, Gamepad2
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLiveImmersive = pathname === "/admin/live";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { activeSession, setActiveSession, token, API_BASE, user, logout } = useAuth();
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState(null);

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
      // Call end session API
      try {
        await fetch(`${API_BASE}/api/livekit/session/${activeSession.id}/end`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to end session:", err);
      }

      setActiveSession(null);
    }

    // Run the pending navigation/logout action
    if (pendingNavAction && pendingNavAction.action) {
      const action = pendingNavAction.action;
      if (typeof action === "string") {
        router.push(action);
      } else if (typeof action === "function") {
        action();
      }
    }
    setPendingNavAction(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminSession = localStorage.getItem("synapse_admin_session") === "true";
      const isMentorSession = localStorage.getItem("synapse_mentor_session") === "true";
      const isLoginRoute = pathname === "/admin";

      const isAllowedMentorPath =
        isMentorSession &&
        (pathname.startsWith("/admin/live") ||
         pathname.startsWith("/admin/contests") ||
         pathname.startsWith("/admin/problems"));

      const hasSession = isAdminSession || isAllowedMentorPath;

      if (!hasSession) {
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/admin/dashboard")}`);
      } else if (isLoginRoute) {
        router.push(isMentorSession ? "/mentor/dashboard" : "/admin/dashboard");
      } else {
        const name = user?.username || "Eduvantix Admin";
        const email = user?.email || "admin@synapse.com";
        const roleName = user?.role === "INSTITUTE_ADMIN"
          ? "Institute Admin"
          : user?.role === "BATCH_MANAGER"
            ? "Batch Manager"
            : user?.role === "MENTOR"
              ? "Mentor"
              : "Super Admin";
        const avatar = name.slice(0, 2).toUpperCase();

        setAdminUser({
          name,
          email,
          role: roleName,
          avatar
        });
      }
      setCheckingAuth(false);
    }
  }, [pathname, router, user]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const isLoginRoute = pathname === "/admin";

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin mx-auto" style={{ borderColor: "var(--text-accent)" }} />
          <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // For the login page, render without sidebar/layout frame
  if (isLoginRoute) {
    return <>{children}</>;
  }

  const effectiveRole = user?.role || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("dmx_auth_user") || "{}")?.role : null);
  const isSuperAdmin = effectiveRole === "ADMIN";
  const isInstAdmin = effectiveRole === "INSTITUTE_ADMIN";
  const isBatchMgr = effectiveRole === "BATCH_MANAGER";
  const isMentor = effectiveRole === "MENTOR";

  const sidebarLinks = [
    {
      label: "Dashboard",
      href: isMentor ? "/mentor/dashboard" : "/admin/dashboard",
      icon: LayoutDashboard
    },
    isSuperAdmin && {
      label: "Institutes & Admins",
      href: "/admin/institutes",
      icon: ShieldAlert
    },
    isInstAdmin && {
      label: "Manage Batches",
      href: "/admin/batches",
      icon: Layers
    },
    isInstAdmin && {
      label: "Manage People",
      href: "/admin/people",
      icon: Users
    },
    isBatchMgr && {
      label: "My Batches",
      href: "/admin/batch-manager",
      icon: Layers
    },
    (isBatchMgr || isInstAdmin || isMentor) && {
      label: "AI Viva",
      href: "/mentor/viva/questions",
      icon: Brain
    },
    (isBatchMgr || isInstAdmin || isMentor) && {
      label: "Study Materials",
      href: "/mentor/viva/materials",
      icon: FileText
    },
    isSuperAdmin && {
      label: "AI Settings",
      href: "/admin/viva/ai-settings",
      icon: Settings
    },
    (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && {
      label: "All Contests",
      href: "/admin/contests",
      icon: Trophy
    },
    (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && {
      label: "Create Contest",
      href: "/admin/contests/new",
      icon: PlusCircle
    },
    (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && {
      label: "All Problems",
      href: "/admin/problems",
      icon: Code
    },
    (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && {
      label: "Go Live",
      href: "/admin/live",
      icon: Radio
    },
    (isSuperAdmin || isInstAdmin || isBatchMgr || isMentor) && {
      label: "Arcade Questions",
      href: "/admin/arcade",
      icon: Gamepad2
    },
    {
      label: "Public Lobby",
      href: "/contest",
      icon: List
    },
    {
      label: "Course Catalog",
      href: "/courses",
      icon: BookOpen
    }
  ].filter(Boolean);
  const pageTitle = pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ") || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* ── DESKTOP SIDEBAR ─────────────────────────── */}
      {!isLiveImmersive && (
        <aside
          className="hidden md:flex flex-col h-full border-r transition-all duration-300 relative z-30"
          style={{ width: isSidebarCollapsed ? "68px" : "240px", backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border-primary)" }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b" style={{ borderColor: "var(--border-primary)" }}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md flex items-center justify-center text-[var(--text-on-accent)] flex-shrink-0" style={{ background: "var(--accent-gradient)" }}>
                  <ShieldAlert size={14} />
                </div>
                <span className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Eduvantix Admin</span>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="h-6 w-6 rounded-md flex items-center justify-center text-[var(--text-on-accent)] mx-auto" style={{ background: "var(--accent-gradient)" }}>
                <ShieldAlert size={14} />
              </div>
            )}
          </div>

          {/* Section label */}
          {!isSidebarCollapsed && (
            <div className="px-4 pt-5 pb-2">
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--text-muted)" }}>Admin Navigation</span>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
            {sidebarLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSafeNavigation(link.href);
                  }}
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

          {/* Bottom: collapse toggle */}
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

      {/* ── MOBILE DRAWER ────────────────────────────── */}
      {!isLiveImmersive && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-72 h-full flex flex-col p-5 shadow-2xl"
            style={{ backgroundColor: "var(--bg-sidebar)", borderRight: "1px solid var(--border-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md flex items-center justify-center text-[var(--text-on-accent)]" style={{ background: "var(--accent-gradient)" }}>
                  <ShieldAlert size={14} />
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Eduvantix Admin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      handleSafeNavigation(link.href);
                    }}
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
        {!isLiveImmersive && (
          <header
            className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0 relative z-20"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg md:hidden" style={{ color: "var(--text-secondary)" }}>
                <Menu size={16} />
              </button>
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Admin</span>
                <span>/</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{pageTitle}</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Public site link */}
              <Link href="/" className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium transition-colors px-3 py-1.5 rounded-lg border"
                onClick={(e) => {
                  e.preventDefault();
                  handleSafeNavigation("/");
                }}
                style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <ArrowLeftRight size={11} />
                <span>Public Site</span>
              </Link>

              {/* Avatar + profile menu */}
              {adminUser && (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-[var(--text-on-accent)]" style={{ background: "var(--accent-gradient)" }}>
                      {adminUser.avatar}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{adminUser.name}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{adminUser.role}</div>
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border-primary)] shadow-xl z-50 overflow-hidden"
                        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>

                    {/* Profile header */}
                    <div className="p-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[var(--text-on-accent)]" style={{ background: "var(--accent-gradient)" }}>
                          {adminUser.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{adminUser.name}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{adminUser.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Theme in menu */}
                    <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--border-primary)" }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Appearance</span>
                      </div>
                      <div className="scale-[0.85] origin-right"><ThemeToggle /></div>
                    </div>

                    {/* Logout */}
                    <div className="p-2">
                      <button onClick={() => { setIsProfileMenuOpen(false); handleSafeNavigation(() => handleLogout(), true); }}
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

        {/* Page content */}
        <main className={`flex-1 relative ${isLiveImmersive ? "overflow-hidden flex flex-col" : "overflow-y-auto p-6 md:p-8"}`}>
          <div className={isLiveImmersive ? "flex-1 flex flex-col min-h-0 p-4 md:p-6" : "max-w-6xl mx-auto"}>
            {children}
          </div>
        </main>
      </div>

      {/* Styled Confirmation Modal for Ending Session */}
      {showEndConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-3xl p-6 border border-[var(--border-primary)] shadow-2xl text-center space-y-6"
            style={{ 
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              backgroundImage: "linear-gradient(to bottom right, var(--bg-card), rgba(239, 68, 68, 0.05))"
            }}
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-[var(--border-primary)] border-red-500/20 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            
             <div className="space-y-2">
              <h3 className="text-lg font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                End Active Live Session?
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Navigating away or logging out will immediately end your active live session for all students. Are you sure you want to end the session?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setShowEndConfirmModal(false);
                  setPendingNavAction(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-[var(--border-primary)] transition-all cursor-pointer font-bold text-xs"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndSession}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-500/20"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
              <button type="button" onClick={() => { setShowLogoutConfirm(false); logout(); router.push("/login?redirect=/admin/dashboard"); }}
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
