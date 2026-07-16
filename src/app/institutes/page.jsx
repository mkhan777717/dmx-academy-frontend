"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldAlert, Users, Layers, Trophy, Brain, Code, BookOpen, Radio, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { getApiBase } from "@/utils/api";

export default function InstitutesPage() {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    email: "",
    phone: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState(null); // 'submitting' | 'success' | 'error'

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

  const features = [
    {
      icon: <ShieldAlert size={24} className="text-emerald-500" />,
      title: "Institute Admin Portal",
      desc: "Complete oversight of campus operations, cohorts, and organization-wide analytics from a centralized dashboard."
    },
    {
      icon: <Users size={24} className="text-emerald-500" />,
      title: "Mentor Portal",
      desc: "Specialized dashboard for instructors and TAs to guide students, manage submissions, and review code."
    },
    {
      icon: <Layers size={24} className="text-emerald-500" />,
      title: "Batch Manager Portal",
      desc: "Easily organize students into cohorts, track batch-wise progress, and assign specialized tracks."
    },
    {
      icon: <Trophy size={24} className="text-emerald-500" />,
      title: "Create Contests",
      desc: "Host custom competitive programming arenas to evaluate and challenge your campus."
    },
    {
      icon: <Brain size={24} className="text-emerald-500" />,
      title: "AI Viva",
      desc: "Automated, AI-driven mock interviews and technical assessments that grade students instantly."
    },
    {
      icon: <Code size={24} className="text-emerald-500" />,
      title: "Coding Tests",
      desc: "Run fully-featured, in-browser sandboxes for reliable and scalable technical evaluations."
    },
    {
      icon: <BookOpen size={24} className="text-emerald-500" />,
      title: "Study Material Upload",
      desc: "Centralized distribution of curriculum, notes, and references directly to specific cohorts."
    },
    {
      icon: <Radio size={24} className="text-emerald-500" />,
      title: "Live Classes & Recordings",
      desc: "Host WebRTC-based live cohort sessions with automatic cloud recording for seamless asynchronous learning."
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />

      <main className="flex-grow pb-16">

        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--border-accent)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                <Building2 size={14} className="text-emerald-500" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500">Eduvantix for Campus</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight" style={{ color: "var(--text-primary)" }}>
                Empower employability with online learning for universities
              </h1>
              <p className="text-lg md:text-xl max-w-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Equip your students with the most in-demand technical skills and prepare them for job success through interactive sandboxes and AI-driven feedback.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <a href="#contact" className="px-6 py-3.5 rounded-xl font-bold transition-all text-white hover:opacity-90 flex items-center gap-2" style={{ background: "var(--accent-primary)" }}>
                  Contact Us <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center group overflow-hidden">
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" alt="University Students Coding" className="w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md mb-3">
                    <Building2 size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Campus Enterprise</h3>
                  <p className="text-sm text-slate-300 max-w-sm">Seamlessly integrate industry-grade tools and automated AI feedback directly into your curriculum.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 border-y relative" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none z-0" style={{ background: "linear-gradient(180deg, rgba(16,185,129,0.03) 0%, transparent 100%)" }} />

          <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                A complete ecosystem for your institution
              </h2>
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                From live class delivery to automated AI assessments, we provide all the tools your campus needs to scale high-quality technical education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl group bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-emerald-500/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 md:py-32">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Partner with Eduvantix
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
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="rounded-2xl border p-6 md:p-8 shadow-xl bg-[var(--bg-card)] border-[var(--border-primary)]">
                  {formStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Request Received!</h3>
                      <p style={{ color: "var(--text-secondary)" }}>
                        Our university relations team will reach out to you shortly to set up your Institute Admin account.
                      </p>
                      <button onClick={() => setFormStatus(null)} className="mt-4 text-emerald-500 font-bold hover:underline">
                        Submit another request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-colors border-[var(--border-primary)] focus:border-emerald-500"
                            style={{ color: "var(--text-primary)" }} placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">University / Institute</label>
                          <input required type="text" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-colors border-[var(--border-primary)] focus:border-emerald-500"
                            style={{ color: "var(--text-primary)" }} placeholder="Global Tech University" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Work Email</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-colors border-[var(--border-primary)] focus:border-emerald-500"
                            style={{ color: "var(--text-primary)" }} placeholder="jane@university.edu" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
                          <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-colors border-[var(--border-primary)] focus:border-emerald-500"
                            style={{ color: "var(--text-primary)" }} placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Message (Optional)</label>
                        <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-colors resize-none border-[var(--border-primary)] focus:border-emerald-500"
                          rows={4} style={{ color: "var(--text-primary)" }} placeholder="Tell us about your campus size and specific requirements..." />
                      </div>

                      <button type="submit" disabled={formStatus === "submitting"} className="w-full py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "var(--accent-primary)" }}>
                        {formStatus === "submitting" ? "Submitting Request..." : "Request Institute Access"}
                      </button>

                      {formStatus === "error" && (
                        <p className="text-xs text-rose-500 text-center font-semibold mt-2">
                          Failed to submit request. Please verify your connection or try again.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
