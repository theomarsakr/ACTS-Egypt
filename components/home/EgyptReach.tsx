"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { localeHref } from "@/lib/i18n";

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
  { name: "Khalda Petroleum", sector: "Upstream, Western Desert", x: 72, y: 98 },
  {
    name: "Belayim Petroleum (PETROBEL)",
    sector: "Upstream, Gulf of Suez",
    x: 182,
    y: 82,
  },
  { name: "ENPPI", sector: "Engineering & EPC, Cairo", x: 161, y: 44 },
  {
    name: "SUMED",
    sector: "Pipeline terminal, Ain Sokhna, Suez Gulf",
    x: 172,
    y: 66,
  },
  {
    name: "Damietta LNG (DLNG)",
    sector: "LNG export terminal, Damietta",
    x: 151,
    y: 24,
  },
  { name: "Birla Carbon", sector: "Carbon black plant, Alexandria", x: 106, y: 25 },
  {
    name: "Abu Qir Fertilizers",
    sector: "Fertilizers, Abu Qir, Alexandria",
    x: 135,
    y: 19,
  },
  {
    name: "Assiut Oil Refining Company",
    sector: "Refining, Assiut, Upper Egypt",
    x: 143,
    y: 108,
  },
  {
    name: "Qarun Petroleum",
    sector: "Upstream, Qarun Basin, Fayoum",
    x: 120,
    y: 74,
  },
  {
    name: "GUPCO",
    sector: "Upstream, Ras Gharib, Gulf of Suez",
    x: 196,
    y: 104,
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

export default function EgyptReach({
  className = "",
  lang = "en",
}: {
  className?: string;
  lang?: string;
}) {
  const [active, setActive] = useState<Pin | null>(null);
  const router = useRouter();

  const pinHandlers = (pin: Pin) => ({
    onMouseEnter: () => setActive(pin),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(pin),
    onBlur: () => setActive(null),
    // Hover/focus don't fire reliably from a touch tap (no cursor, and iOS
    // Safari doesn't auto-focus non-form elements on tap) — a click handler
    // covers touch too, toggling so a second tap on the same pin dismisses it.
    onClick: () => setActive((prev) => (prev?.name === pin.name ? null : pin)),
  });

  // The HQ pin is a real destination, not just a label to toggle: clicking it
  // jumps to the map embedded on /contact, so the tooltip's promise ("this is
  // where we are") has somewhere to go. Hover/focus still preview the
  // tooltip like every other pin; only the click behavior differs.
  const goToMap = () => router.push(localeHref(lang, "/contact#office"));
  const hqHandlers = {
    onMouseEnter: () => setActive(HQ),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(HQ),
    onBlur: () => setActive(null),
    onClick: goToMap,
    // `<g role="link">` gets no native key handling — Enter has to be wired
    // up by hand the way a real <a> gets it for free.
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") goToMap();
    },
  };

  return (
    <div className={`eg-map-wrap relative ${className}`}>
      {/* `group`, not `img`. `role="img"` declares the subtree a single
          indivisible graphic, so a screen reader stops descending — but every
          pin below is a real `role="button"` with its own tabIndex, which the
          reader would then never reach, and which axe flags as a serious
          `nested-interactive` violation. `group` keeps the accessible name on
          the map as a whole while letting the pins inside stay reachable. */}
      <svg
        viewBox="-6 6 276 218"
        className="eg-map"
        role="group"
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
            // See the comment on the r=11 hit circle below: this is the one
            // documented, deliberate exception to the 44px touch floor.
            // tests/responsive.spec.ts reads this attribute to exclude it.
            data-allow-small-target
            {...pinHandlers(pin)}
          >
            {/* Larger, invisible hit area — the visible ring is a touch small
                for a comfortable hover/tap target on its own.

                r=11 and no larger, deliberately: this is the one place on the
                site that cannot reach the 44px touch floor. Ten sites plotted
                on a map of Egypt land 22px apart centre-to-centre at 390px
                (measured on the closest pair, Cairo/Giza), so the hit boxes
                already touch. Growing them would not make a pin easier to
                hit — it would make each pin swallow the taps meant for its
                neighbour, which is worse than a small target: a wrong answer
                instead of a missed one.

                It is a supplementary view rather than the only route to this
                information — the same clients appear as a logo row in this
                section and as full-size links on /projects — and each pin
                carries its own aria-label and is keyboard reachable. Fix the
                density before touching the radius. */}
            <circle cx={pin.x} cy={pin.y} r={11} fill="transparent" />
            <circle className="eg-site-ring" cx={pin.x} cy={pin.y} r="6.5" />
            <circle className="eg-site-core" cx={pin.x} cy={pin.y} r="2.8" />
          </g>
        ))}

        {/* Giza HQ — the one pin that's also a link, to the map on /contact. */}
        <g
          className="eg-hq"
          tabIndex={0}
          role="link"
          aria-label={`${HQ.name}: ${HQ.sector}. View on map.`}
          {...hqHandlers}
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
