"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, RefreshCw, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!password || password.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMsg(result.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      setErrorMsg("Unable to connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const accentGradient = "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-zinc-100/30 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-zinc-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md space-y-6"
        >
          <div
            className="glass-panel p-8 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
            style={{
              backgroundColor: "var(--glass-bg)",
              borderColor: "rgba(139, 92, 246, 0.2)"
            }}
          >
            {/* Logo Header */}
            <div className="text-center space-y-2">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-md mx-auto"
                style={{ background: accentGradient }}
              >
                <Lock size={22} className="text-white" />
              </div>
              <h1 className="text-xl font-black font-display tracking-tight" style={{ color: "var(--text-primary)" }}>
                Choose New Password
              </h1>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Enter your new secure password below to regain access.
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start space-x-2 p-3.5 rounded-2xl border text-xs font-bold bg-rose-500/10 border-rose-500/20 text-rose-500"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success State */}
            {success ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold leading-relaxed">
                  ✅ Your password has been reset successfully! You can now log in with your new password.
                </div>
                <button
                  type="button"
                  onClick={() => router.replace("/login")}
                  className="w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md transition-all cursor-pointer hover:scale-102"
                  style={{ background: accentGradient }}
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl py-3 pl-11 pr-11 text-xs outline-none border transition-all"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)"
                      }}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-3.5 cursor-pointer animate-none" style={{ color: "var(--text-muted)" }}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl py-3 pl-11 pr-11 text-xs outline-none border transition-all"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: confirmPassword && confirmPassword !== password ? "#f43f5e" : "var(--border-primary)",
                        color: "var(--text-primary)"
                      }}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute right-4 top-3.5 cursor-pointer animate-none" style={{ color: "var(--text-muted)" }}>
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[10px] text-rose-500 font-bold pl-1">Passwords do not match</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 rounded-2xl font-bold text-xs text-white shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-102 cursor-pointer disabled:opacity-50"
                  style={{ background: accentGradient }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
