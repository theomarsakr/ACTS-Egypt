"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import SpiralAnimation from "@/components/ui/SpiralAnimation";

/* ------------------------------------------------------------------ *
 * IntroOverlay
 *
 * A once-ever brand intro: an amber spiral forms behind the ACTS wordmark, then
 * the whole thing fades into the site. Shown only on a visitor's first visit
 * (remembered in localStorage) and never under prefers-reduced-motion. Fully
 * skippable — click anywhere, press Esc, or hit "Skip" — and auto-dismisses
 * after a short hold. Locks page scroll while visible.
 *
 * Mounted in the root layout, so it decides once per full page load. It renders
 * nothing on the server and on the first client paint (no hydration mismatch),
 * then reveals itself from an effect only when this is a first, motion-OK visit.
 * ------------------------------------------------------------------ */

const SEEN_KEY = "acts-intro-seen";
const HOLD_MS = 3500; // time on screen before it auto-fades
const FADE_MS = 700; // fade-out duration

// The wordmark spells itself out one letter at a time.
const LETTERS = ["A", "C", "T", "S"];
const REVEAL_BASE = 0.4; // when the first letter starts (s)
const REVEAL_GAP = 0.4; // beat between letters (s)

export default function IntroOverlay() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // First-visit + motion check (client-only → no SSR mismatch). Mark as seen
  // immediately so a refresh mid-intro doesn't replay it.
  useEffect(() => {
    if (reduced) return;
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked — treat as seen so we don't gate the site */
      seen = true;
    }
    if (seen) return;
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

  // While visible: lock scroll, arm the auto-dismiss, allow Esc to skip.
  useEffect(() => {
    if (!show) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    holdTimer.current = setTimeout(dismiss, HOLD_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(holdTimer.current);
      clearTimeout(doneTimer.current);
    };
  }, [show]);

  function dismiss() {
    clearTimeout(holdTimer.current);
    setClosing(true);
    doneTimer.current = setTimeout(() => setShow(false), FADE_MS);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="ACTS intro"
      onClick={dismiss}
      className="fixed inset-0 z-100 flex cursor-pointer items-center justify-center overflow-hidden bg-ink transition-opacity ease-out"
      style={{ opacity: closing ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
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

      {/* Wordmark — the letters arrive one at a time (A · C · T · S), then a rule
          and the tagline settle in. The extra left padding offsets the trailing
          letter-spacing so it stays optically centered. */}
      <div className="relative z-10 px-6 text-center">
        <div
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
                duration: 0.62,
                delay: REVEAL_BASE + i * REVEAL_GAP,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Brass rule draws in once the wordmark is complete. */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: REVEAL_BASE + LETTERS.length * REVEAL_GAP,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-6 h-px w-16 origin-center bg-amber/70"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: REVEAL_BASE + LETTERS.length * REVEAL_GAP + 0.3,
          }}
          className="mt-5 pl-[0.36em] text-[10px] font-semibold uppercase tracking-[0.36em] text-amber md:text-xs"
        >
          Advanced Company for Trading Services
        </motion.div>
      </div>

      {/* Skip affordance. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute bottom-7 right-7 z-10 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}
