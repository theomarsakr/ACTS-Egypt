import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Building2,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Rocket,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import TimelineTrack from "@/components/TimelineTrack";
import { timeline, mission, values, offices } from "@/lib/data";

const timelineIcons = [Building2, MapPin, GraduationCap, TrendingUp, RefreshCw, Rocket];

export const metadata: Metadata = {
  title: "About us",
  description:
    "Founded in 2006 in Sixth of October City, Giza, ACTS has grown into Egypt's trusted partner for valves, flow control, and critical process equipment.",
};

const aboutStats = [
  { value: 2006, label: "Founded in Giza", raw: true },
  { value: 20, suffix: "+", label: "Years of trade" },
  { value: 4, prefix: "$", suffix: "M", label: "Annual sales by 2016" },
  { value: 1, label: "HQ · Sheikh Zayed City" },
];

const specializations = [
  {
    name: "Farris Engineering: Safety Relief Valves",
    text: "Spring-operated and pilot-operated relief valves for overpressure protection. We support sizing, API 526/527 compliance, and re-certification for upstream, midstream, and refining applications.",
  },
  {
    name: "Dyna-Flo: Control Valves & Actuation",
    text: "Precision control valves, actuators, and positioners. We handle flow sizing (Cv calculations), noise abatement, and severe-service trim selection for stable, accurate control under high pressure drop.",
  },
  {
    name: "EST: Heat Exchanger Maintenance & Pressure Testing",
    text: "Field services for shell-and-tube heat exchangers and condensers, including tube cleaning, inspection (eddy current & IRIS), leak detection, tube plugging (Pop-A-Plug®), sleeving, and retubing, plus hydrostatic pressure testing and pipeline isolation via GripTight®, rated to 15,000 psig.",
  },
];

const howWeOperate = [
  {
    title: "Single-point technical support",
    text: "One dedicated contact who understands both the product and the application.",
  },
  {
    title: "Structured project management",
    text: "Clear documentation and timelines from enquiry to delivery.",
  },
  {
    title: "Consultancy-driven approach",
    text: "Feasibility input and technical advisory, not just transactional sales.",
  },
  {
    title: "Aftermarket accountability",
    text: "Maintenance and reconditioning support built into how we work.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/refinery-blue.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              About ACTS
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
              Nearly two decades of industrial trust
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Advanced Company for Trading Services (ACTS) was founded in 2006
              in Sixth of October City, Giza, and incorporated as a Limited
              Liability Company in 2016. In 2025, ACTS relocated its
              headquarters to Arkan Plaza, Sheikh Zayed City, Giza, Egypt. For
              nearly two decades, we have served the Egyptian market, earning
              the trust of leading operators across Oil &amp; Gas,
              Petrochemicals, Power Generation, Water Treatment, and
              Fertilizers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stat bar */}
      <section className="relative z-10 -mt-10 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 max-md:divide-y max-md:[&>*:nth-child(2n+1)]:border-l-0">
              {aboutStats.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-navy">
                    {s.raw ? (
                      s.value
                    ) : (
                      <Counter
                        value={s.value}
                        prefix={s.prefix ?? ""}
                        suffix={s.suffix ?? ""}
                      />
                    )}
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our journey
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                From trading firm to sole-agency partner
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 relative">
            <TimelineTrack />
            {timeline.map((t, i) => {
              const Icon = timelineIcons[i % timelineIcons.length];
              return (
                <Reveal key={`${t.year}-${t.unit}`} delay={i * 100}>
                  <div className="flex gap-6 pb-8 last:pb-0">
                    <div
                      className={`relative shrink-0 flex items-center justify-center w-9 h-9 rounded-full ring-4 ring-white shadow-sm ${
                        t.now
                          ? "bg-brand text-white pulse-ring"
                          : "bg-white border-2 border-brand text-brand"
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.25} />
                    </div>
                    <div className="card-lift flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-2xl font-extrabold text-navy">
                          {t.year}
                        </span>
                        <span className="text-sm font-semibold rounded-full px-3 py-0.5 bg-brand-light text-brand">
                          {t.unit}
                        </span>
                        {t.now && (
                          <span className="text-[11px] font-bold uppercase tracking-widest text-brand">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-4 pb-16">
        <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Vision
              </div>
              <p className="mt-3 text-lg font-semibold text-navy leading-snug">
                To be Egypt&apos;s most trusted partner for valves, flow
                control, and critical process equipment.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Mission
              </div>
              <p className="mt-3 text-lg font-semibold text-navy leading-snug">
                To create lasting value for our customers, suppliers, and
                employees through technical excellence, ethical business
                practices, and responsive local support.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Goals — navy band */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
                Our goals
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                What we&apos;re working toward
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mission.map((m, i) => (
              <Reveal key={m.num} delay={i * 90}>
                <div className="h-full bg-navy-800 rounded-2xl border border-white/10 p-6 hover:border-amber/50 hover:bg-navy-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-amber font-extrabold flex items-center justify-center">
                    {m.num}
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-[15px] text-white/65">
                    {m.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our values
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                How our values show up in the work
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.name} delay={i * 80}>
                <div className="h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy">{v.name}</h3>
                  <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we specialize in */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                What we specialize in
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                Exclusive agent for three Curtiss-Wright divisions
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                ACTS is the exclusive agent in Egypt for three Curtiss-Wright
                divisions. This gives customers access to an integrated
                portfolio across safety, control, and thermal management.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {specializations.map((s, i) => (
              <Reveal key={s.name} delay={i * 100}>
                <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-navy leading-snug">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <p className="mt-10 text-[15px] text-gray-600 max-w-3xl">
              Our in-house engineering team supports customers from initial
              sizing and selection through post-sales troubleshooting and
              aftermarket service. This combines safety, control, and
              thermal expertise into a single, coordinated offer that meets
              international standards (ASME, PED, API) and reduces
              procurement complexity.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How we operate */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                How we operate
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                Consultancy-driven, not just transactional
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howWeOperate.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <div className="h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy">{h.title}</h3>
                  <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                    {h.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Headquarters */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                  Where to find us
                </div>
                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                  Our headquarters
                </h2>
              </Reveal>
              <div className="mt-8 space-y-5">
                {offices.map((o, i) => (
                  <Reveal key={o.tag} delay={i * 120}>
                    <div className="card-lift bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                        <MapPin size={21} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-brand">
                          {o.tag}
                        </div>
                        <div className="mt-1 text-lg font-bold text-navy">
                          {o.name}
                        </div>
                        <div className="mt-1 text-[15px] text-gray-600">
                          {o.address}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                  >
                    Contact us
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-white text-navy border border-gray-300 hover:border-navy hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                  >
                    Explore our products &amp; services
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <div className="img-zoom relative rounded-2xl overflow-hidden shadow-xl shadow-navy/15 h-100">
                <Image
                  src="/images/gas-plant.jpg"
                  alt="Natural gas wellhead with valve handwheels"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
