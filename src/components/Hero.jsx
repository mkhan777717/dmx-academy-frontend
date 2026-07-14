"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Animated SVG Network Graph ──────────────────── */
const nodes = [
  { id: "react",  x: 50,  y: 30,  label: "React",     color: "#61dafb", r: 6 },
  { id: "ai",     x: 78,  y: 55,  label: "Gen AI",    color: "#a78bfa", r: 8 },
  { id: "next",   x: 22,  y: 58,  label: "Next.js",   color: "#ededec", r: 5 },
  { id: "motion", x: 62,  y: 78,  label: "Motion",    color: "#f97316", r: 6 },
  { id: "cloud",  x: 30,  y: 80,  label: "Cloud",     color: "#34d399", r: 5 },
  { id: "web3",   x: 85,  y: 25,  label: "Web3",      color: "#fbbf24", r: 4 },
  { id: "llm",    x: 15,  y: 35,  label: "LLMs",      color: "#f472b6", r: 5 },
];

const edges = [
  ["react", "next"], ["react", "motion"], ["react", "ai"],
  ["ai", "llm"], ["ai", "web3"], ["ai", "motion"],
  ["next", "cloud"], ["motion", "cloud"], ["web3", "react"],
  ["llm", "next"],
];

function NetworkGraph({ mouseX, mouseY }) {
  const [tick, setTick] = useState(0);
  const [pulsingEdge, setPulsingEdge] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    const eid = setInterval(() => setPulsingEdge(e => (e + 1) % edges.length), 1200);
    return () => { clearInterval(id); clearInterval(eid); };
  }, []);

  // Subtle parallax offset from mouse
  const offsetX = (mouseX - 0.5) * 12;
  const offsetY = (mouseY - 0.5) * 8;

  const animatedNodes = nodes.map((n, i) => {
    const floatY = Math.sin(tick / 60 + i * 0.8) * 1.5;
    const floatX = Math.cos(tick / 80 + i * 0.6) * 1;
    return {
      ...n,
      cx: n.x + floatX + offsetX * (1 - n.x / 100) * 0.3,
      cy: n.y + floatY + offsetY * (1 - n.y / 100) * 0.3,
    };
  });

  const nodeMap = Object.fromEntries(animatedNodes.map(n => [n.id, n]));

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        {nodes.map(n => (
          <radialGradient key={n.id} id={`grd-${n.id}`} r="50%" cx="50%" cy="50%">
            <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={n.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const na = nodeMap[a];
        const nb = nodeMap[b];
        if (!na || !nb) return null;
        const isPulsing = i === pulsingEdge;
        return (
          <g key={`${a}-${b}`}>
            <line
              x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
              stroke={isPulsing ? na.color : "var(--border-primary)"}
              strokeWidth={isPulsing ? 0.3 : 0.15}
              strokeOpacity={isPulsing ? 0.8 : 0.5}
              style={{ transition: "stroke 0.4s, stroke-width 0.4s, stroke-opacity 0.4s" }}
            />
            {isPulsing && (
              <motion.circle
                r="0.7"
                fill={na.color}
                initial={{ cx: na.cx, cy: na.cy, opacity: 1 }}
                animate={{ cx: nb.cx, cy: nb.cy, opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {animatedNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.cx} cy={n.cy} r={n.r * 3} fill={`url(#grd-${n.id})`} />
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.color} fillOpacity="0.15" stroke={n.color} strokeWidth="0.3" strokeOpacity="0.7" />
          <circle cx={n.cx} cy={n.cy} r={n.r * 0.45} fill={n.color} />
          <text x={n.cx} y={n.cy + n.r + 3} textAnchor="middle" fontSize="3" fill="var(--text-muted)" fontFamily="var(--font-sans)">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Ticker Strip ──────────────────────────────── */
const tickers = [
  "AI-Powered Code Review",
  "Interactive Browser Sandboxes",
  "Blockchain Certificates",
  "Live Cohort Sessions",
  "Real-Time Feedback",
  "300+ Projects Built",
  "Industry-Mentored Tracks",
];

function TickerStrip() {
  const items = [...tickers, ...tickers];
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: "var(--border-primary)" }}>
      <div className="ticker-track py-2.5">
        {items.map((t, i) => (
          <span key={i} className="mx-8 text-xs font-medium tracking-widest uppercase whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
            {t}
            <span className="mx-8" style={{ color: "var(--border-primary)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Hero ───────────────────────────────── */
export default function Hero() {
  const containerRef = useRef(null);
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mouseX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 60, damping: 20 });

  const [mxVal, setMxVal] = useState(0.5);
  const [myVal, setMyVal] = useState(0.5);

  useEffect(() => {
    const unsub1 = mouseX.on("change", v => setMxVal(v));
    const unsub2 = mouseY.on("change", v => setMyVal(v));
    return () => { unsub1(); unsub2(); };
  }, [mouseX, mouseY]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  // Text reveal variants
  const sentence = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };
  const letter = {
    hidden: { y: 60, opacity: 0, rotateX: -40 },
    visible: { y: 0, opacity: 1, rotateX: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
  };

  const words = ["Master", "Code.", "Build", "Tomorrow."];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden cursor-none-zone"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />

      {/* Ticker at very top below navbar */}
      <div className="absolute top-[64px] left-0 right-0 z-10">
        <TickerStrip />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 lg:gap-24 items-center w-full pt-40 pb-24 lg:pt-32 lg:pb-20">

          {/* LEFT — Editorial typography */}
          <div className="space-y-10">

            {/* Chapter label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12" style={{ background: "var(--accent-primary)" }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                Eduvantix — Est. 2024
              </span>
            </motion.div>

            {/* Main headline — split word by word for stagger */}
            <motion.h1
              className="text-[clamp(3.2rem,6.5vw,7rem)] font-black leading-[0.95] tracking-[-0.04em]"
              style={{ color: "var(--text-primary)", perspective: "800px" }}
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {words.map((word, wi) => (
                <span key={wi} className="overflow-hidden inline-block mr-[0.25em] last:mr-0">
                  <motion.span
                    variants={letter}
                    className={`inline-block ${wi === 1 || wi === 3 ? "font-serif-display" : ""}`}
                    style={wi === 1 || wi === 3 ? { color: "var(--text-primary)" } : {}}
                  >
                    {wi === 1 || wi === 3 ? (
                      <em style={{
                        background: "var(--accent-gradient)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontStyle: "italic"
                      }}>
                        {word}
                      </em>
                    ) : word}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Sub description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-base sm:text-lg max-w-[480px] leading-[1.65]"
              style={{ color: "var(--text-secondary)", fontWeight: 400 }}
            >
              Immersive, project-driven learning in AI, Frontend Engineering, Cloud, and Creative Tech — with live mentors, interactive sandboxes, and verified certificates.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/courses/generative-ai"
                className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-[var(--text-on-accent)] transition-all duration-300"
                style={{
                  background: "var(--accent-gradient)",
                  boxShadow: "0 0 0 0 var(--accent-glow)",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px var(--accent-glow)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 0 var(--accent-glow)"}
              >
                <span>Start Learning Free</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-200 underline-draw"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                Browse Courses
              </Link>
            </motion.div>

            {/* Proof line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-6 pt-2"
            >
              <div className="flex items-center gap-2">
                {/* Avatars stack */}
                <div className="flex -space-x-2">
                  {["#6366f1","#f97316","#34d399","#f472b6"].map((c, i) => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white" style={{ borderColor: "var(--bg-primary)", background: c }}>
                      {String.fromCharCode(65 + i * 3)}
                    </div>
                  ))}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>12,000+</strong> learners enrolled
                </span>
              </div>
              <div className="h-4 w-px" style={{ background: "var(--border-primary)" }} />
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>4.9</strong> avg rating
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — SVG Network Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
            style={{ height: "520px" }}
          >
            {/* Border frame */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                border: "1px solid var(--border-card)",
                background: "var(--bg-card)",
              }}
            />

            {/* Corner labels */}
            <div className="absolute top-5 left-5 z-10">
              <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Tech Stack</div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--border-primary)" }}>Live Network</div>
            </div>
            <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Live</span>
            </div>

            {/* Graph */}
            <div className="absolute inset-8">
              <NetworkGraph mouseX={mxVal} mouseY={myVal} />
            </div>

            {/* Bottom badge */}
            <div
              className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{nodes.length} technologies · {edges.length} connections</span>
              <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Interactive</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg-primary))" }}
      />
    </section>
  );
}
