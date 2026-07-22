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
        products: [
          {
            image: "/images/farris/direct-spring-valve.jpg",
            name: "Direct spring-operated safety relief valve",
          },
          {
            image: "/images/farris/direct-spring-closeup.jpg",
            name: "Open-spring bonnet with test lever",
          },
          {
            image: "/images/farris/direct-spring-lever.jpg",
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
            image: "/images/farris/direct-spring-flanged-lever.jpg",
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
            image: "/images/farris/spring-operated-lever.jpg",
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
            name: "Pilot-operated valve — stainless pilot assembly",
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
            image: "/images/farris/pilot-assisted-pair.jpg",
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
            name: "6400 Series — internal cross-section",
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
            image: "/images/farris/insure-monitoring-compact.jpg",
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
            image: "/images/dynaflo/t950xp-transducer.jpg",
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
            "1\"–16\", ASME Class 150–2500",
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
            "1\"–24\", ASME Class 150–900",
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
            "1\"–6\" (DN 25–150), Class 150–600",
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
            "1\" & 2\", ASME Class 150–1500",
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
            "Large-diaphragm spring-and-diaphragm actuators for low-pressure pneumatic operation. The spring drives the valve to a fail-safe position on loss of air supply — DFC fails closed, DFO fails open.",
          specs: [
            "Signal 3–15 or 6–30 PSIG",
            "Nominal effective area 46–220 in²",
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
          tag: "DFR · SIZES 026–220",
          description:
            "Large-diaphragm rotary actuator for low-pressure operation, using a spring for fail-safe positioning to automate quarter-turn valves for throttling or on/off control of liquids and gases.",
          specs: [
            "Signal 0–18 or 0–33 PSIG",
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
            "90° rotation, shaft 1/2\"–2-1/2\"",
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
            "Output 3–15 or 6–30 PSIG",
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
            "Input 4–20 mA, HART ready",
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
            "Rugged pneumatic valve positioner for linear or rotary control valves, with optional 4–20 mA feedback, internal limit switches, a high-flow Cv module and position-indicator windows.",
          specs: [
            "Input 3–15 / 6–30 PSIG or 4–20 mA",
            "Travel 1/2\"–6\" or 90° rotary",
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
            "Outlet 0–35 / 0–60 / 0–125 PSIG",
            "NACE (MR0175) & non-relieving options",
            "-40°F to 300°F service",
          ],
        },
      },
      {
        src: "/images/dynaflo/t950xp-transducer.jpg",
        caption: "Control Air T950XP I/P transducer",
        category: "Instrumentation",
        detail: {
          tag: "T950XP I/P",
          description:
            "High-performance current-to-pressure (I/P) transducer for hazardous environments, converting a 4–20 mA electrical input into a stable pneumatic output to drive control valve actuators.",
          specs: [
            "Input 4–20 mA",
            "Output 0–18 / 0–20 / 0–33 / 0–35 PSIG",
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
            image: "/images/est/tube-stabilizer.jpg",
            name: "Pop-A-Plug tube stabilizers",
          },
          {
            image: "/images/est/ram-package.jpg",
            name: "Pop-A-Plug hydraulic ram package",
          },
          {
            image: "/images/est/smart-ram-plus.jpg",
            name: "Smart Ram Plus installation system",
          },
          {
            image: "/images/est/smart-ram-640t.jpg",
            name: "Smart Ram 640T installation tool",
          },
          {
            image: "/images/est/manual-installation-tool.jpg",
            name: "Manual installation tool",
          },
          {
            image: "/images/est/removal-tool.jpg",
            name: "Pop-A-Plug removal tool",
          },
          {
            image: "/images/est/air-cooled-hx.jpg",
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
            image: "/images/est/griptight-pe.jpg",
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
            image: "/images/est/griptight-reverse-pressure.jpg",
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
            image: "/images/est/g250-vacuum-tube-tester.jpg",
            name: "G-250 vacuum tube tester",
          },
          {
            image: "/images/est/g650-vacuum-joint-tester.jpg",
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
            "Tube ID 0.472\"–2.067\"",
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
            "Tube ID 0.400\"–1.460\"",
            "Helium leak-tight, no welding",
            "ISO 9001 manufactured",
          ],
        },
      },
      {
        src: "/images/est/tube-stabilizer.jpg",
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
        src: "/images/est/ram-package.jpg",
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
        src: "/images/est/smart-ram-640t.jpg",
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
            "Tube ID 0.400\"–1.160\"",
            "Zinc-plated carbon steel",
          ],
        },
      },
      {
        src: "/images/est/removal-tool.jpg",
        caption: "Pop-A-Plug removal tool",
        category: "Heat Exchanger Tube Plugging",
        detail: {
          tag: "POP-A-PLUG® REMOVAL TOOL",
          description:
            "Dual-function removal tool: a nose piece threads into the plug pin while a serrated spear grabs the ring, and an integral slide hammer pulls both out in one operation.",
          specs: [
            "Removes CPI/Perma & P2 plugs",
            "Integral slide hammer",
            "Plug sizes 0.400\"–1.180\"",
            "Extensions available to 6 ft",
          ],
        },
      },
      {
        src: "/images/est/air-cooled-hx.jpg",
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
        src: "/images/est/g250-vacuum-tube-tester.jpg",
        caption: "G-250 vacuum tube tester",
        category: "Tube & Joint Leak Testing",
        detail: {
          tag: "G-250 VACUUM TUBE TESTER",
          description:
            "Lightweight aluminum tool that quickly seals off and evacuates individual heat exchanger tubes to locate pinhole leaks; a loss of vacuum indicates a leaking tube.",
          specs: [
            "Tube range 0.28\"–1.45\"",
            "Weighs under 2.1 lbs (1.1 kg)",
            "Uses 40–125 PsiG plant air",
            "Analog or digital gauge",
          ],
        },
      },
      {
        src: "/images/est/g650-vacuum-joint-tester.jpg",
        caption: "G-650 vacuum joint tester",
        category: "Tube & Joint Leak Testing",
        detail: {
          tag: "G-650 VACUUM JOINT TESTER",
          description:
            "Seals the tube ID and tubesheet face, then evacuates the joint to quickly identify leaking tube-to-tubesheet joints, ideal for manufacturers and retubing operations.",
          specs: [
            "Tube OD 3/8\"–1¼\" (G-650A to 2½\")",
            "Weighs under 2.7 lbs (1.2 kg)",
            "Uses 40–125 PsiG plant air",
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
            "Size 3/8\"–48\" NPS (DN10–DN1200)",
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
            "Size 2\"–48\" NPS (DN50–DN1200)",
            "Orientation-independent install",
            "Fits most long-radius elbows",
          ],
        },
      },
      {
        src: "/images/est/griptight-pe.jpg",
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
            "Size 3/4\"–24\" NPS (DN20–DN600)",
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
            "Size 1/4\"–4\" (DN8–DN100)",
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
            "Size 1/2\"–2\" NPS (DN15–DN50)",
            "Twin-cone uniform gripper expansion",
            "Replaceable grippers & seals",
          ],
        },
      },
      {
        src: "/images/est/griptight-reverse-pressure.jpg",
        caption: "GripTight reverse pressure test plug",
        category: "Test & Isolation Plugs",
        detail: {
          tag: "GRIPTIGHT® REVERSE PRESSURE PLUG",
          description:
            "Subjects a flange-to-pipe weld to full radial, hoop and axial stresses during hydrostatic testing, equivalent to blinding and pressurizing the entire piping system.",
          specs: [
            "Test pressure to 2,250 PsiG (155 BarG)",
            "Size 2\"–48\" NPS (DN50–DN1200)",
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
            "Size 3/4\"–48\" NPS (DN20–DN1200)",
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
            "Size 3/4\"–48\" NPS (DN20–DN1200)",
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
