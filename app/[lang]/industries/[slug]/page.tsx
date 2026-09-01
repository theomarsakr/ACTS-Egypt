import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, Layers } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectorPanel from "@/components/SectorPanel";
import SectionHeading from "@/components/SectionHeading";
import Container from "@/components/layout/Container";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/ui/BorderBeam";
import JsonLd from "@/components/JsonLd";
import ApplicationCard from "@/components/industries/ApplicationCard";
import IndustryProductLibrary from "@/components/industries/IndustryProductLibrary";
import {
  INDUSTRY_ICON_DEFAULT,
  SUPPORT_ICON_DEFAULT,
  industryIcons,
  supportIcons,
} from "@/components/industries/icons";
import {
  getBrand,
  getIndustry,
  getProductLine,
  industries,
  industryHref,
  productLineAnchorId,
} from "@/lib/data";
import { getIndustryLibrary } from "@/lib/industryLibrary";
import { industrySeo } from "@/lib/industrySeo";
import {
  SITE_URL as siteUrl,
  breadcrumbSchema,
  buildMetadata,
  fullTitle,
  itemListSchema,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  const seo = industrySeo(slug, industry.name, industry.intro);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: industryHref(slug),
    image: industry.image,
    imageAlt: industry.imageAlt,
  });
}

/* One sector, on its own URL.
 *
 * Split out of /industries, which was carrying all six sectors in a single
 * document — 1.6 MB of HTML once every tab panel had to be rendered for the
 * crawler, and one <title> trying to win six different searches. Someone
 * typing "petrochemical valve supplier egypt" and someone typing "power plant
 * safety valve egypt" are different buyers with different plants; they get
 * different pages now.
 *
 * The content is the same data lib/data already held for the tab panel — the
 * intro, the support strip, the application-area chapters, the product and
 * document library — rendered through the same components, so nothing about
 * the design changed. What is new is what only a real page can carry: its own
 * title, description, canonical, breadcrumb and H1, the brands that serve
 * this sector, the neighbouring sectors, and an RFQ that names it.
 */
export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const seo = industrySeo(slug, industry.name, industry.intro);
  const Icon = industryIcons[slug] ?? INDUSTRY_ICON_DEFAULT;
  const url = `${siteUrl}${industryHref(slug)}`;
  const library = getIndustryLibrary(industry);

  // The brands that actually appear in this sector's product lines — not all
  // three by default. Ordered as lib/data lists them for the sector.
  const sectorBrands = industry.productLines
    .map((pl) => getBrand(pl.brandSlug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const others = industries.filter((i) => i.slug !== slug);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: fullTitle(seo.title),
      description: seo.description,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl}/#website` },
      provider: { "@id": `${siteUrl}/#organization` },
      // The process areas this page actually documents. Every name below is a
      // visible h3 on the page — structured data naming sections the page
      // does not have is the fastest route to a manual action.
      about: industry.applications.map((a) => ({
        "@type": "Thing",
        name: `${industry.name} — ${a.area}`,
      })),
    },
    breadcrumbSchema([
      { name: "Industries", path: "/industries" },
      { name: industry.name, path: industryHref(slug) },
    ]),
    itemListSchema(
      `Product lines ACTS supplies to ${industry.name} in Egypt`,
      industry.productLines.flatMap((pl) => {
        const brand = getBrand(pl.brandSlug);
        if (!brand) return [];
        return pl.lines.flatMap(({ tag }) => {
          const line = getProductLine(pl.brandSlug, tag);
          return line
            ? [
                {
                  name: `${brand.name} ${line.name}`,
                  path: `/brands/${brand.slug}#${productLineAnchorId(line)}`,
                },
              ]
            : [];
        });
      })
    ),
  ];

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <Container className="relative pt-12 pb-10 md:pt-16 md:pb-12">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-white/50"
            >
              <Link
                href="/industries"
                className="inline-flex items-center pointer-coarse:min-h-11 transition-colors hover:text-white"
              >
                Industries
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white/80">{industry.name}</span>
            </nav>

            <Link
              href="/industries"
              className="tap-target group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5 rtl:rotate-180"
              />{" "}
              All industries
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-6 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-amber">
                <Icon size={17} />
              </span>
              <span className="text-[13px] font-semibold text-white/60">
                {industry.tagline}
              </span>
            </div>
            <SectionHeading
              as="h1"
              tier="page"
              tone="dark"
              className="mt-3"
              title={seo.heading}
              subtitle={seo.subtitle}
              lede={industry.intro}
              ledeClassName="max-w-3xl"
            />
          </Reveal>
        </Container>
      </section>

      {/* Sector photograph + how we support it */}
      <section className="py-9 sm:py-14">
        <Container>
          <Reveal>
            <SpotlightCard className="card-lift overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-5">
                <SectorPanel
                  src={industry.image}
                  alt={industry.imageAlt}
                  artwork={industry.artwork}
                  imageSize={industry.imageSize}
                  icon={Icon}
                />
                <div className="p-5 sm:p-8 lg:col-span-3 lg:p-10">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
                    How we support {industry.name} in Egypt
                  </h2>
                  <p className="mt-1 max-w-xl text-[13px] text-gray-500">
                    What ACTS actually does on a {industry.name.toLowerCase()}{" "}
                    plant, and which manufacturer sits behind each capability.
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {industry.howWeSupport.map((h, i) => {
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
            </SpotlightCard>
          </Reveal>
        </Container>
      </section>

      {/* Key applications */}
      <section
        id="applications"
        className="scroll-anchor border-t border-gray-200 bg-gray-50/60 py-10 sm:py-16"
      >
        <Container>
          <Reveal>
            <SectionHeading
              as="h2"
              tier="md"
              title="Key Applications"
              subtitle={`Where ${industry.name} work actually happens`}
              lede="Process area by process area: the engineering challenge, how we solve it, why that approach is the right one, and the exact product line behind the claim."
              ledeClassName="max-w-3xl"
            />
          </Reveal>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {industry.applications.map((app, i) => (
              <Reveal key={app.area} delay={i * 80}>
                <ApplicationCard app={app} headingAs="h3" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Product & document library */}
      <section id="products-documents" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              as="h2"
              tier="md"
              eyebrow={
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-light">
                    <FileText size={13} className="text-brand" strokeWidth={2.25} />
                  </span>
                  Products &amp; documentation
                </>
              }
              title={`What we supply into ${industry.name}`}
              subtitle="Every line named above, and its manufacturer literature"
              lede={`Each line opens onto what it specifically does in ${industry.name}, its product page, and its brochures, catalogs and installation manuals.`}
              ledeClassName="max-w-3xl"
            />
          </Reveal>
          <div className="mt-6">
            <IndustryProductLibrary
              industrySlug={industry.slug}
              industryName={industry.name}
              entries={library}
            />
          </div>

          {sectorBrands.length > 0 && (
            <Reveal>
              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 sm:p-8">
                <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                  Brands behind our {industry.name} work
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sectorBrands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/brands/${brand.slug}`}
                      className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm"
                    >
                      <div className="text-[15px] font-bold text-navy transition-colors group-hover:text-brand">
                        {brand.name}
                      </div>
                      <div className="mt-1 text-[12.5px] font-semibold text-brand">
                        {brand.category}
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-gray-600">
                        {brand.seoDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Other sectors */}
      <section className="border-t border-gray-200 bg-gray-50 py-10 sm:py-14">
        <Container>
          <Reveal>
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
              Other industries we serve in Egypt
            </h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {others.map((o) => {
                const OtherIcon = industryIcons[o.slug] ?? INDUSTRY_ICON_DEFAULT;
                return (
                  <Link
                    key={o.slug}
                    href={industryHref(o.slug)}
                    className="group inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                  >
                    <OtherIcon size={14} className="text-brand" />
                    {o.name}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <Container>
          <Reveal>
            <BorderBeam className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-navy p-8 shadow-xl shadow-navy/15 md:flex-row md:items-center md:p-12">
              <div>
                <SectionHeading
                  as="h2"
                  tier="md"
                  tone="dark"
                  title={`Sourcing for a ${industry.name} project?`}
                  subtitle="Sized, quoted, and answered by an engineer"
                  lede="Send us the service conditions and one of our application engineers will follow up, typically within 24 hours."
                  ledeClassName="max-w-lg"
                />
              </div>
              <div className="relative flex shrink-0 flex-wrap gap-3">
                <Magnetic>
                  <Link
                    href="/quote"
                    className="group inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    Request a quote
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1 rtl:rotate-180"
                    />
                  </Link>
                </Magnetic>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Layers size={16} /> All products &amp; services
                </Link>
              </div>
            </BorderBeam>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
