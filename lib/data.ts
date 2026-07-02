// All site content in one place. Products/vendors barely change, so they live
// here instead of Supabase for v1 — edit this file to update the catalog.
// Inquiries (RFQ form) DO go to Supabase via /api/inquiries.

export type ProductLine = {
  tag?: string;
  name: string;
  description: string;
};

export type Brand = {
  slug: string;
  no: string;
  name: string;
  origin: string;
  category: string;
  summary: string;
  description: string;
  sectors: string[];
  productLines: ProductLine[];
  externalUrl: string;
  gridCols: 3 | 4;
  image: string;
  imageAlt: string;
};

export const brands: Brand[] = [
  {
    slug: "farris-engineering",
    no: "BRAND 01",
    name: "Farris Engineering",
    origin: "USA / Canada · Safety relief valves",
    category: "Safety Relief Valves",
    summary:
      "Direct-spring and pilot-operated safety relief valves protecting pressure systems across the full process envelope.",
    description:
      "Direct-spring and pilot-operated safety relief valves protecting pressure systems across oil & gas production, natural gas transfer, refining, petrochemicals and power plants.",
    sectors: [
      "Oil & Gas Production",
      "Natural Gas Transfer",
      "Refining",
      "Petrochemicals",
      "Power Plants",
    ],
    productLines: [
      {
        tag: "2600 / 2700 SERIES",
        name: "Process pressure relief valves",
        description:
          "Direct-spring SRVs for standard process pressure-relief duties.",
      },
      {
        tag: "3800 SERIES",
        name: "Direct spring SRV",
        description:
          "Compact direct-spring relief for a broad range of set pressures.",
      },
      {
        tag: "1800 – 2900 SERIES",
        name: "Process relief range",
        description:
          "Extended family covering the core process pressure-relief envelope.",
      },
      {
        tag: "4200 SERIES",
        name: "Pilot-operated SRV",
        description:
          "Pilot relief for high-pressure, tight-tolerance applications.",
      },
      {
        tag: "6400 – 6600 SERIES",
        name: "Pilot SRV range",
        description:
          "Full-lift pilot valves for demanding gas and liquid service.",
      },
      {
        tag: "SMARTPRV",
        name: "Monitored relief valve",
        description:
          "Instrumented SRV feeding a complete relief-system management program.",
      },
    ],
    externalUrl: "https://www.cw-valvegroup.com/Products/Brands/Farris",
    gridCols: 3,
    image: "/images/refinery-blue.jpg",
    imageAlt: "Oil refinery at blue hour",
  },
  {
    slug: "solent-pratt",
    no: "BRAND 02",
    name: "Solent & Pratt",
    origin: "United Kingdom · High-performance butterfly valves · ~50 years",
    category: "High-Performance Butterfly Valves",
    summary:
      "Severe-service butterfly valves engineered for offshore and demanding process applications.",
    description:
      "Severe-service butterfly valves engineered for offshore oil-rig and demanding process applications, backed by roughly half a century of British valve manufacturing.",
    sectors: [
      "Severe Service",
      "Offshore Oil Rigs",
      "Process Isolation",
      "Flow Control",
    ],
    productLines: [
      {
        tag: "TYPE A",
        name: "Concentric",
        description:
          "Rubber-lined resilient-seated butterfly valve for general service.",
      },
      {
        tag: "TYPE B",
        name: "Single Offset",
        description:
          "Single-eccentric disc for reduced seat wear and longer life.",
      },
      {
        tag: "TYPE C",
        name: "Double Offset",
        description:
          "High-performance double-eccentric design for higher pressures.",
      },
      {
        tag: "TYPE D",
        name: "Triple Offset",
        description:
          "Metal-seated triple-eccentric for tight shut-off in severe service.",
      },
    ],
    externalUrl: "https://www.cw-valvegroup.com/Products/Brands/Solent-Pratt",
    gridCols: 4,
    image: "/images/offshore-rig.jpg",
    imageAlt: "Offshore jack-up drilling rig with gas flare",
  },
  {
    slug: "cwt-valve",
    no: "BRAND 03",
    name: "CWT Valve",
    origin: "Canada · Valves & strainers",
    category: "Industrial Valves & Strainers",
    summary:
      "A broad range of industrial valves and strainers for oil & gas, petrochemical, power, mining and marine.",
    description:
      "A broad range of industrial valves and strainers serving oil & gas, petrochemical, power generation, mining and marine operations.",
    sectors: [
      "Oil & Gas",
      "Petrochemical",
      "Power Generation",
      "Mining",
      "Marine",
    ],
    productLines: [
      {
        name: "Plug Valve",
        description:
          "Quarter-turn plug valves for reliable isolation and diverting.",
      },
      {
        name: "Globe Valve",
        description: "Precise throttling and regulation of flow.",
      },
      {
        name: "Gate Valve",
        description: "Full-bore on/off isolation for pipelines.",
      },
      {
        name: "Floating Ball Valve",
        description: "Bubble-tight shut-off with low operating torque.",
      },
      {
        name: "Pneumatic Actuator",
        description: "Automated actuation for remote and control valves.",
      },
      {
        name: "Strainer",
        description:
          "Y-type and basket strainers protecting downstream equipment.",
      },
      {
        name: "Check Valve",
        description: "Non-return valves preventing reverse flow.",
      },
      {
        name: "Butterfly Valve",
        description: "Compact quarter-turn isolation and control.",
      },
      {
        name: "Custom",
        description:
          "Engineered-to-order valves for special service conditions.",
      },
    ],
    externalUrl: "https://www.cw-valvegroup.com/Products/Brands/CWT",
    gridCols: 3,
    image: "/images/gas-plant.jpg",
    imageAlt: "Natural gas wellhead with valve handwheels",
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export const suppliers = [
  { name: "AVK Group", sub: "Valves & hydrants" },
  { name: "Cameron", sub: "Schlumberger" },
  { name: "Bürkert", sub: "Fluid control systems" },
  { name: "Flowserve", sub: "Flow control" },
  { name: "Orion Valves", sub: "Industrial valves" },
  { name: "IMI Orton", sub: "Process automation" },
];

export const clients = [
  "Eni",
  "Shell",
  "Schlumberger",
  "bp",
  "TAQA",
  "ENPPI",
  "Total",
  "PICO",
  "EGPC",
];

export const stats = [
  { value: "2002", label: "Founded · Giza", color: "off" },
  { value: "$4M", label: "Revenue by 2014", color: "brass" },
  { value: "3", label: "Global valve brands", color: "off" },
  { value: "1", label: "Exclusive CW agent", color: "red" },
] as const;

export const timeline = [
  {
    year: "2002",
    unit: "Giza",
    body: "ACTS is founded as an industrial trading company, importing and distributing equipment to Egyptian industry.",
    now: false,
  },
  {
    year: "2006",
    unit: "Cairo",
    body: "Operations expand to Cairo with a second branch in Nasr City, broadening national reach and technical support.",
    now: false,
  },
  {
    year: "2014",
    unit: "$4M / year",
    body: "Portfolio diversifies around specialist valve brands; annual revenue reaches USD 4 million.",
    now: false,
  },
  {
    year: "Now",
    unit: "$3.5–7M target",
    body: "Operating as exclusive Egyptian agent for Curtiss-Wright's valve brands, targeting sustained growth across the energy sector.",
    now: true,
  },
];

export const mission = [
  {
    num: "01",
    title: "Increase market share",
    description:
      "Grow ACTS' position across Egypt's Oil & Gas and power sectors.",
  },
  {
    num: "02",
    title: "Improve performance",
    description:
      "Raise overall operational and service performance across the business.",
  },
  {
    num: "03",
    title: "Open new markets",
    description:
      "Reach new industrial segments and geographies within the region.",
  },
  {
    num: "04",
    title: "Meet requirements",
    description:
      "Match each customer's exact technical and commercial requirements.",
  },
  {
    num: "05",
    title: "Product diversification",
    description:
      "Broaden the portfolio of brands and product families we represent.",
  },
];

export const offices = [
  {
    tag: "Main Office · Giza",
    name: "El Nakhil Center 2-11",
    address: "6th of October City, Giza, Egypt",
  },
  {
    tag: "Branch Office · Cairo",
    name: "4 El Tawfikia Buildings",
    address: "El Waha Area, 10th District, Nasr City, Cairo, Egypt",
  },
];

export const contact = {
  phone: "+2 03 8508135",
  salesEmail: "sales@actsegypt.com",
  infoEmail: "info@actsegypt.com",
};

export const sectors = [
  "Oil & Gas Production",
  "Natural Gas Transfer",
  "Refining",
  "Petrochemicals",
  "Power Generation",
  "Other",
];
