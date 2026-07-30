"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * ContainerScroll — a device-style bezel (dark frame + three-dot chrome bar)
 * that tilts back and settles flat as it scrolls into view. The "screen"
 * flows at its natural height — no fixed height, no `overflow-y: auto` box
 * of its own. It used to be a small fixed-height scroller (its own real
 * scrollbar, independent of the page), but that meant the section had two
 * competing scroll contexts: the page, and this box. Wheel/trackpad input
 * would land on whichever one the cursor happened to be over, and — because
 * a nested scroll's `scroll` event never bubbles — anything on the page keyed
 * off `window` scroll (the parallax cards, the progress rail) couldn't see
 * it move. One scroll context, not two: this frame is just a wrapper now,
 * sized to whatever's inside it.
 *
 * The entrance tilt is a plain CSS transition keyed off an `.in-view` class
 * (the same IntersectionObserver pattern as <Reveal>), not a framer-motion
 * scroll-linked transform. That distinction matters here: framer-motion keeps
 * writing an inline `transform` (even at rest it's `rotateX(0deg) scale(1)`,
 * never the keyword `none`), and any non-`none` transform on an ancestor
 * silently breaks `position: sticky` for descendants. A CSS transition *to*
 * `transform: none` ends with the computed value actually being `none` once
 * settled, so anything sticky nested inside works normally the moment the
 * tilt-in finishes.
 */
export function ContainerScroll({
  label,
  className = "",
  children,
}: {
  /** Small caption shown in the frame's chrome bar (e.g. the section kicker). */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
      className={`device-frame relative mx-auto w-full rounded-[26px] p-2 md:rounded-4xl md:p-3 ${className}`}
    >
      {/* Specular hairline along the bezel's top edge — the detail that
          sells the frame as a physical object rather than a border. */}
      <span
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-amber/50 to-transparent"
        aria-hidden
      />

      {/* Chrome bar — instrument-panel lights, not a browser mockup: one
          lit amber ("powered on"), two dormant. */}
      <div className="flex items-center gap-1.5 px-3 pt-2 pb-2.5 md:px-4">
        <span className="device-light device-light--live h-2.5 w-2.5" aria-hidden />
        <span className="device-light h-2.5 w-2.5" aria-hidden />
        <span className="device-light h-2.5 w-2.5" aria-hidden />
        {label && (
          <span className="glass-dark ms-auto truncate rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white/45 uppercase">
            {label}
          </span>
        )}
      </div>

      {/* The "screen" — natural height, part of the page's own scroll. Its
          own border-radius rounds its background directly (rather than an
          `overflow: hidden` wrapper clipping a square-cornered child): any
          `overflow` other than `visible` on an ancestor pins `position:
          sticky` descendants to that ancestor's box instead of the page,
          even when — like here — the ancestor never actually scrolls. */}
      <div className="device-screen screen-canvas relative rounded-[18px] p-4 sm:p-6 md:rounded-2xl md:p-9 lg:p-11">
        {children}
      </div>
    </div>
  );
}
