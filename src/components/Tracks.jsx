"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getApiBase } from "@/utils/api";

/* ─── Track Definitions ─────────────────────────── */
const tracks = [
  {
    id: "frontend",
    number: "01",
    label: "Frontend Architecture",
    tagline: "Build the interfaces of tomorrow",
    desc: "React 19, Next.js App Router, Animation Engineering, Component Design Systems — from fundamentals to senior-level patterns.",
    accent: "#6366f1",
    bg: "hsl(240 60% 8%)",
    courses: ["React.js Foundations", "Next.js App Router", "Node.js & Express API", "Complete Web Dev", "Flutter", "React Native", "MongoDB"],
    category: "Web & Mobile Development",
    svg: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="20" width="160" height="120" rx="8" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.3"/>
        <rect x="30" y="30" width="50" height="4" rx="2" fill="#6366f1" fillOpacity="0.6"/>
        <rect x="30" y="40" width="35" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.3"/>
        <rect x="90" y="30" width="80" height="100" rx="4" fill="#6366f1" fillOpacity="0.05" stroke="#6366f1" strokeWidth="0.3" strokeOpacity="0.4"/>
        <circle cx="130" cy="80" r="20" fill="#6366f1" fillOpacity="0.1" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.5"/>
        <text x="130" y="84" textAnchor="middle" fontSize="10" fill="#6366f1" fillOpacity="0.8" fontWeight="700">&lt;/&gt;</text>
        <rect x="30" y="55" width="45" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.2"/>
        <rect x="30" y="64" width="35" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.15"/>
        <rect x="30" y="73" width="50" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.1"/>
        <line x1="30" y1="90" x2="75" y2="90" stroke="#6366f1" strokeWidth="0.3" strokeOpacity="0.4"/>
        <rect x="30" y="98" width="40" height="20" rx="4" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="0.3" strokeOpacity="0.5"/>
        <text x="50" y="111" textAnchor="middle" fontSize="7" fill="#6366f1" fillOpacity="0.7">Deploy</text>
      </svg>
    ),
  },
  {
    id: "ai",
    number: "02",
    label: "AI & Data Science",
    tagline: "Engineer intelligence from scratch",
    desc: "Machine Learning, Generative AI with LLMs, Data Science & Analytics — build real AI products, not just toy models.",
    accent: "#a78bfa",
    bg: "hsl(260 60% 8%)",
    courses: ["Machine Learning & AI", "Generative AI Specialist", "Data Science & Analytics"],
    category: "Data & AI",
    svg: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="100" cy="80" r="25" stroke="#a78bfa" strokeWidth="0.5" strokeOpacity="0.4"/>
        <circle cx="100" cy="80" r="4" fill="#a78bfa" fillOpacity="0.8"/>
        {[[55,48],[145,48],[55,112],[145,112],[38,80],[162,80]].map(([cx,cy],i)=>(
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill="#a78bfa" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.6"/>
            <circle cx={cx} cy={cy} r="2" fill="#a78bfa" fillOpacity="0.7"/>
            <line x1={cx} y1={cy} x2="100" y2="80" stroke="#a78bfa" strokeWidth="0.25" strokeOpacity="0.35"/>
          </g>
        ))}
        <circle cx="100" cy="80" r="40" stroke="#a78bfa" strokeWidth="0.2" strokeOpacity="0.15" strokeDasharray="3 4"/>
        <circle cx="100" cy="80" r="55" stroke="#a78bfa" strokeWidth="0.15" strokeOpacity="0.1" strokeDasharray="2 6"/>
        <text x="100" y="145" textAnchor="middle" fontSize="8" fill="#a78bfa" fillOpacity="0.4" fontFamily="monospace">model.predict()</text>
      </svg>
    ),
  },
  {
    id: "devops",
    number: "03",
    label: "Cloud & DevOps",
    tagline: "Scale infrastructure with confidence",
    desc: "Docker, Kubernetes, AWS, CI/CD pipelines, and Cybersecurity — become the engineer who ships and scales.",
    accent: "#34d399",
    bg: "hsl(160 60% 6%)",
    courses: ["DevOps & CI/CD", "Cybersecurity Foundations", "Cloud Computing"],
    category: "Cloud & DevOps",
    svg: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M100 30 L140 55 L140 105 L100 130 L60 105 L60 55 Z" stroke="#34d399" strokeWidth="0.4" strokeOpacity="0.4"/>
        <path d="M100 50 L125 65 L125 95 L100 110 L75 95 L75 65 Z" fill="#34d399" fillOpacity="0.06" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <circle cx="100" cy="80" r="8" fill="#34d399" fillOpacity="0.15" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.7"/>
        <line x1="100" y1="30" x2="100" y2="50" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <line x1="140" y1="55" x2="125" y2="65" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <line x1="140" y1="105" x2="125" y2="95" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <line x1="100" y1="130" x2="100" y2="110" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <line x1="60" y1="105" x2="75" y2="95" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <line x1="60" y1="55" x2="75" y2="65" stroke="#34d399" strokeWidth="0.3" strokeOpacity="0.5"/>
        <text x="100" y="83" textAnchor="middle" fontSize="7" fill="#34d399" fillOpacity="0.9">CI/CD</text>
      </svg>
    ),
  },
  {
    id: "creative",
    number: "04",
    label: "Creative Tech",
    tagline: "Where design meets the blockchain",
    desc: "Blockchain development, Web3 smart contracts, and emerging technology stacks — build for the decentralized web.",
    accent: "#f97316",
    bg: "hsl(20 60% 7%)",
    courses: ["Blockchain & Web3", "Trending Tech Stack"],
    category: "Creative Tech",
    svg: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {[
          [60,50],[140,50],[100,80],[60,110],[140,110]
        ].map(([x,y],i)=>(
          <g key={i}>
            <rect x={x-10} y={y-10} width="20" height="20" rx="3" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeWidth="0.4" strokeOpacity="0.5"/>
            <text x={x} y={y+4} textAnchor="middle" fontSize="8" fill="#f97316" fillOpacity="0.8">⬡</text>
          </g>
        ))}
        <line x1="60" y1="50" x2="100" y2="80" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.4"/>
        <line x1="140" y1="50" x2="100" y2="80" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.4"/>
        <line x1="60" y1="110" x2="100" y2="80" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.4"/>
        <line x1="140" y1="110" x2="100" y2="80" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.4"/>
        <line x1="60" y1="50" x2="60" y2="110" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.3"/>
        <line x1="140" y1="50" x2="140" y2="110" stroke="#f97316" strokeWidth="0.25" strokeOpacity="0.3"/>
        <text x="100" y="146" textAnchor="middle" fontSize="7" fill="#f97316" fillOpacity="0.4" fontFamily="monospace">Web3</text>
      </svg>
    ),
  },
];

/* ─── Track Card ─────────────────────────────── */
function TrackCard({ track, isActive, onClick, index }) {
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        width: isActive ? "380px" : "240px",
        minHeight: "480px",
        border: `1px solid ${isActive ? track.accent : "var(--border-card)"}`,
        backgroundColor: "var(--bg-card)",
        transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, ${track.accent}, transparent)`, opacity: isActive ? 1 : 0 }}
      />

      {/* Number */}
      <div className="absolute top-6 left-6">
        <span
          className="text-[72px] font-black leading-none select-none"
          style={{ color: track.accent, opacity: isActive ? 0.15 : 0.08, transition: "opacity 0.3s" }}
        >
          {track.number}
        </span>
      </div>

      {/* SVG illustration */}
      <div className="absolute top-4 right-4" style={{ width: isActive ? "160px" : "100px", height: isActive ? "120px" : "80px", transition: "width 0.5s, height 0.5s", opacity: isActive ? 1 : 0.5 }}>
        {track.svg}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block"
            style={{ color: track.accent }}
          >
            Track {track.number}
          </span>
          <h3
            className="text-xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {track.label}
          </h3>
        </div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {track.desc}
            </p>
            <div className="space-y-1.5">
              {track.courses.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <div className="h-1 w-1 rounded-full" style={{ background: track.accent }} />
                  {c}
                </div>
              ))}
              {track.courses.length > 4 && (
                <div className="text-xs" style={{ color: track.accent }}>+{track.courses.length - 4} more courses</div>
              )}
            </div>
            <a
              href={`/courses?category=${encodeURIComponent(track.category)}`}
              className="inline-flex items-center gap-2 text-xs font-semibold mt-2 group/link"
              style={{ color: track.accent }}
            >
              <span>Explore Track</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/link:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>
        )}

        {!isActive && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {track.tagline}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Tracks Section ──────────────────────────── */
export default function Tracks() {
  const [activeTrack, setActiveTrack] = useState("frontend");
  const railRef = useRef(null);

  return (
    <section id="tracks" className="relative py-28 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Section intro — left-aligned editorial */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8" style={{ background: "var(--accent-primary)" }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                Learning Tracks
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
              Choose your<br />
              <em className="font-serif-display not-italic" style={{ color: "var(--text-muted)" }}>specialization</em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Four deep-dive tracks built by industry practitioners. Click any card to explore the curriculum.
          </motion.p>
        </div>
      </div>

      {/* Horizontal scroll rail */}
      <div
        ref={railRef}
        className="horizontal-scroll-rail px-6 md:px-12 gap-4 pb-6"
        style={{ maxWidth: "100vw" }}
      >
        {tracks.map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            isActive={activeTrack === track.id}
            onClick={() => setActiveTrack(track.id)}
            index={i}
          />
        ))}
        {/* End spacer */}
        <div className="flex-shrink-0 w-6 md:w-12" />
      </div>

      {/* Bottom rule */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mt-12">
        <div className="flex items-center justify-between">
          <div className="h-px flex-1" style={{ background: "var(--border-primary)" }} />
          <a
            href="/courses"
            className="mx-6 text-xs font-semibold flex items-center gap-2 underline-draw"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            View all courses
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <div className="h-px flex-1" style={{ background: "var(--border-primary)" }} />
        </div>
      </div>
    </section>
  );
}
