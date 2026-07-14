"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldAlert, ArrowRight, RefreshCw, AlertCircle, GraduationCap, Sparkles, Eye, EyeOff, Ban } from "lucide-react";

function LoginForm() {
  const { login, register, user, logout, forgotPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("STUDENT");
  const [hasExplicitRole, setHasExplicitRole] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    let targetRole = null;
    if (roleParam) {
      const parsed = roleParam.toUpperCase();
      if (["STUDENT", "MENTOR", "ADMIN"].includes(parsed)) targetRole = parsed;
    } else {
      const path = redirectTo.toLowerCase();
      if (path.includes("admin")) targetRole = "ADMIN";
      else if (path.includes("mentor")) targetRole = "MENTOR";
      else if (path.includes("student")) targetRole = "STUDENT";
    }
    if (targetRole) { setActiveTab(targetRole); setHasExplicitRole(true); }
    else setHasExplicitRole(false);
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams, redirectTo]);

  const isMismatched = (() => {
    if (!user || !redirectTo) return false;
    const path = redirectTo.toLowerCase();
    const isUserAdmin = user.role === 'ADMIN' || user.role === 'INSTITUTE_ADMIN' || user.role === 'BATCH_MANAGER';
    const isUserMentor = user.role === 'MENTOR';
    const isUserStudent = user.role === 'USER';
    if (path.startsWith('/admin') && !isUserAdmin) return true;
    if (path.startsWith('/mentor')) {
      const isVivaAccess = path.startsWith('/mentor/viva/questions') || path.startsWith('/mentor/viva/materials');
      if (isVivaAccess) { if (!isUserAdmin && !isUserMentor) return true; } else { if (!isUserMentor) return true; }
    }
    if (path.startsWith('/student') && !isUserStudent) return true;
    return false;
  })();

  useEffect(() => {
    if (user && !isMismatched) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("synapse_admin_session");
        localStorage.removeItem("synapse_student_session");
        localStorage.removeItem("synapse_mentor_session");
        const role = user.role;
        if (role === "ADMIN" || role === "INSTITUTE_ADMIN" || role === "BATCH_MANAGER") localStorage.setItem("synapse_admin_session", "true");
        else if (role === "MENTOR") localStorage.setItem("synapse_mentor_session", "true");
        else localStorage.setItem("synapse_student_session", "true");
      }
      let targetRoute = redirectTo;
      if (redirectTo === "/") {
        const isUserAdmin = user.role === 'ADMIN' || user.role === 'INSTITUTE_ADMIN' || user.role === 'BATCH_MANAGER';
        const isUserMentor = user.role === 'MENTOR';
        if (isUserAdmin) targetRoute = '/admin/dashboard';
        else if (isUserMentor) targetRoute = '/mentor/dashboard';
        else targetRoute = '/student/dashboard';
      }
      router.replace(targetRoute);
    }
  }, [user, redirectTo, router, isMismatched]);

  const getRoleTheme = () => {
    switch (activeTab) {
      case "ADMIN": return {
        accentColor: "#06b6d4", accentGradient: "linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)",
        bgBadge: "rgba(6, 182, 212, 0.08)", borderAccent: "rgba(6, 182, 212, 0.2)",
        icon: <ShieldAlert size={20} className="text-cyan-400" />,
        title: isRegistering ? "Register Admin Account" : "Admin Control Sign In",
        desc: isRegistering ? "Create your administrative console account" : "Access the DMX systems scheduler and configuration room",
        demoEmail: "admin@demo.com", label: "Administrator"
      };
      case "MENTOR": return {
        accentColor: "#8b5cf6", accentGradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
        bgBadge: "rgba(139, 92, 246, 0.08)", borderAccent: "rgba(139, 92, 246, 0.2)",
        icon: <GraduationCap size={20} className="text-violet-400" />,
        title: isRegistering ? "Register Instructor Account" : "Mentor Workspace Sign In",
        desc: isRegistering ? "Join the DMX instructional staff track" : "Access code review desk, office hours, and curriculum editor",
        demoEmail: "mentor@demo.com", label: "Mentor"
      };
      default: return {
        accentColor: "#6366f1", accentGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        bgBadge: "rgba(99, 102, 241, 0.08)", borderAccent: "rgba(99, 102, 241, 0.2)",
        icon: <Sparkles size={20} className="text-zinc-400" />,
        title: isRegistering ? "Create Scholar Account" : "Welcome Back, Coder",
        desc: isRegistering ? "Join the DMX developer learning network" : "Access your study desk, practice arena, and live sessions",
        demoEmail: "student@demo.com", label: "Student"
      };
    }
  };

  const theme = getRoleTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    if (isForgot) {
      if (!email) { setErrorMsg("Please enter your email address."); setLoading(false); return; }
      try {
        const result = await forgotPassword(email);
        if (result.success) setForgotSuccess(true);
        else setErrorMsg(result.message || "Failed to send reset link.");
      } catch { setErrorMsg("Unable to connect to the authentication server."); }
      finally { setLoading(false); }
      return;
    }
    if (!email || !password) { setErrorMsg("Please fill in all required fields."); setLoading(false); return; }
    if (isRegistering && !username) { setErrorMsg("Username is required."); setLoading(false); return; }
    if (isRegistering && password !== confirmPassword) { setErrorMsg("Passwords do not match."); setLoading(false); return; }
    const submitRole = activeTab === "ADMIN" ? "ADMIN" : activeTab === "MENTOR" ? "MENTOR" : "USER";
    try {
      let result;
      if (isRegistering) result = await register(username, email, password, submitRole);
      else result = await login(email, password);
      if (result.success) {
        let targetRoute = redirectTo;
        if (redirectTo === "/") {
          const emailLower = (result.user?.email || "").toLowerCase();
          const isUserAdmin = result.user?.role === 'ADMIN' || result.user?.role === 'INSTITUTE_ADMIN' || result.user?.role === 'BATCH_MANAGER' || emailLower.includes('admin');
          const isUserMentor = result.user?.role === 'MENTOR' || emailLower.includes('mentor');
          if (isUserAdmin) targetRoute = '/admin/dashboard';
          else if (isUserMentor) targetRoute = '/mentor/dashboard';
          else targetRoute = '/student/dashboard';
        }
        if (result.offlineMode) { setErrorMsg("⚠️ Backend offline. Your account is saved locally only."); setTimeout(() => router.replace(targetRoute), 2000); }
        else router.replace(targetRoute);
      } else if (result.blocked) {
        setIsBlocked(true);
      } else {
        setErrorMsg(result.message || "An error occurred. Please check your credentials.");
      }
    } catch { setErrorMsg("Unable to connect to the authentication server."); }
    finally { setLoading(false); }
  };

  /* ─── Role mismatch screen ─────────── */
  if (user && isMismatched) {
    const isUserAdmin = user.role === 'ADMIN' || user.role === 'INSTITUTE_ADMIN' || user.role === 'BATCH_MANAGER';
    const isUserMentor = user.role === 'MENTOR';
    const userRoleLabel = isUserMentor ? 'Mentor' : isUserAdmin ? 'Administrator' : 'Student';
    const targetPortalLabel = redirectTo.toLowerCase().startsWith('/admin') ? 'Admin Control' : redirectTo.toLowerCase().startsWith('/mentor') ? 'Mentor Board' : 'Student Desk';
    const getDashboardPath = () => { if (isUserAdmin) return '/admin/dashboard'; if (isUserMentor) return '/mentor/dashboard'; return '/student/dashboard'; };

    return (
      <div className="p-8 rounded-2xl border shadow-lg space-y-6 text-center w-full max-w-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md mx-auto" style={{ background: "var(--accent-gradient)" }}>
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>Role Mismatch</h2>
        <div className="space-y-3 text-xs" style={{ color: "var(--text-secondary)" }}>
          <p>You are signed in as <strong style={{ color: "var(--text-primary)" }}>{user.username}</strong> ({user.email}) with role <strong style={{ color: "var(--text-primary)" }}>{userRoleLabel}</strong>.</p>
          <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-left leading-relaxed">⚠️ This account cannot access the <strong>{targetPortalLabel}</strong>. Sign out and use an appropriate account.</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => router.push(getDashboardPath())} className="w-full py-3 rounded-xl font-bold text-xs text-white transition-all cursor-pointer" style={{ background: "var(--accent-gradient)" }}>Go to my {userRoleLabel} Desk</button>
          <button onClick={() => logout()} className="w-full py-3 rounded-xl font-bold text-xs transition-all border cursor-pointer" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>Sign Out & Switch Accounts</button>
        </div>
      </div>
    );
  }

  /* ─── Institute blocked screen ────── */
  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mx-auto"><Ban size={36} className="text-rose-500" /></div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Institute Blocked</h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>Your institute account has been suspended by the Super Administrator.</p>
          <p className="text-xs font-bold text-rose-500">Please contact your Super Administrator to restore access.</p>
        </div>
        <button onClick={() => { setIsBlocked(false); router.push("/"); }} className="px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>← Back to Homepage</button>
      </div>
    );
  }

  /* ─── Main Form ─────────────────── */
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full space-y-5">

      {/* Role tabs */}
      {!hasExplicitRole && (
        <div className="flex p-1 rounded-xl border" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)" }}>
          {["STUDENT", "MENTOR", "ADMIN"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setErrorMsg(""); }}
              className="flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              style={{ backgroundColor: activeTab === tab ? "var(--bg-card)" : "transparent", color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Card */}
      <div className="p-8 rounded-2xl border space-y-6" style={{ backgroundColor: "var(--bg-card)", borderColor: theme.borderAccent }}>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: theme.accentGradient }}>
              {isForgot ? <RefreshCw size={18} className="text-white" /> : React.cloneElement(theme.icon, { size: 18, className: "text-white" })}
            </div>
            <div>
              <h1 className="text-base font-black" style={{ color: "var(--text-primary)" }}>{isForgot ? "Reset Password" : theme.title}</h1>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{isForgot ? "Enter your email to receive a reset link" : theme.desc}</p>
            </div>
          </div>
          <div className="h-px" style={{ background: "var(--border-primary)" }} />
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className={`flex items-start gap-2 p-3 rounded-xl border text-xs font-medium ${errorMsg.startsWith("⚠️") ? "bg-amber-500/10 border-amber-500/20 text-amber-600" : "bg-rose-500/10 border-rose-500/20 text-rose-600"}`}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot success */}
        {isForgot && forgotSuccess ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium">✅ Reset link sent! Check your inbox.</div>
            <button type="button" onClick={() => { setIsForgot(false); setForgotSuccess(false); setErrorMsg(""); }} className="w-full py-3 rounded-xl font-bold text-xs text-white" style={{ background: theme.accentGradient }}>Back to Sign In</button>
          </div>

        /* Forgot form */
        ) : isForgot ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Email Address" type="email" value={email} onChange={setEmail} icon={<Mail size={14} />} placeholder="name@example.com" required />
            <SubmitButton loading={loading} gradient={theme.accentGradient} label="Send Reset Link" />
            <div className="text-center"><button type="button" onClick={() => { setIsForgot(false); setErrorMsg(""); }} className="text-xs font-bold" style={{ color: "var(--accent-primary)" }}>Back to Sign In</button></div>
          </form>

        /* Main form */
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <InputField label="Username" type="text" value={username} onChange={setUsername} icon={<User size={14} />} placeholder="your_handle" />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField label="Email Address" type="email" value={email} onChange={setEmail} icon={<Mail size={14} />} placeholder="name@company.com" required />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Password</label>
                {!isRegistering && (
                  <button type="button" onClick={() => { setIsForgot(true); setErrorMsg(""); }} className="text-[10px] font-bold" style={{ color: "var(--accent-primary)" }}>Forgot?</button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}><Lock size={14} /></span>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl py-2.5 pl-9 pr-10 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                  onFocus={e => e.target.style.borderColor = "var(--accent-primary)"} onBlur={e => e.target.style.borderColor = "var(--border-primary)"} required />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div key="confirm" className="space-y-1.5" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}><Lock size={14} /></span>
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl py-2.5 pl-9 pr-10 text-sm outline-none border transition-all"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: confirmPassword && confirmPassword !== password ? "#f43f5e" : "var(--border-primary)", color: "var(--text-primary)" }}
                      required />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && <p className="text-[10px] text-rose-500 font-medium">Passwords do not match</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <SubmitButton loading={loading} gradient={theme.accentGradient} label={isRegistering ? `Register as ${theme.label}` : `Sign In as ${theme.label}`} />
          </form>
        )}

        {/* Toggle register/login */}
        {!isForgot && (
          <div className="pt-2 text-center border-t" style={{ borderColor: "var(--border-primary)" }}>
            <button type="button" onClick={() => { setErrorMsg(""); setIsRegistering(!isRegistering); }} className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              {isRegistering ? "Already have an account? " : "New to DMX? "}
              <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{isRegistering ? "Sign In" : "Create Account"}</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Reusable input ────────────────── */
function InputField({ label, type, value, onChange, icon, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} required={required}
          className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none border transition-all"
          style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          onFocus={e => e.target.style.borderColor = "var(--accent-primary)"} onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
        />
      </div>
    </div>
  );
}

/* ─── Submit button ─────────────────── */
function SubmitButton({ loading, gradient, label }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      style={{ background: gradient }}
      onMouseEnter={e => !loading && (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {loading ? <><RefreshCw size={14} className="animate-spin" /><span>Processing…</span></> : <><span>{label}</span><ArrowRight size={14} /></>}
    </button>
  );
}

/* ─── Page Wrapper ──────────────────── */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* LEFT — editorial branding */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] min-h-screen p-16 relative"
        style={{ backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-primary)" }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: "var(--accent-gradient)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>DMX Academy</span>
        </div>

        {/* Center editorial */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: "var(--accent-primary)" }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Learner Portal</span>
            </div>
            <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-black leading-[0.92] tracking-[-0.04em]" style={{ color: "var(--text-primary)" }}>
              Build.<br />
              <em className="font-serif-display" style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>Ship.</em><br />
              Repeat.
            </h2>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[{ n: "12k+", l: "Learners" }, { n: "4.9★", l: "Avg Rating" }, { n: "300+", l: "Projects Built" }, { n: "4", l: "Deep Tracks" }].map(m => (
              <div key={m.l} className="p-4 rounded-xl" style={{ border: "1px solid var(--border-card)", backgroundColor: "var(--bg-card)" }}>
                <div className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{m.n}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{m.l}</div>
              </div>
            ))}
          </div>

          {/* Activity chart */}
          <div className="rounded-xl p-5 overflow-hidden" style={{ border: "1px solid var(--border-card)", backgroundColor: "var(--bg-card)" }}>
            <svg viewBox="0 0 380 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              {[40,65,30,80,55,90,45,70,85,60,75,95].map((h, i) => (
                <rect key={i} x={i * 31 + 4} y={90 - h * 0.85} width="20" height={h * 0.85} rx="3" fill="var(--accent-primary)" fillOpacity={0.12 + (i / 12) * 0.5} />
              ))}
              <polyline points="14,55 45,32 76,65 107,16 138,42 169,8 200,52 231,28 262,12 293,36 324,22 355,2"
                fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="4" y="98" fontSize="7.5" fill="var(--text-muted)">Student Activity — Last 12 Months</text>
            </svg>
          </div>
        </div>

        {/* Bottom testimonial */}
        <blockquote className="space-y-2">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            &ldquo;From zero shaders to shipping a custom WebGL renderer in 6 weeks.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-zinc-500 flex items-center justify-center text-[9px] font-bold text-white">MV</div>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Marcus V. — Senior Dev at Vercel</span>
          </div>
        </blockquote>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-16 lg:px-16 relative z-10">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "var(--accent-gradient)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>DMX Academy</span>
        </div>

        <div className="w-full max-w-md">
          <Suspense fallback={<div className="flex items-center justify-center p-8"><RefreshCw className="animate-spin" size={22} style={{ color: "var(--accent-primary)" }} /></div>}>
            <LoginForm />
          </Suspense>
        </div>

        <a href="/" className="mt-8 text-xs flex items-center gap-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to DMX Academy
        </a>
      </div>
    </div>
  );
}
