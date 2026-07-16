"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useTheme from "@/customHooks/useTheme";
import TickerStrip from "./TickerStrip";
import { getThemeTokens } from "@/utils/themeTokens";

// Infinite scroll ticker for company logos
function InfiniteCompanyTicker({ companies, dark }) {
  const tickerRef = useRef(null);

  return (
    <div
      className="relative mt-20 overflow-x-hidden w-full pointer-events-none"
      style={{
        opacity: 0.3,
        filter: "grayscale(1)",
        transition: "filter 0.5s, opacity 0.5s"
      }}
    >
      <div
        ref={tickerRef}
        className="group hover:opacity-100 hover:grayscale-0 flex items-center"
        style={{
          animation: "companyTickerScroll 32s linear infinite",
          display: "flex",
          width: "max-content",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
          e.currentTarget.parentElement.style.opacity = "1";
          e.currentTarget.parentElement.style.filter = "grayscale(0)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
          e.currentTarget.parentElement.style.opacity = "";
          e.currentTarget.parentElement.style.filter = "";
        }}
      >
        {[...companies, ...companies].map((company, idx) => (
          <span
            key={company + idx}
            className="mx-12 md:mx-24 text-2xl md:text-4xl font-bold tracking-tight whitespace-nowrap"
            style={{
              color: dark ? "#fff" : "#111",
              transition: "color 0.3s"
            }}
          >
            {company}
          </span>
        ))}
      </div>
      {/* Inline style for keyframes */}
      <style>
        {`
        @keyframes companyTickerScroll {
          100% { transform: translateX(-50%); }
        }
        `}
      </style>
    </div>
  );
}

export default function Tracks() {
  const dark = useTheme();
  const ease = [0.16, 1, 0.3, 1];
  const tok = getThemeTokens(dark);

  // For built to prepare you for section
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Netflix",
    "NVIDIA",
  ];

  return (
    <section
      className="relative w-full overflow-hidden py-32"
      style={{
        background: dark ? "#000000" : "#f8fafc",
        color: dark ? "#ffffff" : "#020617",
        transition: "background 0.4s ease"
      }}
    >
      {/* 1. Header (Ecosystem Intro) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-500 mb-6 block">
            The Complete Ecosystem
          </span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            One Platform.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Everything Developers Need.
            </span>
          </h2>
          <p className="text-lg md:text-xl opacity-50 max-w-2xl mx-auto leading-relaxed">
            Stop buying random courses. Get a complete, unified ecosystem with AI learning, real-world projects, live coding arenas, and interview prep.
          </p>
        </motion.div>
      </div>

      {/* 2. Success Numbers */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 mb-40 relative z-10">
        {[
          { val: "100+", label: "Lessons" },
          { val: "100+", label: "Projects" },
          { val: "10+", label: "Mentors" },
          { val: "24/7", label: "AI Tutor" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
            className="text-center"
          >
            <div className="text-5xl md:text-7xl font-bold font-sans mb-3 tracking-tighter">{stat.val}</div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <TickerStrip tok={tok}/>

      <div className="editorial-line  mb-40" />

      {/* 3. Learning Journey Timeline */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40 relative z-10">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Choose Your Journey.</h3>
          <p className="text-lg opacity-50 max-w-2xl mx-auto">A structured roadmap designed for outcomes, not just certificates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent -translate-y-1/2 z-0" />

          {[
            { step: "01", title: "Foundations", desc: "Watch & Practice fundamentals.", label: "Start" },
            { step: "02", title: "Build", desc: "Develop real-world projects.", label: "Execute" },
            { step: "03", title: "Master", desc: "Advanced concepts & logic.", label: "Refine" },
            { step: "04", title: "Launch", desc: "Resume, Interview, Placement.", label: "Hired" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease }}
              className="relative z-10 p-8 rounded-[2rem] border transition-transform hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)",
                borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                boxShadow: dark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)",
                backdropFilter: "blur(20px)"
              }}
            >
              <div className="flex justify-between items-start mb-12">
                <div className="text-emerald-500 font-mono text-sm opacity-80">{item.step}</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                  {item.label}
                </div>
              </div>
              <h4 className="text-3xl font-bold mb-3 tracking-tight">{item.title}</h4>
              <p className="opacity-50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="editorial-line  mb-40" />

      {/* 4. Build Real Products */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Build Real Products.</h3>
          <p className="text-lg opacity-50 max-w-2xl mx-auto">Don't just watch tutorials. Build the exact systems used by top tech companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Spotify Clone", lessons: 18, projs: 2, c1: "emerald", c2: "green" },
            { title: "Uber Clone", lessons: 24, projs: 3, c1: "black", c2: "gray" },
            { title: "Netflix Clone", lessons: 20, projs: 2, c1: "red", c2: "rose" },
            { title: "AI Chatbot", lessons: 15, projs: 4, c1: "blue", c2: "indigo" },
            { title: "Trading Dashboard", lessons: 30, projs: 1, c1: "amber", c2: "orange" },
            { title: "Airbnb Clone", lessons: 22, projs: 2, c1: "pink", c2: "rose" }
          ].map((prod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group relative p-8 rounded-[2rem] overflow-hidden border transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between min-h-[300px]"
              style={{
                background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)",
                borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                boxShadow: dark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)",
              }}
            >
              <div className="relative z-10">
                <h4 className="text-3xl font-bold mb-6 tracking-tight">{prod.title}</h4>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-500">{prod.lessons} Lessons</span>
                  <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-500">{prod.projs} Projects</span>
                  <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-purple-500/10 text-purple-500">Certificate</span>
                </div>
              </div>
              {/* Visual Placeholder Graphic */}
              <div className="w-full h-32 rounded-2xl relative overflow-hidden mt-auto" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-${prod.c1}-500/20 blur-2xl transition-transform group-hover:scale-150`} />
                <div className={`absolute -left-10 -top-10 w-32 h-32 rounded-full bg-${prod.c2}-500/20 blur-2xl transition-transform group-hover:scale-150`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="editorial-line  mb-40" />

      {/* 5. Premium Bento Grid (Features) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Platform Features.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

          {/* Large AI Mentor block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="md:col-span-2 md:row-span-2 rounded-[2.5rem] border p-12 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)",
              borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            }}
          >
            <div className="relative z-10 max-w-md">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-500 mb-4 block">AI Learning Experience</span>
              <h4 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">Meet your<br />AI Mentor.</h4>
              <ul className="space-y-4 opacity-60 text-lg">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Explains code blocks visually</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Reviews and grades projects</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Conducts live mock interviews</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Personalizes your roadmap</li>
              </ul>
            </div>
            {/* Visual illustration of AI avatar */}
            <div className="absolute right-0 bottom-0 w-[400px] h-[400px] pointer-events-none">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full translate-x-1/4 translate-y-1/4 animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-20 bg-cyan-500/20 blur-[60px] rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
          </motion.div>

          {/* Coding Playground Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="rounded-[2.5rem] border p-8 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: dark ? "#0a0a0a" : "#1e1e1e",
              color: "#ffffff",
              borderColor: dark ? "rgba(255,255,255,0.08)" : "transparent"
            }}
          >
            <div>
              <h4 className="text-2xl font-bold mb-2 tracking-tight">Coding Playground</h4>
              <p className="opacity-60 text-sm">Large VS Code UI built directly into your browser.</p>
            </div>
            <div className="font-mono text-[11px] opacity-70 mt-8 bg-black/50 p-4 rounded-xl border border-white/10">
              <span className="text-emerald-400">~/project</span> $ npm run dev<br />
              <span className="text-blue-400">&gt; compiling...</span><br />
              <span className="text-green-400">✓ ready in 234ms</span><br />
              <span className="animate-pulse">_</span>
            </div>
          </motion.div>

          {/* Career Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="rounded-[2.5rem] border p-8 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)",
              borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            }}
          >
            <h4 className="text-2xl font-bold mb-6 tracking-tight">Career Dashboard</h4>
            <div className="space-y-4 mt-auto">
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                <span className="opacity-60 text-sm font-medium">Progress</span>
                <span className="font-bold text-emerald-500">86%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                <span className="opacity-60 text-sm font-medium">Interview Score</span>
                <span className="font-bold">91%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                <span className="opacity-60 text-sm font-medium">Global Rank</span>
                <span className="font-bold text-blue-500">Top 5%</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom small blocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="rounded-[2.5rem] border p-8 flex items-end relative overflow-hidden group"
            style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-2xl font-bold tracking-tight z-10">Resume Builder</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="rounded-[2.5rem] border p-8 flex items-end relative overflow-hidden group"
            style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-2xl font-bold tracking-tight z-10">Hackathons</h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="rounded-[2.5rem] border p-8 flex items-end relative overflow-hidden group"
            style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-2xl font-bold tracking-tight z-10">Certificates</h4>
          </motion.div>
        </div>
      </div>

      <div className="editorial-line  mb-40" />

      {/* 6. Companies Students Can Reach */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center pb-32">
        <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
          Built to prepare you for<br />
          <span className="text-emerald-500">world-class engineering teams.</span>
        </h3>
        {/* Infinite scroll company ticker */}
        <InfiniteCompanyTicker companies={companies} dark={dark} />
      </div>
    </section>
  );
}
