"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const RotatingEarth = dynamic(() => import("@/components/home/RotatingEarth"), {
  ssr: false,
});

/**
 * RotatingEarthLazy — mounts the globe (and the ~70KB of d3 it pulls in)
 * only once its section scrolls near the viewport, rather than paying for
 * that download and parse on every homepage visit regardless of how far
 * anyone scrolls. `next/dynamic` with `ssr: false` alone isn't enough here:
 * a component that *is* server-rendered still has its client chunk fetched
 * during hydration, whether or not it's ever scrolled into view — the actual
 * deferral comes from not rendering the real component at all until this
 * IntersectionObserver fires. The placeholder reserves the same footprint so
 * nothing shifts when it swaps in — `aspect-square` with only `maxWidth`
 * capped, not a fixed height: the real canvas is always square (its own
 * `maxWidth: 100%, height: auto`), so a fixed height here that doesn't
 * shrink with the clamped width reserves a box taller than the globe that
 * actually mounts — on a 390px phone, ~170px of dead space above whatever
 * follows, which is exactly the CLS this is supposed to prevent.
 */
export default function RotatingEarthLazy({
  width = 520,
  height = 520,
  lang = "en",
  className = "",
}: {
  width?: number;
  height?: number;
  lang?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      // Starts the download a little before the section is actually on
      // screen, so the swap-in doesn't read as a pop.
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (shouldLoad) {
    return <RotatingEarth width={width} height={height} lang={lang} className={className} />;
  }

  return (
    <div
      ref={ref}
      style={{ maxWidth: width }}
      className={`aspect-square w-full rounded-full bg-navy-800 ${className}`}
    />
  );
}
