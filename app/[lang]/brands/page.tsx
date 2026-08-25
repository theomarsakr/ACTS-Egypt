import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Library, Settings2, ShieldCheck, Thermometer } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import SiteDock from "@/components/SiteDock";
import SpotlightCard from "@/components/ui/SpotlightCard";
import BrandResourceCard from "@/components/brands/BrandResourceCard";
import DocumentLibrary from "@/components/brands/DocumentLibrary";
import Container from "@/components/layout/Container";
import { brands, pastManufacturers } from "@/lib/data";
import { brandCardImages, brandSlugToFolder } from "@/lib/brandProductImages";
import { getBrandDocuments } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Our brands",
  description:
    "Farris Engineering safety relief valves, Dyna-Flo control valves, and EST heat exchanger repair equipment, supplied in Egypt by ACTS as sole agent.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  const brandDocs = getBrandDocuments();
  const docsBySlug = new Map(brandDocs.map((b) => [b.slug, b]));
  const totalDocs = brandDocs.reduce((n, b) => n + b.total, 0);

  return (
    <>
      {/* Page hero */}
      <PageHero
        title="Our Brands"
        subtitle="Three Curtiss-Wright divisions, one local partner"
        lede={
          <>
            Flip any brand card for its brochures and catalogs, browse the full{" "}
            <a href="#document-library" className="text-amber font-semibold hover:underline">
              document library
            </a>{" "}
            of {totalDocs}{" "}PDFs, or{" "}
            <Link href="/contact" className="text-amber font-semibold hover:underline">
              ask us directly
            </Link>
            .
          </>
        }
      />

      {/* Brand sections */}
      <section className="py-16">
        <Container className="space-y-10">
          {brands.map((b, i) => {
            const docs = docsBySlug.get(b.slug);
            // Same normalized product tiles as the homepage brand cards —
            // every frame is the product centered on an identical white canvas.
            const folder = brandSlugToFolder[b.slug];
            return (
              <div key={b.slug} id={b.slug} className="scroll-anchor">
                <Reveal>
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
                    images={folder ? brandCardImages[folder] : undefined}
                    startDelayMs={i * 2200}
                    featured={docs?.featured ?? []}
                    total={docs?.total ?? 0}
                    anchor={docs?.anchor ?? "document-library"}
                  />
                </Reveal>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Past project experience */}
      <section id="past-experience" className="scroll-anchor py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-fluid-h3 font-extrabold tracking-tight text-navy">
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
          {/* Was grid-cols-2 md:grid-cols-4 — a jump straight from 2 to 4
              columns with no sm/lg stage in between, the only sizing this
              file had past its default. */}
          <div className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pastManufacturers.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <SpotlightCard className="card-lift bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                  <div className="text-lg font-bold text-navy">{s.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.sub}</div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Document library */}
      <section
        id="document-library"
        className="scroll-anchor py-16 md:py-20 border-t border-gray-200"
      >
        <Container>
          <Reveal>
            <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
              <Library size={15} /> Resource center
            </div>
            <h2 className="mt-3 text-fluid-h3 font-extrabold tracking-tight text-navy">
              Document Library
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl">
              Every brochure, series catalog, bulletin, installation manual and
              technical procedure from Farris Engineering, Dyna-Flo and EST:{" "}
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
        </Container>
      </section>

      <SiteDock
        sections={[
          { id: "farris-engineering", label: "Farris Engineering", icon: <ShieldCheck className="h-full w-full" strokeWidth={2.25} /> },
          { id: "dyna-flo", label: "Dyna-Flo", icon: <Settings2 className="h-full w-full" strokeWidth={2.25} /> },
          { id: "est", label: "EST", icon: <Thermometer className="h-full w-full" strokeWidth={2.25} /> },
          { id: "past-experience", label: "Past experience", icon: <Clock className="h-full w-full" strokeWidth={2.25} /> },
          { id: "document-library", label: "Document library", icon: <Library className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
