"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Step SVG Illustrations ─────────────────── */
const PathIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Forking path diagram */}
    <line x1="40" y1="100" x2="100" y2="100" stroke="#4f46e5" strokeWidth="1" strokeOpacity="1.00"/>
    <circle cx="40" cy="100" r="5" fill="#4f46e5" fillOpacity="1.00"/>
    <line x1="100" y1="100" x2="160" y2="60" stroke="#4f46e5" strokeWidth="0.8" strokeOpacity="1.00"/>
    <line x1="100" y1="100" x2="160" y2="100" stroke="#4f46e5" strokeWidth="0.8" strokeOpacity="0.75"/>
    <line x1="100" y1="100" x2="160" y2="140" stroke="#4f46e5" strokeWidth="0.8" strokeOpacity="0.50"/>
    <circle cx="100" cy="100" r="4" fill="#4f46e5" fillOpacity="1.00"/>
    {[60,100,140].map((y,i) => (
      <g key={y}>
        <rect x="160" y={y-20} width="80" height="38" rx="6" fill="#4f46e5" fillOpacity={0.04 + i*0.03} stroke="#4f46e5" strokeWidth="0.4" strokeOpacity="1.00"/>
        <text x="200" y={y+4} textAnchor="middle" fontSize="9" fill="#4f46e5" fillOpacity="1.00">
          {["AI Track","Frontend","DevOps"][i]}
        </text>
      </g>
    ))}
    <text x="40" y="125" fontSize="9" fill="#4f46e5" fillOpacity="0.75">Start</text>
  </svg>
);

const SandboxIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Browser window */}
    <rect x="20" y="20" width="240" height="160" rx="8" stroke="#0891b2" strokeWidth="0.5" strokeOpacity="1.00"/>
    {/* Browser bar */}
    <rect x="20" y="20" width="240" height="28" rx="8" fill="#0891b2" fillOpacity="0.15"/>
    <circle cx="38" cy="34" r="4" fill="#ef4444" fillOpacity="1.00"/>
    <circle cx="52" cy="34" r="4" fill="#f59e0b" fillOpacity="1.00"/>
    <circle cx="66" cy="34" r="4" fill="#22c55e" fillOpacity="1.00"/>
    <rect x="82" y="28" width="140" height="12" rx="6" fill="#0891b2" fillOpacity="0.20" stroke="#0891b2" strokeWidth="0.3" strokeOpacity="0.75"/>
    {/* Code + Preview split */}
    <line x1="150" y1="48" x2="150" y2="180" stroke="#0891b2" strokeWidth="0.3" strokeOpacity="0.75"/>
    {/* Code lines left */}
    {[55,63,71,79,87,95].map((y,i)=>(
      <rect key={y} x="28" y={y} width={[60,45,70,50,65,40][i]} height="3" rx="1.5" fill="#0891b2" fillOpacity={0.3-i*0.03}/>
    ))}
    {/* Canvas right */}
    <circle cx="205" cy="110" r="28" fill="#0891b2" fillOpacity="0.18" stroke="#0891b2" strokeWidth="0.4" strokeOpacity="1.00"/>
    <rect x="188" y="102" width="34" height="3" rx="1.5" fill="#0891b2" fillOpacity="1.00"/>
    <rect x="192" y="109" width="26" height="3" rx="1.5" fill="#0891b2" fillOpacity="0.75"/>
    <text x="205" y="145" textAnchor="middle" fontSize="8" fill="#0891b2" fillOpacity="1.00">Live Preview</text>
  </svg>
);

const AIIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Code block */}
    <rect x="20" y="30" width="130" height="100" rx="6" fill="#059669" fillOpacity="0.10" stroke="#059669" strokeWidth="0.4" strokeOpacity="1.00"/>
    {[40,52,64,76,88,100].map((y,i)=>(
      <rect key={y} x="30" y={y} width={[80,60,90,50,70,65][i]} height="3" rx="1.5" fill="#059669" fillOpacity={0.25-i*0.02}/>
    ))}
    {/* AI feedback arrow */}
    <path d="M155 80 L200 80" stroke="#059669" strokeWidth="0.8" strokeOpacity="1.00" markerEnd="url(#arrow)"/>
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 Z" fill="#059669" fillOpacity="1.00"/>
      </marker>
    </defs>
    {/* AI response bubble */}
    <rect x="205" y="50" width="60" height="60" rx="8" fill="#059669" fillOpacity="0.18" stroke="#059669" strokeWidth="0.4" strokeOpacity="1.00"/>
    <text x="235" y="72" textAnchor="middle" fontSize="7" fill="#059669" fillOpacity="1.00">Suggest</text>
    <text x="235" y="83" textAnchor="middle" fontSize="7" fill="#059669" fillOpacity="1.00">Refactor</text>
    <text x="235" y="94" textAnchor="middle" fontSize="7" fill="#059669" fillOpacity="1.00">Review</text>
    {/* Pulse rings */}
    <circle cx="235" cy="80" r="40" stroke="#059669" strokeWidth="0.2" strokeOpacity="0.50" strokeDasharray="2 4"/>
  </svg>
);

const CertIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Certificate */}
    <rect x="40" y="30" width="200" height="140" rx="8" fill="#a21caf" fillOpacity="0.10" stroke="#a21caf" strokeWidth="0.4" strokeOpacity="1.00"/>
    <rect x="55" y="45" width="170" height="1" fill="#a21caf" fillOpacity="0.75"/>
    <rect x="55" y="160" width="170" height="1" fill="#a21caf" fillOpacity="0.75"/>
    <circle cx="140" cy="100" r="28" fill="#a21caf" fillOpacity="0.15" stroke="#a21caf" strokeWidth="0.5" strokeOpacity="1.00"/>
    <text x="140" y="95" textAnchor="middle" fontSize="18" fill="#a21caf" fillOpacity="1.00">✦</text>
    <text x="140" y="110" textAnchor="middle" fontSize="8" fill="#a21caf" fillOpacity="1.00">Verified</text>
    <rect x="90" y="130" width="100" height="4" rx="2" fill="#a21caf" fillOpacity="0.50"/>
    <rect x="108" y="140" width="64" height="3" rx="1.5" fill="#a21caf" fillOpacity="0.30"/>
    {/* Chain links */}
    <path d="M60 55 Q50 55 50 65 L50 75 Q50 85 60 85" stroke="#a21caf" strokeWidth="0.4" strokeOpacity="1.00" fill="none"/>
    <path d="M220 55 Q230 55 230 65 L230 75 Q230 85 220 85" stroke="#a21caf" strokeWidth="0.4" strokeOpacity="1.00" fill="none"/>
    <text x="140" y="175" textAnchor="middle" fontSize="7" fill="#a21caf" fillOpacity="0.75" fontFamily="monospace">0x4f3...a8c2</text>
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    desc: "Take a diagnostic assessment. A counselor maps your background, goals, and pace to the right learning track — Frontend, AI, Cloud, or Creative Tech.",
    details: ["Tailored diagnostic test", "Dedicated path counselors", "Lifetime syllabus updates"],
    accent: "#4f46e5",
    illustration: <PathIllustration />,
  },
  {
    number: "02",
    title: "Build in Browser Sandboxes",
    desc: "Write code and see it render live — split-screen editor + preview. No environment setup. Autosaved checkpoints keep your progress permanent.",
    details: ["Split-screen live rendering", "Autosaved checkpoints", "Hot module reloading"],
    accent: "#0891b2",
    illustration: <SandboxIllustration />,
  },
  {
    number: "03",
    title: "AI Co-Pilot Review",
    desc: "Custom LLM agents review your code in real time — catching errors, suggesting refactors, and explaining performance tradeoffs in plain language.",
    details: ["24/7 code explanation", "Performance analysis", "Refactoring suggestions"],
    accent: "#059669",
    illustration: <AIIllustration />,
  },
  {
    number: "04",
    title: "Earn On-Chain Credentials",
    desc: "Publish your project portfolio. Receive verified peer reviews. Earn cryptographically signed certificates — immutable proof of your skill level.",
    details: ["Custom portfolio link", "Cryptographic signature", "Recruiter referrals"],
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
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${step.accent}40, transparent)` }} />
        </div>

        <h3
          className="text-[clamp(1.6rem,3vw,2.5rem)] font-black tracking-[-0.02em] leading-[1.1]"
          style={{ color: "var(--text-primary)" }}
        >
          {step.title}
        </h3>

        <p className="text-base leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={step.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {d}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Illustration panel */}
      <div
        className={`relative h-[280px] lg:h-[320px] rounded-2xl overflow-hidden ${isEven ? "lg:[direction:ltr]" : ""}`}
        style={{
          border: "1px solid var(--border-card)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        {/* Accent corner */}
        <div
          className="absolute top-0 left-0 w-12 h-12"
          style={{
            background: `linear-gradient(135deg, ${step.accent}20, transparent)`,
          }}
        />
        <div className="absolute inset-8">
          {step.illustration}
        </div>
        {/* Step label bottom */}
        <div className="absolute bottom-5 left-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: step.accent }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.accent }}>
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
    <section id="process" className="relative py-28 overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="editorial-line" />

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
            <div className="h-px w-8" style={{ background: "var(--accent-primary)" }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
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
            Four steps to<br />
            <em className="font-serif-display not-italic" style={{ color: "var(--text-muted)" }}>practical mastery</em>
          </motion.h2>
        </div>
      </div>

      {/* Steps — alternating layout */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 space-y-24">
        {steps.map((step, index) => (
          <StepRow key={step.number} step={step} index={index} />
        ))}
      </div>

      <div className="editorial-line mt-28" />
    </section>
  );
}
