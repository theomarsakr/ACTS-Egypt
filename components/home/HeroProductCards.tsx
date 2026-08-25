"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
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
 *     Paused while that card is hovered.
 *
 *  3. Hover response (Layer B, motion spring): the hovered card lifts,
 *     straightens toward level, and comes to front; its siblings recede
 *     slightly. Interruptible, spring-driven.
 *
 *  4. Hover-to-preview: hovering a card swaps to the next image from that
 *     brand's public/images/<brand>/ folder (advancing on each hover so you
 *     can browse the range); leaving reverts to the lead image. Every image
 *     is rendered up-front (preloaded on mount) and toggled with a fast
 *     130ms opacity crossfade, so the swap is instant.
 *
 * Stacking order is fixed at rest (center on top, via baseZ) and only
 * changes when a card is hovered — it never reorders on its own.
 * Respects prefers-reduced-motion (no float, no hover motion, instant image
 * swap, entrance is opacity-only).
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

export default function HeroProductCards() {
  const reduced = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {cards.map((card, i) => (
        <ProductCard
          key={card.brand}
          card={card}
          isHovered={hoveredIndex === i}
          siblingHovered={hoveredIndex !== null && hoveredIndex !== i}
          zIndex={hoveredIndex === i ? 40 : card.baseZ}
          reduced={!!reduced}
          onHoverStart={() => setHoveredIndex(i)}
          onHoverEnd={() =>
            setHoveredIndex((cur) => (cur === i ? null : cur))
          }
        />
      ))}
    </>
  );
}

function ProductCard({
  card,
  isHovered,
  siblingHovered,
  zIndex,
  reduced,
  onHoverStart,
  onHoverEnd,
}: {
  card: Card;
  isHovered: boolean;
  siblingHovered: boolean;
  zIndex: number;
  reduced: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  // Index 0 is the resting/lead image; hover advances, leave reverts to it.
  const [active, setActive] = useState(0);
  const nextRef = useRef(1);
  const many = card.images.length > 1;

  function handleEnter() {
    onHoverStart();
    if (!many) return;
    setActive(nextRef.current);
    nextRef.current = (nextRef.current + 1) % card.images.length;
  }
  function handleLeave() {
    onHoverEnd();
    setActive(0);
  }

  const orbitStyle = reduced
    ? undefined
    : ({
        "--orb-x": `${card.orbitX}px`,
        "--orb-y": `${card.orbitY}px`,
        "--orb-dur": `${card.orbitDuration}s`,
        "--orb-delay": `${card.orbitDelay}s`,
        animationPlayState: isHovered ? "paused" : "running",
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
          Paused while this card is hovered, so the lift is uncontested and
          the card is not a moving click target the moment you reach for it. */}
      <div
        className={reduced ? undefined : "hero-card-orbit"}
        style={orbitStyle}
      >
        {/* Layer B — hover response: lift + straighten + come forward, or
            recede slightly if a sibling is hovered. Rotate values here are
            corrections against Layer A's base rotate (they compose), tuned
            so a hovered card lands near level rather than fully upright. */}
        <motion.div
          animate={
            reduced
              ? undefined
              : isHovered
                ? {
                    y: -10,
                    scale: 1.025,
                    rotate: card.baseRotate * -0.65,
                    opacity: 1,
                  }
                : siblingHovered
                  ? { y: 0, scale: 0.985, rotate: 0, opacity: 0.82 }
                  : { y: 0, scale: 1, rotate: 0, opacity: 1 }
          }
          transition={HOVER_SPRING}
        >
          {/* Card visual — hover previews the brand's product range, click
              navigates to that brand's page. */}
          <Link
            href={`/brands/${card.slug}`}
            aria-label={`${card.brand}, view brand page`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="block overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/60 ring-1 ring-white/15 transition-shadow duration-300 hover:shadow-black/70 hover:ring-amber/60 focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
          >
            <div className="relative aspect-3/4 w-full">
              {/* Every image is rendered (preloaded on mount); the active one is
                  faded in. Instant swap on hover, only the crossfade is visible. */}
              {card.images.map((img, idx) => (
                <Image
                  key={img}
                  src={img}
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
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
