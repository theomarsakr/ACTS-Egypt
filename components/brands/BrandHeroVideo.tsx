"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BrandHeroVideo — a full-bleed, muted, looping background clip for a brand hero.
 *
 * The poster paints instantly as the base layer; the video fades in over it once
 * it starts playing, so there's never a blank frame. Purely decorative
 * (aria-hidden, no audio, no controls, not focusable). It honours
 * prefers-reduced-motion by never starting playback — those users are left on the
 * still poster (the video sits at opacity-0 above it). Playback is kicked off via
 * play() from an effect (not the autoplay attribute) so that gate is respected.
 */
export default function BrandHeroVideo({
  src,
  poster,
  dim,
}: {
  src: string;
  poster: string;
  /** Optional opacity utilities that wash the media layer over the navy base. */
  dim?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // .then()/.catch() run after the effect commits, so no cascading render.
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        /* autoplay blocked — poster stays, no error surfaced to the user */
      });
  }, []);

  return (
    <div className={`absolute inset-0 ${dim ?? ""}`} aria-hidden>
      {/* Poster base layer — visible immediately and for reduced-motion users */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
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
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
