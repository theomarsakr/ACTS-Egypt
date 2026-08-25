"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollRail — a hairline that fills with brass as the reader moves through the
 * section it sits in. On the desktop two-column layout it's a vertical rail
 * paired with a sticky column: while the headline holds still and the cards
 * move past it, this is the only cue for how much is left.
 *
 * Below `lg:`, where the layout stacks and that column stops being sticky, a
 * *vertical* rail would only ever show its first ~5% before scrolling out of
 * view — not reporting progress, just costing 160px of column to say so. The
 * progress math itself is layout-agnostic (it reads live section geometry,
 * not the sticky column), so rather than hide it there, it renders as a
 * horizontal bar instead — the orientation a single stacked reading column
 * actually suits. Both bars are always in the DOM and driven by the same
 * scroll handler; Tailwind's `lg:` swaps which one is visible, matching the
 * layout's own reflow at that breakpoint rather than removing content at it.
 *
 * Finds its own section rather than taking a ref, so it can be dropped into
 * server-rendered markup with no wiring.
 *
 * The progress math reads the section's live rect every frame. That does force
 * a layout, and caching the geometry instead is tempting — but the measurement
 * is not stable enough to cache: this rail's section contains `.device-frame`,
 * which sits tilted (`rotateX(9deg) scale(0.96)`) until its entrance settles.
 * A transform changes the *visual* rect the math reads while leaving the border
 * box alone, so a ResizeObserver never fires and cached values silently drift —
 * in practice the fill stuck at 0 through the first quarter of the section and
 * then lurched to catch up. Live rect, correct rail.
 *
 * What is safe to skip is work while nobody can see it. An IntersectionObserver
 * attaches the scroll listener only while the section is on screen, so the rest
 * of the page scrolls with this handler entirely detached, and identical values
 * are never written back to the DOM.
 */
export default function ScrollRail({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fillRefV = useRef<HTMLSpanElement>(null);
  const fillRefH = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = hostRef.current?.closest("section");
    const fillV = fillRefV.current;
    const fillH = fillRefH.current;
    if (!section || !fillV || !fillH) return;

    let frame = 0;
    let last = -1;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress =
        travel > 0
          ? Math.min(1, Math.max(0, -rect.top / travel))
          : rect.top < 0
            ? 1
            : 0;
      // Skip the write when nothing moved enough to see: a redundant style
      // mutation still invalidates and re-composites the layer for nothing.
      const next = Math.round(progress * 1000) / 1000;
      if (next === last) return;
      last = next;
      fillV.style.transform = `scaleY(${next})`;
      fillH.style.transform = `scaleX(${next})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        // Capture phase: `scroll` doesn't bubble, so a capture-phase listener
        // on window is what lets this keep working if the section ever sits
        // inside a nested scroller again — see Parallax.tsx for the history.
        window.addEventListener("scroll", onScroll, { passive: true, capture: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll, true);
      }
    };

    update();

    const io = new IntersectionObserver(([entry]) => listen(entry.isIntersecting));
    io.observe(section);
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      listen(false);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {/* Horizontal, below `lg:` — the stacked single-column layout. */}
      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-navy/10 lg:hidden">
        <span
          ref={fillRefH}
          className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-brand to-amber"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
      {/* Vertical, `lg:` up — paired with the sticky column beside it. */}
      <span className="relative hidden h-28 w-[3px] overflow-hidden rounded-full bg-navy/10 lg:block">
        <span
          ref={fillRefV}
          className="absolute inset-0 origin-top rounded-full bg-linear-to-b from-brand to-amber"
          style={{ transform: "scaleY(0)" }}
        />
      </span>
    </div>
  );
}
