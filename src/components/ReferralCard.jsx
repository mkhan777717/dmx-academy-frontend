"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Gift, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ReferralCard({ isCollapsed }) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.referralCode) {
      setCode(user.referralCode);
    }
  }, [user]);

  const copyToClipboard = (e) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isCollapsed) {
    return (
      <div
        className="mx-2 mb-2 flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer border relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #10b981, #047857)",
          borderColor: "rgba(16, 185, 129, 0.5)",
        }}
        title="Refer & Earn Premium"
        onClick={copyToClipboard}
      >
        <Gift size={16} className="relative z-10 text-white" />
      </div>
    );
  }

  return (
    <div
      className="mx-2 mb-4 relative group cursor-pointer"
      onClick={copyToClipboard}
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="w-full flex rounded-xl overflow-hidden relative"
        style={{
          boxShadow: "0 8px 28px -6px rgba(5, 150, 105, 0.55)",
          WebkitMask: `
            radial-gradient(circle at 34% 0px, transparent 6px, black 6.5px) top left / 100% 51% no-repeat,
            radial-gradient(circle at 34% 100%, transparent 6px, black 6.5px) bottom left / 100% 51% no-repeat
          `,
          mask: `
            radial-gradient(circle at 34% 0px, transparent 6px, black 6.5px) top left / 100% 51% no-repeat,
            radial-gradient(circle at 34% 100%, transparent 6px, black 6.5px) bottom left / 100% 51% no-repeat
          `,
        }}
      >
        {/* Left stub — bright, high-contrast, the attention-grabbing half */}
        <div
          className="w-[34%] shrink-0 flex flex-col items-center justify-center py-3 relative border-r-2 border-dashed"
          style={{
            borderColor: "rgba(255, 255, 255, 0.35)",
            background: "linear-gradient(160deg, #10b981, #047857)",
          }}
        >
          {/* breathing glow behind the icon to draw the eye */}
          <motion.div
            className="absolute w-9 h-9 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.35)", filter: "blur(8px)", top: 10 }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <Gift size={20} className="mb-1 relative z-10 text-white drop-shadow-sm" />
          <span className="text-[15px] font-black tracking-tighter leading-none mt-1.5 text-white drop-shadow-sm">
            7 DAYS
          </span>
          <span
            className="text-[7.5px] font-black tracking-widest mt-1 uppercase px-1.5 py-0.5 rounded-full"
            style={{ color: "#047857", backgroundColor: "#ffffff" }}
          >
            Premium
          </span>
        </div>

        {/* Right panel */}
        <div
          className="w-[66%] p-3 flex flex-col justify-between relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #065f46 0%, #059669 100%)" }}
        >
          {/* ambient glow */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40" style={{ background: "#34d399" }} />

          {/* passive shimmer sweep, loops on its own so it catches the eye without needing hover */}
          <motion.div
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{ background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.22), transparent)" }}
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            <h3 className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider mb-0.5 text-white">
              <Sparkles size={10} className="text-emerald-200" />
              Refer a Friend
            </h3>
            <p className="text-[8px] font-semibold leading-tight pr-4 text-emerald-100">
              Share your code. You both get premium.
            </p>
          </div>

          <div
            className="mt-3 flex items-center justify-center rounded border overflow-hidden relative z-10 group/code transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(0,0,0,0.2)", height: "30px" }}
          >
            <div className="px-2 py-1.5 flex-1 font-mono text-[11px] font-bold tracking-widest text-center text-white flex items-center justify-center h-full relative">
              {copied ? (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-1.5 text-white w-full h-full"
                >
                  <CheckCircle2 size={12} className="text-emerald-300" /> COPIED!
                </motion.span>
              ) : code ? (
                <>
                  <span className="group-hover/code:opacity-0 transition-opacity duration-200">
                    {code}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/code:opacity-100 transition-opacity duration-200 text-[9px] text-emerald-100">
                    CLICK TO COPY
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-1.5 opacity-80 text-[9px] tracking-widest uppercase">
                  <Loader2 size={10} className="animate-spin" />
                  Generating...
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}