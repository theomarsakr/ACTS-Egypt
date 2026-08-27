import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Gauge,
  Settings2,
  Thermometer,
  Briefcase,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import SiteDock from "@/components/SiteDock";
import Tabs, { type TabItem } from "@/components/Tabs";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ShineBorder } from "@/components/ui/ShineBorder";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/ui/BorderBeam";
import SpecSheet from "@/components/SpecSheet";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/SectionHeading";
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const pillarIcons = [Gauge, Settings2, Thermometer, Briefcase];

export const metadata: Metadata = buildMetadata({
  title: "Industrial Valves, Actuators & Process Equipment in Egypt",
  description:
    "Safety relief and control valves, actuators and instrumentation, heat exchanger and pressure testing equipment, plus aftermarket services — supplied across Egypt by ACTS.",
  path: "/products",
});

const pillars = [
  {
    no: "01",
    title: "Valves",
    sub: "Safety relief, control, and isolation",
    intro:
      "We supply a comprehensive range of industrial valves for isolation, regulation, and overpressure protection, backed by application engineering, sizing, and selection support.",
    rows: [
      {
        category: "Safety Relief Valves",
        types:
          "Direct spring-operated (conventional & balanced-bellows) • Pilot-operated (modulating & pop-action) • Full-nozzle designs",
        applications:
          "Overpressure protection of pressure vessels, piping systems, and process equipment, across upstream, midstream, and refining",
      },
      {
        category: "Control Valves",
        types:
          "Linear sliding-stem (globe & angle) • Rotary (segmented V-ball & full-ball) • Severe-service trims",
        applications:
          "Precise flow, pressure, and temperature control across chemical, petrochemical, and power applications",
      },
      {
        category: "Isolation Valves",
        types: "Butterfly, ball, gate, globe, and check valves",
        applications:
          "On/off service, isolation, and non-return applications across all pipe sizes and pressure classes",
      },
    ],
    support: [
      "Flow sizing (Cv calculations) per ISA/IEC standards",
      "Pressure drop and cavitation analysis",
      "Noise abatement and trim selection",
      "Material compatibility recommendations",
      "API 526/527 compliance verification (safety relief)",
      "Actuator sizing and control loop stability analysis",
    ],
    links: [
      { label: "Farris safety relief valves", href: "/brands/farris-engineering" },
      { label: "Dyna-Flo control valves", href: "/brands/dyna-flo" },
      {
        label: "Farris 2600 Series API 526 relief valve",
        href: "/brands/farris-engineering/products/series-2600",
      },
      {
        label: "Dyna-Flo DF400 eccentric rotary plug valve",
        href: "/brands/dyna-flo/products/dyna-df400",
      },
    ],
  },
  {
    no: "02",
    title: "Actuators & Instrumentation",
    sub: "Actuation, positioning, and process measurement",
    intro:
      "We provide complete actuation and control solutions for precise, reliable valve operation under demanding process conditions.",
    rows: [
      {
        category: "Pneumatic Actuators",
        types:
          "Linear (spring-return & double-acting) • Rotary (scotch-yoke & rack-and-pinion) • Heavy-duty D-Force series",
        applications:
          "Automated valve control for on/off, throttling, and emergency shutdown (ESD) applications",
      },
      {
        category: "Positioners & Transducers",
        types:
          "Digital, HART-ready smart positioners • Pneumatic positioners • I/P transducers",
        applications: "Accurate valve positioning and diagnostics",
      },
      {
        category: "Process Instrumentation",
        types:
          "Pressure controllers • Level controllers • Instrument supply regulators",
        applications: "Loop control and process monitoring",
      },
    ],
    support: [
      "Actuator sizing (torque/thrust calculations) for all valve types",
      "Control loop configuration and tuning support",
      "Positioner calibration and commissioning",
      "Diagnostics setup for predictive maintenance programs",
    ],
    links: [
      { label: "Dyna-Flo actuators & instrumentation", href: "/brands/dyna-flo" },
      {
        label: "Dyna-Flo DFC & DFO spring-diaphragm actuators",
        href: "/brands/dyna-flo/products/dyna-dfc-dfo",
      },
      {
        label: "Siemens PS2 & Dyna-Flo 760 positioners",
        href: "/brands/dyna-flo/products/dyna-positioners",
      },
      {
        label: "Control Air T950XP I/P transducer",
        href: "/brands/dyna-flo/products/dyna-t950xp",
      },
    ],
  },
  {
    no: "03",
    title: "Heat Exchanger & Pressure Testing Equipment",
    sub: "Tube plugging, test plugs, inspection, and sleeving",
    intro:
      "We deliver turnkey solutions for thermal asset integrity and pressure safety by combining engineered products with field services.",
    rows: [
      {
        category: "Tube Plugging Systems",
        types: "Pop-A-Plug® mechanically expanded plugs, rated to 7,000 psi",
        applications:
          "Permanent, weld-free sealing of leaking tubes in heat exchangers, condensers, and boilers",
      },
      {
        category: "Hydrostatic Test & Isolation Plugs",
        types: "GripTight® mechanical gripping plugs, rated to 15,000 psig",
        applications:
          "Pipeline hydrostatic testing, pipe-end sealing, flange-to-pipe weld verification",
      },
      {
        category: "Tube Testing & Inspection Tools",
        types: "G-Series testing guns • Eddy Current (ECT) • IRIS inspection",
        applications:
          "Leak detection, tube wall thickness measurement, pitting assessment",
      },
      {
        category: "Tube Sleeving & Stabilizing",
        types: "Hydra-Loc® hydraulic tube sleeving • Tube stabilizers",
        applications:
          "Restoring damaged tube sections without full retubing",
      },
    ],
    support: [
      "Turnkey field service coordination",
      "Non-destructive evaluation (NDE) and inspection reporting",
      "Engineering recommendations (retube, sleeve, or plug)",
      "Hydrostatic/pneumatic testing with certification documentation",
    ],
    links: [
      { label: "EST heat exchanger solutions", href: "/brands/est" },
      {
        label: "Pop-A-Plug® CPI & Perma tube plugs",
        href: "/brands/est/products/est-cpi-perma",
      },
      {
        label: "GripTight MAX® hydrostatic test plug",
        href: "/brands/est/products/est-griptight-max",
      },
      {
        label: "Hydra-Loc® tube sleeving",
        href: "/brands/est/products/est-hydra-loc",
      },
    ],
  },
];

const advisory = {
  technical: [
    "Feasibility input on new projects and expansions",
    "Product selection grounded in real application experience",
    "Process improvement recommendations",
  ],
  aftermarket: [
    "Preventative maintenance planning and execution",
    "Valve reconditioning and overhaul (safety relief & control valves)",
    "Field troubleshooting and repair support",
    "Re-certification and factory-authorized repair coordination",
  ],
  smart: [
    "Condition monitoring on critical relief and control valves",
    "Digital diagnostics from HART-ready smart positioners",
    "Maintenance driven by data, not just by schedule",
  ],
};

const approach = [
  {
    title: "Single-Point Accountability",
    text: "One dedicated contact for multi-discipline requirements",
  },
  {
    title: "Engineered Solutions",
    text: "Application-specific engineering, not just product supply",
  },
  {
    title: "Local Support",
    text: "Responsive, Egypt-based technical assistance",
  },
  {
    title: "Factory-Backed Quality",
    text: "Exclusive representation of world-class manufacturers",
  },
];

export default function ProductsPage() {
  const schema = [
    collectionPageSchema({
      name: "Industrial Valves, Actuators & Process Equipment in Egypt",
      description:
        "The four capability pillars ACTS supplies and supports across Egyptian industry.",
      path: "/products",
    }),
    breadcrumbSchema([{ name: "Products & services", path: "/products" }]),
    itemListSchema(
      "Products and services ACTS supplies in Egypt",
      pillars.map((p) => ({ name: p.title, path: `/products#${p.no}` }))
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />
      {/* Page hero */}
      <PageHero
        id="overview"
        title="Products & Services"
        subtitle="Four integrated pillars, one partner"
        lede="Critical process equipment supplied, supported, and maintained across Egypt's Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries."
      />

      {/* Pillars */}
      <section id="explore-products" className="scroll-anchor py-16">
        <Container>
          <Reveal>
            <Tabs
              items={[
                ...pillars.map((p, i): TabItem => {
                  const Icon = pillarIcons[i];
                  return {
                    id: p.no,
                    label: p.title,
                    icon: <Icon size={15} />,
                    content: (
                      <div>
                        <SectionHeading
                          tier="md"
                          eyebrow={
                            <>
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-light">
                                <Icon size={14} className="text-brand" strokeWidth={2.25} />
                              </span>
                              Pillar {p.no}
                            </>
                          }
                          title={p.title}
                          subtitle={p.sub}
                          lede={p.intro}
                          ledeClassName="max-w-3xl"
                        />

                        <div className="mt-6">
                          <SpecSheet
                            records={p.rows.map((row) => ({
                              title: row.category,
                              fields: [
                                { label: "Product Types", value: row.types },
                                { label: "Key Applications", value: row.applications },
                              ],
                            }))}
                          />
                        </div>

                        <div className="mt-6 border border-brand/30 rounded-2xl p-6 bg-brand-light">
                          <div className="text-sm font-bold text-navy uppercase tracking-wide">
                            Our support includes
                          </div>
                          <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                            {p.support.map((s) => (
                              <li
                                key={s}
                                className="flex gap-2.5 text-[15px] text-gray-600 leading-relaxed"
                              >
                                <CheckCircle2
                                  size={17}
                                  className="text-brand shrink-0 mt-0.5"
                                />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ),
                  };
                }),
                (() => {
                  const Icon = pillarIcons[3];
                  const groups = [
                    { title: "Technical Advisory", items: advisory.technical },
                    { title: "Aftermarket Services", items: advisory.aftermarket },
                    { title: "Smart Maintenance, Coming Online", items: advisory.smart },
                  ];
                  const item: TabItem = {
                    id: "04",
                    label: "Advisory & Aftermarket",
                    icon: <Icon size={15} />,
                    content: (
                      <div>
                        <SectionHeading
                          tier="md"
                          eyebrow={
                            <>
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-light">
                                <Icon size={14} className="text-brand" strokeWidth={2.25} />
                              </span>
                              Pillar 04
                            </>
                          }
                          title="Technical Advisory & Aftermarket Services"
                          subtitle="Engineering advice, overhaul, and data-led maintenance"
                          lede="Beyond equipment supply, we support customers with engineering advice, maintenance that reduces downtime, and a move toward service driven by data rather than by the calendar."
                          ledeClassName="max-w-3xl"
                        />
                        <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-5">
                          {groups.map((g) => (
                            <SpotlightCard
                              key={g.title}
                              className="card-lift bg-white rounded-2xl border border-brand/30 p-6 shadow-sm"
                            >
                              <div className="text-sm font-bold text-navy uppercase tracking-wide">
                                {g.title}
                              </div>
                              <ul className="mt-3 space-y-2">
                                {g.items.map((s) => (
                                  <li key={s} className="text-[15px] text-gray-600 leading-relaxed">
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </SpotlightCard>
                          ))}
                        </div>
                      </div>
                    ),
                  };
                  return item;
                })(),
              ]}
            />
          </Reveal>

          {/* Deliberately OUTSIDE <Tabs>.
              This page is where a generic query — "control valve supplier
              egypt", "safety relief valve supplier egypt" — lands, and until
              now it linked onward only to /brands and /quote, so none of that
              reached the brand and series pages it spends the whole page
              describing. Putting the links inside the tab panels would not
              have fixed it: Tabs renders only the ACTIVE panel, so three of
              the four pillars' links never appear in the HTML a crawler sees
              (verified against the built /products output). Anchors are
              descriptive rather than "learn more", so both a reader and a
              crawler can tell where each one goes. */}
          <Reveal>
            <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 sm:p-8">
              <SectionHeading
                tier="md"
                eyebrow="Brands & series"
                title="What we supply behind each pillar"
                subtitle="Straight to the manufacturer catalogs and the individual series"
              />
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pillars.map((p) => (
                  <div key={p.no}>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                      {p.title}
                    </div>
                    <ul className="mt-3 space-y-2">
                      {p.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="tap-target group inline-flex items-start gap-1.5 text-[14px] font-semibold text-navy transition-colors hover:text-brand"
                          >
                            {l.label}
                            <ArrowRight
                              size={13}
                              className="mt-1 shrink-0 text-gray-400 transition-colors group-hover:text-brand"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Integrated approach */}
      <section id="approach" className="scroll-anchor py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Our Integrated Approach"
              subtitle="One partner, every discipline"
              lede="Four pillars handled by one team, so a multi-discipline requirement does not become a multi-supplier problem."
            />
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                {/* Brass shimmer rim, radius matched to the card; staggered
                    durations so the four don't pulse in lockstep. */}
                <ShineBorder
                  borderRadius={20}
                  duration={12 + i * 2}
                  className="h-full w-full"
                >
                  <SpotlightCard className="card-lift h-full w-full rounded-xl border border-brand/15 bg-white p-6 shadow-sm">
                    <h3 className="text-fluid-h5 font-bold text-navy">{a.title}</h3>
                    <div className="mt-3 h-0.5 w-8 rounded-full bg-brand/70" />
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                      {a.text}
                    </p>
                  </SpotlightCard>
                </ShineBorder>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <Reveal>
            <BorderBeam className="relative overflow-hidden rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <SectionHeading
                  as="h3"
                  tier="md"
                  tone="dark"
                  title="Need One of These?"
                  subtitle="Browse the brands, or skip straight to a quote"
                  lede="See the manufacturers behind our portfolio, or send us your requirement directly."
                  ledeClassName="max-w-lg"
                />
              </div>
              <div className="relative flex flex-wrap gap-3 shrink-0">
                <Magnetic>
                  <Link
                    href="/brands"
                    className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5"
                  >
                    See our brands
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </Magnetic>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Request a quote
                </Link>
              </div>
            </BorderBeam>
          </Reveal>
        </Container>
      </section>

      <SiteDock
        sections={[
          { id: "overview", label: "Overview", icon: <Compass className="h-full w-full" strokeWidth={2.25} /> },
          { id: "explore-products", label: "Explore products", icon: <Settings2 className="h-full w-full" strokeWidth={2.25} /> },
          { id: "approach", label: "Our approach", icon: <CheckCircle2 className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
