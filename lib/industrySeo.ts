/* Search-intent copy for the six sector pages, kept in one reviewable place —
 * the same shape as lib/productSeo.ts, for the same reason.
 *
 * These pages exist because /industries could not serve six intents at once.
 * "petrochemical valve supplier egypt", "power plant safety valve egypt" and
 * "desalination control valve egypt" are different searches with different
 * buyers behind them, and until now the only URL answering any of them was a
 * tab on a page whose title was "Valves for Oil & Gas, Petrochemical & Power
 * in Egypt". So each sector gets its own title, description and H1, and the
 * hub keeps the comparison role.
 *
 * Every line is composed from that industry's own record in lib/data — its
 * intro, its application areas, and the product lines it actually names. No
 * claim is introduced that the sector page does not already make in prose.
 *
 * Titles omit the " | ACTS Egypt" suffix; lib/seo's `fullTitle` appends it,
 * and each is sized so the pair lands under ~65 characters.
 */

type IndustrySeo = {
  /** Page <title>, minus the site suffix. */
  title: string;
  /** Meta description. */
  description: string;
  /** Visible H1. Says the sector AND what ACTS supplies into it — an H1 of
   *  just "Oil & Gas" would name the topic without naming the offer. */
  heading: string;
  /** Sits under the H1 as the hero subtitle. */
  subtitle: string;
};

const INDUSTRY_SEO: Record<string, IndustrySeo> = {
  "oil-gas": {
    title: "Oil & Gas Valves in Egypt",
    heading: "Oil & Gas Valves & Flow Control in Egypt",
    subtitle: "Upstream, midstream, refining and petrochemicals",
    description:
      "Safety relief valves, control valves and heat exchanger services for Egypt's oil & gas operators — Farris, Dyna-Flo and EST equipment supplied and supported by ACTS.",
  },
  petrochemical: {
    title: "Petrochemical Valves & Flow Control in Egypt",
    heading: "Petrochemical Valves & Flow Control in Egypt",
    subtitle: "Chemical processing, polymers and specialty chemicals",
    description:
      "Anti-cavitation control valves, pilot-operated relief valves and tube inspection for Egypt's petrochemical plants, from ACTS — sole agent for Farris and Dyna-Flo.",
  },
  "power-generation": {
    title: "Power Plant Safety & Control Valves in Egypt",
    heading: "Power Generation Valves & Flow Control in Egypt",
    subtitle: "Fossil fuel, combined cycle and cogeneration",
    description:
      "Boiler safety valves, control valves and condenser tube plugging for Egypt's power stations. Farris, Dyna-Flo and EST equipment supplied and supported by ACTS.",
  },
  "water-treatment": {
    title: "Water Treatment & Desalination Valves in Egypt",
    heading: "Water Treatment Valves & Flow Control in Egypt",
    subtitle: "Desalination, municipal water, wastewater and cooling water",
    description:
      "Control valves, relief valves and heat exchanger tube services for Egypt's desalination, municipal water and wastewater plants, supplied and supported by ACTS.",
  },
  fertilizers: {
    title: "Fertilizer Plant Valves in Egypt",
    heading: "Fertilizer Plant Valves & Flow Control in Egypt",
    subtitle: "Ammonia, urea, phosphate and NPK blends",
    description:
      "Relief and control valves for ammonia, urea and phosphate service in Egypt's fertilizer plants, plus heat exchanger tube plugging and testing — supplied by ACTS.",
  },
  "general-industrial": {
    title: "Industrial Valves for Cement, Steel & Mining",
    heading: "General Industrial Valves & Flow Control in Egypt",
    subtitle: "Cement, steel, glass, pulp & paper, mining and manufacturing",
    description:
      "Safety relief valves, control valves and pressure testing equipment for Egypt's cement, steel, glass, paper and mining plants, supplied and supported by ACTS.",
  },
};

/**
 * SEO copy for one sector page.
 *
 * Falls back to composed copy, so adding an industry to lib/data can never
 * ship a page with *no* metadata — only a less-tuned one. `npm run check:seo`
 * reports the gap.
 */
export function industrySeo(slug: string, name: string, intro: string): IndustrySeo {
  const entry = INDUSTRY_SEO[slug];
  if (entry) return entry;
  return {
    title: `${name} Valves & Flow Control in Egypt`,
    heading: `${name} Valves & Flow Control in Egypt`,
    subtitle: name,
    description: `${intro.split(". ")[0]}. Supplied and supported across Egypt by ACTS.`,
  };
}

/** Industry slugs that have hand-tuned copy — used by scripts/check-seo.mjs. */
export function industrySeoKeys(): string[] {
  return Object.keys(INDUSTRY_SEO);
}
