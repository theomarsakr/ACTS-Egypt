"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * BrandHeroVideo — a full-bleed, muted, looping background clip for a brand hero.
 *
 * The poster paints instantly as the base layer; the video fades in over it once
 * it starts playing, so there's never a blank frame. Purely decorative
 * (aria-hidden, no audio, no controls, not focusable).
 *
 * Delivery is adaptive:
 *  - Phones (<768px) get the center-cropped mobile encode (~⅓ the bytes, and
 *    portrait screens crop far less of the frame).
 *  - Data-Saver / 2G connections and prefers-reduced-motion never mount the
 *    <video> at all — those visitors keep the still poster and download nothing.
 *  - Playback is tied to visibility: the loop pauses when the hero scrolls
 *    out of view and resumes when it returns (battery + CPU on mobile).
 */
export default function BrandHeroVideo({
  src,
  srcMobile,
  poster,
  dim,
}: {
  src: string;
  /** Smaller focal-cropped encode served to narrow viewports. */
  srcMobile?: string;
  poster: string;
  /** Optional opacity utilities that wash the media layer over the navy base. */
  dim?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Which file to load, or null → no <video> at all (SSR, reduced motion, or
  // data-saving connections). Read through useSyncExternalStore rather than
  // resolved into state from an effect: the answer genuinely differs between
  // server and client, which is exactly what that hook is for, and it costs
  // one render pass instead of two. Subscribing to the two media queries also
  // means a tablet rotated across the 768px breakpoint picks up the encode
  // cropped for its new orientation, which the mount-once version never did.
  const activeSrc = useSyncExternalStore<string | null>(
    useCallback((onStoreChange: () => void) => {
      const queries = [
        window.matchMedia("(prefers-reduced-motion: reduce)"),
        window.matchMedia("(max-width: 767px)"),
      ];
      queries.forEach((q) => q.addEventListener("change", onStoreChange));
      return () =>
        queries.forEach((q) => q.removeEventListener("change", onStoreChange));
    }, []),
    useCallback(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
      type NetInfo = { saveData?: boolean; effectiveType?: string };
      const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
      if (conn?.saveData) return null;
      if (/(^|-)2g$/.test(conn?.effectiveType ?? "")) return null;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      return mobile && srcMobile ? srcMobile : src;
    }, [src, srcMobile]),
    () => null
  );

  // Play while the hero is on screen, pause the loop once it scrolls away.
  useEffect(() => {
    const el = ref.current;
    if (!el || !activeSrc) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // .catch: autoplay blocked (e.g. iOS Low Power Mode) — poster stays.
          el.play()
            .then(() => setPlaying(true))
            .catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [activeSrc]);

  return (
    <div className={`absolute inset-0 ${dim ?? ""}`} aria-hidden>
      {/* Poster base layer — visible immediately and for poster-only visitors */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {activeSrc && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={activeSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
