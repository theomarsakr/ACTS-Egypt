import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ScrollHint — the site's single treatment for "there is more this way".
 *
 * Every scroll cue on the site used to be styled ad hoc, and all of them had
 * drifted to the same failure: 11-12.5px of `gray-400` or `white/60` set as
 * bare text, which is the weight you give a footnote, not a prompt you want
 * acted on. Visitors were missing them and stopping at the fold.
 *
 * So this is a chip, not a line of text: a tinted ground, a ring, and an arrow
 * that nudges on a 1.5s cycle. It reads as one recognisable object wherever it
 * appears, which is the other half of the job — a cue only trains a visitor if
 * it looks the same the second time they meet it.
 *
 * Deliberately NOT a button. It marks a direction; it does not take a click,
 * so it must not borrow a button's solid fill.
 *
 * `tone` picks the ground, and must match what it sits on: "dark" for the
 * dark bands (amber on ink), "light" for white sections (bronze on cream).
 */
export default function ScrollHint({
  children,
  tone = "dark",
  direction = "down",
  size = "md",
  className,
  style,
}: {
  children: ReactNode;
  /** Match the surface: "dark" for dark bands, "light" for white sections. */
  tone?: "dark" | "light";
  /** "down" for vertical page scroll, "right" for a horizontal rail. */
  direction?: "down" | "right";
  size?: "sm" | "md";
  className?: string;
  /** Passed through so callers can drive their own transform (the hero
   *  slides its hint off-screen as the media expands). */
  style?: CSSProperties;
}) {
  const Icon = direction === "down" ? ChevronDown : ArrowRight;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase ring-1 backdrop-blur-sm",
        size === "sm"
          ? "gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.12em]"
          : "gap-2 px-4 py-2 text-[13px] tracking-[0.14em]",
        tone === "dark"
          ? "bg-amber/15 text-amber shadow-lg shadow-amber/10 ring-amber/45"
          : "bg-brand-light text-brand shadow-sm shadow-brand/10 ring-brand/30",
        className
      )}
      style={style}
    >
      {children}
      <Icon
        size={size === "sm" ? 13 : 15}
        strokeWidth={2.75}
        aria-hidden
        className={cn(
          "shrink-0 motion-reduce:animate-none",
          direction === "down" ? "animate-scroll-nudge" : "animate-scroll-nudge-x"
        )}
      />
    </span>
  );
}
