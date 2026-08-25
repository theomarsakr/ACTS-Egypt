"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

// Never fires: the "store" here has exactly two values (server: false,
// client: true) and transitions between them once, when React hydrates.
// There is nothing to subscribe to.
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * True once the component has hydrated on the client, false during SSR and
 * the hydration render itself.
 *
 * Use this to gate anything that cannot exist server-side — chiefly
 * `createPortal(…, document.body)`, which several fixed-position overlays on
 * this site need to escape the route transition wrapper's transform (see the
 * comment in components/ui/dock.tsx).
 *
 * This replaces the `useState(false)` + `useEffect(() => setMounted(true))`
 * pattern. That version is flagged by `react-hooks/set-state-in-effect`,
 * because setting state synchronously in an effect schedules a second render
 * pass; `useSyncExternalStore` is React's sanctioned way to read a value that
 * legitimately differs between server and client.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(neverChanges, onClient, onServer);
}

/**
 * Publishes how much of the bottom of the viewport a floating nav is covering
 * as `--floating-nav-h` on <html>, so page content can stay clear of it.
 *
 * The site has two of these bars — <Dock> on ordinary pages and <FloatingNav>
 * on brand pages — and both are `position: fixed`, so nothing below them in
 * the document knows they are there. Anything that must not end up underneath
 * (scroll cues, most of all: a prompt you cannot see is worse than none) reads
 * this variable instead of hard-coding a guess at the bar's height.
 *
 * Reported as the distance from the viewport's bottom edge to the top of the
 * bar, which already folds in the bar's own `bottom` offset and safe-area
 * padding. Collapsing the bar shrinks it to just the handle, so consumers
 * follow it back down automatically.
 */
export function usePublishFloatingNavHeight(
  ref: RefObject<HTMLElement | null>,
  // Re-measures when this changes — pass the collapsed flag so the value
  // follows the bar down as it animates away.
  ...deps: unknown[]
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const publish = () => {
      const rect = el.getBoundingClientRect();
      const covered = Math.max(0, window.innerHeight - rect.top);
      root.style.setProperty("--floating-nav-h", `${Math.round(covered)}px`);
      // A custom property changing is not observable, so anything that has to
      // *measure* against this (rather than just consume it in a `calc`) needs
      // telling. Fires on collapse/expand, which is exactly when a consumer
      // that lifted itself clear should settle back down.
      window.dispatchEvent(new CustomEvent("acts:floating-nav-resize"));
    };

    publish();
    // The bar animates open and shut, so a single measurement lands mid-
    // transition; ResizeObserver keeps up with it without polling.
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener("resize", publish);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
      // Unmounting the bar (a route without one) must clear the reservation,
      // or the next page keeps padding around a bar that is no longer there.
      root.style.removeProperty("--floating-nav-h");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
}

/**
 * Publishes the header's real rendered height as `--header-h` on <html>, so
 * anything positioned or offset against it (`.scroll-anchor`, a hero's top
 * padding) tracks the header's actual height instead of a hard-coded guess.
 * That guess goes stale the moment the header's content changes across a
 * render — e.g. the utility bar becoming visible at every width instead of
 * only >=1280px — and six unrelated files would need updating by hand.
 *
 * Exact mirror of usePublishFloatingNavHeight above: same ResizeObserver +
 * resize listener + cleanup shape, reporting a bottom-edge distance there and
 * a top-edge height here.
 */
export function usePublishHeaderHeight(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const publish = () => {
      root.style.setProperty("--header-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener("resize", publish);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, [ref]);
}

// ---------------------------------------------------------------------------
// Device- and user-signal hooks.
//
// Everything below answers "what can this device/connection/user handle",
// never "how wide is the viewport". That distinction is load-bearing: this
// codebase eliminates viewport-based feature gating (a `hidden md:block` that
// removes content, a `matchMedia("(max-width: 767px)")` that turns an effect
// off) in favour of fluid CSS and an on-screen activation system, precisely
// so a phone and a desktop run the same experience. Device/user signals are
// different — they're the visitor's own hardware or explicit preference, not
// a guess based on how much horizontal space happens to be available.
//
// There is deliberately no `useIsMobile()` / `useBreakpoint()` here. Adding
// one invites exactly the viewport-gated branching this file exists to
// replace. If a layout needs to change at a width, that's a CSS breakpoint
// or a container query — not a JS branch.
// ---------------------------------------------------------------------------

/**
 * Live `matchMedia` read via useSyncExternalStore, modelled on the one
 * correct implementation of this pattern already in the repo
 * (components/brands/BrandHeroVideo.tsx). Both callbacks are memoized on
 * `query` — an inline subscribe resubscribes every render, and an unstable
 * getSnapshot loops React — and the subscription means a tablet rotated
 * across a query's threshold re-evaluates, unlike the several mount-once
 * `matchMedia` reads elsewhere in this codebase (Parallax, Counter,
 * RotatingEarth) that this hook supersedes.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Swipe-to-navigate via Pointer Events — one horizontal-drag gesture shared
 * by every image lightbox on the site (ProductHub's, FieldGallery's),
 * instead of each reimplementing its own threshold and each behaving
 * slightly differently. Pointer Events unify mouse-drag and touch-drag in
 * one listener, so this needs no device branch.
 *
 * Deliberately release-triggered rather than live-tracking (no dragElastic-
 * style follow): it fires once, on pointerup, past `threshold` — simple
 * enough to spread onto a plain element (a lightbox <Image>, say) with no
 * animation library required. A mostly-vertical gesture (a scroll attempt)
 * is ignored rather than mis-read as a swipe.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}): {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: () => void;
} {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  const onPointerCancel = useCallback(() => {
    start.current = null;
  }, []);

  return { onPointerDown, onPointerUp, onPointerCancel };
}

export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}

export function useHoverCapable(): boolean {
  return useMediaQuery("(hover: hover)");
}

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function readSaveData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  // Chromium-only API. Must fail OPEN — Safari/Firefox visitors have no
  // `connection` object at all, and defaulting them to "save data" would
  // silently degrade the experience for browsers this can't actually detect.
  if (!connection) return false;
  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? "");
}

/**
 * True when the visitor has Data-Saver on, or is on a 2G-class connection.
 * Subscribes to the Network Information API's "change" event where present;
 * a browser without the API simply never fires a change and stays `false`.
 */
export function useSaveData(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;
    connection?.addEventListener?.("change", onStoreChange);
    return () => connection?.removeEventListener?.("change", onStoreChange);
  }, []);
  return useSyncExternalStore(subscribe, readSaveData, onServer);
}

/**
 * Single call site for "should this component mount its full experience
 * (autoplay video, a WebGL scene) or fall back to a still image": "full"
 * unless the visitor asked for less motion or is save-data-constrained.
 */
export function useMediaBudget(): "full" | "still" {
  const reduced = useReducedMotion();
  const saveData = useSaveData();
  return reduced || saveData ? "still" : "full";
}

type OnscreenOptions = {
  /** Margin used to flip "prepare" — mount, fetch, warm up — before the
   *  element is actually visible, so nothing pops in or starts mid-stutter. */
  prepareMargin?: string;
};

/**
 * Sets `data-onscreen="true"|"false"` on the ref'd element via
 * IntersectionObserver, at two granularities:
 *  - a wide prepareMargin (default 400px) so expensive setup — building a
 *    WebGL scene, fetching GeoJSON, loading video metadata — finishes before
 *    the section arrives;
 *  - a tight, 0-margin crossing that flips the instant the element actually
 *    leaves the viewport, which is what `.motion-ambient` in globals.css and
 *    any rAF loop / <video> playback should gate on.
 *
 * Both states are exposed on the DOM node (rather than only returned) so
 * plain CSS — `[data-onscreen="false"] .motion-ambient` — can react without
 * a re-render, and so multiple descendants can key off one observed ancestor.
 */
export function useOnscreen<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { prepareMargin = "400px" }: OnscreenOptions = {}
): { prepared: boolean; onscreen: boolean } {
  const [prepared, setPrepared] = useState(false);
  const [onscreen, setOnscreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prepareIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPrepared(true);
          prepareIo.disconnect();
        }
      },
      { rootMargin: `${prepareMargin} 0px` }
    );
    prepareIo.observe(el);

    const activateIo = new IntersectionObserver(
      ([entry]) => {
        // Set on the element itself, not just in React state, so plain CSS
        // ([data-onscreen="false"] .motion-ambient) can react without
        // waiting on a render, and sibling/descendant selectors work without
        // threading the boolean through props.
        el.dataset.onscreen = String(entry.isIntersecting);
        setOnscreen(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    activateIo.observe(el);

    return () => {
      prepareIo.disconnect();
      activateIo.disconnect();
    };
  }, [ref, prepareMargin]);

  return { prepared: prepared || onscreen, onscreen };
}
