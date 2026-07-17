"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBase } from "@/utils/api";

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
function PlanCard({ plan, isAnnual, index, isSelected, onClick, onEnrollProClick }) {
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
      <button
        onClick={(e) => {
          if (plan.id === "pro") {
            e.preventDefault();
            e.stopPropagation();
            onEnrollProClick();
          } else {
            window.location.href = plan.ctaHref;
          }
        }}
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
      </button>

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
            <span style={{ color: plan.featured ? "var(--text-secondary)" : "var(--text-muted)", textDecoration: plan.featured ? "none" : "line-through" }}>
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
  
  const [proModalOpen, setProModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", description: "" });
  const [formStatus, setFormStatus] = useState("idle");

  const handleEnrollProClick = () => {
    setFormData({ name: "", email: "", phone: "", description: "" });
    setFormStatus("idle");
    setProModalOpen(true);
  };

  const handleProSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/auth/request-pro-access`, {
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
              onEnrollProClick={handleEnrollProClick}
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

      {/* Pro Early Access Modal */}
      <AnimatePresence>
        {proModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-[95vw] md:w-[520px] md:h-[520px] md:aspect-square md:overflow-hidden rounded-none p-6 md:p-8 border-2 shadow-2xl z-10 my-auto flex flex-col justify-between"
              style={{
                backgroundColor: "var(--bg-card)",
                borderImage: "var(--accent-gradient) 1",
                color: "var(--text-primary)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setProModalOpen(false)}
                className="absolute top-5 right-5 text-sm p-1.5 rounded-none hover:bg-[var(--bg-hover)] border border-transparent hover:border-white/10 transition-all"
                style={{ color: "var(--text-muted)" }}
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {formStatus === "success" ? (
                <div className="text-center py-12 space-y-6 my-auto">
                  <div className="mx-auto w-16 h-16 rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/25">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight uppercase">You&apos;re on the list!</h3>
                    <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Thank you for your interest. We will notify you as soon as the Pro Pass features become available.
                    </p>
                  </div>
                  <button
                    onClick={() => setProModalOpen(false)}
                    className="w-full max-w-xs mx-auto rounded-none py-3 text-sm font-bold text-white transition-opacity duration-200 block"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    Got it, thanks!
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-between space-y-4 md:space-y-0">
                  <div className="space-y-1.5 text-left pr-6">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span 
                        className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-500" 
                      >
                        PRO FEATURES COMING SOON
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase">
                      BE THE FIRST TO{" "}
                      <span
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        USE IT.
                      </span>
                    </h3>
                  </div>

                  <form onSubmit={handleProSubmit} className="flex-1 flex flex-col justify-between space-y-3 mt-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full rounded-none px-3.5 py-2.5 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Email ID</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@domain.com"
                        className="w-full rounded-none px-3.5 py-2.5 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Mobile Number (with country code)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +91 99999 99999"
                        className="w-full rounded-none px-3.5 py-2.5 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>What do you want to access?</label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="E.g., Generative AI course tracks, shader sandboxes..."
                        className="w-full rounded-none px-3.5 py-2.5 text-sm outline-none transition-all resize-none"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-primary)"}
                      />
                    </div>

                    {formStatus === "error" && (
                      <p className="text-[10px] font-semibold text-rose-500 leading-none">
                        Something went wrong. Please check your network or try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="w-full rounded-none py-3 text-sm font-bold text-[var(--text-on-accent)] transition-all duration-200 flex items-center justify-center gap-2"
                      style={{ background: "var(--accent-gradient)" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-[var(--text-on-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Get Early Access"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
