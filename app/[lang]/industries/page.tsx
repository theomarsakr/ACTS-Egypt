import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Factory,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SectorPanel from "@/components/SectorPanel";
import SiteDock from "@/components/SiteDock";
import Tabs, { type TabItem } from "@/components/Tabs";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/ui/BorderBeam";
import SpecSheet from "@/components/SpecSheet";
import Container from "@/components/layout/Container";
import {
  INDUSTRY_ICON_DEFAULT,
  SUPPORT_ICON_DEFAULT,
  industryIcons,
  supportIcons,
} from "@/components/industries/icons";
import {
  industries,
  industriesSummary,
  getBrand,
  getProductLine,
  industryHref,
  productLineAnchorId,
} from "@/lib/data";
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve in Egypt — Oil & Gas, Power, Water",
  description:
    "The six Egyptian sectors ACTS supplies valves and flow control to: oil & gas, petrochemical, power generation, water treatment, fertilizers and general industry.",
  path: "/industries",
});

/** Every product line an industry lists, as compact linked chips — used by
 *  the "At a glance" table below. A flatter, brand-unlabeled rendering than
 *  the sector pages' grouped boxes, sized for a single table cell; both
 *  read off the same industries[].productLines, so they can't drift apart. */
function RelatedProductChips({ industry }: { industry: (typeof industries)[number] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {industry.productLines.flatMap((pl) => {
        const brand = getBrand(pl.brandSlug);
        if (!brand) return [];
        return pl.lines.map(({ tag, note }) => {
          const line = getProductLine(pl.brandSlug, tag);
          if (!line) return null;
          return (
            <Link
              key={`${pl.brandSlug}-${tag}`}
              href={`/brands/${brand.slug}#${productLineAnchorId(line)}`}
              title={`${brand.name}, ${line.name}: ${note}`}
              className="inline-flex items-center pointer-coarse:min-h-11 pointer-coarse:px-3.5 rounded-full border border-brand/35 bg-white px-2.5 py-1 text-[12px] font-semibold text-brand-dark transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
            >
              {tag}
            </Link>
          );
        });
      })}
    </div>
  );
}

/* The industries hub.
 *
 * This page used to be the whole industries section: six tab panels, each
 * carrying that sector's full application chapters and its product/document
 * library. Two things forced the split into /industries/<slug>:
 *
 *   1. Once <Tabs> started rendering every panel into the HTML (so a crawler
 *      could see more than the first sector), the page weighed 1.6 MB — six
 *      chapters and 705 PDF links in one document.
 *   2. One <title>, one <h1> and one canonical cannot win six different
 *      searches. "Petrochemical valve supplier egypt" and "power plant safety
 *      valve egypt" are different buyers with different plants.
 *
 * So the deep material now lives on each sector's own page, and this page
 * keeps the job it was always best at: showing all six side by side and
 * routing you to the right one. Each tab still carries the sector's
 * photograph, its intro, and the capability strip naming the manufacturer
 * behind each line of support — enough to choose from — then hands off.
 *
 * It also no longer reads `searchParams`. Doing so made the route dynamic
 * (rendered per request); with real sector URLs there is nothing left for
 * `?sector=` to do, and proxy.ts 301s the old parameter form to the page it
 * was standing in for.
 */
export default function IndustriesPage() {
  const schema = [
    collectionPageSchema({
      name: "Industries We Serve in Egypt",
      description:
        "The Egyptian industrial sectors ACTS supplies valves, flow control and technical support to.",
      path: "/industries",
    }),
    breadcrumbSchema([{ name: "Industries", path: "/industries" }]),
    itemListSchema(
      "Industries ACTS serves in Egypt",
      industries.map((i) => ({ name: i.name, path: industryHref(i.slug) }))
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />
      {/* Page hero */}
      <PageHero
        id="overview"
        title="Industries We Serve"
        subtitle="Engineered for every demanding sector"
        lede="Engineered solutions, critical equipment, and technical support across Egypt's most demanding industrial sectors, backed by exclusive manufacturer representation and in-house application engineering."
      />

      {/* Industry tabs */}
      <section id="explore-industries" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <Reveal>
            <Tabs
              items={industries.map((ind): TabItem => {
                const Icon = industryIcons[ind.slug] ?? INDUSTRY_ICON_DEFAULT;
                const href = industryHref(ind.slug);
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
                        <SectorPanel
                          src={ind.image}
                          alt={ind.imageAlt}
                          artwork={ind.artwork}
                          imageSize={ind.imageSize}
                          icon={Icon}
                        />
                        <div className="lg:col-span-3 p-5 sm:p-8 lg:p-10">
                          <SectionHeading
                            as="h3"
                            tier="md"
                            title={ind.name}
                            subtitle={ind.tagline}
                            lede={ind.intro}
                          />

                          {/* Compact capability summary. The full chapter —
                              process area by process area, with the product
                              line behind each claim — lives on the sector's
                              own page, linked below. */}
                          <div className="mt-8">
                            <h4 className="text-sm font-bold text-navy uppercase tracking-wide">
                              How we support this sector
                            </h4>
                            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                              {ind.howWeSupport.map((h, i) => {
                                const brand = h.brandSlug ? getBrand(h.brandSlug) : undefined;
                                const SupportIcon =
                                  (h.brandSlug ? supportIcons[h.brandSlug] : undefined) ??
                                  SUPPORT_ICON_DEFAULT;
                                return (
                                  <Reveal key={h.text} delay={i * 60}>
                                    <div className="flex h-full gap-3 rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-brand/30 hover:shadow-sm">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                                        <SupportIcon size={15} />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[13.5px] leading-relaxed text-gray-600">
                                          {h.text}
                                        </p>
                                        {brand && (
                                          <Link
                                            href={`/brands/${brand.slug}#products`}
                                            className="tap-target mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-brand transition-colors hover:text-brand-dark"
                                          >
                                            {brand.name}
                                            <ArrowRight size={10} className="rtl:rotate-180" />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </Reveal>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hand-off to the sector page. Descriptive anchors, not
                          "read more": both the reader and the crawler should
                          be able to tell from the link text which sector it
                          opens and what is on the other side. */}
                      <div className="border-t border-gray-100 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <h4 className="text-fluid-h5 font-bold text-navy">
                              {ind.name} in depth
                            </h4>
                            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-gray-600">
                              {ind.applications.length} process areas —{" "}
                              {ind.applications.map((a) => a.area).join(", ")} —
                              each with the engineering challenge, how we solve
                              it, and the product line and manufacturer
                              documentation behind it.
                            </p>
                          </div>
                          <Magnetic>
                            <Link
                              href={href}
                              className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
                            >
                              {ind.name} valves &amp; flow control
                              <ArrowRight
                                size={15}
                                className="transition-transform group-hover:translate-x-1 rtl:rotate-180"
                              />
                            </Link>
                          </Magnetic>
                        </div>

                        <div className="mt-5 border-t border-gray-200 pt-5">
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                            Product lines we supply into {ind.name}
                          </div>
                          <div className="mt-3">
                            <RelatedProductChips industry={ind} />
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  ),
                };
              })}
            />
          </Reveal>
        </Container>
      </section>

      {/* Summary table */}
      <section id="at-a-glance" className="scroll-anchor py-10 sm:py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="At a Glance"
              subtitle="Every sector, side by side"
              lede="The key challenges each industry brings us, how we solve them, and the product lines behind each answer."
            />
          </Reveal>
          <div className="mt-10">
            <SpecSheet
              records={industriesSummary.map((row) => {
                const industry = industries.find((i) => i.name === row.industry);
                return {
                  title: row.industry,
                  fields: [
                    { label: "Key challenges", value: row.challenges },
                    { label: "Our solutions", value: row.solutions },
                    ...(industry
                      ? [
                          {
                            label: "Related products",
                            value: <RelatedProductChips industry={industry} />,
                            wide: true,
                          },
                          {
                            label: "Full sector page",
                            value: (
                              <Link
                                href={industryHref(industry.slug)}
                                className="tap-target group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand transition-colors hover:text-brand-dark"
                              >
                                {industry.name} valves &amp; flow control in
                                Egypt
                                <ArrowRight
                                  size={13}
                                  className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                                />
                              </Link>
                            ),
                          },
                        ]
                      : []),
                  ],
                };
              })}
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <Container>
          <Reveal>
            <BorderBeam className="rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div>
                <SectionHeading
                  as="h3"
                  tier="md"
                  tone="dark"
                  title="See the Brands Behind These Solutions"
                  subtitle="Farris Engineering, Dyna-Flo, and EST"
                  lede="Every application above is backed by one of our exclusive Curtiss-Wright agencies."
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
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Contact us
                </Link>
              </div>
            </BorderBeam>
          </Reveal>
        </Container>
      </section>

      <SiteDock
        sections={[
          { id: "overview", label: "Overview", icon: <Compass className="h-full w-full" strokeWidth={2.25} /> },
          { id: "explore-industries", label: "Explore industries", icon: <Factory className="h-full w-full" strokeWidth={2.25} /> },
          { id: "at-a-glance", label: "At a glance", icon: <ClipboardList className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
