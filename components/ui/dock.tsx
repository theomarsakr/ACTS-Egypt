"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useHydrated, usePublishFloatingNavHeight } from "@/lib/hooks";

const MINIMIZED_KEY = "acts-dock-minimized";

type DockProps = {
  children: ReactNode;
  className?: string;
  /** Extra classes for the fixed positioning wrapper (e.g. `max-md:hidden`
      to suppress the dock on small screens for a specific page). */
  wrapperClassName?: string;
  label?: string;
  /** Rendered after the scrollable item row, outside its overflow-x-auto —
      so it can never itself scroll out of reach. SiteDock uses this for the
      "Request a quote" CTA: the one destination the dock exists to
      guarantee, now that labelled items (below) no longer fit unscrolled at
      every width. */
  pinnedItem?: ReactNode;
};
type DockItemProps = {
  className?: string;
  children: ReactNode;
  href: string;
  /** Accessible name — also the tooltip at widths where the visible label is
      hidden (below `lg:`; see <DockLabel>). */
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
 * A small handle above the pill lets the reader collapse it out of the way
 * (e.g. while reading a tall page) and bring it back later. The choice is
 * remembered in localStorage rather than per-mount state: SiteDock fully
 * remounts on every route change (each page passes its own `sections`), so
 * in-memory state alone would silently re-expand it on the very next
 * navigation — which defeats the point of dismissing it.
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
function Dock({
  children,
  className,
  wrapperClassName,
  label = "Quick navigation",
  pinnedItem,
}: DockProps) {
  const mounted = useHydrated();
  // Read straight out of storage rather than defaulting to expanded and
  // correcting in an effect: this component renders nothing until `mounted`
  // is true, so the stored value is already in place by the first render
  // that produces DOM — no flash of an expanded dock the reader dismissed.
  const [minimized, setMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MINIMIZED_KEY) === "1";
    } catch {
      return false; /* storage blocked — default to expanded */
    }
  });

  function toggleMinimized() {
    setMinimized((was) => {
      const next = !was;
      try {
        localStorage.setItem(MINIMIZED_KEY, next ? "1" : "0");
      } catch {
        /* ignore — the toggle still works for this visit */
      }
      return next;
    });
  }

  const navRef = useRef<HTMLElement>(null);
  // Reserves the space this bar covers so page content (scroll cues above
  // all) can stay clear of it. Re-measures on collapse.
  const wrapperRef = useRef<HTMLDivElement>(null);
  usePublishFloatingNavHeight(wrapperRef, minimized, mounted);
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
      ref={wrapperRef}
      data-pinned-chrome
      className={cn(
        "fixed inset-x-0 bottom-4 z-40 flex flex-col items-center px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-6",
        wrapperClassName
      )}
    >
      <button
        type="button"
        onClick={toggleMinimized}
        aria-expanded={!minimized}
        aria-label={minimized ? "Show quick navigation" : "Minimize quick navigation"}
        title={minimized ? "Show quick navigation" : "Minimize quick navigation"}
        // tap-target: the handle is deliberately a small 44×28 tab, so on
        // touch it gets the missing 16px of height as invisible hit area
        // rather than being drawn bigger (see globals.css).
        // No backdrop-blur: this is `position: fixed`, pinned on screen for
        // the life of the scroll — see the note on <Navbar>'s nav for why
        // that combination can silently stop painting mid-scroll. bg-white/95
        // alone reads close to identical without the risk.
        className="tap-target relative z-10 mb-1.5 flex h-8 w-14 shrink-0 items-center justify-center gap-1 rounded-full border border-brand/25 bg-white text-brand shadow-lg shadow-navy/15 transition-colors hover:border-brand/50 hover:bg-brand-light"
      >
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={cn("transition-transform duration-300", minimized && "rotate-180")}
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
            className="w-full overflow-hidden"
          >
            <nav
              ref={navRef}
              aria-label={label}
              className={cn(
                // w-fit: nav sits inside the AnimatePresence motion.div below,
                // which needs w-full for its own height:0->auto collapse
                // animation to measure correctly. That makes nav a block-level
                // box in plain flow rather than a sized flex item, so without
                // w-fit it stretches to fill that full-width parent instead of
                // shrinking to its content — leaving mx-auto with no leftover
                // space to center against, and the pill visibly pinned left.
                // No backdrop-blur — same reasoning as the minimize handle
                // above: `fixed`, pinned through the whole scroll, so it's in
                // the one class of element that can go blank mid-scroll if it
                // carries one (confirmed on <Navbar>'s nav, same portal
                // pattern as this dock).
                "relative mx-auto flex w-fit max-w-full items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-1.5 py-1.5 shadow-xl shadow-navy/15",
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
              {/* Labelled items no longer fit unscrolled at every width (see
                  <DockLabel>), so this row scrolls on its own — scroll-snap
                  keeps items from stopping half-visible, and scroll-fade-x
                  signals there's more where the fade hides it (this scroller
                  hides its own scrollbar, so nothing else would say so). The
                  CTA lives outside this div entirely (see `pinnedItem`
                  below) rather than being just another scrollable child, so
                  it can never itself scroll out of reach. */}
              <div className="scroll-fade-x flex snap-x snap-proximity items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {children}
              </div>
              {pinnedItem}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
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
        // min-h-11 is the 44px touch floor — labels are always on now (see
        // <DockLabel>), so the icon+label layout already clears it, but this
        // stays as the floor for any consumer that renders an icon alone.
        "relative z-10 flex min-h-11 shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-full px-3.5 py-2 text-center transition-colors duration-200 sm:px-4",
        active ? "text-brand" : "text-gray-500 hover:text-navy",
        className
      )}
    >
      {children}
    </Link>
  );
}

function DockLabel({ children, className }: DockLabelProps) {
  // Visible at every width now, not just `lg:` (1024px) — that gate is what
  // used to save this scroller from the fate described below. The rescue
  // moved up a level: the item row scrolls on its own (see <Dock>'s
  // scroll-fade-x div) with the CTA pinned outside it, so labels no longer
  // have to disappear to keep the "Request a quote" destination reachable.
  //
  // Measured on the homepage's six-section dock: with labels the nav is
  // 826px wide, well past what any of these widths grant it unscrolled —
  // hence the scroller rather than a breakpoint. Arabic labels run wider
  // still, which is exactly why that variant needs checking first (see the
  // refactor notes), not last.
  return (
    <span className={cn("text-[11px] font-semibold whitespace-nowrap", className)}>
      {children}
    </span>
  );
}

function DockIcon({ children, className }: DockIconProps) {
  return <div className={cn("flex h-5 w-5 items-center justify-center", className)}>{children}</div>;
}

export { Dock, DockIcon, DockItem, DockLabel };
