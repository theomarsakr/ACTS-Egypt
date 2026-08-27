"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { brandProductImages } from "@/lib/brandProductImages";

/* ------------------------------------------------------------------ *
 * HeroProductCards
 *
 * The three overlapping brand spec-cards in the hero (Farris / Dyna-Flo /
 * EST). Resting composition — positions, rotation angles, sizes, shadows —
 * is preserved exactly. Motion is layered and each layer owns one concern:
 *
 *  1. Entrance (Layer A): a one-time "deal" on mount — the center card
 *     lands first, then the two wings open outward into their resting
 *     angle. Uses the site's signature ease [0.16, 1, 0.3, 1].
 *
 *  2. Orbital drift (plain CSS): each card tracks a slow ellipse. The arcs are
 *     scaled by apparent depth — the front card travels furthest, the two set
 *     back travel less — so the group reads as three objects held at
 *     different distances rather than three sprites sliding in step, and the
 *     periods (19s / 23s / 26s) share no factors, so they never re-sync.
 *     Paused while that card is "engaged" (see below).
 *
 *  3. Engagement response (Layer B, motion spring): the engaged card lifts,
 *     straightens toward level, and comes to front; its siblings recede
 *     slightly. Interruptible, spring-driven. "Engaged" is pointer-enter or
 *     focus (parity with mouse hover), plus pointerdown held for ~2.5s —
 *     a mouse can hover indefinitely, but a tap has no equivalent "still
 *     over it" state, so without the hold a touch user reaching for the
 *     card would be chasing a moving target the instant they touch it.
 *
 *  4. Browsing the range. Every shot in public/images/<brand>/ carries a
 *     baked-in brand band across its bottom fifth (brand, product name, ACTS
 *     logo, "Sole Agent, Egypt"), so nothing may float over the image foot —
 *     the CTA and the position dots both live in a rail *below* the image,
 *     and the image area is left entirely to the photograph.
 *
 *     Pointing at a card walks that brand's range in catalogue order — frame
 *     0, 1, 2, … and round again — the order the lines are listed in
 *     brandProductImages, so a reader watching the band can follow the range
 *     as a sequence rather than as a slideshow that jumps about. Pointer-enter
 *     steps one frame immediately, and holding the pointer there keeps
 *     stepping every BROWSE_MS. The cursor survives pointerleave — only the
 *     *displayed* frame falls back to the lead image — so a second and third
 *     visit carry on down the range instead of replaying frame one. Touch has
 *     no hover, so a tap on the image steps the same run by one. Only the lead
 *     frame, the current frame and the one queued next are ever mounted —
 *     never the full range — so each step is an instant crossfade without
 *     paying for every image up front.
 *
 * Stacking order is fixed at rest (center on top, via baseZ) and only
 * changes when a card is engaged — it never reorders on its own.
 * Respects prefers-reduced-motion (no float, no engagement motion, no timed
 * stepping — pointing still advances one frame — instant image swap, and an
 * entrance that crosses to its resting frame instantly rather than being
 * skipped: what the reduced branch changes is the `transition`, never a value
 * that reaches the server-rendered markup. See the note at the entrance.)
 * ------------------------------------------------------------------ */

type Card = {
  brand: string;
  /** Brand slug from lib/data — each card links to its /brands/<slug> page. */
  slug: string;
  images: string[];
  /** absolute position + width only — no rotation, no z-index */
  position: string;
  baseRotate: number;
  baseZ: number;
  /** Entrance order: the center card opens first, then the wings. */
  dealOrder: number;
  /**
   * Orbital drift (CSS custom properties). Amplitudes are calibrated by the
   * card's apparent depth — the front card sweeps the widest arc, the two set
   * back sweep less — and the periods are chosen not to share factors, so the
   * three never fall into step.
   */
  orbitX: number;
  orbitY: number;
  orbitDuration: number;
  orbitDelay: number;
  center?: boolean;
};

const cards: Card[] = [
  {
    brand: "Farris Engineering",
    slug: "farris-engineering",
    images: brandProductImages.farris,
    position: "left-0 top-10 w-40 sm:w-48 md:w-56 lg:w-64",
    baseRotate: -6,
    baseZ: 10,
    dealOrder: 1,
    orbitX: 7,
    orbitY: 5,
    orbitDuration: 23,
    orbitDelay: -3,
  },
  {
    brand: "Dyna-Flo",
    slug: "dyna-flo",
    images: brandProductImages.dynaflo,
    position: "left-1/2 -translate-x-1/2 -top-2 w-44 sm:w-52 md:w-60 lg:w-72",
    baseRotate: 2,
    baseZ: 20, // center sits on top at rest, as before
    dealOrder: 0,
    // Nearest the viewer, so it sweeps the widest arc of the three.
    orbitX: 10,
    orbitY: 7,
    orbitDuration: 19,
    orbitDelay: -11,
    center: true,
  },
  {
    brand: "EST Group",
    slug: "est",
    images: brandProductImages.est,
    position: "right-0 top-24 w-40 sm:w-48 md:w-56 lg:w-64",
    baseRotate: 6,
    baseZ: 10,
    dealOrder: 2,
    orbitX: 8,
    orbitY: 5.5,
    orbitDuration: 26,
    orbitDelay: -17,
  },
];

// Hover spring — same family as the hero's cursor-tilt spring, tuned a
// little snappier since this is direct manipulation.
const HOVER_SPRING = { stiffness: 260, damping: 26, mass: 0.6 };

// How long a touch "engagement" survives after the last pointerdown — long
// enough to look the card over, short enough that it settles back into its
// orbit once you've moved on.
const TOUCH_ENGAGE_MS = 2500;

// How long each frame holds while the pointer stays on a card. Slow enough to
// read the product name in the band, quick enough to get well into a
// twenty-frame range within one unhurried hover.
const BROWSE_MS = 1200;

export default function HeroProductCards() {
  const reduced = useReducedMotion();
  const [engagedIndex, setEngagedIndex] = useState<number | null>(null);

  return (
    <>
      {cards.map((card, i) => (
        <ProductCard
          key={card.brand}
          card={card}
          isEngaged={engagedIndex === i}
          siblingEngaged={engagedIndex !== null && engagedIndex !== i}
          zIndex={engagedIndex === i ? 40 : card.baseZ}
          reduced={!!reduced}
          onEngageStart={() => setEngagedIndex(i)}
          onEngageEnd={() =>
            setEngagedIndex((cur) => (cur === i ? null : cur))
          }
        />
      ))}
    </>
  );
}

function ProductCard({
  card,
  isEngaged,
  siblingEngaged,
  zIndex,
  reduced,
  onEngageStart,
  onEngageEnd,
}: {
  card: Card;
  isEngaged: boolean;
  siblingEngaged: boolean;
  zIndex: number;
  reduced: boolean;
  onEngageStart: () => void;
  onEngageEnd: () => void;
}) {
  const count = card.images.length;
  const many = count > 1;

  /* How far into the range this card has been walked. Frames are visited in
     catalogue order, so the cursor *is* the frame index — there is no
     separate order to hold.

     It deliberately survives pointerleave — that is what makes the second and
     third visit carry on down the range rather than replaying frame one —
     while the displayed frame falls back to the lead whenever nothing is
     pointing at the card. */
  const [cursor, setCursor] = useState(0);
  const [browsing, setBrowsing] = useState(false);

  const touchEngageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const browseTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  /* Whether a mouse run is already going, mirrored in a ref because it gates a
     pointer handler and must not read a render-old value.

     It is load-bearing, not a tidy-up: stepping swaps the <img> under the
     cursor, and Chrome re-runs its hover hit test whenever the DOM beneath a
     stationary pointer changes — so every step dispatches a fresh
     pointerenter (57 of them in 9s, measured, with no matching pointerleave).
     Ungated, enter -> step -> swap -> enter is a runaway loop that walks the
     range at frame rate instead of at BROWSE_MS. pointerleave never fires
     spuriously, so one flag closes it. */
  const running = useRef(false);

  useEffect(() => {
    return () => {
      if (touchEngageTimer.current) clearTimeout(touchEngageTimer.current);
      if (browseTimer.current) clearInterval(browseTimer.current);
    };
  }, []);

  function clearTouchEngageTimer() {
    if (touchEngageTimer.current) {
      clearTimeout(touchEngageTimer.current);
      touchEngageTimer.current = null;
    }
  }
  function stopBrowseTimer() {
    if (browseTimer.current) {
      clearInterval(browseTimer.current);
      browseTimer.current = null;
    }
  }
  function step() {
    setCursor((c) => (c + 1) % count);
  }
  function startBrowsing() {
    if (!many || running.current) return;
    running.current = true;
    setBrowsing(true);
    step();
    if (reduced) return;
    stopBrowseTimer();
    browseTimer.current = setInterval(step, BROWSE_MS);
  }
  function stopBrowsing() {
    running.current = false;
    stopBrowseTimer();
    setBrowsing(false);
  }

  function engage() {
    clearTouchEngageTimer();
    onEngageStart();
  }
  function handlePointerEnter(e: ReactPointerEvent) {
    engage();
    // Mouse only: a touch "enter" fires around a tap and would start a run
    // the finger is already leaving. Touch steps the run by tapping instead.
    if (e.pointerType === "mouse") startBrowsing();
  }
  function handlePointerLeave(e: ReactPointerEvent) {
    // A held touch keeps the card engaged for TOUCH_ENGAGE_MS regardless of
    // this pointerleave (which fires almost immediately around a tap).
    if (e.pointerType !== "mouse") return;
    onEngageEnd();
    stopBrowsing();
  }
  function handleFocus() {
    engage();
  }
  function handleBlur() {
    onEngageEnd();
  }
  function handlePointerDown(e: ReactPointerEvent) {
    if (e.pointerType === "touch") {
      engage();
      touchEngageTimer.current = setTimeout(onEngageEnd, TOUCH_ENGAGE_MS);
    }
  }

  /** Click / Enter on the image — the touch and keyboard equivalent of one
      hover step, advancing the same sequence by one. */
  function advance() {
    if (!many) return;
    setBrowsing(true);
    step();
  }

  const active = browsing ? cursor : 0;
  const upcoming = (cursor + 1) % count;
  // Only the resting frame, the current one and the one a step would show
  // next are ever mounted — never the full range — so stepping is an instant
  // crossfade (the next frame is already loaded) without paying for every
  // image up front.
  const visibleIdx = Array.from(new Set([0, active, upcoming]));

  // Not gated on `reduced` — see the note on the Layer A entrance below. The
  // reduced-motion rule in globals.css already sets `animation: none` on
  // .hero-card-orbit, which leaves every one of these custom properties inert,
  // so branching here would change the server-rendered markup to buy nothing.
  const orbitStyle = {
    "--orb-x": `${card.orbitX}px`,
    "--orb-y": `${card.orbitY}px`,
    "--orb-dur": `${card.orbitDuration}s`,
    "--orb-delay": `${card.orbitDelay}s`,
    animationPlayState: isEngaged ? "paused" : "running",
  } as CSSProperties;

  return (
    // Layer A — home position + z-index + one-time entrance "deal".
    <motion.div
      // `initial` and `animate` are deliberately NOT branched on `reduced`.
      // Both are written into the server-rendered HTML by motion, and
      // useReducedMotion() reports false during SSR but the reader's real OS
      // setting on the client's first render — so a branch here renders one
      // markup on the server and another on the client, which is a hydration
      // mismatch (React #418) that discards and re-renders this whole subtree
      // for exactly the readers who asked for less work. The reduced-motion
      // contract is honoured on `transition` instead: same start and end
      // frames, crossed instantly. Anything that reaches the SSR markup must
      // stay identical in both branches; only post-hydration values may differ.
      initial={{ opacity: 0, y: 44, scale: 0.94, rotate: card.baseRotate * 0.35 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: card.baseRotate }}
      transition={
        reduced
          ? { duration: 0, delay: 0 }
          : {
              duration: 0.85,
              delay: 0.2 + card.dealOrder * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      style={{ zIndex }}
      className={`absolute ${card.position}`}
    >
      {/* Layer F — orbital drift, plain CSS, own arc and period per card.
          Paused while this card is engaged, so the lift is uncontested and
          the card is not a moving target the moment you reach for it. */}
      <div
        className="hero-card-orbit"
        style={orbitStyle}
      >
        {/* Layer B — engagement response: lift + straighten + come forward,
            or recede slightly if a sibling is engaged. Rotate values here
            are corrections against Layer A's base rotate (they compose),
            tuned so an engaged card lands near level rather than fully
            upright.

            The pointer handlers sit on the whole card, not on the image
            alone, so reaching for the CTA in the rail below does not read as
            leaving the card and cut the run short. */}
        <motion.div
          animate={
            // The resting pose, not `undefined`: with no `initial` prop motion
            // server-renders `animate`, and on the server this branch is the
            // un-engaged case below. Spelling the reduced case out identically
            // keeps the SSR markup byte-for-byte the same either way, while
            // still refusing every engagement move.
            reduced
              ? { y: 0, scale: 1, rotate: 0, opacity: 1 }
              : isEngaged
                ? {
                    y: -10,
                    scale: 1.025,
                    rotate: card.baseRotate * -0.65,
                    opacity: 1,
                  }
                : siblingEngaged
                  ? { y: 0, scale: 0.985, rotate: 0, opacity: 0.82 }
                  : { y: 0, scale: 1, rotate: 0, opacity: 1 }
          }
          transition={HOVER_SPRING}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="relative rounded-2xl bg-white shadow-2xl shadow-black/60 ring-1 ring-white/15 transition-shadow duration-300 hover:shadow-black/70 hover:ring-amber/60"
        >
          {/* Image stack — nothing is drawn over it, so the brand band baked
              into the foot of every shot stays legible. Click (or Enter)
              steps the run by one, for touch and keyboard. */}
          <button
            type="button"
            onClick={advance}
            aria-label={
              many
                ? `Next ${card.brand} image, ${active + 1} of ${count}`
                : card.brand
            }
            className="block w-full cursor-pointer overflow-hidden rounded-t-2xl focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
          >
            <div className="relative aspect-3/4 w-full">
              {visibleIdx.map((idx) => (
                <Image
                  key={card.images[idx]}
                  src={card.images[idx]}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 240px, 288px"
                  // `preload` is the Next 16 spelling of the deprecated
                  // `priority`. Only the centre card's resting frame gets it:
                  // it is the one image the fold is built around, and the two
                  // flanking cards would just split the preload budget.
                  preload={card.center && idx === 0}
                  className="object-cover transition-opacity ease-in-out"
                  style={{
                    opacity: idx === active ? 1 : 0,
                    zIndex: idx === active ? 1 : 0,
                    // Constant for the same SSR-parity reason as above;
                    // globals.css zeroes it under reduced motion, where a
                    // CSS !important rule outranks this inline value.
                    transitionDuration: "130ms",
                  }}
                />
              ))}
            </div>
          </button>

          {/* Foot rail — the card's own strip under the photograph. Both the
              position dots and the CTA live here rather than floating over
              the image, which is what had the chip sitting on top of the
              baked-in "Sole Agent, Egypt" line. */}
          <div className="px-2 pt-1.5 pb-2">
            {/* Dot row — position in the range for touch users, who have no
                hover state to reveal it incidentally. Decorative: the
                button's aria-label already states position in words. */}
            {many && (
              <div className="mb-1.5 flex justify-center gap-[3px]" aria-hidden>
                {card.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === active ? "w-3 bg-navy" : "w-1 bg-navy/25"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* The card's only navigation affordance, in the site's brass —
                the same bg-brand/text-white pairing every primary button on
                the site uses (5.0:1, clears AA), so the three cards read as
                one CTA family with "Request a quote" in the nav above them
                rather than as a fourth navy element in a navy hero.

                Focus ring goes navy with it: --focus-ring is amber only on
                the bg-navy/bg-ink surfaces, and amber-on-brass is far too
                close in value to see. Navy reads against both the brass pill
                and the white rail it sits on. */}
            <Link
              href={`/brands/${card.slug}`}
              aria-label={`${card.brand}, view brand page`}
              className="tap-target flex items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold leading-none text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              View products
              <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
