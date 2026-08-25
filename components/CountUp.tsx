"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// Counts up from 0 to `value` once it scrolls into view.
export default function CountUp({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [counted, setCounted] = useState(0);
  // Reduced motion shows the final number outright. Deriving it beats writing
  // it from an effect: no second render pass, and it stays correct if the
  // reader flips the OS setting while the page is open.
  const display = reduced ? value : counted;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 600;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setCounted(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
