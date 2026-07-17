"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * ShineBorder — an animated gradient border ("shimmering rim") effect, adapted
 * from the Magic UI component to this codebase: Tailwind v4 (no config file), the
 * ACTS brass/amber palette, and no `next-themes` / `cn` dependency. The effect
 * itself lives as `.shine-border` in globals.css (same house style as
 * `.border-beam` / `.spotlight-card`); this wrapper only feeds it CSS variables,
 * so it adds a single relative container and preserves flex/grid layout. Honors
 * prefers-reduced-motion (the rim holds still).
 *
 * @param borderRadius  corner radius in px (match the wrapped card).
 * @param borderWidth   rim thickness in px.
 * @param duration      seconds for one full shimmer sweep.
 * @param color         one color, or several to blend across the rim. Defaults
 *                      to the brand brass→amber→brass.
 */

type ColorProp = string | string[];

export interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: ColorProp;
  className?: string;
  children: ReactNode;
}

const BRAND_SHINE = ["#8a6a30", "#f0c419", "#8a6a30"];

export function ShineBorder({
  borderRadius = 16,
  borderWidth = 1.5,
  duration = 14,
  color = BRAND_SHINE,
  className = "",
  children,
}: ShineBorderProps) {
  const shineColor = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      style={
        {
          "--shine-radius": `${borderRadius}px`,
          "--shine-width": `${borderWidth}px`,
          "--shine-duration": `${duration}s`,
          "--shine-color": shineColor,
        } as CSSProperties
      }
      className={`shine-border relative ${className}`}
    >
      {children}
    </div>
  );
}

export default ShineBorder;
