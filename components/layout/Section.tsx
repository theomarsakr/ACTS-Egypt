import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container, { type ContainerWidth } from "@/components/layout/Container";

const spaceClass = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
} as const;

const toneClass = {
  default: "",
  muted: "bg-gray-50",
  navy: "bg-navy text-white",
  ink: "bg-ink text-white",
} as const;

export type SectionProps = {
  space?: keyof typeof spaceClass;
  tone?: keyof typeof toneClass;
  /** Sets `id` and applies `.scroll-anchor`, which tracks the published
   *  header height instead of a hard-coded scroll-mt-*. */
  anchor?: string;
  width?: ContainerWidth;
  bleed?: boolean;
  /** Full-bleed sections that manage their own inner width skip the
   *  wrapping Container entirely. */
  containerless?: boolean;
  className?: string;
  children?: ReactNode;
};

/* The section-level counterpart to <Container>: fluid vertical rhythm
   (--spacing-section-sm/-section/-lg, 40->80 / 48->112 / 64->160px) instead
   of the flat `py-20` used almost everywhere, plus a scroll anchor that
   tracks the header's real height rather than a fixed scroll-mt-*. */
export default function Section({
  space = "md",
  tone = "default",
  anchor,
  width,
  bleed,
  containerless = false,
  className,
  children,
}: SectionProps) {
  const body = containerless ? (
    children
  ) : (
    <Container width={width} bleed={bleed}>
      {children}
    </Container>
  );

  return (
    <section
      id={anchor}
      className={cn(
        "relative",
        spaceClass[space],
        toneClass[tone],
        anchor && "scroll-anchor",
        className
      )}
    >
      {body}
    </section>
  );
}
