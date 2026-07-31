"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollRail — a hairline that fills with brass as the reader moves through the
 * section it sits in. On the desktop two-column layout it pairs with a sticky
 * rail: while the headline holds still and the cards move past it, this is
 * the only cue for how much is left. Below `lg:` the column isn't sticky (a
 * single stacked layout doesn't need it to stay put), but the rail still
 * renders and fills the same way — the section's own scroll math it reads
 * off (`section.getBoundingClientRect()`) isn't tied to that layout, so
 * there's no reason the animation itself should be desktop-only too.
 *
 * Finds its own section rather than taking a ref, so it can be dropped into
 * server-rendered markup with no wiring.
 */
export default function ScrollRail({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = hostRef.current?.closest("section");
    const fill = fillRef.current;
    if (!section || !fill) return;

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress =
        travel > 0
          ? Math.min(1, Math.max(0, -rect.top / travel))
          : rect.top < 0
            ? 1
            : 0;
      fill.style.transform = `scaleY(${progress.toFixed(3)})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    // Capture phase: this rail's section sits inside ContainerScroll's
    // nested `overflow-y: auto` "screen" panel, and `scroll` doesn't bubble —
    // see the matching comment in Parallax.tsx for the full explanation.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <span className="relative block h-28 w-[3px] overflow-hidden rounded-full bg-navy/10">
        <span
          ref={fillRef}
          className="absolute inset-0 origin-top rounded-full bg-linear-to-b from-brand to-amber"
          style={{ transform: "scaleY(0)" }}
        />
      </span>
    </div>
  );
}
