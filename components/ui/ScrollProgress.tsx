"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * ScrollProgress — a thin brass reading-progress bar pinned to the very top of
 * the viewport, driven by page scroll and smoothed with a spring. Purely
 * decorative (aria-hidden). Under reduced-motion the spring still tracks scroll
 * but without added movement of its own.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-brand via-amber to-brand"
    />
  );
}
