"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  motion, useInView, useScroll, useTransform,
  useMotionValue, useSpring, useMotionTemplate,
  AnimatePresence, useAnimationControls
} from "framer-motion";
import {
  ShieldAlert, Users, Layers, Brain,
  ArrowRight, CheckCircle2, Building2,
  BarChart2, GraduationCap, Image as ImageIcon,
  Zap, ArrowDown, Mic, X, Calendar
} from "lucide-react";
import { getApiBase } from "@/utils/api";
import Lenis from "lenis";
import useThemeStore from "@/store/useThemeStore";
import FeatureScrollStack from "@/components/FeatureScrollStack";
import useReducedMotion from "@/customHooks/useReducedMotion";
import TiltCard from "@/components/TitleCard";
import { EASE_OUT_EXPO, SPRING_CONFIG, SPRING_SNAPPY } from "@/utils/constants";

// ─── Lenis Smooth Scroll ──────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Mouse Position Hook ──────────────────────────────────────────────
function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const handler = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);
  return { x, y };
}

// ─── Cursor Follow Glow ──────────────────────────────────────────────
function CursorGlow() {
  const { x, y } = useMousePosition();
  const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[1] opacity-[0.04]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)",
      }}
    />
  );
}

// ─── Noise Texture Overlay ────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// ─── Animated Mesh Background ─────────────────────────────────────────
function MeshBackground({ className = "" }) {
  const reduced = useReducedMotion();
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          top: "-15%", right: "-10%",
          filter: "blur(80px)",
        }}
        animate={reduced ? {} : {
          x: [0, -40, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          bottom: "-10%", left: "-8%",
          filter: "blur(80px)",
        }}
        animate={reduced ? {} : {
          x: [0, 30, -25, 0],
          y: [0, -35, 15, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
          top: "50%", left: "50%",
          filter: "blur(60px)",
        }}
        animate={reduced ? {} : {
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────
function FloatingParticles({ count = 12 }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dur: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
    }));
  }, [count, mounted]);

  if (reduced || !mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-500"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() > 0.5 ? 30 : -30, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Scroll Progress Indicator ────────────────────────────────────────
function ScrollProgress() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #10b981, #06b6d4)" }}
    />
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────
function MagneticButton({ children, className = "", style = {}, href, onClick, type, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_SNAPPY);
  const springY = useSpring(y, SPRING_SNAPPY);
  const reduced = useReducedMotion();

  const handleMouse = useCallback((e) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  }, [x, y, reduced]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Tag = href ? motion.a : motion.button;
  return (
    <Tag
      ref={ref}
      href={href}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </Tag>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────
function AnimatedCounter({ value, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  // Extract digits for animating, and non-digit characters for the suffix
  const numericPart = value.toString().match(/\d+/)?.[0] || "";
  const suffix = value.toString().replace(numericPart, "");
  const isNumber = numericPart !== "";

  useEffect(() => {
    if (isInView && isNumber) {
      const target = parseInt(numericPart);
      const duration = 1500;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, numericPart, isNumber]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: "blur(8px)" }}
        animate={isInView ? { scale: 1, opacity: 1, filter: "blur(0px)" } : {}}
        transition={{ type: "spring", ...SPRING_CONFIG, delay: 0.2 }}
        className="text-3xl md:text-4xl font-black text-emerald-500"
      >
        {isNumber ? count + suffix : value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_EXPO }}
        className="text-[11px] font-bold uppercase tracking-wider mt-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </motion.div>
    </div>
  );
}

// ─── Page Reveal ──────────────────────────────────────────────────────
function PageReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Divider with animated gradient line ──────────────────────
function SectionDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: "1px" }}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(6,182,212,0.3), transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "var(--border-primary)" }} />
    </div>
  );
}

// ─── Hero Right Graphic ───────────────────────────────────────────────
function HeroRightGraphic() {
  const reduced = useReducedMotion();
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto pointer-events-none select-none">
      {/* Background glowing orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.1) 70%, transparent 100%)" }}
        animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Card 1: Live Class */}
      <motion.div
        className="absolute top-[0%] right-[0%] w-[65%] bg-[#101014] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl z-20"
        animate={reduced ? {} : { y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-[10px] font-bold text-white tracking-wider">LIVE: SYSTEM DESIGN</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">1.2k joined</span>
        </div>
        <div className="w-full h-32 bg-[#1A1A1A] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
           {/* System Design Diagram Representation */}
           <div className="flex flex-col items-center gap-2 -mt-4">
              <div className="w-16 h-5 border border-blue-500/50 bg-blue-500/20 rounded text-[6px] flex items-center justify-center text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]">Load Balancer</div>
              <div className="w-0.5 h-3 bg-slate-600" />
              <div className="flex gap-6 relative">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[3.2rem] h-0.5 bg-slate-600" />
                 <div className="w-0.5 h-3 bg-slate-600 absolute -top-3 left-3" />
                 <div className="w-0.5 h-3 bg-slate-600 absolute -top-3 right-3" />
                 
                 <div className="w-10 h-10 border border-emerald-500/50 bg-emerald-500/20 rounded flex flex-col items-center justify-center text-[5px] text-emerald-200 gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                   <Layers size={10} />
                   Node 1
                 </div>
                 <div className="w-10 h-10 border border-emerald-500/50 bg-emerald-500/20 rounded flex flex-col items-center justify-center text-[5px] text-emerald-200 gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                   <Layers size={10} />
                   Node 2
                 </div>
              </div>
           </div>
           {/* Mentor Video Feed */}
           <div className="absolute bottom-2 left-2 w-10 h-12 bg-black rounded border border-white/20 overflow-hidden shadow-lg">
              <img src="/images/indian_educator.png" alt="mentor" className="w-full h-full object-cover opacity-80" />
           </div>
           <div className="absolute bottom-2 right-2 flex gap-1 z-10">
             <div className="w-6 h-6 rounded bg-black/60 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Mic size={8} className="text-emerald-400" />
             </div>
             <div className="w-6 h-6 rounded bg-black/60 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Users size={8} className="text-slate-300" />
             </div>
           </div>
        </div>
      </motion.div>

      {/* Floating Card 2: Institution Management */}
      <motion.div
        className="absolute top-[35%] left-[-5%] w-[50%] bg-[#050505] border border-blue-500/30 rounded-xl p-4 shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-xl z-10"
        animate={reduced ? {} : { y: [12, -12, 12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Building2 size={12} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-200">Campus Overview</span>
          </div>
        </div>
        <div className="space-y-3 mt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] text-slate-400">Total Students</span>
              <span className="text-[9px] text-white font-mono">1,432</span>
            </div>
            <div className="h-1 bg-white/10 rounded w-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] text-slate-400">Active Courses</span>
              <span className="text-[9px] text-white font-mono">24</span>
            </div>
            <div className="h-1 bg-white/10 rounded w-full overflow-hidden">
              <div className="h-full bg-indigo-400 w-1/2 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 3: Attendance */}
      <motion.div
        className="absolute top-[50%] right-[-5%] w-[40%] bg-[#0A0A0A] border border-amber-500/30 rounded-xl p-3 shadow-[0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-xl z-0"
        animate={reduced ? {} : { y: [-15, 15, -15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Calendar size={10} className="text-amber-400" />
          </div>
          <span className="text-[8px] font-bold text-slate-200">Attendance</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-2">
           {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
             <div key={i} className={`w-4 h-4 rounded-sm flex items-center justify-center ${i === 8 ? 'bg-rose-500/20 border border-rose-500/30' : i === 9 ? 'bg-white/5 border border-white/10' : 'bg-emerald-500/20 border border-emerald-500/30'}`}>
               {i < 8 && <CheckCircle2 size={8} className="text-emerald-400" />}
               {i === 8 && <X size={8} className="text-rose-400" />}
             </div>
           ))}
        </div>
      </motion.div>

      {/* Floating Card 4: Anti-Cheat Exam */}
      <motion.div
        className="absolute bottom-[10%] left-[-2%] w-[55%] bg-[#0A0A0A] border border-rose-500/30 rounded-xl p-3 shadow-[0_0_30px_rgba(244,63,94,0.15)] backdrop-blur-xl z-30"
        animate={reduced ? {} : { y: [10, -10, 10] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert size={10} className="text-rose-400" />
            </div>
            <span className="text-[9px] font-bold text-white">Proctored Exam</span>
          </div>
          <div className="flex gap-1 items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[7px] text-emerald-400">Secure</span>
          </div>
        </div>
        <div className="bg-white/5 rounded border border-white/5 p-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded overflow-hidden relative border border-white/10 shrink-0">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="student" className="w-full h-full object-cover opacity-60 grayscale" />
             {/* Face tracking box overlay */}
             <div className="absolute inset-1.5 border border-emerald-500/70 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-emerald-500"></div>
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-emerald-500"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-emerald-500"></div>
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-emerald-500"></div>
             </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-slate-300">Identity Verified</span>
              <CheckCircle2 size={8} className="text-emerald-400" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-slate-300">Tab Focus</span>
              <CheckCircle2 size={8} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 5: AI Viva Analysis */}
      <motion.div
        className="absolute bottom-[2%] right-[5%] w-[45%] bg-[#101014] border border-purple-500/30 rounded-xl p-3 shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-xl z-20"
        animate={reduced ? {} : { y: [-8, 8, -8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Brain size={10} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="text-[8px] text-white font-bold tracking-wide">AI Viva Analysis</div>
            <div className="text-[7px] text-emerald-400 mt-0.5 font-medium">98% Accuracy Match</div>
          </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
            initial={{ width: "0%" }}
            animate={{ width: "98%" }}
            transition={{ duration: 2, delay: 0.5, ease: EASE_OUT_EXPO }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────
export default function InstitutesPage() {
  const isDark = useThemeStore((state) => state.isDark);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState(null);
  const reduced = useReducedMotion();

  useLenis();

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);
  const heroBlur = useTransform(heroProgress, [0, 0.8], [0, 8]);
  const smoothHeroY = useSpring(heroY, SPRING_CONFIG);
  const smoothHeroBlur = useSpring(heroBlur, SPRING_CONFIG);
  const heroFilter = useMotionTemplate`blur(${smoothHeroBlur}px)`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/auth/request-institute-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  };

  // ─── Stagger children helper ──────────────────────────────────────
  const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
  };

  return (
    <PageReveal>
      <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
        <ScrollProgress />
        <CursorGlow />
        <NoiseOverlay />
        <Navbar />

        <main className="flex-grow">

          {/* ─── HERO SECTION ──────────────────────────────────── */}
          <section ref={heroRef} className="relative w-full pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
            {/* Full width absolute background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <MeshBackground />
              <FloatingParticles count={15} />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 max-w-7xl mx-auto px-6 md:px-12">
              {/* Left Content */}
              <motion.div
                className="w-full lg:w-[55%] text-left space-y-8"
                style={{
                  y: reduced ? 0 : smoothHeroY,
                  opacity: reduced ? 1 : heroOpacity,
                  scale: reduced ? 1 : heroScale,
                  filter: reduced ? "none" : heroFilter,
                }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-2"
                    style={{ borderColor: "var(--border-accent)", backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}
                    animate={reduced ? {} : {
                      boxShadow: [
                        "0 0 0px rgba(16,185,129,0)",
                        "0 0 25px rgba(16,185,129,0.12)",
                        "0 0 0px rgba(16,185,129,0)",
                      ],
                    }}
                    transition={{ boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                  >
                    <Building2 size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500">Eduvantix for Campus</span>
                  </motion.div>
                </motion.div>

                {/* Main headline — kinetic typography with clip-path reveal */}
                <div className="overflow-hidden">
                    <motion.h1
                      className="inline-block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent text-6xl md:text-7xl font-bold tracking-tighter"
                      initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(12px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.8, duration: 1, ease: EASE_OUT_EXPO }}
                    >
                      One Powerful Platform for Every Institute
                    </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT_EXPO }}
                  className="text-lg md:text-xl max-w-2xl leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Manage students, run live classes, conduct AI-powered vivas, and host coding tests — all from a single, intelligent admin portal built for modern institutions.
                </motion.p>

                {/* CTAs with magnetic effect */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3, ease: EASE_OUT_EXPO }}
                  className="flex flex-wrap items-center gap-4 pt-4"
                >
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow duration-500"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                  >
                    Get Started <ArrowRight size={18} />
                  </a>
                  <a
                    href="#features"
                    className="px-8 py-4 rounded-xl font-bold border flex items-center gap-2 hover:border-emerald-500/40 transition-colors duration-500"
                    style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                  >
                    Explore Features
                  </a>
                </motion.div>
           
              </motion.div>

              {/* Right Content */}
              <motion.div
                className="w-full lg:w-[45%] hidden md:block"
                initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5, ease: EASE_OUT_EXPO }}
              >
                <HeroRightGraphic />
              </motion.div>
            </div>
          </section>
     


          {/* ─── FEATURE SHOWCASES (Scroll-Stack) ─────────────────── */}
          <section id="features" className="px-6 py-12 sm:px-12 sm:py-20 lg:px-28 lg:py-28">
            <FeatureScrollStack />
          </section>
     


          {/* ─── MORE FEATURES GRID ────────────────────────────── */}
          <section className="py-20">
            <SectionDivider />
            <div className="mx-auto max-w-7xl px-6 md:px-12 pt-20">
              {(() => {
                const ref = useRef(null);
                const isInView = useInView(ref, { once: true, margin: "-80px" });
                return (
                  <div ref={ref}>
                    <motion.div
                      className="text-center max-w-3xl mx-auto mb-14 space-y-4"
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      variants={stagger}
                    >
                      <motion.div variants={fadeUp}>
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
                          style={{ borderColor: "var(--border-accent)", backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                        >
                          <Zap size={14} className="text-emerald-500" />
                          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500">More Features</span>
                        </div>
                      </motion.div>
                      <motion.h2
                        variants={fadeUp}
                        className="text-3xl md:text-4xl font-black tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        And so much more...
                      </motion.h2>
                      <motion.p
                        variants={fadeUp}
                        className="text-lg"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Everything your institution needs to deliver world-class technical education.
                      </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        { icon: <Users size={22} className="text-emerald-500" />, title: "Mentor Portal", desc: "Dedicated dashboard for instructors to manage submissions, guide students, and track engagement." },
                        { icon: <Layers size={22} className="text-emerald-500" />, title: "Batch Manager", desc: "Organize students into cohorts, assign tracks, and monitor batch-wise progress effortlessly." },
                        { icon: <BarChart2 size={22} className="text-emerald-500" />, title: "Analytics & Reports", desc: "Comprehensive dashboards with real-time insights into student performance and campus metrics." },
                        { icon: <GraduationCap size={22} className="text-emerald-500" />, title: "Study Materials", desc: "Centralized distribution of curriculum, notes, and references directly to specific batches." },
                        { icon: <Calendar size={22} className="text-emerald-500" />, title: "Attendance Tracking", desc: "Track and monitor student attendance seamlessly across all live sessions, contests, and assignments." },
                        { icon: <ShieldAlert size={22} className="text-emerald-500" />, title: "Role-Based Access", desc: "Granular control over permissions for admins, mentors, and students with secure authentication." },
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9, filter: "blur(6px)" }}
                          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                          transition={{ delay: 0.15 * i, duration: 0.8, ease: EASE_OUT_EXPO }}
                        >
                          <TiltCard
                            className="p-6 rounded-2xl border group h-full cursor-default"
                            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
                          >
                            <motion.div
                              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20"
                              whileHover={{ rotate: 8, scale: 1.15 }}
                              transition={{ type: "spring", ...SPRING_SNAPPY }}
                            >
                              {feature.icon}
                            </motion.div>
                            <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
                          </TiltCard>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          <section>
            
            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: EASE_OUT_EXPO }}
              className="relative z-10 my-16 max-w-3xl mx-auto"
            >
              <TiltCard
                className="rounded-2xl"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
              >
                <div
                  className="grid grid-cols-3 gap-6 p-8 rounded-2xl border backdrop-blur-sm"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
                >
                  <AnimatedCounter value="100%" label="Integrated Platform" />
                  <AnimatedCounter value="AI" label="Powered Assessments" />
                  <AnimatedCounter value="Live" label="HD Streaming" />
                </div>
              </TiltCard>
            </motion.div>
          </section>


          {/* ─── CONTACT / CTA SECTION ─────────────────────────── */}
          <section id="contact" className="pb-20 md:pb-28 relative overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <SectionDivider />
            <MeshBackground />
            <FloatingParticles count={6} />
            <div className="mx-auto max-w-5xl px-6 md:px-12 relative z-10 pt-20 md:pt-28">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {(() => {
                  const contactRef = useRef(null);
                  const contactInView = useInView(contactRef, { once: true, margin: "-80px" });
                  return (
                    <>
                      <div ref={contactRef} className="lg:col-span-2 space-y-6">
                        <motion.div
                          className="space-y-6"
                          initial={reduced ? { opacity: 0 } : { opacity: 0, x: -60, filter: "blur(8px)" }}
                          animate={contactInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                        >
                          <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 flex-wrap" style={{ color: "var(--text-primary)" }}>
                            Partner with 
                            <img src={isDark ? "/logo-white-text.webp" : "/logo-black-text.webp"} alt="Eduvantix" className="h-8 md:h-10 inline-block mt-0.5" />
                          </h2>
                          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Reach out to us to get an Institute Admin account provisioned for your university. Start adding mentors, batch managers, and students to your dedicated portal immediately.
                          </p>
                          <div className="space-y-4 pt-4">
                            {[
                              "Custom campus onboarding",
                              "Dedicated support manager",
                              "Bulk student provisioning",
                              "Customized tracking & analytics"
                            ].map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -25, filter: "blur(4px)" }}
                                animate={contactInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                                transition={{ delay: 0.3 + 0.1 * idx, duration: 0.6, ease: EASE_OUT_EXPO }}
                                className="flex items-center gap-3"
                              >
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={contactInView ? { scale: 1, rotate: 0 } : {}}
                                  transition={{ delay: 0.4 + 0.1 * idx, type: "spring", ...SPRING_SNAPPY }}
                                >
                                  <CheckCircle2 size={18} className="text-emerald-500" />
                                </motion.div>
                                <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      <div className="lg:col-span-3">
                        <motion.div
                          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.95, filter: "blur(8px)" }}
                          animate={contactInView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : {}}
                          transition={{ duration: 1, delay: 0.15, ease: EASE_OUT_EXPO }}
                        >
                          <TiltCard
                            className="rounded-2xl border p-6 md:p-8 shadow-xl"
                            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
                          >
                            {formStatus === "success" ? (
                              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", ...SPRING_CONFIG }}
                                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2"
                                >
                                  <CheckCircle2 size={32} />
                                </motion.div>
                                <motion.h3
                                  initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                  transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT_EXPO }}
                                  className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}
                                >
                                  Request Received!
                                </motion.h3>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Our university relations team will reach out to you shortly to set up your Institute Admin account.
                                </motion.p>
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.7 }}
                                  onClick={() => setFormStatus(null)}
                                  className="mt-4 text-emerald-500 font-bold hover:underline"
                                >
                                  Submit another request
                                </motion.button>
                              </div>
                            ) : (
                              <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-300 border-[var(--border-primary)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                                      style={{ color: "var(--text-primary)" }} placeholder="Jane Doe" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">University / Institute</label>
                                    <input required type="text" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-300 border-[var(--border-primary)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                                      style={{ color: "var(--text-primary)" }} placeholder="Global Tech University" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Work Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-300 border-[var(--border-primary)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                                      style={{ color: "var(--text-primary)" }} placeholder="jane@university.edu" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-300 border-[var(--border-primary)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                                      style={{ color: "var(--text-primary)" }} placeholder="+1 (555) 000-0000" />
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Message (Optional)</label>
                                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-300 resize-none border-[var(--border-primary)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                                    rows={4} style={{ color: "var(--text-primary)" }} placeholder="Tell us about your campus size and specific requirements..." />
                                </div>

                                <MagneticButton
                                  type="submit"
                                  disabled={formStatus === "submitting"}
                                  className="w-full py-4 rounded-xl font-bold text-white disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow duration-500"
                                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                                >
                                  {formStatus === "submitting" ? (
                                    <span className="flex items-center justify-center gap-2">
                                      <motion.span
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                      />
                                      Submitting Request...
                                    </span>
                                  ) : "Request Institute Access"}
                                </MagneticButton>

                                {formStatus === "error" && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-rose-500 text-center font-semibold mt-2"
                                  >
                                    Failed to submit request. Please verify your connection or try again.
                                  </motion.p>
                                )}
                              </form>
                            )}
                          </TiltCard>
                        </motion.div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageReveal>
  );
}
