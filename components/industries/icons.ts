/* Icon maps shared by the industries hub (/industries) and each sector page
 * (/industries/<slug>). They lived inside the hub page until the sector pages
 * were split out; keeping one copy is what stops a sector picking up a
 * different icon in the two places it is drawn. */

import {
  Boxes,
  Drill,
  Droplets,
  Factory,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Link2,
  Mountain,
  Network,
  Package,
  Recycle,
  RefreshCw,
  Route,
  Settings2,
  ShieldCheck,
  Sprout,
  TestTube,
  TestTubes,
  Thermometer,
  Waves,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* Callers index these maps directly and fall back to the matching DEFAULT
 * below, rather than going through a helper that returns a component:
 * `react-hooks/static-components` flags a *call* whose result is rendered as
 * a component, because a function could return a new component identity per
 * render and remount the subtree. A property lookup cannot. */
export const INDUSTRY_ICON_DEFAULT: LucideIcon = Factory;
export const APPLICATION_ICON_DEFAULT: LucideIcon = Wrench;
export const SUPPORT_ICON_DEFAULT: LucideIcon = ShieldCheck;

/** One icon per industry slug (lib/data `industries`). */
export const industryIcons: Record<string, LucideIcon> = {
  "oil-gas": Flame,
  petrochemical: FlaskConical,
  "power-generation": Zap,
  "water-treatment": Droplets,
  fertilizers: Sprout,
  "general-industrial": Factory,
};

/** One icon per process area (keyed by ApplicationArea["area"], unique across
 *  all 25 entries) — a real visual anchor per card instead of 25 identically
 *  shaped cards distinguished only by their headline. */
export const applicationIcons: Record<string, LucideIcon> = {
  Upstream: Drill,
  Midstream: Route,
  Refining: Layers,
  Petrochemical: FlaskConical,
  "Olefins production": Flame,
  "Aromatics production": TestTubes,
  Polymers: Link2,
  "Steam generation": Gauge,
  "Gas turbines": Wind,
  "Combined cycle": RefreshCw,
  "Cooling systems": Droplets,
  "Balance of plant": Settings2,
  Desalination: Waves,
  "Municipal water": Network,
  "Industrial wastewater": Recycle,
  "Cooling water systems": Thermometer,
  "Ammonia synthesis": FlaskConical,
  "Urea production": TestTube,
  "Phosphate processing": Mountain,
  "Blending and bagging": Package,
  "Cement production": Boxes,
  "Steel processing": Flame,
  "Glass manufacturing": Thermometer,
  "Pulp & paper": Layers,
  Mining: Drill,
};

/** One icon per brand for the compact "how we support" tiles — reflects
 *  which manufacturer/capability, not decoration. Falls back to ShieldCheck
 *  for the handful of ACTS's-own-service bullets with no brandSlug. */
export const supportIcons: Record<string, LucideIcon> = {
  "farris-engineering": Gauge,
  "dyna-flo": Wrench,
  est: Thermometer,
};

