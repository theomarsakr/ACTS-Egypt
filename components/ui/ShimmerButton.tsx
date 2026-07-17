"use client";

import React, { CSSProperties } from "react";
import Link from "next/link";

/**
 * ShimmerButton — a continuous conic-gradient "spark" travels around the border
 * over a solid fill (Magic UI genre), adapted to this codebase: Tailwind v4 (no
 * config file), the ACTS brass palette, and no `cn` / `next-themes`. The effect
 * lives as `.shimmer-btn` in globals.css (same house style as `.border-beam` /
 * `.shine-border`); this wrapper only feeds it CSS variables and the layer
 * structure. Renders a Next.js <Link> when `href` is set (so nav CTAs stay real
 * anchors), otherwise a <button>. Honors prefers-reduced-motion (spark holds).
 */

const BRAND_BG = "linear-gradient(135deg, #a37d3a 0%, #8a6a30 55%, #6e5426 100%)";

export interface ShimmerButtonProps {
  /** Color of the traveling glint. Defaults to a warm gold-white. */
  shimmerColor?: string;
  /** Thickness of the visible spark ring (the fill inset). */
  shimmerSize?: string;
  /** One full spark lap. */
  shimmerDuration?: string;
  /** Corner radius; matches the site's button language by default. */
  borderRadius?: string;
  /** The button fill. Defaults to the brand brass gradient. */
  background?: string;
  className?: string;
  children?: React.ReactNode;
  /** When set, renders a Next.js <Link> (anchor) instead of a <button>. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

export function ShimmerButton({
  shimmerColor = "#fff3c4",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "0.875rem",
  background = BRAND_BG,
  className = "",
  children,
  href,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: ShimmerButtonProps) {
  const style = {
    "--shimmer-color": shimmerColor,
    "--shimmer-cut": shimmerSize,
    "--shimmer-speed": shimmerDuration,
    "--shimmer-radius": borderRadius,
    "--shimmer-bg": background,
  } as CSSProperties;

  const inner = (
    <>
      {/* traveling spark: a container query sets the lane, the track slides
          across it, and the glint (a conic wedge) spins inside the track. */}
      <span className="shimmer-btn__spark" aria-hidden>
        <span className="shimmer-btn__track">
          <span className="shimmer-btn__glint" />
        </span>
      </span>
      <span className="shimmer-btn__label">{children}</span>
      {/* inner highlight (reacts to hover/active) + fill that masks the spark
          down to a thin ring. */}
      <span className="shimmer-btn__highlight" aria-hidden />
      <span className="shimmer-btn__backdrop" aria-hidden />
    </>
  );

  const cls = `shimmer-btn ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} style={style} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} style={style} type={type} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </button>
  );
}

export default ShimmerButton;
