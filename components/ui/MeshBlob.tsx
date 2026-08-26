"use client";

import { useRef, type CSSProperties } from "react";
import { useOnscreen } from "@/lib/hooks";

/**
 * The site's ambient drift blob (`.mesh-steel` / `.mesh-brass` in globals.css).
 * Self-observes via useOnscreen so `.motion-ambient` pauses its 26-32s drift
 * the instant its own section scrolls off screen — the mechanism that lets
 * every section keep the effect at every viewport without paying for the
 * blobs nobody can see. Purely decorative, so always `aria-hidden`.
 */
export function MeshBlob({
  variant,
  className = "",
  style,
}: {
  variant: "steel" | "brass";
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOnscreen(ref);

  return (
    <div
      ref={ref}
      className={`mesh motion-ambient mesh-${variant} ${className}`}
      style={style}
      aria-hidden
    />
  );
}

export default MeshBlob;
