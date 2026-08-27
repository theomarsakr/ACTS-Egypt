import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Drill,
  Fuel,
  HardHat,
  FlaskConical,
  Sprout,
  Cpu,
  BadgeCheck,
  Workflow,
  MapPin,
  ShieldCheck,
  UserCheck,
  Lock,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import PageHeroBackground from "@/components/PageHeroBackground";
import SectionHeading from "@/components/SectionHeading";
import SectorPanel from "@/components/SectorPanel";
import SiteDock from "@/components/SiteDock";
import Counter from "@/components/Counter";
import Tabs, { type TabItem } from "@/components/Tabs";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CardLogoMark from "@/components/ui/CardLogoMark";
import Magnetic from "@/components/ui/Magnetic";
import Container from "@/components/layout/Container";
import { projectClients, engagementHighlights } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "ACTS Projects & Clients in Egypt's Oil, Gas & Power Sector",
  description:
    "For nearly two decades ACTS has been the technical partner of choice for Egypt's largest operators in oil & gas, petrochemicals, power generation and fertilizers.",
  path: "/projects",
});

const categoryIcons: Record<string, typeof Drill> = {
  upstream: Drill,
  midstream: Fuel,
  epc: HardHat,
  petrochemicals: FlaskConical,
  fertilizers: Sprout,
};

const trust = [
  {
    icon: Cpu,
    title: "Technical Expertise",
    text: "In-house engineering support for sizing, selection, and application engineering",
  },
  {
    icon: BadgeCheck,
    title: "Exclusive Representation",
    text: "Sole agency for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright)",
  },
  {
    icon: Workflow,
    title: "End-to-End Support",
    text: "From initial enquiry through commissioning and aftermarket service",
  },
  {
    icon: MapPin,
    title: "Local Presence",
    text: "Responsive, Egypt-based support with deep understanding of local market conditions",
  },
  {
    icon: ShieldCheck,
    title: "Supply Chain Reliability",
    text: "Authentic products with full traceability and factory-backed warranties",
  },
  {
    icon: UserCheck,
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
  const schema = [
    collectionPageSchema({
      name: "ACTS Projects & Clients in Egypt's Oil, Gas & Power Sector",
      description:
        "Two decades of engagements with Egypt's largest operators in oil & gas, petrochemicals, power generation and fertilizers.",
      path: "/projects",
    }),
    breadcrumbSchema([{ name: "Projects & clients", path: "/projects" }]),
  ];

  return (
    <>
      <JsonLd schema={schema} />
      {/* Page hero */}
      <PageHero
        id="overview"
        title="Projects & Clients"
        subtitle="Trusted by Egypt's industry leaders"
        lede="For nearly two decades, the preferred technical partner for Egypt's national oil companies, international EPC contractors, and major industrial manufacturers."
      />

      {/* Stat bar overlapping the hero */}
      <section className="relative z-10 -mt-14 pb-4">
        <Container>
          <Reveal>
            {/* grid-cols-3 was the only unprefixed multi-column grid on the
                site: at 320px each cell got (320-48)/3 - 48(p-6) = ~ 56px of
                content width for "Years serving Egypt's industry". xs (424px)
                is reflow, not removal — all three stats still render, just
                stacked below it. */}
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 grid grid-cols-1 xs:grid-cols-3 divide-y xs:divide-y-0 xs:divide-x divide-gray-100">
              {portfolioStats.map((s) => (
                <div key={s.label} className="p-4 xs:p-6 text-center">
                  <div className="text-fluid-h3 font-extrabold text-navy">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Client portfolio */}
      <section id="portfolio" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our client portfolio"
              title="Browse by Sector"
              subtitle="The operators who bring us their critical equipment"
              lede="Pick a sector to see the companies we supply and support in it."
              ledeClassName="max-w-2xl"
            />
          </Reveal>
          <div className="mt-8">
            <Tabs
              items={projectClients.map((group): TabItem => {
                const Icon = categoryIcons[group.slug] ?? Drill;
                return {
                  id: group.slug,
                  label: group.short,
                  icon: <Icon size={15} />,
                  content: (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="grid lg:grid-cols-5">
                        <SectorPanel
                          src={group.image}
                          alt={group.imageAlt}
                          artwork={group.artwork}
                          imageSize={group.imageSize}
                          icon={Icon}
                        />
                        <div className="lg:col-span-3 p-5 sm:p-8 lg:p-10">
                          <h3 className="text-fluid-h4 font-extrabold text-navy">
                            {group.category}
                          </h3>
                          <div className="mt-5 grid sm:grid-cols-2 gap-3">
                            {group.entries.map((e) => (
                              <SpotlightCard
                                key={e.name}
                                className="card-lift bg-gray-50 rounded-xl border border-gray-200 p-4"
                              >
                                <div className="font-semibold text-navy text-[15px] leading-snug">
                                  {e.name}
                                </div>
                                <div className="mt-1 text-[13px] text-gray-500">
                                  {e.sector}
                                </div>
                              </SpotlightCard>
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
        </Container>
      </section>

      {/* Where we add value */}
      <section id="value" className="scroll-anchor py-10 sm:py-16 bg-gray-50 border-y border-gray-200">
        <Container>
          <Reveal>
            <SectionHeading
              className="max-w-2xl mx-auto"
              align="center"
              tier="md"
              title="Where We Add Value"
              subtitle="The kind of work we support, sector by sector"
              lede="Illustrative of our capabilities, not a record of any specific engagement. See our confidentiality statement below."
            />
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {engagementHighlights.map((h, i) => {
              const Icon = categoryIcons[h.slug] ?? Drill;
              return (
                <Reveal key={h.slug} delay={i * 80}>
                  <SpotlightCard className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                        <Icon size={20} strokeWidth={2.25} />
                      </div>
                      <CardLogoMark />
                    </div>
                    <h3 className="mt-4 text-fluid-h5 font-bold text-navy">{h.title}</h3>
                    <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                      {h.text}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* What clients trust us for */}
      <section id="trust" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="What Clients Trust Us For"
              subtitle="Six reasons the same operators come back"
              lede="Not a product list. These are the things procurement and maintenance teams tell us they buy from ACTS."
            />
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trust.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.title} delay={i * 80}>
                  <SpotlightCard className="group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-brand/40">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <Icon size={20} strokeWidth={2.25} />
                      </span>
                      <CardLogoMark />
                    </div>
                    <h3 className="mt-4 text-fluid-h5 font-bold text-navy">{t.title}</h3>
                    <p className="mt-1.5 text-[15px] text-gray-600 leading-relaxed">
                      {t.text}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Confidentiality */}
      <section id="confidentiality" className="scroll-anchor py-10 sm:py-16 bg-gray-50 border-t border-gray-200">
        <Container width="prose">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-brand-light/60 p-7 md:p-9">
              <div className="flex flex-col sm:flex-row gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/25">
                  <Lock size={22} />
                </span>
                <SectionHeading
                  tier="md"
                  eyebrow="Client confidentiality"
                  title="Confidentiality Statement"
                  subtitle="Why you will not find project specifics on this page"
                  lede="We take our clients' confidentiality seriously. Specific project details, technical data, and operational information are protected under non-disclosure agreements. For further references or detailed project information, please contact us directly."
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA — the exact bookend of this page's own hero: same dark
          band, same PageHeroBackground, so the page opens and closes on one
          frame. The lockup used to be centred behind this heading at 72%
          width, which ran the brand's coloured strokes and the "Advanced …
          Services" strapline straight through the copy and the button row;
          PageHeroBackground holds it clear of the text column instead, which
          is the treatment every other dark band on the site already uses.
          Left-aligned to match the hero and the confidentiality note above
          it, and the brass primary now leads the button row as it does on the
          Products and Industries CTAs. */}
      <section className="relative overflow-hidden bg-navy">
        <PageHeroBackground eager={false} />
        <Container className="relative py-12 sm:py-20 md:py-24">
          <Reveal>
            <div className="max-w-xl lg:max-w-2xl">
              <SectionHeading
                tier="xl"
                tone="dark"
                eyebrow={
                  <>
                    <span className="h-px w-8 bg-amber/50" aria-hidden />
                    Work with ACTS
                  </>
                }
                title="Ready to Partner With Us?"
                subtitle="One technical partner for critical process equipment"
                lede="Join Egypt's most respected operators in choosing ACTS."
              />
              {/* items-start, not the column default of stretch: Magnetic
                  wraps only the primary, so a stretched row would leave the
                  brass button sized to its label inside a full-width wrapper
                  and the ghost button running the full column width. */}
              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Magnetic>
                  <Link
                    href="/quote"
                    className="group inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-xl shadow-navy/40"
                  >
                    Request a quote
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    />
                  </Link>
                </Magnetic>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-white/10 text-white border border-white/25 backdrop-blur hover:bg-white/20 hover:border-white/40 transition-all hover:-translate-y-0.5"
                >
                  Contact us
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <SiteDock
        sections={[
          { id: "overview", label: "Overview", icon: <Briefcase className="h-full w-full" strokeWidth={2.25} /> },
          { id: "portfolio", label: "Client portfolio", icon: <Drill className="h-full w-full" strokeWidth={2.25} /> },
          { id: "value", label: "Where we add value", icon: <Workflow className="h-full w-full" strokeWidth={2.25} /> },
          { id: "trust", label: "Why clients trust us", icon: <ShieldCheck className="h-full w-full" strokeWidth={2.25} /> },
          { id: "confidentiality", label: "Confidentiality", icon: <Lock className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
