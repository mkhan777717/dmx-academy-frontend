"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Play, Sparkles, BookOpen, Star, Activity, X, ArrowRight,
  Zap, Brain, Code2, Layers, CheckCircle, Users, Award
} from "lucide-react";

/* ─── Animated Counter ────────────────────────────── */
function AnimatedCounter({ to, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [to]);
  return <>{count.toLocaleString()}{suffix}</>;
}

/* ─── Particle / glowing orb background ──────────── */
function GlowOrb({ x, y, size, color, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: "blur(80px)", opacity: 0.35 }}
      animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Mini floating skill card ────────────────────── */
function FloatCard({ icon: Icon, title, subtitle, accent, delay, style }) {
  return (
    <motion.div
      className="absolute z-20 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl cursor-default select-none"
      style={{
        backgroundColor: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        ...style
      }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ scale: 1.06, y: -16 }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: accent + "20", border: `1px solid ${accent}35` }}>
        <Icon size={17} style={{ color: accent }} />
      </div>
      <div>
        <div className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{title}</div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</div>
      </div>
      {/* glowing dot */}
      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
    </motion.div>
  );
}

/* ─── Live code preview card ──────────────────────── */
function LiveCodeCard() {
  const lines = [
    { indent: 0, text: "import { motion } from 'framer-motion'", color: "#818cf8" },
    { indent: 0, text: "", color: "" },
    { indent: 0, text: "export function Hero() {", color: "var(--text-primary)" },
    { indent: 1, text: "return (", color: "var(--text-secondary)" },
    { indent: 2, text: "<motion.div", color: "#4ade80" },
    { indent: 3, text: "animate={{ y: [0,-12,0] }}", color: "#fb923c" },
    { indent: 3, text: "transition={{ repeat: Infinity }}", color: "#fb923c" },
    { indent: 2, text: "/>", color: "#4ade80" },
    { indent: 1, text: ")", color: "var(--text-secondary)" },
    { indent: 0, text: "}", color: "var(--text-primary)" },
  ];

  return (
    <motion.div
      className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "var(--bg-code)", border: "1px solid var(--border-primary)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      whileHover={{ y: -4 }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>hero.jsx — DMX Academy</span>
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "#4ade8020", color: "#4ade80" }}>● live</span>
      </div>
      {/* Code lines */}
      <div className="p-4 space-y-1 font-mono text-xs">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.07 }}
            className="flex"
            style={{ paddingLeft: `${line.indent * 14}px` }}
          >
            <span className="mr-4 select-none w-4 text-right shrink-0" style={{ color: "var(--text-muted)", fontSize: "10px" }}>{i + 1}</span>
            <span style={{ color: line.color || "transparent" }}>{line.text || "\u00A0"}</span>
          </motion.div>
        ))}
      </div>
      {/* Animated cursor */}
      <motion.div
        className="absolute right-8 bottom-8 h-4 w-0.5 rounded"
        style={{ backgroundColor: "#818cf8" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {/* Bottom status bar */}
      <div className="flex items-center gap-3 px-4 py-2 text-[10px]" style={{ borderTop: "1px solid var(--border-primary)", color: "var(--text-muted)" }}>
        <span style={{ color: "#4ade80" }}>✓ No errors</span>
        <span>·</span>
        <span>JSX</span>
        <span>·</span>
        <span>Next.js 16</span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 32, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 16 } },
  };

  const stats = [
    { value: 12000, suffix: "+", label: "Students Enrolled" },
    { value: 98, suffix: "%", label: "Completion Rate" },
    { value: 400, suffix: "+", label: "Live Projects" },
    { value: 4.9, suffix: "★", label: "Average Rating" },
  ];

  const features = [
    { icon: CheckCircle, text: "AI-powered code review" },
    { icon: CheckCircle, text: "Interactive browser sandboxes" },
    { icon: CheckCircle, text: "Verified on-chain certificates" },
  ];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden pt-24 pb-20 flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ── Animated Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <GlowOrb x="5%" y="15%" size={520} color="var(--accent-primary)" delay={0} duration={14} />
        <GlowOrb x="55%" y="60%" size={420} color="var(--accent-secondary)" delay={3} duration={11} />
        <GlowOrb x="75%" y="5%" size={320} color="#06b6d4" delay={6} duration={9} />

        {/* Animated grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(var(--border-primary) 1px, transparent 1px), linear-gradient(to right, var(--border-primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-7 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <motion.span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
                style={{
                  backgroundColor: "var(--bg-badge)",
                  border: "1px solid var(--border-accent)",
                  color: "var(--text-accent)",
                }}
                animate={{ boxShadow: ["0 0 0px var(--accent-glow)", "0 0 16px var(--accent-glow)", "0 0 0px var(--accent-glow)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={11} className="animate-pulse" />
                Next-Gen Creative Technical Academy
                <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-primary)" }} />
              </motion.span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold font-display leading-[1.05] tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Learn in{" "}
              <span
                className="relative inline-block"
                style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                Flow State
                {/* Underline glow */}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: "var(--accent-gradient)", opacity: 0.5 }}
                  animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
              <br />
              <span style={{ color: "var(--text-primary)" }}>Master the Code.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Immersive, curriculum-led learning tracks with interactive sandboxes,
              real-time AI feedback, and motion design labs. Build extraordinary things.
            </motion.p>

            {/* Feature checklist */}
            <motion.ul variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle size={14} style={{ color: "var(--accent-primary)" }} />
                  {f.text}
                </li>
              ))}
            </motion.ul>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="/courses/generative-ai"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px var(--accent-glow)" }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl transition-all"
                style={{ background: "var(--accent-gradient)" }}
              >
                <Sparkles size={15} />
                Start Free Gen AI Course
                <ArrowRight size={14} />
              </motion.a>

              <motion.button
                suppressHydrationWarning
                onClick={() => setIsVideoOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold shadow-sm transition-all"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <motion.div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md"
                  style={{ background: "var(--accent-gradient)" }}
                  animate={{ boxShadow: ["0 0 0px var(--accent-glow)", "0 0 12px var(--accent-glow)", "0 0 0px var(--accent-glow)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Play size={10} className="ml-0.5 fill-white" />
                </motion.div>
                Watch Platform Intro
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-4 gap-4 pt-6"
              style={{ borderTop: "1px solid var(--border-primary)" }}
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold font-display" style={{ color: "var(--text-primary)" }}>
                    <AnimatedCounter to={typeof s.value === "number" && !Number.isInteger(s.value) ? s.value * 10 : s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <div className="relative flex items-center justify-center min-h-[480px] lg:min-h-[560px]">
            {/* Floating orbit rings */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 380, height: 380, border: "1px dashed var(--border-accent)", opacity: 0.4 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: 280, height: 280, border: "1px dashed var(--border-primary)", opacity: 0.5 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Center hub */}
            <motion.div
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl text-white"
              style={{ background: "var(--accent-gradient)", boxShadow: "0 0 40px var(--accent-glow)" }}
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain size={36} />
            </motion.div>

            {/* Live Code Card */}
            <div className="absolute -left-4 lg:-left-10 bottom-8">
              <LiveCodeCard />
            </div>

            {/* Floating topic cards */}
            <FloatCard
              icon={Activity}
              title="Motion Design"
              subtitle="Framer Motion + WebGL"
              accent="#06b6d4"
              delay={0}
              style={{ top: "6%", right: "0%" }}
            />
            <FloatCard
              icon={Brain}
              title="AI & LLMs"
              subtitle="GPT-4 + LangChain"
              accent="#a855f7"
              delay={1.5}
              style={{ top: "38%", right: "-5%" }}
            />
            <FloatCard
              icon={Code2}
              title="Frontend Arch"
              subtitle="Next.js 16 + React 19"
              accent="#818cf8"
              delay={0.7}
              style={{ bottom: "10%", right: "10%" }}
            />

            {/* Stat pill floating top-left */}
            <motion.div
              className="absolute top-4 left-0 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <Users size={13} style={{ color: "var(--accent-primary)" }} />
              <span>12,000+ learners enrolled</span>
            </motion.div>

            {/* Award pill */}
            <motion.div
              className="absolute bottom-24 left-4 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Award size={13} style={{ color: "#f59e0b" }} />
              <span>Blockchain-verified certificates</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                suppressHydrationWarning
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors"
                style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>

              <div className="relative aspect-video w-full flex flex-col items-center justify-center p-8" style={{ backgroundColor: "var(--bg-code)" }}>
                <div className="absolute top-8 left-8 h-2 w-2 rounded-full bg-cyan-400 animate-pulse blur-[2px]" />
                <div className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-purple-500 animate-pulse blur-[3px]" />

                <div className="flex flex-col items-center space-y-5 text-center z-10">
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl text-white"
                    style={{ background: "var(--accent-gradient)", boxShadow: "0 0 40px var(--accent-glow)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    DMX Academy Platform Tour
                  </h3>
                  <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
                    Compile animations live in the browser, track your motion design skills,
                    and unlock cryptographic credentials on completion.
                  </p>
                  <motion.a
                    href="/courses/generative-ai"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    Start Learning Free →
                  </motion.a>
                </div>

                {/* Playback bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: "var(--border-primary)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--accent-gradient)" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
