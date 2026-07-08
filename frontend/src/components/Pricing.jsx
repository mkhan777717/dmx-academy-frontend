"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Explorer",
    desc: "Test the waters and explore the basics of code-driven motion design.",
    priceMonthly: 0,
    priceAnnually: 0,
    popular: false,
    ctaText: "Start Explorer Track",
    features: [
      { text: "Access to initial course modules", included: true },
      { text: "1 Sandbox compiler checkpoint", included: true },
      { text: "Basic AI code suggestions", included: true },
      { text: "Interactive community chat", included: true },
      { text: "Advanced WebGL projects", included: false },
      { text: "Cryptographic credentials", included: false },
      { text: "1-on-1 cohort code review", included: false },
    ],
  },
  {
    name: "Pro Pass",
    desc: "Unlock the complete curriculum, premium sandboxes, and AI mentors.",
    priceMonthly: 29,
    priceAnnually: 19,
    popular: true,
    ctaText: "Enroll in Pro Access",
    features: [
      { text: "Full access to all course tracks", included: true },
      { text: "Unlimited browser sandbox renders", included: true },
      { text: "24/7 AI mentor code audits", included: true },
      { text: "On-chain cryptographically signed credentials", included: true },
      { text: "Premium shader & Three.js projects", included: true },
      { text: "Weekly live cohort review workshops", included: true },
      { text: "Priority industry recruiter matching", included: false },
    ],
  },
  {
    name: "Enterprise",
    desc: "Custom training platforms and scale indicators for agencies & teams.",
    priceMonthly: 99,
    priceAnnually: 79,
    popular: false,
    ctaText: "Contact Sales",
    features: [
      { text: "Everything in Pro Pass included", included: true },
      { text: "Dedicated company cohort reviews", included: true },
      { text: "Custom internal training roadmaps", included: true },
      { text: "Enterprise API key access", included: true },
      { text: "Dedicated student success manager", included: true },
      { text: "Recruiter hiring channel alignment", included: true },
      { text: "Custom SLA agreement support", included: true },
    ],
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: "var(--accent-glow)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">

        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <span
            className="text-xs font-bold font-display uppercase tracking-widest"
            style={{ color: "var(--text-accent)" }}
          >
            Transparent Subscriptions
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Simple Billing. Unlimited Access.
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Choose a plan that fits your speed of study. Swap plans or pause your subscription at any time without fees.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center pt-8">
            <div
              className="relative flex items-center p-1 rounded-full"
              style={{
                backgroundColor: "var(--bg-hover)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <button
                suppressHydrationWarning
                onClick={() => setIsAnnual(false)}
                className="relative px-4 py-2 text-xs font-bold uppercase transition-colors duration-300"
                style={{ color: !isAnnual ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {!isAnnual && (
                  <motion.div
                    layoutId="pricingToggle"
                    className="absolute inset-0 rounded-full shadow-sm"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-primary)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setIsAnnual(true)}
                className="relative px-4 py-2 text-xs font-bold uppercase transition-colors duration-300"
                style={{ color: isAnnual ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {isAnnual && (
                  <motion.div
                    layoutId="pricingToggle"
                    className="absolute inset-0 rounded-full shadow-sm"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-primary)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">Yearly Save 30%</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, delay: plan.name === "Explorer" ? 0 : plan.name === "Pro Pass" ? 0.15 : 0.3, type: "spring", stiffness: 80 }}
                whileHover={{ y: -8 }}
                className="relative flex flex-col justify-between rounded-2xl p-8 shadow-md transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: plan.popular
                    ? "2px solid var(--accent-primary)"
                    : "2px solid var(--border-card)",
                }}
              >
                {/* Popular Badge — no blurry overlay causing clipping */}
                {plan.popular && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    <Sparkles size={10} className="animate-pulse" />
                    <span>Most Popular</span>
                  </span>
                )}

                {/* Plan Metadata */}
                <div>
                  <h3
                    className="text-xl font-bold font-display"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-xs mt-2 min-h-[36px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="my-8 flex items-baseline">
                    <span
                      className="text-5xl font-extrabold font-display"
                      style={{ color: "var(--text-primary)" }}
                    >
                      $
                    </span>
                    <span
                      className="text-5xl font-extrabold font-display transition-all duration-300"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {price}
                    </span>
                    <span
                      className="text-sm font-semibold ml-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      / month
                    </span>
                  </div>

                  {/* Features */}
                  <ul
                    className="space-y-4 pt-8"
                    style={{ borderTop: "1px solid var(--border-primary)" }}
                  >
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-3 text-sm">
                        <div
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={
                            feature.included
                              ? { backgroundColor: "var(--bg-badge)", color: "var(--text-accent)" }
                              : { backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }
                          }
                        >
                          <Check size={10} />
                        </div>
                        <span
                          style={{
                            color: feature.included ? "var(--text-secondary)" : "var(--text-muted)",
                            textDecoration: feature.included ? "none" : "line-through",
                            fontWeight: feature.included ? 500 : 400,
                          }}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-6">
                  <motion.button
                    suppressHydrationWarning
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.location.href = "/login?redirect=/student";
                    }}
                    className="w-full rounded-xl py-3 text-sm font-bold shadow-md transition-all"
                    style={
                      plan.popular
                        ? {
                            background: "var(--accent-gradient)",
                            color: "#ffffff",
                            boxShadow: `0 4px 18px var(--accent-glow)`,
                          }
                        : {
                            backgroundColor: "var(--bg-hover)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-primary)",
                          }
                    }
                  >
                    {plan.ctaText}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
