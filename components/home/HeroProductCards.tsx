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
 *  4. Image preview and navigation are two separate controls, not one, at
 *     every width — no device branch. The image stack is a <button> that
 *     advances through that brand's public/images/<brand>/ folder on click
 *     (works for touch) and additionally on mouse hover (`pointerType ===
 *     "mouse"`, which also reverts to the lead image on leave — the browse
 *     behavior a touch tap has no equivalent for). A dot row shows position.
 *     A separate, persistent CTA chip at the card's foot is the actual
 *     <Link> to the brand page. Only `active` and the next image in
 *     sequence are ever mounted — not the full range — so advancing is an
 *     instant crossfade (the next frame is already loaded) without paying
 *     for every image up front.
 *
 * Stacking order is fixed at rest (center on top, via baseZ) and only
 * changes when a card is engaged — it never reorders on its own.
 * Respects prefers-reduced-motion (no float, no engagement motion, instant
 * image swap, entrance is opacity-only).
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
  // Index 0 is the resting/lead image; advancing cycles through the rest.
  const [active, setActive] = useState(0);
  const many = card.images.length > 1;
  const touchEngageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (touchEngageTimer.current) clearTimeout(touchEngageTimer.current);
    };
  }, []);

  function clearTouchEngageTimer() {
    if (touchEngageTimer.current) {
      clearTimeout(touchEngageTimer.current);
      touchEngageTimer.current = null;
    }
  }
  function engage() {
    clearTouchEngageTimer();
    onEngageStart();
  }
  function handlePointerEnter() {
    engage();
  }
  function handlePointerLeave(e: ReactPointerEvent) {
    // A held touch keeps the card engaged for TOUCH_ENGAGE_MS regardless of
    // this pointerleave (which fires almost immediately around a tap).
    if (e.pointerType === "mouse") onEngageEnd();
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

  function advance() {
    if (!many) return;
    setActive((cur) => (cur + 1) % card.images.length);
  }
  function handleImagePointerEnter(e: ReactPointerEvent) {
    // Mouse hover keeps its original "browse the range" behavior; touch
    // advances on click instead (handled below), since it has no hover.
    if (e.pointerType === "mouse") advance();
  }
  function handleImagePointerLeave(e: ReactPointerEvent) {
    if (e.pointerType === "mouse") setActive(0);
  }

  const nextIdx = many ? (active + 1) % card.images.length : active;
  // Only the current frame and the one that advancing would show next are
  // ever mounted — never the full range — so the crossfade is instant
  // without paying to preload every image up front.
  const visibleIdx = Array.from(new Set([active, nextIdx]));

  const orbitStyle = reduced
    ? undefined
    : ({
        "--orb-x": `${card.orbitX}px`,
        "--orb-y": `${card.orbitY}px`,
        "--orb-dur": `${card.orbitDuration}s`,
        "--orb-delay": `${card.orbitDelay}s`,
        animationPlayState: isEngaged ? "paused" : "running",
      } as CSSProperties);

  return (
    // Layer A — home position + z-index + one-time entrance "deal".
    <motion.div
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 44, scale: 0.94, rotate: card.baseRotate * 0.35 }
      }
      animate={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, rotate: card.baseRotate }
      }
      transition={{
        duration: 0.85,
        delay: 0.2 + card.dealOrder * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ zIndex }}
      className={`absolute ${card.position}`}
    >
      {/* Layer F — orbital drift, plain CSS, own arc and period per card.
          Paused while this card is engaged, so the lift is uncontested and
          the card is not a moving target the moment you reach for it. */}
      <div
        className={reduced ? undefined : "hero-card-orbit"}
        style={orbitStyle}
      >
        {/* Layer B — engagement response: lift + straighten + come forward,
            or recede slightly if a sibling is engaged. Rotate values here
            are corrections against Layer A's base rotate (they compose),
            tuned so an engaged card lands near level rather than fully
            upright. */}
        <motion.div
          animate={
            reduced
              ? undefined
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
          {/* Image stack — previews the brand's product range. Click (and
              mouse hover) advances; navigation lives on the CTA chip below,
              not here, so the same interaction works at every width. */}
          <button
            type="button"
            onClick={advance}
            onPointerEnter={handleImagePointerEnter}
            onPointerLeave={handleImagePointerLeave}
            aria-label={
              many
                ? `Next ${card.brand} image, ${active + 1} of ${card.images.length}`
                : card.brand
            }
            className="block w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
          >
            <div className="relative aspect-3/4 w-full">
              {visibleIdx.map((idx) => (
                <Image
                  key={card.images[idx]}
                  src={card.images[idx]}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 240px, 288px"
                  priority={card.center && idx === 0}
                  className="object-cover transition-opacity ease-in-out"
                  style={{
                    opacity: idx === active ? 1 : 0,
                    zIndex: idx === active ? 1 : 0,
                    transitionDuration: reduced ? "0ms" : "130ms",
                  }}
                />
              ))}
            </div>
          </button>

          {/* Dot row — shows position in the range for touch users, who
              have no hover state to reveal it incidentally. Decorative: the
              button's aria-label already states position in words.
              z-10: the active <Image> inside the button carries its own
              inline z-index (to crossfade above its sibling frame), which
              is a positioned descendant of the SAME stacking context as
              this row and the chip below — without an explicit z-index
              here, the image's z-index:1 would silently outrank both. */}
          {many && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-11 z-10 flex justify-center gap-1"
              aria-hidden
            >
              {card.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === active ? "w-3.5 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Persistent CTA chip — the card's only navigation affordance.
              z-10 for the same reason as the dot row above. */}
          <Link
            href={`/brands/${card.slug}`}
            aria-label={`${card.brand}, view brand page`}
            className="tap-target absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-navy shadow-md backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            View products
            <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
