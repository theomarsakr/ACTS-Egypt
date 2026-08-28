/* English dictionary — the canonical shape every locale must satisfy.
   Phase 1 covers the shared chrome (navbar/footer) plus the three
   conversion-path pages: home, contact, and quote. */

export const en = {
  /* Homepage title/description. The title is SUFFIX-FREE — lib/seo's
     `fullTitle` appends " | ACTS Egypt" (or " | ACTS مصر"), so writing the
     suffix here would double it. Leading with the category rather than the
     company name is deliberate: "ACTS Egypt" already matches on the suffix,
     while "industrial valves Egypt" and "control valves Egypt" only match if
     those words are in the front of the title. The description is trimmed to
     ~155 characters so Google shows all of it instead of cutting mid-clause. */
  meta: {
    title: "Industrial Valves, Flow Control & Process Equipment in Egypt",
    description:
      "Egypt's sole agent for Farris safety relief valves, Dyna-Flo control valves and EST (Curtiss-Wright) heat exchanger tooling. Supplied and supported from Giza.",
  },

  skipLink: "Skip to main content",

  nav: {
    tagline: "Representing World-Class Engineering Solutions in Egypt",
    home: "Home",
    ourBrands: "Our Brands",
    viewAllBrands: "View all brands",
    about: "About us",
    industries: "Industries",
    products: "Products & Services",
    projects: "Projects & Clients",
    contact: "Contact",
    requestQuote: "Request a quote",
    toggleMenu: "Toggle menu",
    language: "Language",
  },

  footer: {
    rfqTitle: "Have a requirement on your desk?",
    rfqText:
      "Leave your work email and finish the details on the quote form. Our engineers typically respond within 24 hours.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    startQuote: "Start a quote",
    blurb:
      "Advanced Company for Trading Services. Egypt's sole agent for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright) since 2006.",
    channels: {
      call: "Call ACTS",
      email: "Email sales",
      whatsapp: "WhatsApp",
      maps: "Find us on Maps",
    },
    company: "Company",
    ourBrands: "Our brands",
    industries: "Industries",
    getInTouch: "Get in touch",
    companyFull: "Advanced Company for Trading Services",
    rights: "All rights reserved.",
    tagline: "Representing World-Class Engineering Solutions in Egypt",
  },

  /** Industry display names keyed by lib/data.ts slug. */
  industryNames: {
    "oil-gas": "Oil & Gas",
    petrochemical: "Petrochemical",
    "power-generation": "Power Generation",
    "water-treatment": "Water Treatment",
    fertilizers: "Fertilizers",
    "general-industrial": "General Industrial",
  } as Record<string, string>,

  home: {
    hero: {
      badge: "Representing World-Class Engineering Solutions in Egypt",
      titleA: "Engineering the future of",
      titleB: "industrial reliability",
      lede: "From safety-critical valves to smart, connected instrumentation, ACTS has spent nearly two decades engineering the reliability behind Egypt's Oil & Gas, Petrochemical, Power, and Fertilizer industries, as sole agent for Farris Engineering, Dyna-Flo Control Valve Services, and EST, all divisions of Curtiss-Wright.",
      ctaQuote: "Request a quote",
      ctaBrands: "Explore our brands",
      exclusiveNote: "exclusive to ACTS in Egypt",
      stats: [
        { value: 20, suffix: "+", label: "Years in business" },
        { value: 3, suffix: "", label: "Exclusive brand divisions" },
        { value: 10, suffix: "+", label: "Major operators served" },
        { value: 24, suffix: "h", label: "Typical quote turnaround" },
      ],
    },
    marquee: "Trusted by Egypt's leading operators",
    whatWeDo: {
      title: "What We Do",
      subtitle: "Sales, technical support, and aftermarket services",
      lede: "Three areas of industrial process equipment, backed by nearly two decades of relationships built on integrity, speed, and technical expertise.",
      items: [
        {
          title: "Valves, Actuators & Instrumentation",
          text: "Safety relief valves, linear and rotary control valves, actuators, and process instrumentation, supplied and supported end-to-end.",
        },
        {
          title: "Heat Exchanger & Pressure Testing",
          text: "Tube plugging systems for leaking heat exchanger, condenser, and boiler tubes; hydrostatic test and isolation plugs for pipes, pipelines, and pressure vessels; and on-site field services for inspection and repair.",
        },
        {
          title: "Aftermarket & Maintenance Support",
          text: "Reconditioning, re-certification, and factory-authorized repair support that cuts downtime and extends the service life of critical equipment.",
        },
      ],
    },
    brands: {
      title: "Represented Brands",
      subtitle: "Three world-class manufacturers. One local partner.",
      lede: "Farris Engineering, Dyna-Flo, and EST — all Curtiss-Wright divisions, all supplied and supported in Egypt by ACTS alone.",
      allBrands: "All brands",
      featured: "Featured products in Egypt",
      viewProducts: "View products",
      pastNote:
        "ACTS has also supplied and supported products from {names} on past projects.",
      meta: {
        "farris-engineering": {
          category: "Safety Relief Valves",
          summary:
            "Direct-spring and pilot-operated safety relief valves protecting pressure systems for over 70 years, across oil & gas, refining, petrochemical and power generation.",
        },
        "dyna-flo": {
          category: "Control Valves, Actuators & Instrumentation",
          summary:
            "Linear and rotary control valves, actuators and instrumentation for stable, accurate process control under high pressure drop.",
        },
        est: {
          category: "Heat Exchanger Repair & Pressure Testing",
          summary:
            "Tube plugging, hydrostatic test & isolation equipment, and field services restoring thermal efficiency across refining, petrochemical and power plants.",
        },
      } as Record<string, { category: string; summary: string }>,
    },
    global: {
      title: "Global Reach",
      subtitle: "World-class engineering, delivered and supported from Egypt",
      lede: "Every valve and tool we supply traces back to a Curtiss-Wright manufacturing site in North America, backed on the ground in Giza by engineers who size, stock, and service it.",
    },
    why: {
      title: "Why ACTS",
      subtitle: "Built for procurement teams",
      lede: "We know what engineering procurement needs from an industrial equipment supplier. We've been doing it for nearly two decades.",
      exclusive: {
        title: "Exclusive Agency",
        subtitle: "The sole authorized source for three Curtiss-Wright divisions in Egypt",
        text: "Factory-backed pricing, genuine parts, and direct access to manufacturer engineering, without intermediaries.",
        link: "Our brands",
      },
      fast: {
        big: "24",
        unit: "h",
        title: "Fast quotations",
        text: "Send a requirement, get a serious answer, usually within one business day.",
      },
      engineers: {
        title: "Engineers, not order-takers",
        text: "In-house sizing, selection, and service-condition review on every enquiry.",
      },
      since: {
        big: "2006",
        title: "Two decades on the ground",
        text: "Relationships across Egypt's industrial sector since our founding in Giza.",
      },
      genuine: {
        title: "Genuine parts & aftermarket",
        text: "Factory-original spares and service support across the equipment lifecycle.",
      },
      industriesTile: {
        chip: "Industries we serve",
        title: "Wherever process integrity matters, we're there",
        cta: "See how we support each industry",
      },
      locationTile: {
        title: "Giza headquarters, nationwide reach",
        text: "Arkan Plaza, Sheikh Zayed City, supporting sites from the Western Desert to the Gulf of Suez.",
        cta: "Visit or contact us",
        mapHint: "Hover a pin to see who we work with",
      },
    },
    proven: {
      title: "Proven in the Field",
      subtitle: "The work our clients rely on us for",
      lede: "Project specifics stay confidential. These are the engagements Egypt's operators bring to ACTS, from named clients like ENPPI, Petrojet, and Khalda Petroleum.",
      confidential: "Client details confidential ·",
      seeWho: "See who we work with",
      sectors: {
        upstream: "Oil & Gas: Upstream",
        midstream: "Refining & Midstream",
        epc: "EPC & Engineering",
        petrochemicals: "Petrochemicals",
        fertilizers: "Fertilizers",
      } as Record<string, string>,
      items: {
        upstream: {
          title: "Wellhead & Separator Protection",
          text: "Sizing and supply of safety relief valves for wellhead, separator, and gas-compression overpressure protection across upstream production facilities.",
        },
        midstream: {
          title: "Turnaround & Outage Support",
          text: "Rapid valve testing, recertification, and replacement coordinated around planned refinery and gas-processing turnarounds to minimize outage windows.",
        },
        epc: {
          title: "New-Build Project Support",
          text: "Technical sizing, selection, and procurement support supplied directly to EPC contractors during new facility construction and commissioning.",
        },
        petrochemicals: {
          title: "Severe-Service Control",
          text: "Control valve trim selection and cavitation/noise analysis for high-pressure-drop, corrosive-service petrochemical process lines.",
        },
        fertilizers: {
          title: "Synthesis Loop Protection",
          text: "Pilot-operated relief valve sizing and heat exchanger tube maintenance supporting high-pressure ammonia and urea synthesis loops.",
        },
      } as Record<string, { title: string; text: string }>,
    },
    gallery: {
      chip: "Company gallery",
      title: "Company Gallery",
      subtitle: "Where our equipment works",
      lede: "Farris safety valves, Dyna-Flo control equipment, and EST heat-exchanger tooling and field service — a closer look at the brands we support. Tap any photo to view it full-screen.",
      projectsBtn: "Projects & clients",
      allPhotos: "All photos",
      learnMore: "Learn more",
      closeLabel: "Close gallery",
      prevLabel: "Previous photo",
      nextLabel: "Next photo",
      openLabel: "Open photo {n} of {total}: {title}",
      thumbLabel: "Photo {n}: {title}",
      dialogLabel: "Field photo gallery",
      groups: {
        farris: "Farris Engineering",
        dynaflo: "Dyna-Flo",
        est: "EST",
      },
      items: [
        { label: "Valve overhaul", sub: "Farris FAST-certified service" },
        { label: "High-pressure relief", sub: "Farris Series 6400 relief valve" },
        { label: "Process safety", sub: "Farris Series 2700 relief valve" },
        { label: "Bubble-tight shutoff", sub: "Farris Series 2400 relief valve" },
        { label: "Flow control", sub: "Farris directional control valve" },
        { label: "Pilot-operated relief", sub: "Farris Series 3800 relief valve" },
        { label: "Steam safety", sub: "Farris Series 4200 safety valve" },
        { label: "Steam protection", sub: "Farris Series 4700 safety valve" },
        { label: "Flagship relief", sub: "Farris Series 2600 relief valve" },
        { label: "Pilot valve assembly", sub: "Farris Series 3800 relief valve" },
        { label: "Process control", sub: "Dyna-Flo 4000 Series controller" },
        { label: "Valve actuation", sub: "Dyna-Flo DFN pneumatic actuator" },
        { label: "Valve positioning", sub: "Dyna-Flo Model 760 positioner" },
        { label: "Digital positioning", sub: "Siemens PS2 digital positioner" },
        { label: "Signal conversion", sub: "Dyna-Flo T950XP I/P transducer" },
        { label: "Level control", sub: "Dyna-Flo 5000 level controller" },
        { label: "Linear actuation", sub: "Dyna-Flo DFC/DFO actuators" },
        { label: "Quarter-turn actuation", sub: "Dyna-Flo DFRP piston actuator" },
        { label: "High-force actuation", sub: "Dyna-Flo DFLP piston actuator" },
        { label: "Fail-safe actuation", sub: "Dyna-Flo DFR rotary actuator" },
        { label: "Field services", sub: "EST heat-exchanger tube cleaning" },
        { label: "Proven results", sub: "EST tube bundle, before & after" },
        { label: "Tube plugging", sub: "EST Smart Ram Plus installation kit" },
        { label: "Installation tooling", sub: "EST plug installation kit" },
        { label: "Hot work isolation", sub: "EST double block & bleed plug" },
        { label: "Permanent sealing", sub: "EST CPI/Perma tube plug" },
        { label: "Installation hardware", sub: "EST Pop-A-Plug Ram package" },
        { label: "Pressure test isolation", sub: "EST GripTight Elbow test plug" },
      ],
    },
    cta: {
      title: "Start the Conversation",
      subtitle: "Let's talk about your next project",
      lede: "A project, an application question, or an urgent maintenance need. Our engineers are ready.",
      quote: "Request a quote",
      contactUs: "Contact us",
    },
  },

  contact: {
    metaTitle: "Contact ACTS — Sales & Technical Support in Egypt",
    metaDescription:
      "Reach the ACTS sales and application-engineering team at Arkan Plaza, Sheikh Zayed City, Giza. Phone, email and office hours for valve enquiries across Egypt.",
    heroChip: "Contact",
    heroTitle: "Get in Touch",
    heroSubtitle: "Sales, technical, and general enquiries",
    /* Caption under the phone hero plate — names the place the photograph
       is of, which is the whole reason a hero photograph of a plaza earns
       its space on a contact page. */
    plateCaption: "Arkan Plaza · Sheikh Zayed City, Giza",
    lede: "Have a technical question, need a quote, or want to discuss a project? Our team is ready to help. Looking for pricing?",
    quoteInstead: "Request a quote instead",
    office: {
      tag: "Headquarters",
      name: "Arkan Plaza, Building 4, 4th Floor, Office #409",
      address: "Sheikh Zayed City, Giza, Egypt, 12451",
    },
    companyFull: "Advanced Company for Trading Services (ACTS)",
    meetTeam: "Meet our team",
    teamRoles: { "General Manager": "General Manager" } as Record<string, string>,
    officeHoursTitle: "Office hours",
    officeHours: [
      { day: "Sunday to Thursday", hours: "9:00 AM to 5:00 PM (Cairo Time)" },
      { day: "Friday and Saturday", hours: "Closed" },
    ],
    requestQuote: "Request a quote",
    headquarters: "Headquarters",
    openInMaps: "Open in Maps",
    mapTitle: "ACTS headquarters, Arkan Plaza, Sheikh Zayed City, Giza",
    mapAddress: "Arkan Plaza, Sheikh Zayed City, Giza, Egypt",
    mapLoad: "Load map",
    mapHint: "Loads Google Maps",
    deptChip: "Reach the right team",
    deptTitle: "Departments & Direct Lines",
    deptSubtitle: "Straight through to the desk that handles it",
    deptLede: "Phone, mobile, fax, and email for each team. Tap any number to call it directly.",
    departmentNames: {
      "Quotes & Sales": "Quotes & Sales",
      "General Inquiries": "General Inquiries",
      Marketing: "Marketing",
    } as Record<string, string>,
    specLabels: { phone: "Phone", mobile: "Mobile", fax: "Fax", email: "Email" },
    connectTitle: "Let's Connect",
    connectSubtitle: "Email, phone, or come and see us",
    connectLede: "Whichever way suits you, one of our engineers picks it up.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    locationValue: "Arkan Plaza, Sheikh Zayed City, Giza, Egypt",
  },

  quote: {
    metaTitle: "Request a Quote — Farris, Dyna-Flo & EST in Egypt",
    metaDescription:
      "Request pricing for Farris safety relief valves, Dyna-Flo control valves or EST test plugs in Egypt. ACTS application engineers typically reply within 24 hours.",
    heroChip: "Request a quote",
    heroTitle: "Get a Quotation",
    heroSubtitle: "Priced, checked, and back with you inside a day",
    plateCaption: "Arkan Plaza · Sheikh Zayed City, Giza",
    lede: "Complete the form below and one of our application engineers will respond with a formal quote, typically within 24 hours.",
    nextTitle: "What Happens Next?",
    nextSubtitle: "Four steps, from submission to follow-up",
    steps: [
      { step: "1. Acknowledgment", text: "You'll receive an auto-confirmation of your submission" },
      { step: "2. Technical Review", text: "Our engineering team reviews your requirements" },
      { step: "3. Quotation", text: "A formal quote is prepared and sent to you" },
      { step: "4. Follow-Up", text: "One of our engineers will contact you to clarify any details" },
    ],
  },

  rfq: {
    title: "Tell Us What You Need",
    lede: "Complete the form below and one of our application engineers will respond with a formal quote, typically within 24 hours.",
    stepLabels: ["Your details", "Requirement", "Finish"],
    progress: "Progress",
    contactInfo: "Contact information",
    fullName: "Full Name",
    fullNamePh: "Your full name",
    company: "Company Name",
    companyPh: "Company name",
    jobTitle: "Job Title",
    jobTitlePh: "Your role",
    email: "Email Address",
    emailPh: "you@company.com",
    phone: "Phone / Mobile",
    phonePh: "+20 ...",
    projectDetails: "Project details",
    product: "Product or Service Needed",
    brandLabel: "Brand (if known)",
    selectBrand: "Select a brand",
    quantity: "Quantity",
    quantityPh: "e.g. 4 units",
    delivery: "Delivery Location",
    deliveryPh: "Site or city",
    deliveryDate: "Required Delivery Date",
    conditions: "Application / Service Conditions",
    conditionsPh: "e.g., media, temperature, pressure, pipe size, flow rate",
    finalDetails: "Final details",
    upload: "Upload Specification, Drawing, or RFQ",
    uploadHint: "PDF, DWG, DXF, DOC, DOCX (max 10MB).",
    notes: "Additional Notes",
    notesPh: "Anything else our engineers should know",
    back: "Back",
    stepOf: "Step {n} of {total}",
    submit: "Submit Request",
    submitting: "Submitting…",
    continue: "Continue",
    requiredNote:
      "Fields marked with * are required. Your information is used solely to prepare your quote and will not be shared with third parties.",
    successTitle: "Request received. Thank you!",
    successBody:
      "You'll receive an auto-confirmation, then one of our application engineers will review your requirements and follow up, typically within 24 hours. For urgent requirements, call",
    errorSuffix: "You can also email us directly at",
    genericError: "Something went wrong.",
    /** Display labels for service-need option values (values stay English for the API). */
    serviceNeedLabels: {} as Record<string, string>,
  },
};

export type Dict = typeof en;
