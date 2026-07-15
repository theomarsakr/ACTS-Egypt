"use client";

import { useRef } from "react";

/**
 * SpotlightCard — a drop-in replacement for a card container that adds a soft
 * brass radial glow tracking the cursor (21st.dev / Aceternity "spotlight card"
 * genre), tuned to the ACTS palette. Pure CSS glow via a ::before layer defined
 * in globals.css (.spotlight-card); this component only feeds it the pointer
 * position, so it introduces no wrapper element and preserves flex/grid layout.
 */
export default function SpotlightCard({
  children,
  className = "",
  color = "rgba(163, 125, 58, 0.14)",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  /** Glow color — brass by default; pass a lighter tone for dark tiles. */
  color?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={{ "--spot-color": color } as React.CSSProperties}
      className={`spotlight-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
