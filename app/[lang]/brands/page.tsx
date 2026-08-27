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
import SectionHeading from "@/components/SectionHeading";
import { brands, pastManufacturers } from "@/lib/data";
import { brandCardImages, brandSlugToFolder } from "@/lib/brandProductImages";
import { getBrandDocuments } from "@/lib/documents";
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  // "Our brands" told a searcher nothing. The three manufacturer names are the
  // queries this page can actually win, so they lead.
  title: "Farris, Dyna-Flo & EST — Curtiss-Wright Brands in Egypt",
  description:
    "ACTS is the sole agent in Egypt for three Curtiss-Wright divisions: Farris safety relief valves, Dyna-Flo control valves, and EST heat exchanger and test plugs.",
  path: "/brands",
});

export default function BrandsPage() {
  const brandDocs = getBrandDocuments();
  const docsBySlug = new Map(brandDocs.map((b) => [b.slug, b]));
  const totalDocs = brandDocs.reduce((n, b) => n + b.total, 0);

  /* A CollectionPage whose ItemList is the three brand hubs. This is the node
     that tells Google /brands is the parent of the brand pages rather than
     another page that happens to mention them. */
  const schema = [
    collectionPageSchema({
      name: "Farris, Dyna-Flo & EST — Curtiss-Wright Brands in Egypt",
      description:
        "The three Curtiss-Wright divisions ACTS represents as sole agent in Egypt.",
      path: "/brands",
    }),
    breadcrumbSchema([{ name: "Brands", path: "/brands" }]),
    itemListSchema(
      "Manufacturers represented by ACTS in Egypt",
      brands.map((b) => ({ name: b.name, path: `/brands/${b.slug}` }))
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />
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
      <section className="py-10 sm:py-16">
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
      <section id="past-experience" className="scroll-anchor py-10 sm:py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Past Project Experience"
              subtitle="Manufacturers we have supplied and supported before"
              lede="Beyond our current sole-agency brands, ACTS has worked with the equipment below on past projects, giving our team broad, practical experience across the wider valve and flow-control landscape."
            />
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
        className="scroll-anchor py-10 sm:py-16 md:py-20 border-t border-gray-200"
      >
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={
                <>
                  <Library size={15} /> Resource center
                </>
              }
              title="Document Library"
              subtitle={`Every Farris, Dyna-Flo and EST PDF: ${totalDocs} in all`}
              lede={
                <>
                  Brochures, series catalogs, bulletins, installation manuals and
                  technical procedures. Search, filter by brand or language, and
                  open any document directly. Need something you can&apos;t find?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-brand hover:underline"
                  >
                    Contact our team
                  </Link>
                  .
                </>
              }
              ledeClassName="max-w-3xl"
            />
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
