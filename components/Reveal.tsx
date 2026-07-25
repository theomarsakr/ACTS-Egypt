"use client";

import { useEffect, useRef } from "react";

// Fades + slides children in when they scroll into view (CSS in globals.css).
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Trigger on ANY intersection (threshold 0), not a percentage of the
    // element. A percentage threshold can never be met by content taller than
    // the viewport (e.g. the full document library), leaving it stuck at
    // opacity 0. The negative bottom margin still delays the reveal until the
    // element has scrolled a little way into view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
