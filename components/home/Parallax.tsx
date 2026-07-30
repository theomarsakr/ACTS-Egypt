"use client";

import { useEffect, useRef } from "react";

/**
 * Parallax — drifts its children a few pixels against the page scroll so a grid
 * of cards reads with depth instead of as one flat plane. Deliberately tiny
 * (±12px at most): the effect should be felt, not seen.
 *
 * It owns the transform on its own wrapper element, which is why it nests
 * around <Reveal> rather than inside it — Reveal animates its own transform on
 * entrance and the two must not fight over the same property.
 *
 * No-ops under prefers-reduced-motion and below `md`, where there is neither
 * the scroll distance nor the screen area for it to read as anything but jitter.
 */
export default function Parallax({
  speed = 10,
  className = "",
  children,
}: {
  /** Peak drift in px across a full viewport traversal. Negative inverts it. */
  speed?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // +1 when the element sits above the viewport centre, -1 when below.
      const t = (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2);
      el.style.transform = `translate3d(0,${(t * speed).toFixed(2)}px,0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    /* Capture phase, not bubble: this card can sit inside ContainerScroll's
       "screen" — a nested `overflow-y: auto` panel — and the `scroll` event
       never bubbles. A bubble-phase window listener only ever sees the outer
       page scrolling, so scrolling that inner panel left the transform stuck
       at a stale value until some later, unrelated window scroll/resize
       (re)computed it — reading as the card randomly jumping to the "wrong"
       spot. Capture-phase listeners on window see scroll events from any
       descendant, nested panel included. */
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      el.style.transform = "";
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
