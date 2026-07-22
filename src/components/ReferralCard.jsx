"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Gift } from "lucide-react";
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
        className="mx-2 mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors hover:bg-indigo-500/20 cursor-pointer"
        title="Refer & Earn Premium"
        onClick={copyToClipboard}
      >
        <Gift size={16} />
      </div>
    );
  }

  return (
    <div 
      className="mx-2 mb-4 relative drop-shadow-md animate-in fade-in group cursor-pointer transition-transform hover:-translate-y-0.5" 
      onClick={copyToClipboard}
    >
      <div 
        className="w-full flex bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl overflow-hidden"
        style={{
          // Creates genuine transparent semicircles at the top and bottom of the 30% mark.
          WebkitMask: `
            radial-gradient(circle at 30% 0px, transparent 6px, black 6.5px) top left / 100% 51% no-repeat,
            radial-gradient(circle at 30% 100%, transparent 6px, black 6.5px) bottom left / 100% 51% no-repeat
          `,
          mask: `
            radial-gradient(circle at 30% 0px, transparent 6px, black 6.5px) top left / 100% 51% no-repeat,
            radial-gradient(circle at 30% 100%, transparent 6px, black 6.5px) bottom left / 100% 51% no-repeat
          `
        }}
      >
        {/* Left Side (30% width) */}
        <div className="w-[30%] shrink-0 bg-[#f0ead8] flex flex-col items-center justify-center py-3 relative border-r-2 border-dashed border-indigo-800">
          <Gift size={24} className="mb-1 text-indigo-900" />
          <span className="text-[12px] font-black tracking-tighter text-indigo-900 leading-none mt-1">
            7 DAYS
          </span>
          <span className="text-[7px] font-bold tracking-widest text-indigo-900/60 mt-0.5 uppercase">
            Premium
          </span>
        </div>

        {/* Right Side (70% width) */}
        <div className="w-[70%] p-3 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-white mb-0.5 drop-shadow-sm">
              Refer a Friend
            </h3>
            <p className="text-[8px] font-semibold text-indigo-200/80 leading-tight pr-4 drop-shadow-sm">
              Share code. Both get premium.
            </p>
          </div>
          
          <div className="mt-3 flex items-center justify-between bg-white/10 rounded border border-white/20 overflow-hidden relative z-10 backdrop-blur-sm">
            <div className="px-2 py-1.5 flex-1 font-mono text-[11px] font-bold tracking-widest text-white text-center">
              {code || "WAIT..."}
            </div>
            <div className="bg-white/20 h-full w-8 flex items-center justify-center hover:bg-white/30 transition-colors border-l border-white/20 relative">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ scale: 0, opacity: 0, rotate: 180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: -180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Save size={12} className="text-indigo-100" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
