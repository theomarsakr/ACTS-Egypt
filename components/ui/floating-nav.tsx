"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  BookOpen,
  Home,
  Images,
  Layers,
  Package,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * FloatingNav — a floating bottom "dock" for in-page section navigation.
 *
 * Replaces the sticky top strip on the brand pages: a centered pill fixed above
 * the bottom edge, one icon button per page section, with a spring-animated
 * indicator that slides to the active item. Active state follows the scroll
 * position (IntersectionObserver scrollspy) and clicking smooth-scrolls to the
 * section, offset so it never hides under the sticky site header. Labels hide
 * on small screens (icons only); the full section name stays available to
 * assistive tech and as a tooltip.
 */

/** Icons are passed by name so server components can hand us plain data. */
const ICONS = {
  Home,
  Package,
  Layers,
  Images,
  Wrench,
  BookOpen,
} satisfies Record<string, LucideIcon>;

export type FloatingNavSection = {
  /** DOM id of the section this item scrolls to. */
  id: string;
  /** Short label shown under the icon on sm+ screens. */
  label: string;
  /** Full section name for tooltips / screen readers (defaults to label). */
  title?: string;
  icon: keyof typeof ICONS;
};

export default function FloatingNav({
  sections,
}: {
  sections: FloatingNavSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });
  // Portalled to <body>: the route template's entrance animation leaves a
  // residual identity transform on its wrapper, which would turn descendant
  // position:fixed into "absolute inside the page". Client-only by nature.
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => setMounted(true), []);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active)
  );

  // Slide the indicator under the active item; re-measure on resize (labels
  // appear/disappear across the sm breakpoint, changing every item's width).
  useEffect(() => {
    const update = () => {
      const item = itemRefs.current[activeIndex];
      const container = containerRef.current;
      if (!item || !container) return;
      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({
        width: itemRect.width,
        left: itemRect.left - containerRect.left,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex, mounted]);

  // Scrollspy — same tuning as the hub pages' previous top strip: a section
  // becomes active once it enters the band below the header.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const headerH = Math.round(
      document.querySelector("header")?.getBoundingClientRect().height ?? 0
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${headerH + 72}px 0px -55% 0px`, threshold: [0, 0.15] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerH =
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    setActive(id);
  };

  if (!mounted) return null;

  return createPortal(
    <nav
      aria-label="Page sections"
      className="fixed bottom-4 sm:bottom-5 left-1/2 z-40 -translate-x-1/2 px-3 pb-[env(safe-area-inset-bottom)]"
    >
      <div
        ref={containerRef}
        className="relative flex items-center rounded-full border border-gray-200 bg-white/90 px-1.5 py-1.5 shadow-xl shadow-navy/15 backdrop-blur-xl"
      >
        {sections.map((s, index) => {
          const isActive = active === s.id;
          const Icon = ICONS[s.icon];
          return (
            <a
              key={s.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={`#${s.id}`}
              onClick={(e) => handleClick(e, s.id)}
              aria-current={isActive ? "true" : undefined}
              title={s.title ?? s.label}
              className={`relative z-10 flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 sm:px-4 transition-colors duration-200 ${
                isActive ? "text-brand" : "text-gray-500 hover:text-navy"
              }`}
            >
              <Icon size={19} aria-hidden />
              <span className="mt-0.5 hidden text-[11px] font-semibold sm:block">
                {s.label}
              </span>
              <span className="sr-only sm:hidden">{s.title ?? s.label}</span>
            </a>
          );
        })}

        {/* Sliding active indicator */}
        {indicator.width > 0 && (
          <motion.div
            initial={false}
            animate={indicator}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-1.5 bottom-1.5 rounded-full bg-brand-light/70"
            aria-hidden
          />
        )}
      </div>
    </nav>,
    document.body
  );
}
