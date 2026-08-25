"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Home,
  Images,
  Layers,
  Package,
  Wrench,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useHydrated, usePublishFloatingNavHeight } from "@/lib/hooks";

/** Separate from <Dock>'s key: the two bars never appear together, and a
 *  reader dismissing one on a brand page should not silently dismiss the
 *  other everywhere else. */
const MINIMIZED_KEY = "acts-brandnav-minimized";

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
  const mounted = useHydrated();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLElement>(null);
  // Read straight out of storage rather than defaulting to expanded and
  // correcting in an effect: nothing renders until `mounted`, so the stored
  // value is in place for the first render that produces DOM.
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MINIMIZED_KEY) === "1";
    } catch {
      return false; /* storage blocked - default to expanded */
    }
  });
  usePublishFloatingNavHeight(wrapperRef, minimized, mounted);

  function toggleMinimized() {
    setMinimized((was) => {
      const next = !was;
      try {
        localStorage.setItem(MINIMIZED_KEY, next ? "1" : "0");
      } catch {
        /* storage blocked - the choice just will not persist */
      }
      return next;
    });
  }
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
      ref={wrapperRef}
      aria-label="Page sections"
      data-pinned-chrome
      className="fixed bottom-4 sm:bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center px-3 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Collapse handle. <Dock> has had one of these on every other page;
          this bar never did, so on the brand pages it sat permanently over
          whatever the page put at the bottom of a section - including the
          3D showcase's own scroll cue, which it hid outright. Same 44x28 tab,
          same localStorage-backed choice, so the two bars behave alike. */}
      <button
        type="button"
        onClick={toggleMinimized}
        aria-expanded={!minimized}
        aria-label={minimized ? "Show page sections" : "Minimize page sections"}
        title={minimized ? "Show page sections" : "Minimize page sections"}
        // tap-target: deliberately a small 44x28 tab, so on touch it gets the
        // missing height as invisible hit area rather than being drawn bigger.
        className="tap-target relative z-10 mb-1.5 flex h-8 w-14 shrink-0 items-center justify-center gap-1 rounded-full border border-brand/25 bg-white text-brand shadow-lg shadow-navy/15 transition-colors hover:border-brand/50 hover:bg-brand-light"
      >
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`transition-transform duration-300 ${minimized ? "rotate-180" : ""}`}
        />
        <span className="text-[10px] font-bold tracking-wider uppercase">
          {minimized ? "Nav" : "Hide"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
      {/* No backdrop-blur — this is `fixed`, pinned through the whole scroll,
          same as <Dock> and <Navbar>'s nav. Bumped to bg-white/95 (from /90)
          to cover the small amount of softening the blur used to add. */}
      <div
        ref={containerRef}
        className="relative flex items-center rounded-full border border-gray-200 bg-white/95 px-1.5 py-1.5 shadow-xl shadow-navy/15"
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
              // min-h-11 for the same reason <Dock> carries it: below `sm:`
              // this collapses to icon-only and the item is 31px tall. From
              // `sm:` up the label brings it to 50px on its own, so this is
              // inert there. (Unlike the homepage dock, the labels here do
              // not need pushing to `lg:` — six short labels measure 444px,
              // which fits every width down to 640.)
              className={`relative z-10 flex min-h-11 flex-col items-center justify-center rounded-full px-3.5 py-1.5 sm:px-4 transition-colors duration-200 ${
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>,
    document.body
  );
}
