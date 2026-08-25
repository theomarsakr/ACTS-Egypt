"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

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
