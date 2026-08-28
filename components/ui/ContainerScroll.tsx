"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useOnscreen } from "@/lib/hooks";

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
 *
 * Every dimension of the bezel is drawn to a desktop scale, and a phone needs
 * it re-drawn rather than shrunk uniformly — or, as a first attempt had it,
 * removed. Three things go wrong at 358px wide if the desktop values are
 * simply carried down: an 8px bezel on a 26px radius reads chunky against a
 * narrow panel; a 34px chrome bar of 10px lights is a title bar taller than
 * the tiles' own padding; and 16px of screen inset on top of the bezel takes
 * a 358px column down to 310px, which every card and every line of copy
 * inside then pays for.
 *
 * So the phone gets its own proportions rather than the desktop's: a 5px bezel
 * on an 18px radius, 8px lights in a bar half the height, and 10px of screen
 * inset — 26px handed back to the content, and a frame that reads as a
 * precise instrument instead of a toy. The shadow stack and the entrance tilt
 * are re-scaled to match in globals.css: an 80-149px blur spread around a
 * phone-width frame is a grey haze, not an edge. `sm:` and up is unchanged.
 *
 * This is also the shared ancestor for every ambient loop inside WHY ACTS —
 * the badge sheen, the status-light pulse, the border-beam arc on the anchor
 * card. useOnscreen publishes data-onscreen on this same node, so all three
 * (each marked `.motion-ambient` where they're rendered) pause together the
 * instant the section scrolls off screen, at every width.
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
  useOnscreen(ref);

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
      className={`device-frame relative mx-auto w-full rounded-[18px] p-[5px] sm:rounded-[26px] sm:p-2 md:rounded-4xl md:p-3 ${className}`}
    >
      {/* Specular hairline along the bezel's top edge — the detail that
          sells the frame as a physical object rather than a border. */}
      <span
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-amber/50 to-transparent sm:inset-x-10"
        aria-hidden
      />

      {/* Chrome bar — instrument-panel lights, not a browser mockup: one
          lit amber ("powered on"), two dormant. */}
      <div className="flex items-center gap-1 px-2 pt-1 pb-1.5 sm:gap-1.5 sm:px-3 sm:pt-2 sm:pb-2.5 md:px-4">
        <span className="device-light device-light--live motion-ambient h-2 w-2 sm:h-2.5 sm:w-2.5" aria-hidden />
        <span className="device-light h-2 w-2 sm:h-2.5 sm:w-2.5" aria-hidden />
        <span className="device-light h-2 w-2 sm:h-2.5 sm:w-2.5" aria-hidden />
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
      <div className="device-screen screen-canvas relative rounded-[14px] p-2.5 sm:rounded-[18px] sm:p-6 md:rounded-2xl md:p-9 lg:p-11">
        {children}
      </div>
    </div>
  );
}
