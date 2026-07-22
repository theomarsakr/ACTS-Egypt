// Server-only enrichment layer that powers the "Engineering Hub" + "Engineering
// Resource Center" for every brand that has a product catalog here. Product
// facts are transcribed verbatim from public/Data/<brand>/*-Data.md (and the
// curated gallery specs in lib/data for EST) — no specifications are invented.
// Each product is joined to every matching PDF in its brand's document library
// (via lib/documents.ts). Never import this into a client component; the page
// computes the data server-side and passes plain data down.

import { getBrandDocuments, type BrandDoc } from "@/lib/documents";

export type HubSpec = { label: string; value: string };

export type HubProduct = {
  id: string;
  code: string;
  name: string;
  family: string;
  group: string;
  tagline: string;
  overview: string;
  standard?: string;
  features: string[];
  benefits?: string[];
  service?: string[];
  models?: string[];
  specs?: HubSpec[];
  certifications?: string[];
  images: string[];
  externalUrl?: string;
  tokens: string[];
  related?: string[];
};

export type HubDoc = {
  title: string;
  ref?: string;
  lang?: string;
  href: string;
  category: string;
  type: string;
  description: string;
  related: string[]; // product codes
};

export type HubCategory = {
  slug: string;
  label: string;
  icon: string;
  docs: HubDoc[];
};

export type HubGroup = { id: string; label: string };

export type BrandHubData = {
  products: (HubProduct & { docs: HubDoc[] })[];
  categories: HubCategory[];
  seriesOptions: { id: string; label: string }[];
  docTypes: string[];
  groups: HubGroup[];
  totalDocs: number;
};

const F = "/Data/Farris-Valves/images";
const D = "/Data/Dynaflo/images";
const E = "/Data/EST/images/Product-Photos";

// ── Product catalogs ────────────────────────────────────────────────────────

const FARRIS: HubProduct[] = [
  {
    id: "series-2600",
    code: "2600 / 2600L",
    name: "2600 & 2600L Series",
    family: "Process Pressure Relief Valve",
    group: "process",
    standard: "API 526",
    tagline: "Flagship full-nozzle process PRV — the workhorse of the Farris line.",
    overview:
      "The 2600 Series is Farris' flagship API 526 direct spring-operated process relief valve, with an integral-cast flanged body and full nozzle design. The 2600L adds a multiple-service single-trim design so one valve covers gas, vapor, steam and liquid service.",
    features: [
      "Conforms to API 526",
      "Full nozzle design",
      "Integral cast flanges",
      "Metal seat with optional o-ring",
      "Balanced bellows option",
      "Open bonnet and lever assemblies option",
      "Adjustable blowdown",
      "2600L — multiple service single trim design option",
    ],
    benefits: [
      "API 526 envelope means drop-in interchangeability with existing installations",
      "Balanced bellows option maintains set pressure under variable back-pressure",
      "Single-trim 2600L reduces spare-parts inventory across mixed services",
    ],
    service: ["Air", "Gas", "Vapor", "Steam", "Liquid Service"],
    specs: [
      { label: "Size", value: '1" x 2" to 20" x 24"' },
      { label: "Orifice Areas", value: "D (0.15 in²) to Z (176.7 in²)" },
      { label: "Set Pressure Range", value: "15 to 6000 psig (1.0 to 413 barg)" },
      { label: "Temperature Range", value: "-320 to 1500°F (-195 to 815°C)" },
      { label: "Flange Classes", value: "150# – 2500#" },
      {
        label: "Materials",
        value:
          "Carbon Steel, Stainless Steel, Low/High Temp Alloy Steels, Monel, Hastelloy C, Duplex, NACE Compliant",
      },
    ],
    certifications: [
      "ASME/NB Section VIII & III",
      "CSA B51 (Canada CRN)",
      "ISO 9001-2008",
      "PED 97/23/EC",
      "ATEX 94/9/EC",
      "CSQL (China)",
      "GOST-R (Russia)",
      "US Coast Guard",
      "Nuclear (10 CFR 50 App. B, NCA-4000, NQA-1 N285.0)",
      "First Point Assessment Limited",
    ],
    images: [`${F}/2600_1.png`, `${F}/2600_2.png`],
    tokens: ["2600"],
    related: ["series-2700", "series-3800", "series-1890"],
  },
  {
    id: "series-3800",
    code: "3800",
    name: "3800 Series",
    family: "Process Pressure Relief Valve",
    group: "process",
    standard: "API 526",
    tagline: "Pilot-operated process valve for high operating-to-set ratios.",
    overview:
      "The 3800 Series is an API 526 process valve offering both snap-acting and modulating control actuation, with semi- and full-port nozzle designs and a tight typical blowdown of 3–6%.",
    features: [
      "Conforms to API 526",
      "Snap acting and modulating control actuation",
      "Semi and full port nozzle design",
      "Typical blowdown of 3–6%",
    ],
    benefits: [
      "Modulating action relieves only the required capacity, reducing product loss",
      "Tight 3–6% blowdown allows operation close to set pressure",
      "Full-port option delivers maximum certified capacity",
    ],
    images: [`${F}/3800.jpg`, `${F}/3800_1.jpg`, `${F}/3800_2.jpg`],
    tokens: ["3800"],
    related: ["series-2600", "series-2700"],
  },
  {
    id: "series-2700",
    code: "2700",
    name: "2700 Series",
    family: "Process Pressure Relief Valve",
    group: "process",
    tagline: "Process relief valve — full data in the series catalog.",
    overview:
      "A member of the Farris process pressure relief valve family. Complete technical data, sizing and ordering information are provided in the 2700 series catalog and installation manual below.",
    features: ["Direct spring-operated process relief valve"],
    images: [`${F}/2700.jpg`],
    tokens: ["2700"],
    related: ["series-2600", "series-3800"],
  },
  {
    id: "series-2400",
    code: "2400",
    name: "2400 Series",
    family: "Pressure Relief Valve",
    group: "process",
    standard: "ASME Section VIII",
    tagline: "Direct spring-loaded, soft-seat PRV with external blowdown control.",
    overview:
      "The 2400 Series is a direct spring-loaded pressure relief valve with a soft seat design, external blowdown control and full lift at set pressure.",
    features: [
      "ASME Section VIII",
      "Direct spring loaded",
      "Soft seat design",
      "External blowdown control",
      "Full lift at set pressure",
    ],
    benefits: [
      "Soft seat design delivers bubble-tight shutoff up to set pressure",
      "External blowdown control simplifies field adjustment",
      "Full lift at set pressure maximises relieving capacity",
    ],
    certifications: ["ASME Section VIII", "National Board (NB)", "CRN (Canada)"],
    images: [`${F}/2400.jpg`, `${F}/2400_2.png`],
    tokens: ["2400"],
    related: ["series-2600"],
  },
  {
    id: "series-1890",
    code: "1890",
    name: "1890 Series",
    family: "Threaded Process Valve",
    group: "process",
    standard: "ASME / NB",
    tagline: "Threaded steel PRV with a full-bore nozzle for air, steam & water.",
    overview:
      "The 1890 Series is a threaded steel pressure relief valve with a full bore nozzle design, ASME/NB certified for air, steam and water service.",
    features: [
      "Threaded steel PRV",
      "ASME/NB certified — air, steam & water",
      "Full bore nozzle design",
    ],
    models: ["1890", "1890L", "1892", "1892L"],
    certifications: [
      "ASME/NB Section VIII & III (Air, Steam, Water)",
      "CSA B51 (Canada CRN)",
      "ISO 9001-2008",
      "CSQL (China)",
      "GOST-R (Russia)",
      "US Coast Guard",
    ],
    images: [`${F}/1890.jpg`],
    tokens: ["1890", "1892"],
    related: ["series-1896", "series-2600"],
  },
  {
    id: "series-4200",
    code: "4200",
    name: "4200 Series",
    family: "Steam Safety Valve",
    group: "steam",
    tagline: "Flanged spring-loaded boiler safety valve with temperature-equalizing disc.",
    overview:
      "The 4200 Series is a flanged, spring-loaded boiler safety valve built around a full nozzle and open bonnet design, with a temperature-equalizing disc for stable steam service.",
    features: [
      "Flanged spring loaded boiler safety valve",
      "Full nozzle design",
      "Open bonnet design",
      "One piece guide",
      "Low stem bearing point",
      "Temperature equalizing disc",
      "Heavy stainless steel lock screw studs",
      "Test gag optional",
    ],
    benefits: [
      "Temperature-equalizing disc resists seat distortion under thermal cycling",
      "One-piece guide keeps the disc aligned for repeatable lift",
      "Open bonnet dissipates heat away from the spring",
    ],
    service: ["Steam"],
    images: [`${F}/4200-SERIES-STEAM-SAFETY-VALVE.jpg`, `${F}/4200_1.jpg`],
    tokens: ["4200"],
    related: ["series-6400", "series-4700"],
  },
  {
    id: "series-6400",
    code: "6400 / 6600",
    name: "6400 Series",
    family: "Steam Safety Valve",
    group: "steam",
    tagline: "Boiler safety valve with hardened conical disc and full nozzle.",
    overview:
      "The 6400 Series is a flanged, spring-loaded boiler safety valve available in closed-bonnet or exposed-spring versions, with a hardened conical disc and full nozzle design.",
    features: [
      "Flanged spring loaded boiler safety valve",
      "Closed bonnet or exposed spring versions",
      "Hardened conical disc",
      "Full nozzle design",
    ],
    benefits: [
      "Hardened conical disc resists steam-cut and wire-drawing",
      "Exposed-spring version runs cooler on high-temperature steam",
    ],
    service: ["Steam"],
    models: ["6400", "6600L"],
    images: [`${F}/6400.jpg`, `${F}/6400_1.jpg`],
    tokens: ["6400", "6600"],
    related: ["series-4200", "series-1896"],
  },
  {
    id: "series-1896",
    code: "1896",
    name: "1896 Series",
    family: "Steam Safety Valve",
    group: "steam",
    tagline: "Threaded brass/bronze steam safety valve with full-bore nozzle.",
    overview:
      "The 1896 Series is a threaded brass/bronze steam safety valve with a full bore nozzle design, suited to smaller steam lines.",
    features: ["Threaded brass/bronze PRV", "Full bore nozzle design"],
    service: ["Steam"],
    models: ["1896M", "1896ML"],
    images: [`${F}/1896.jpg`],
    tokens: ["1896"],
    related: ["series-1890", "series-6400"],
  },
  {
    id: "series-4700",
    code: "4700",
    name: "4700 Series",
    family: "Steam Safety Valve",
    group: "steam",
    tagline: "Steam safety valve — full data on request.",
    overview:
      "A member of the Farris steam safety valve family. Full technical data, sizing and ordering information are available on request and in the SizeMaster™ sizing tool.",
    features: ["Flanged steam safety valve"],
    images: [`${F}/4700.jpg`],
    tokens: ["4700"],
    related: ["series-4200", "series-6400"],
  },
  {
    id: "insure",
    code: "iNSURE®",
    name: "iNSURE® Real-Time Monitoring",
    family: "Valve Monitoring Device",
    group: "digital",
    tagline: "Detects relief events through valve-stem movement, in real time.",
    overview:
      "iNSURE® is a real-time monitoring device that detects pressure events via valve stem movement, streams data through an app or DCS, improves fugitive-emission reporting and flags unstable flow.",
    features: [
      "Detects pressure events via valve stem movement",
      "Data via CW iNSURE app or DCS",
      "Improves fugitive-emission reporting",
      "Detects unstable flow",
      "Bluetooth to CW iNSURE App; 180 MB internal storage",
      "Wired 4-20 mA, WirelessHART® or ISA100 Wireless™ for DCS",
    ],
    benefits: [
      "Retrofits to in-service relief valves without a shutdown",
      "Continuous condition data reduces unplanned inspections",
      "Documented lift history supports emissions compliance",
    ],
    images: [`${F}/inSure.png`, `${F}/inSure-Web-image.png`, `${F}/inSure-phone-image.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/services/farris/insure-monitoring-device",
    tokens: ["insure", "isure", "524t"],
    related: ["series-2600"],
  },
];

const DYNAFLO: HubProduct[] = [
  {
    id: "dyna-sliding-stem",
    code: "360–DF2000",
    name: "Sliding-Stem Control Valves",
    family: "Linear Globe Control Valve",
    group: "control",
    tagline: "Direct-acting globe valves that throttle flow through linear plug motion.",
    overview:
      "Dyna-Flo sliding-stem valves control the process medium through the linear motion of the valve plug, spanning compact 1\" bodies to 16\" high-capacity valves and the 320 AxFlo anti-cavitation trim.",
    features: [
      "Direct-acting globe design",
      "Cage-guided trim",
      "320 AxFlo heavy-duty multi-stage axial-flow anti-cavitation trim",
      "Broad size and pressure-class coverage",
    ],
    specs: [
      { label: "360 Series", value: '1–8", Class 150–600' },
      { label: "390 Series", value: '1"–6", Class 900–1500' },
      { label: "350 Series", value: '6–12", Class 150–900' },
      { label: "370 Series", value: '12–16", Class 150–600' },
      { label: "380 Series", value: '3 & 8", Class 900–2500' },
      { label: "320 AxFlo", value: '1–8", Class 300–1500, anti-cavitation' },
      { label: "DF2000 Series", value: '1 & 2", Class 150–2500' },
    ],
    models: ["360", "390", "350", "370", "380", "320 AxFlo", "DF2000"],
    images: [
      `${D}/360_Series-Button.jpg`,
      `${D}/390_Series-Button.jpg`,
      `${D}/350_Series-Button.jpg`,
      `${D}/370_Series-Button.jpg`,
      `${D}/380_Series-Button.jpg`,
      `${D}/320_Series-Button.jpg`,
      `${D}/DF2000_Series-Button.jpg`,
    ],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/sliding-stem-control-valves",
    tokens: ["360", "390", "350", "370", "380", "320", "df2000"],
    related: ["dyna-rotary-ball", "dyna-df400"],
  },
  {
    id: "dyna-rotary-ball",
    code: "570–590",
    name: "Rotary Ball Valves",
    family: "Rotary Control Valve",
    group: "control",
    tagline: "High-capacity segmented and full-ball valves for throttling or on/off.",
    overview:
      "Dyna-Flo rotary ball valves deliver high flow capacity with tight shutoff in a compact face-to-face footprint, in flanged Class 150–900 configurations.",
    features: [
      "Segmented and full-ball designs",
      "High Cv, wide rangeability",
      "Flanged body options",
      "Throttling or on/off service",
    ],
    specs: [
      { label: "Model 570", value: '1–8", Class 150–600' },
      { label: "Model 571", value: '1–24", Class 150 Flanged' },
      { label: "Model 573", value: '1–24", Class 300 Flanged' },
      { label: "Model 590", value: '4–16", Class 600–900' },
    ],
    models: ["570", "571", "573", "590"],
    images: [
      `${D}/570_Button.jpg`,
      `${D}/571_Button.jpg`,
      `${D}/573_Button.jpg`,
      `${D}/590_Button.jpg`,
    ],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/rotary-control-valves",
    tokens: ["570", "571", "573", "590"],
    related: ["dyna-sliding-stem", "dyna-df400"],
  },
  {
    id: "dyna-df400",
    code: "DF400",
    name: "DF400 Eccentric Rotary Plug Valve",
    family: "Rotary Control Valve & Actuator",
    group: "control",
    standard: "ASME B16.34",
    tagline: "Heavy-duty eccentric plug valve with a self-aligning, straight-through path.",
    overview:
      "The DF400 is a heavy-duty eccentric plug rotary (globe) control valve combined with a low-profile spring-and-diaphragm actuator. A self-aligning eccentric plug with a straight-through flow pattern gives tight shutoff at higher flow capacities in severe service.",
    features: [
      "Self-aligning eccentric plug, quarter-turn",
      "Flanged body, RF end connection",
      "Standard low-emission packing",
      "Blowout-proof shafts, reduced-port trim, NACE options",
    ],
    benefits: [
      "Straight-through path maximises capacity and resists plugging",
      "Class IV metal or Class VI PTFE soft seat for tight shutoff",
    ],
    specs: [
      { label: "Size", value: "1 to 6 inch NPS (25–150 mm DN)" },
      { label: "Pressure Rating", value: "ASME B16.34 Class 150–600" },
      { label: "Shutoff", value: "ANSI/FCI 70.2 & IEC 60534-4 Class IV / VI" },
      { label: "Body Materials", value: "WCC, CF3M" },
      { label: "Operation", value: "Quarter-turn, RF flanged" },
    ],
    images: [`${D}/DF400_Front-View.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/rotary-plug-valves/df400-series",
    tokens: ["df400"],
    related: ["dyna-rotary-ball", "dyna-dfr"],
  },
  {
    id: "dyna-integral",
    code: "DF100–DF2410",
    name: "Integral Valve & Actuator",
    family: "Integral Control Valve",
    group: "control",
    tagline: "Compact integral valve-and-actuator units for dump-valve service.",
    overview:
      "Compact integral valve-and-actuator assemblies engineered for tight-shutoff and dump-valve applications where space is limited, combining the control element and actuator in one unit.",
    features: [
      "Integral actuator, compact footprint",
      "Fast, repeatable response",
      "Ideal for dump-valve service",
    ],
    specs: [
      { label: "DF100", value: '1 inch, ASME 150–900' },
      { label: "DF234", value: '1 & 2 inch, ASME 150–1500' },
      { label: "DF270", value: '1 & 2 inch, ASME 150–1500' },
      { label: "DF2410", value: '1 & 2 inch, ASME 150–600' },
    ],
    models: ["DF100", "DF234", "DF270", "DF2410"],
    images: [
      `${D}/DF100_Button.jpg`,
      `${D}/DF234_Button.jpg`,
      `${D}/DF270_Button.jpg`,
      `${D}/DF2410_Button.jpg`,
    ],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/integral-valve-actuator",
    tokens: ["df100", "df234", "df270", "df2410"],
    related: ["dyna-df400"],
  },
  {
    id: "dyna-dfc-dfo",
    code: "DFC / DFO",
    name: "DFC & DFO Linear Actuators",
    family: "Spring & Diaphragm Actuator",
    group: "actuator",
    tagline: "Large-diaphragm spring-and-diaphragm actuators with fail-safe positioning.",
    overview:
      "Large-diaphragm-area actuators for low-pressure operation. A spring provides fail-safe positioning on loss of pneumatic supply — DFC fails closed, DFO fails open — to automate control valves for throttling or on/off service.",
    features: [
      "Fail-closed (DFC) or fail-open (DFO) action",
      "Open yoke / open valve stem design option",
      "Handwheels and travel stops",
      "Versatile instrument mounting",
    ],
    specs: [
      { label: "Input Signal", value: "3–15 PSIG or 6–30 PSIG" },
      { label: "Valve Stem", value: '3/8", 1/2", 3/4"' },
      { label: "Effective Area", value: "46–220 in² (sizes 1046–3220)" },
      { label: "Temperature", value: "-40°F to 180°F (-40°C to 82°C)" },
    ],
    images: [`${D}/DFC-DFO_front.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/actuators/linear-spring-and-diaphragm",
    tokens: ["dfc", "dfo"],
    related: ["dyna-dfr", "dyna-dflp"],
  },
  {
    id: "dyna-dfr",
    code: "DFR",
    name: "DFR Rotary Spring & Diaphragm Actuator",
    family: "Rotary Actuator",
    group: "actuator",
    tagline: "Large-diaphragm rotary actuator with field-reversible fail-safe action.",
    overview:
      "A large-diaphragm-area rotary actuator for low-pressure operation; a spring provides fail-safe positioning to automate quarter-turn valves for throttling or on/off control of liquids and gases.",
    features: [
      "Field-reversible action",
      "Handwheels and travel stops",
      "Versatile instrument mounting",
      "Heavy-duty coatings option",
    ],
    specs: [
      { label: "Input Signal", value: "0–18 PSIG or 0–33 PSIG" },
      { label: "Valve Shaft", value: '1/2" to 2"' },
      { label: "Sizes", value: "026, 047, 070, 156, 220" },
      { label: "Temperature", value: "-40°F to 180°F (-40°C to 82°C)" },
    ],
    images: [`${D}/DFR220_Front.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/actuators/dfr-rotary-spring-diaphragm-actuator",
    tokens: ["dfr"],
    related: ["dyna-dfc-dfo", "dyna-dfrp"],
  },
  {
    id: "dyna-dflp",
    code: "DFLP",
    name: "DFLP Linear Pneumatic Piston Actuator",
    family: "Pneumatic Piston Actuator",
    group: "actuator",
    tagline: "High-force double-acting piston actuator for linear valves.",
    overview:
      "A high-force double-acting pneumatic piston actuator. With a positioner or two-position signal it handles throttling or on/off control; a volume tank holds the fail position.",
    features: [
      "Double-acting, high thrust",
      "Requires a volume tank for fail position",
      "Positioner or two-position control",
    ],
    specs: [
      { label: "Min Cylinder Pressure", value: "20 PSIG (1.38 BARG)" },
      { label: "Valve Stem", value: '3/4", 1", 1-1/4"' },
      { label: "Thrust", value: "Up to ~16,940 lbf (sizes 3113–5154)" },
      { label: "Temperature", value: "-40°F to 180°F (-40°C to 82°C)" },
    ],
    images: [`${D}/DFLP_Front.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/actuators/dflp-linear-pneumatic-piston-actuator",
    tokens: ["dflp"],
    related: ["dyna-dfc-dfo", "dyna-dfrp"],
  },
  {
    id: "dyna-dfrp",
    code: "DFRP",
    name: "DFRP Rotary Pneumatic Piston Actuator",
    family: "Pneumatic Piston Actuator",
    group: "actuator",
    tagline: "High-torque double-acting piston actuator for quarter-turn valves.",
    overview:
      "A high-torque double-acting pneumatic piston actuator for quarter-turn valves, providing throttling or on/off control with a volume tank to hold the fail-safe position.",
    features: [
      "90° rotation, double-acting",
      "High torque output",
      "Requires a volume tank for fail position",
    ],
    specs: [
      { label: "Min Cylinder Pressure", value: "20 PSIG (1.38 BARG)" },
      { label: "Valve Shaft", value: '1/2" to 2-1/2"' },
      { label: "Torque", value: "Up to ~65,004 lbf-in (sizes 028–154)" },
      { label: "Temperature", value: "-40°F to 180°F (-40°C to 82°C)" },
    ],
    images: [`${D}/DFRP_Front.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/actuators/dfrp-rotary-pneumatic-piston-actuator",
    tokens: ["dfrp"],
    related: ["dyna-dfr", "dyna-dflp"],
  },
  {
    id: "dyna-dfn",
    code: "DFN",
    name: "DFN Yokeless Spring & Diaphragm Actuator",
    family: "Rotary Actuator",
    group: "actuator",
    tagline: "Bracket-mounted actuator for butterfly valves, chokes and louvers.",
    overview:
      "A bracket-mounted, direct-acting spring-and-diaphragm actuator that operates butterfly valves, chokes and louvers for throttling or on/off control without a conventional yoke.",
    features: [
      "Direct-acting, yokeless design",
      "Operates butterfly, choke & louver valves",
      "Bracket-mounted",
    ],
    specs: [
      { label: "Input Signal", value: "35 PSIG (2.41 BARG)" },
      { label: "Bolt Circle", value: '2-7/8" or 3-7/8"' },
      { label: "Sizes", value: "069, 156" },
      { label: "Temperature", value: "-40°F to 180°F (-40°C to 82°C)" },
    ],
    images: [`${D}/DFN.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/actuators/dfn-yokeless-spring-diaphragm-actuator",
    tokens: ["dfn"],
    related: ["dyna-dfr"],
  },
  {
    id: "dyna-4000",
    code: "4000 Series",
    name: "4000 Series Local Pressure Controller",
    family: "Pneumatic Controller",
    group: "instrumentation",
    tagline: "Field-mounted pressure controller, emission-compliant and NACE-ready.",
    overview:
      "A field-mounted pneumatic pressure controller offering proportional-only or proportional-plus-reset control, with field-reversible direct/reverse action and emission-compliant, NACE-ready construction.",
    features: [
      "Proportional-Only & Proportional-Plus-Reset modes",
      "Field-reversible direct/reverse acting",
      "Meets/exceeds EPA emission standards",
      "NACE-ready with stainless steel parts",
    ],
    specs: [
      { label: "Models", value: "4000, 4010, 4020, 4030" },
      { label: "Repeatability", value: "0.5% of sensing element range" },
      { label: "Deadband", value: "0.1% of output span" },
      { label: "Output Signal", value: "3–15 PSIG or 6–30 PSIG" },
      { label: "Temperature", value: "-40°F to 160°F (-40°C to 71°C)" },
    ],
    models: ["4000", "4010", "4020", "4030", "4000LB"],
    images: [`${D}/4000LB-withstickers-2.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/instrumentation/4000-series-local-pressure-controller",
    tokens: ["4000", "4000lb", "4010", "4020", "4030"],
    related: ["dyna-5000"],
  },
  {
    id: "dyna-5000",
    code: "5000 / 5000E",
    name: "5000 Liquid Level Controller",
    family: "Level Controller",
    group: "instrumentation",
    tagline: "Displacer level controller with a serviceable, zero-bleed relay manifold.",
    overview:
      "A displacer-type liquid level controller with an innovative relay manifold for easy maintenance; the displacer arm seal is serviceable without disturbing the vessel connection, with zero steady-state bleed.",
    features: [
      "5000 pneumatic (snap-acting/throttling) or 5000E electric",
      "Serviceable relay manifold design",
      "Zero bleed in steady state",
      "Displacer arm seal serviceable in place",
    ],
    specs: [
      { label: "Max Sensor Pressure", value: "3,750 PSIG (259 BARG)" },
      { label: "Min Specific Gravity", value: "0.1" },
      { label: "Output Signal", value: "3–15 PSIG or 6–30 PSIG" },
      { label: "Ambient Temp", value: "-20°F to 400°F (-29°C to 204°C)" },
    ],
    models: ["5000", "5000E"],
    images: [`${D}/5000.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/instrumentation/5000-series-liquid-level-controller",
    tokens: ["5000"],
    related: ["dyna-4000"],
  },
  {
    id: "dyna-positioners",
    code: "PS2 / 760",
    name: "Siemens PS2 & 760 Valve Positioners",
    family: "Valve Positioner",
    group: "instrumentation",
    tagline: "Digital HART positioner and rugged pneumatic positioner for any valve.",
    overview:
      "The Siemens PS2 is a digital, HART-ready electro-pneumatic positioner with on-board programming and an LCD. The Model 760 is a rugged pneumatic positioner for linear or rotary valves, with optional 4–20 mA feedback and limit switches.",
    features: [
      "PS2: digital, HART/Profibus/Foundation Fieldbus, on-board LCD",
      "760: pneumatic, linear or rotary, optional feedback module",
      "Internal limit switches & high-flow Cv module (760)",
      "Position-indicator windows (760)",
    ],
    specs: [
      { label: "PS2 Input / Output", value: "4–20 mA / 0–30, 0–60, 0–101.5 PSIG" },
      { label: "PS2 Temperature", value: "-40°F to 176°F" },
      { label: "760 Input", value: "3–15 / 9–15 / 6–30 PSIG or 4–20 mA" },
      { label: "760 Travel", value: '1/2"–6" rectilinear or 90° rotary' },
    ],
    models: ["Siemens PS2", "Model 760"],
    images: [`${D}/PS2.png`, `${D}/760.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/instrumentation/positioner",
    tokens: ["ps2", "760", "siemens"],
    related: ["dyna-t950xp"],
  },
  {
    id: "dyna-pro50",
    code: "PRO-50",
    name: "PRO-50 Instrument Supply Regulator",
    family: "Supply Regulator",
    group: "instrumentation",
    tagline: "Compact regulator delivering clean, stable supply to digital instruments.",
    overview:
      "A compact, lightweight supply regulator providing controlled pressure to pneumatic and electro-pneumatic instrumentation, engineered for the accuracy, repeatability and low hysteresis digital instruments demand.",
    features: [
      "PRO-50 / PRO-50N (NACE MR0175)",
      "PRO-NR50 / PRO-NR50N non-relieving options",
      "Rugged for most air/gas applications",
    ],
    specs: [
      { label: "Inlet", value: "250 PSIG (17.24 BARG) max" },
      { label: "Outlet", value: "0–35 / 0–60 / 0–125 PSIG" },
      { label: "Temperature", value: "-40°F to 300°F (-40°C to 149°C)" },
    ],
    images: [`${D}/PRO-50.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/instrumentation/pro-50-regulator",
    tokens: ["pro 50", "pro-50", "pr50"],
    related: ["dyna-t950xp"],
  },
  {
    id: "dyna-t950xp",
    code: "T950XP",
    name: "Control Air T950XP I/P Transducer",
    family: "I/P Transducer",
    group: "instrumentation",
    tagline: "Current-to-pressure transducer for hazardous environments.",
    overview:
      "A reliable, high-performance current-to-pressure (I/P) transducer for hazardous environments, converting a 4–20 mA electrical input into a stable pneumatic output to drive control valve actuators.",
    features: [
      "Single acting, reverse or split range",
      "Field-adjustable on-board switches",
      "FM / CSA / Natural Gas approved",
    ],
    specs: [
      { label: "Input", value: "4–20 mA" },
      { label: "Output", value: "0–18 / 0–20 / 0–33 / 0–35 PSIG" },
      { label: "Temperature", value: "-40°F to 158°F (-40°C to 70°C)" },
      { label: "Ports", value: 'Pneumatic 1/4" NPT, Electric 1/2" NPT' },
    ],
    images: [`${D}/control-air-T950XP.png`],
    externalUrl:
      "https://valves.curtisswright.com/en-us/dynaflo/products/instrumentation/t950xp-i-p-transducer",
    tokens: ["t950xp", "t950"],
    related: ["dyna-positioners"],
  },
];

const EST: HubProduct[] = [
  {
    id: "est-cpi-perma",
    code: "CPI / Perma",
    name: "Pop-A-Plug® CPI/Perma Tube Plugs",
    family: "Heat Exchanger Tube Plug",
    group: "plugging",
    standard: "ASME PCC-2",
    tagline: "Weld-free mechanical tube plug with a helium-tight metal-to-metal seal.",
    overview:
      "A hydraulically installed mechanical tube plug that seals leaking heat exchanger and condenser tubes with a helium-leak-tight metal-to-metal seal — no welding or explosives.",
    features: [
      "Metal-to-metal helium-tight seal",
      "No welding or explosives",
      "ASME PCC-2 recommended method",
      "Installs in seconds with a Pop-A-Plug ram",
    ],
    specs: [
      { label: "Rated Pressure", value: "1,000 PsiG (68.9 BarG)" },
      { label: "Tube ID Range", value: '0.472" – 2.067"' },
      { label: "Seal", value: "Metal-to-metal, helium leak-tight" },
      { label: "Standard", value: "ASME PCC-2 method" },
    ],
    images: [`${E}/cpi-perma-pap_web.png`],
    tokens: ["cpi", "perma"],
    related: ["est-p2", "est-ram", "est-manual-tool"],
  },
  {
    id: "est-p2",
    code: "P2",
    name: "Pop-A-Plug® P2 High-Pressure Tube Plugs",
    family: "Heat Exchanger Tube Plug",
    group: "plugging",
    tagline: "Permanent, weld-free seal for high-pressure heat exchanger tubes.",
    overview:
      "A high-pressure mechanical tube plug giving a permanent, weld-free seal for leaking heat exchanger tubes; a metallurgy-matched ring-and-pin design resists ejection and thermal-cycling leaks.",
    features: [
      "Metallurgy-matched ring-and-pin design",
      "Helium leak-tight, no welding",
      "Resists ejection & thermal-cycling leaks",
      "ISO 9001 manufactured",
    ],
    specs: [
      { label: "Rated Pressure", value: "7,000 PsiG (483 BarG)" },
      { label: "Tube ID Range", value: '0.400" – 1.460"' },
      { label: "Seal", value: "Helium leak-tight, weld-free" },
      { label: "Quality", value: "ISO 9001 manufactured" },
    ],
    images: [`${E}/P2-004-web.jpg`, `${E}/P2520C_Bg_Med-Red_Diagonal-Back-Left_Web.jpg`],
    tokens: ["p2"],
    related: ["est-cpi-perma", "est-ram", "est-removal-tool"],
  },
  {
    id: "est-hydra-loc",
    code: "Hydra-Loc®",
    name: "Hydra-Loc® Tube Sleeving",
    family: "Tube Repair System",
    group: "plugging",
    tagline: "Hydraulically expands a sleeve to recover corroded or eroded tube ends.",
    overview:
      "Hydra-Loc® hydraulically expands a sleeve into intimate contact with a corroded or eroded tube end and locks it in place, recovering tube service without full retubing.",
    features: [
      "Faster than roller expansion",
      "Conforms to actual tube contours",
      "Tightly controlled expansion pressure",
      "Repairs inlet-end tube damage",
    ],
    images: [`${E}/Tube-Sleeve-Before-After.jpg`],
    tokens: ["hydra-loc", "hydra loc"],
    related: ["est-cpi-perma"],
  },
  {
    id: "est-smart-ram",
    code: "Smart Ram",
    name: "Smart Ram Installation System",
    family: "Plug Installation Tool",
    group: "plugging",
    tagline: "Cordless, monitored Pop-A-Plug installation with documented results.",
    overview:
      "Battery-operated Pop-A-Plug installation tools with a self-contained hydraulic unit and LCD. Smart Ram Plus records and monitors every installation through a rugged tablet for full documentation and quality assurance.",
    features: [
      "Cordless field operation",
      "Up to 1,000 plugs per charge",
      "Real-time installation monitoring (Plus)",
      "Rugged tablet interface (Plus)",
    ],
    specs: [
      { label: "Battery", value: "18v / 3.0Ah Li-Ion" },
      { label: "Capacity", value: "Up to 1,000 plugs per charge" },
      { label: "Weight", value: "~5 lbs (2.3 kg)" },
      { label: "Display", value: "LCD with multi-user presets" },
    ],
    images: [
      `${E}/sr640t_caseshot-open_CROPPED.png`,
      `${E}/sr-plus-kit-capped.png`,
      `${E}/srepa-web.png`,
    ],
    tokens: ["smart ram", "640t"],
    related: ["est-ram", "est-cpi-perma"],
  },
  {
    id: "est-ram",
    code: "Ram Packages",
    name: "Pop-A-Plug® Ram Packages",
    family: "Plug Installation Tool",
    group: "plugging",
    tagline: "Hydraulic ram packages that install tube plugs quickly and safely.",
    overview:
      "Hydraulic ram packages that install Pop-A-Plug tube plugs quickly and safely, in standard and close-quarters configurations, covering the CPI/Perma and P2 plug ranges with no welding.",
    features: [
      "Hydraulic, controlled installation",
      "Standard & close-quarters models",
      "Covers CPI/Perma & P2 ranges",
      "No welding required",
    ],
    images: [`${E}/Manual-Installation-Tool.jpg`],
    tokens: ["ram package", "ram packages"],
    related: ["est-smart-ram", "est-manual-tool"],
  },
  {
    id: "est-manual-tool",
    code: "Manual Tool",
    name: "Pop-A-Plug® Manual Installation Tool",
    family: "Plug Installation Tool",
    group: "plugging",
    tagline: "Reliable manual installation where air or electricity is unavailable.",
    overview:
      "A reliable manual installation tool for Pop-A-Plug tube plugs where air or electricity is unavailable; a locating pin acts as a reaction arm during tightening.",
    features: [
      "No air or electricity needed",
      "Accepts all MIT pull rods",
      "Zinc-plated carbon steel",
    ],
    specs: [{ label: "Tube ID Range", value: '0.400" – 1.160"' }],
    images: [`${E}/Manual-Installation-Tool.jpg`],
    tokens: ["manual tool", "manual installation"],
    related: ["est-ram", "est-removal-tool"],
  },
  {
    id: "est-removal-tool",
    code: "Removal Tool",
    name: "Pop-A-Plug® Removal Tool",
    family: "Plug Removal Tool",
    group: "plugging",
    tagline: "Dual-function tool that pulls the plug pin and ring in one operation.",
    overview:
      "A dual-function removal tool: a nose piece threads into the plug pin while a serrated spear grabs the ring, and an integral slide hammer pulls both out in one operation.",
    features: [
      "Removes CPI/Perma & P2 plugs",
      "Integral slide hammer",
      "Extensions available to 6 ft",
    ],
    specs: [{ label: "Plug Sizes", value: '0.400" – 1.180"' }],
    images: [`${E}/Plug-Removal-Tool-2.jpg`],
    tokens: ["removal tool"],
    related: ["est-manual-tool"],
  },
  {
    id: "est-ache",
    code: "ACHE System",
    name: "Air-Cooled HX Plugging System",
    family: "Tube Plugging System",
    group: "plugging",
    tagline: "Extended-reach tooling to test and plug air-cooled (Fin-Fan®) exchangers.",
    overview:
      "Extended-reach Pop-A-Plug tooling engineered to test and plug air-cooled heat exchanger (Fin-Fan®) tubes at depth through the narrow plug-sheet entry, without welding.",
    features: [
      "ASME PCC-2 compliant",
      "Installs in under 15 seconds",
      "Reaches at depth in header boxes",
      "No hammering or welding",
    ],
    images: [`${E}/Air-Cooled-Heat-Exchanger.jpg`],
    tokens: ["ache", "air-cooled", "air cooled"],
    related: ["est-cpi-perma", "est-condenser"],
  },
  {
    id: "est-condenser",
    code: "Condenser",
    name: "Condenser Plug Change-Out",
    family: "Condenser Repair",
    group: "plugging",
    tagline: "Replaces failed condenser plugs to restore vacuum and efficiency.",
    overview:
      "Pop-A-Plug tooling and vibra-proof plugs for changing out failed condenser tube plugs, restoring vacuum-tight sealing and thermal efficiency in power-plant condensers.",
    features: [
      "Vibra-proof condenser plug design",
      "Weld-free change-out",
      "Restores condenser vacuum",
    ],
    images: [`${E}/Condenser-Plug-Change-Out-1.jpg`, `${E}/Boiler-Plug.jpg`],
    tokens: ["condenser plug", "vibra"],
    related: ["est-ache", "est-cpi-perma"],
  },
  {
    id: "est-griptight-max",
    code: "GripTight MAX®",
    name: "GripTight MAX® Test Plug",
    family: "Hydrostatic Test Plug",
    group: "testing",
    tagline: "Patented dual-serrated high-pressure test plug for hardened pipe.",
    overview:
      "A high-pressure test plug with a patented dual-serrated gripper and hardened shaft, grippers and cone — effective for hardened and high-alloy pipe up to HRC 32, reusable for hydrostatic or pneumatic testing.",
    features: [
      "Patented dual-serrated gripper",
      "Hardened shaft, grippers & cone",
      "Hardened pipe up to HRC 32",
      "Hydrostatic or pneumatic testing",
    ],
    specs: [
      { label: "Test Pressure", value: "15,000 PsiG (1,034 BarG)" },
      { label: "Size Range", value: "3/8\" – 48\" NPS (DN10–DN1200)" },
      { label: "Design", value: "Hardened, reusable" },
    ],
    images: [`${E}/GTMAX4P40_Bg_Med-Res_Diagonal-Back-Left.jpg`, `${E}/gtmax_web-icon.jpg`],
    tokens: ["griptight max", "gtmax", "gt max"],
    related: ["est-griptight-elbow", "est-od-griptight", "est-reverse-pressure"],
  },
  {
    id: "est-griptight-elbow",
    code: "GripTight® Elbow",
    name: "GripTight® Elbow Test Plug",
    family: "Hydrostatic Test Plug",
    group: "testing",
    tagline: "Orientation-free test plug for long-radius elbows.",
    overview:
      "An orientation-free test plug for long-radius elbows, using patented dual-serrated GripTight MAX grippers and a self-aligning gripper and seal for pipe spools ending in elbows.",
    features: [
      "Orientation-independent install",
      "Self-aligning gripper & seal",
      "Fits most long-radius elbows",
    ],
    specs: [
      { label: "Test Pressure", value: "3,350 PsiG (231 BarG)" },
      { label: "Size Range", value: "2\" – 48\" NPS (DN50–DN1200)" },
    ],
    images: [`${E}/GTLBO-thumbnail.jpg`],
    tokens: ["elbow", "gtlbo"],
    related: ["est-griptight-max"],
  },
  {
    id: "est-griptight-pe",
    code: "GripTight® PE",
    name: "GripTight® PE Test Plug",
    family: "Hydrostatic Test Plug",
    group: "testing",
    tagline: "Slip-in test plug for polyethylene pipe on reels or in trench.",
    overview:
      "A slip-in test plug for polyethylene (LDPE/MDPE/HDPE) pipe that hand-tightens and uses test pressure to energize the seal and gripper for a fast, safe, leak-tight seal.",
    features: [
      "Hand-tighten, pressure-energized seal",
      "Tests pipe on reels or in trench",
      "Aluminum / steel construction",
    ],
    specs: [
      { label: "Working Pressure", value: "375 PsiG (25.8 BarG)" },
      { label: "Sizes", value: '2", 3", 4", 6" & 8"' },
    ],
    images: [`${E}/GTPE-thumbnail.jpg`],
    tokens: ["griptight pe", "gtpe", "pe test", "pe griptight"],
    related: ["est-griptight-max"],
  },
  {
    id: "est-high-lift",
    code: "High Lift",
    name: "High Lift Flange Weld Test Plug",
    family: "Flange Weld Test Plug",
    group: "testing",
    tagline: "A 4-in-1 purge dam, weld fixture, test plug and isolation plug.",
    overview:
      "A 4-in-1 tool that acts as a purge dam, weld fixture, test plug and weld-isolation plug — letting you monitor upstream, purge, weld and hydro-test a flange joint with one tool.",
    features: [
      "Purge dam + weld fixture + test + isolation",
      "Ported shaft for upstream monitoring",
      "Isolates only the weld area",
    ],
    specs: [
      { label: "Test Pressure", value: "2,250 PsiG (155 BarG)" },
      { label: "Size Range", value: "3/4\" – 24\" NPS (DN20–DN600)" },
    ],
    images: [`${E}/HLA2P40_No-Bg_Med-Res_Diagonal-Back-Left.jpg`],
    tokens: ["high lift", "hla"],
    related: ["est-griptight-max", "est-reverse-pressure"],
  },
  {
    id: "est-od-griptight",
    code: "OD GripTight®",
    name: "OD GripTight® Test Plug",
    family: "Hydrostatic Test Plug",
    group: "testing",
    tagline: "Seals on the pipe OD to test open or plain-end pipe and tube.",
    overview:
      "Seals on the pipe outside diameter to test open or plain-end pipe and tube; a patented self-gripping, self-sealing dual-seal design gives fast, safe hydrotesting.",
    features: [
      "Seals on the pipe OD",
      "Self-gripping, self-sealing dual seal",
      "One plug fits a range of schedules",
    ],
    specs: [
      { label: "Test Pressure", value: "5,000 PsiG (345 BarG)" },
      { label: "Size Range", value: "1/4\" – 4\" (DN8–DN100)" },
    ],
    images: [`${E}/ODGT075P_Bg_Med-Res_Diagonal-Back-Left.jpg`],
    tokens: ["od griptight", "odgt"],
    related: ["est-griptight-max", "est-socket-sqs"],
  },
  {
    id: "est-socket-sqs",
    code: "Socket Weld SQS",
    name: "Socket Weld SQS Test Plug",
    family: "Socket-Weld Test Plug",
    group: "testing",
    tagline: "Twin-cone plug that seals 3,000 lb socket-weld fittings.",
    overview:
      "A twin-cone test plug that seals 3,000 lb socket-weld fittings and couplings, eliminating the need to weld in pipe stubs, pups or end caps for pressure testing.",
    features: [
      "Twin-cone uniform gripper expansion",
      "Replaceable grippers & seals",
      "No pipe stubs or end caps needed",
    ],
    specs: [
      { label: "Test Pressure", value: "5,000 PsiG (345 BarG)" },
      { label: "Size Range", value: "1/2\" – 2\" NPS (DN15–DN50)" },
    ],
    images: [`${E}/SQS0073U_Bg_Med-Res_Diagonal-Back-Left.jpg`, `${E}/SQ2-Test-Plug.jpg`],
    tokens: ["socket weld", "sqs", "sq2"],
    related: ["est-od-griptight"],
  },
  {
    id: "est-reverse-pressure",
    code: "Reverse Pressure",
    name: "GripTight® Reverse Pressure Test Plug",
    family: "Flange Weld Test Plug",
    group: "testing",
    tagline: "Stresses a flange-to-pipe weld as if the whole system were pressurized.",
    overview:
      "Subjects a flange-to-pipe weld to full radial, hoop and axial stresses during hydrostatic testing — equivalent to blinding and pressurizing the entire piping system.",
    features: [
      "ASME PCC-2 Type I device",
      "Full radial, hoop & axial weld stress",
      "Optional plug-movement indicator",
    ],
    specs: [
      { label: "Test Pressure", value: "2,250 PsiG (155 BarG)" },
      { label: "Size Range", value: "2\" – 48\" NPS (DN50–DN1200)" },
    ],
    images: [`${E}/V524C_Bg_Med-Red_Diagonal-Back-Left_Web_Sq.jpg`],
    tokens: ["reverse pressure", "gtrp"],
    related: ["est-high-lift", "est-griptight-max"],
  },
  {
    id: "est-dbb",
    code: "DBB",
    name: "Double Block & Bleed Isolation Plug",
    family: "Isolation Plug",
    group: "testing",
    tagline: "Isolates and monitors explosive vapors during hot work.",
    overview:
      "A double block-and-bleed isolation and test plug that isolates and monitors potentially explosive vapors during hot work using minimal water, testable with a simple hand pump.",
    features: [
      "ASME PCC-2 Type IV device",
      "Positive-pressure barrier between two seals",
      "Monitors vapors during hot work",
      "Multi-schedule, minimal-media testing",
    ],
    specs: [
      { label: "Between-Seals Pressure", value: "2,250 PsiG (155 BarG)" },
      { label: "Size Range", value: "3/4\" – 48\" NPS (DN20–DN1200)" },
    ],
    images: [
      `${E}/1_DBB8P40_Bg_Med-Res_Diagonal-AFront-Left.jpg`,
      `${E}/1_GTDBB8P40_Bg_Med-Res_aDiagonal-Front-Left.jpg`,
    ],
    tokens: ["double block", "dbb", "gtdbb"],
    related: ["est-high-lift", "est-reverse-pressure"],
  },
  {
    id: "est-standard-plugs",
    code: "Bolt-Type / Economy",
    name: "Bolt-Type & Economy Test Plugs",
    family: "Test Plug",
    group: "testing",
    tagline: "Cost-effective medium- and low-pressure test plugs.",
    overview:
      "Bolt-type medium-pressure and economy low-pressure test plugs for straightforward pressure testing of open-end pipe where the highest pressures aren't required.",
    features: [
      "Bolt-type medium-pressure design",
      "Economy low-pressure design",
      "Simple, cost-effective testing",
    ],
    images: [
      `${E}/BTT0137N_Bg_Med-Res_Diagonal-Back-Left.jpg`,
      `${E}/ECY0073N_Bg_Med-Res_Diagonal-Back-Left.jpg`,
    ],
    tokens: ["bolt type", "bolt-type", "economy"],
    related: ["est-od-griptight"],
  },
  {
    id: "est-g-series",
    code: "G-Series",
    name: "G-Series Tube & Joint Testers",
    family: "Leak Testing Tool",
    group: "tools",
    tagline: "Vacuum and pressure testers that locate leaking tubes and joints.",
    overview:
      "Lightweight G-Series tools quickly seal and evacuate individual heat exchanger tubes or tube-to-tubesheet joints to locate pinhole leaks — a loss of vacuum indicates a leaking tube or joint.",
    features: [
      "G-160 tube testing tool",
      "G-250 vacuum tube tester",
      "G-650 vacuum joint tester",
      "Lightweight, uses plant air",
    ],
    specs: [
      { label: "G-250 Tube Range", value: '0.28" – 1.45", under 2.1 lbs' },
      { label: "G-650 Tube OD", value: '3/8" – 1¼", under 2.7 lbs' },
      { label: "Air Supply", value: "40–125 PsiG plant air" },
    ],
    images: [`${E}/G250.jpg`, `${E}/G650.jpg`],
    tokens: [
      "g-160",
      "g-250",
      "g-650",
      "g-150",
      "g-450",
      "vacuum tube",
      "vacuum joint",
      "tube testing tool",
      "tube testers",
      "test guns",
      "test tools",
    ],
    related: ["est-cpi-perma"],
  },
  {
    id: "est-d-series",
    code: "D-Series",
    name: "D-Series Hot Tapping Tools",
    family: "Hot Tapping Tool",
    group: "tools",
    tagline: "Compact, lightweight tools for tapping live pipelines under pressure.",
    overview:
      "A complete line of compact, lightweight D-Series tools for tapping into existing pipelines under pressure, enabling connections without shutting down the line.",
    features: [
      "Taps live pipelines under pressure",
      "Compact & lightweight",
      "Small and standard D-Series models",
    ],
    images: [`${E}/dseries.jpg`],
    tokens: ["d-series", "hot tapping", "hot-tapping"],
    related: ["est-g-series"],
  },
  {
    id: "est-lifting-arm",
    code: "Lifting Arm",
    name: "GripTight® Test Plug Lifting Arm",
    family: "Test Accessory",
    group: "tools",
    tagline: "Safe rigging and handling of large, heavy test plugs.",
    overview:
      "A lifting arm and fixtures for safe rigging, handling and installation of large, heavy GripTight test plugs, including sizes from 26\" to 48\".",
    features: [
      "Safe handling of large test plugs",
      "Fixtures for 26\" to 48\" plugs",
      "Reduces manual-handling risk",
    ],
    images: [`${E}/TestPlug_LiftingArm_001.jpg`],
    tokens: ["lifting arm", "lifting fixture", "tp-lift", "tp lift"],
    related: ["est-griptight-max"],
  },
];

const PRODUCTS: Record<string, HubProduct[]> = {
  "farris-engineering": FARRIS,
  "dyna-flo": DYNAFLO,
  est: EST,
};

const GROUPS: Record<string, HubGroup[]> = {
  "farris-engineering": [
    { id: "process", label: "Process PRV" },
    { id: "steam", label: "Steam Safety" },
    { id: "digital", label: "Monitoring & Digital" },
  ],
  "dyna-flo": [
    { id: "control", label: "Control Valves" },
    { id: "actuator", label: "Actuators" },
    { id: "instrumentation", label: "Instrumentation" },
  ],
  est: [
    { id: "plugging", label: "Tube Plugging" },
    { id: "testing", label: "Test & Isolation" },
    { id: "tools", label: "Testers & Tools" },
  ],
};

export const HUB_BRANDS = Object.keys(PRODUCTS);

// ── Document typing / matching ──────────────────────────────────────────────

const CATEGORY_META: Record<
  string,
  { icon: string; type: string; describe: (d: BrandDoc) => string }
> = {
  brochures: {
    icon: "BookOpen",
    type: "Brochure",
    describe: () => "Product overview and selection guide.",
  },
  "series-catalogs": {
    icon: "BookMarked",
    type: "Series Catalog",
    describe: () => "Complete series catalog with technical and ordering data.",
  },
  iomm: {
    icon: "Wrench",
    type: "IOM Manual",
    describe: () => "Installation, operation and maintenance instructions.",
  },
  insure: {
    icon: "Activity",
    type: "iNSURE",
    describe: () => "iNSURE® real-time monitoring device documentation.",
  },
  iprsm: {
    icon: "ShieldCheck",
    type: "iPRSM",
    describe: () => "iPRSM pressure-relief system management program material.",
  },
  "overview-ml": {
    icon: "Languages",
    type: "Multilingual",
    describe: (d) => `Farris overview brochure${d.lang ? ` — ${d.lang}` : ""}.`,
  },
  articles: {
    icon: "FileText",
    type: "Technical Article",
    describe: () => "Industry technical article and compliance reference.",
  },
  bulletins: {
    icon: "ClipboardList",
    type: "Bulletin",
    describe: () => "Product specification and data bulletin.",
  },
  instructions: {
    icon: "Wrench",
    type: "IOM Manual",
    describe: () => "Installation and maintenance instructions.",
  },
  marketing: {
    icon: "Newspaper",
    type: "Literature",
    describe: () => "Product literature, technical brief or application sheet.",
  },
  "case-studies": {
    icon: "FileText",
    type: "Case Study",
    describe: () => "Customer success story or technical white paper.",
  },
  certs: {
    icon: "Award",
    type: "Certification",
    describe: () => "Certification or third-party examination report.",
  },
  procedures: {
    icon: "FlaskConical",
    type: "Procedure",
    describe: () => "Operating, installation or technical specification document.",
  },
};

// A token matches a document when it appears in the doc text and is NOT
// immediately followed by another letter — so "dfr" matches "DFR026" and
// "DFR Bulletin" but not "DFRP", and "2600" matches "2600 Series" cleanly.
function tokenMatches(text: string, token: string): boolean {
  const esc = token.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(esc + "(?![a-z])", "i").test(text);
}

function docText(d: BrandDoc): string {
  return `${d.title} ${d.ref ?? ""}`.toLowerCase();
}

function relatedCodes(products: HubProduct[], d: BrandDoc): string[] {
  const text = docText(d);
  return products
    .filter((p) => p.tokens.some((t) => tokenMatches(text, t)))
    .map((p) => p.code);
}

// ── Public API ──────────────────────────────────────────────────────────────

export function getBrandHubData(slug: string): BrandHubData | null {
  const products = PRODUCTS[slug];
  if (!products) return null;

  const brand = getBrandDocuments().find((b) => b.slug === slug);
  const categories: HubCategory[] = [];

  if (brand) {
    for (const cat of brand.categories) {
      const meta = CATEGORY_META[cat.slug] ?? {
        icon: "FileText",
        type: "Document",
        describe: () => "Engineering document.",
      };
      categories.push({
        slug: cat.slug,
        label: cat.label,
        icon: meta.icon,
        docs: cat.docs.map((d) => ({
          title: d.title,
          ref: d.ref,
          lang: d.lang,
          href: d.href,
          category: cat.label,
          type: meta.type,
          description: meta.describe(d),
          related: relatedCodes(products, d),
        })),
      });
    }
  }

  const allDocs = categories.flatMap((c) => c.docs);

  const withDocs = products.map((p) => ({
    ...p,
    docs: allDocs.filter((d) => d.related.includes(p.code)),
  }));

  return {
    products: withDocs,
    categories,
    seriesOptions: products.map((p) => ({ id: p.code, label: p.name })),
    docTypes: [...new Set(allDocs.map((d) => d.type))],
    groups: GROUPS[slug] ?? [],
    totalDocs: allDocs.length,
  };
}

/**
 * Resolves a gallery item's tag to the best matching hub product anchor, so a
 * flipped gallery card links straight to that product's specs + documents.
 */
export function hubGalleryDocLink(
  slug: string,
  tag: string
): { href: string; label: string; productId: string | null } {
  const products = PRODUCTS[slug] ?? [];
  const t = tag.toLowerCase();
  const match = products.find((p) => p.tokens.some((tok) => tokenMatches(t, tok)));
  if (match)
    return {
      href: `#hub-${match.id}`,
      label: "View documents & data",
      productId: match.id,
    };
  return {
    href: "#engineering-resources",
    label: "Browse all documents",
    productId: null,
  };
}

/** The single most useful PDF for a product, for a gallery card's "View PDF". */
export function hubPrimaryDoc(
  product: HubProduct & { docs: HubDoc[] }
): HubDoc | null {
  return (
    product.docs.find((d) => d.type === "Series Catalog") ??
    product.docs.find((d) => d.type === "Brochure") ??
    product.docs.find((d) => d.type === "Bulletin") ??
    product.docs.find((d) => d.type === "Literature") ??
    product.docs.find((d) => d.type === "iNSURE") ??
    product.docs[0] ??
    null
  );
}
