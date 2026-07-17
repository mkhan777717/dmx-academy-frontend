"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import useThemeStore from "@/store/useThemeStore";

export default function InstituteCallout() {
  const { isDark } = useThemeStore();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle blur accent */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[80px] -right-20 top-1/2 -translate-y-1/2"
          style={{ background: "var(--accent-gradient)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.02] blur-[60px] -left-20 top-10"
          style={{ background: "linear-gradient(135deg, #10b981, #0ea5e9)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-3xl p-8 md:p-12 border relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          {/* Subtle light leak shine */}
          <div 
            className="absolute -inset-[500px] opacity-[0.02] pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 60%)"
            }}
          />

          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider uppercase bg-emerald-500/5" style={{ borderColor: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
              <Building2 size={12} />
              For Universities & Campuses
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
              Are you an educational institution?
            </h2>
            
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Equip your students with industry-grade coding sandboxes, interactive playgrounds, and 24/7 AI mentoring. Empower your faculty with cohort analytics to bridge the academic-industry gap and accelerate student career outcomes.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <motion.a
              href="/institutes"
              className="inline-flex items-center justify-center gap-3 rounded-full w-full md:w-auto px-8 py-4 text-sm font-bold text-[var(--text-on-accent)] transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <GraduationCap size={16} />
              <span className="flex items-center gap-1.5">
                Explore
                <img
                  src={isDark ? "/logo-black-text.webp" : "/logo-white-text.webp"}
                  alt="Eduvantix Logo"
                  className="h-3.5 w-auto object-contain inline-block"
                />
                for Campus
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
