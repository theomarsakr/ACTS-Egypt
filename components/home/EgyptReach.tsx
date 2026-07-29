"use client";

import { useState } from "react";

/**
 * EgyptReach — the location card's claim, made concrete: the country outline
 * draws itself in, the Nile follows, then named client sites resolve as
 * pins, each joined to the HQ by its own reach line — the same "hub with
 * spokes to everyone" language as the RotatingEarth globe's supply arcs.
 * Hover or focus a pin for its name (same `.glass-dark`-style tooltip
 * treatment as the globe's brand pins). Pure SVG + a thin client-state layer
 * for the tooltip — the draw-in animations still key off the `.in-view`
 * class the surrounding <Reveal> applies.
 *
 * Geometry is a deliberate simplification of the real coastline — enough to
 * be unmistakably Egypt at this size — plotted from lon/lat as
 * x = (lon - 24) * 20, y = (32.5 - lat) * 20. Pin positions follow the same
 * scale but are hand-nudged for legibility (city-level, not survey-grade —
 * the same latitude the globe's brand pins already take).
 */

type Pin = {
  name: string;
  sector: string;
  x: number;
  y: number;
};

const HQ = {
  name: "ACTS Headquarters",
  sector: "Arkan Plaza, Sheikh Zayed City",
  x: 145,
  y: 50,
};

const PINS: Pin[] = [
  { name: "Khalda Petroleum", sector: "Upstream — Western Desert", x: 72, y: 98 },
  {
    name: "Belayim Petroleum (PETROBEL)",
    sector: "Upstream — Gulf of Suez",
    x: 182,
    y: 82,
  },
  { name: "ENPPI", sector: "Engineering & EPC — Cairo", x: 161, y: 44 },
  {
    name: "SUMED",
    sector: "Pipeline Terminal — Ain Sokhna, Suez Gulf",
    x: 168,
    y: 58,
  },
  {
    name: "Damietta LNG (DLNG)",
    sector: "LNG Export Terminal — Damietta",
    x: 151,
    y: 24,
  },
  { name: "Birla Carbon", sector: "Carbon Black Plant — Alexandria", x: 106, y: 25 },
  {
    name: "Abu Qir Fertilizers",
    sector: "Fertilizers — Abu Qir, Alexandria",
    x: 135,
    y: 19,
  },
  {
    name: "Assiut Oil Refining Company",
    sector: "Refining — Assiut, Upper Egypt",
    x: 143,
    y: 108,
  },
];

/* A gentle quadratic bow from the HQ out to a pin — same "supply line" read
   as the globe's great-circle arcs, generated instead of hand-drawn so every
   pin gets one, not just the two the copy used to call out by name. The
   control point is offset perpendicular to the straight line, biased to
   bow toward the top of the map, which is what the two original hand-drawn
   curves (to Khalda and Belayim) did. */
const reachPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let px = -dy / len;
  let py = dx / len;
  if (py > 0) {
    px = -px;
    py = -py;
  }
  const bow = len * 0.12;
  const cx = (from.x + to.x) / 2 + px * bow;
  const cy = (from.y + to.y) / 2 + py * bow;
  return `M${from.x} ${from.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
};

/* viewBox is "-6 6 276 218" — convert a map-space point to a % position for
   the HTML tooltip layer that sits over the SVG. */
const toPct = (x: number, y: number) => ({
  left: `${((x + 6) / 276) * 100}%`,
  top: `${((y - 6) / 218) * 100}%`,
});

export default function EgyptReach({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<Pin | null>(null);

  const pinHandlers = (pin: Pin) => ({
    onMouseEnter: () => setActive(pin),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(pin),
    onBlur: () => setActive(null),
  });

  return (
    <div className={`eg-map-wrap relative ${className}`}>
      <svg
        viewBox="-6 6 276 218"
        className="eg-map"
        role="img"
        aria-label="Map of Egypt showing ACTS headquarters and client sites"
      >
        <defs>
          <radialGradient id="eg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(240,196,25,0.35)" />
            <stop offset="100%" stopColor="rgba(240,196,25,0)" />
          </radialGradient>
        </defs>

        {/* Landmass: Mediterranean coast → Sinai → Red Sea → 22°N → 25°E */}
        <path
          className="eg-shape"
          d="M23 19 L64.8 23 L118 26 L128 20 L156 20 L166 25 L205 24 L218 61 L206 95
             L171 51 L196 105 L205.6 128 L230 172 L258 210 L20 210 Z"
        />

        {/* The Nile, then its delta */}
        <path className="eg-nile" d="M178 168 L172 136 L174 126 L144 106 L145 49" />
        <path className="eg-nile eg-nile-b" d="M145 49 L128 22 M145 49 L156 22" />

        {/* Reach: HQ → every client site, one line each */}
        {PINS.map((pin, i) => (
          <path
            key={`reach-${pin.name}`}
            className="eg-reach"
            style={{ "--i": i } as React.CSSProperties}
            d={reachPath(HQ, pin)}
          />
        ))}

        {/* Client site pins */}
        {PINS.map((pin, i) => (
          <g
            key={pin.name}
            className="eg-site"
            style={{ "--i": i + 1 } as React.CSSProperties}
            tabIndex={0}
            role="button"
            aria-label={`${pin.name}: ${pin.sector}`}
            {...pinHandlers(pin)}
          >
            {/* Larger, invisible hit area — the visible ring is a touch small
                for a comfortable hover/tap target on its own. */}
            <circle cx={pin.x} cy={pin.y} r={11} fill="transparent" />
            <circle className="eg-site-ring" cx={pin.x} cy={pin.y} r="6.5" />
            <circle className="eg-site-core" cx={pin.x} cy={pin.y} r="2.8" />
          </g>
        ))}

        {/* Giza HQ */}
        <g
          className="eg-hq"
          tabIndex={0}
          role="button"
          aria-label={`${HQ.name}: ${HQ.sector}`}
          {...pinHandlers(HQ)}
        >
          <circle cx={HQ.x} cy={HQ.y} r={26} fill="url(#eg-glow)" />
          <circle cx={HQ.x} cy={HQ.y} r={16} fill="transparent" />
          <circle className="eg-pulse" cx={HQ.x} cy={HQ.y} r="5" />
          <circle className="eg-pulse eg-pulse-b" cx={HQ.x} cy={HQ.y} r="5" />
          <circle className="eg-hq-core" cx={HQ.x} cy={HQ.y} r="4.8" />
        </g>
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg bg-navy px-3 py-1.5 text-center whitespace-nowrap shadow-lg"
          style={toPct(active.x, active.y)}
        >
          <div className="text-[12.5px] font-bold text-white">{active.name}</div>
          <div className="text-[11px] text-white/60">{active.sector}</div>
        </div>
      )}
    </div>
  );
}
