"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  {
    id: "explorer",
    name: "Explorer",
    tagline: "Test the waters",
    desc: "Get started with core modules and basic AI suggestions.",
    priceMonthly: 0,
    priceAnnually: 0,
    ctaText: "Start for Free",
    ctaHref: "/login?redirect=/student",
    featured: false,
    features: [
      "Access to initial course modules",
      "1 Sandbox compiler checkpoint",
      "Basic AI code suggestions",
      "Community chat access",
    ],
    missing: [
      "Advanced WebGL projects",
      "On-chain certificates",
      "1-on-1 cohort reviews",
    ],
  },
  {
    id: "pro",
    name: "Pro Pass",
    tagline: "The full experience",
    desc: "Unlock the complete curriculum, unlimited sandboxes, and AI mentors.",
    priceMonthly: 29,
    priceAnnually: 19,
    ctaText: "Enroll in Pro",
    ctaHref: "/login?redirect=/student",
    featured: true,
    features: [
      "Full access to all course tracks",
      "Unlimited browser sandbox renders",
      "24/7 AI mentor code audits",
      "On-chain cryptographic credentials",
      "Premium shader & Three.js projects",
      "Weekly live cohort workshops",
    ],
    missing: ["Priority recruiter matching"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Scale with your team",
    desc: "Custom training platforms for agencies and teams.",
    priceMonthly: 99,
    priceAnnually: 79,
    ctaText: "Contact Sales",
    ctaHref: "mailto:hello@datamindx.in",
    featured: false,
    features: [
      "Everything in Pro Pass",
      "Dedicated company cohort",
      "Custom training roadmaps",
      "Enterprise API key access",
      "Dedicated success manager",
      "Recruiter hiring channel",
      "Custom SLA support",
    ],
    missing: [],
  },
];

/* ─── Price Display ───────────────────────── */
function Price({ monthly, annually, isAnnual }) {
  const price = isAnnual ? annually : monthly;
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)", alignSelf: "flex-start", paddingTop: "8px" }}>
        {price === 0 ? "" : "$"}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={price}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="text-5xl font-black tracking-[-0.03em]"
          style={{ color: "var(--text-primary)" }}
        >
          {price === 0 ? "Free" : price}
        </motion.span>
      </AnimatePresence>
      {price > 0 && (
        <span className="text-xs" style={{ color: "var(--text-muted)", marginLeft: "2px" }}>
          / mo
        </span>
      )}
    </div>
  );
}

/* ─── Plan Card ──────────────────────────── */
function PlanCard({ plan, isAnnual, index, isSelected, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: plan.featured ? 1.05 : 1.02 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative flex flex-col rounded-3xl p-8 transition-all cursor-pointer ${plan.featured ? "z-10 scale-105 shadow-2xl" : "z-0 mt-0 lg:mt-6"}`}
      style={{
        backgroundColor: plan.featured ? "var(--bg-card)" : "var(--bg-primary)",
        border: isSelected ? "2px solid #10b981" : "1px solid var(--border-card)",
        boxShadow: isSelected ? "0 0 40px rgba(16, 185, 129, 0.2)" : (plan.featured ? "0 0 40px var(--accent-glow)" : "none"),
        color: "var(--text-primary)",
      }}
    >


      {/* Plan header */}
      <div className="space-y-1 mb-8">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)" }}
          >
            {plan.tagline}
          </span>
          {plan.featured && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent-primary)" }}>
              Most Popular
            </span>
          )}
        </div>
        <h3
          className="text-2xl font-black tracking-[-0.02em]"
          style={{ color: "var(--text-primary)" }}
        >
          {plan.name}
        </h3>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {plan.desc}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <Price monthly={plan.priceMonthly} annually={plan.priceAnnually} isAnnual={isAnnual} />
        {isAnnual && plan.priceMonthly > 0 && (
          <div
            className="text-[11px] mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            billed annually · saves ${(plan.priceMonthly - plan.priceAnnually) * 12}/yr
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={plan.ctaHref}
        className="block w-full rounded-xl py-3.5 text-sm font-bold text-center mb-8 transition-all duration-200"
        style={plan.featured
          ? { backgroundColor: "var(--accent-primary)", color: "#ffffff", border: "1px solid var(--border-accent)" }
          : { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-card)" }
        }
        onMouseEnter={e => {
          if (plan.featured) e.currentTarget.style.opacity = "0.9";
          else e.currentTarget.style.backgroundColor = "var(--border-primary)";
        }}
        onMouseLeave={e => {
          if (plan.featured) e.currentTarget.style.opacity = "1";
          else e.currentTarget.style.backgroundColor = "var(--bg-input)";
        }}
      >
        {plan.ctaText}
      </a>

      <div
        className="h-px mb-6"
        style={{ background: "var(--border-primary)" }}
      />

      {/* Features */}
      <div className="space-y-3 flex-1">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <svg
              className="flex-shrink-0 mt-0.5"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ color: "var(--text-secondary)" }}>
              {f}
            </span>
          </div>
        ))}
        {plan.missing.map((f, i) => (
          <div key={i} className="flex items-start gap-3 text-sm opacity-40">
            <svg
              className="flex-shrink-0 mt-0.5"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "var(--text-muted)", textDecoration: "line-through" }}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Pricing Section ───────────────────── */
export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <section id="pricing" className="relative py-12 overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>

      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
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
                Pricing
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
              Simple billing.<br />
              <em className="font-serif-display not-italic" style={{ color: "var(--text-muted)" }}>Unlimited access.</em>
            </motion.h2>
          </div>

          {/* Annual toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              suppressHydrationWarning
              onClick={() => setIsAnnual(false)}
              className="text-sm font-medium transition-colors"
              style={{ color: !isAnnual ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              Monthly
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setIsAnnual(v => !v)}
              className="relative h-6 w-11 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isAnnual ? "var(--accent-primary)" : "var(--bg-hover)", border: "1px solid var(--border-primary)" }}
              aria-label="Toggle annual billing"
            >
              <motion.div
                animate={{ x: isAnnual ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                suppressHydrationWarning
                onClick={() => setIsAnnual(true)}
                className="text-sm font-medium transition-colors"
                style={{ color: isAnnual ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                Yearly
              </button>
              {isAnnual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-primary)", color: "#fff" }}
                >
                  -35%
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plans — offset grid */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              index={i}
              isSelected={selectedPlan === plan.id}
              onClick={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs mt-10"
          style={{ color: "var(--text-muted)" }}
        >
          All plans include a 7-day free trial. No credit card required to start. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
