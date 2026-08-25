import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const widthClass = {
  prose: "max-w-3xl",
  content: "max-w-6xl",
  wide: "max-w-7xl",
  full: "",
} as const;

export type ContainerWidth = keyof typeof widthClass;

type ContainerProps<T extends ElementType> = {
  as?: T;
  width?: ContainerWidth;
  /** Drop the inline gutter — for content that manages its own edge spacing. */
  bleed?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/* The one horizontal-measure primitive, replacing 47 hand-rolled
   `max-w-{6,7}xl mx-auto px-6` chains. `px-6` (24px) used to be the gutter at
   320px and at 1440px alike; the gutter here is `.px-safe`, which reads the
   fluid `--spacing-gutter` token (16px -> 32px) and clears the safe-area
   insets once `viewport-fit: cover` is set. `width` maps mechanically onto
   what already existed: max-w-6xl -> "content" (the default — most chains
   use 6xl), max-w-7xl -> "wide". */
export default function Container<T extends ElementType = "div">({
  as,
  width = "content",
  bleed = false,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn("mx-auto w-full", widthClass[width], !bleed && "px-safe", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
