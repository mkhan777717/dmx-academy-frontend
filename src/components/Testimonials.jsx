"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Avatar ──────────────────────────────── */
function Avatar({ initials, color, size = "md" }) {
  const sz = size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}90, ${color}50)`, border: `1px solid ${color}40` }}
    >
      {initials}
    </div>
  );
}

/* ─── Large Feature Testimonial ─────────── */
function FeaturedTestimonial({ t, inView }) {
  const parts = t.quote.split(t.highlight);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="col-span-full space-y-8 pb-12"
      style={{ borderBottom: "1px solid var(--border-primary)" }}
    >
      <Stars count={t.rating} />

      <blockquote
        className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.015em]"
        style={{ color: "var(--text-primary)" }}
      >
        {parts[0]}
        <em
          className="font-serif-display not-italic"
          style={{ color: "var(--text-accent)" }}
        >
          {t.highlight}
        </em>
        {parts[1]}
      </blockquote>

      <div className="flex items-center gap-4">
        <Avatar initials={t.initials} color={t.companyColor} size="lg" />
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t.role} <span style={{ color: "var(--border-primary)" }}>·</span>{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t.company}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Small Testimonial ─────────────────── */
function SmallTestimonial({ t, inView, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-5"
    >
      <Stars count={t.rating} />

      <blockquote className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        "{t.quote}"
      </blockquote>

      <div className="flex items-center gap-3 pt-2">
        <Avatar initials={t.initials} color={t.companyColor} />
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {t.role} · <span style={{ fontWeight: 600 }}>{t.company}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Testimonials Section ──────────────── */
export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="testimonials" className="relative py-28 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
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
            <span><strong style={{ color: "var(--text-primary)" }}>4.9 / 5</strong> across 12,000+ learners</span>
          </motion.div>
        </div>
      </div>

      {/* Testimonials grid */}
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12">

          {/* Featured — full width */}
          <FeaturedTestimonial t={testimonials[0]} inView={inView} />

          {/* Small — 3 column asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Wide card */}
            <div className="md:col-span-1" style={{ paddingRight: "0" }}>
              <SmallTestimonial t={testimonials[1]} inView={inView} delay={0.1} />
            </div>

            {/* Divider */}
            <div className="hidden md:block">
              <div className="h-full w-px mx-auto" style={{ background: "var(--border-primary)" }} />
            </div>

            {/* Two stacked */}
            <div className="space-y-10 -mt-0">
              <SmallTestimonial t={testimonials[2]} inView={inView} delay={0.2} />
              <div className="h-px" style={{ background: "var(--border-primary)" }} />
              <SmallTestimonial t={testimonials[3]} inView={inView} delay={0.3} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
