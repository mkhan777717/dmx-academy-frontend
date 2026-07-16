"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Marcus Vance",
    role: "Senior Creative Developer",
    company: "Vercel",
    initials: "MV",
    companyColor: "#000000",
    quote: "Eduvantix completely changed how I approach learning. The interactive sandboxes made complex WebGL matrix math click immediately — I went from zero shaders to shipping a custom WebGL renderer in 6 weeks.",
    highlight: "zero shaders to shipping a custom WebGL renderer",
    rating: 5,
  },
  {
    id: 2,
    name: "Aria Chen",
    role: "Interaction Designer",
    company: "Framer",
    initials: "AC",
    companyColor: "#a78bfa",
    quote: "The AI mentor evaluates layout efficiency and stagger delays with more depth than any YouTube tutorial. This is the only course that actually teaches you to think like a motion engineer.",
    highlight: "think like a motion engineer",
    rating: 5,
  },
  {
    id: 3,
    name: "Devon Reynolds",
    role: "Frontend Engineer",
    company: "Stripe",
    initials: "DR",
    companyColor: "#6366f1",
    quote: "I launched my entire creative portfolio while working through the advanced tracks. The platform makes learning feel like AAA game design — every lesson has a clear win condition.",
    highlight: "every lesson has a clear win condition",
    rating: 5,
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Technical Artist",
    company: "Epic Games",
    initials: "ER",
    companyColor: "#22c55e",
    quote: "Truly standard-setting curriculum. The blockchain credential I earned from Eduvantix was what got me my interview at Epic — recruiters actually know what it means.",
    highlight: "blockchain credential",
    rating: 5,
  },
];

/* ─── Star Rating ─────────────────────────── */
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Avatar ──────────────────────────────── */
function Avatar({ initials, color, size = "md" }) {
  const sz = size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 mx-auto`}
      style={{ background: `linear-gradient(135deg, ${color}90, ${color}50)`, border: `1px solid ${color}40` }}
    >
      {initials}
    </div>
  );
}

/* ─── Testimonial Slide ─────────────────── */
function TestimonialSlide({ t }) {
  const parts = t.quote.split(t.highlight);
  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 px-2 md:px-10">
      <Stars count={t.rating} />

      <blockquote
        className="text-[clamp(1.1rem,2vw,1.8rem)] font-bold leading-[1.4] tracking-[-0.015em] max-w-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {parts[0]}
        <em
          className="font-serif-display not-italic"
          style={{ color: "var(--text-accent)" }}
        >
          {t.highlight}
        </em>
        {parts.length > 1 && parts[1]}
      </blockquote>

      <div className="flex flex-col items-center gap-2 md:gap-3 pt-2 md:pt-4">
        <Avatar initials={t.initials} color={t.companyColor} size="lg" />
        <div>
          <div className="text-sm md:text-base font-bold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
          <div className="text-[10px] md:text-xs mt-0.5 md:mt-1" style={{ color: "var(--text-muted)" }}>
            {t.role} <span style={{ color: "var(--border-primary)" }}>·</span>{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonials Section ──────────────── */
export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative py-12 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-8 md:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
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
                Student Stories
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
              Endorsed by top<br />
              <em className="font-serif-display not-italic" style={{ color: "var(--text-muted)" }}>creators & engineers</em>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <span><strong style={{ color: "var(--text-primary)" }}>4.9 / 5</strong> across 20+ learners</span>
          </motion.div>
        </div>
      </div>

      {/* Carousel */}
      <div ref={ref} className="w-full relative pb-8 mt-16 md:mt-32 max-w-[1400px] mx-auto">
        
        <div className="relative h-[480px] md:h-[400px] w-full flex items-center justify-center overflow-x-hidden md:overflow-visible px-4 max-w-[100vw] group">
          
          <button 
            onClick={prev}
            className="absolute left-4 md:-left-4 z-20 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-md border border-[var(--border-primary)] shadow-xl hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all hidden md:flex items-center justify-center cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-4 md:-right-4 z-20 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-md border border-[var(--border-primary)] shadow-xl hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all hidden md:flex items-center justify-center cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {testimonials.map((t, i) => {
            const diff = (i - currentIndex + testimonials.length) % testimonials.length;
            
            let position = 0; 
            if (diff === 0) position = 0;
            else if (diff === 1) position = 1;
            else if (diff === testimonials.length - 1) position = -1;
            else position = 2;

            return (
              <motion.div
                key={t.id}
                onClick={() => {
                  if (position === 1) next();
                  else if (position === -1) prev();
                }}
                initial={false}
                animate={{
                  x: position === 0 ? "0%" : position === 1 ? "65%" : position === -1 ? "-65%" : position === 2 && diff > 1 ? "120%" : "-120%",
                  scale: position === 0 ? 1 : 0.85,
                  opacity: position === 0 ? 1 : position === 2 ? 0 : 0.4,
                  zIndex: position === 0 ? 10 : 5,
                  y: position === 0 ? 0 : 25, 
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`absolute w-full max-w-xl rounded-[2rem] border shadow-2xl p-6 md:p-10 ${position !== 0 && position !== 2 ? 'cursor-pointer hover:opacity-70' : ''}`}
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: position === 0 ? "var(--border-accent)" : "var(--border-primary)",
                  pointerEvents: position === 2 ? "none" : "auto",
                }}
              >
                <TestimonialSlide t={t} />
              </motion.div>
            );
          })}
        </div>
        
        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${i === currentIndex ? "w-8" : "w-2 hover:opacity-70"}`}
              style={{ backgroundColor: i === currentIndex ? "var(--accent-primary)" : "var(--border-primary)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
