// All site content in one place. Products/vendors barely change, so they live
// here instead of Supabase for v1 — edit this file to update the catalog.
// Inquiries (RFQ form) DO go to Supabase via /api/inquiries.

export type ProductLineItem = {
  /** Branded product-card photo (white bg) from public/images/<brand>/, or a
   *  manufacturer catalog photo under public/Data/ when the line has no
   *  branded shot (these simply don't deep-link into the gallery). */
  image: string;
  /** Short product name shown under the photo. */
  name: string;
};

export type ProductLine = {
  tag?: string;
  name: string;
  description: string;
  /** The individual products in this line, revealed as a scrollable photo strip
   *  when the card is expanded, so customers can see the whole range. */
  products?: ProductLineItem[];
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
  /** Search-result copy for the brand's landing page. `name` alone made a
   *  weak title ("Farris Engineering | ACTS Egypt") — it says nothing about
   *  what the brand makes or that ACTS supplies it here, which is exactly
   *  what "farris valves egypt" is asking. Suffix-free; lib/seo appends it. */
  seoTitle: string;
  seoDescription: string;
  /** Hero H1. The brand name alone ("Farris Engineering") is what every one of
   *  this brand's global distributors uses; adding the country is what makes
   *  this the page Google should return for "farris egypt". Kept as its own
   *  field rather than `${name} in Egypt` so "EST" — ambiguous on its own —
   *  can say "EST Group". */
  seoHeading: string;
  /** Prefixed to a product page's H1 when the product's own name is a bare
   *  series number ("2600 & 2600L Series") that says nothing about who makes
   *  it — "farris 2600" is the query, not "2600". Omitted for EST, whose
   *  product names are already the trademarked terms people search for
   *  (Pop-A-Plug®, GripTight®, Hydra-Loc®). */
  productHeadingPrefix?: string;
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
    seoTitle: "Farris Engineering Safety Relief Valves in Egypt",
    seoHeading: "Farris Engineering in Egypt",
    productHeadingPrefix: "Farris",
    seoDescription:
      "ACTS is Egypt's sole agent for Farris Engineering (Curtiss-Wright) safety relief valves: API 526 process PRVs, steam safety valves and iNSURE® monitoring.",
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
        products: [
          {
            image: "/images/farris/direct-spring-valve.jpg",
            name: "Direct spring-operated safety relief valve",
          },
          {
            image: "/images/farris/direct-spring-closeup.png",
            name: "Open-spring bonnet with test lever",
          },
          {
            image: "/images/farris/direct-spring-lever.png",
            name: "Threaded valve with lifting lever",
          },
          {
            image: "/images/farris/compact-relief-valve.jpg",
            name: "Compact safety relief valve",
          },
        ],
      },
      {
        tag: "SERIES 2600 / 2700",
        name: "Direct spring-operated, flanged/threaded",
        description: "ASME/NB-certified: air, steam, water.",
        products: [
          {
            image: "/images/farris/direct-spring-flanged-lever.png",
            name: "Flanged valve with full-length test lever",
          },
          {
            image: "/images/farris/body-options.jpg",
            name: "Body material & connection options",
          },
        ],
      },
      {
        tag: "SERIES 2850",
        name: "Threaded, spring-loaded",
        description: "Air, steam, vapor & liquid.",
        products: [
          {
            image: "/images/farris/spring-operated-compact.jpg",
            name: "Compact spring-operated relief valve",
          },
          {
            image: "/images/farris/spring-operated-lever.png",
            name: "Spring-operated valve with lifting lever",
          },
          {
            image: "/images/farris/spring-operated-angle.jpg",
            name: "Flanged-inlet valve with side lever",
          },
        ],
      },
      {
        tag: "SERIES 3800",
        name: "Pilot-operated",
        description:
          "Snap-acting or modulating control, semi/full-port nozzle.",
        products: [
          {
            image: "/images/farris/pilot-operated.jpg",
            name: "Pilot-operated valve with stainless pilot assembly",
          },
          {
            image: "/images/farris/pilot-operated-dual-gauge.jpg",
            name: "High-capacity valve with dual gauges",
          },
          {
            image: "/images/farris/pilot-operated-branded.jpg",
            name: "Online-testable pilot-operated valve",
          },
          {
            image: "/images/farris/pilot-assisted-pair.png",
            name: "Pilot-assisted relief valve pair",
          },
        ],
      },
      {
        tag: "SERIES 6400 / 6600",
        name: "Flanged steam safety valves",
        description: "Boiler safety service.",
        products: [
          {
            image: "/Data/Farris-Valves/images/6400.jpg",
            name: "6400 Series flanged steam safety valve",
          },
          {
            image: "/Data/Farris-Valves/images/6400_1.jpg",
            name: "6400 Series internal cross-section",
          },
        ],
      },
      {
        tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
        name: "Sizing, monitoring & aftermarket support",
        description:
          "Sizing software, real-time relief-valve monitoring, and factory-backed repair/recertification network.",
        products: [
          {
            image: "/images/farris/insure-monitoring.jpg",
            name: "iNSURE® wireless relief-valve monitoring",
          },
          {
            image: "/images/farris/insure-monitoring-compact.png",
            name: "Compact outlet-mounted iNSURE® module",
          },
        ],
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
            "Farris' workhorse direct spring-operated relief valve, opening automatically once inlet pressure exceeds the spring set point, with no external power or signal required.",
          specs: [
            "ASME Section VIII certified",
            "Rated to 800 psig",
            "Air, steam & liquid service",
            "Threaded or flanged connections",
          ],
        },
      },
      {
        src: "/images/farris/direct-spring-closeup.png",
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
        src: "/images/farris/direct-spring-lever.png",
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
        src: "/images/farris/direct-spring-flanged-lever.png",
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
        src: "/images/farris/spring-operated-lever.png",
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
          tag: "SERIES 2400",
          description:
            "A direct spring-loaded relief valve that reaches full lift at set pressure, with external blowdown adjustment and a manual lifting lever for in-service testing.",
          specs: [
            "ASME Section VIII certified",
            "Direct spring-loaded, full lift at set",
            "Soft seat design",
            "External blowdown control",
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
        caption: "Pilot-operated valve with stainless pilot assembly",
        category: "Pilot-Operated",
        detail: {
          tag: "SERIES 3800",
          description:
            "A pilot-operated valve uses process pressure itself, through a small external pilot, to hold the main valve closed until set pressure is reached, enabling higher operating ratios and modulating relief.",
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
        src: "/images/farris/insure-monitoring-compact.png",
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
        caption: "Safety relief valve range: body options",
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
        src: "/images/farris/valve-range-grouped.png",
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
        src: "/images/farris/valve-pair.png",
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
        src: "/images/farris/pilot-assisted-pair.png",
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
        caption: "Safety relief valve internal cross-section",
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
        src: "/images/farris/cross-section-detail.png",
        caption: "Safety relief valve internal cross-section",
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
        src: "/images/farris/actuated-control-valve.png",
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
    seoTitle: "Dyna-Flo Control Valves & Actuators in Egypt",
    seoHeading: "Dyna-Flo in Egypt",
    productHeadingPrefix: "Dyna-Flo",
    seoDescription:
      "ACTS is Egypt's sole agent for Dyna-Flo (Curtiss-Wright) control valves: sliding-stem, rotary ball and DF400 eccentric plug, plus actuators and positioners.",
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
        description: "1\" to 16\", pressure classes 150 to 2500.",
        products: [
          {
            image: "/images/dynaflo/sliding-stem.jpg",
            name: "Sliding-stem globe control valve",
          },
        ],
      },
      {
        tag: "SERIES 570 / 590",
        name: "Rotary valves (segmented & full ball)",
        description: "High-flow, throttling or on/off service.",
        products: [
          {
            image: "/images/dynaflo/rotary-ball.jpg",
            name: "Segmented / full-ball rotary control valve",
          },
          {
            image: "/images/dynaflo/df400-rotary-plug.jpg",
            name: "DF400 eccentric rotary plug valve & actuator",
          },
        ],
      },
      {
        tag: "DF100 / DF234 / DF270",
        name: "Integral actuator valves",
        description: "Compact dump-valve applications.",
        products: [
          {
            image: "/images/dynaflo/integral-valve-actuator.jpg",
            name: "Integral valve-and-actuator assembly",
          },
        ],
      },
      {
        tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
        name: "Pneumatic actuators",
        description: "Linear & rotary, spring-return or double-acting.",
        products: [
          {
            image: "/images/dynaflo/dfc-dfo-actuators.jpg",
            name: "DFC (fail-closed) & DFO (fail-open) actuators",
          },
          {
            image: "/images/dynaflo/dfr-rotary-actuator.jpg",
            name: "DFR rotary spring & diaphragm actuator",
          },
          {
            image: "/images/dynaflo/dflp-piston-actuator.jpg",
            name: "DFLP linear pneumatic piston actuator",
          },
          {
            image: "/images/dynaflo/dfrp-piston-actuator.jpg",
            name: "DFRP rotary pneumatic piston actuator",
          },
          {
            image: "/images/dynaflo/dfn-yokeless-actuator.jpg",
            name: "DFN yokeless spring & diaphragm actuator",
          },
        ],
      },
      {
        tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
        name: "Instrumentation",
        description:
          "Pressure/level control, I/P transducers, positioners.",
        products: [
          {
            image: "/images/dynaflo/4000-pressure-controller.jpg",
            name: "4000 Series local pressure controller",
          },
          {
            image: "/images/dynaflo/5000-level-controller.jpg",
            name: "5000 displacer liquid level controller",
          },
          {
            image: "/images/dynaflo/ps2-positioner.jpg",
            name: "Siemens PS2 digital valve positioner",
          },
          {
            image: "/images/dynaflo/760-positioner.jpg",
            name: "Model 760 pneumatic valve positioner",
          },
          {
            image: "/images/dynaflo/pro-50-regulator.jpg",
            name: "PRO-50 instrument supply regulator",
          },
          {
            image: "/images/dynaflo/t950xp-transducer.png",
            name: "Control Air T950XP I/P transducer",
          },
        ],
      },
    ],
    externalUrl: "https://valves.curtisswright.com/en-us/Dynaflo",
    gridCols: 3,
    image: "/images/dynaflo-control-valve.jpg",
    imageAlt: "Close-up of an industrial control valve with actuator",
    logo: "/images/dynaflo-logo.png",
    bestSellers: ["360 / 390 Sliding-Stem", "570 Rotary Ball", "DF400 Rotary Plug"],
    gallery: [
      // Control valves
      {
        src: "/images/dynaflo/sliding-stem.jpg",
        caption: "Sliding-stem globe control valve",
        category: "Control Valves",
        detail: {
          tag: "360 / 390 / 350 / 370 / 380 SERIES",
          description:
            "Direct-acting globe-style control valve that throttles flow through the linear motion of a sliding-stem plug, paired with a spring-and-diaphragm actuator for precise, stable process control.",
          specs: [
            "1\" to 16\", ASME Class 150 to 2500",
            "Cage-guided balanced or unbalanced trim",
            "Anti-cavitation & low-noise trim options",
            "Spring-diaphragm or piston actuation",
          ],
        },
      },
      {
        src: "/images/dynaflo/rotary-ball.jpg",
        caption: "Segmented / full-ball rotary control valve",
        category: "Control Valves",
        detail: {
          tag: "MODEL 570 / 571 / 573 / 590",
          description:
            "High-capacity rotary control valve with a segmented or full ball for throttling and on/off service, delivering high flow with tight shutoff and a compact face-to-face footprint.",
          specs: [
            "1\" to 24\", ASME Class 150 to 900",
            "Segmented (570) or full-ball (590) designs",
            "High Cv, wide rangeability",
            "Throttling or on/off service",
          ],
        },
      },
      {
        src: "/images/dynaflo/df400-rotary-plug.jpg",
        caption: "DF400 eccentric rotary plug valve & actuator",
        category: "Control Valves",
        detail: {
          tag: "DF400 SERIES",
          description:
            "Heavy-duty eccentric plug rotary valve with a self-aligning plug and straight-through flow path, combined with a low-profile spring-and-diaphragm actuator for tight shutoff at higher flow capacities in severe service.",
          specs: [
            "1\" to 6\" (DN 25 to 150), Class 150 to 600",
            "ANSI/FCI Class IV or VI shutoff",
            "WCC / CF3M body, quarter-turn",
            "Low-emission packing & NACE options",
          ],
        },
      },
      {
        src: "/images/dynaflo/integral-valve-actuator.jpg",
        caption: "Integral valve-and-actuator assembly",
        category: "Control Valves",
        detail: {
          tag: "DF100 / DF234 / DF270 / DF2410",
          description:
            "Compact integral valve-and-actuator unit engineered for dump-valve and tight-shutoff applications where space is limited, combining the control element and actuator in a single assembly.",
          specs: [
            "1\" & 2\", ASME Class 150 to 1500",
            "Integral actuator, compact footprint",
            "Ideal for dump-valve service",
            "Fast, repeatable response",
          ],
        },
      },

      // Pneumatic actuators
      {
        src: "/images/dynaflo/dfc-dfo-actuators.jpg",
        caption: "DFC (fail-closed) & DFO (fail-open) actuators",
        category: "Pneumatic Actuators",
        detail: {
          tag: "DFC / DFO",
          description:
            "Large-diaphragm spring-and-diaphragm actuators for low-pressure pneumatic operation. The spring drives the valve to a fail-safe position on loss of air supply: DFC fails closed, DFO fails open.",
          specs: [
            "Signal 3 to 15 or 6 to 30 PSIG",
            "Nominal effective area 46 to 220 in²",
            "-40°F to 180°F service",
            "Handwheel & travel-stop options",
          ],
        },
      },
      {
        src: "/images/dynaflo/dfr-rotary-actuator.jpg",
        caption: "DFR rotary spring & diaphragm actuator",
        category: "Pneumatic Actuators",
        detail: {
          tag: "DFR · SIZES 026 to 220",
          description:
            "Large-diaphragm rotary actuator for low-pressure operation, using a spring for fail-safe positioning to automate quarter-turn valves for throttling or on/off control of liquids and gases.",
          specs: [
            "Signal 0 to 18 or 0 to 33 PSIG",
            "Valve shaft 1/2\" to 2\"",
            "Field-reversible action",
            "-40°F to 180°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/dflp-piston-actuator.jpg",
        caption: "DFLP linear pneumatic piston actuator",
        category: "Pneumatic Actuators",
        detail: {
          tag: "DFLP · HIGH THRUST",
          description:
            "High-force double-acting pneumatic piston actuator for linear valves. With a positioner or two-position signal it handles throttling or on/off control; a volume tank holds the fail position.",
          specs: [
            "Thrust up to ~16,940 lbf",
            "Min cylinder pressure 20 PSIG",
            "Valve stem 3/4\", 1\", 1-1/4\"",
            "-40°F to 180°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/dfrp-piston-actuator.jpg",
        caption: "DFRP rotary pneumatic piston actuator",
        category: "Pneumatic Actuators",
        detail: {
          tag: "DFRP · HIGH TORQUE",
          description:
            "High-torque double-acting pneumatic piston actuator for quarter-turn valves, providing throttling or on/off control with a volume tank to hold the fail-safe position.",
          specs: [
            "Torque up to ~65,000 lbf-in",
            "90° rotation, shaft 1/2\" to 2-1/2\"",
            "Min cylinder pressure 20 PSIG",
            "-40°F to 180°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/dfn-yokeless-actuator.jpg",
        caption: "DFN yokeless spring & diaphragm actuator",
        category: "Pneumatic Actuators",
        detail: {
          tag: "DFN · SIZES 069 / 156",
          description:
            "Bracket-mounted, direct-acting spring-and-diaphragm actuator that operates butterfly valves, chokes and louvers for throttling or on/off control without a conventional yoke.",
          specs: [
            "Signal 35 PSIG",
            "Bolt circle 2-7/8\" or 3-7/8\"",
            "Butterfly, choke & louver service",
            "-40°F to 180°F service",
          ],
        },
      },

      // Instrumentation
      {
        src: "/images/dynaflo/4000-pressure-controller.jpg",
        caption: "4000 Series local pressure controller",
        category: "Instrumentation",
        detail: {
          tag: "4000 / 4010 / 4020 / 4030",
          description:
            "Field-mounted pneumatic pressure controller offering proportional-only or proportional-plus-reset control, with field-reversible direct/reverse action and emission-compliant, NACE-ready construction.",
          specs: [
            "Output 3 to 15 or 6 to 30 PSIG",
            "Repeatability 0.5% of range",
            "Field-reversible direct/reverse",
            "Meets EPA emission standards",
          ],
        },
      },
      {
        src: "/images/dynaflo/5000-level-controller.jpg",
        caption: "5000 displacer liquid level controller",
        category: "Instrumentation",
        detail: {
          tag: "5000 / 5000E",
          description:
            "Displacer-type liquid level controller with an innovative relay manifold for easy maintenance; the displacer arm seal is serviceable without disturbing the vessel connection, with zero steady-state bleed.",
          specs: [
            "Max sensor pressure 3,750 PSIG",
            "Pneumatic (5000) or electric (5000E)",
            "Zero bleed in steady state",
            "-20°F to 400°F ambient",
          ],
        },
      },
      {
        src: "/images/dynaflo/ps2-positioner.jpg",
        caption: "Siemens PS2 digital valve positioner",
        category: "Instrumentation",
        detail: {
          tag: "SIEMENS PS2 · HART",
          description:
            "Digital electro-pneumatic valve positioner with on-board programming and a built-in LCD, HART-ready with optional Profibus and Foundation Fieldbus communication for linear or rotary valves.",
          specs: [
            "Input 4 to 20 mA, HART ready",
            "On-board LCD & auto-setup",
            "Linear or rotary mounting",
            "-40°F to 176°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/760-positioner.jpg",
        caption: "Model 760 pneumatic valve positioner",
        category: "Instrumentation",
        detail: {
          tag: "MODEL 760",
          description:
            "Rugged pneumatic valve positioner for linear or rotary control valves, with optional 4 to 20 mA feedback, internal limit switches, a high-flow Cv module and position-indicator windows.",
          specs: [
            "Input 3 to 15 / 6 to 30 PSIG or 4 to 20 mA",
            "Travel 1/2\" to 6\" or 90° rotary",
            "Optional feedback & limit switches",
            "-40°F to 185°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/pro-50-regulator.jpg",
        caption: "PRO-50 instrument supply regulator",
        category: "Instrumentation",
        detail: {
          tag: "PRO-50 / PRO-NR50",
          description:
            "Compact, lightweight supply regulator delivering clean, stable pressure to pneumatic and electro-pneumatic instrumentation, engineered for the accuracy and repeatability that digital instruments demand.",
          specs: [
            "Inlet up to 250 PSIG",
            "Outlet 0 to 35 / 0 to 60 / 0 to 125 PSIG",
            "NACE (MR0175) & non-relieving options",
            "-40°F to 300°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/t950xp-transducer.png",
        caption: "Control Air T950XP I/P transducer",
        category: "Instrumentation",
        detail: {
          tag: "T950XP I/P",
          description:
            "High-performance current-to-pressure (I/P) transducer for hazardous environments, converting a 4 to 20 mA electrical input into a stable pneumatic output to drive control valve actuators.",
          specs: [
            "Input 4 to 20 mA",
            "Output 0 to 18 / 0 to 20 / 0 to 33 / 0 to 35 PSIG",
            "FM / CSA / Natural Gas approved",
            "-40°F to 158°F service",
          ],
        },
      },
    ],
  },
  {
    slug: "est",
    no: "BRAND 03",
    name: "EST",
    origin: "Hatfield, Pennsylvania, USA · Heat exchanger services · Sole agent in Egypt",
    category: "Heat Exchanger Repair & Pressure Testing",
    seoTitle: "EST Curtiss-Wright Heat Exchanger Solutions in Egypt",
    seoHeading: "EST Group in Egypt",
    seoDescription:
      "ACTS is Egypt's sole agent for EST Group (Curtiss-Wright): Pop-A-Plug® tube plugging, Hydra-Loc® sleeving and GripTight® hydrostatic test and isolation plugs.",
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
        products: [
          {
            image: "/images/est/cpi-perma-plug.jpg",
            name: "Pop-A-Plug CPI / Perma tube plugs",
          },
          {
            image: "/images/est/p2-plug.jpg",
            name: "Pop-A-Plug P2 high-pressure tube plugs",
          },
          {
            image: "/images/est/tube-stabilizer.png",
            name: "Pop-A-Plug tube stabilizers",
          },
          {
            image: "/images/est/ram-package.png",
            name: "Pop-A-Plug hydraulic ram package",
          },
          {
            image: "/images/est/smart-ram-plus.jpg",
            name: "Smart Ram Plus installation system",
          },
          {
            image: "/images/est/smart-ram-640t.png",
            name: "Smart Ram 640T installation tool",
          },
          {
            image: "/images/est/manual-installation-tool.jpg",
            name: "Manual installation tool",
          },
          {
            image: "/images/est/removal-tool.png",
            name: "Pop-A-Plug removal tool",
          },
          {
            image: "/images/est/air-cooled-hx.png",
            name: "Air-cooled heat exchanger plugging",
          },
        ],
      },
      {
        tag: "GRIPTIGHT®",
        name: "Hydrostatic test & isolation plugs",
        description:
          "Pipe, pipeline and pressure vessel testing, rated up to 15,000 psig.",
        products: [
          {
            image: "/images/est/griptight-max.jpg",
            name: "GripTight MAX test plug",
          },
          {
            image: "/images/est/griptight-pe.png",
            name: "GripTight PE test plug",
          },
          {
            image: "/images/est/griptight-elbow.jpg",
            name: "GripTight elbow test plug",
          },
          {
            image: "/images/est/od-griptight.jpg",
            name: "OD GripTight test plug",
          },
          {
            image: "/images/est/high-lift-flange-weld.jpg",
            name: "High Lift flange weld test plug",
          },
          {
            image: "/images/est/socket-weld-sqs.jpg",
            name: "Socket Weld SQS test plug",
          },
          {
            image: "/images/est/griptight-reverse-pressure.png",
            name: "GripTight reverse-pressure test plug",
          },
          {
            image: "/images/est/griptight-isolation.jpg",
            name: "GripTight pipe isolation plug",
          },
          {
            image: "/images/est/double-block-bleed.jpg",
            name: "Double block & bleed isolation plug",
          },
        ],
      },
      {
        tag: "G-SERIES",
        name: "Tube testing tools",
        description: "Testing guns for locating and identifying leaking tubes.",
        products: [
          {
            image: "/images/est/g250-vacuum-tube-tester.png",
            name: "G-250 vacuum tube tester",
          },
          {
            image: "/images/est/g650-vacuum-joint-tester.png",
            name: "G-650 vacuum joint tester",
          },
        ],
      },
      {
        tag: "HYDRA-LOC®",
        name: "Tube stabilizers & sleeving",
        description:
          "Repair for fractured, severed, or damaged tube sections.",
        products: [
          {
            image: "/images/est/hydra-loc-sleeving.jpg",
            name: "Hydra-Loc tube sleeving system",
          },
        ],
      },
    ],
    externalUrl: "https://valves.curtisswright.com/en-us/EST",
    gridCols: 4,
    image: "/images/est-field-service.jpg",
    imageAlt: "Field service technician welding industrial pipework",
    logo: "/images/curtiss-wright-logo.png",
    bestSellers: ["Pop-A-Plug® P2", "GripTight MAX®", "GripTight® Isolation"],
    gallery: [
      // Heat exchanger tube plugging
      {
        src: "/images/est/cpi-perma-plug.jpg",
        caption: "Pop-A-Plug CPI / Perma tube plugs",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® CPI / PERMA",
          description:
            "Hydraulically installed mechanical tube plug that seals leaking heat exchanger and condenser tubes with a helium-leak-tight metal-to-metal seal, with no welding or explosives.",
          specs: [
            "Rated to 1,000 PsiG (68.9 BarG)",
            "Tube ID 0.472\" to 2.067\"",
            "Metal-to-metal helium-tight seal",
            "ASME PCC-2 recommended method",
          ],
        },
      },
      {
        src: "/images/est/p2-plug.jpg",
        caption: "Pop-A-Plug P2 high pressure tube plugs",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® P2",
          description:
            "High-pressure mechanical tube plug giving a permanent, weld-free seal for leaking heat exchanger tubes; a metallurgy-matched ring-and-pin design resists ejection and thermal-cycling leaks.",
          specs: [
            "Rated to 7,000 PsiG (483 BarG)",
            "Tube ID 0.400\" to 1.460\"",
            "Helium leak-tight, no welding",
            "ISO 9001 manufactured",
          ],
        },
      },
      {
        src: "/images/est/tube-stabilizer.png",
        caption: "Pop-A-Plug tube stabilizers",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® TUBE STABILIZER",
          description:
            "Rod- or cable-style stabilizer that anchors weakened or fractured heat exchanger tubes, preventing migration until retubing or sleeving can be performed.",
          specs: [
            "Rod or cable style",
            "Bullet or wedge tip options",
            "Installs with Pop-A-Plug ram packages",
            "Stainless steel construction",
          ],
        },
      },
      {
        src: "/images/est/hydra-loc-sleeving.jpg",
        caption: "Hydra-Loc tube sleeving system",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "HYDRA-LOC® TUBE SLEEVING",
          description:
            "Hydraulically expands a sleeve into intimate contact with a corroded or eroded tube end and locks it in place, recovering tube service without full retubing.",
          specs: [
            "Faster than roller expansion",
            "Conforms to actual tube contours",
            "Tightly controlled expansion pressure",
            "Repairs inlet-end tube damage",
          ],
        },
      },
      {
        src: "/images/est/ram-package.png",
        caption: "Pop-A-Plug hydraulic ram package",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® RAM PACKAGES",
          description:
            "Hydraulic ram packages that install Pop-A-Plug tube plugs quickly and safely, in standard and close-quarters configurations, with no welding required.",
          specs: [
            "Hydraulic, controlled installation",
            "Standard & close-quarters models",
            "Covers CPI/Perma & P2 plug ranges",
            "No welding required",
          ],
        },
      },
      {
        src: "/images/est/smart-ram-640t.png",
        caption: "Smart Ram 640T installation tool",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "SMART RAM 640T",
          description:
            "Cordless, battery-operated Pop-A-Plug installation tool with a self-contained hydraulic unit and LCD, ideal for remote or confined spaces without shop air or electric.",
          specs: [
            "18v / 3.0Ah Li-Ion battery",
            "Up to 1,000 plugs per charge",
            "Weighs just 5 lbs (2.3 kg)",
            "LCD with multi-user presets",
          ],
        },
      },
      {
        src: "/images/est/smart-ram-plus.jpg",
        caption: "Smart Ram Plus installation system",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "SMART RAM PLUS",
          description:
            "Real-time Pop-A-Plug installation system that records and monitors every tube plug installation through a rugged tablet, for full documentation and quality assurance.",
          specs: [
            "Real-time installation monitoring",
            "Rugged tablet interface",
            "Documented, repeatable installs",
            "Cordless field operation",
          ],
        },
      },
      {
        src: "/images/est/manual-installation-tool.jpg",
        caption: "Pop-A-Plug manual installation tool",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® MANUAL TOOL",
          description:
            "Reliable manual installation tool for Pop-A-Plug tube plugs where air or electricity is unavailable; a locating pin acts as a reaction arm during tightening.",
          specs: [
            "No air or electricity needed",
            "Accepts all MIT pull rods",
            "Tube ID 0.400\" to 1.160\"",
            "Zinc-plated carbon steel",
          ],
        },
      },
      {
        src: "/images/est/removal-tool.png",
        caption: "Pop-A-Plug removal tool",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® REMOVAL TOOL",
          description:
            "Dual-function removal tool: a nose piece threads into the plug pin while a serrated spear grabs the ring, and an integral slide hammer pulls both out in one operation.",
          specs: [
            "Removes CPI/Perma & P2 plugs",
            "Integral slide hammer",
            "Plug sizes 0.400\" to 1.180\"",
            "Extensions available to 6 ft",
          ],
        },
      },
      {
        src: "/images/est/air-cooled-hx.png",
        caption: "Air-cooled heat exchanger plugging system",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® ACHE SYSTEM",
          description:
            "Extended-reach Pop-A-Plug tooling engineered to test and plug air-cooled heat exchanger (Fin-Fan®) tubes at depth through the narrow plug-sheet entry, without welding.",
          specs: [
            "ASME PCC-2 compliant",
            "Installs in under 15 seconds",
            "Reaches at depth in header boxes",
            "No hammering or welding",
          ],
        },
      },

      // Tube & joint leak testing
      {
        src: "/images/est/g250-vacuum-tube-tester.png",
        caption: "G-250 vacuum tube tester",
        category: "Tube & Joint Leak Testing",
        detail: {
          tag: "G-250 VACUUM TUBE TESTER",
          description:
            "Lightweight aluminum tool that quickly seals off and evacuates individual heat exchanger tubes to locate pinhole leaks; a loss of vacuum indicates a leaking tube.",
          specs: [
            "Tube range 0.28\" to 1.45\"",
            "Weighs under 2.1 lbs (1.1 kg)",
            "Uses 40 to 125 PsiG plant air",
            "Analog or digital gauge",
          ],
        },
      },
      {
        src: "/images/est/g650-vacuum-joint-tester.png",
        caption: "G-650 vacuum joint tester",
        category: "Tube & Joint Leak Testing",
        detail: {
          tag: "G-650 VACUUM JOINT TESTER",
          description:
            "Seals the tube ID and tubesheet face, then evacuates the joint to quickly identify leaking tube-to-tubesheet joints, ideal for manufacturers and retubing operations.",
          specs: [
            "Tube OD 3/8\" to 1¼\" (G-650A to 2½\")",
            "Weighs under 2.7 lbs (1.2 kg)",
            "Uses 40 to 125 PsiG plant air",
            "Interchangeable manifolds",
          ],
        },
      },

      // Hydrostatic test & isolation plugs
      {
        src: "/images/est/griptight-max.jpg",
        caption: "GripTight MAX test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT MAX® TEST PLUG",
          description:
            "High-pressure test plug with a patented dual-serrated gripper and hardened shaft, grippers and cone, effective for hardened and high-alloy pipe up to HRC 32.",
          specs: [
            "Test pressure to 15,000 PsiG (1,034 BarG)",
            "Size 3/8\" to 48\" NPS (DN10 to DN1200)",
            "Hardened, reusable design",
            "Hydrostatic or pneumatic testing",
          ],
        },
      },
      {
        src: "/images/est/griptight-elbow.jpg",
        caption: "GripTight elbow test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT® ELBOW TEST PLUG",
          description:
            "Orientation-free test plug for long-radius elbows, using patented dual-serrated GripTight MAX grippers and a self-aligning gripper and seal for pipe spools ending in elbows.",
          specs: [
            "Test pressure to 3,350 PsiG (231 BarG)",
            "Size 2\" to 48\" NPS (DN50 to DN1200)",
            "Orientation-independent install",
            "Fits most long-radius elbows",
          ],
        },
      },
      {
        src: "/images/est/griptight-pe.png",
        caption: "GripTight PE test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT® PE TEST PLUG",
          description:
            "Slip-in test plug for polyethylene (LDPE/MDPE/HDPE) pipe that hand-tightens and uses test pressure to energize the seal and gripper for a fast, safe, leak-tight seal.",
          specs: [
            "Working pressure to 375 PsiG (25.8 BarG)",
            "Sizes 2\", 3\", 4\", 6\" & 8\"",
            "Tests pipe on reels or in trench",
            "Aluminum / steel construction",
          ],
        },
      },
      {
        src: "/images/est/high-lift-flange-weld.jpg",
        caption: "High Lift flange weld test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "HIGH LIFT FLANGE WELD TEST PLUG",
          description:
            "A 4-in-1 tool that acts as a purge dam, weld fixture, test plug and weld-isolation plug, letting you monitor upstream, purge, weld and hydro-test a flange joint with one tool.",
          specs: [
            "Test pressure to 2,250 PsiG (155 BarG)",
            "Size 3/4\" to 24\" NPS (DN20 to DN600)",
            "Ported shaft for upstream monitoring",
            "Isolates only the weld area",
          ],
        },
      },
      {
        src: "/images/est/od-griptight.jpg",
        caption: "OD GripTight test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "OD GRIPTIGHT® TEST PLUG",
          description:
            "Seals on the pipe outside diameter to test open or plain-end pipe and tube; a patented self-gripping, self-sealing dual-seal design gives fast, safe hydrotesting.",
          specs: [
            "Test pressure to 5,000 PsiG (345 BarG)",
            "Size 1/4\" to 4\" (DN8 to DN100)",
            "Seals on the pipe OD",
            "One plug fits a range of schedules",
          ],
        },
      },
      {
        src: "/images/est/socket-weld-sqs.jpg",
        caption: "Socket Weld SQS test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "SOCKET WELD SQS TEST PLUG",
          description:
            "Twin-cone test plug that seals 3,000 lb socket-weld fittings and couplings, eliminating the need to weld in pipe stubs, pups or end caps for pressure testing.",
          specs: [
            "Test pressure to 5,000 PsiG (345 BarG)",
            "Size 1/2\" to 2\" NPS (DN15 to DN50)",
            "Twin-cone uniform gripper expansion",
            "Replaceable grippers & seals",
          ],
        },
      },
      {
        src: "/images/est/griptight-reverse-pressure.png",
        caption: "GripTight reverse pressure test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT® REVERSE PRESSURE PLUG",
          description:
            "Subjects a flange-to-pipe weld to full radial, hoop and axial stresses during hydrostatic testing, equivalent to blinding and pressurizing the entire piping system.",
          specs: [
            "Test pressure to 2,250 PsiG (155 BarG)",
            "Size 2\" to 48\" NPS (DN50 to DN1200)",
            "ASME PCC-2 Type I device",
            "Optional plug-movement indicator",
          ],
        },
      },
      {
        src: "/images/est/griptight-isolation.jpg",
        caption: "GripTight pipe isolation plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT® ISOLATION PLUG",
          description:
            "Dual-port isolation plug that creates a positive-pressure barrier between two seals, safely isolating hot work from residual upstream gases while monitoring for explosive vapors.",
          specs: [
            "Between-seals to 2,250 PsiG (155 BarG)",
            "Size 3/4\" to 48\" NPS (DN20 to DN1200)",
            "ASME PCC-2 Type IV device",
            "Monitors vapors during hot work",
          ],
        },
      },
      {
        src: "/images/est/double-block-bleed.jpg",
        caption: "Double block and bleed isolation plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "DOUBLE BLOCK & BLEED PLUG",
          description:
            "Double block-and-bleed isolation and test plug that isolates and monitors potentially explosive vapors during hot work using minimal water, testable with a simple hand pump.",
          specs: [
            "Between-seals to 2,250 PsiG (155 BarG)",
            "Size 3/4\" to 48\" NPS (DN20 to DN1200)",
            "ASME PCC-2 Type IV device",
            "Multi-schedule, minimal-media testing",
          ],
        },
      },
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

/** Stable in-page anchor for one product line on its brand page, derived from
 *  the line's `tag` so the id never has to be hand-maintained alongside it.
 *  Used both by the brand page (which renders the id) and by any page linking
 *  in — see the Industries page's "relevant product lines". */
export function productLineAnchorId(line: ProductLine): string {
  const source = line.tag ?? line.name;
  return `line-${source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

/** Resolves a brand slug + product-line tag to the line itself. Returns
 *  undefined for an unknown pair rather than throwing, so a stale reference
 *  degrades to "no link" instead of breaking the page — `npm run check:links`
 *  (scripts/check-product-links.mjs) fails the build on any such reference. */
export function getProductLine(
  brandSlug: string,
  tag: string
): ProductLine | undefined {
  return getBrand(brandSlug)?.productLines.find((p) => p.tag === tag);
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

/** Maps a `Brand["sectors"]` entry to the `Industry["slug"]` it belongs to,
 *  so sector pills (Farris's hero, brand cards) can link straight to that
 *  industry's tab on /industries instead of sitting as inert text. There is
 *  no /industries/[slug] route — every industry lives on one page behind a
 *  client-side <Tabs> switcher (components/Tabs.tsx) — so the link opens
 *  the right tab via `?sector=`, which the page reads server-side and hands
 *  to <Tabs initialId>. "Refining" has no tab of its own — it's a process
 *  stage inside Oil & Gas (see that industry's tagline) — so it resolves
 *  there too. */
const sectorIndustrySlug: Record<string, string> = {
  "Oil & Gas": "oil-gas",
  Refining: "oil-gas",
  Petrochemical: "petrochemical",
  "Power Generation": "power-generation",
  "Water Treatment": "water-treatment",
  Fertilizers: "fertilizers",
  "General Industrial": "general-industrial",
};

export function sectorHref(sector: string): string {
  const slug = sectorIndustrySlug[sector];
  return slug ? `/industries?sector=${slug}#explore-industries` : "/industries";
}

export const pastManufacturers = [
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
    unit: "Farris agency",
    body: "ACTS is founded in Sixth of October City, Giza, under Commercial Registration No. 58261, and is appointed sole agent in Egypt for Farris Engineering.",
    now: false,
  },
  {
    year: "Expansion",
    unit: "Nasr City",
    body: "A second branch opens in Nasr City, Cairo, extending our reach across Greater Cairo.",
    now: false,
  },
  {
    year: "Post-2011",
    unit: "Rebuild",
    body: "ACTS rebuilds and grows through the economic disruption that followed the Egyptian revolution, delivering valve installations across major facilities and emerging with a stronger, more resilient customer base.",
    now: false,
  },
  {
    year: "2016",
    unit: "$4M / year",
    body: "ACTS reincorporates as a Limited Liability Company (Reg. No. 94859) and restructures the business for scale, reaching USD 4 million in annual sales.",
    now: false,
  },
  {
    year: "2019",
    unit: "Transformation",
    body: "A company-wide transformation modernizes operations and strengthens service delivery.",
    now: false,
  },
  {
    year: "2022",
    unit: "Dyna-Flo agency",
    body: "ACTS is appointed sole agent in Egypt for Dyna-Flo Control Valve Services, expanding our capabilities into control valves, actuators, and instrumentation.",
    now: false,
  },
  {
    year: "2025",
    unit: "Arkan Plaza",
    body: "Headquarters relocate to Arkan Plaza, Sheikh Zayed City, a larger and more accessible base reflecting our continued growth.",
    now: false,
  },
  {
    year: "2026",
    unit: "EST agency",
    body: "ACTS is appointed sole agent in Egypt for EST, extending our scope into heat exchanger repair, tube plugging, and pressure testing, and completing the current three-brand portfolio.",
    now: true,
  },
];

export const mission = [
  {
    num: "01",
    title: "The first call",
    description:
      "Be the partner customers call first, because we answer fast and get the application right the first time.",
  },
  {
    num: "02",
    title: "Embedded partner",
    description:
      "Grow from trusted supplier to embedded technical partner on our customers' critical projects.",
  },
  {
    num: "03",
    title: "Standards into savings",
    description:
      "Translate the engineering standards of Farris, Dyna-Flo, and EST into real cost and reliability gains for Egyptian operators.",
  },
  {
    num: "04",
    title: "Smarter plants",
    description:
      "Bring predictive maintenance, digital diagnostics, and connected instrumentation into more of our customers' plants.",
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
      "Actively tracking predictive maintenance, digital diagnostics, and connected instrumentation to bring forward to our customers.",
  },
  {
    name: "Efficiency",
    description:
      "Streamlined quotation-to-delivery workflow, minimizing delays on critical parts.",
  },
];

/** Where ACTS is taking its offer next. Deliberately written as direction of
 *  travel rather than as shipping capability: these are commitments the sales
 *  team can stand behind today, not products with a price list. */
export const forwardDirection = [
  {
    title: "Smart instrumentation & digital positioners",
    description:
      "Expanding our offering of HART-ready, digitally diagnosable positioners and transducers that give operators real-time visibility into valve health.",
  },
  {
    title: "Predictive maintenance & condition monitoring",
    description:
      "Moving from reactive repairs to data-driven maintenance planning, so customers can anticipate failures before they cause downtime.",
  },
  {
    title: "Remote diagnostics & IIoT integration",
    description:
      "Supporting the shift toward Industrial Internet of Things connectivity, so critical valves and instrumentation can be monitored and managed as part of a connected plant.",
  },
  {
    title: "Digital asset documentation",
    description:
      "Building toward digital record-keeping for valve history, testing, and re-certification, making compliance and audits faster and more transparent.",
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
  { day: "Sunday to Thursday", hours: "9:00 AM to 5:00 PM (Cairo Time)" },
  { day: "Friday and Saturday", hours: "Closed" },
];

/** One "how we support this sector" capability, optionally credited to the
 *  brand whose product line delivers it — rendered as a link through to
 *  that brand's page so the claim is backed by an actual product to browse.
 *  Left unset for ACTS's own services (consultancy, sizing support, etc.)
 *  that aren't tied to a single manufacturer. */
export type IndustrySupportItem = {
  text: string;
  /** A Brand["slug"] (e.g. "farris-engineering"). */
  brandSlug?: string;
};

/** A single product-line reference: a brand plus one of its `ProductLine["tag"]`
 *  values. Resolves through `getProductLine()` to a real line and links to
 *  its card on the brand page — see IndustryProductLines for why lines are
 *  addressed by tag rather than retyped as free text. */
export type ProductRef = {
  /** A Brand["slug"] (e.g. "farris-engineering"). */
  brandSlug: string;
  /** A ProductLine["tag"] on that brand, exactly as written there. */
  lineTag: string;
};

/** One process area within an industry — e.g. "Upstream" within Oil & Gas —
 *  broken out as its own engineering case rather than a one-line bullet:
 *  the problem this area presents, the specific ACTS product/mechanism that
 *  addresses it, why that approach is the right one (not just "we have a
 *  valve for that"), and the product line(s) that back the claim. */
export type ApplicationArea = {
  /** Short area name, e.g. "Upstream". Doubles as the card heading. */
  area: string;
  /** The original one-line scope (e.g. "wellhead flow control, separation
   *  vessels..."), kept as a quick-scan lede above the detail below. */
  scope: string;
  /** The engineering problem this area presents — why it's hard, not just
   *  what it is. */
  challenge: string;
  /** How ACTS's product(s) address it — the mechanism, named specifically
   *  enough to tie to the linked product line(s) below. */
  solution: string;
  /** Why this is the right choice — the differentiator, not a restatement
   *  of the solution. */
  advantage: string;
  /** Always non-empty: every application area links to at least one real
   *  product line, enforced by check:links. */
  products: ProductRef[];
};

/** The specific product lines a brand offers into this industry, grouped per
 *  brand so the brand links once and its lines list underneath it.
 *
 *  Lines are referenced by their `ProductLine["tag"]` rather than retyped as
 *  free text: the tag is the line's identity on the brand page, so every
 *  reference here resolves to a real, linkable card (and one line covering
 *  several series — e.g. Dyna-Flo's "360 / 390 / 350 / 370 / 380 / DF2000" —
 *  is named once instead of duplicated per series). */
export type IndustryProductLines = {
  /** A Brand["slug"] (e.g. "farris-engineering"). */
  brandSlug: string;
  /** Every line this brand offers into the industry, each carrying its own
   *  role note — not just "this line exists," but what it specifically does
   *  *in this industry*. The generic ProductLine.description already covers
   *  what the line is; this covers why it's named here. */
  lines: { tag: string; note: string }[];
};

/** Which of the two kinds of picture a sector's artwork is, which decides how
 *  <SectorPanel> renders it: a photograph fills the panel edge to edge under
 *  the navy gradient, while an emblem (square line-art/3D icon) is held
 *  object-contain on cream, because object-cover in a column that tall would
 *  crop it to a vertical slice of itself. Defaults to "photo" when omitted.
 *  Both kinds are produced by scripts/normalize-sector-images.mjs. */
export type SectorArtwork = "photo" | "emblem";

/** Intrinsic pixel size of a sector photograph, so <SectorPanel> can reserve
 *  the exact box the file will occupy. The panel renders a photo at its own
 *  proportions rather than cropping it to the column (see the component), so
 *  without this the reserved box would be a guessed ratio and the card would
 *  visibly resize the moment the image decoded. Emblems don't need it: they
 *  are all square, which the component already assumes. */
export type SectorImageSize = { width: number; height: number };

export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  applications: ApplicationArea[];
  howWeSupport: IndustrySupportItem[];
  productLines: IndustryProductLines[];
  image: string;
  imageAlt: string;
  artwork?: SectorArtwork;
  /** Required for `artwork: "photo"`; see SectorImageSize. */
  imageSize?: SectorImageSize;
};

export const industries: Industry[] = [
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    tagline: "Upstream • Midstream • Refining • Petrochemicals",
    intro:
      "The Oil & Gas sector demands absolute reliability, safety, and compliance. From wellhead to refinery, we provide critical equipment that protects personnel, assets, and the environment.",
    applications: [
      {
        area: "Upstream",
        scope:
          "wellhead flow control, separation vessels, gas compression, and pipeline protection",
        challenge:
          "Wellhead and separator pressures swing hard and fast as a well is choked, tested, or shut in, and equipment sized only for steady-state conditions can be overwhelmed in seconds during an upset.",
        solution:
          "Farris Series 1890 direct-spring relief valves protect separators and gathering lines at their exact set pressure with no external power required, while Dyna-Flo's sliding-stem control valves hold flow steady through choke manifolds and gas-compression trains.",
        advantage:
          "A direct-spring valve responds in milliseconds with nothing to fail: no signal, no actuator, no power supply. That is exactly what a remote wellhead with no control room needs.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
        ],
      },
      {
        area: "Midstream",
        scope:
          "pipeline regulation, pump station control, and storage terminal overpressure protection",
        challenge:
          "A pipeline or storage terminal spans huge distances while holding pressure inside a tight band the entire way, so a single overpressure event at a pump station or tank farm risks a spill, not just downtime.",
        solution:
          "Dyna-Flo rotary valves throttle and isolate flow at pump stations and block-valve sites, while Farris Series 2600/2700 flanged relief valves protect storage tanks and pipeline sections rated for air, steam, and water service.",
        advantage:
          "ASME/NB-certified, flanged construction drops straight into existing pipeline spec with no special adaptation, and rotary trim gives high flow capacity with tight shutoff in one compact body.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 2600 / 2700" },
        ],
      },
      {
        area: "Refining",
        scope:
          "process unit isolation, fractionation column control, fired heater protection, and catalyst handling",
        challenge:
          "A refinery runs dozens of interconnected units around the clock; a relief or isolation failure on one column or fired heater can cascade into a unit-wide shutdown, or worse.",
        solution:
          "Farris Series 3800 pilot-operated valves protect fractionation columns and fired heaters where large relief capacity and tight operating margins matter, backed by iNSURE® wireless monitoring so engineers can check valve condition without shutting the unit down to inspect it.",
        advantage:
          "Pilot-operated design gives a higher opening ratio than a direct-spring valve of the same size, so the column can run closer to its relief set point without nuisance lifting, meaning tighter, more efficient operation.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 3800" },
          { brandSlug: "farris-engineering", lineTag: "SIZEMASTER™ · INSURE® · FAST NETWORK" },
        ],
      },
      {
        area: "Petrochemical",
        scope:
          "reactor feed control, steam cracking, polymerization, and specialty chemical production",
        challenge:
          "Reactor feed and cracking-furnace control both demand precise, repeatable positioning under high pressure drop and often erosive or fouling media. A valve that sticks or wears prematurely here stops production.",
        solution:
          "Dyna-Flo's DFC/DFO and DFR pneumatic actuators pair with severe-service trim to hold accurate position under high delta-P, while EST's Pop-A-Plug keeps the reactor's heat exchangers sealed between turnarounds.",
        advantage:
          "A spring-and-diaphragm actuator fails to a known, safe position the instant instrument air is lost, so the reactor defaults to safe, not to wherever the valve happened to be.",
        products: [
          {
            brandSlug: "dyna-flo",
            lineTag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
          },
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
        ],
      },
    ],
    howWeSupport: [
      {
        text: "Safety relief valves for overpressure protection, sized for two-phase flow, thermal expansion, and fire-case scenarios",
        brandSlug: "farris-engineering",
      },
      {
        text: "Precision control valves for severe-service applications, including high-pressure drop, erosive media, and high-temperature conditions",
        brandSlug: "dyna-flo",
      },
      {
        text: "Heat exchanger maintenance and retubing to restore thermal efficiency and extend asset life during turnarounds",
        brandSlug: "est",
      },
      {
        text: "Pressure testing and pipeline isolation for commissioning, maintenance, and integrity verification",
        brandSlug: "est",
      },
      { text: "API 526/527 compliance verification and re-certification support" },
    ],
    // Oil & Gas spans every stage each brand builds for — upstream through
    // refining — so unlike the narrower sectors below, its line-up is close
    // to each brand's full catalog rather than a curated subset.
    productLines: [
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 1890",
            note: "The everyday relief valve across the value chain: separators, gathering lines, and utility systems where a proven, ASME Section VIII-rated direct-spring design is all the duty calls for.",
          },
          {
            tag: "SERIES 2600 / 2700",
            note: "Flanged relief protection for storage tanks and pipeline sections, dropping straight into existing ASME/NB-certified pipeline spec with no special adaptation.",
          },
          {
            tag: "SERIES 2850",
            note: "A compact threaded option for smaller-bore relief duty on wellsite and gathering-system piping, where a full flanged body isn't justified.",
          },
          {
            tag: "SERIES 3800",
            note: "The pilot-operated line for refinery columns and high-capacity gas relief, where large capacity and a tight operating margin matter more than simplicity.",
          },
          {
            tag: "SERIES 6400 / 6600",
            note: "Boiler safety valves for the package boilers refineries and gas plants run for process steam. A dedicated steam design, not a general valve pressed into steam service.",
          },
          {
            tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
            note: "Sizing software and iNSURE® wireless monitoring keep every relief valve across a facility correctly sized and its condition visible between turnarounds.",
          },
        ],
      },
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "360 / 390 / 350 / 370 / 380 / DF2000",
            note: "Sliding-stem control across wellhead chokes, gas-compression trains, and refinery process units. The workhorse control valve for this entire industry.",
          },
          {
            tag: "SERIES 570 / 590",
            note: "Rotary ball and segmented valves for pump-station throttling and pipeline block-valve duty, giving high flow capacity with tight shutoff in one compact body.",
          },
          {
            tag: "DF100 / DF234 / DF270",
            note: "Compact integral valve-and-actuator units built for upstream dump-valve service, where separator and slug-catcher discharge needs a fast, self-contained response.",
          },
          {
            tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
            note: "Fail-safe pneumatic actuation for every control and shutdown valve across the facility, driving to a known safe position the instant instrument air is lost.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "The instrumentation layer behind every control loop: pressure and level controllers, positioners, and I/P transducers keeping valves on setpoint.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Weld-free tube plugging that keeps refinery and gas-plant heat exchangers sealed between turnarounds, without a shutdown to fix a single leaking tube.",
          },
          {
            tag: "GRIPTIGHT®",
            note: "Hydrostatic test and isolation plugs for commissioning new pipeline sections and pressure-testing vessels without welding in temporary test spools.",
          },
          {
            tag: "G-SERIES",
            note: "Vacuum tube and joint testers that locate a leaking heat-exchanger tube before it's found the hard way, during scheduled inspection rather than an unplanned trip.",
          },
          {
            tag: "HYDRA-LOC®",
            note: "Hydraulic tube sleeving that recovers a corroded or eroded exchanger tube's actual service life instead of forcing a full retube.",
          },
        ],
      },
    ],
    image: "/images/sectors/oil-gas.jpg",
    imageAlt: "Pumpjack in an oil field with refinery distillation columns behind it",
    imageSize: { width: 1600, height: 900 },
  },
  {
    slug: "petrochemical",
    name: "Petrochemical",
    tagline: "Chemical Processing • Polymers • Specialty Chemicals",
    intro:
      "Petrochemical facilities operate under extreme conditions: high pressures, high temperatures, corrosive media, and continuous operation. Our solutions are engineered to withstand these environments and keep the process stable and safe.",
    applications: [
      {
        area: "Olefins production",
        scope: "ethylene and propylene: cracking furnace control, quench tower protection",
        challenge:
          "Cracking furnaces run at extreme temperature with feed and dilution-steam ratios that have to track tightly. Drift for even a few minutes changes product yield and can coke the tubes.",
        solution:
          "Dyna-Flo sliding-stem control valves regulate furnace feed and dilution steam with trim built for the pressure drop across quench and transfer-line systems, while Farris Series 3800 pilot-operated valves protect the quench tower and downstream vessels against the large vapor volumes a furnace trip releases.",
        advantage:
          "Pilot-operated relief sized for large-capacity gas service keeps the quench system protected even in a full furnace-trip scenario, not just routine upsets.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 3800" },
        ],
      },
      {
        area: "Aromatics production",
        scope: "extraction, distillation, hydrotreating",
        challenge:
          "Extraction and distillation columns run continuously with corrosive solvents and hydrotreating streams that attack standard valve trim and heat-exchanger tubes over time.",
        solution:
          "Dyna-Flo rotary valves in severe-service trim resist erosive and corrosive media in the extraction and distillation columns, while EST's G-Series tube testers and Hydra-Loc sleeving keep the associated heat exchangers leak-tight between inspection intervals.",
        advantage:
          "Hydraulic tube sleeving conforms to the tube's actual corrosion or erosion contour rather than applying a generic patch, recovering service life without a full retube.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "est", lineTag: "G-SERIES" },
          { brandSlug: "est", lineTag: "HYDRA-LOC®" },
        ],
      },
      {
        area: "Polymers",
        scope:
          "polyethylene, polypropylene, and PVC: reactor feed control, extruder pressure regulation",
        challenge:
          "Reactor feed and extruder pressure both need fine, stable control, because polymer consistency depends on it, while the media itself is often abrasive or prone to fouling valve trim.",
        solution:
          "Dyna-Flo's integral actuator valves give a compact, fast-responding dump-valve solution for reactor feed and discharge, engineered for tight shutoff on space-constrained skids.",
        advantage:
          "An integral valve-and-actuator assembly means one less flange, one less potential leak path, and a faster response than a separately mounted actuator, exactly what a fast reactor cycle needs.",
        products: [{ brandSlug: "dyna-flo", lineTag: "DF100 / DF234 / DF270" }],
      },
    ],
    howWeSupport: [
      {
        text: "Control valves with anti-cavitation and noise-attenuation trims for high delta-P services",
        brandSlug: "dyna-flo",
      },
      {
        text: "Safety relief valves for critical process protection, including pilot-operated designs for large-capacity gas service",
        brandSlug: "farris-engineering",
      },
      {
        text: "Heat exchanger tube inspection (IRIS/Eddy Current) and maintenance to prevent unplanned downtime",
        brandSlug: "est",
      },
      { text: "Valve condition monitoring and diagnostics for predictive maintenance programs" },
      { text: "Sizing, selection, and engineering support for new projects and plant expansions" },
    ],
    productLines: [
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 2600 / 2700",
            note: "Flanged relief protection for reactor and column overpressure scenarios, ASME/NB-certified for the air, steam, and water utility systems every petrochemical plant runs alongside its core process.",
          },
          {
            tag: "SERIES 2850",
            note: "A compact spring-loaded option for smaller relief duty on utility and auxiliary process lines throughout the plant.",
          },
          {
            tag: "SERIES 3800",
            note: "Pilot-operated relief for large-capacity gas service on cracking furnaces and quench systems, where a furnace trip can release a genuinely large vapor volume in seconds.",
          },
          {
            tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
            note: "Sizing software that gets a relief valve's capacity right the first time on a new reactor train or plant expansion, instead of a field retrofit later.",
          },
        ],
      },
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "360 / 390 / 350 / 370 / 380 / DF2000",
            note: "Sliding-stem control valves regulating reactor feed and cracking-furnace fuel/steam ratios, where drift of even a few minutes changes product yield.",
          },
          {
            tag: "SERIES 570 / 590",
            note: "Rotary valves for extraction and distillation column throttling and isolation, in trim built for corrosive solvent and hydrotreating service.",
          },
          {
            tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
            note: "Spring-return pneumatic actuators that drive reactor and cracking-furnace control valves to a fail-safe position the moment air supply is lost. Non-negotiable on a continuous chemical process.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "Instrumentation and positioners holding fine control on reactor feed and extruder pressure loops, where polymer consistency depends on stable, repeatable positioning.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Seals leaking heat-exchanger tubes across the plant's reactor coolers and utility exchangers without a process shutdown.",
          },
          {
            tag: "HYDRA-LOC®",
            note: "Sleeving that repairs corrosion damage from aggressive extraction and distillation solvents at the tube level, recovering service life without a full retube.",
          },
          {
            tag: "GRIPTIGHT®",
            note: "Test plugs that pressure-verify new or repaired piping without welding in temporary spools, a meaningful advantage on lines that have carried corrosive or hazardous media.",
          },
          {
            tag: "G-SERIES",
            note: "Vacuum tube testers for the inspection work that finds a failing exchanger tube before a hydrotreating or distillation upset does.",
          },
        ],
      },
    ],
    image: "/images/sectors/petrochemicals.jpg",
    imageAlt: "Petrochemical plant lit at dusk, distillation columns and stacks against an orange sky",
    imageSize: { width: 1264, height: 843 },
  },
  {
    slug: "power-generation",
    name: "Power Generation",
    tagline: "Fossil Fuel • Combined Cycle • Cogeneration",
    intro:
      "Power generation plants require equipment that delivers precise control, absolute safety, and long-term reliability.",
    applications: [
      {
        area: "Steam generation",
        scope:
          "boiler feedwater control, steam pressure regulation, and safety relief for drums and superheaters",
        challenge:
          "A boiler drum and superheater sit at the sharpest end of the plant's safety case. An overpressure event here is the scenario every other safeguard exists to prevent, and it has to be caught in the first second, not the tenth.",
        solution:
          "Farris Series 6400/6600 flanged steam safety valves protect boiler drums and superheaters to their exact ASME set pressure, Series 1890 covers auxiliary steam, and Dyna-Flo control valves hold feedwater and desuperheating spray on target.",
        advantage:
          "These are steam-specific safety-valve designs, not general-purpose relief valves adapted for steam. The seat, disc, and spring are engineered around steam's compressibility and flashing behavior at the set pressure that actually matters.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 6400 / 6600" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
        ],
      },
      {
        area: "Gas turbines",
        scope: "fuel gas control, inlet air filtration, and emergency shutdown systems",
        challenge:
          "Fuel gas skids need control valves that respond fast and fail safe. A turbine trip sequence gives the shutdown valve a fraction of a second to close, every time, with zero tolerance for a sticky actuator.",
        solution:
          "Dyna-Flo's fail-closed (DFC) and fail-open (DFO) large-diaphragm actuators drive fuel-gas isolation and control valves to a guaranteed fail-safe position on loss of signal or air supply.",
        advantage:
          "A spring-return actuator needs no solenoid, battery, or working control signal to reach its safe position. The spring alone gets it there, which is the entire point of an emergency shutdown valve.",
        products: [
          {
            brandSlug: "dyna-flo",
            lineTag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
          },
        ],
      },
      {
        area: "Combined cycle",
        scope: "HRSG control, duct burner regulation, and condensate management",
        challenge:
          "A heat recovery steam generator (HRSG) has to track a gas turbine's constantly changing exhaust temperature and flow, so its control valves cycle far more often than a conventional boiler's ever would.",
        solution:
          "Dyna-Flo instrumentation, from 4000 Series pressure controllers to PS2 digital positioners, keeps HRSG and duct-burner control valves tracking setpoint through continuous load changes, with HART-ready positioners for remote diagnostics.",
        advantage:
          "A digital positioner with on-board diagnostics flags a sticking valve or actuator problem before it causes a trip, not after. That is the difference between a scheduled adjustment and an unplanned outage.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760" },
        ],
      },
      {
        area: "Cooling systems",
        scope:
          "circulating water control, condenser tube maintenance, and cooling tower isolation",
        challenge:
          "Condenser tubes see constant flow and biological fouling; a leaking tube dilutes vacuum and cuts turbine efficiency long before it's bad enough to force a shutdown to fix.",
        solution:
          "EST Pop-A-Plug seals a leaking condenser tube in minutes without draining or opening the waterbox, and Dyna-Flo rotary valves isolate cooling-tower and circulating-water lines for maintenance.",
        advantage:
          "A hydraulically installed mechanical plug is a same-shift fix, so the unit stays online at full or near-full load instead of waiting for the next planned outage to pull the tube bundle.",
        products: [
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
        ],
      },
      {
        area: "Balance of plant",
        scope: "compressed air systems, auxiliary steam, and fuel handling",
        challenge:
          "Balance-of-plant systems are numerous and varied, covering compressed air, auxiliary steam, and fuel handling, and each needs relief and control equipment correctly sized, not a one-size-fits-all valve pulled off a shelf.",
        solution:
          "Farris Series 1890 and 2850 cover the general air, steam, and liquid relief duty across these systems, sized with Farris' own SIZEMASTER™ software instead of rule-of-thumb selection.",
        advantage:
          "Purpose-sized relief avoids both failure modes of a guessed valve: undersized, which doesn't protect, or oversized, which chatters and wears out early. SIZEMASTER™ removes the guesswork.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 2850" },
          { brandSlug: "farris-engineering", lineTag: "SIZEMASTER™ · INSURE® · FAST NETWORK" },
        ],
      },
    ],
    howWeSupport: [
      {
        text: "Safety relief valves for boiler drum protection, steam line protection, and turbine bypass systems",
        brandSlug: "farris-engineering",
      },
      {
        text: "Control valves for feedwater regulation, desuperheating, and fuel gas control",
        brandSlug: "dyna-flo",
      },
      {
        text: "Heat exchanger and condenser tube maintenance, including cleaning, plugging, and retubing",
        brandSlug: "est",
      },
      {
        text: "Pipeline and pressure vessel pressure testing for hydrostatic testing",
        brandSlug: "est",
      },
      { text: "Retrofit and modernization recommendations to improve plant efficiency" },
    ],
    productLines: [
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 1890",
            note: "General relief duty across balance-of-plant systems such as compressed air, auxiliary steam, and fuel handling, sized for whichever utility circuit needs it.",
          },
          {
            tag: "SERIES 2600 / 2700",
            note: "Flanged relief for feedwater and auxiliary steam systems, ASME/NB-certified for the air, steam, and water service a power block runs at scale.",
          },
          {
            tag: "SERIES 3800",
            note: "Pilot-operated valves for turbine bypass systems, where a large, precisely controlled relief capacity keeps the turbine protected during startup and load-rejection events.",
          },
          {
            tag: "SERIES 6400 / 6600",
            note: "Dedicated steam safety valves for boiler drums and superheaters, the exact scenario every other plant safeguard exists to prevent, engineered around steam's compressibility at the set pressure that matters.",
          },
          {
            tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
            note: "Sizing and iNSURE® monitoring that keeps every safety valve on the boiler and steam system correctly rated and its condition visible without an inspection shutdown.",
          },
        ],
      },
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "360 / 390 / 350 / 370 / 380 / DF2000",
            note: "Sliding-stem control valves for feedwater regulation, desuperheating spray, and HRSG duct-burner control, cycling constantly as load tracks a turbine's changing output.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "Digital positioners and pressure controllers giving HRSG and feedwater loops the on-board diagnostics that flag a sticking valve before it causes a trip.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Seals a leaking condenser tube in minutes without draining the waterbox, so the unit stays online instead of waiting for the next planned outage.",
          },
          {
            tag: "HYDRA-LOC®",
            note: "Sleeving that restores a fouled or eroded condenser tube's service life without a full retube during a turnaround.",
          },
          {
            tag: "GRIPTIGHT®",
            note: "Hydrostatic test plugs for pipeline and pressure-vessel commissioning and post-repair verification across the steam and cooling-water systems.",
          },
          {
            tag: "G-SERIES",
            note: "Vacuum testers that locate a leaking condenser tube during scheduled inspection, before it costs turbine vacuum and heat-rate efficiency.",
          },
        ],
      },
    ],
    image: "/images/sectors/power-generation.jpg",
    imageAlt: "Power generation emblem: a relief valve and pressure gauge inside a gear, crossed by a lightning bolt",
    artwork: "emblem",
  },
  {
    slug: "water-treatment",
    name: "Water Treatment",
    tagline: "Desalination • Municipal Water • Industrial Wastewater • Cooling Water",
    intro:
      "Water treatment facilities require corrosion-resistant materials, precise flow control, and reliable isolation equipment.",
    applications: [
      {
        area: "Desalination",
        scope:
          "SWRO/MSF/MED: pretreatment control, high-pressure brine handling, and chemical dosing",
        challenge:
          "Reverse-osmosis trains run at genuinely high pressure with a brine stream that's both saline and, at the pretreatment stage, dosed with corrosive chemicals. Trim and seats wear fast if the valve isn't built for it.",
        solution:
          "Dyna-Flo's segmented and full-ball rotary valves throttle and isolate pretreatment and brine lines with corrosion-resistant trim, while PRO-50 and 4000 Series instrumentation regulates the chemical-dosing skids.",
        advantage:
          "A segmented ball design gives tight shutoff and high rangeability in one body, so one valve does both throttling and positive isolation instead of needing separate control and block valves.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "dyna-flo", lineTag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760" },
        ],
      },
      {
        area: "Municipal water",
        scope: "intake control, filtration, disinfection, and distribution network isolation",
        challenge:
          "A municipal network has to keep flowing continuously to the city it serves. An isolation valve that won't seat, or a control valve that hunts instead of holding position, shows up directly as a service complaint.",
        solution:
          "Farris Series 1890 protects treatment-plant pressure vessels and filtration skids against overpressure, while Dyna-Flo rotary and sliding-stem valves handle intake and distribution control.",
        advantage:
          "Direct-spring relief needs no external power or air supply. For a treatment plant built to run unattended for long stretches, that's one less system that can fail silently.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
        ],
      },
      {
        area: "Industrial wastewater",
        scope: "neutralization, clarification, sludge handling, and effluent discharge",
        challenge:
          "Neutralization and sludge streams are abrasive, corrosive, or both. Standard trim erodes quickly, and a valve failure here risks an out-of-spec discharge.",
        solution:
          "Dyna-Flo Series 570/590 rotary valves, available in corrosion-resistant trim, handle neutralization and sludge isolation, while EST's Pop-A-Plug keeps any shell-and-tube exchangers in the treatment train sealed.",
        advantage:
          "Rotary ball/segmented trim wears more evenly under abrasive slurry than a sliding-stem globe valve's throttling edge, extending service life on exactly the streams that chew through standard valves fastest.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
        ],
      },
      {
        area: "Cooling water systems",
        scope: "heat exchanger protection, biocides dosing, and condenser tube maintenance",
        challenge:
          "Cooling water fouls and scales heat exchangers over time, cutting thermal performance long before a leak is even detectable. By the time it's obvious, efficiency has already been lost for weeks.",
        solution:
          "EST Pop-A-Plug seals a fouled or leaking tube without a full retube, and Dyna-Flo instrumentation doses biocide accurately to slow fouling in the first place.",
        advantage:
          "Catching and plugging a single failing tube costs a fraction of an unplanned exchanger retube, and it's done without draining the system.",
        products: [
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
          { brandSlug: "dyna-flo", lineTag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760" },
        ],
      },
    ],
    howWeSupport: [
      {
        text: "Isolation valves (ball, butterfly) for on/off and flow isolation services",
        brandSlug: "dyna-flo",
      },
      {
        text: "Pressure regulators and instrumentation for chemical dosing systems",
        brandSlug: "dyna-flo",
      },
      {
        text: "Heat exchanger maintenance for plate-and-frame and shell-and-tube exchangers used in cooling and heating circuits",
        brandSlug: "est",
      },
      { text: "Backflow prevention and check valves for pipeline protection" },
      { text: "Sizing and selection support for corrosive and erosive media" },
    ],
    // Deliberately the shortest list on this page: water treatment doesn't
    // call for the high-pressure pilot-operated or boiler-safety lines above,
    // so only what genuinely fits a treatment plant's duty is listed here.
    productLines: [
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "SERIES 570 / 590",
            note: "Segmented and full-ball rotary valves for pretreatment and brine-line throttling and isolation, in corrosion-resistant trim built for saline and chemically dosed streams.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "Instrumentation regulating chemical-dosing skids with the accuracy a treatment process's compliance limits demand.",
          },
        ],
      },
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 1890",
            note: "General overpressure protection for treatment-plant pressure vessels and filtration skids, using a direct-spring design that needs no external power, which matters on a plant built to run unattended.",
          },
          {
            tag: "SERIES 2600 / 2700",
            note: "Flanged relief rated for water service specifically, protecting distribution and intake pressure systems at the flow rates a municipal or industrial network runs.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Seals a fouled or leaking heat-exchanger tube in the cooling-water circuit without draining the system.",
          },
        ],
      },
    ],
    image: "/images/sectors/water-treatment.jpg",
    imageAlt: "Coastal water treatment and desalination plant with an aeration basin and storage tanks",
    imageSize: { width: 1368, height: 768 },
  },
  {
    slug: "fertilizers",
    name: "Fertilizers",
    tagline: "Ammonia • Urea • Phosphate • NPK Blends",
    intro:
      "Fertilizer production involves high-pressure synthesis loops, corrosive media, and high-temperature processes, so equipment needs a long service life and minimal downtime.",
    applications: [
      {
        area: "Ammonia synthesis",
        scope:
          "high-pressure steam reforming, shift conversion, CO₂ removal, and synthesis loop control",
        challenge:
          "An ammonia synthesis loop runs at some of the highest pressures in the entire fertilizer complex, with hydrogen-rich, corrosive process gas. A relief valve here has to handle a genuinely large release without becoming the failure point itself.",
        solution:
          "Farris Series 3800 pilot-operated valves protect the synthesis loop with the high operating ratio and large relief capacity high-pressure ammonia service demands, sized and documented through SIZEMASTER™.",
        advantage:
          "Pilot-operated valves can be set much closer to operating pressure than a direct-spring design without nuisance simmering, which is critical when the loop's efficiency depends on running as close to its pressure limit as safely possible.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 3800" },
          { brandSlug: "farris-engineering", lineTag: "SIZEMASTER™ · INSURE® · FAST NETWORK" },
        ],
      },
      {
        area: "Urea production",
        scope: "carbamate formation, urea finishing, and prilling/granulation",
        challenge:
          "Carbamate is one of the most aggressively corrosive process streams in industrial chemistry. It attacks standard valve and heat-exchanger materials fast enough that carbamate condenser failures are a routine turnaround finding, not a rare event.",
        solution:
          "EST's Hydra-Loc tube sleeving and Pop-A-Plug tube plugging restore carbamate condensers to service without a full retube, and Dyna-Flo severe-service control valves regulate the corrosive carbamate and urea-melt lines.",
        advantage:
          "Sleeving repairs the actual corroded section rather than replacing the whole bundle, which is the difference between a turnaround line item and a capital project.",
        products: [
          { brandSlug: "est", lineTag: "HYDRA-LOC®" },
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
        ],
      },
      {
        area: "Phosphate processing",
        scope: "acidulation, filtration, and granulation",
        challenge:
          "Phosphoric acid acidulation is one of the most corrosive services in the plant. Standard valve trim and gaskets fail quickly, and a leak here is both a safety and an environmental exposure.",
        solution:
          "Dyna-Flo control valves in acid-resistant trim regulate acidulation and filtration flows, while EST GripTight test plugs verify piping integrity during turnarounds without welding in temporary test spools.",
        advantage:
          "A GripTight test plug pressure-tests a line and then comes back out, with no welding a test spool in, cutting it back out, and re-inspecting the weld. That is faster and removes a hot-work step from a corrosive-service line.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
          { brandSlug: "est", lineTag: "GRIPTIGHT®" },
        ],
      },
      {
        area: "Blending and bagging",
        scope: "material handling, dust collection, and bagging equipment control",
        challenge:
          "Blending and bagging lines run pneumatic and hydraulic actuation across many individual control points. Keeping all of them correctly instrumented and responsive is a scale problem more than a severe-service one.",
        solution:
          "Dyna-Flo's standard actuator and instrumentation range covers material-handling and dust-collection control points without over-specifying premium severe-service trim where it isn't needed.",
        advantage:
          "Right-sizing the equipment to the actual duty keeps the cost of instrumenting dozens of control points proportional to the risk they actually carry.",
        products: [
          {
            brandSlug: "dyna-flo",
            lineTag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
          },
        ],
      },
    ],
    howWeSupport: [
      {
        text: "Pilot-operated safety relief valves for high-capacity synthesis loop protection",
        brandSlug: "farris-engineering",
      },
      {
        text: "Severe-service control valves for erosive slurry and corrosive acid service",
        brandSlug: "dyna-flo",
      },
      {
        text: "Heat exchanger maintenance, including carbamate condenser inspection and retubing",
        brandSlug: "est",
      },
      {
        text: "Tube plugging for quick repairs without plant shutdown",
        brandSlug: "est",
      },
      { text: "Consultancy services for plant optimization and reliability improvement" },
    ],
    productLines: [
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 2600 / 2700",
            note: "Flanged relief for ammonia and urea plant utility systems, ASME/NB-certified for the air, steam, and water circuits running alongside the core synthesis process.",
          },
          {
            tag: "SERIES 2850",
            note: "A compact option for vapor and liquid relief duty in ammonia-adjacent piping, where a full flanged body isn't the right fit.",
          },
          {
            tag: "SERIES 3800",
            note: "Pilot-operated valves protecting the ammonia synthesis loop, where operating pressure runs close to the relief set point and nuisance simmering would cost real efficiency.",
          },
          {
            tag: "SERIES 6400 / 6600",
            note: "Steam safety valves for the waste-heat boilers ammonia plants run extensively as part of the reforming process.",
          },
          {
            tag: "SIZEMASTER™ · INSURE® · FAST NETWORK",
            note: "Sizing and documentation for synthesis-loop relief valves, where getting the capacity right the first time matters at this pressure.",
          },
        ],
      },
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "360 / 390 / 350 / 370 / 380 / DF2000",
            note: "Severe-service control valves for corrosive carbamate and urea-melt lines, and erosive phosphate slurry, in trim built for both.",
          },
          {
            tag: "SERIES 570 / 590",
            note: "Rotary valves for acidulation and filtration isolation in phosphate processing, where standard trim wears through fast.",
          },
          {
            tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
            note: "Fail-safe actuation across the synthesis loop's control valves, defaulting to a known safe position if instrument air is lost on a high-pressure ammonia system.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "Instrumentation for material handling and dust-collection control points in blending and bagging, right-sized rather than over-specified for the duty.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Weld-free tube plugging for quick repairs during a turnaround, without the plant shutdown a leaking exchanger tube would otherwise force.",
          },
          {
            tag: "GRIPTIGHT®",
            note: "Test plugs that verify acidulation and filtration piping integrity without welding in temporary spools on corrosive-service lines.",
          },
          {
            tag: "HYDRA-LOC®",
            note: "Sleeving built specifically for carbamate condensers, one of the most aggressively corrosive services in industrial chemistry, recovering a tube's service life without a full retube.",
          },
        ],
      },
    ],
    image: "/images/sectors/fertilizers.jpg",
    imageAlt: "Valve and pump manifold feeding a fertigation line in a growing house",
    imageSize: { width: 572, height: 395 },
  },
  {
    slug: "general-industrial",
    name: "General Industrial",
    tagline: "Cement • Steel • Glass • Pulp & Paper • Mining • Manufacturing",
    intro:
      "Beyond heavy process industries, we serve a wide range of general industrial applications: reliable equipment and technical support for manufacturing facilities of all types.",
    applications: [
      {
        area: "Cement production",
        scope: "preheater control, kiln burner regulation, and dust collection isolation",
        challenge:
          "A cement kiln runs at extreme temperature with abrasive dust everywhere in the gas path. Valves and actuators here fail from erosion and heat, not just pressure.",
        solution:
          "Dyna-Flo control valves regulate preheater and kiln-burner fuel/air, with pneumatic actuators sized for the higher torque dust-laden dampers and isolation valves need.",
        advantage:
          "A properly sized pneumatic actuator carries enough reserve torque to keep breaking free a valve that's sat dusty and unmoved between campaigns, a common cause of stuck isolation valves in cement plants.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" },
          {
            brandSlug: "dyna-flo",
            lineTag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
          },
        ],
      },
      {
        area: "Steel processing",
        scope: "furnace control, cooling water regulation, and hydraulic systems",
        challenge:
          "Steel furnace cooling and hydraulic systems combine high temperature with high hydraulic pressure. A relief or control failure risks both equipment damage and a safety incident on the mill floor.",
        solution:
          "Farris Series 1890 and 2850 relief valves protect furnace cooling circuits and hydraulic accumulators, while Dyna-Flo rotary valves regulate cooling-water flow to the furnace jacket.",
        advantage:
          "General-purpose spring-loaded relief across air, steam, vapor, and liquid service means one valve family covers the mixed-service reality of a steel mill's utility systems, simplifying spares and maintenance.",
        products: [
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 2850" },
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
        ],
      },
      {
        area: "Glass manufacturing",
        scope: "combustion control, batch handling, and forming machine regulation",
        challenge:
          "Glass-furnace combustion has to hold an exact temperature profile. Drift changes glass quality directly, and the furnace can't simply be shut down and restarted to correct it without a costly thermal cycle.",
        solution:
          "Dyna-Flo sliding-stem control valves regulate combustion air and fuel with the fine, repeatable positioning a glass furnace's temperature profile depends on.",
        advantage:
          "A sliding-stem valve's linear characteristic gives more predictable control at partial loads than a rotary valve would, exactly the low-drift behavior a continuous glass furnace needs.",
        products: [{ brandSlug: "dyna-flo", lineTag: "360 / 390 / 350 / 370 / 380 / DF2000" }],
      },
      {
        area: "Pulp & paper",
        scope: "chemical dosing, stock preparation, and dryer system control",
        challenge:
          "Pulping chemicals are corrosive and stock-preparation lines carry abrasive fiber slurry: two very different failure modes the same plant has to guard against with the right valve for each.",
        solution:
          "Dyna-Flo instrumentation doses chemicals accurately, its rotary valves handle abrasive stock-prep slurry service, and EST Pop-A-Plug maintains the dryer system's steam-side heat exchangers.",
        advantage:
          "Splitting dosing control from slurry handling rather than using one valve type for both means each duty gets trim actually suited to it, instead of a compromise.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760" },
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "est", lineTag: "POP-A-PLUG®" },
        ],
      },
      {
        area: "Mining",
        scope: "slurry handling, dewatering, and process water management",
        challenge:
          "Mineral slurry is about as abrasive a service as industrial valves ever see. Standard trim can wear through in months where a cleaner service would last years.",
        solution:
          "Dyna-Flo rotary ball and segmented valves, in hardened trim, handle slurry isolation and dewatering duty, while Farris relief valves protect the process water and hydraulic systems around them.",
        advantage:
          "Rotary trim wears more predictably under abrasive slurry than a sliding-stem valve's throttling edge, so replacement intervals are plannable instead of a surprise failure.",
        products: [
          { brandSlug: "dyna-flo", lineTag: "SERIES 570 / 590" },
          { brandSlug: "farris-engineering", lineTag: "SERIES 1890" },
        ],
      },
    ],
    howWeSupport: [
      {
        text: "General-purpose control and isolation valves for water, air, steam, and chemicals",
        brandSlug: "dyna-flo",
      },
      {
        text: "Safety relief valves for compressor systems, pressure vessels, and hydraulic units",
        brandSlug: "farris-engineering",
      },
      {
        text: "Actuators and positioners for automated process control",
        brandSlug: "dyna-flo",
      },
      { text: "Technical advisory and product selection support for plant engineers" },
      { text: "Spare parts and aftermarket support for critical equipment" },
    ],
    productLines: [
      {
        brandSlug: "farris-engineering",
        lines: [
          {
            tag: "SERIES 1890",
            note: "General-purpose relief protection for compressor systems, pressure vessels, and hydraulic units across cement, steel, glass, and pulp & paper plants alike.",
          },
          {
            tag: "SERIES 2850",
            note: "A compact spring-loaded option for smaller relief duty where a full-size valve isn't warranted, in air, steam, vapor, or liquid service.",
          },
        ],
      },
      {
        brandSlug: "dyna-flo",
        lines: [
          {
            tag: "360 / 390 / 350 / 370 / 380 / DF2000",
            note: "Sliding-stem control across kiln burners, furnace combustion air, and general process regulation. The standard control valve for facilities that aren't running severe-service chemistry.",
          },
          {
            tag: "SERIES 570 / 590",
            note: "Rotary valves for abrasive slurry service in mining and steel-mill cooling water, wearing more predictably under erosive duty than a sliding-stem valve's throttling edge.",
          },
          {
            tag: "DFC / DFO / DFLP / DFN / DFR / DFRP / D-FORCE",
            note: "Pneumatic actuators sized for the higher torque dust-laden dampers and isolation valves need after sitting unmoved between production campaigns.",
          },
          {
            tag: "PRO-50 · 4000 · 5000 · T950XP · PS2/760",
            note: "Instrumentation dosing pulp & paper chemicals and controlling general process points with the accuracy automated production demands.",
          },
        ],
      },
      {
        brandSlug: "est",
        lines: [
          {
            tag: "POP-A-PLUG®",
            note: "Tube plugging for the steam-side heat exchangers pulp & paper dryer systems and general industrial utilities depend on.",
          },
        ],
      },
    ],
    image: "/images/sectors/general-industrial.jpg",
    imageAlt: "General industrial emblem: a factory and gate valve inside a gear, topped by a pressure gauge",
    artwork: "emblem",
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
  /** Full heading shown above the group's client cards. */
  category: string;
  /** Short form for the tab strip. Held as its own field rather than derived
   *  from `category` by splitting on punctuation, so rewording a heading can
   *  never silently change (or blank out) the tab label. */
  short: string;
  image: string;
  imageAlt: string;
  artwork?: SectorArtwork;
  /** Required for `artwork: "photo"`; see SectorImageSize. */
  imageSize?: SectorImageSize;
  entries: { name: string; sector: string }[];
};

export const projectClients: ProjectClientGroup[] = [
  {
    slug: "upstream",
    category: "Oil & Gas: Upstream & Exploration",
    short: "Upstream",
    image: "/images/sectors/upstream.jpg",
    imageAlt: "Upstream emblem: a pumpjack behind a flanged gate valve and pressure gauge",
    artwork: "emblem",
    entries: [
      { name: "Khalda Petroleum Company", sector: "Upstream, Western Desert operations" },
      { name: "Belayim Petroleum Company (Petrobel)", sector: "Upstream, Gulf of Suez & Sinai" },
      { name: "GUPCO Petroleum Company", sector: "Upstream, Gulf of Suez" },
      { name: "Badr El Din Petroleum Company", sector: "Upstream, Western Desert" },
      { name: "South Dabaah Petroleum Co. (DAPETCO)", sector: "Upstream, Western Desert" },
      { name: "Nasr Petroleum Company", sector: "Upstream & refining" },
      { name: "Scimitar Production Egypt Ltd", sector: "Upstream, international operator" },
    ],
  },
  {
    slug: "midstream",
    category: "Oil & Gas: Midstream, Refining & LNG",
    short: "Midstream",
    image: "/images/sectors/midstream.jpg",
    imageAlt: "Midstream emblem: a pumpjack and pipeline valve inside a gear roundel with a pressure gauge",
    artwork: "emblem",
    entries: [
      { name: "Cairo Oil Refining Company (CORC)", sector: "Refining, Cairo" },
      { name: "Suez Oil Processing Company (SOPC)", sector: "Refining, Suez" },
      { name: "Egyptian Natural Gas Holding Co. (EGAS)", sector: "Midstream, gas transmission" },
      { name: "Gasco", sector: "Midstream, gas processing & transmission" },
      { name: "Arab Petroleum Pipelines Co. (SUMED)", sector: "Midstream, pipeline transportation" },
      { name: "Damietta LNG (DLNG)", sector: "LNG, liquefaction & export" },
    ],
  },
  {
    slug: "epc",
    category: "EPC, Engineering & Project Management",
    short: "EPC",
    image: "/images/sectors/epc.jpg",
    imageAlt: "EPC emblem: a hard-hatted engineer behind a flanged valve and pipe spool",
    artwork: "emblem",
    entries: [
      {
        name: "ENPPI (Engineering for the Petroleum and Process Industries)",
        sector: "Engineering & EPC, oil & gas",
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
    short: "Petrochemicals",
    image: "/images/sectors/petrochemicals.jpg",
    imageAlt: "Petrochemical plant lit at dusk, distillation columns and stacks against an orange sky",
    imageSize: { width: 1264, height: 843 },
    entries: [
      {
        name: "The Egyptian Ethylene and Derivatives Company (ETHYDCO)",
        sector: "Petrochemicals, ethylene & derivatives",
      },
      {
        name: "Egyptian Propylene and Polypropylene Company",
        sector: "Petrochemicals, propylene & polypropylene",
      },
      {
        name: "Echem (Egyptian Petrochemicals Holding Co.)",
        sector: "Petrochemicals, holding & investments",
      },
      { name: "Egyptian Methanex Methanol Company", sector: "Petrochemicals, methanol production" },
      {
        name: "Egypt Basic Industries Corporation (EBIC)",
        sector: "Petrochemicals, ammonia & fertilizers (Fertiglobe)",
      },
    ],
  },
  {
    slug: "fertilizers",
    category: "Fertilizers",
    short: "Fertilizers",
    image: "/images/sectors/fertilizers.jpg",
    imageAlt: "Valve and pump manifold feeding a fertigation line in a growing house",
    imageSize: { width: 572, height: 395 },
    entries: [
      { name: "Misr Fertilizers Production Company (MOPCO)", sector: "Fertilizers, ammonia & urea" },
      { name: "Birla Carbon", sector: "Fertilizers & carbon black" },
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
