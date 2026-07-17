"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate, useMotionTemplate, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingObjects from "./FloatingObjects";
import CodeWindow from "./CodeWindow";
import { getThemeTokens } from "@/utils/themeTokens";
import useTheme from "@/customHooks/useTheme";

/* ─── Premium easing tokens ───────────────────────────── */
const ease = {
  out: [0.16, 1, 0.3, 1],
  soft: [0.25, 0.46, 0.45, 0.94],
};

/* ─── Main Hero ──────────────────────────────────────── */
export default function Hero() {
  const dark = useTheme();
  const tok = getThemeTokens(dark);

  const containerRef = useRef(null);
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 22 });
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 22 });
  const [mxVal, setMxVal] = useState(0.5);
  const [myVal, setMyVal] = useState(0.5);
  const [mounted, setMounted] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Aurora Colors
  const color1 = useMotionValue("#62ffdc");
  const color2 = useMotionValue("#96fff0");
  const color3 = useMotionValue("#4ade80");

  useEffect(() => {
    setMounted(true);
    const u1 = mouseX.on("change", setMxVal);
    const u2 = mouseY.on("change", setMyVal);

    // Animate Aurora Colors Slowly
    animate(color1, ["#62ffdc", "#4ade80", "#62ffdc"], { ease: "linear", duration: 30, repeat: Infinity });
    animate(color2, ["#96fff0", "#3b82f6", "#96fff0"], { ease: "linear", duration: 40, repeat: Infinity });
    animate(color3, ["#4ade80", "#a855f7", "#4ade80"], { ease: "linear", duration: 35, repeat: Infinity });

    return () => { u1(); u2(); };
  }, [mouseX, mouseY, color1, color2, color3]);

  const auroraBackground = useMotionTemplate`
    radial-gradient(circle at 20% 10%, ${color1} 0%, transparent 35%),
    radial-gradient(circle at 80% 20%, ${color2} 0%, transparent 40%),
    radial-gradient(circle at 50% 100%, ${color3} 0%, transparent 45%),
    linear-gradient(180deg, ${dark ? '#000000' : '#ffffff'}, ${dark ? '#050505' : '#f7f8fa'})
  `;

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  }, [rawX, rawY]);

  const headlines = [
    [
      { words: ["Code", "Better."], accents: [false, true] },
      { words: ["Think", "Bigger."], accents: [false, true] },
    ],
    [
      { words: ["Learn", "Code."], accents: [false, true] },
      { words: ["Build", "AI."], accents: [false, true] },
    ],
    [
      { words: ["From", "Ideas."], accents: [false, true] },
      { words: ["To", "Reality."], accents: [false, true] },
    ],
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "85svh",
        background: dark ? "#000000" : "#ffffff",
        transition: "background 0.4s ease",
      }}
    >

      {/* Animated Aurora Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: auroraBackground,
          opacity: dark ? 0.15 : 0.25,
          mixBlendMode: dark ? "screen" : "multiply",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />

      {/* Huge blurred background logo */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          style={{
            fontSize: "800px",
            fontWeight: 900,
            color: dark ? "#ffffff" : "#000000",
            opacity: 0.02,
            filter: "blur(120px)",
            userSelect: "none"
          }}
        >
          E
        </span>
      </div>

      {/* 3D Floating Objects */}
      {mounted && <FloatingObjects />}

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 min-h-[100vh] flex flex-col justify-center pointer-events-none">
        <div className="pt-32 pb-12 pointer-events-auto">

          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: ease.out }}
            className="flex items-center gap-3 mb-10"
          >
            <div style={{ width: 28, height: 1, background: tok.accentFaint }} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: tok.accent }}>
              BUILDING THE NEXT GENERATION OF DEVELOPERS
            </span>
          </motion.div>

          {/* Headline + description grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-10 items-center min-h-[400px]">

            {/* LEFT: editorial headline */}
            <div className="relative h-[250px] lg:h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                  }}
                >
                  {headlines[headlineIndex].map((line, li) => (
                    <div key={li} style={{ overflow: "hidden" }}>
                      <motion.div className="flex items-baseline gap-4 md:gap-6">
                        {line.words.map((word, wi) => (
                          <motion.span
                            key={wi}
                            style={{
                              display: "block",
                              fontFamily: "var(--font-sans)",
                              fontSize: "clamp(3.8rem, 8.5vw, 8rem)",
                              fontWeight: line.accents[wi] ? 400 : 700,
                              letterSpacing: line.accents[wi] ? "-0.02em" : "-0.05em",
                              lineHeight: 1.2,
                              fontStyle: line.accents[wi] ? "italic" : "normal",
                              color: line.accents[wi] ? "transparent" : tok.textPrimary,
                              WebkitTextStroke: line.accents[wi]
                                ? `1px ${dark ? "rgba(16,185,129,0.8)" : "rgba(5,150,105,0.8)"}`
                                : "none",
                            }}
                            variants={{
                              hidden: { y: 90, opacity: 0, filter: "blur(8px)", skewY: 2.5 },
                              visible: { y: 0, opacity: 1, filter: "blur(0px)", skewY: 0, transition: { duration: 0.4, ease: ease.out } },
                              exit: { y: -50, opacity: 0, filter: "blur(8px)", transition: { duration: 0.4, ease: "easeIn" } }
                            }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Code window */}
            <div className="w-full relative">
              <CodeWindow dark={dark} onStateChange={setHeadlineIndex} />

              {/* Optional ambient glow behind code window */}
              <div
                className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"
                style={{ transform: "translateZ(-10px)" }}
              />
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.62, duration: 0.8, ease: ease.out }}
            style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${tok.divider}, transparent)`,
              marginTop: 44,
              marginBottom: 44,
              transformOrigin: "center"
            }}
          />

          {/* Bottom row */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.72, duration: 0.8, ease: ease.out }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
          >
            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5">
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.3, ease: ease.soft }}
                className="hover:shadow-xl hover:shadow-emerald-500/20 rounded-full"
              >
                <Link
                  href="/courses/generative-ai"
                  className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold"
                  style={{
                    background: tok.ctaPrimary.bg,
                    border: `1px solid ${tok.ctaPrimary.border}`,
                    color: tok.ctaPrimary.text,
                    backdropFilter: "blur(12px)",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = tok.ctaPrimary.bgHover;
                    e.currentTarget.style.borderColor = tok.ctaPrimary.borderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = tok.ctaPrimary.bg;
                    e.currentTarget.style.borderColor = tok.ctaPrimary.border;
                  }}
                >
                  <span>Get Started</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.3, ease: ease.soft }}
                className="hover:shadow-xl hover:shadow-black/5 rounded-full"
              >
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
                  style={{
                    color: tok.ctaSecondary.color,
                    border: `1px solid ${tok.divider}`,
                    backgroundColor: "transparent",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tok.ctaSecondary.colorHover;
                    e.currentTarget.style.borderColor = tok.accentFaint;
                    e.currentTarget.style.backgroundColor = tok.statBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = tok.ctaSecondary.color;
                    e.currentTarget.style.borderColor = tok.divider;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Browse Courses
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT: description removed as it's now under the headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55, ease: ease.out }}
              className="lg:flex lg:flex-col lg:items-end lg:justify-end lg:pb-2"
            >
              <div className="max-w-[290px] lg:text-right">
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: tok.accent }}>
                  ENGINEERED FOR INNOVATORS
                </p>
                <p className="text-sm leading-[1.75]" style={{ color: tok.textSecondary }}>
                  We don't just teach technology — we help you build products, solve real-world problems, and launch a career you'll be proud of.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
