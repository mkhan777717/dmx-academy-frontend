"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9997] origin-left"
      style={{
        scaleX,
        height: "2px",
        background: "var(--accent-gradient)",
        transformOrigin: "0%",
      }}
    />
  );
}
