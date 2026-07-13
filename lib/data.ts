// All site content in one place. Products/vendors barely change, so they live
// here instead of Supabase for v1 — edit this file to update the catalog.
// Inquiries (RFQ form) DO go to Supabase via /api/inquiries.

export type ProductLine = {
  tag?: string;
  name: string;
  description: string;
};

export type GalleryItem = {
  src: string;
  caption: string;
  category: string;
  detail: {
    tag: string;
    description: string;
    specs: string[];
  };
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
  logo?: string;
  bestSellers?: string[];
  gallery?: GalleryItem[];
};

export const brands: Brand[] = [
  {
    slug: "farris-engineering",
    no: "BRAND 01",
    name: "Farris Engineering",
    origin: "USA · Safety relief valves · Sole agent in Egypt",
    category: "Safety Relief Valves",
    summary:
      "Direct-spring and pilot-operated safety relief valves protecting pressure systems for over 70 years, across oil & gas, refining, petrochemical and power generation.",
    description:
      "Farris Engineering, a Curtiss-Wright company, has been designing and manufacturing spring-loaded and pilot-operated pressure relief valves for over 70 years, protecting vessels, piping and equipment against overpressure across oil & gas, refining, petrochemical and power generation facilities.",
    sectors: [
      "Oil & Gas",
      "Refining",
      "Petrochemical",
      "Power Generation",
      "Fertilizers",
    ],
    productLines: [
      {
        tag: "SERIES 1890",
        name: "Direct spring-operated, threaded",
        description:
          "ASME Section VIII, rated to 800 psig: air, steam & liquid service.",
      },
      {
        tag: "SERIES 2600 / 2700",
        name: "Direct spring-operated, flanged/threaded",
        description: "ASME/NB-certified: air, steam, water.",
      },
      {
        tag: "SERIES 2850",
        name: "Threaded, spring-loaded",
        description: "Air, steam, vapor & liquid.",
      },
      {
        tag: "SERIES 3800",
        name: "Pilot-operated",
        description:
          "Snap-acting or modulating control, semi/full-port nozzle.",
      },
      {
        tag: "SERIES 6400 / 6600",
        name: "Flanged steam safety valves",
        description: "Boiler safety service.",
      },
      {
        tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
        name: "Sizing, monitoring & aftermarket support",
        description:
          "Sizing software, real-time relief-valve monitoring, and factory-backed repair/recertification network.",
      },
    ],
    externalUrl: "https://valves.curtisswright.com/en-us/Farris",
    gridCols: 3,
    image: "/images/farris-relief-valves.jpg",
    imageAlt: "Close-up of an industrial safety relief valve",
    logo: "/images/farris-logo.png",
    bestSellers: ["Series 1890", "Series 3800", "iNSURE® Monitoring"],
    gallery: [
      // Direct & spring-operated valves
      {
        src: "/images/farris/direct-spring-valve.jpg",
        caption: "Direct spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 1890",
          description:
            "Farris' workhorse direct spring-operated relief valve, opening automatically once inlet pressure exceeds the spring set point — no external power or signal required.",
          specs: [
            "ASME Section VIII certified",
            "Rated to 800 psig",
            "Air, steam & liquid service",
            "Threaded or flanged connections",
          ],
        },
      },
      {
        src: "/images/farris/direct-spring-closeup.jpg",
        caption: "Direct spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 1890",
          description:
            "Close-up of a FAST-tagged direct spring safety valve, showing the exposed spring housing and lifting lever used for manual test and inspection.",
          specs: [
            "ASME Section VIII certified",
            "Manual test lever",
            "Open-spring bonnet design",
            "Flanged inlet/outlet",
          ],
        },
      },
      {
        src: "/images/farris/direct-spring-lever.jpg",
        caption: "Direct spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 1890",
          description:
            "A threaded direct-spring valve with a prominent manual lifting lever and identification nameplate, sized for smaller process lines.",
          specs: [
            "Threaded inlet connection",
            "Manual lifting lever",
            "Stamped identification nameplate",
            "Air, steam & liquid service",
          ],
        },
      },
      {
        src: "/images/farris/direct-spring-flanged-lever.jpg",
        caption: "Direct spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 2600 / 2700",
          description:
            "A flanged direct-spring valve with a full-length lifting lever, allowing manual operational testing while the line stays in service.",
          specs: [
            "Flanged inlet & outlet",
            "Full-length test lever",
            "ASME/NB-certified",
            "Air, steam & water service",
          ],
        },
      },
      {
        src: "/images/farris/spring-operated-compact.jpg",
        caption: "Spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 2850",
          description:
            "A compact threaded spring-loaded valve sized for smaller lines carrying air, steam, vapor or liquid, where a full flanged body isn't required.",
          specs: [
            "Threaded connections",
            "Air, steam, vapor & liquid",
            "Compact, space-saving body",
            "FAST authorized service tag",
          ],
        },
      },
      {
        src: "/images/farris/spring-operated-lever.jpg",
        caption: "Spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 2850",
          description:
            "A threaded spring-loaded relief valve with a compact lifting lever and identification plate for field verification.",
          specs: [
            "Threaded connection",
            "Compact lifting lever",
            "Field-verifiable set pressure",
            "Air, steam, vapor & liquid",
          ],
        },
      },
      {
        src: "/images/farris/spring-operated-angle.jpg",
        caption: "Spring-operated safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 2850",
          description:
            "A spring-loaded relief valve shown at an angle, highlighting the flanged inlet and side-mounted lifting lever.",
          specs: [
            "Flanged inlet connection",
            "Side-mounted lifting lever",
            "Compact body profile",
            "Air, steam, vapor & liquid",
          ],
        },
      },
      {
        src: "/images/farris/compact-relief-valve.jpg",
        caption: "Compact safety relief valve",
        category: "Direct & Spring-Operated",
        detail: {
          tag: "SERIES 1890",
          description:
            "A compact, space-saving direct-spring valve for lighter-duty relief service where a smaller footprint is needed.",
          specs: [
            "Space-saving body",
            "Threaded connection",
            "Lighter-duty relief service",
            "ASME Section VIII certified",
          ],
        },
      },

      // Pilot-operated valves
      {
        src: "/images/farris/pilot-operated.jpg",
        caption: "Pilot-operated valve — stainless pilot assembly",
        category: "Pilot-Operated",
        detail: {
          tag: "SERIES 3800",
          description:
            "A pilot-operated valve uses process pressure itself, through a small external pilot, to hold the main valve closed until set pressure is reached — enabling higher operating ratios and modulating relief.",
          specs: [
            "Snap-acting or modulating pilot",
            "Semi- or full-port nozzle",
            "Higher operating pressure ratio",
            "Stainless pilot assembly",
          ],
        },
      },
      {
        src: "/images/farris/pilot-operated-dual-gauge.jpg",
        caption: "Pilot-operated safety relief valve",
        category: "Pilot-Operated",
        detail: {
          tag: "SERIES 3800",
          description:
            "A larger pilot-operated valve fitted with dual gauge and test connections and a stainless pilot assembly, suited to high-capacity process protection.",
          specs: [
            "Dual gauge/test connections",
            "Stainless pilot assembly",
            "High-capacity flanged body",
            "Semi- or full-port nozzle",
          ],
        },
      },
      {
        src: "/images/farris/pilot-operated-branded.jpg",
        caption: "Pilot-operated safety relief valve",
        category: "Pilot-Operated",
        detail: {
          tag: "SERIES 3800",
          description:
            "A Farris-branded pilot-operated valve with an external pilot assembly and isolation valves for online testing without a process shutdown.",
          specs: [
            "Online test isolation valves",
            "External pilot assembly",
            "No process shutdown required for testing",
            "Flanged inlet & outlet",
          ],
        },
      },

      // Wireless monitoring & aftermarket
      {
        src: "/images/farris/insure-monitoring.jpg",
        caption: "iNSURE® wireless relief valve monitoring",
        category: "Monitoring & Aftermarket",
        detail: {
          tag: "iNSURE® · SIZEMASTER™ · FAST NETWORK",
          description:
            "A wireless monitoring module that clips onto an in-service relief valve, tracking lift events and pressure conditions in real time without interrupting the process.",
          specs: [
            "Real-time lift & leak detection",
            "Wireless data transmission",
            "Retrofits to existing valves",
            "Backed by factory FAST service network",
          ],
        },
      },
      {
        src: "/images/farris/insure-monitoring-compact.jpg",
        caption: "iNSURE® wireless relief valve monitoring",
        category: "Monitoring & Aftermarket",
        detail: {
          tag: "iNSURE® · SIZEMASTER™ · FAST NETWORK",
          description:
            "The compact iNSURE® module mounted directly on the valve outlet, giving a continuous read on relief valve condition between turnarounds.",
          specs: [
            "Continuous condition monitoring",
            "Compact outlet-mounted module",
            "Reduces unplanned inspection",
            "Backed by factory FAST service network",
          ],
        },
      },

      // Product range overviews
      {
        src: "/images/farris/body-options.jpg",
        caption: "Safety relief valve range — body options",
        category: "Product Range",
        detail: {
          tag: "SERIES 2600 / 2700",
          description:
            "The same direct-spring design available across multiple body materials and connection styles, so the right valve fits the piping and service already on site.",
          specs: [
            "ASME/NB-certified",
            "Flanged or threaded body",
            "Carbon steel or stainless trim",
            "Air, steam & water service",
          ],
        },
      },
      {
        src: "/images/farris/valve-range.jpg",
        caption: "Safety relief valve range",
        category: "Product Range",
        detail: {
          tag: "FULL PRODUCT RANGE",
          description:
            "Farris' relief valve line spans compact threaded models to heavy flanged bodies, covering light instrument air through high-capacity process protection.",
          specs: [
            "Multiple body sizes & materials",
            "Threaded & flanged connections",
            "Balanced-bellows options available",
            "Backed by FAST authorized service",
          ],
        },
      },
      {
        src: "/images/farris/valve-range-grouped.jpg",
        caption: "Safety relief valve product range",
        category: "Product Range",
        detail: {
          tag: "FULL PRODUCT RANGE",
          description:
            "A further view of the Farris relief valve line, spanning compact direct-spring models to larger flanged, lever-operated designs.",
          specs: [
            "Compact to large-bore bodies",
            "Direct-spring & pilot designs",
            "Multiple finishes & materials",
            "Backed by FAST authorized service",
          ],
        },
      },
      {
        src: "/images/farris/valve-pair.jpg",
        caption: "Safety relief valve range",
        category: "Product Range",
        detail: {
          tag: "FULL PRODUCT RANGE",
          description:
            "A flanged valve and a compact threaded valve shown side by side, illustrating the range of body sizes available for different line sizes.",
          specs: [
            "Flanged & threaded options",
            "Range of body sizes",
            "Matched finish across the line",
            "Air, steam & liquid service",
          ],
        },
      },
      {
        src: "/images/farris/pilot-assisted-pair.jpg",
        caption: "Safety relief valve product range",
        category: "Product Range",
        detail: {
          tag: "SERIES 3800",
          description:
            "Two pilot-assisted relief valves from the Farris line, each fitted with external sensing and test connections for high-capacity duty.",
          specs: [
            "External pilot sensing lines",
            "Test connections included",
            "High-capacity process protection",
            "Flanged process connections",
          ],
        },
      },

      // Internal construction
      {
        src: "/images/farris/cross-section.jpg",
        caption: "Safety relief valve — internal cross-section",
        category: "Internal Construction",
        detail: {
          tag: "INTERNAL CONSTRUCTION",
          description:
            "A direct spring-operated valve holds a precision-machined disc against the nozzle seat under spring force, lifting cleanly once inlet pressure overcomes the set pressure.",
          specs: [
            "Precision-lapped seat & disc",
            "Adjustable spring set pressure",
            "Guided stem for repeatable lift",
            "Field-serviceable internals",
          ],
        },
      },
      {
        src: "/images/farris/cross-section-detail.jpg",
        caption: "Safety relief valve — internal cross-section",
        category: "Internal Construction",
        detail: {
          tag: "INTERNAL CONSTRUCTION",
          description:
            "Another cutaway view of the direct-spring mechanism, showing the guided spindle, spring chamber and seat arrangement in detail.",
          specs: [
            "Guided spindle & seat",
            "Enclosed spring chamber",
            "Consistent, repeatable lift",
            "Field-serviceable internals",
          ],
        },
      },

      // Actuated valves
      {
        src: "/images/farris/actuated-control-valve.jpg",
        caption: "Actuated control / relief valve",
        category: "Actuated Valves",
        detail: {
          tag: "ACTUATED RELIEF VALVE",
          description:
            "A relief valve fitted with a handwheel and actuator bonnet for remote or automated operation, where local manual reset isn't practical.",
          specs: [
            "Manual handwheel override",
            "Actuator-ready bonnet",
            "Suited to remote/automated operation",
            "Flanged process connection",
          ],
        },
      },
    ],
  },
  {
    slug: "dyna-flo",
    no: "BRAND 02",
    name: "Dyna-Flo Control Valve Services",
    origin: "Edmonton, Canada · Control valves · Sole agent in Egypt",
    category: "Control Valves, Actuators & Instrumentation",
    summary:
      "Linear and rotary control valves, actuators and instrumentation for stable, accurate process control under high pressure drop.",
    description:
      "Dyna-Flo, a Curtiss-Wright company headquartered in Edmonton, Canada, has designed and manufactured process control equipment for nearly 30 years, serving the chemical, petrochemical, power, and oil & gas markets.",
    sectors: [
      "Oil & Gas",
      "Petrochemical",
      "Power Generation",
      "Water Treatment",
      "Fertilizers",
    ],
    productLines: [
      {
        tag: "360 / 390 / 350 / 370 / 380 / DF2000",
        name: "Linear sliding-stem valves",
        description: "1\"–16\", pressure classes 150–2500.",
      },
      {
        tag: "SERIES 570 / 590",
        name: "Rotary valves (segmented & full ball)",
        description: "High-flow, throttling or on/off service.",
      },
      {
        tag: "DF100 / DF234 / DF270",
        name: "Integral actuator valves",
        description: "Compact dump-valve applications.",
      },
      {
        tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
        name: "Pneumatic actuators",
        description: "Linear & rotary, spring-return or double-acting.",
      },
      {
        tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
        name: "Instrumentation",
        description:
          "Pressure/level control, I/P transducers, positioners.",
      },
    ],
    externalUrl: "https://valves.curtisswright.com/en-us/Dynaflo",
    gridCols: 3,
    image: "/images/dynaflo-control-valve.jpg",
    imageAlt: "Close-up of an industrial control valve with actuator",
    logo: "/images/dynaflo-logo.png",
  },
  {
    slug: "est",
    no: "BRAND 03",
    name: "EST",
    origin: "Hatfield, Pennsylvania, USA · Heat exchanger services · Sole agent in Egypt",
    category: "Heat Exchanger Repair & Pressure Testing",
    summary:
      "Tube plugging, hydrostatic test & isolation equipment, and field services restoring thermal efficiency across refining, petrochemical and power plants.",
    description:
      "EST Group, a Curtiss-Wright company based in Hatfield, Pennsylvania (with offices in the Netherlands and Singapore), has specialized since 1968 in engineered products and field services for shell-and-tube heat exchangers, condensers, coolers and pressure vessels.",
    sectors: [
      "Oil & Gas",
      "Petrochemical",
      "Power Generation",
      "Water Treatment",
      "Fertilizers",
    ],
    productLines: [
      {
        tag: "POP-A-PLUG®",
        name: "Mechanical tube plugging",
        description:
          "Weld-free sealing of leaking heat exchanger, condenser & boiler tubes, rated to 7,000 psi.",
      },
      {
        tag: "GRIPTIGHT®",
        name: "Hydrostatic test & isolation plugs",
        description:
          "Pipe, pipeline and pressure vessel testing, rated up to 15,000 psig.",
      },
      {
        tag: "G-SERIES",
        name: "Tube testing tools",
        description: "Testing guns for locating and identifying leaking tubes.",
      },
      {
        tag: "HYDRA-LOC®",
        name: "Tube stabilizers & sleeving",
        description:
          "Repair for fractured, severed, or damaged tube sections.",
      },
    ],
    externalUrl: "https://valves.curtisswright.com/en-us/EST",
    gridCols: 4,
    image: "/images/est-field-service.jpg",
    imageAlt: "Field service technician welding industrial pipework",
    logo: "/images/curtiss-wright-logo.png",
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

// Groups gallery items by category, preserving first-seen category order.
export function groupGalleryByCategory(items: GalleryItem[]) {
  const groups = new Map<string, GalleryItem[]>();
  for (const item of items) {
    const list = groups.get(item.category);
    if (list) list.push(item);
    else groups.set(item.category, [item]);
  }
  return Array.from(groups, ([category, items]) => ({ category, items }));
}

export const pastManufacturers = [
  { name: "Solent & Pratt", sub: "High-performance butterfly valves" },
  { name: "ALCO Valves Group", sub: "Industrial valves" },
  { name: "Control Seal", sub: "Severe-service valves" },
  { name: "Flowserve", sub: "Flow control" },
  { name: "AVK Group", sub: "Valves & hydrants" },
  { name: "Bürkert", sub: "Fluid control systems" },
  { name: "IMI Orton", sub: "Process automation" },
];

export type Client = { name: string; short: string; logo: string };

export const clients: Client[] = [
  { name: "ENPPI", short: "ENPPI", logo: "/images/clients/enppi.png" },
  { name: "Petrojet", short: "Petrojet", logo: "/images/clients/petrojet.png" },
  { name: "Khalda Petroleum Company", short: "Khalda Petroleum", logo: "/images/clients/khalda.png" },
  { name: "Gasco", short: "GASCO", logo: "/images/clients/gasco.png" },
  { name: "Damietta LNG (DLNG)", short: "Damietta LNG", logo: "/images/clients/dlng.png" },
  { name: "Birla Carbon", short: "Birla Carbon", logo: "/images/clients/birla-carbon.png" },
  { name: "Cairo Oil Refining Company (CORC)", short: "Cairo Oil Refining", logo: "/images/clients/corc.png" },
  { name: "Belayim Petroleum Company (PETROBEL)", short: "PETROBEL", logo: "/images/clients/petrobel.png" },
  { name: "Suez Oil Processing Company (SOPC)", short: "Suez Oil Processing", logo: "/images/clients/sopc.png" },
  { name: "Arab Petroleum Pipelines Company (SUMED)", short: "SUMED", logo: "/images/clients/sumed.png" },
];

export const timeline = [
  {
    year: "2006",
    unit: "Giza",
    body: "ACTS is founded in Sixth of October City, Giza, under Commercial Registration No. 58261.",
    now: false,
  },
  {
    year: "—",
    unit: "Nasr City",
    body: "Operations expand with a new branch in Nasr City, Cairo, broadening national reach and technical support.",
    now: false,
  },
  {
    year: "2010",
    unit: "Consultancy",
    body: "Consultancy services launch: feasibility studies, technical training, and business advisory.",
    now: false,
  },
  {
    year: "2016",
    unit: "$4M / year",
    body: "ACTS reincorporates as a Limited Liability Company (Reg. No. 94859); annual sales reach USD 4 million.",
    now: false,
  },
  {
    year: "2019",
    unit: "Transformation",
    body: "A company-wide transformation modernizes operations and strengthens service delivery.",
    now: false,
  },
  {
    year: "2025",
    unit: "Arkan Plaza",
    body: "Headquarters relocate to Arkan Plaza, Sheikh Zayed City, Giza.",
    now: true,
  },
];

export const mission = [
  {
    num: "01",
    title: "Customer satisfaction",
    description: "Set the industry benchmark for customer satisfaction.",
  },
  {
    num: "02",
    title: "Competitive position",
    description:
      "Secure a strong, competitive position across the markets we serve.",
  },
  {
    num: "03",
    title: "Partner value",
    description:
      "Partner with our principals to deliver optimal value-for-cost solutions.",
  },
  {
    num: "04",
    title: "Sustainable practices",
    description: "Champion responsible, sustainable business practices.",
  },
  {
    num: "05",
    title: "Build trust",
    description:
      "Build trust within the communities and industries we serve.",
  },
];

export const values = [
  {
    name: "Trust",
    description:
      "Transparent pricing, honest lead times, and clear communication with every customer.",
  },
  {
    name: "Excellence",
    description:
      "Technical review of every order before it's quoted, not just processed.",
  },
  {
    name: "Empowerment",
    description:
      "Advising customers toward the right solution, even when it's a smaller sale.",
  },
  {
    name: "Innovation",
    description:
      "Staying current on modern control, monitoring, and diagnostic technologies.",
  },
  {
    name: "Efficiency",
    description:
      "Streamlined quotation-to-delivery workflow, minimizing delays on critical parts.",
  },
];

export const offices = [
  {
    tag: "Headquarters",
    name: "Arkan Plaza, Building 4, 4th Floor, Office #409",
    address: "Sheikh Zayed City, Giza, Egypt, 12451",
  },
];

export const contact = {
  phone: "+202 3850 8135",
  salesEmail: "sales@actsegypt.com",
  infoEmail: "info@actsegypt.com",
};

export const team = [{ role: "General Manager", name: "Ayman El-Mohamady" }];

export const departments = [
  {
    name: "Quotes & Sales",
    phone: "+202 3850 8135",
    mobile: "+20 122 323 5399",
    fax: "+202 3850 8135",
    emails: ["aelmohamady@actsegypt.org", "sales@actsegypt.com"],
  },
  {
    name: "General Inquiries",
    phone: "+202 3850 8135",
    mobile: "+20 122 730 0010",
    fax: "+202 3850 8135",
    emails: ["aelmohamady@actsegypt.org", "info@actsegypt.com"],
  },
  {
    name: "Marketing",
    phone: "+202 3850 8135",
    mobile: "+20 122 730 0010",
    fax: "+202 3850 8135",
    emails: ["marketing@actsegypt.org"],
  },
];

export const officeHours = [
  { day: "Sunday – Thursday", hours: "9:00 AM – 5:00 PM (Cairo Time)" },
  { day: "Friday – Saturday", hours: "Closed" },
];

export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  applications: string[];
  howWeSupport: string[];
  productLines: string;
  image: string;
  imageAlt: string;
};

export const industries: Industry[] = [
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    tagline: "Upstream • Midstream • Refining • Petrochemicals",
    intro:
      "The Oil & Gas sector demands absolute reliability, safety, and compliance. From wellhead to refinery, we provide critical equipment that protects personnel, assets, and the environment.",
    applications: [
      "Upstream: wellhead flow control, separation vessels, gas compression, and pipeline protection",
      "Midstream: pipeline regulation, pump station control, and storage terminal overpressure protection",
      "Refining: process unit isolation, fractionation column control, fired heater protection, and catalyst handling",
      "Petrochemical: reactor feed control, steam cracking, polymerization, and specialty chemical production",
    ],
    howWeSupport: [
      "Safety relief valves for overpressure protection (Farris Engineering), sized for two-phase flow, thermal expansion, and fire-case scenarios",
      "Precision control valves for severe-service applications (Dyna-Flo), including high-pressure drop, erosive media, and high-temperature conditions",
      "Heat exchanger maintenance and retubing (EST) to restore thermal efficiency and extend asset life during turnarounds",
      "Pressure testing and pipeline isolation (EST GripTight®) for commissioning, maintenance, and integrity verification",
      "API 526/527 compliance verification and re-certification support",
    ],
    productLines:
      "Farris Series 1890, 2600, 3800 • Dyna-Flo Series 360, 390, DF2000, Series 570 • EST Pop-A-Plug®, GripTight®",
    image: "/images/offshore-rig.jpg",
    imageAlt: "Offshore jack-up drilling rig with gas flare",
  },
  {
    slug: "petrochemical",
    name: "Petrochemical",
    tagline: "Chemical Processing • Polymers • Specialty Chemicals",
    intro:
      "Petrochemical facilities operate under extreme conditions: high pressures, high temperatures, corrosive media, and continuous operation. Our solutions are engineered to withstand these environments and keep the process stable and safe.",
    applications: [
      "Olefins production (ethylene, propylene): cracking furnace control, quench tower protection",
      "Aromatics production: extraction, distillation, hydrotreating",
      "Polymers (polyethylene, polypropylene, PVC): reactor feed control, extruder pressure regulation",
    ],
    howWeSupport: [
      "Control valves with anti-cavitation and noise-attenuation trims for high delta-P services",
      "Safety relief valves for critical process protection, including pilot-operated designs for large-capacity gas service",
      "Heat exchanger tube inspection (IRIS/Eddy Current) and maintenance to prevent unplanned downtime",
      "Valve condition monitoring and diagnostics for predictive maintenance programs",
      "Sizing, selection, and engineering support for new projects and plant expansions",
    ],
    productLines:
      "Farris Series 2600, 2700, 3800 • Dyna-Flo Series 350, 370, 380, DF2000 • EST Pop-A-Plug®, Hydra-Loc®, GripTight®",
    image: "/images/gas-plant.jpg",
    imageAlt: "Natural gas wellhead with valve handwheels",
  },
  {
    slug: "power-generation",
    name: "Power Generation",
    tagline: "Fossil Fuel • Combined Cycle • Cogeneration",
    intro:
      "Power generation plants require equipment that delivers precise control, absolute safety, and long-term reliability.",
    applications: [
      "Steam generation: boiler feedwater control, steam pressure regulation, and safety relief for drums and superheaters",
      "Gas turbines: fuel gas control, inlet air filtration, and emergency shutdown systems",
      "Combined cycle: HRSG control, duct burner regulation, and condensate management",
      "Cooling systems: circulating water control, condenser tube maintenance, and cooling tower isolation",
      "Balance of plant: compressed air systems, auxiliary steam, and fuel handling",
    ],
    howWeSupport: [
      "Safety relief valves for boiler drum protection, steam line protection, and turbine bypass systems",
      "Control valves for feedwater regulation, desuperheating, and fuel gas control",
      "Heat exchanger and condenser tube maintenance, including cleaning, plugging, and retubing (EST)",
      "Pipeline and pressure vessel pressure testing (GripTight®) for hydrostatic testing",
      "Retrofit and modernization recommendations to improve plant efficiency",
    ],
    productLines:
      "Farris Series 1890, 6400/6600, 3800 • Dyna-Flo Series 360, 390, DF2000 • EST Pop-A-Plug®, Hydra-Loc®, GripTight®",
    image: "/images/power-station.jpg",
    imageAlt: "Power station at night",
  },
  {
    slug: "water-treatment",
    name: "Water Treatment",
    tagline: "Desalination • Municipal Water • Industrial Wastewater • Cooling Water",
    intro:
      "Water treatment facilities require corrosion-resistant materials, precise flow control, and reliable isolation equipment.",
    applications: [
      "Desalination (SWRO/MSF/MED): pretreatment control, high-pressure brine handling, and chemical dosing",
      "Municipal water: intake control, filtration, disinfection, and distribution network isolation",
      "Industrial wastewater: neutralization, clarification, sludge handling, and effluent discharge",
      "Cooling water systems: heat exchanger protection, biocides dosing, and condenser tube maintenance",
    ],
    howWeSupport: [
      "Isolation valves (ball, butterfly) for on/off and flow isolation services",
      "Pressure regulators and instrumentation for chemical dosing systems",
      "Heat exchanger maintenance (EST) for plate-and-frame and shell-and-tube exchangers used in cooling and heating circuits",
      "Backflow prevention and check valves for pipeline protection",
      "Sizing and selection support for corrosive and erosive media",
    ],
    productLines:
      "Dyna-Flo Series 570 (segmented ball), Model 590 (full-ball) • Farris Series 1890 • EST Pop-A-Plug®",
    image: "/images/refinery-blue.jpg",
    imageAlt: "Oil refinery at blue hour",
  },
  {
    slug: "fertilizers",
    name: "Fertilizers",
    tagline: "Ammonia • Urea • Phosphate • NPK Blends",
    intro:
      "Fertilizer production involves high-pressure synthesis loops, corrosive media, and high-temperature processes, so equipment needs a long service life and minimal downtime.",
    applications: [
      "Ammonia synthesis: high-pressure steam reforming, shift conversion, CO₂ removal, and synthesis loop control",
      "Urea production: carbamate formation, urea finishing, and prilling/granulation",
      "Phosphate processing: acidulation, filtration, and granulation",
      "Blending and bagging: material handling, dust collection, and bagging equipment control",
    ],
    howWeSupport: [
      "Pilot-operated safety relief valves for high-capacity synthesis loop protection",
      "Severe-service control valves for erosive slurry and corrosive acid service",
      "Heat exchanger maintenance, including carbamate condenser inspection and retubing (EST)",
      "Tube plugging (Pop-A-Plug®) for quick repairs without plant shutdown",
      "Consultancy services for plant optimization and reliability improvement",
    ],
    productLines:
      "Farris Series 3800, 2600 • Dyna-Flo Series 370, DF2000, Series 570 • EST Pop-A-Plug®, GripTight®",
    image: "/images/gas-plant.jpg",
    imageAlt: "Natural gas wellhead with valve handwheels",
  },
  {
    slug: "general-industrial",
    name: "General Industrial",
    tagline: "Cement • Steel • Glass • Pulp & Paper • Mining • Manufacturing",
    intro:
      "Beyond heavy process industries, we serve a wide range of general industrial applications: reliable equipment and technical support for manufacturing facilities of all types.",
    applications: [
      "Cement production: preheater control, kiln burner regulation, and dust collection isolation",
      "Steel processing: furnace control, cooling water regulation, and hydraulic systems",
      "Glass manufacturing: combustion control, batch handling, and forming machine regulation",
      "Pulp & paper: chemical dosing, stock preparation, and dryer system control",
      "Mining: slurry handling, dewatering, and process water management",
    ],
    howWeSupport: [
      "General-purpose control and isolation valves for water, air, steam, and chemicals",
      "Safety relief valves for compressor systems, pressure vessels, and hydraulic units",
      "Actuators and positioners for automated process control",
      "Technical advisory and product selection support for plant engineers",
      "Spare parts and aftermarket support for critical equipment",
    ],
    productLines:
      "Farris Series 1890, 2850 • Dyna-Flo Series 360, 570, Model 590 • EST Pop-A-Plug®",
    image: "/images/power-station.jpg",
    imageAlt: "Power station at night",
  },
];

export const industriesSummary = [
  {
    industry: "Oil & Gas",
    challenges: "Safety, severe service, high reliability",
    solutions:
      "Safety relief valves, control valves, heat exchanger maintenance, pressure testing",
  },
  {
    industry: "Petrochemical",
    challenges: "Corrosion, high pressure, high temperature",
    solutions:
      "Anti-cavitation trims, pilot-operated valves, tube inspection & retubing",
  },
  {
    industry: "Power Generation",
    challenges: "Boiler safety, condenser efficiency, uptime",
    solutions:
      "Steam relief valves, feedwater control, condenser tube plugging & cleaning",
  },
  {
    industry: "Water Treatment",
    challenges: "Corrosion, precise dosing, reliability",
    solutions: "Isolation valves, regulators, heat exchanger maintenance",
  },
  {
    industry: "Fertilizers",
    challenges: "Corrosive slurries, high-pressure synthesis",
    solutions:
      "Severe-service control valves, POSV relief valves, carbamate exchanger solutions",
  },
  {
    industry: "General Industrial",
    challenges: "Diverse applications, cost efficiency",
    solutions: "Standard control & isolation valves, actuators, technical advisory",
  },
];

export type ProjectClientGroup = {
  slug: string;
  category: string;
  image: string;
  imageAlt: string;
  entries: { name: string; sector: string }[];
};

export const projectClients: ProjectClientGroup[] = [
  {
    slug: "upstream",
    category: "Oil & Gas — Upstream & Exploration",
    image: "/images/upstream-drilling-rig.jpg",
    imageAlt: "Land drilling rig at an upstream oil field",
    entries: [
      { name: "Khalda Petroleum Company", sector: "Upstream — Western Desert Operations" },
      { name: "Belayim Petroleum Company (Petrobel)", sector: "Upstream — Gulf of Suez & Sinai" },
      { name: "GUPCO Petroleum Company", sector: "Upstream — Gulf of Suez" },
      { name: "Badr El Din Petroleum Company", sector: "Upstream — Western Desert" },
      { name: "South Dabaah Petroleum Co. (DAPETCO)", sector: "Upstream — Western Desert" },
      { name: "Nasr Petroleum Company", sector: "Upstream & Refining" },
      { name: "Scimitar Production Egypt Ltd", sector: "Upstream — International Operator" },
    ],
  },
  {
    slug: "midstream",
    category: "Oil & Gas — Midstream, Refining & LNG",
    image: "/images/refinery-blue.jpg",
    imageAlt: "Oil refinery at blue hour",
    entries: [
      { name: "Cairo Oil Refining Company (CORC)", sector: "Refining — Cairo" },
      { name: "Suez Oil Processing Company (SOPC)", sector: "Refining — Suez" },
      { name: "Egyptian Natural Gas Holding Co. (EGAS)", sector: "Midstream — Gas Transmission" },
      { name: "Arab Petroleum Pipelines Co. (SUMED)", sector: "Midstream — Pipeline Transportation" },
      { name: "Egypt's Damietta LNG", sector: "LNG — Liquefaction & Export" },
    ],
  },
  {
    slug: "epc",
    category: "EPC, Engineering & Project Management",
    image: "/images/power-station.jpg",
    imageAlt: "Power station at night",
    entries: [
      {
        name: "ENPPI (Engineering for the Petroleum and Process Industries)",
        sector: "Engineering & EPC — Oil & Gas",
      },
      {
        name: "Petrojet (The Petroleum Projects & Technical Consultations Co.)",
        sector: "EPC & Technical Consultancy",
      },
    ],
  },
  {
    slug: "petrochemicals",
    category: "Petrochemicals & Chemicals",
    image: "/images/petrochemical-plant.jpg",
    imageAlt: "Petrochemical plant with process towers and steam plumes",
    entries: [
      {
        name: "The Egyptian Ethylene and Derivatives Company (ETHYDCO)",
        sector: "Petrochemicals — Ethylene & Derivatives",
      },
      {
        name: "Egyptian Propylene and Polypropylene Company",
        sector: "Petrochemicals — Propylene & Polypropylene",
      },
      { name: "Echem — Egyptian Petrochemicals Holding Co.", sector: "Petrochemicals — Holding & Investments" },
      { name: "Egyptian Methanex Methanol Company", sector: "Petrochemicals — Methanol Production" },
      {
        name: "Egypt Basic Industries Corporation (EBIC)",
        sector: "Petrochemicals — Ammonia & Fertilizers (Fertiglobe)",
      },
    ],
  },
  {
    slug: "fertilizers",
    category: "Fertilizers",
    image: "/images/gas-plant.jpg",
    imageAlt: "Natural gas wellhead with valve handwheels",
    entries: [
      { name: "Misr Fertilizers Production Company (MOPCO)", sector: "Fertilizers — Ammonia & Urea" },
      { name: "Birla Carbon", sector: "Fertilizers & Carbon Black" },
    ],
  },
];

// Generic, anonymized descriptions of the kind of work ACTS supports in each
// sector — not claims about a specific completed project or named client.
// Specific project details are confidential (see the Projects page).
export const engagementHighlights = [
  {
    slug: "upstream",
    title: "Wellhead & Separator Protection",
    text: "Sizing and supply of safety relief valves for wellhead, separator, and gas-compression overpressure protection across upstream production facilities.",
  },
  {
    slug: "midstream",
    title: "Turnaround & Outage Support",
    text: "Rapid valve testing, recertification, and replacement coordinated around planned refinery and gas-processing turnarounds to minimize outage windows.",
  },
  {
    slug: "epc",
    title: "New-Build Project Support",
    text: "Technical sizing, selection, and procurement support supplied directly to EPC contractors during new facility construction and commissioning.",
  },
  {
    slug: "petrochemicals",
    title: "Severe-Service Control",
    text: "Control valve trim selection and cavitation/noise analysis for high-pressure-drop, corrosive-service petrochemical process lines.",
  },
  {
    slug: "fertilizers",
    title: "Synthesis Loop Protection",
    text: "Pilot-operated relief valve sizing and heat exchanger tube maintenance supporting high-pressure ammonia and urea synthesis loops.",
  },
];

export const serviceNeeds = [
  "Safety Relief Valve",
  "Control Valve",
  "Actuator / Positioner",
  "Heat Exchanger Service",
  "Pressure Testing",
  "Consultancy",
  "Other",
];

export const brandOptions = [...brands.map((b) => b.name), "Other"];
