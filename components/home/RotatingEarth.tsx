"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  geoBounds,
  geoDistance,
  geoGraticule,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { timer as d3Timer, type Timer } from "d3-timer";
import { brands } from "@/lib/data";
import { localeHref } from "@/lib/i18n";

/* Halftone-dot wireframe globe (orthographic projection, drag to rotate,
   scroll to zoom, slow auto-rotation when idle). Land is rendered as a field
   of dots rather than filled shapes — the position of each dot is computed
   once via a point-in-polygon scan over a low-res (110m) land outline, fetched
   client-side since the dataset is only needed for this one visual. Everything
   after that runs on a single canvas 2D context for performance (no per-dot
   DOM nodes, no SVG).

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

const pointInRing = (point: GeoPosition, ring: GeoPosition[]): boolean => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

const pointInFeature = (point: GeoPosition, feature: LandFeature): boolean => {
  const { geometry } = feature;
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polygons) {
    if (!pointInRing(point, rings[0])) continue;
    const inHole = rings.slice(1).some((ring) => pointInRing(point, ring));
    if (!inHole) return true;
  }
  return false;
};

const generateDotsInFeature = (feature: LandFeature, dotSpacing = 16) => {
  const dots: GeoPosition[] = [];
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(feature);
  const step = dotSpacing * 0.08;
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      const point: GeoPosition = [lng, lat];
      if (pointInFeature(point, feature)) dots.push(point);
    }
  }
  return dots;
};

/* City-level coordinates for ACTS and each represented brand's home
   facility — public, well-known locations (not survey-grade, appropriate for
   a globe marker at this scale). */
const HQ = { lng: 30.9771, lat: 30.056, city: "Arkan Plaza, Sheikh Zayed City, Giza" };
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, containerWidth);
    const radius = Math.min(containerWidth, containerHeight) / 2.4;

    // Capped at 2x — an uncapped DPR on a 3x/4x phone would triple the canvas'
    // pixel area (and every arc/fill call in `render`) for no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);
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

    let autoRotate = true;
    const rotationSpeed = 0.5;
    /* The auto-rotation loop (and the data fetch that feeds it) only runs
       while this canvas is actually on screen and the tab is visible — this
       section sits well below the fold, so without gating it the globe would
       redraw thousands of dots on every animation frame for the entire time
       the tab is open, whether or not anyone has scrolled anywhere near it. */
    let rotationTimer: Timer | null = null;
    const startRotationTimer = () => {
      if (rotationTimer) return;
      rotationTimer = d3Timer(() => {
        if (!autoRotate) return;
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      });
    };
    const stopRotationTimer = () => {
      rotationTimer?.stop();
      rotationTimer = null;
    };

    const handleMouseDown = (event: MouseEvent) => {
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
          autoRotate = true;
        }, 10);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    /* Touch equivalent of handleMouseDown — phones/tablets have no mouse, so
       without this the globe was only draggable with a cursor. A single
       finger rotates it exactly like a mouse drag would; `touch-action: none`
       on the canvas (see JSX below) is what lets `preventDefault` here stop
       the page from scrolling instead. */
    const handleTouchStart = (event: TouchEvent) => {
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
          autoRotate = true;
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

    const findPinNear = (x: number, y: number) =>
      pinScreenPositions.find((p) => Math.hypot(p.x - x, p.y - y) < 10);

    const handleHover = (event: MouseEvent) => {
      const [x, y] = toLocalPoint(event);
      const hit = findPinNear(x, y);
      canvas.style.cursor = hit ? "pointer" : "grab";
      if (hit?.pin !== tooltipRef.current?.pin) {
        setTooltip(hit ? { x: hit.x, y: hit.y, pin: hit.pin } : null);
        // Pause auto-rotation while a tooltip is showing so it stays put.
        autoRotate = !hit;
      }
    };

    const handleLeave = () => {
      setTooltip(null);
      autoRotate = true;
    };

    const handleClick = (event: MouseEvent) => {
      const [x, y] = toLocalPoint(event);
      const hit = findPinNear(x, y);
      if (hit?.pin.slug) {
        router.push(localeHref(lang, `/brands/${hit.pin.slug}`));
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.9 : 1.1;
      const next = Math.max(
        radius * 0.5,
        Math.min(radius * 3, projection.scale() * factor)
      );
      projection.scale(next);
      render();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleHover);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Fetched once, the first time the globe becomes visible — not on mount —
    // so a visitor who never scrolls this far never pays for the request or
    // for the point-in-polygon scan that turns it into dots.
    let landDataRequested = false;
    const loadLandData = () => {
      if (landDataRequested) return;
      landDataRequested = true;
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
          );
          if (!response.ok) throw new Error("Failed to load land data");
          landFeatures = (await response.json()) as LandCollection;
          landFeatures.features.forEach((feature) => {
            allDots.push(...generateDotsInFeature(feature));
          });
          render();
          setIsLoading(false);
        } catch {
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

    render();

    return () => {
      stopRotationTimer();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleHover);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("click", handleClick);
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
          className="glass-dark pointer-events-none absolute z-10 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] -translate-x-1/2 -translate-y-[calc(100%+10px)]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold text-white">{tooltip.pin.name}</div>
          <div className="text-white/60">{tooltip.pin.city}</div>
        </div>
      )}
      <div className="glass-dark pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-medium text-white/70">
        {isLoading ? "Loading globe…" : "Drag to rotate · Scroll to zoom"}
      </div>
    </div>
  );
}
