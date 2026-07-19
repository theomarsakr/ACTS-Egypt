"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import { brandProductImages } from "@/lib/brandProductImages";

/* ------------------------------------------------------------------ *
 * HeroProductCards
 *
 * The three overlapping brand spec-cards in the hero (Farris / Dyna-Flo /
 * EST). Resting composition — positions, rotation angles, sizes, shadows —
 * is preserved exactly. Two behaviours:
 *
 *  1. Orbital shuffle: every card drifts along a small ellipse, phase-offset
 *     120° apart, while a shared rAF loop re-ranks z-index by orbital depth so
 *     the three continuously rotate through front / middle / back. Slow and
 *     elegant (~6s per revolution); center starts on top like the original.
 *
 *  2. Hover-to-preview: hovering a card swaps to the next image from that
 *     brand's public/images/<brand>/ folder (advancing on each hover so you
 *     can browse the range); leaving reverts to the lead image. Every image is
 *     rendered up-front (preloaded on mount) and toggled with a fast 130ms
 *     opacity crossfade, so the swap is instant — no on-hover load latency.
 *
 * Transform separation note: orbital x/y + base rotation live on `motion`
 * (transform), while the center card's `-translate-x-1/2` centering uses the
 * CSS `translate` property (Tailwind v4) — the two compose without fighting.
 * Respects prefers-reduced-motion (no orbit, static z, instant image swap).
 * ------------------------------------------------------------------ */

type Card = {
  brand: string;
  images: string[];
  /** absolute position + width only — no rotation, no z-index */
  position: string;
  baseRotate: number;
  baseZ: number;
  center?: boolean;
};

const cards: Card[] = [
  {
    brand: "Farris Engineering",
    images: brandProductImages.farris,
    position: "left-0 top-10 w-40 sm:w-48 md:w-56 lg:w-64",
    baseRotate: -6,
    baseZ: 10,
  },
  {
    brand: "Dyna-Flo",
    images: brandProductImages.dynaflo,
    position: "left-1/2 -translate-x-1/2 -top-2 w-44 sm:w-52 md:w-60 lg:w-72",
    baseRotate: 2,
    baseZ: 20, // center sits on top at rest, as before
    center: true,
  },
  {
    brand: "EST Group",
    images: brandProductImages.est,
    position: "right-0 top-24 w-40 sm:w-48 md:w-56 lg:w-64",
    baseRotate: 6,
    baseZ: 10,
  },
];

// Orbit tuning — subtle, elegant, ~6s per revolution.
const ORBIT_PERIOD = 6; // seconds
const ORBIT_RX = 18; // px, horizontal arc
const ORBIT_RY = 11; // px, vertical arc
// Phases (deg) chosen so the center card sits on top at t=0 (sin peak = front).
const ORBIT_PHASES = [-Math.PI / 6, Math.PI / 2, (7 * Math.PI) / 6];

export default function HeroProductCards() {
  const reduced = useReducedMotion();

  // Orbital offset per card (transform translate); updated in a rAF loop
  // without re-rendering. z-index is React state (changes only a few times
  // per revolution, when the depth ranking flips).
  const x0 = useMotionValue(0);
  const y0 = useMotionValue(0);
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const orbits = [
    { x: x0, y: y0 },
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
  const [zOrder, setZOrder] = useState<number[]>([10, 20, 10]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    const loop = (now: number) => {
      if (!last) last = now;
      // Clamp the delta so returning from a hidden tab doesn't jump the orbit.
      elapsed += Math.min(now - last, 100);
      last = now;
      const t = elapsed / 1000;
      const depth = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        const a = (2 * Math.PI * t) / ORBIT_PERIOD + ORBIT_PHASES[i];
        orbits[i].x.set(ORBIT_RX * Math.cos(a));
        orbits[i].y.set(ORBIT_RY * Math.sin(a));
        depth[i] = Math.sin(a); // higher = nearer the front
      }
      // Rank by depth: lowest → back (z 10), highest → front (z 30). The two
      // side cards never overlap each other, so ties between them are harmless.
      const order = [0, 1, 2].sort((p, q) => depth[p] - depth[q]);
      const nz = [0, 0, 0];
      nz[order[0]] = 10;
      nz[order[1]] = 20;
      nz[order[2]] = 30;
      setZOrder((prev) =>
        prev[0] === nz[0] && prev[1] === nz[1] && prev[2] === nz[2] ? prev : nz
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // orbits holds stable motion values; effect only needs to (re)start on
    // reduced-motion change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <>
      {cards.map((card, i) => (
        <ProductCard
          key={card.brand}
          card={card}
          index={i}
          orbit={orbits[i]}
          zIndex={reduced ? card.baseZ : zOrder[i]}
          reduced={!!reduced}
        />
      ))}
    </>
  );
}

function ProductCard({
  card,
  index,
  orbit,
  zIndex,
  reduced,
}: {
  card: Card;
  index: number;
  orbit: { x: MotionValue<number>; y: MotionValue<number> };
  zIndex: number;
  reduced: boolean;
}) {
  // Index 0 is the resting/lead image; hover advances, leave reverts to it.
  const [active, setActive] = useState(0);
  const nextRef = useRef(1);
  const many = card.images.length > 1;

  function handleEnter() {
    if (!many) return;
    setActive(nextRef.current);
    nextRef.current = (nextRef.current + 1) % card.images.length;
  }
  function handleLeave() {
    setActive(0);
  }

  return (
    // Layer A — home position + z-index + one-time entrance reveal.
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.25 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ zIndex }}
      className={`absolute ${card.position}`}
    >
      {/* Layer B — orbital drift (x/y) + static base rotation. */}
      <motion.div style={{ x: orbit.x, y: orbit.y, rotate: card.baseRotate }}>
        {/* Card visual — hover previews the brand's product range. */}
        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          aria-hidden
          className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/60 ring-1 ring-white/15 transition-shadow duration-300 hover:ring-amber/60"
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
        </div>
      </motion.div>
    </motion.div>
  );
}
