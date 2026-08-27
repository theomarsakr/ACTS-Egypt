"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { geoDistance, geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { timer as d3Timer, type Timer } from "d3-timer";
import { brands } from "@/lib/data";
import { localeHref } from "@/lib/i18n";
import { useCoarsePointer, useReducedMotion } from "@/lib/hooks";

/* Halftone-dot wireframe globe (orthographic projection, drag to rotate,
   scroll to zoom, slow auto-rotation when idle). Land is rendered as a field
   of dots rather than filled shapes — the dot positions are precomputed at
   build time (scripts/generate-land-dots.mjs, run over the same low-res
   110m land outline) into public/geo/land-dots.json, fetched alongside the
   outline itself rather than recomputed via a point-in-polygon scan on every
   visitor's device: the outline and dot spacing are both fixed, so the scan
   produces byte-identical output every time — the only thing that changed is
   who pays for it. Everything after that runs on a single canvas 2D context
   for performance (no per-dot DOM nodes, no SVG).

   Pins mark ACTS (Giza) and each represented brand's home facility, joined by
   great-circle supply arcs back to Giza. Pin hit-testing is done by hand on
   canvas mousemove (screen position comes from re-projecting each pin's
   lng/lat every frame) since canvas has no DOM nodes to attach listeners to. */

type GeoPosition = [number, number];
type LandGeometry =
  | { type: "Polygon"; coordinates: GeoPosition[][] }
  | { type: "MultiPolygon"; coordinates: GeoPosition[][][] };
type LandFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: LandGeometry;
};
type LandCollection = { type: "FeatureCollection"; features: LandFeature[] };

/* City-level coordinates for ACTS and each represented brand's home
   facility — public, well-known locations (not survey-grade, appropriate for
   a globe marker at this scale). */
const HQ = { lng: 30.9771, lat: 30.056, city: "Arkan Plaza, Sheikh Zayed City, Giza" };
// Same Maps search query used by the office card on /contact.
const HQ_MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza";
const BRAND_COORDS: Record<string, { lng: number; lat: number; city: string }> = {
  "farris-engineering": { lng: -81.6285, lat: 41.3245, city: "Brecksville, Ohio, USA" },
  "dyna-flo": { lng: -113.4938, lat: 53.5461, city: "Edmonton, Canada" },
  est: { lng: -75.2932, lat: 40.2887, city: "Hatfield, Pennsylvania, USA" },
};

type Pin = {
  slug: string | null;
  name: string;
  city: string;
  lng: number;
  lat: number;
  isHub?: boolean;
};

const PINS: Pin[] = [
  { slug: null, name: "ACTS Headquarters", city: HQ.city, lng: HQ.lng, lat: HQ.lat, isHub: true },
  ...brands
    .filter((b) => BRAND_COORDS[b.slug])
    .map((b) => ({ slug: b.slug, name: b.name, ...BRAND_COORDS[b.slug] })),
];

/* Sphere radius as a fraction of the shorter canvas edge.
 *
 * This was `/ 2.4`, and that number never actually reached the projection.
 * `resize()` derives `zoomRatio` from `projection.scale() / radius` so a
 * manual pinch-zoom survives a resize — but on the FIRST call the projection
 * is still carrying d3's default orthographic scale (249.5), so
 * `radius * (249.5 / radius)` cancels to exactly 249.5 at every viewport. The
 * globe was drawn at a fixed 499px diameter no matter how large its canvas
 * was; it never responded to the viewport at all.
 *
 * That stayed invisible on desktop because the canvas there is the full 520px
 * the one call site asks for (min(520, innerWidth - 40), so any viewport
 * >=560px), and a 499px sphere sits inside 520px. Below 560px the canvas
 * shrinks and the sphere does not: at 390px it is a 499px sphere in a 350px
 * box, clipped on all four sides — the "globe is zoomed in on mobile" report.
 *
 * 0.4798 is 249.5/520 — precisely the proportion the globe has been rendering
 * at on desktop all along — so viewports >=560px are unchanged to within a
 * rounding error, and everything below finally scales with its canvas. Pair
 * with `.scale(radius)` on the projection below: that is what makes the first
 * resize() compute a zoomRatio of 1 rather than 1.71. */
const SPHERE_RADIUS_RATIO = 0.4798;

export default function RotatingEarth({
  width = 560,
  height = 560,
  lang = "en",
  className = "",
}: {
  width?: number;
  height?: number;
  lang?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; pin: Pin } | null>(null);
  const router = useRouter();
  const tooltipRef = useRef(tooltip);
  useEffect(() => {
    tooltipRef.current = tooltip;
  }, [tooltip]);

  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  // Read inside the pointer-event closures below via refs rather than
  // effect dependencies: the main effect below does real setup (canvas
  // sizing, the projection, the land-data fetch) that would be wasteful to
  // tear down and rebuild every time either of these — device/user signals
  // that essentially never change mid-session — happen to change.
  const reducedRef = useRef(reduced);
  const coarseRef = useRef(coarse);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  useEffect(() => {
    coarseRef.current = coarse;
  }, [coarse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Mutable, not const: `resize()` below recomputes all four on window
    // resize/orientation change, which used to only ever run once at mount.
    let containerWidth = Math.min(width, window.innerWidth - 40);
    let containerHeight = Math.min(height, containerWidth);
    let radius = Math.min(containerWidth, containerHeight) * SPHERE_RADIUS_RATIO;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // `.scale(radius)` is load-bearing, not decorative: without it the first
    // resize() reads d3's default 249.5 as if it were a user's zoom. See
    // SPHERE_RADIUS_RATIO above.
    const projection = geoOrthographic().clipAngle(90).scale(radius);

    // Sizes the canvas to the current viewport and rescales the projection,
    // preserving whatever zoom ratio the user had dialed in (a resize
    // shouldn't silently reset a manual zoom back to 1x).
    const resize = () => {
      const zoomRatio = radius > 0 ? projection.scale() / radius : 1;
      containerWidth = Math.min(width, window.innerWidth - 40);
      containerHeight = Math.min(height, containerWidth);
      radius = Math.min(containerWidth, containerHeight) * SPHERE_RADIUS_RATIO;
      // Capped at 2x — an uncapped DPR on a 3x/4x phone would triple the
      // canvas' pixel area (and every arc/fill call in `render`) for no
      // visible gain.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      // setTransform, not scale: scale() compounds on every call, and this
      // now runs more than once.
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.translate([containerWidth / 2, containerHeight / 2]).scale(radius * zoomRatio);
    };
    resize();
    const path = geoPath(projection, context);
    const graticule = geoGraticule();
    const arcs = PINS.filter((p) => !p.isHub).map((p) => ({
      pin: p,
      line: {
        type: "LineString" as const,
        coordinates: [
          [HQ.lng, HQ.lat],
          [p.lng, p.lat],
        ],
      },
    }));

    let landFeatures: LandCollection | null = null;
    const allDots: GeoPosition[] = [];
    /** Screen-space hit targets for the pins visible in the last render. */
    let pinScreenPositions: { pin: Pin; x: number; y: number }[] = [];
    const startTime = Date.now();

    const rotation: [number, number] = [0, 0];
    const isFrontFacing = ([lng, lat]: GeoPosition) =>
      geoDistance([lng, lat], [-rotation[0], -rotation[1]]) < Math.PI / 2 - 0.05;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      const scaleFactor = projection.scale() / radius;
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;

      context.beginPath();
      context.arc(cx, cy, projection.scale(), 0, 2 * Math.PI);
      context.fillStyle = "#060d1c";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.15)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      if (!landFeatures) return;

      context.beginPath();
      path(graticule());
      context.strokeStyle = "rgba(255, 255, 255, 0.12)";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();

      context.beginPath();
      landFeatures.features.forEach((feature) => path(feature));
      context.strokeStyle = "rgba(255, 255, 255, 0.55)";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();

      for (const [lng, lat] of allDots) {
        const projected = projection([lng, lat]);
        if (
          !projected ||
          projected[0] < 0 ||
          projected[0] > containerWidth ||
          projected[1] < 0 ||
          projected[1] > containerHeight
        ) {
          continue;
        }
        context.beginPath();
        context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
        context.fillStyle = "rgba(240, 196, 25, 0.6)";
        context.fill();
      }

      // Supply-route arcs, Giza → each brand's facility.
      context.setLineDash([1 * scaleFactor, 4 * scaleFactor]);
      arcs.forEach(({ line }) => {
        context.beginPath();
        path(line);
        context.strokeStyle = "rgba(255, 255, 255, 0.4)";
        context.lineWidth = 1.2 * scaleFactor;
        context.stroke();
      });
      context.setLineDash([]);

      // Pins — solid dot + a slow radiating pulse ring, phase-offset per pin.
      const elapsed = (Date.now() - startTime) / 1000;
      pinScreenPositions = [];
      PINS.forEach((pin, i) => {
        if (!isFrontFacing([pin.lng, pin.lat])) return;
        const projected = projection([pin.lng, pin.lat]);
        if (!projected) return;
        const [x, y] = projected;
        const color = pin.isHub ? "240, 196, 25" : "255, 255, 255";

        const phase = ((elapsed + i * 0.6) % 2) / 2;
        context.beginPath();
        context.arc(x, y, (3 + phase * 11) * scaleFactor, 0, 2 * Math.PI);
        context.strokeStyle = `rgba(${color}, ${0.5 * (1 - phase)})`;
        context.lineWidth = 1.2 * scaleFactor;
        context.stroke();

        context.beginPath();
        context.arc(x, y, (pin.isHub ? 4 : 3) * scaleFactor, 0, 2 * Math.PI);
        context.fillStyle = `rgb(${color})`;
        context.fill();
        context.strokeStyle = "#060d1c";
        context.lineWidth = 1.2 * scaleFactor;
        context.stroke();

        pinScreenPositions.push({ pin, x, y });
      });
    };

    let autoRotate = !reducedRef.current;
    const rotationSpeed = 0.5;
    /* The auto-rotation loop (and the data fetch that feeds it) only runs
       while this canvas is actually on screen and the tab is visible — this
       section sits well below the fold, so without gating it the globe would
       redraw thousands of dots on every animation frame for the entire time
       the tab is open, whether or not anyone has scrolled anywhere near it.
       Also gated on prefers-reduced-motion — there was no such gate on this
       loop at all before; the globe is still fully draggable/zoomable, it
       just doesn't spin on its own. */
    let rotationTimer: Timer | null = null;
    const startRotationTimer = () => {
      if (rotationTimer || reducedRef.current) return;
      rotationTimer = d3Timer(() => {
        if (!autoRotate || reducedRef.current) return;
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      });
    };
    const stopRotationTimer = () => {
      rotationTimer?.stop();
      rotationTimer = null;
    };

    // Chromium fires a synthetic, compatibility mousedown/mousemove shortly
    // after a real touch interaction ends (for sites that only listen for
    // mouse events) — without this guard, that echo immediately clears the
    // tooltip a touch tap had just correctly set, right after
    // handlePointerUp set it. Any non-mouse pointer event marks the time;
    // the mouse handlers below bail if one just happened.
    let lastNonMouseTime = 0;
    const COMPAT_EVENT_WINDOW_MS = 800;
    const isSyntheticCompatEvent = () => Date.now() - lastNonMouseTime < COMPAT_EVENT_WINDOW_MS;

    const handleMouseDown = (event: MouseEvent) => {
      if (isSyntheticCompatEvent()) return;
      autoRotate = false;
      setTooltip(null);
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        rotation[0] = startRotation[0] + (moveEvent.clientX - startX) * sensitivity;
        rotation[1] = Math.max(
          -90,
          Math.min(90, startRotation[1] - (moveEvent.clientY - startY) * sensitivity)
        );
        projection.rotate(rotation);
        render();
      };
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setTimeout(() => {
          autoRotate = !reducedRef.current;
        }, 10);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const zoomTo = (scale: number) => {
      const next = Math.max(radius * 0.5, Math.min(radius * 3, scale));
      projection.scale(next);
      render();
    };

    /* Touch equivalent of handleMouseDown — phones/tablets have no mouse, so
       without this the globe was only draggable with a cursor. A single
       finger rotates it exactly like a mouse drag would; two fingers pinch-
       zoom instead. `touch-action: none` on the canvas (see JSX below) is
       what lets `preventDefault` here stop the page from scrolling instead. */
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        autoRotate = false;
        setTooltip(null);
        const dist = (t: TouchList) =>
          Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        const startDist = dist(event.touches);
        const startScale = projection.scale();

        const handlePinchMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length !== 2) return;
          moveEvent.preventDefault();
          zoomTo(startScale * (dist(moveEvent.touches) / startDist));
        };
        const handlePinchEnd = () => {
          document.removeEventListener("touchmove", handlePinchMove);
          document.removeEventListener("touchend", handlePinchEnd);
          document.removeEventListener("touchcancel", handlePinchEnd);
          setTimeout(() => {
            autoRotate = !reducedRef.current;
          }, 10);
        };
        document.addEventListener("touchmove", handlePinchMove, { passive: false });
        document.addEventListener("touchend", handlePinchEnd);
        document.addEventListener("touchcancel", handlePinchEnd);
        return;
      }
      if (event.touches.length !== 1) return;
      autoRotate = false;
      setTooltip(null);
      const startX = event.touches[0].clientX;
      const startY = event.touches[0].clientY;
      const startRotation: [number, number] = [...rotation];

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length !== 1) return;
        moveEvent.preventDefault();
        const sensitivity = 0.5;
        const touch = moveEvent.touches[0];
        rotation[0] = startRotation[0] + (touch.clientX - startX) * sensitivity;
        rotation[1] = Math.max(
          -90,
          Math.min(90, startRotation[1] - (touch.clientY - startY) * sensitivity)
        );
        projection.rotate(rotation);
        render();
      };
      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        setTimeout(() => {
          autoRotate = !reducedRef.current;
        }, 10);
      };
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
    };

    const toLocalPoint = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width / containerWidth;
      return [(event.clientX - rect.left) / scale, (event.clientY - rect.top) / scale];
    };

    // A 20px hit circle is generous for a mouse but tight for a fingertip;
    // widened under a coarse pointer. Checked the actual geometry rather
    // than assuming it's safe: the three North American brand pins
    // (Ohio/Alberta/Pennsylvania) are close enough on a global scale that
    // at ~21% of possible globe rotations, two of them already project
    // within 20px of each other with the *original* 10px radius — this is
    // pre-existing, not introduced here. Widening to 18px adds a negligible
    // ~0.2 percentage points to that (checked by sampling the full rotation
    // space in 2° steps). What actually matters for the ambiguous case is
    // returning the *nearest* pin within range rather than whichever came
    // first in PINS — see below. Hit area only; the painted dot is unchanged.
    const findPinNear = (x: number, y: number) => {
      const r = coarseRef.current ? 18 : 10;
      let best: { pin: Pin; x: number; y: number } | undefined;
      let bestDist = r;
      for (const p of pinScreenPositions) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      }
      return best;
    };

    const handleHover = (event: MouseEvent) => {
      if (isSyntheticCompatEvent()) return;
      const [x, y] = toLocalPoint(event);
      const hit = findPinNear(x, y);
      canvas.style.cursor = hit ? "pointer" : "grab";
      if (hit?.pin !== tooltipRef.current?.pin) {
        setTooltip(hit ? { x: hit.x, y: hit.y, pin: hit.pin } : null);
        // Pause auto-rotation while a tooltip is showing so it stays put.
        autoRotate = !hit && !reducedRef.current;
      }
    };

    const handleLeave = () => {
      setTooltip(null);
      autoRotate = !reducedRef.current;
    };

    const navigateToPin = (pin: Pin) => {
      if (pin.isHub) {
        window.open(HQ_MAPS_HREF, "_blank", "noopener,noreferrer");
      } else if (pin.slug) {
        router.push(localeHref(lang, `/brands/${pin.slug}`));
      }
    };

    /* Tap vs. drag, and mouse vs. touch: a mouse click on a pin still
       navigates immediately (handleHover already showed the tooltip on
       approach). A touch/pen tap on a pin instead reveals the tooltip —
       now with a real, navigable <a> inside it (see the JSX below) — and
       waits for a second, deliberate tap on that link. A double-tap-to-
       confirm gesture would work too, but wouldn't be keyboard-reachable or
       screen-reader-legible the way a real anchor is.
       Runs alongside handleMouseDown/handleTouchStart above rather than
       replacing them: this only tracks whether the gesture stayed within a
       tap's distance/time budget, so it never needs to coordinate with the
       drag-rotate state machine — a real drag simply won't qualify as a
       tap and this becomes a no-op. */
    let tapStart: { x: number; y: number; time: number; pointerType: string } | null = null;
    const TAP_MAX_DIST = 8;
    const TAP_MAX_MS = 400;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") lastNonMouseTime = Date.now();
      tapStart = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now(),
        pointerType: event.pointerType,
      };
    };

    const handlePointerUp = (event: PointerEvent) => {
      const start = tapStart;
      tapStart = null;
      if (!start) return;
      const dist = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      const elapsed = Date.now() - start.time;
      if (dist >= TAP_MAX_DIST || elapsed >= TAP_MAX_MS) return;

      const [x, y] = toLocalPoint(event);
      const hit = findPinNear(x, y);

      if (start.pointerType === "mouse") {
        if (hit) navigateToPin(hit.pin);
        return;
      }
      if (!hit) {
        setTooltip(null);
        autoRotate = !reducedRef.current;
        return;
      }
      setTooltip({ x: hit.x, y: hit.y, pin: hit.pin });
      autoRotate = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.9 : 1.1;
      zoomTo(projection.scale() * factor);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleHover);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Fetched once, the first time the globe becomes visible — not on mount —
    // so a visitor who never scrolls this far never pays for either request.
    let landDataRequested = false;
    const landDataAbort = new AbortController();
    const loadLandData = () => {
      if (landDataRequested) return;
      landDataRequested = true;
      (async () => {
        try {
          setIsLoading(true);
          // Both served from our own origin (public/geo/), not
          // raw.githubusercontent.com. A cross-origin fetch here put the hero
          // visual at the mercy of ad blockers, privacy extensions, corporate
          // proxies, and GitHub's rate limits, and would be blocked outright
          // by connect-src 'self'. Outline source: github.com/martynafford/
          // natural-earth-geojson (MIT), from Natural Earth 110m physical
          // land (public domain). land-dots.json is the same outline's dots,
          // precomputed by scripts/generate-land-dots.mjs — see that file
          // for why the scan itself doesn't run here anymore.
          const [outlineRes, dotsRes] = await Promise.all([
            fetch("/geo/ne_110m_land.json", { signal: landDataAbort.signal }),
            fetch("/geo/land-dots.json", { signal: landDataAbort.signal }),
          ]);
          if (!outlineRes.ok) {
            throw new Error(`land outline responded ${outlineRes.status}`);
          }
          if (!dotsRes.ok) {
            throw new Error(`land dots responded ${dotsRes.status}`);
          }
          const collection = (await outlineRes.json()) as LandCollection;
          if (!collection?.features?.length) {
            throw new Error("land data contained no features");
          }
          const dots = (await dotsRes.json()) as GeoPosition[];
          landFeatures = collection;
          allDots.push(...dots);
          render();
          setIsLoading(false);
        } catch (err) {
          // An abort is the cleanup path on unmount, not a failure — leaving
          // the error panel up for it would flash a broken globe on nav.
          if (landDataAbort.signal.aborted) return;
          console.error("globe land data failed to load:", err);
          setError("Failed to load globe data");
          setIsLoading(false);
        }
      })();
    };

    const play = () => {
      loadLandData();
      startRotationTimer();
    };
    const pause = () => {
      stopRotationTimer();
    };

    // Same "pause off-screen or on a hidden tab" lifecycle as the hero's
    // interactive canvas background.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && document.visibilityState === "visible") {
          play();
        } else {
          pause();
        }
      },
      { threshold: 0 }
    );
    const onVisibility = () => {
      if (document.visibilityState === "visible") play();
      else pause();
    };
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    // Window resize / orientation change — rAF-throttled so a drag-resize
    // doesn't re-layout the canvas every intermediate pixel.
    let resizeFrame: number | null = null;
    const onResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        resize();
        render();
      });
    };
    window.addEventListener("resize", onResize);

    render();

    return () => {
      stopRotationTimer();
      landDataAbort.abort();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleHover);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [width, height, lang, router]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-navy-800 p-8 ${className}`}
      >
        <p className="text-[14px] text-white/60">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="cursor-grab rounded-full active:cursor-grabbing"
        style={{ maxWidth: "100%", height: "auto", touchAction: "none" }}
      />
      {tooltip && (
        <div
          className="glass-dark absolute z-10 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] -translate-x-1/2 -translate-y-[calc(100%+10px)]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {/* A real, navigable link — not just a label. On a mouse, a click
              on the pin already navigates directly (see handlePointerUp);
              on touch/pen a tap only reveals this tooltip, and this link is
              the second, deliberate step that actually goes there. Real
              anchor: keyboard-reachable and screen-reader-legible, unlike a
              double-tap gesture would be. */}
          {tooltip.pin.isHub ? (
            <a
              href={HQ_MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <div className="font-bold text-white">{tooltip.pin.name}</div>
              <div className="text-white/60">{tooltip.pin.city}</div>
            </a>
          ) : (
            <Link
              href={localeHref(lang, `/brands/${tooltip.pin.slug}`)}
              className="tap-target block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <div className="font-bold text-white">{tooltip.pin.name}</div>
              <div className="text-white/60">{tooltip.pin.city}</div>
            </Link>
          )}
        </div>
      )}
      {/* Control legend, not a page-scroll cue, so it keeps its own shape
          rather than becoming a <ScrollHint> chip — but it was set at
          `white/70` over a lit globe, where it disappeared against the
          bright limb. Given a real ground and full-strength text. */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap text-white ring-1 ring-white/25 backdrop-blur-md">
        {isLoading
          ? "Loading globe…"
          : coarse
            ? "Drag to rotate · Pinch to zoom"
            : "Drag to rotate · Scroll to zoom"}
      </div>
    </div>
  );
}
