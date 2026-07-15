import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  FlaskConical,
  Zap,
  Droplets,
  Sprout,
  Factory,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Tabs, { type TabItem } from "@/components/Tabs";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import SpecSheet from "@/components/SpecSheet";
import { industries, industriesSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Industries we serve",
  description:
    "ACTS delivers engineered solutions, critical equipment, and technical support across Egypt's most demanding industrial sectors: Oil & Gas, Petrochemical, Power Generation, Water Treatment, Fertilizers, and General Industrial.",
};

const industryIcons: Record<string, typeof Flame> = {
  "oil-gas": Flame,
  petrochemical: FlaskConical,
  "power-generation": Zap,
  "water-treatment": Droplets,
  fertilizers: Sprout,
  "general-industrial": Factory,
};

export default function IndustriesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/power-station.jpg"
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
              Industries we serve
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Engineered for every demanding sector
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              ACTS delivers engineered solutions, critical equipment, and
              technical support across Egypt&apos;s most demanding industrial
              sectors. Our exclusive representation of world-class
              manufacturers, combined with in-house application engineering,
              enables us to address the unique challenges of each industry
              we serve.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Industry tabs */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <Tabs
              items={industries.map((ind): TabItem => {
                const Icon = industryIcons[ind.slug] ?? Factory;
                return {
                  id: ind.slug,
                  label: ind.name,
                  icon: <Icon size={15} />,
                  content: (
                    <SpotlightCard
                      id={ind.slug}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden card-lift"
                    >
                      <div className="grid lg:grid-cols-5">
                        <div className="img-zoom relative min-h-56 lg:col-span-2">
                          <Image
                            src={ind.image}
                            alt={ind.imageAlt}
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
                          <div className="text-sm font-semibold text-brand">
                            {ind.tagline}
                          </div>
                          <h2 className="mt-1.5 text-2xl md:text-3xl font-extrabold text-navy">
                            {ind.name}
                          </h2>
                          <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                            {ind.intro}
                          </p>

                          <div className="mt-6">
                            <div className="text-sm font-bold text-navy uppercase tracking-wide">
                              Key applications
                            </div>
                            <ul className="mt-3 space-y-2">
                              {ind.applications.map((a) => (
                                <li
                                  key={a}
                                  className="flex gap-2.5 text-[15px] text-gray-600 leading-relaxed"
                                >
                                  <CheckCircle2
                                    size={17}
                                    className="text-brand shrink-0 mt-0.5"
                                  />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <div className="text-sm font-bold text-navy uppercase tracking-wide">
                              How we support this sector
                            </div>
                            <ul className="mt-3 space-y-2">
                              {ind.howWeSupport.map((h) => (
                                <li
                                  key={h}
                                  className="flex gap-2.5 text-[15px] text-gray-600 leading-relaxed"
                                >
                                  <CheckCircle2
                                    size={17}
                                    className="text-brand shrink-0 mt-0.5"
                                  />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6 text-[13px] text-gray-600 border rounded-lg px-4 py-3 bg-brand-light border-brand/30">
                            <span className="font-bold text-navy">
                              Relevant product lines:{" "}
                            </span>
                            {ind.productLines}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  ),
                };
              })}
            />
          </Reveal>
        </div>
      </section>

      {/* Summary table */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                At a glance
              </h2>
            </div>
          </Reveal>
          <div className="mt-10">
            <SpecSheet
              records={industriesSummary.map((row) => ({
                title: row.industry,
                fields: [
                  { label: "Key challenges", value: row.challenges },
                  { label: "Our solutions", value: row.solutions },
                ],
              }))}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="border-beam rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  See the brands behind these solutions
                </h3>
                <p className="mt-2 text-[15px] text-white/75 max-w-lg">
                  Every application above is backed by our exclusive
                  Curtiss-Wright agencies: Farris Engineering, Dyna-Flo, and
                  EST.
                </p>
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
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
