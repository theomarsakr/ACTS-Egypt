"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DockProps = {
  children: ReactNode;
  className?: string;
  /** Extra classes for the fixed positioning wrapper (e.g. `max-md:hidden`
      to suppress the dock on small screens for a specific page). */
  wrapperClassName?: string;
  label?: string;
};
type DockItemProps = {
  className?: string;
  children: ReactNode;
  href: string;
  /** Accessible name — also the tooltip on touch devices where the label is
      hidden below `sm:`. */
  label: string;
  /** Marks this as the page section currently in view — tints the item and
      slides the pill indicator behind it. */
  active?: boolean;
};
type DockLabelProps = { className?: string; children: ReactNode };
type DockIconProps = { className?: string; children: ReactNode };

/**
 * Dock — a floating bottom quick-nav: icon + always-visible label per item,
 * with a pill indicator sliding to whichever one is active. Same visual and
 * interaction language as <FloatingNav> (the brand pages' own quick-nav) —
 * unified here so every page's floating dock reads as the same component,
 * not two different navigation patterns living side by side.
 *
 * Portals to `document.body`: every page on this site renders inside
 * `app/[lang]/template.tsx`'s `.animate-page-in` wrapper for the route
 * transition, and once a CSS transition/animation has touched an element's
 * `transform`, browsers keep reporting a matrix (never the literal keyword
 * `none`) even at rest — which establishes a containing block for any
 * `position: fixed` descendant, silently anchoring it to that wrapper
 * instead of the viewport. Portaling out of the page tree entirely sidesteps
 * it (the standard fix for any fixed-position overlay: modals, toasts, and
 * docks alike).
 */
function Dock({ children, className, wrapperClassName, label = "Quick navigation" }: DockProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  // Slides the pill behind whichever child rendered with data-dock-active —
  // Dock doesn't own the items (SiteDock does, via IntersectionObserver), so
  // it re-measures after every render rather than reacting to a prop it
  // doesn't have. Guarded so an unchanged measurement never re-triggers
  // setState, which is what keeps this from looping.
  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) return;
      const activeEl = nav.querySelector<HTMLElement>('[data-dock-active="true"]');
      if (!activeEl) {
        setIndicator((prev) => (prev.width === 0 ? prev : { width: 0, left: 0 }));
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      const next = { width: itemRect.width, left: itemRect.left - navRect.left };
      setIndicator((prev) =>
        prev.width === next.width && prev.left === next.left ? prev : next
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  });

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-6",
        wrapperClassName
      )}
    >
      <nav
        ref={navRef}
        aria-label={label}
        className={cn(
          "relative mx-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white/95 px-1.5 py-1.5 shadow-xl shadow-navy/15 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
      >
        {indicator.width > 0 && (
          <motion.div
            initial={false}
            animate={indicator}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="absolute inset-y-1.5 rounded-full bg-brand-light/70"
            aria-hidden
          />
        )}
        {children}
      </nav>
    </div>,
    document.body
  );
}

function DockItem({ children, className, href, label, active }: DockItemProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={label}
      data-dock-active={active ? "true" : undefined}
      className={cn(
        "relative z-10 flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-full px-3.5 py-2 text-center transition-colors duration-200 sm:px-4",
        active ? "text-brand" : "text-gray-500 hover:text-navy",
        className
      )}
    >
      {children}
    </Link>
  );
}

function DockLabel({ children, className }: DockLabelProps) {
  return (
    <>
      <span className={cn("hidden text-[11px] font-semibold whitespace-nowrap sm:block", className)}>
        {children}
      </span>
      {/* Icon-only below `sm:` — the accessible name still comes from the
          parent Link's aria-label, this is just belt-and-suspenders for any
          AT that prefers visible text nodes over aria-label. */}
      <span className="sr-only sm:hidden">{children}</span>
    </>
  );
}

function DockIcon({ children, className }: DockIconProps) {
  return <div className={cn("flex h-5 w-5 items-center justify-center", className)}>{children}</div>;
}

export { Dock, DockIcon, DockItem, DockLabel };
