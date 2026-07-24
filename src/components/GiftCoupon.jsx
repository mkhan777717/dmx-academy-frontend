"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Gift, X, CheckCircle2, Sparkles, Loader2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';



export default function GiftCoupon() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // 'box' -> wrapped gift shown, lid closed
  // 'opened' -> lid has popped, coupon card + confetti (maybe) revealed
  const [stage, setStage] = useState('box');
  const [copied, setCopied] = useState(false);
  const [everSeenConfetti, setEverSeenConfetti] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const openTimer = useRef(null);
  const referralCode = user?.referralCode || "GET-PREMIUM";



  const copyToClipboard = (e) => {
    if (e) e.stopPropagation();
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createConfetti = () => {
    return Array.from({ length: 90 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      return {
        id: i,
        x: isLeft ? -10 : 110,
        y: 110,
        targetX: isLeft ? 10 + Math.random() * 60 : 30 + Math.random() * 60,
        targetY: -10 + Math.random() * 50,
        color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
        scale: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
      };
    });
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    setStage('box');
    
    // 1. Box shakes and builds pressure (800ms)
    // 2. Box pops (stage='popping') (400ms)
    // 3. Card revealed (stage='opened')
    openTimer.current = setTimeout(() => {
      setStage('popping');
      
      setTimeout(() => {
        setStage('opened');
        if (!everSeenConfetti) {
          setConfetti(createConfetti());
          setEverSeenConfetti(true);
          setTimeout(() => setConfetti([]), 5000);
        }
      }, 500); // Wait for the pop animation to finish before showing the card
    }, 1200);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStage('box');
    setConfetti([]);
    if (openTimer.current) clearTimeout(openTimer.current);
  };

  useEffect(() => () => { if (openTimer.current) clearTimeout(openTimer.current); }, []);

  return (
    <>
      {/* Navbar Gift Button */}
      <motion.button
        onClick={handleOpenModal}
        className="relative flex items-center justify-center p-2 rounded-xl transition-colors hover:bg-[var(--bg-hover)] text-[var(--accent-primary)] group"
        style={{ perspective: 200 }}
        animate={{
          y: [0, -4, 0, 0, 0, -2, 0],
          rotate: [0, -8, 8, -4, 4, 0, 0],
        }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", times: [0, 0.12, 0.24, 0.34, 0.44, 0.5, 1] }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        whileTap={{ scale: 0.9, rotate: -10 }}
      >
        {/* soft attention ring while the reward hasn't been claimed yet */}
        {!everSeenConfetti && (
          <motion.span
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: "var(--accent-primary)" }}
            animate={{ opacity: [0.25, 0, 0.25], scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          />
        )}
        <Gift size={20} className="fill-[var(--accent-primary)]/20 relative z-10" />
        {!everSeenConfetti && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 z-10" />
        )}
      </motion.button>

      {/* Full screen modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden">
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Confetti container */}
            <div className="absolute inset-0 pointer-events-none">
              {confetti.map((c) => (
                <motion.div
                  key={c.id}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{ backgroundColor: c.color }}
                  initial={{ left: `${c.x}vw`, top: `${c.y}vh`, scale: c.scale, rotate: 0 }}
                  animate={{
                    left: [`${c.x}vw`, `${c.targetX}vw`, `${c.targetX + (c.targetX - c.x) * 0.2}vw`],
                    top: [`${c.y}vh`, `${c.targetY}vh`, `120vh`],
                    rotate: [0, c.rotation + 360, c.rotation + 720],
                  }}
                  transition={{
                    duration: 3 + Math.random(),
                    times: [0, 0.3, 1],
                    ease: ["easeOut", "easeIn"]
                  }}
                />
              ))}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Wrapped gift box — builds pressure, jumps and pops open */}
            <AnimatePresence mode="wait">
              {(stage === 'box' || stage === 'popping') ? (
                <motion.div
                  key="box"
                  initial={{ scale: 0.3, opacity: 0, y: -50 }}
                  animate={
                    stage === 'popping'
                      ? { 
                          scale: [1, 1.2, 0.8, 0], 
                          y: [0, -60, 20, 50],
                          opacity: [1, 1, 0.5, 0]
                        }
                      : { 
                          scale: [0.3, 1, 1, 1.1, 0.9, 1.05, 0.95, 1], 
                          y: [-50, 0, 0, -10, 10, -5, 5, 0],
                          rotate: [0, 0, 0, -5, 5, -3, 3, 0]
                        }
                  }
                  transition={
                    stage === 'popping'
                      ? { duration: 0.5, times: [0, 0.4, 0.8, 1], ease: "easeIn" }
                      : { duration: 1.2, times: [0, 0.3, 0.5, 0.6, 0.75, 0.85, 0.95, 1], ease: "easeInOut" }
                  }
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative flex flex-col items-center justify-center z-20"
                >
                  {/* Glowing explosion behind the box when it pops */}
                  {stage === 'popping' && (
                    <motion.div
                      className="absolute inset-0 w-64 h-64 -ml-12 -mt-16 rounded-full blur-2xl z-0"
                      style={{ background: "radial-gradient(circle, rgba(52,211,153,0.8) 0%, rgba(16,185,129,0) 70%)" }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [0.5, 2, 3], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}

                  <div
                    className="relative w-40 h-32 rounded-2xl shadow-2xl z-10"
                    style={{ background: "linear-gradient(160deg, #10b981, #047857)", boxShadow: "0 25px 50px -12px rgba(5, 150, 105, 0.6)" }}
                  >
                    {/* vertical ribbon */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6" style={{ background: "rgba(255,255,255,0.9)" }} />
                    {/* lid, sitting on top, about to pop */}
                    <motion.div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-[110%] h-10 rounded-xl origin-bottom"
                      style={{ background: "linear-gradient(160deg, #34d399, #10b981)", boxShadow: "0 10px 20px -8px rgba(5,150,105,0.5)" }}
                      animate={
                        stage === 'popping'
                          ? { y: -150, x: -80, rotate: -75, opacity: [1, 1, 0] }
                          : { y: [0, -3, 0], scaleY: [1, 1.05, 1] }
                      }
                      transition={
                        stage === 'popping'
                          ? { duration: 0.5, ease: "easeOut" }
                          : { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
                      }
                    >
                      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6" style={{ background: "rgba(255,255,255,0.9)", borderRadius: 3 }} />
                    </motion.div>
                    {/* bow */}
                    <motion.div 
                      className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center justify-center"
                      animate={
                        stage === 'popping'
                          ? { y: -150, x: -80, rotate: -75, opacity: 0 }
                          : { scale: [1, 1.1, 1] }
                      }
                      transition={
                        stage === 'popping'
                          ? { duration: 0.5, ease: "easeOut" }
                          : { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
                      }
                    >
                      <div className="w-5 h-5 rounded-full bg-white -mr-1.5 opacity-90" />
                      <div className="w-5 h-5 rounded-full bg-white -ml-1.5 opacity-90" />
                    </motion.div>
                  </div>
                  {stage === 'box' && (
                    <p className="mt-6 text-white/70 text-xs font-bold uppercase tracking-widest animate-pulse">
                      Building pressure...
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="card"
                  initial={{ scale: 0.75, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="relative w-full max-w-2xl mx-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                    className="w-full flex rounded-3xl overflow-hidden relative shadow-2xl"
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(5, 150, 105, 0.55)",
                      WebkitMask: `
                        radial-gradient(circle at 34% 0px, transparent 12px, black 12.5px) top left / 100% 51% no-repeat,
                        radial-gradient(circle at 34% 100%, transparent 12px, black 12.5px) bottom left / 100% 51% no-repeat
                      `,
                      mask: `
                        radial-gradient(circle at 34% 0px, transparent 12px, black 12.5px) top left / 100% 51% no-repeat,
                        radial-gradient(circle at 34% 100%, transparent 12px, black 12.5px) bottom left / 100% 51% no-repeat
                      `,
                    }}
                  >
                    {/* Left stub */}
                    <div
                      className="w-[34%] shrink-0 flex flex-col items-center justify-center py-10 relative border-r-2 border-dashed z-10"
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        background: "linear-gradient(160deg, #10b981, #047857)",
                      }}
                    >
                      <motion.div
                        className="absolute w-20 h-20 rounded-full pointer-events-none"
                        style={{ background: "rgba(255,255,255,0.35)", filter: "blur(12px)", top: 30 }}
                        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
                      >
                        <Gift size={48} className="mb-3 relative z-10 text-white drop-shadow-sm" />
                      </motion.div>
                      <span className="text-4xl font-black tracking-tighter leading-none mt-2 text-white drop-shadow-sm">
                        7 DAYS
                      </span>
                      <span
                        className="text-xs font-black tracking-widest mt-2 uppercase px-3 py-1 rounded-full"
                        style={{ color: "#047857", backgroundColor: "#ffffff" }}
                      >
                        Premium
                      </span>
                    </div>

                    {/* Right panel */}
                    <div
                      className="flex-1 p-8 flex flex-col justify-between relative overflow-hidden -ml-[1px]"
                      style={{ background: "linear-gradient(135deg, #065f46 0%, #059669 100%)" }}
                    >
                      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40" style={{ background: "#34d399" }} />

                      <motion.div
                        className="absolute inset-y-0 w-1/3 pointer-events-none"
                        style={{ background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.22), transparent)" }}
                        animate={{ x: ["-120%", "220%"] }}
                        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="relative z-10 mt-2"
                      >
                        <h3 className="flex items-center gap-3 text-2xl font-black uppercase tracking-wider mb-2 text-white">
                          <Sparkles size={24} className="text-emerald-200" />
                          Refer a Friend
                        </h3>
                        <p className="text-base font-medium leading-tight pr-4 text-emerald-100">
                          Share your unique code. When they sign up, you both get a full week of premium!
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32, duration: 0.4 }}
                        className="mt-8 mb-2 flex items-stretch justify-between rounded-xl border relative z-10 bg-black/20 overflow-hidden"
                        style={{ borderColor: "rgba(255,255,255,0.3)", height: "64px" }}
                      >
                        <div className="px-6 flex-1 font-mono text-xl font-bold tracking-widest text-white flex items-center">
                          {referralCode ? referralCode : (
                            <span className="flex items-center gap-3 opacity-80 text-sm tracking-widest uppercase">
                              <Loader2 size={20} className="animate-spin" />
                              Generating...
                            </span>
                          )}
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="px-8 border-l hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-wider"
                          style={{ borderColor: "rgba(255,255,255,0.3)" }}
                        >
                          {copied ? <CheckCircle2 size={20} className="text-emerald-300" /> : <Copy size={20} />}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}