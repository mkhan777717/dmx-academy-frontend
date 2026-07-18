"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Interactive Illustrations ─────────────────── */
const PathIllustration = () => {
  const [active, setActive] = useState(null);

  return (
    <div className="w-full h-full flex items-center justify-center relative p-4 md:p-8 font-mono text-xs overflow-hidden bg-white dark:bg-[var(--bg-card)]">
      {/* bg color for light mode, transparent in dark */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.17)_0,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.10)_0,transparent_100%)] pointer-events-none" />

      <div className="flex items-center justify-between w-full h-full relative z-10 max-w-[240px]">

        {/* SVG Paths connecting nodes */}
        <svg
          viewBox="0 0 240 200"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: -1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M 40 100 C 100 100, 100 ${45 + i * 55}, 140 ${45 + i * 55}`}
              fill="none"
              stroke={active === i ? "#6366f1" : "rgba(99,102,241,0.35)"}
              strokeWidth={active === i ? 2 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              style={{
                filter:
                  active === i
                    ? "drop-shadow(0 0 8px rgba(99,102,241,0.7))"
                    : "none",
              }}
            />
          ))}
        </svg>

        {/* Start Node */}
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 flex items-center justify-center bg-indigo-500/20 dark:bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)] z-10 bg-[var(--bg-card)]">
          <span className="text-indigo-500 font-bold text-[10px]">Start</span>
        </div>

        {/* End Nodes */}
        <div className="flex flex-col gap-4 h-full justify-center w-24">
          {["AI Track", "Frontend", "DevOps"].map((label, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`px-2 py-2 text-center rounded border cursor-pointer transition-all duration-300 relative z-10 ${
                active === i
                  ? "bg-indigo-500/40 border-indigo-600 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.35)] text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-400 dark:text-indigo-300"
                  : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-500/10 dark:bg-[var(--bg-card)] dark:border-indigo-500/30 dark:text-indigo-500/70"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SandboxIllustration = () => {
  const [code, setCode] = useState("");
  const fullCode =
    "function App() {\n  return (\n    <div className='glow'>\n      <Cube />\n    </div>\n  );\n}";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCode(fullCode.slice(0, i));
      i++;
      if (i > fullCode.length) {
        setTimeout(() => {
          i = 0;
        }, 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 font-mono text-[10px] 
      bg-slate-50 dark:bg-[var(--bg-secondary)]
      overflow-hidden">
      {/* Fake Window Header */}
      <div className="h-6 w-full border-b border-cyan-300/20 dark:border-cyan-500/20 flex items-center gap-1.5 px-2 mb-4 bg-slate-100/90 dark:bg-black/20 rounded-t-lg">
        <div className="w-2 h-2 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
        <div className="w-2 h-2 rounded-full bg-green-500/80" />
        <div className="ml-2 text-cyan-700/60 dark:text-cyan-700/50 text-[9px]">
          App.jsx - Sandbox
        </div>
      </div>

      <div className="flex-1 flex gap-4 h-full">
        {/* Editor */}
        <div className="flex-1 text-cyan-700 dark:text-cyan-400/80 whitespace-pre overflow-hidden bg-white dark:bg-transparent px-2 py-1 rounded-tl rounded-bl">
          {code}
          <span className="animate-pulse w-1.5 h-3 bg-cyan-500 dark:bg-cyan-400 inline-block ml-0.5 align-middle" />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-full bg-cyan-300/20 dark:bg-cyan-500/20" />

        {/* Preview Container */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-cyan-50/90 dark:bg-black/10 rounded-br-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.09)_0,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_100%)]" />
          <div
            className="w-12 h-12 border border-cyan-400 bg-cyan-300/40 dark:bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            style={{ transformStyle: "preserve-3d", animation: "spin 4s linear infinite" }}
          />
          <div className="absolute bottom-2 text-cyan-500/70 dark:text-cyan-500/50 text-[8px] tracking-widest font-sans">
            LIVE PREVIEW
          </div>
        </div>
      </div>
    </div>
  );
};

const AIIllustration = () => {
  return (
    <div className="w-full h-full p-4 md:p-6 flex flex-col justify-center items-center font-mono text-[10px] relative overflow-hidden group bg-emerald-50 dark:bg-[var(--bg-secondary)]">
      <div className="absolute inset-0 bg-emerald-100/60 dark:bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Code Background */}
      <div className="w-full max-w-[220px] bg-emerald-100/90 dark:bg-black/40 border border-emerald-400/30 dark:border-emerald-500/30 rounded-lg p-3 text-emerald-700 dark:text-emerald-400 space-y-1.5 relative z-0 font-medium shadow-[0_0_15px_rgba(16,185,129,0.10)]">
        <div>const data = await fetch('/api');</div>
        <div className="text-red-600 line-through bg-red-200/40 dark:text-red-400 dark:bg-red-500/10 px-1 -mx-1">
          let result = data.json();
        </div>
        <div
            className="text-emerald-800 font-bold bg-emerald-200/60 border-l-2 border-emerald-400 pl-2 -mx-1 py-0.5 shadow-[0_0_10px_rgba(16,185,129,0.08)] dark:text-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-400 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            style={{ animation: "animSlideInDelay 3.5s infinite" }}
        >
          const result = await data.json();
        </div>
        <div>return result;</div>
      </div>

      {/* AI Floating Widget */}
      <div
        className="absolute right-4 md:right-8 top-8 md:top-12 w-40 bg-emerald-100/95 dark:bg-[var(--bg-card)] border border-emerald-400 dark:border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.13)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.3)] rounded-lg p-2.5 z-10"
        style={{ animation: "animFloatMd 3s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2 mb-1.5 border-b border-emerald-200/40 dark:border-emerald-500/20 pb-1.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.8)]">
            <span className="text-[8px] text-white font-bold">AI</span>
          </div>
          <span className="text-emerald-700 font-bold text-[9px] font-sans dark:text-emerald-400">
            Co-Pilot Suggestion
          </span>
        </div>
        <div className="text-emerald-700/80 dark:text-emerald-500/80 leading-tight font-sans text-[10px]">
          Forgot to await{" "}
          <code className="bg-emerald-200/60 px-0.5 rounded font-mono text-[9px] dark:bg-emerald-500/20">
            .json()
          </code>
          . Fixed it for you!
        </div>
      </div>
    </div>
  );
};

const CertIllustration = () => {
  const cardRef = useRef(null);
  const [[rotX, rotY], setRot] = useState([0, 0]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    setRot([rotateX, rotateY]);
  };

  const handleMouseLeave = () => {
    setRot([0, 0]);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 [perspective:1000px] overflow-hidden bg-fuchsia-50 dark:bg-[var(--bg-secondary)] relative group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.075)_0,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(162,28,175,0.1)_0,transparent_100%)] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-[220px] aspect-[1.6] rounded-xl border border-fuchsia-400/40 dark:border-fuchsia-500/30 bg-gradient-to-br from-white via-fuchsia-50/70 to-fuchsia-100/70 dark:bg-[var(--bg-card)] shadow-[0_0_30px_rgba(232,121,249,0.12)] dark:shadow-[0_0_30px_rgba(162,28,175,0.3)] flex flex-col p-4 relative overflow-hidden cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-fuchsia-300/30 dark:bg-fuchsia-500/20 blur-2xl rounded-full pointer-events-none" />

        <div
          className="flex justify-between items-start mb-auto z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="w-8 h-8 rounded-md bg-fuchsia-100/80 dark:bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-300 dark:border-fuchsia-500/30 shadow-[0_0_10px_rgba(232,121,249,0.13)] dark:shadow-[0_0_10px_rgba(162,28,175,0.2)]">
            <span className="text-fuchsia-900 dark:text-[var(--text-primary)] text-[14px]">✦</span>
          </div>
          <div className="text-[8px] font-bold font-sans text-fuchsia-900 dark:text-[var(--text-primary)] uppercase tracking-widest border border-fuchsia-300 dark:border-fuchsia-500/30 bg-fuchsia-100/60 dark:bg-fuchsia-500/10 px-2 py-1 rounded-full shadow-[0_0_10px_rgba(232,121,249,0.12)] dark:shadow-[0_0_10px_rgba(162,28,175,0.2)]">
            Verified
          </div>
        </div>

        <div className="mt-4 z-10" style={{ transform: "translateZ(10px)" }}>
          <div className="text-[10px] font-sans font-bold text-fuchsia-900 dark:text-[var(--text-primary)] mb-1">
            On-Chain Certificate
          </div>
          <div className="w-full h-1 bg-fuchsia-400/80 dark:bg-fuchsia-500/60 rounded-full mb-1.5 opacity-80" />
          <div className="w-2/3 h-1 bg-fuchsia-400/80 dark:bg-fuchsia-500/60 rounded-full opacity-80" />
        </div>

        <div
          className="mt-3 text-[7px] font-mono text-fuchsia-700 dark:text-[var(--text-secondary)] z-10 font-bold"
          style={{ transform: "translateZ(5px)" }}
        >
          TX: 0x4f3a9910...a8c2f1
        </div>
      </motion.div>
    </div>
  );
};

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    desc: "Take a diagnostic assessment. A counselor maps your background, goals, and pace to the right learning track — Frontend, AI, Cloud, or Creative Tech.",
    details: [
      "Tailored diagnostic test",
      "Dedicated path counselors",
      "Lifetime syllabus updates",
    ],
    accent: "#6366f1",
    illustration: <PathIllustration />,
  },
  {
    number: "02",
    title: "Build in Browser Sandboxes",
    desc: "Write code and see it render live — split-screen editor + preview. No environment setup. Autosaved checkpoints keep your progress permanent.",
    details: [
      "Split-screen live rendering",
      "Autosaved checkpoints",
      "Hot module reloading",
    ],
    accent: "#0891b2",
    illustration: <SandboxIllustration />,
  },
  {
    number: "03",
    title: "AI Co-Pilot Review",
    desc: "Custom LLM agents review your code in real time — catching errors, suggesting refactors, and explaining performance tradeoffs in plain language.",
    details: [
      "24/7 code explanation",
      "Performance analysis",
      "Refactoring suggestions",
    ],
    accent: "#059669",
    illustration: <AIIllustration />,
  },
  {
    number: "04",
    title: "Earn On-Chain Credentials",
    desc: "Publish your project portfolio. Receive verified peer reviews. Earn cryptographically signed certificates — immutable proof of your skill level.",
    details: [
      "Custom portfolio link",
      "Cryptographic signature",
      "Recruiter referrals",
    ],
    accent: "#a21caf",
    illustration: <CertIllustration />,
  },
];

/* ─── Step Row ──────────────────────────────── */
function StepRow({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${isEven ? "lg:[direction:rtl]" : ""}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Text panel */}
      <div className={`space-y-6 ${isEven ? "lg:[direction:ltr]" : ""}`}>
        <div className="flex items-center gap-4">
          <span
            className="text-[80px] font-black leading-none select-none"
            style={{ color: step.accent, opacity: 0.35 }}
          >
            {step.number}
          </span>
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(to right, ${step.accent}40, transparent)`,
            }}
          />
        </div>

        <h3
          className="text-[clamp(1.6rem,3vw,2.5rem)] font-black tracking-[-0.02em] leading-[1.1]"
          style={{ color: "var(--text-primary)" }}
        >
          {step.title}
        </h3>

        <p
          className="text-base leading-relaxed max-w-md"
          style={{ color: "var(--text-secondary)" }}
        >
          {step.desc}
        </p>

        <div className="space-y-2.5 pt-2">
          {step.details.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={step.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {d}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Illustration panel */}
      <div
        className={`relative h-[280px] lg:h-[320px] rounded-2xl overflow-hidden ${isEven ? "lg:[direction:ltr]" : ""} 
          bg-white dark:bg-[var(--bg-card)]
          `}
        style={{
          border: "1px solid var(--border-card)",
        }}
      >
        {/* Accent corner */}
        <div
          className="absolute top-0 left-0 w-12 h-12"
          style={{
            background: `linear-gradient(135deg, ${step.accent}20, transparent)`,
          }}
        />
        <div className="absolute inset-8">{step.illustration}</div>
        {/* Step label bottom */}
        <div className="absolute bottom-5 left-6 flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: step.accent }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: step.accent }}
          >
            Step {step.number}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Process Section ──────────────────────── */
export default function Process() {
  return (
    <section
      id="process"
      className="relative py-12 overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-20">
        <div className="max-w-xl space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div
              className="h-px w-8"
              style={{ background: "var(--accent-primary)" }}
            />
            <span
              className="text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              The Learning Engine
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.03em] leading-[1.05]"
            style={{ color: "var(--text-primary)" }}
          >
            Four steps to
            <br />
            <em
              className="font-serif-display not-italic"
              style={{ color: "var(--text-muted)" }}
            >
              practical mastery
            </em>
          </motion.h2>
        </div>
      </div>

      {/* Steps — alternating layout */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 space-y-24">
        {steps.map((step, index) => (
          <StepRow key={step.number} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
