import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Drill,
  Fuel,
  HardHat,
  FlaskConical,
  Sprout,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Tabs, { type TabItem } from "@/components/Tabs";
import { projectClients, engagementHighlights } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects & clients",
  description:
    "For nearly two decades, ACTS has been the preferred technical partner for Egypt's most prominent operators in Oil & Gas, Petrochemicals, Power Generation, and Fertilizers.",
};

const categoryIcons: Record<string, typeof Drill> = {
  upstream: Drill,
  midstream: Fuel,
  epc: HardHat,
  petrochemicals: FlaskConical,
  fertilizers: Sprout,
};

const trust = [
  {
    title: "Technical Expertise",
    text: "In-house engineering support for sizing, selection, and application engineering",
  },
  {
    title: "Exclusive Representation",
    text: "Sole agency for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright)",
  },
  {
    title: "End-to-End Support",
    text: "From initial enquiry through commissioning and aftermarket service",
  },
  {
    title: "Local Presence",
    text: "Responsive, Egypt-based support with deep understanding of local market conditions",
  },
  {
    title: "Supply Chain Reliability",
    text: "Authentic products with full traceability and factory-backed warranties",
  },
  {
    title: "Project Accountability",
    text: "Single-point coordination for multi-discipline requirements",
  },
];

const totalClients = projectClients.reduce((n, g) => n + g.entries.length, 0);

const portfolioStats = [
  { value: totalClients, suffix: "+", label: "Named clients across sectors" },
  { value: projectClients.length, suffix: "", label: "Industry categories" },
  { value: 20, suffix: "+", label: "Years serving Egypt's industry" },
];

export default function ProjectsPage() {
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
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              Projects &amp; Clients
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Trusted by Egypt&apos;s industry leaders
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              For nearly two decades, ACTS has been the preferred technical
              partner for Egypt&apos;s most prominent operators in Oil &amp;
              Gas, Petrochemicals, Power Generation, and Fertilizers. Our
              clients include national oil companies, international EPC
              contractors, and major industrial manufacturers — all of whom
              rely on our technical expertise, exclusive manufacturer
              representation, and commitment to quality.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stat bar overlapping the hero */}
      <section className="relative z-10 -mt-14 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
              {portfolioStats.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-navy">
                    <Counter value={s.value} suffix={s.suffix} />
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

      {/* Client portfolio */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
              Our client portfolio
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
              Browse by sector
            </h2>
          </Reveal>
          <div className="mt-8">
            <Tabs
              items={projectClients.map((group): TabItem => {
                const Icon = categoryIcons[group.slug] ?? Drill;
                return {
                  id: group.slug,
                  label: group.category.split("—")[0].trim(),
                  icon: <Icon size={15} />,
                  content: (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="grid lg:grid-cols-5">
                        <div className="img-zoom relative min-h-56 lg:col-span-2">
                          <Image
                            src={group.image}
                            alt={group.imageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-navy/50 to-transparent" />
                          <div className="absolute top-4 left-4 flex items-center justify-center w-11 h-11 rounded-xl bg-brand shadow-lg">
                            <Icon size={20} className="text-white" strokeWidth={2.25} />
                          </div>
                        </div>
                        <div className="lg:col-span-3 p-8 md:p-10">
                          <h3 className="text-xl font-extrabold text-navy">
                            {group.category}
                          </h3>
                          <div className="mt-5 grid sm:grid-cols-2 gap-3">
                            {group.entries.map((e) => (
                              <div
                                key={e.name}
                                className="card-lift bg-gray-50 rounded-xl border border-gray-200 p-4"
                              >
                                <div className="font-semibold text-navy text-[15px] leading-snug">
                                  {e.name}
                                </div>
                                <div className="mt-1 text-[13px] text-gray-500">
                                  {e.sector}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                };
              })}
            />
          </div>
        </div>
      </section>

      {/* Where we add value */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Where we add value
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
                The kind of work we support, sector by sector
              </h2>
              <p className="mt-4 text-[15px] text-gray-600">
                Illustrative of our capabilities, not a record of any specific
                engagement — see our confidentiality statement below.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {engagementHighlights.map((h, i) => {
              const Icon = categoryIcons[h.slug] ?? Drill;
              return (
                <Reveal key={h.slug} delay={i * 80}>
                  <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                      <Icon size={20} strokeWidth={2.25} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-navy">{h.title}</h3>
                    <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What clients trust us for */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                What Our Clients Trust Us For
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trust.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <div className="flex gap-3 text-[15px] text-gray-600 leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-navy">{t.title}</span>
                    {" — "}
                    {t.text}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Confidentiality */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy">
              Confidentiality Statement
            </h2>
            <p className="mt-4 text-[15px] text-gray-600 leading-relaxed">
              We take our clients&apos; confidentiality seriously. Specific
              project details, technical data, and operational information
              are protected under non-disclosure agreements. For further
              references or detailed project information, please contact us
              directly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/gas-plant.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Ready to partner with us?
            </h2>
            <p className="mt-5 text-lg text-white/75 max-w-xl mx-auto">
              Join Egypt&apos;s most respected operators in choosing ACTS as
              your trusted technical partner for critical process equipment.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                Contact us
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-xl shadow-navy/40"
              >
                Request a quote
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
