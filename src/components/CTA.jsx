"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Flowing Line SVG ─────────────────── */
function FlowLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0"/>
          <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0"/>
          <stop offset="40%" stopColor="var(--accent-secondary)" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0 180 Q300 120 600 200 Q900 280 1200 160" stroke="url(#lineGrad1)" strokeWidth="1"/>
      <path d="M0 220 Q250 280 600 200 Q950 120 1200 240" stroke="url(#lineGrad2)" strokeWidth="0.7"/>
      <path d="M0 200 Q400 150 700 220 Q900 240 1200 200" stroke="url(#lineGrad1)" strokeWidth="0.4" strokeDasharray="4 8"/>
      {/* Dot grid overlay */}
      <rect width="1200" height="400" fill="url(#dotGridCTA)" fillOpacity="1"/>
      <defs>
        <pattern id="dotGridCTA" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="var(--accent-primary)" fillOpacity="0.12"/>
        </pattern>
      </defs>
    </svg>
  );
}

/* ─── CTA Section ─────────────────────── */
export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const headline = ["Ready to", "accelerate?"];

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="editorial-line" />

      {/* Background flow lines */}
      <div className="absolute inset-0">
        <FlowLines />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center">

          {/* Left — Kinetic headline */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8" style={{ background: "var(--accent-primary)" }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                Get Started
              </span>
            </motion.div>

            <h2
              className="text-[clamp(3rem,7vw,6.5rem)] font-black tracking-[-0.04em] leading-[0.9]"
              style={{ color: "var(--text-primary)" }}
            >
              {headline.map((line, li) => (
                <div key={li} className="overflow-hidden block">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={inView ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, delay: li * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {li === 0 ? line : (
                      <em
                        className="font-serif-display"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontStyle: "italic",
                        }}
                      >
                        {line}
                      </em>
                    )}
                  </motion.div>
                </div>
              ))}
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-base max-w-md leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Join 12,000+ learners building interactive web apps, AI models, and blockchain products. Your first course is completely free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/courses/generative-ai"
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300"
                style={{ background: "var(--accent-gradient)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px var(--accent-glow)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                Start Free Course
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-200"
                style={{ border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                View Pricing
              </a>
            </motion.div>
          </div>

          {/* Right — Email signup card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl p-8 space-y-6"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-card)",
            }}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Get your free syllabus
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                We&apos;ll send you a full curriculum breakdown for any track you choose.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.currentTarget.querySelector('input[type="email"]')?.value;
                if (email) window.location.href = `/login?redirect=/student&email=${encodeURIComponent(email)}`;
              }}
              className="space-y-3"
            >
              <input
                suppressHydrationWarning
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
              />
              <button
                suppressHydrationWarning
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-200"
                style={{ background: "var(--accent-gradient)" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Send Me the Syllabus
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {[
                "No credit card required",
                "7-day free trial on Pro plans",
                "Cancel anytime, no lock-in",
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
