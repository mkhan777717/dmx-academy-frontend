import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, } from "framer-motion";
import { useReducedMotion } from "framer-motion"; // If you already have a custom one, import appropriately

const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 260,
  damping: 18,
};

const TiltCard = React.forwardRef(
  (
    { children, className = "", style = {} },
    forwardedRef
  ) => {
    const innerRef = useRef(null);
    const ref = forwardedRef || innerRef;
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const reduced = useReducedMotion();

    const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), SPRING_SNAPPY);
    const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), SPRING_SNAPPY);

    // Glass reflection position
    const glareX = useTransform(x, [0, 1], ["-50%", "150%"]);
    const glareY = useTransform(y, [0, 1], ["-50%", "150%"]);

    const handleMouse = useCallback(
      (e) => {
        if (reduced) return;
        const domNode = ref.current;
        if (!domNode) return;
        const rect = domNode.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
      },
      [x, y, reduced, ref]
    );

    const handleLeave = useCallback(() => {
      x.set(0.5);
      y.set(0.5);
    }, [x, y]);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        className={`relative overflow-hidden ${className}`}
        style={{
          ...style,
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {/* Glass reflection */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: useMotionTemplate`radial-gradient(300px circle at ${glareX} ${glareY}, rgba(16,185,129,0.06), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    );
  }
);

TiltCard.displayName = "TiltCard";

export default TiltCard;