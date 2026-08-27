import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* The site's one section-header pattern, and the only place the descending
   type scale is spelled out. Every header on the site reads the same way,
   largest to smallest:

       eyebrow    what kind of block this is      11 -> 14   uppercase label
       TITLE      the short noun phrase           up to 72   the big one
       subtitle   one compact descriptive line    17 -> 32   display, semibold
       lede       the supporting paragraph        15 -> 18   body, muted

   Three things separate each rung, not just one: size, weight, and color.
   That is what keeps the steps legible on a phone, where the sizes compress
   toward each other and size alone stops carrying the hierarchy.

   Before this the site rendered the relationship backwards in ~40 places — a
   14px uppercase label as the "title" and a full sentence as the giant
   heading beneath it. The short label IS the title here; the sentence that
   used to be the heading becomes the subtitle.

   Title tiers use the text-fluid-* tokens (app/globals.css) so they scale
   continuously from 360 -> 1440px instead of jumping at each breakpoint.
   Line-height rides along automatically: Tailwind v4 pairs a
   `--text-fluid-*--line-height` token with its `text-fluid-*` utility, so no
   separate leading-[...] class is needed on the size classes below.

   Subtitle and lede step per tier rather than sharing one size across all of
   them. A single shared subtitle collapsed the hierarchy at the small tiers:
   against an h4 title the old subtitle class landed on exactly the lede's own
   size, so tiers 2 and 3 rendered identically. See the token block's own note
   for the measurements. */

type Tier = "hero" | "page" | "xl" | "lg" | "md";

const titleTier: Record<Tier, string> = {
  hero: "text-fluid-display font-extrabold tracking-[-0.03em]",
  page: "text-fluid-h1 font-extrabold tracking-[-0.03em]",
  xl: "text-fluid-h2 font-extrabold tracking-[-0.025em]",
  lg: "text-fluid-h3 font-extrabold tracking-[-0.02em]",
  md: "text-fluid-h4 font-extrabold tracking-[-0.02em]",
};

const subtitleTier: Record<Tier, string> = {
  hero: "text-fluid-subtitle-hero",
  page: "text-fluid-subtitle",
  xl: "text-fluid-subtitle",
  lg: "text-fluid-subtitle-lg",
  /* The md tier's subtitle shares the h5 rung (17 -> 20) — see globals.css. */
  md: "text-fluid-h5 leading-snug",
};

/* The lede holds the 16 -> 18 body rung under the three large tiers and drops
   to 15 -> 16 under the two compact ones, so it stays clear of the subtitle
   above it there instead of matching it. */
const ledeTier: Record<Tier, string> = {
  hero: "text-fluid-lede",
  page: "text-fluid-lede",
  xl: "text-fluid-lede",
  lg: "text-fluid-lede-sm",
  md: "text-fluid-lede-sm",
};

/* Vertical rhythm steps with the tier too: a 72px title needs more air under
   it than a 22px one, and the gap before the lede is always the larger of the
   two so the title+subtitle read as one lockup with the paragraph after it. */
const gapTier: Record<Tier, { subtitle: string; lede: string; eyebrow: string }> = {
  hero: { eyebrow: "mb-5", subtitle: "mt-5", lede: "mt-7" },
  page: { eyebrow: "mb-4", subtitle: "mt-4", lede: "mt-6" },
  xl: { eyebrow: "mb-4", subtitle: "mt-4", lede: "mt-6" },
  lg: { eyebrow: "mb-3", subtitle: "mt-3", lede: "mt-5" },
  md: { eyebrow: "mb-2.5", subtitle: "mt-2", lede: "mt-4" },
};

const tone = {
  light: {
    eyebrow: "text-brand",
    title: "text-navy",
    subtitle: "text-navy/75",
    lede: "text-gray-600",
  },
  dark: {
    eyebrow: "text-amber",
    title: "text-white",
    subtitle: "text-white/72",
    lede: "text-white/65",
  },
} as const;

type Tone = keyof typeof tone;

export type SectionHeadingProps = {
  /** Short uppercase label above the title — the category, not a sentence.
   *  Takes a node so the icon+label lockups keep their icon. */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  lede?: ReactNode;
  tier?: Tier;
  tone?: Tone;
  as?: "h1" | "h2" | "h3" | "h4";
  align?: "start" | "center";
  className?: string;
  /** Measure for the lede only. The title and subtitle are short by
   *  construction; a paragraph is what actually needs a column cap. */
  ledeClassName?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  lede,
  tier = "lg",
  tone: toneKey = "light",
  as: Heading = "h2",
  align = "start",
  className,
  ledeClassName,
}: SectionHeadingProps) {
  const c = tone[toneKey];
  const gap = gapTier[tier];
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <div
          className={cn(
            "eyebrow flex w-fit items-center gap-2",
            centered && "mx-auto",
            gap.eyebrow,
            c.eyebrow
          )}
        >
          {eyebrow}
        </div>
      )}
      <Heading className={cn("text-balance", titleTier[tier], c.title)}>
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "font-display font-semibold text-balance",
            gap.subtitle,
            subtitleTier[tier],
            c.subtitle
          )}
        >
          {subtitle}
        </p>
      )}
      {lede && (
        <p className={cn(gap.lede, ledeTier[tier], c.lede, ledeClassName)}>
          {lede}
        </p>
      )}
    </div>
  );
}
