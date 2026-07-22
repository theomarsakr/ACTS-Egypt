import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Library } from "lucide-react";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import BrandResourceCard from "@/components/brands/BrandResourceCard";
import DocumentLibrary from "@/components/brands/DocumentLibrary";
import { brands, pastManufacturers } from "@/lib/data";
import { getBrandDocuments } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Our brands",
  description:
    "Farris Engineering safety relief valves, Dyna-Flo control valves, and EST heat exchanger repair equipment, supplied in Egypt by ACTS as sole agent.",
};

export default function BrandsPage() {
  const brandDocs = getBrandDocuments();
  const docsBySlug = new Map(brandDocs.map((b) => [b.slug, b]));
  const totalDocs = brandDocs.reduce((n, b) => n + b.total, 0);

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
            <div className="flex items-center gap-4">
              <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
                Sole agent in Egypt
              </div>
              <div className="bg-white rounded-lg px-3 py-1.5">
                <Image
                  src="/images/curtiss-wright-logo.png"
                  alt="Curtiss-Wright"
                  width={354}
                  height={100}
                  className="h-4 w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Our Brands
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Three Curtiss-Wright divisions, one local partner. Flip any brand
              card for its brochures and catalogs, browse the full{" "}
              <a href="#document-library" className="text-amber font-semibold hover:underline">
                document library
              </a>{" "}
              of {totalDocs}{" "}PDFs, or{" "}
              <Link href="/contact" className="text-amber font-semibold hover:underline">
                ask us directly
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand sections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {brands.map((b) => {
            const docs = docsBySlug.get(b.slug);
            return (
              <Reveal key={b.slug}>
                <BrandResourceCard
                  brand={{
                    slug: b.slug,
                    no: b.no,
                    name: b.name,
                    category: b.category,
                    origin: b.origin,
                    description: b.description,
                    sectors: b.sectors,
                    image: b.image,
                    imageAlt: b.imageAlt,
                    productLinesCount: b.productLines.length,
                  }}
                  featured={docs?.featured ?? []}
                  total={docs?.total ?? 0}
                  anchor={docs?.anchor ?? "document-library"}
                />
              </Reveal>
            );
          })}
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
                <SpotlightCard className="card-lift bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                  <div className="text-lg font-bold text-navy">{s.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.sub}</div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Document library */}
      <section
        id="document-library"
        className="scroll-mt-20 py-16 md:py-20 border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
              <Library size={15} /> Resource center
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
              Document Library
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl">
              Every brochure, series catalog, bulletin, installation manual and
              technical procedure from Farris Engineering, Dyna-Flo and EST —{" "}
              {totalDocs}{" "}PDFs in all. Search, filter by brand or language, and
              open any document directly. Need something you can&apos;t find?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand hover:underline"
              >
                Contact our team
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-9">
              <DocumentLibrary brands={brandDocs} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
