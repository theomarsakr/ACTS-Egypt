import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Gauge, Settings2, Thermometer, Briefcase } from "lucide-react";
import Reveal from "@/components/Reveal";
import Tabs, { type TabItem } from "@/components/Tabs";

const pillarIcons = [Gauge, Settings2, Thermometer, Briefcase];

export const metadata: Metadata = {
  title: "Products & services",
  description:
    "ACTS supplies, supports, and maintains critical process equipment across Egypt's Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries: valves, actuators & instrumentation, heat exchanger & pressure testing equipment, and consultancy & aftermarket services.",
};

const pillars = [
  {
    no: "01",
    title: "Valves",
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
  },
  {
    no: "02",
    title: "Actuators & Instrumentation",
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
  },
  {
    no: "03",
    title: "Heat Exchanger & Pressure Testing Equipment",
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
  },
];

const consultancy = {
  strategic: [
    "Feasibility studies for new projects and expansions",
    "Business development advisory for industrial clients",
    "Market entry and procurement strategy",
  ],
  operations: [
    "Process optimization and efficiency improvement",
    "Procurement and outsourcing strategies to reduce costs",
    "Supply chain risk assessment and mitigation",
  ],
  aftermarket: [
    "Preventative maintenance planning and execution",
    "Valve reconditioning and overhaul (safety relief & control valves)",
    "Field troubleshooting and repair support",
    "Dedicated overhaul and testing services (in development)",
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
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/gas-plant.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              Catalog
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Products &amp; Services
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              ACTS supplies, supports, and maintains critical process
              equipment across Egypt&apos;s Oil &amp; Gas, Petrochemical,
              Power Generation, Water Treatment, and Fertilizer industries.
              Our portfolio is organized into four integrated pillars that
              deliver complete solutions, from overpressure protection to
              thermal asset management.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
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
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light">
                            <Icon size={20} className="text-brand" strokeWidth={2.25} />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
                              Pillar {p.no}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                              {p.title}
                            </h2>
                          </div>
                        </div>
                        <p className="mt-4 text-[15px] text-gray-600 leading-relaxed max-w-3xl">
                          {p.intro}
                        </p>

                        <div className="mt-6 overflow-x-auto rounded-2xl border border-brand/30 bg-white shadow-sm card-lift">
                          <table className="w-full text-left text-[15px]">
                            <thead>
                              <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-5 py-3.5 font-bold text-navy w-1/5">
                                  Category
                                </th>
                                <th className="px-5 py-3.5 font-bold text-navy w-2/5">
                                  Product Types
                                </th>
                                <th className="px-5 py-3.5 font-bold text-navy w-2/5">
                                  Key Applications
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.rows.map((row) => (
                                <tr
                                  key={row.category}
                                  className="border-b border-gray-100 last:border-0 align-top hover:bg-gray-50/80 transition-colors"
                                >
                                  <td className="px-5 py-4 font-semibold text-navy">
                                    {row.category}
                                  </td>
                                  <td className="px-5 py-4 text-gray-600">
                                    {row.types}
                                  </td>
                                  <td className="px-5 py-4 text-gray-600">
                                    {row.applications}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
                    { title: "Strategic Consulting", items: consultancy.strategic },
                    { title: "Operations Consulting", items: consultancy.operations },
                    { title: "Aftermarket Services", items: consultancy.aftermarket },
                  ];
                  const item: TabItem = {
                    id: "04",
                    label: "Consultancy & Aftermarket",
                    icon: <Icon size={15} />,
                    content: (
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light">
                            <Icon size={20} className="text-brand" strokeWidth={2.25} />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
                              Pillar 04
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                              Consultancy &amp; Aftermarket Services
                            </h2>
                          </div>
                        </div>
                        <p className="mt-4 text-[15px] text-gray-600 leading-relaxed max-w-3xl">
                          We go beyond equipment supply to offer strategic
                          advisory and lifecycle support that maximizes asset
                          performance and operational efficiency.
                        </p>
                        <div className="mt-6 grid sm:grid-cols-3 gap-5">
                          {groups.map((g) => (
                            <div
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
                            </div>
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
        </div>
      </section>

      {/* Integrated approach */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our integrated approach
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
                One partner, every discipline
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <div className="card-lift h-full bg-white rounded-2xl border-t-4 border-t-brand border-x border-b border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy">{a.title}</h3>
                  <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                    {a.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Need one of these products or services?
                </h3>
                <p className="mt-2 text-[15px] text-white/75 max-w-lg">
                  See the brands behind our portfolio, or send us your
                  requirement directly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
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
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Request a quote
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
