"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CTA() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const backgroundGlow = useMotionTemplate`
    radial-gradient(
      450px circle at ${glowX}px ${glowY}px,
      var(--accent-glow),
      transparent 80%
    )
  `;

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative py-28 overflow-hidden group cursor-default"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Dynamic Cursor glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: backgroundGlow }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--border-primary), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring", stiffness: 85 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl backdrop-blur-md text-center space-y-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-primary)",
          }}
        >
          {/* Inner Spotlight */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full blur-[80px] pointer-events-none"
            style={{ backgroundColor: "var(--accent-glow)" }}
          />

          {/* Icon */}
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_4px_12px_rgba(99,102,241,0.12)]"
            style={{
              backgroundColor: "var(--bg-badge)",
              border: "1px solid var(--border-accent)",
              color: "var(--text-accent)",
            }}
          >
            <Sparkles size={24} className="animate-pulse" />
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to Accelerate Your{" "}
              <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Creative Code Skills?
              </span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Join a cohort of like-minded creators. Write interactive web animations, implement custom shader matrices, and build verified portfolios today.
            </p>
          </div>

          {/* Email Form */}
          <div className="max-w-md mx-auto pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const emailInput = e.currentTarget.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                  window.location.href = `/login?redirect=/student&email=${encodeURIComponent(emailInput.value)}`;
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                suppressHydrationWarning
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full rounded-full px-6 py-4 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
              <motion.button
                suppressHydrationWarning
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 rounded-full px-6 py-4 text-sm font-semibold text-white shadow-lg"
                style={{ background: "var(--accent-gradient)" }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </motion.button>
            </form>
            <p className="text-[10px] text-left px-4 pt-2" style={{ color: "var(--text-muted)" }}>
              No credit card required. Cancel anytime. Pro plan free 7-day trials available.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
