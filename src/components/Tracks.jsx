"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

  const featuresRef = useRef(null);
  const carouselRef = useRef(null);
  const mobileCarouselRef = useRef(null);

  const [scrollDist, setScrollDist] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useLayoutEffect(() => {
    const measureCarousel = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setViewportHeight(window.innerHeight);

      if (!isDesktop || !carouselRef.current) {
        setScrollDist(0);
        return;
      }

      const trackWidth = carouselRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollDist(Math.max(0, trackWidth - viewportWidth));
    };

    measureCarousel();
    const rafId = requestAnimationFrame(measureCarousel);

    window.addEventListener("resize", measureCarousel);
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", measureCarousel);

    const observer = carouselRef.current
      ? new ResizeObserver(measureCarousel)
      : null;
    if (carouselRef.current) observer?.observe(carouselRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureCarousel);
      mediaQuery.removeEventListener("change", measureCarousel);
      observer?.disconnect();
    };
  }, [dark]);

  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;

    const onScroll = () => {
      const card = el.querySelector("[data-feature-card]");
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width;
      const gap = 16;
      const index = Math.round(el.scrollLeft / (cardWidth + gap));
      const cardCount = el.querySelectorAll("[data-feature-card]").length;
      setActiveFeature(Math.min(Math.max(index, 0), cardCount - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: featuresRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (progress) => -progress * scrollDist);

  const [activeJourney, setActiveJourney] = useState(0);

  const featuresList = [
    {
      title: "Interactive Coding Environment",
      desc: "Write code directly inside a fully integrated, VS Code-like browser editor with real-time live preview rendering.",
      c: "emerald",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[240px] md:w-[280px] h-[140px] md:h-[160px] rounded-xl border border-white/10 bg-neutral-950 p-2 shadow-2xl overflow-hidden font-mono text-[8px] md:text-[9px] flex flex-col justify-between translate-y-4 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-white/40 ml-1">App.jsx</span>
            </div>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[7px]">PREVIEW</span>
          </div>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 text-left text-white/60 space-y-0.5 leading-tight">
              <div><span className="text-purple-400">const</span> App = () =&gt; &#123;</div>
              <div className="pl-2"><span className="text-purple-400">return</span> (</div>
              <div className="pl-4 text-blue-400">&lt;<span className="text-red-400">div</span>&gt;</div>
              <div className="pl-6 text-white/90 flex items-center">
                <span>&lt;<span className="text-red-400">h1</span>&gt;Live Preview&lt;/<span className="text-red-400">h1</span>&gt;</span>
                <span style={{ animation: 'animBlink 0.8s infinite' }} className="w-0.5 h-2.5 bg-white ml-0.5" />
              </div>
              <div className="pl-4 text-blue-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
              <div className="pl-2">)</div>
              <div>&#125;</div>
            </div>
            <div className="w-[80px] md:w-[90px] rounded-lg bg-neutral-900 border border-white/5 p-1.5 flex flex-col justify-between">
              <div className="w-full h-1 bg-white/5 rounded-full" />
              <div className="flex-1 flex items-center justify-center">
                <span style={{ animation: 'animPulseScale 3s infinite' }} className="text-[8px] font-bold text-white text-center leading-none">Live Preview</span>
              </div>
              <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                <div style={{ animation: 'animProgressFast 5s infinite' }} className="h-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Project-Based Learning",
      desc: "Build realistic clones of Spotify, Netflix, Airbnb, and more to compile a competitive developer portfolio.",
      c: "red",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[240px] md:w-[280px] h-[100px] md:h-[120px] flex items-center justify-center gap-2 md:gap-4 translate-y-4 group-hover:translate-y-1 transition-transform duration-500">
          <div style={{ animation: 'animFloatSm 4s ease-in-out infinite' }} className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg">
            <span className="font-bold text-[9px] text-emerald-400">Spotify</span>
          </div>
          <div style={{ animation: 'animFloatMd 3s ease-in-out infinite 0.5s' }} className="w-16 h-16 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-2xl z-10">
            <span className="font-black text-[10px] text-red-400">NETFLIX</span>
          </div>
          <div style={{ animation: 'animFloatSm 4s ease-in-out infinite 1s' }} className="w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg">
            <span className="font-bold text-[9px] text-pink-400">Airbnb</span>
          </div>
        </div>
      )
    },
    {
      title: "Progress Tracking",
      desc: "Detailed skill radar charts and milestone dashboards map your full-stack developer growth.",
      c: "amber",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[220px] md:w-[260px] h-[120px] p-3 rounded-xl border border-white/5 bg-black dark:bg-black/40 flex flex-col justify-between translate-y-4 group-hover:translate-y-1 transition-transform duration-500">
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-white/50">
                <span>Frontend Architecture</span>
                <span className="font-bold text-white">82%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["0%", "82%"] }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-white/50">
                <span>Backend Integration</span>
                <span className="font-bold text-white">64%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["0%", "64%"] }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/30 border-t border-white/5 pt-1.5">
            <span>2/3 PROJECTS COMPLETED</span>
            <span className="text-emerald-400">ON TRACK</span>
          </div>
        </div>
      )
    },
    {
      title: "Mentorship & Community",
      desc: "Collaborate on peer code reviews and get detailed roadmap help directly from active engineering mentors.",
      c: "purple",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[240px] md:w-[260px] p-3 rounded-xl border border-purple-500/20 bg-black dark:bg-black/40 flex gap-2 items-start translate-y-4 group-hover:translate-y-1 transition-transform duration-500 text-left">
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[10px] text-white shrink-0">M</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[8px] font-bold text-white">Mentor Review</span>
              <span className="text-[7px] text-white/30">Just now</span>
            </div>
            <p className="text-[9px] text-white/70 leading-snug">"Great folder design! Just optimize lines 12-15 as a custom react hook."</p>
          </div>
        </div>
      )
    },
    {
      title: "Verified Certification",
      desc: "Receive secure, shareable, cryptographically signed course completion certificates.",
      c: "cyan",
      visual: (
        <div className="absolute left-6 bottom-6 md:left-10 md:bottom-0 w-[240px] md:w-[260px] h-[100px] md:h-[120px] rounded-xl border border-cyan-500/20 bg-black dark:bg-neutral-950/60 p-3 flex flex-col justify-between translate-y-4 group-hover:translate-y-1 transition-transform duration-500 overflow-hidden relative">
          <div style={{ animation: 'animSweep 3s ease-in-out infinite' }} className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12" />
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-mono text-cyan-400">EDUVANTIX_VERIFIED</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div className="text-left leading-none">
            <h5 className="text-[9px] font-bold text-white tracking-tight uppercase">FULL-STACK CERTIFICATE</h5>
            <span className="text-[7.5px] text-white/40 font-mono block mt-1">hash // 7d8c_92a1_f10e</span>
          </div>
        </div>
      )
    },
    {
      title: "AI-Powered Assistance",
      desc: "Personalized learning paths, interactive debug guides, and smart context hints as you build.",
      c: "blue",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[240px] md:w-[260px] p-3 rounded-xl border border-blue-500/20 bg-black dark:bg-black/40 flex flex-col gap-2 translate-y-4 group-hover:translate-y-1 transition-transform duration-500">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[8px] font-mono text-blue-400">DEBUG DIAGNOSTIC READY</span>
          </div>
          <p className="text-[9px] text-white/80 font-mono leading-tight text-left">Line 24: Missing closing tag &lt;/div&gt;</p>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div style={{ animation: 'animSweepLinear 2s linear infinite' }} className="w-1/2 h-full bg-blue-500" />
          </div>
        </div>
      )
    },
    {
      title: "Career Resources",
      desc: "Export project achievements instantly. Access interview simulators, resume builders, and job boards.",
      c: "yellow",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[220px] md:w-[260px] flex flex-col gap-1.5 translate-y-4 group-hover:translate-y-1 transition-transform duration-500">
          <div className="p-2 rounded-lg border flex justify-between items-center shadow-lg
                        bg-black dark:bg-white/5 border-neutral-700/60
                        dark:border-white/5
          ">
            <div className="flex items-center gap-1.5 text-left">
              <div className="w-6 h-6 rounded bg-black dark:bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">G</div>
              <div>
                <h5 className="text-[8px] font-bold text-white leading-none">Google Referral</h5>
                <span className="text-[7px] text-white/50">SWE Internship</span>
              </div>
            </div>
            <span className="text-[7px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">READY</span>
          </div>
          <div className="p-2 rounded-lg border flex justify-between items-center shadow-lg opacity-40
                        bg-black dark:bg-white/5 border-neutral-700/60
                        dark:border-white/5
          ">
            <div className="flex items-center gap-1.5 text-left">
              <div className="w-6 h-6 rounded bg-black dark:bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">M</div>
              <div>
                <h5 className="text-[8px] font-bold text-white leading-none">Meta Referral</h5>
                <span className="text-[7px] text-white/50">Frontend Associate</span>
              </div>
            </div>
            <span className="text-[7px] font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded-full">IN REVIEW</span>
          </div>
        </div>
      )
    },
    {
      title: "Flexible Learning Paths",
      desc: "Switch roadmaps seamlessly at any point. Customize self-paced tracks for frontend, backend, or full-stack paths.",
      c: "indigo",
      visual: (
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-[240px] md:w-[260px] h-[100px] rounded-xl border border-white/5 bg-black dark:bg-neutral-900/40 p-3 flex flex-col justify-between translate-y-4 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none">
          <div className="flex justify-between items-center text-[8px] font-mono text-white/50">
            <span>STATION MAP</span>
            <span className="text-indigo-400">ACTIVE</span>
          </div>
          <div className="relative flex-1 flex items-center justify-around">
            <div className="absolute left-[10%] right-[10%] h-0.5 bg-white/10" />
            <motion.div className="absolute left-[10%] right-[10%] h-0.5 bg-indigo-500" initial={{ width: "0%" }} whileInView={{ width: "80%" }} viewport={{ once: true }} transition={{ duration: 2 }} />
            <div className="relative flex flex-col items-center z-10">
              <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-neutral-900 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white" /></div>
              <span className="text-[7px] text-white mt-1 font-bold">FRONTEND</span>
            </div>
            <div className="relative flex flex-col items-center z-10">
              <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-neutral-900 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white animate-pulse" /></div>
              <span className="text-[7px] text-white mt-1 font-bold">DATABASE</span>
            </div>
            <div className="relative flex flex-col items-center z-10">
              <div className="w-4 h-4 rounded-full bg-neutral-800 border-2 border-neutral-900" />
              <span className="text-[7px] text-white/40 mt-1 font-bold">DEPLOY</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const studentJourneys = [
    {
      step: "01",
      title: "Interactive Learning",
      desc: "Master concepts using our built-in Coding Playground and 24/7 AI Mentor. Write code in the browser and get instant visual feedback.",
      features: ["Coding Playground", "AI Code Explanations", "Real-time Debugging"],
      gradient: "from-emerald-500 to-cyan-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500"
    },
    {
      step: "02",
      title: "Project Development",
      desc: "Transition from theory to practice. Build production-ready systems like Netflix and Uber clones to populate your professional portfolio.",
      features: ["Real-world Clones", "Architecture Design", "Portfolio Building"],
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-500/10",
      text: "text-blue-500"
    },
    {
      step: "03",
      title: "Career Preparation",
      desc: "Leverage your Career Dashboard. Participate in AI-driven mock interviews, build your resume, and track your global placement rank.",
      features: ["Career Dashboard", "Mock Interviews", "Resume Builder"],
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
      text: "text-purple-500"
    },
    {
      step: "04",
      title: "Continuous Growth",
      desc: "Keep your skills sharp by participating in global Hackathons and earning recognized Certificates to prove your expertise.",
      features: ["Global Hackathons", "Certifications", "Community Events"],
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10",
      text: "text-amber-500"
    }
  ];

  const buildProducts = [
    {
      title: "Spotify Clone",
      lessons: 18,
      projs: 2,
      c1: "emerald",
      c2: "green",
      stack: "REACT, NODE, REDUX",
      logo: (
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-.96-.12-1.08-.6-.12-.48.12-.96.6-1.08 4.32-1.32 9.72-.6 13.38 1.62.48.24.66.84.301 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.2-1.26 11.28-1.02 15.721 1.62.539.3.719 1.02.419 1.56-.239.54-.959.72-1.62.36z" /></svg>
          <span className="font-bold tracking-tighter text-base text-emerald-500">Spotify</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-emerald-500/20 bg-black/60 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ animation: 'spin 6s linear infinite' }} className="w-10 h-10 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center relative shadow-lg">
                <div className="absolute inset-1 rounded-full border border-white/5" />
                <div className="absolute inset-2 rounded-full border border-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Cyber Hits 2026</div>
                <div className="text-[10px] text-white/50 truncate">Eduvantix Records</div>
              </div>
            </div>
            {/* Animated Audio Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-6">
              {[1.2, 0.8, 1.5, 0.9, 1.3].map((delay, index) => (
                <div key={index} className="w-0.75 bg-emerald-500 rounded-full" style={{ width: "3px", animation: `animEqualizer ${delay}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] text-white/60">
              <span>01:42</span>
              <span>03:40</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div style={{ animation: 'animProgressSlow 10s ease-in-out infinite' }} className="h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center items-center gap-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60 hover:text-white"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
            <div style={{ animation: 'animScaleHover 2s infinite' }} className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center hover:scale-105 transition-transform">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60 hover:text-white"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
          </div>
        </div>
      )
    },
    {
      title: "Uber Clone",
      lessons: 24,
      projs: 3,
      c1: "neutral",
      c2: "gray",
      stack: "REACT NATIVE, SOCKET.IO",
      logo: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black text-white dark:bg-white dark:text-black rounded flex items-center justify-center text-[11px] font-black">U</div>
          <span className="font-bold tracking-tighter text-base">Uber</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-neutral-500/20 bg-black/60 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">EN ROUTE</span>
            </div>
            <span className="text-[10px] text-white/50">4 min away</span>
          </div>
          {/* Animated route visualization */}
          <div className="relative h-14 flex items-center justify-center z-10 w-full px-4">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute left-6 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white animate-ping" />
            </div>
            {/* The line route */}
            <div className="w-full h-0.5 bg-white/10 relative rounded-full mx-6 overflow-hidden">
              <div style={{ animation: 'animSweepLinear 3s linear infinite' }} className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute" />
            </div>
            {/* Moving taxi SVG along the path */}
            <div style={{ animation: 'animFloatMd 6s ease-in-out infinite', top: "18px" }} className="absolute text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" /></svg>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center absolute right-6">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-black"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2 z-10">
            <div className="text-[10px] text-white/60">PRICE</div>
            <div className="text-xs font-bold text-white">$24.50</div>
          </div>
        </div>
      )
    },
    {
      title: "Netflix Clone",
      lessons: 20,
      projs: 2,
      c1: "red",
      c2: "rose",
      stack: "NEXT.JS, TAILWIND, FIREBASE",
      logo: (
        <div className="flex items-center gap-1">
          <span className="font-black tracking-tighter text-red-600 text-xl">NETFLIX</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-red-500/20 bg-black/60 backdrop-blur-md p-2 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white font-black text-[9px] px-1 py-0.5 rounded shadow-md">EDUVANTIX ORIGINALS</div>
          <div className="w-full h-[95px] rounded-lg overflow-hidden bg-gradient-to-br from-red-950 to-neutral-900 flex items-center justify-center relative">
            <div style={{ animation: 'animPulseOpacity 4s ease-in-out infinite' }} className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-red-500/20" />
            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg z-20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 z-20 flex items-end justify-between">
            <div className="min-w-0 flex-1">
              <h5 className="text-[11px] font-bold text-white truncate">STRANGER CODES</h5>
              <div className="w-full h-1 bg-white/20 rounded-full mt-1.5 overflow-hidden max-w-[100px]">
                <div style={{ animation: 'animProgressSlow 12s linear infinite' }} className="h-full bg-red-600 rounded-full" />
              </div>
            </div>
            <span className="text-[8px] font-bold text-red-500 bg-red-500/10 px-1 py-0.2 rounded border border-red-500/20">TRENDING</span>
          </div>
        </div>
      )
    },
    {
      title: "AI Chatbot",
      lessons: 15,
      projs: 4,
      c1: "blue",
      c2: "indigo",
      stack: "OPENAI, PYTHON, FASTAPI",
      logo: (
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" className="text-blue-500">
            <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1" />
          </svg>
          <span className="font-bold tracking-tighter text-lg text-blue-500">OpenAI</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-blue-500/20 bg-black/60 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-mono text-blue-400">COMPILING_CODE</span>
            </div>
            <span className="text-[8px] font-mono text-white/40">v2.4.0-build</span>
          </div>
          <div className="space-y-2 my-1">
            <div className="flex flex-col bg-white/5 rounded p-1.5 border border-white/5">
              <span className="text-[7px] text-white/40 font-mono">INPUT_QUERY</span>
              <div className="text-[9px] text-white font-sans flex items-center">
                <span>Deploy static components</span>
                <span style={{ animation: 'animBlink 0.8s infinite' }} className="w-1 h-3 bg-white/80 ml-0.5" />
              </div>
            </div>
            <div className="flex flex-col bg-blue-500/10 rounded p-1.5 border border-blue-500/20 relative overflow-hidden">
              <span className="text-[7px] text-blue-400 font-mono">RESPONSE</span>
              <span className="text-[9px] text-blue-300 font-sans truncate">
                <span style={{ animation: 'animPulseOpacity 2s infinite' }}>
                  ⚙️ Active build deploy successful...
                </span>
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Trading Dash",
      lessons: 30,
      projs: 1,
      c1: "amber",
      c2: "orange",
      stack: "WEB SOCKETS, D3.JS, TS",
      logo: (
        <div className="flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <span className="font-bold tracking-tighter text-lg text-amber-500">Trading</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-amber-500/20 bg-black/60 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/60">BTC / USD</span>
            <motion.span
              animate={{ scale: [1, 1.05, 1], backgroundColor: ["rgba(16,185,129,0.1)", "rgba(16,185,129,0.2)", "rgba(16,185,129,0.1)"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20"
            >
              +4.82%
            </motion.span>
          </div>
          {/* Chart with animated svg paths */}
          <div className="h-14 flex items-end justify-between gap-1.5 px-1 relative w-full overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              <path style={{ animation: 'animPathLength 4s ease-in-out infinite', strokeDasharray: 1, strokeDashoffset: 1 }} d="M0,35 Q20,25 40,30 T80,10 T100,5" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <path d="M0,35 Q20,25 40,30 T80,10 T100,5 L100,40 L0,40 Z" fill="url(#amberGradLarge)" opacity="0.1" />
              <defs>
                <linearGradient id="amberGradLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            <div className="w-1.5 h-6 bg-red-500/20 rounded" />
            <div className="w-1.5 h-8 bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-1.5 h-5 bg-red-500/20 rounded" />
            <div className="w-1.5 h-10 bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: "0.4s" }} />
            <div className="w-1.5 h-7 bg-emerald-500/20 rounded" />
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-[10px] text-white/50">Market Index</span>
            <span className="text-xs font-mono font-bold text-white">$67,420.00</span>
          </div>
        </div>
      )
    },
    {
      title: "Airbnb Clone",
      lessons: 22,
      projs: 2,
      c1: "pink",
      c2: "rose",
      stack: "REACT, PRISMA, POSTGRES",
      logo: (
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="text-pink-500">
            <path d="M16 1c-2.007 0-3.612 1.222-4.902 3.197L2.408 17.51a5.617 5.617 0 0 0-.102 6.166c1.316 2.057 3.52 3.324 5.922 3.324.96 0 1.93-.207 2.808-.62a6.974 6.974 0 0 1-.51-2.581c-.55-1.667-.34-3.41.6-5.1.865-1.554 2.115-3.23 3.654-5.023 1.54 1.793 2.79 3.47 3.654 5.023.94 1.69 1.15 3.433.6 5.1a6.974 6.974 0 0 1-.51 2.58c.878.413 1.848.62 2.808.62 2.402 0 4.606-1.267 5.922-3.324a5.617 5.617 0 0 0-.102-6.166L20.902 4.197C19.612 2.222 18.007 1 16 1zm0 2.22c1.233 0 2.378.788 3.454 2.433l8.69 13.314c.783 1.2.628 2.56-.164 3.79-.884 1.38-2.392 2.223-4.04 2.223-.746 0-1.464-.173-2.12-.51a4.912 4.912 0 0 0 .506-2.176c.44-1.333.27-2.73-.507-4.13-.767-1.378-1.92-2.955-3.32-4.587l-.5.58-.5-.58c-1.4 1.632-2.553 3.21-3.32 4.587-.777 1.4-.947 2.797-.507 4.13a4.912 4.912 0 0 0 .506 2.177c-.656.337-1.374.51-2.12.51-1.648 0-3.156-.843-4.04-2.223-.792-1.23-.947-2.59-.164-3.79l8.69-13.314C13.622 4.008 14.767 3.22 16 3.22zm0 4c-1.207 0-2.18.973-2.18 2.18s.973 2.18 2.18 2.18 2.18-.973 2.18-2.18-.973-2.18-2.18-2.18z" />
          </svg>
          <span className="font-bold tracking-tighter text-lg text-pink-500">airbnb</span>
        </div>
      ),
      centerContent: (
        <div className="w-[245px] h-[155px] rounded-xl border border-pink-500/20 bg-black/60 backdrop-blur-md p-2 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-full h-20 rounded-lg overflow-hidden relative border border-white/5">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=60')" }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute top-1.5 right-1.5 z-10 text-[9px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">★ 4.92</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="min-w-0 flex-1">
              <h5 className="text-[10px] font-bold text-white truncate">Futuristic Glass Villa</h5>
              <p className="text-[8.5px] text-white/50 truncate">Kyoto, Japan</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-pink-400">$180</span>
              <span className="text-[7.5px] text-white/40 block">/ night</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  // Auto-play for slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveJourney((prev) => (prev + 1) % studentJourneys.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [studentJourneys.length]);

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
    <>
      <section
        className="relative w-full py-32"
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

        <TickerStrip tok={tok} />

        <div className="editorial-line  mb-40" />

        {/* 3. Learning Journey Timeline */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40 relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">Choose Your Journey.</h3>
            <p className="text-lg opacity-50 max-w-2xl mx-auto">A structured roadmap utilizing our core platform features to guarantee your success.</p>
          </div>

          {/* Premium Slider Container */}
          <div className="relative w-full max-w-5xl mx-auto rounded-[2.5rem] border overflow-hidden"
            style={{
              background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)",
              borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              boxShadow: dark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)",
              backdropFilter: "blur(20px)"
            }}
          >
            {/* Progress / Tabs */}
            <div className="flex border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              {studentJourneys.map((journey, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveJourney(idx)}
                  className={`flex-1 py-5 px-2 text-center transition-all duration-300 relative ${activeJourney === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <span className="text-xs font-bold tracking-widest uppercase hidden md:inline-block mr-2">Phase</span>
                  <span className="text-xs font-bold tracking-widest uppercase">{journey.step}</span>
                  {activeJourney === idx && (
                    <motion.div
                      layoutId="activeJourneyTab"
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${journey.gradient}`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Slide Content */}
            <div className="relative h-[550px] md:h-[450px] flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJourney}
                  initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12"
                >
                  <div className="flex-1 flex flex-col justify-center h-full z-10 relative">
                    <div className={`self-start px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 ${studentJourneys[activeJourney].bg} ${studentJourneys[activeJourney].text}`}>
                      Phase {studentJourneys[activeJourney].step}
                    </div>
                    <h4 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                      {studentJourneys[activeJourney].title}
                    </h4>
                    <p className="text-base md:text-lg opacity-60 leading-relaxed mb-8">
                      {studentJourneys[activeJourney].desc}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-auto md:mt-4">
                      {studentJourneys[activeJourney].features.map((feature, fIdx) => (
                        <span key={fIdx} className="px-4 py-2 rounded-xl text-sm font-medium border"
                          style={{
                            borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                            background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Representation (Abstract) */}
                  <div className="hidden md:flex flex-1 justify-center items-center relative w-full h-full">
                    {/* Cool background shapes that match the gradient */}
                    <div className={`absolute w-72 h-72 rounded-full bg-gradient-to-br ${studentJourneys[activeJourney].gradient} opacity-20 blur-3xl animate-pulse`} style={{ animationDuration: '4s' }} />

                    {/* Render some mock UI or icon based on phase */}
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                      className="relative z-10 w-56 h-56 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
                      style={{
                        background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      <div className={`text-8xl text-transparent bg-clip-text bg-gradient-to-br ${studentJourneys[activeJourney].gradient} font-bold opacity-80`}>
                        {studentJourneys[activeJourney].step}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div >
        </div >

        <div className="editorial-line  mb-40" />

        {/* 4. Build Real Products (Valorant-Style Flip Cards) */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40 relative z-10">


          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">Build Real Products.</h3>
            <p className="text-lg opacity-50 max-w-2xl mx-auto">Don't just watch tutorials. Build the exact systems used by top tech companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildProducts.map((prod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flip-card w-full h-[500px]"
              >
                <div className="flip-card-inner w-full h-full relative rounded-2xl shadow-2xl">

                  {/* FRONT */}
                  <div
                    className="backface-hidden absolute inset-0 w-full h-full rounded-2xl border overflow-hidden flex flex-col justify-end p-8"
                    style={{
                      background: dark ? "#0f1115" : "#f8fafc",
                      borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                      boxShadow: dark ? "inset 0 0 100px rgba(0,0,0,0.5)" : "inset 0 0 100px rgba(0,0,0,0.02)",
                      color: dark ? "#ffffff" : "#111111"
                    }}
                  >
                    {/* Top-left Company Logo */}
                    <div className="absolute top-6 left-6 z-20">
                      {prod.logo}
                    </div>

                    {/* Glowing orb background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                      <div className={`w-56 h-56 rounded-full bg-gradient-to-br from-${prod.c1}-500 to-${prod.c2}-500 blur-3xl`} />
                    </div>

                    {/* Center Mockup Element */}
                    <div className="absolute inset-0 flex items-center justify-center z-10" style={{ top: '-40px' }}>
                      {prod.centerContent}
                    </div>

                    <div className="relative z-10">
                      <h4 className="text-4xl font-black tracking-tight uppercase leading-none">{prod.title}</h4>
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="backface-hidden absolute inset-0 w-full h-full rounded-2xl border p-8 flex flex-col"
                    style={{
                      transform: "rotateY(180deg)",
                      background: dark ? "#1a1d24" : "#ffffff",
                      borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                      color: dark ? "#ffffff" : "#111111"
                    }}
                  >
                    <div className="font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-2">
                      PROJECT <span className={`text-${prod.c1}-500`}>|</span> {prod.title}
                    </div>

                    <div className="mb-8">
                      <div className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-2 font-mono">// TECH STACK</div>
                      <div className="font-bold tracking-wide text-xl uppercase">{prod.stack}</div>
                    </div>

                    <div className="mb-auto">
                      <div className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 font-mono">// BIOGRAPHY</div>
                      <p className="opacity-70 text-sm leading-relaxed">
                        A phantom of the codebase, the {prod.title} architecture scales in the cloud. Render latency blind, deploy across global regions, then let flawless performance take hold as competitors scramble to learn where you might ship next.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl border flex flex-col items-start justify-center" style={{ borderColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", background: dark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)" }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1">Lessons</span>
                        <span className={`text-3xl font-black text-${prod.c1}-500`}>{prod.lessons}</span>
                      </div>
                      <div className="p-4 rounded-xl border flex flex-col items-start justify-center" style={{ borderColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", background: dark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)" }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1">Projects</span>
                        <span className={`text-3xl font-black text-${prod.c1}-500`}>{prod.projs}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="editorial-line" />
      </section >

      {/* 5. Platform Features — Scroll-Linked Horizontal Carousel */}

      {/* Desktop: sticky scroll — section pins, cards slide left, then page scroll continues */}
      <section
        ref={featuresRef}
        aria-label="Platform Features carousel"
        className="hidden md:block relative w-full"
        style={{
          height: scrollDist > 0 && viewportHeight > 0
            ? scrollDist + viewportHeight
            : "100vh",
        }}
      >
        <div
          className="sticky top-16 h-screen w-full flex flex-col justify-center overflow-hidden z-20"
          style={{
            background: dark ? "#000000" : "#f8fafc",
          }}
        >
          {/* Heading */}
          <div className="px-12 w-full mb-8 relative z-10 text-center">
            <h3 className="text-6xl md:text-7xl font-bold tracking-tighter">Platform Features.</h3>
            <p className="text-lg opacity-50 max-w-2xl mx-auto">Perfect for modern developers aiming higher.</p>
          </div>

          {/* Horizontal sliding track */}
          <div className="w-full overflow-hidden">
            <motion.div
              ref={carouselRef}
              style={{ x }}
              className="flex gap-6 pl-12 pr-32 w-max py-10"
            >
              {featuresList.map((feat, index) => (
                <div
                  key={index}
                  className="w-[440px] h-[370px] shrink-0 p-10 rounded-[2.5rem] border relative overflow-hidden flex flex-col justify-between group shadow-2xl"
                  style={{
                    background: dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,1)",
                    borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
                  }}
                >
                  <div>
                    <h4 className="text-[1.35rem] font-bold mb-3 tracking-tight leading-snug">{feat.title}</h4>
                    <p className="text-sm leading-relaxed max-w-[260px]" style={{ opacity: 0.55 }}>{feat.desc}</p>
                  </div>
                  {feat.visual}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile: horizontally swipeable cards */}
      < section
        className="block md:hidden mb-32 relative z-10 py-8"
        style={{
          background: dark ? "#000000" : "#f8fafc",
          color: dark ? "#ffffff" : "#020617",
        }
        }
      >
        <div className="px-5 sm:px-6 mb-8">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter">Platform Features.</h3>
        </div>
        <div
          ref={mobileCarouselRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 px-5 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuresList.map((feat, index) => (
            <div
              key={index}
              data-feature-card
              className="w-[85vw] sm:w-[78vw] max-w-[340px] min-h-[360px] shrink-0 snap-center rounded-[2rem] border relative overflow-hidden flex flex-col shadow-xl"
              style={{
                background: dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,1)",
                borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
              }}
            >
              <div className="p-5 sm:p-6 pb-3">
                <span className={`text-[9px] font-bold tracking-[0.2em] uppercase mb-2 block text-${feat.c}-500`}>// {feat.label}</span>
                <h4 className="text-base sm:text-lg font-bold mb-2 tracking-tight leading-tight">{feat.title}</h4>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ opacity: 0.55 }}>{feat.desc}</p>
              </div>
              <div className="relative flex-1 min-h-[150px] sm:min-h-[160px] w-full overflow-hidden">
                {feat.visual}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4 px-5">
          {featuresList.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeFeature === i ? "1.25rem" : "0.375rem",
                background: activeFeature === i
                  ? "#10b981"
                  : dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)"
              }}
            />
          ))}
        </div>
      </section >
      <div className=" mb-40" />


      <section
        className="relative w-full pb-32"
        style={{
          background: dark ? "#000000" : "#f8fafc",
          color: dark ? "#ffffff" : "#020617",
          transition: "background 0.4s ease"
        }}
      >

        {/* 6. Companies Students Can Reach */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center pb-32">
          <h3 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Built to prepare you for<br />
            <span className="text-emerald-500">world-class engineering teams.</span>
          </h3>
          {/* Infinite scroll company ticker */}
          <InfiniteCompanyTicker companies={companies} dark={dark} />
        </div>
      </section>
    </>
  );
}
