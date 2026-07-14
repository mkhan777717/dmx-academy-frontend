"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CinematicCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const dotX = useSpring(mx, { damping: 40, stiffness: 600, mass: 0.3 });
  const dotY = useSpring(my, { damping: 40, stiffness: 600, mass: 0.3 });
  const ringX = useSpring(mx, springConfig);
  const ringY = useSpring(my, springConfig);

  useEffect(() => {
    // Only on desktop (pointer: fine)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = (e) => {
      const el = e.target;
      if (
        el.closest("a") ||
        el.closest("button") ||
        el.closest("[data-cursor-hover]")
      ) {
        setHovered(true);
      }
    };

    const onLeave = (e) => {
      const el = e.target;
      if (
        el.closest("a") ||
        el.closest("button") ||
        el.closest("[data-cursor-hover]")
      ) {
        setHovered(false);
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnterDoc = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnterDoc);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnterDoc);
    };
  }, [visible, mx, my]);

  return (
    <>
      {/* Dot — precise, fast */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          top: 0,
          left: 0,
          width: clicking ? 6 : hovered ? 8 : 6,
          height: clicking ? 6 : hovered ? 8 : 6,
          background: "var(--accent-primary)",
          opacity: visible ? 1 : 0,
          transition: "width 0.15s, height 0.15s, opacity 0.3s",
        }}
      />

      {/* Ring — lagging, spring follower */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          top: 0,
          left: 0,
          width: hovered ? 44 : clicking ? 28 : 36,
          height: hovered ? 44 : clicking ? 28 : 36,
          borderColor: "var(--accent-primary)",
          borderWidth: hovered ? 1 : 1,
          opacity: visible ? (hovered ? 0.6 : 0.3) : 0,
          transition: "width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
          background: hovered ? "var(--accent-glow)" : "transparent",
        }}
      />
    </>
  );
}
