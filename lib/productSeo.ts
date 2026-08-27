/* Search-intent copy for the 45 product pages, kept in one reviewable place.
 *
 * These pages are the site's highest-value SEO surface: an Egyptian
 * maintenance or procurement engineer searches the *series number* ("farris
 * 2600 egypt", "dyna-flo DF400", "pop-a-plug P2"), not "safety valve". The
 * generated title used to be `${product.name} — ${brand.name}` — "2600 &
 * 2600L Series — Farris Engineering" — which buries the brand behind the
 * series and never says what the thing is or where you can get it.
 *
 * Every line below is composed from facts already on the product's own page
 * (its tagline, specs and standard in lib/brandHub) plus ACTS's existing
 * sole-agent claim. Nothing is invented: if a fact is not on the page, it is
 * not in the description.
 *
 * Titles omit the " | ACTS Egypt" suffix — lib/seo's `fullTitle` appends it,
 * and each title is sized so the pair lands under ~65 characters.
 */

import type { HubProduct } from "@/lib/brandHub";

type ProductSeo = { title: string; description: string };

/** Keyed by `${brandSlug}:${productId}`. */
const PRODUCT_SEO: Record<string, ProductSeo> = {
  // ── Farris Engineering ────────────────────────────────────────────────────
  "farris-engineering:series-2600": {
    title: "Farris 2600 & 2600L Series Pressure Relief Valve",
    description:
      "Farris 2600 and 2600L full-nozzle API 526 process relief valves, 15–6000 psig, 1\"x2\" to 20\"x24\". Supplied and supported in Egypt by ACTS, sole Farris agent.",
  },
  "farris-engineering:series-3800": {
    title: "Farris 3800 Series Pilot-Operated Relief Valve",
    description:
      "Farris 3800 Series pilot-operated pressure relief valves for high operating-to-set ratios, to API 526. Supplied in Egypt by ACTS, sole agent for Farris Engineering.",
  },
  "farris-engineering:series-2700": {
    title: "Farris 2700 Series Pressure Relief Valve",
    description:
      "Farris 2700 Series direct spring-operated process pressure relief valves, with full series-catalog data. Supplied in Egypt by ACTS, sole agent for Farris.",
  },
  "farris-engineering:series-2400": {
    title: "Farris 2400 Series Soft-Seat Relief Valve",
    description:
      "Farris 2400 Series direct spring-loaded soft-seat relief valve with external blowdown control, to ASME Section VIII. Supplied in Egypt by ACTS, sole Farris agent.",
  },
  "farris-engineering:series-1890": {
    title: "Farris 1890 Series Threaded Relief Valve",
    description:
      "Farris 1890 Series threaded steel relief valve with a full-bore nozzle for air, steam and water service. Supplied in Egypt by ACTS, sole agent for Farris.",
  },
  "farris-engineering:series-4200": {
    title: "Farris 4200 Series Steam Safety Valve",
    description:
      "Farris 4200 Series flanged spring-loaded boiler safety valve with a temperature-equalizing disc. Supplied in Egypt by ACTS, sole agent for Farris Engineering.",
  },
  "farris-engineering:series-6400": {
    title: "Farris 6400 & 6600 Series Steam Safety Valve",
    description:
      "Farris 6400 and 6600 Series boiler safety valves with a hardened conical disc and full nozzle. Supplied in Egypt by ACTS, sole agent for Farris Engineering.",
  },
  "farris-engineering:series-1896": {
    title: "Farris 1896 Series Bronze Steam Safety Valve",
    description:
      "Farris 1896 Series threaded brass and bronze steam safety valve with a full-bore nozzle. Supplied in Egypt by ACTS, sole agent for Farris Engineering.",
  },
  "farris-engineering:series-4700": {
    title: "Farris 4700 Series Steam Safety Valve",
    description:
      "Farris 4700 Series steam safety valve, with full technical data on request. Supplied and supported in Egypt by ACTS, sole agent for Farris Engineering.",
  },
  "farris-engineering:insure": {
    title: "Farris iNSURE® Relief Valve Monitoring System",
    description:
      "iNSURE® detects relief events in real time through valve-stem movement, streaming to an app or DCS. Available in Egypt from ACTS, sole agent for Farris Engineering.",
  },

  // ── Dyna-Flo ──────────────────────────────────────────────────────────────
  "dyna-flo:dyna-sliding-stem": {
    title: "Dyna-Flo 360 & DF2000 Sliding-Stem Control Valves",
    description:
      "Dyna-Flo 360 and DF2000 sliding-stem globe control valves throttle flow through linear plug motion. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-rotary-ball": {
    title: "Dyna-Flo 570 & 590 Rotary Ball Control Valves",
    description:
      "Dyna-Flo 570 and 590 high-capacity segmented and full-ball control valves for throttling or on/off duty. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-df400": {
    title: "Dyna-Flo DF400 Eccentric Rotary Plug Control Valve",
    description:
      "Dyna-Flo DF400 heavy-duty eccentric rotary plug control valve to ASME B16.34, with a self-aligning straight-through path. Supplied in Egypt by ACTS, sole agent.",
  },
  "dyna-flo:dyna-integral": {
    title: "Dyna-Flo DF100 & DF2410 Integral Valve & Actuator",
    description:
      "Dyna-Flo DF100 and DF2410 compact integral valve-and-actuator units for dump-valve service. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-dfc-dfo": {
    title: "Dyna-Flo DFC & DFO Spring-Diaphragm Actuators",
    description:
      "Dyna-Flo DFC and DFO large-diaphragm spring-and-diaphragm linear actuators with fail-safe positioning. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-dfr": {
    title: "Dyna-Flo DFR Rotary Spring-Diaphragm Actuator",
    description:
      "Dyna-Flo DFR large-diaphragm rotary actuator with field-reversible fail-safe action. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-dflp": {
    title: "Dyna-Flo DFLP Linear Pneumatic Piston Actuator",
    description:
      "Dyna-Flo DFLP high-force double-acting pneumatic piston actuator for linear control valves. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-dfrp": {
    title: "Dyna-Flo DFRP Rotary Pneumatic Piston Actuator",
    description:
      "Dyna-Flo DFRP high-torque double-acting piston actuator for quarter-turn valves. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-dfn": {
    title: "Dyna-Flo DFN Yokeless Spring-Diaphragm Actuator",
    description:
      "Dyna-Flo DFN yokeless actuator, bracket-mounted for butterfly valves, chokes and louvers. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-4000": {
    title: "Dyna-Flo 4000 Series Pneumatic Pressure Controller",
    description:
      "Dyna-Flo 4000 Series field-mounted pressure controller, emission-compliant and NACE-ready. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-5000": {
    title: "Dyna-Flo 5000 & 5000E Liquid Level Controller",
    description:
      "Dyna-Flo 5000 and 5000E displacer liquid level controllers with a serviceable zero-bleed relay manifold. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-positioners": {
    title: "Siemens PS2 & Dyna-Flo 760 Valve Positioners",
    description:
      "Siemens PS2 digital HART and 760 pneumatic valve positioners, mountable on any control valve. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-pro50": {
    title: "Dyna-Flo PRO-50 Instrument Air Supply Regulator",
    description:
      "Dyna-Flo PRO-50 compact regulator delivering clean, stable supply air to digital instruments. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },
  "dyna-flo:dyna-t950xp": {
    title: "Control Air T950XP I/P Transducer — Dyna-Flo",
    description:
      "Control Air T950XP current-to-pressure (I/P) transducer for hazardous environments. Supplied in Egypt by ACTS, sole agent for Dyna-Flo.",
  },

  // ── EST (Curtiss-Wright) ──────────────────────────────────────────────────
  "est:est-cpi-perma": {
    title: "Pop-A-Plug® CPI & Perma Heat Exchanger Tube Plugs",
    description:
      "Pop-A-Plug® CPI and Perma weld-free mechanical tube plugs seal heat exchanger tubes to ASME PCC-2 with a helium-tight metal-to-metal seal. In Egypt from ACTS.",
  },
  "est:est-p2": {
    title: "Pop-A-Plug® P2 High-Pressure Tube Plugs",
    description:
      "Pop-A-Plug® P2 tube plugs give a permanent, weld-free seal in high-pressure heat exchanger tubes. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-hydra-loc": {
    title: "Hydra-Loc® Heat Exchanger Tube Sleeving System",
    description:
      "Hydra-Loc® hydraulically expands a sleeve to recover corroded or eroded tube ends. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-smart-ram": {
    title: "Pop-A-Plug® Smart Ram Installation System",
    description:
      "Smart Ram installs Pop-A-Plug® tube plugs cordlessly, with monitored and documented results. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-ram": {
    title: "Pop-A-Plug® Hydraulic Ram Packages",
    description:
      "Pop-A-Plug® hydraulic ram packages install heat exchanger tube plugs quickly and safely. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-manual-tool": {
    title: "Pop-A-Plug® Manual Installation Tool",
    description:
      "The Pop-A-Plug® manual installation tool sets tube plugs where air or electricity is unavailable. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-removal-tool": {
    title: "Pop-A-Plug® Tube Plug Removal Tool",
    description:
      "The Pop-A-Plug® removal tool pulls the plug pin and ring in a single operation. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-ache": {
    title: "Pop-A-Plug® Air-Cooled Exchanger Plugging System",
    description:
      "Extended-reach tooling to test and plug air-cooled (Fin-Fan®) heat exchanger tubes. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-condenser": {
    title: "Condenser Tube Plug Change-Out — EST Curtiss-Wright",
    description:
      "Condenser plug change-out replaces failed plugs to restore vacuum and thermal efficiency. Delivered in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-griptight-max": {
    title: "GripTight MAX® High-Pressure Hydrostatic Test Plug",
    description:
      "GripTight MAX® patented dual-serrated test plug for high-pressure hydrostatic testing of hardened pipe. Supplied in Egypt by ACTS, sole agent for EST.",
  },
  "est:est-griptight-elbow": {
    title: "GripTight® Elbow Hydrostatic Test Plug",
    description:
      "GripTight® Elbow orientation-free hydrostatic test plug for long-radius elbows. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-griptight-pe": {
    title: "GripTight® PE Test Plug for Polyethylene Pipe",
    description:
      "GripTight® PE slip-in test plug for pressure-testing polyethylene pipe on reels or in trench. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-high-lift": {
    title: "High Lift Flange Weld Test & Isolation Plug",
    description:
      "The High Lift plug is a 4-in-1 purge dam, weld fixture, test plug and isolation plug for flange welds. Supplied in Egypt by ACTS, sole agent for EST.",
  },
  "est:est-od-griptight": {
    title: "OD GripTight® Test Plug for Open-End Pipe",
    description:
      "OD GripTight® seals on the pipe outside diameter to hydrostatically test open or plain-end pipe and tube. Supplied in Egypt by ACTS, sole agent for EST.",
  },
  "est:est-socket-sqs": {
    title: "Socket Weld SQS Test Plug — 3,000 lb Fittings",
    description:
      "The Socket Weld SQS twin-cone plug seals 3,000 lb socket-weld fittings for pressure testing. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-reverse-pressure": {
    title: "GripTight® Reverse Pressure Flange Weld Test Plug",
    description:
      "GripTight® Reverse Pressure stresses a flange-to-pipe weld as if the whole system were pressurized. Supplied in Egypt by ACTS, sole agent for EST.",
  },
  "est:est-dbb": {
    title: "Double Block & Bleed Isolation Plug for Hot Work",
    description:
      "The Double Block & Bleed isolation plug isolates and monitors explosive vapors during hot work. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-standard-plugs": {
    title: "Bolt-Type & Economy Hydrostatic Test Plugs",
    description:
      "Bolt-type and economy test plugs for cost-effective medium- and low-pressure testing. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-g-series": {
    title: "G-Series Heat Exchanger Tube & Joint Leak Testers",
    description:
      "G-Series vacuum and pressure testers locate leaking tubes and tube-to-tubesheet joints. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-d-series": {
    title: "D-Series Hot Tapping Tools for Live Pipelines",
    description:
      "D-Series compact, lightweight tools tap live pipelines under pressure. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
  "est:est-lifting-arm": {
    title: "GripTight® Test Plug Lifting Arm",
    description:
      "The GripTight® lifting arm makes rigging and handling large, heavy test plugs safe. Supplied in Egypt by ACTS, sole agent for EST (Curtiss-Wright).",
  },
};

/**
 * SEO title + description for one product page.
 *
 * Falls back to a composed title/description when a product has no entry, so
 * adding a product to lib/brandHub can never ship a page with *no* metadata —
 * only a less-tuned one. `npm run check:links` reports the gap (see
 * scripts/check-product-links.mjs).
 */
export function productSeo(
  brandSlug: string,
  brandName: string,
  product: Pick<HubProduct, "id" | "name" | "family" | "tagline" | "standard">
): ProductSeo {
  const entry = PRODUCT_SEO[`${brandSlug}:${product.id}`];
  if (entry) return entry;

  const shortBrand = brandName.replace(/\s+Engineering$/, "");
  return {
    title: `${shortBrand} ${product.name} ${product.family}`.slice(0, 60),
    description:
      `${product.tagline} ${product.standard ? `${product.standard}. ` : ""}` +
      `Supplied and supported in Egypt by ACTS, sole agent for ${brandName}.`,
  };
}

/** Product keys that have hand-tuned copy — used by the link checker. */
export function productSeoKeys(): string[] {
  return Object.keys(PRODUCT_SEO);
}
