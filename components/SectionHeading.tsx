import { cn } from "@/lib/utils";

/* The site's one section-header pattern: a short brand-marked title, an
   optional subordinate subtitle, and an optional supporting lede paragraph.
   Replaces ~40 hand-rolled header blocks that previously rendered the
   relationship backwards — a 14px uppercase label as the "title" and a full
   sentence as the giant heading beneath it. Title is always the largest,
   boldest element in the block.

   Title tiers use the text-fluid-* tokens (app/globals.css): hero and xl both
   used to be 3-step md:/lg: chains that stopped adapting past 1024px and
   jumped visibly at each breakpoint — display (36->72) and h2 (36->56) match
   their old endpoints exactly, but scale continuously between. lg/md map to
   h3/h4 on the same basis. Line-height rides along automatically: Tailwind
   v4 pairs a `--text-fluid-*--line-height` token with its `text-fluid-*`
   utility, so no separate leading-[...] class is needed here.

   Subtitle only gets the fluid treatment for hero/xl, where the old chain
   also reached to lg: (20->28) and text-fluid-subtitle (18->28) matches the
   endpoint. lg/md subtitles were already a contained 2-step base->md chain
   with no lg: stage — not the "stops adapting" defect this fixes — so they
   keep their original classes rather than being force-fit onto a token with
   a mismatched line-height.

   Lede was already a single fixed size per tier (18/18/17/15px, no chain at
   all) so there was nothing to "fix" here either — collapsed to one fluid
   token anyway since a single shared class is simpler than four near-
   identical fixed ones, and it lifts the smallest tier (15px) to a slightly
   more comfortable mobile floor (16px). */

const titleTier = {
  hero: "text-fluid-display font-extrabold tracking-[-0.03em]",
  xl: "text-fluid-h2 font-extrabold tracking-[-0.025em]",
  lg: "text-fluid-h3 font-extrabold tracking-[-0.02em]",
  md: "text-fluid-h4 font-extrabold tracking-[-0.02em]",
} as const;

const subtitleTier = {
  hero: "text-fluid-subtitle font-semibold",
  xl: "text-fluid-subtitle font-semibold",
  lg: "text-lg md:text-xl font-semibold leading-snug",
  md: "text-base md:text-lg font-semibold leading-snug",
} as const;

const LEDE_CLASS = "text-fluid-lede leading-relaxed";

const tone = {
  light: { title: "text-navy", subtitle: "text-navy/75", lede: "text-gray-600" },
  dark: { title: "text-white", subtitle: "text-white/72", lede: "text-white/65" },
} as const;

type Tier = keyof typeof titleTier;
type Tone = keyof typeof tone;

export type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  lede?: string;
  tier?: Tier;
  tone?: Tone;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  lede,
  tier = "lg",
  tone: toneKey = "light",
  as: Heading = "h2",
  align = "start",
  className,
}: SectionHeadingProps) {
  const c = tone[toneKey];
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      <Heading className={cn("text-balance", titleTier[tier], c.title)}>
        {title}
      </Heading>
      {subtitle && (
        <p className={cn("font-display mt-3 text-balance", subtitleTier[tier], c.subtitle)}>
          {subtitle}
        </p>
      )}
      {lede && (
        <p className={cn("mt-6", LEDE_CLASS, c.lede)}>{lede}</p>
      )}
    </div>
  );
}
