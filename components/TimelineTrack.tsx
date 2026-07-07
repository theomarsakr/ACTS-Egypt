"use client";

import { useEffect, useRef, useState } from "react";

export default function TimelineTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.65;
      const progressPx = viewportAnchor - rect.top;
      const ratio = Math.min(1, Math.max(0, progressPx / rect.height));
      setFillPercent(ratio * 100);
    }
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        measure();
        ticking.current = false;
      });
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-4.25 top-1 bottom-1 w-0.5 rounded-full bg-gray-200 overflow-hidden"
      aria-hidden
    >
      <div
        className="w-full rounded-full transition-[height] duration-150 ease-out"
        style={{
          height: `${fillPercent}%`,
          background:
            "linear-gradient(to bottom, var(--color-navy-700), var(--color-brand), var(--color-amber))",
        }}
      />
    </div>
  );
}
