"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import SpiralAnimation from "@/components/ui/SpiralAnimation";

/* ------------------------------------------------------------------ *
 * IntroOverlay
 *
 * A once-ever brand intro that doubles as the site's loading screen: an amber
 * spiral forms behind the ACTS wordmark while a brass progress rule fills,
 * then the whole thing hands off to the hero. Shown only on a visitor's first
 * visit (remembered in localStorage) and never under prefers-reduced-motion.
 * Skippable — click anywhere, press Esc, or hit "Skip" — and locks page scroll
 * while visible.
 *
 * The progress is REAL, not a scripted timer. It tracks two signals that
 * actually decide whether the hero behind it will look finished when it lifts:
 * webfonts settling (the wordmark and the display headline both reflow when
 * Jakarta lands) and window load (hero imagery, the mesh canvas). The bar
 * creeps on elapsed time so it never looks stuck, but it is held back from
 * 100% until the page itself reports in.
 *
 * That gives the two properties a loading screen has to have: it cannot lift
 * onto a half-painted page, and it cannot outstay the page being ready. MIN_MS
 * keeps it from flashing past faster than the brand beat can register; MAX_MS
 * is a hard ceiling, so a slow asset can never hold the site hostage.
 *
 * The bar is driven by direct DOM writes from one rAF loop rather than React
 * state: at 60fps a state-per-frame would re-render this whole overlay, and
 * its animating children, sixty times a second to move one transform.
 *
 * Mounted in the root layout, so it decides once per full page load. It renders
 * nothing on the server and on the first client paint (no hydration mismatch),
 * then reveals itself from an effect only when this is a first, motion-OK visit.
 * ------------------------------------------------------------------ */

const SEEN_KEY = "acts-intro-seen";
const MIN_MS = 1100; // never lift faster than the brand beat reads
const MAX_MS = 2400; // hard ceiling, however slow the page is
/* `load` waits on every image on the page, including the client-logo marquee
   far below the fold. Measured on this site, the homepage's `load` can land
   seconds late purely because one 470KB logo is still going through the image
   optimizer — nothing a visitor looking at the hero can perceive. So `load` is
   treated as a bonus, not a gate: if it hasn't arrived by PAINT_FALLBACK_MS the
   hero is painted regardless and the signal is marked satisfied. */
const PAINT_FALLBACK_MS = 1200;

/* Weights sum to 1. Fonts carry the larger share because a font swap is the
   one change a visitor actually sees the hero make after the fact. */
const W_FONTS = 0.6;
const W_PAINT = 0.4;
/* The hand-off is staged, not a single crossfade. A crossfade puts a 96px
   wordmark on top of the hero headline for its whole duration, which is the
   one frame of the intro that looks like a mistake. So the mark dissolves
   first (MARK_OUT_MS), and only then does the curtain lift (FADE_MS), which
   reads as passing the page forward. */
const MARK_OUT_MS = 280;
const FADE_MS = 560;
const TOTAL_OUT_MS = MARK_OUT_MS + FADE_MS;

// The wordmark spells itself out one letter at a time.
const LETTERS = ["A", "C", "T", "S"];
const REVEAL_BASE = 0.12; // when the first letter starts (s)
const REVEAL_GAP = 0.14; // beat between letters (s)
const WORDMARK_DONE = REVEAL_BASE + LETTERS.length * REVEAL_GAP;

/** Takes down the pre-paint curtain raised by the layout's inline script. */
function dropCurtain() {
  document.documentElement.classList.remove("intro-pending");
}

export default function IntroOverlay() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  /** Readiness signals, keyed so a signal can only ever be counted once. */
  const signalsRef = useRef<Record<string, number>>({});
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closingRef = useRef(false);

  // First-visit + motion check (client-only → no SSR mismatch). Mark as seen
  // immediately so a refresh mid-intro doesn't replay it.
  useEffect(() => {
    // The pre-paint script is deliberately cheap and can raise the curtain in
    // cases this component then declines. Clearing it on every path that does
    // NOT go on to show the intro is what guarantees the curtain always has an
    // owner to take it down.
    if (reduced) {
      dropCurtain();
      return;
    }
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked — treat as seen so we don't gate the site */
      seen = true;
    }
    if (seen) {
      dropCurtain();
      return;
    }
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    // The first client render must match the server (nothing shown); this
    // first-visit + reduced-motion check can only run after mount, so revealing
    // the intro is a deliberate post-mount setState, not a cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
  }, [reduced]);

  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    doneTimer.current = setTimeout(() => setShow(false), TOTAL_OUT_MS);
  }, []);

  // Readiness signals. Both have to land for the bar to reach 100%.
  useEffect(() => {
    if (!show) return;
    let live = true;
    const mark = (key: string, weight: number) => {
      if (live) signalsRef.current[key] = weight;
    };

    // A failed font load must not strand the bar — settle the weight either way.
    document.fonts?.ready.then(
      () => mark("fonts", W_FONTS),
      () => mark("fonts", W_FONTS)
    );

    const onPainted = () => mark("paint", W_PAINT);
    let fallback: ReturnType<typeof setTimeout> | undefined;
    if (document.readyState === "complete") onPainted();
    else {
      window.addEventListener("load", onPainted, { once: true });
      fallback = setTimeout(onPainted, PAINT_FALLBACK_MS);
    }

    return () => {
      live = false;
      window.removeEventListener("load", onPainted);
      clearTimeout(fallback);
    };
  }, [show]);

  // While visible: lock scroll, drive the bar, allow Esc to skip.
  useEffect(() => {
    if (!show) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    const t0 = performance.now();
    let raf = 0;
    let value = 0;
    let curtainDropped = false;

    const tick = (now: number) => {
      // The overlay's own backdrop is painted by the time the first frame
      // runs, so the curtain has done its job. It has to come down here and
      // not at dismiss: it sits at z-99, *under* the overlay, so leaving it up
      // would mean the overlay fades out onto another opaque panel and the
      // page would appear as a hard cut instead of a hand-off.
      if (!curtainDropped) {
        curtainDropped = true;
        dropCurtain();
      }
      const elapsed = now - t0;
      // Past the ceiling we stop waiting on the page and simply finish.
      const ready =
        elapsed >= MAX_MS
          ? 1
          : Object.values(signalsRef.current).reduce((a, b) => a + b, 0);
      // Pace the fill against the brand beat rather than easing toward a fixed
      // target. An exponential ease is what produces the "stuck at 99%" tell:
      // it covers 90% in the first third of the time and then visibly crawls.
      // A linear ramp that lands exactly on MIN_MS reads as a real measurement.
      const paced = elapsed / MIN_MS;
      // Not ready yet: creep on a fraction of that ramp, capped short of full,
      // so the bar always moves but only a ready page can close the last gap.
      if (ready >= 1) {
        // The ramp is already smooth, so track it directly and land on 100%
        // exactly at MIN_MS. Smoothing the final approach instead is what
        // leaves a bar visibly inching through the last few percent.
        // `max` so the bar can never run backwards if creep got ahead of it.
        value = Math.max(value, Math.min(1, paced));
      } else {
        // Not ready: creep on a fraction of the ramp, capped short of full, so
        // the bar always moves but only a ready page closes the last gap.
        const target = Math.min(0.92, paced * (0.35 + ready * 0.5));
        // Light smoothing, so a signal landing accelerates rather than snaps.
        value += (target - value) * 0.2;
        if (Math.abs(target - value) < 0.004) value = target;
      }

      const pct = Math.round(value * 100);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${value})`;
      if (numRef.current) numRef.current.textContent = `${pct}%`;
      trackRef.current?.setAttribute("aria-valuenow", String(pct));

      if (value >= 0.999 && elapsed >= MIN_MS) {
        dismiss();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer.current);
      dropCurtain();
    };
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ACTS"
      aria-busy={!closing}
      onClick={dismiss}
      /* Same `atmosphere` field the hero uses, so the overlay reads as the
         page arriving rather than as a separate screen being taken away. */
      className="atmosphere grain fixed inset-0 z-100 flex cursor-pointer items-center justify-center overflow-hidden transition-opacity ease-out"
      style={{
        opacity: closing ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        // Hold the curtain opaque until the wordmark has gone.
        transitionDelay: closing ? `${MARK_OUT_MS}ms` : "0ms",
      }}
    >
      <SpiralAnimation />

      {/* Soft amber core glow behind the wordmark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-168 w-168 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(240,196,25,0.16), transparent 62%)",
        }}
      />

      {/* Wordmark — the letters arrive one at a time (A · C · T · S), then the
          tagline and the progress rule settle in. On hand-off the whole block
          lifts a little as it fades, so it reads as passing the page forward
          rather than as a panel being switched off. The extra left padding
          offsets the trailing letter-spacing so it stays optically centered. */}
      <motion.div
        className="relative z-10 px-6 text-center"
        animate={
          closing
            ? { opacity: 0, scale: 1.045, y: -8 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: MARK_OUT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* `role="img"` is what makes the label count. The letters below are
            each `aria-hidden` (they are animation targets, not content), so
            this wrapper is the only thing left to name the wordmark — and
            `aria-label` is prohibited on a plain div with no role, meaning it
            was being dropped outright and the mark announced as nothing. */}
        <div
          role="img"
          aria-label="ACTS"
          className="pl-[0.3em] text-6xl font-extrabold tracking-[0.3em] text-white md:text-8xl"
          style={{ textShadow: "0 2px 42px rgba(0,0,0,0.55)" }}
        >
          {LETTERS.map((ch, i) => (
            <motion.span
              key={ch}
              aria-hidden
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: REVEAL_BASE + i * REVEAL_GAP,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: WORDMARK_DONE }}
          className="mt-5 pl-[0.36em] text-[10px] font-semibold uppercase tracking-[0.36em] text-amber md:text-xs"
        >
          Advanced Company for Trading Services
        </motion.div>

        {/* The brass rule doubles as the loading bar: it draws in once the
            wordmark is complete, then fills with real progress. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: WORDMARK_DONE + 0.12 }}
          className="mx-auto mt-9 flex w-72 max-w-[72vw] items-center gap-4"
        >
          {/* Mirrors the readout's width so the track itself stays optically
              centered under the wordmark, not shunted left by the number. */}
          <span aria-hidden className="w-9 shrink-0" />
          <div
            ref={trackRef}
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/15"
          >
            <div
              ref={fillRef}
              aria-hidden
              className="absolute inset-0 origin-left rounded-full bg-amber rtl:origin-right"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span
            ref={numRef}
            aria-hidden
            className="ltr-inline w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-white/55"
          >
            0%
          </span>
        </motion.div>
      </motion.div>

      {/* Skip affordance. Sized to a real 44px target rather than bare text. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute bottom-5 right-5 z-10 inline-flex min-h-11 items-center rounded-full px-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50 transition-colors hover:bg-white/5 hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}
