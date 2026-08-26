"use client";

import { useRef, type ReactNode } from "react";
import { useOnscreen } from "@/lib/hooks";

/**
 * BorderBeam — a single arc of light travelling around a rounded border
 * (MagicUI genre, tuned amber). The effect itself lives as `.border-beam` in
 * globals.css (same house style as `.shine-border` / `.spotlight-card`); this
 * wrapper adds a single relative container, preserving flex/grid layout, and
 * self-observes via useOnscreen so `.motion-ambient` pauses the travelling
 * arc — the most expensive common effect on the card — the instant the
 * section scrolls off screen. Honors prefers-reduced-motion (the arc holds).
 */
export function BorderBeam({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOnscreen(ref);

  return (
    <div ref={ref} className={`border-beam motion-ambient ${className}`}>
      {children}
    </div>
  );
}

export default BorderBeam;
