"use client";

import Image from "next/image";
import { useEffect, useState, memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ *
 * AutoRotateImage
 *
 * A fill image that advances to the next src on a timer with a soft
 * crossfade — used by the homepage "Represented brands" cards to slowly
 * rotate through each brand's product images. `startDelayMs` staggers the
 * three cards so they don't flip in unison. Respects prefers-reduced-motion
 * (stays on the first image, no timer, instant if it ever changes) and
 * pauses while the tab is hidden.
 * ------------------------------------------------------------------ */

function AutoRotateImage({
  images,
  alt,
  sizes,
  imgClassName,
  leadSrc,
  leadClassName,
  intervalMs = 8000,
  startDelayMs = 0,
}: {
  images: string[];
  alt: string;
  sizes?: string;
  imgClassName?: string;
  /** One src that gets `leadClassName` instead of `imgClassName` — lets the
      clean lead cut-out use a different fit than the datasheet frames. Passed
      as plain strings since this renders under a Server Component. */
  leadSrc?: string;
  leadClassName?: string;
  intervalMs?: number;
  startDelayMs?: number;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || images.length <= 1) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        if (document.hidden) return; // don't advance off-screen
        setIndex((n) => (n + 1) % images.length);
      }, intervalMs);
    }, startDelayMs);
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [reduced, images.length, intervalMs, startDelayMs]);

  const src = images[index] ?? images[0];
  // Resolve per-image so the lead cut-out and the datasheet frames can differ.
  const cls = leadSrc && src === leadSrc ? leadClassName ?? imgClassName : imgClassName;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.3, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill sizes={sizes} className={cls} priority={index === 0} />
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(AutoRotateImage);
