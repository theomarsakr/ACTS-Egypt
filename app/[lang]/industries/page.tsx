import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Flame,
  FlaskConical,
  Zap,
  Droplets,
  Sprout,
  Factory,
  Drill,
  Route,
  Layers,
  TestTubes,
  TestTube,
  Link2,
  Gauge,
  Wind,
  RefreshCw,
  Settings2,
  Waves,
  Network,
  Recycle,
  Thermometer,
  Mountain,
  Package,
  Boxes,
  Wrench,
  ShieldCheck,
  type LucideIcon,
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
import IndustryProductLibrary from "@/components/industries/IndustryProductLibrary";
import Container from "@/components/layout/Container";
import {
  industries,
  industriesSummary,
  getBrand,
  getProductLine,
  productLineAnchorId,
} from "@/lib/data";
import { getIndustryLibrary } from "@/lib/industryLibrary";
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Valves for Oil & Gas, Petrochemical & Power in Egypt",
  description:
    "Engineered valves, flow control and technical support for Egypt's oil & gas, petrochemical, power generation, water treatment and fertilizer plants, from ACTS.",
  path: "/industries",
});

/** Every product line an industry lists, as compact linked chips — used by
 *  the "At a glance" table below. A flatter, brand-unlabeled rendering than
 *  the tab detail view's grouped boxes, sized for a single table cell; both
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

/** One process-area deep dive: the engineering problem, how ACTS solves it,
 *  why that's the right call, and the exact product line(s) behind the
 *  claim — see ApplicationArea in lib/data.ts. Same card-premium/glow-hover/
 *  SpotlightCard idiom as the homepage's "What we do" tiles, so this reads
 *  as the same design system rather than a one-off. */
function ApplicationCard({
  app,
}: {
  app: (typeof industries)[number]["applications"][number];
}) {
  const Icon = applicationIcons[app.area] ?? Wrench;
  return (
    <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="text-fluid-h5 font-bold text-navy">{app.area}</h4>
          <p className="mt-0.5 text-[13px] text-gray-500">{app.scope}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            The challenge
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.challenge}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Our solution
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.solution}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Why it works
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.advantage}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-gray-100 pt-4">
        {app.products.map((ref) => {
          const brand = getBrand(ref.brandSlug);
          const line = brand ? getProductLine(ref.brandSlug, ref.lineTag) : undefined;
          if (!brand || !line) return null;
          return (
            <Link
              key={`${ref.brandSlug}-${ref.lineTag}`}
              href={`/brands/${brand.slug}#${productLineAnchorId(line)}`}
              title={`${brand.name}, ${line.name}: ${line.description}`}
              className="inline-flex items-center pointer-coarse:min-h-11 pointer-coarse:px-3.5 rounded-full border border-brand/35 bg-white px-2.5 py-1 text-[12px] font-semibold text-brand-dark transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
            >
              {ref.lineTag}
            </Link>
          );
        })}
      </div>
    </SpotlightCard>
  );
}

const industryIcons: Record<string, typeof Flame> = {
  "oil-gas": Flame,
  petrochemical: FlaskConical,
  "power-generation": Zap,
  "water-treatment": Droplets,
  fertilizers: Sprout,
  "general-industrial": Factory,
};

/** One icon per process area (keyed by ApplicationArea["area"], unique across
 *  all 25 entries) — a real visual anchor per card instead of 25 identically
 *  shaped cards distinguished only by their headline. */
const applicationIcons: Record<string, LucideIcon> = {
  Upstream: Drill,
  Midstream: Route,
  Refining: Layers,
  Petrochemical: FlaskConical,
  "Olefins production": Flame,
  "Aromatics production": TestTubes,
  Polymers: Link2,
  "Steam generation": Gauge,
  "Gas turbines": Wind,
  "Combined cycle": RefreshCw,
  "Cooling systems": Droplets,
  "Balance of plant": Settings2,
  Desalination: Waves,
  "Municipal water": Network,
  "Industrial wastewater": Recycle,
  "Cooling water systems": Thermometer,
  "Ammonia synthesis": FlaskConical,
  "Urea production": TestTube,
  "Phosphate processing": Mountain,
  "Blending and bagging": Package,
  "Cement production": Boxes,
  "Steel processing": Flame,
  "Glass manufacturing": Thermometer,
  "Pulp & paper": Layers,
  Mining: Drill,
};

/** One icon per brand for the compact "how we support" tiles — reflects
 *  which manufacturer/capability, not decoration. Falls back to ShieldCheck
 *  for the handful of ACTS's-own-service bullets with no brandSlug. */
const supportIcons: Record<string, LucideIcon> = {
  "farris-engineering": Gauge,
  "dyna-flo": Wrench,
  est: Thermometer,
};

export default async function IndustriesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector } = await searchParams;

  const schema = [
    collectionPageSchema({
      name: "Valves for Oil & Gas, Petrochemical & Power in Egypt",
      description:
        "The Egyptian industrial sectors ACTS supplies valves, flow control and technical support to.",
      path: "/industries",
    }),
    breadcrumbSchema([{ name: "Industries", path: "/industries" }]),
    itemListSchema(
      "Industries ACTS serves in Egypt",
      industries.map((i) => ({
        name: i.name,
        path: `/industries?sector=${i.slug}`,
      }))
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
      <section id="explore-industries" className="scroll-anchor py-16">
        <Container>
          <Reveal>
            <Tabs
              key={sector}
              initialId={sector}
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
                        <SectorPanel
                          src={ind.image}
                          alt={ind.imageAlt}
                          artwork={ind.artwork}
                          imageSize={ind.imageSize}
                          icon={Icon}
                        />
                        <div className="lg:col-span-3 p-5 sm:p-8 lg:p-10">
                          <SectionHeading
                            tier="md"
                            title={ind.name}
                            subtitle={ind.tagline}
                            lede={ind.intro}
                          />

                          {/* Compact capability summary — the TL;DR "Key
                              applications" spells out in full below. Icon per
                              brand (not a repeated checkmark) and a 2-up tile
                              grid, deliberately lighter-weight than the
                              chapter below it. */}
                          <div className="mt-8">
                            <h4 className="text-sm font-bold text-navy uppercase tracking-wide">
                              How we support this sector
                            </h4>
                            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                              {ind.howWeSupport.map((h, i) => {
                                const brand = h.brandSlug ? getBrand(h.brandSlug) : undefined;
                                const Icon = h.brandSlug
                                  ? (supportIcons[h.brandSlug] ?? ShieldCheck)
                                  : ShieldCheck;
                                return (
                                  <Reveal key={h.text} delay={i * 60}>
                                    <div className="flex h-full gap-3 rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-brand/30 hover:shadow-sm">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                                        <Icon size={15} />
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

                      {/* Full-width, below the image/intro column rather than
                          squeezed into its 3/5-width — a challenge/solution/
                          advantage breakdown per process area needs the room.
                          This is the chapter; the capability strip above and
                          the index below deliberately read lighter than it. */}
                      <div className="border-t border-gray-100 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
                        <SectionHeading
                          as="h3"
                          tier="md"
                          title="Key Applications"
                          subtitle={`Where ${ind.name} work actually happens`}
                          lede="Process area by process area: the engineering challenge, how we solve it, why that approach is the right one, and the exact product line behind the claim."
                        />
                        <div className="mt-7 grid gap-4 md:grid-cols-2">
                          {ind.applications.map((app, i) => (
                            <Reveal key={app.area} delay={i * 80}>
                              <ApplicationCard app={app} />
                            </Reveal>
                          ))}
                        </div>
                      </div>

                      {/* Closing recap: every line named above, but now
                          answering what the chip grid never did — what this
                          specific line does *in this industry*, not just
                          that it exists. Each line is a dropdown rather than
                          a flat datasheet row, which buys the room to put
                          both of the things a reader wants next behind the
                          line itself: the product, and its PDFs. Before this,
                          the documents lived only on /brands#document-library
                          and had to be searched for by hand. Deliberately the
                          same light label weight as "How we support,"
                          bookending the chapter rather than competing with
                          it. */}
                      <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
                        <h4 className="text-sm font-bold text-navy uppercase tracking-wide">
                          Product &amp; document library
                        </h4>
                        <p className="mt-1 max-w-xl text-[13px] text-gray-500">
                          Every line named above, what it specifically does in{" "}
                          {ind.name}, and, on any line, a link to the product
                          and its brochures, catalogs, and manuals.
                        </p>
                        <div className="mt-5">
                          <IndustryProductLibrary
                            industrySlug={ind.slug}
                            industryName={ind.name}
                            entries={getIndustryLibrary(ind)}
                          />
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
      <section id="at-a-glance" className="scroll-anchor py-16 bg-gray-50 border-t border-gray-200">
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
      <section className="py-16">
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
