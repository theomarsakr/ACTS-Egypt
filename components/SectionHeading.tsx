import { cn } from "@/lib/utils";

/* The site's one section-header pattern: a short brand-marked title, an
   optional subordinate subtitle, and an optional supporting lede paragraph.
   Replaces ~40 hand-rolled header blocks that previously rendered the
   relationship backwards — a 14px uppercase label as the "title" and a full
   sentence as the giant heading beneath it. Title is always the largest,
   boldest element in the block. */

const titleTier = {
  hero: "text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02]",
  xl: "text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.05]",
  lg: "text-3xl md:text-4xl font-extrabold tracking-[-0.02em] leading-[1.08]",
  md: "text-2xl md:text-3xl font-extrabold tracking-[-0.02em] leading-[1.1]",
} as const;

const subtitleTier = {
  hero: "text-xl md:text-2xl lg:text-[1.75rem] font-semibold leading-snug",
  xl: "text-xl md:text-2xl font-semibold leading-snug",
  lg: "text-lg md:text-xl font-semibold leading-snug",
  md: "text-base md:text-lg font-semibold leading-snug",
} as const;

const ledeTier = {
  hero: "text-lg leading-relaxed",
  xl: "text-lg leading-relaxed",
  lg: "text-[17px] leading-relaxed",
  md: "text-[15px] leading-relaxed",
} as const;

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
        <p className={cn("mt-6", ledeTier[tier], c.lede)}>{lede}</p>
      )}
    </div>
  );
}
