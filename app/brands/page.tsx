import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { brands, pastManufacturers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our brands",
  description:
    "Farris Engineering safety relief valves, Dyna-Flo control valves, and EST heat exchanger repair equipment — supplied in Egypt by ACTS as sole agent.",
};

export default function BrandsPage() {
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
              Sole agent in Egypt
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Our Brands
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Three Curtiss-Wright divisions, one local partner. Pick a brand
              to see its full range, or{" "}
              <Link href="/contact" className="text-amber font-semibold hover:underline">
                ask us directly
              </Link>{" "}
              if you&apos;re not sure what you need.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand sections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {brands.map((b) => (
            <Reveal key={b.slug}>
              <div className="bg-white rounded-2xl border-t-4 border-t-brand border-x border-b border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-500">
                <div className="grid lg:grid-cols-5">
                  <div className="img-zoom relative min-h-56 lg:col-span-2">
                    <Image
                      src={b.image}
                      alt={b.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy/50 to-transparent" />
                    <div className="absolute bottom-4 left-5 text-[12px] font-bold text-white/90 uppercase tracking-widest">
                      {b.no}
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-8 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-navy">
                      {b.name}
                    </h2>
                    <div className="mt-1.5 text-sm font-semibold text-brand">
                      {b.category} · {b.origin.split("·")[0].trim()}
                    </div>
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                      {b.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {b.sectors.map((s) => (
                        <span
                          key={s}
                          className="text-[13px] font-medium text-navy/70 bg-gray-100 rounded-full px-3 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/brands/${b.slug}`}
                        className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-navy text-white hover:bg-navy-700 transition-all hover:-translate-y-0.5"
                      >
                        View {b.productLines.length} product lines
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                      <Link
                        href={`/quote?brand=${b.slug}`}
                        className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white text-navy border border-gray-300 hover:border-navy hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                      >
                        Get a quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Past project experience */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                Past Project Experience
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Beyond our current sole-agency brands, ACTS has supplied and
                supported equipment from the following manufacturers on past
                projects, giving our team broad, practical experience across
                the wider valve and flow-control landscape.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {pastManufacturers.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <div className="card-lift bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                  <div className="text-lg font-bold text-navy">{s.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
