"use client";

import { useEffect, useRef, useState } from "react";
// NOT motion/react's useReducedMotion. That one reads the media query straight
// into useState during render, so it reports false on the server and the
// reader's real setting on the client's very first render — and this component
// renders that value as TEXT, which made it a hydration mismatch (React #418,
// "server rendered text didn't match"): 0 in the HTML, the final number on the
// client, and the surrounding tree thrown away and rebuilt. The local hook is
// useSyncExternalStore-based with a server snapshot, so server and hydration
// render agree and the value only changes afterwards. It also tracks later
// changes to the OS setting, which motion's one-shot version never does.
import { useReducedMotion } from "@/lib/hooks";

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
  // Reduced motion shows the final number outright. Safe to derive during
  // render with the hook above: it reports false through hydration, so this is
  // `counted` (0) on both passes and only becomes `value` afterwards.
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
