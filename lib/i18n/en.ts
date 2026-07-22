/* English dictionary — the canonical shape every locale must satisfy.
   Phase 1 covers the shared chrome (navbar/footer) plus the three
   conversion-path pages: home, contact, and quote. */

export const en = {
  meta: {
    title: "ACTS Egypt — Valves, Flow Control & Process Equipment",
    description:
      "ACTS is Egypt's trusted partner for valves, flow control, and critical process equipment across Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries: sole agent for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright).",
  },

  skipLink: "Skip to main content",

  nav: {
    tagline: "Representing World-Class Engineering Solutions in Egypt.",
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
      "Leave your work email and finish the details on the quote form — our engineers typically respond within 24 hours.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    startQuote: "Start a quote",
    blurb:
      "Advanced Company for Trading Services — Egypt's sole agent for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright) since 2006.",
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
    tagline: "Representing World-Class Engineering Solutions in Egypt.",
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
      badge: "Representing World-Class Engineering Solutions in Egypt.",
      titleA: "Engineering trust into",
      titleB: "every process",
      lede: "Since 2006, ACTS has been Egypt's trusted partner for valves, flow control, and critical process services: the sole agent for Farris Engineering, Dyna-Flo, and EST, all divisions of Curtiss-Wright.",
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
      eyebrow: "What we do",
      title: "Sales, technical support, and aftermarket services",
      lede: "Three areas of industrial process equipment, backed by nearly two decades of relationships built on integrity, speed, and technical expertise.",
      items: [
        {
          title: "Valves, Actuators & Instrumentation",
          text: "Safety relief valves, linear and rotary control valves, actuators, and process instrumentation, supplied and supported end-to-end.",
        },
        {
          title: "Heat Exchanger & Pressure Testing",
          text: "Tube plugging systems for leaking heat exchanger, condenser, and boiler tubes; hydrostatic test and isolation plugs; on-site field services.",
        },
        {
          title: "Technical Consultancy",
          text: "Strategic and operational advisory for industrial clients, including feasibility studies and process improvement.",
        },
      ],
    },
    brands: {
      eyebrow: "Represented brands",
      title: "Three world-class manufacturers. One local partner.",
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
    why: {
      eyebrow: "Why ACTS",
      title: "Built for procurement teams",
      lede: "We know what engineering procurement needs from an industrial equipment supplier — we've been doing it for nearly two decades.",
      exclusive: {
        eyebrow: "Exclusive agency",
        title: "The sole authorized source for three Curtiss-Wright divisions in Egypt",
        text: "Factory-backed pricing, genuine parts, and direct access to manufacturer engineering — without intermediaries.",
        link: "Our brands",
      },
      fast: {
        big: "24",
        unit: "h",
        title: "Fast quotations",
        text: "Send a requirement, get a serious answer — usually within one business day.",
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
        text: "Arkan Plaza, Sheikh Zayed City — supporting sites from the Western Desert to the Gulf of Suez.",
        cta: "Visit or contact us",
      },
    },
    proven: {
      eyebrow: "Proven in the field",
      title: "The work our clients rely on us for",
      lede: "Project specifics stay confidential — these are the engagements Egypt's operators bring to ACTS, from named clients like ENPPI, Petrojet, and Khalda Petroleum.",
      confidential: "Client details confidential ·",
      seeWho: "See who we work with",
      sectors: {
        upstream: "Oil & Gas — Upstream",
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
      title: "Where our equipment works",
      lede: "The sites we support and the equipment we keep running — from the Western Desert to the Gulf of Suez. Tap any photo to view it full-screen.",
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
        sites: "Field sites",
        equipment: "Equipment & services",
      },
      items: [
        { label: "Refining", sub: "Turnaround & outage support" },
        { label: "Overpressure protection", sub: "Farris safety relief valves" },
        { label: "Upstream", sub: "Wellhead & separator protection" },
        { label: "Process control", sub: "Dyna-Flo control valves" },
        { label: "Power generation", sub: "Boiler & turbine systems" },
        { label: "Field services", sub: "EST heat-exchanger repair" },
        { label: "Gas processing", sub: "Pressure regulation & control" },
        { label: "Petrochemical", sub: "Severe-service applications" },
        { label: "Drilling", sub: "Upstream operations" },
      ],
    },
    cta: {
      eyebrow: "Start a conversation",
      title: "Let's talk about your next project",
      lede: "A project, an application question, or an urgent maintenance need — our engineers are ready.",
      quote: "Request a quote",
      contactUs: "Contact us",
    },
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Get in touch with ACTS' sales & technical team, headquartered at Arkan Plaza, Sheikh Zayed City, Giza, Egypt.",
    heroChip: "Contact",
    heroTitle: "Get in touch",
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
      { day: "Sunday – Thursday", hours: "9:00 AM – 5:00 PM (Cairo Time)" },
      { day: "Friday – Saturday", hours: "Closed" },
    ],
    requestQuote: "Request a quote",
    headquarters: "Headquarters",
    openInMaps: "Open in Maps",
    mapTitle: "ACTS headquarters, Arkan Plaza, Sheikh Zayed City, Giza",
    deptChip: "Reach the right team",
    deptTitle: "Departments & direct lines",
    departmentNames: {
      "Quotes & Sales": "Quotes & Sales",
      "General Inquiries": "General Inquiries",
      Marketing: "Marketing",
    } as Record<string, string>,
    specLabels: { phone: "Phone", mobile: "Mobile", fax: "Fax", email: "Email" },
    connectTitle: "Let's Connect",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    locationValue: "Arkan Plaza, Sheikh Zayed City, Giza, Egypt",
  },

  quote: {
    metaTitle: "Request a quote",
    metaDescription:
      "Request a quote for Farris Engineering, Dyna-Flo, and EST products in Egypt. Our application engineers typically respond within 24 hours.",
    heroChip: "Request a quote",
    heroTitle: "Get a quotation",
    lede: "Complete the form below and one of our application engineers will respond with a formal quote, typically within 24 hours.",
    nextTitle: "What Happens Next?",
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
