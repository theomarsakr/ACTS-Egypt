"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * ContainerScroll — a device-style bezel (dark frame + three-dot chrome bar)
 * that tilts back and settles flat as it scrolls into view. The "screen" is a
 * fixed-height, plain `overflow-y: auto` box — a real scrollbar, no JS driving
 * scroll position, no pinning the frame to the page. Simple on purpose.
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
      className={`device-frame relative mx-auto w-full rounded-[26px] border border-white/10 bg-linear-to-b from-navy-800 via-navy to-ink p-2 md:rounded-4xl md:p-3 ${className}`}
    >
      {/* Specular hairline along the bezel's top edge — the detail that
          sells the frame as a physical object rather than a border. */}
      <span
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-amber/40 to-transparent"
        aria-hidden
      />

      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 pt-2 pb-2.5 md:px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        {label && (
          <span className="ms-auto truncate text-[10.5px] font-bold tracking-[0.18em] text-white/35 uppercase">
            {label}
          </span>
        )}
      </div>

      {/* The "screen" — fixed height, a plain native scroll. Edge fades hint
          there's more to see; no JS ever touches this element's scrollTop. */}
      <div className="relative overflow-hidden rounded-[18px] md:rounded-2xl">
        <div className="screen-canvas h-120 overflow-x-hidden overflow-y-auto p-4 sm:h-136 sm:p-6 md:h-152 md:p-9 lg:p-11">
          {children}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-[#f5f7fb] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-[#f5f7fb] to-transparent" />
      </div>
    </div>
  );
}
