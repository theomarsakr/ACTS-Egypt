import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  ExternalLink,
  Gauge,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Thermometer,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SiteDock from "@/components/SiteDock";
import Hero from "@/components/home/Hero";
import FieldProof from "@/components/home/FieldProof";
import FieldGallery from "@/components/home/FieldGallery";
import AutoRotateImage from "@/components/home/AutoRotateImage";
import RotatingEarth from "@/components/home/RotatingEarthLazy";
import Parallax from "@/components/home/Parallax";
import ScrollRail from "@/components/home/ScrollRail";
import EgyptReach from "@/components/home/EgyptReach";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CardLogoMark from "@/components/ui/CardLogoMark";
import Magnetic from "@/components/ui/Magnetic";
import ShimmerButton from "@/components/ui/ShimmerButton";
import MeshBlob from "@/components/ui/MeshBlob";
import BorderBeam from "@/components/ui/BorderBeam";
import {
  brands,
  pastManufacturers,
  clients,
  industries,
  industryHref,
  engagementHighlights,
  contact,
} from "@/lib/data";
import { brandCardImages, brandSlugToFolder } from "@/lib/brandProductImages";
import { fill, getDict, localeHref, type Locale } from "@/lib/i18n";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, buildMetadata, itemListSchema } from "@/lib/seo";

// Valves & instrumentation, heat exchanger & pressure testing, aftermarket.
const whatWeDoIcons = [Gauge, Thermometer, Wrench];

/* Gallery photos — labels/subtitles/groups come from the locale dictionary
   (aligned by index); the structural fields live here. Real brand photography
   (manufacturer catalog shots + genuine field-service photos) from the brand
   asset libraries under public/Data, not generic industrial stock.
   EST's "enhanced" folder turned out to be a mix: most of it is AI-generated
   marketing collateral with fabricated or garbled callouts (misspelled specs,
   literal "<IMAGE 0>" prompt leakage), but a handful of files in there are
   plain, uncomposited product photography indistinguishable from the rest of
   the catalog. Each candidate from that folder was opened and read individually
   before inclusion — only ones with zero overlay text/diagrams made the cut. */
const activityBase = [
  {
    src: "/Data/Farris-Valves/images/FARRIS-AFTERMARKET-SERVICES.jpg",
    href: "/brands/farris-engineering",
    aspect: "aspect-[4/5]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/6400.jpg",
    href: "/brands/farris-engineering/products/series-6400",
    aspect: "aspect-square",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/2700.jpg",
    href: "/brands/farris-engineering/products/series-2700",
    aspect: "aspect-[4/3]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/2400.jpg",
    href: "/brands/farris-engineering/products/series-2400",
    aspect: "aspect-[4/5]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/Directional-Control-Valve.jpg",
    href: "/brands/farris-engineering",
    aspect: "aspect-[4/3]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/3800.jpg",
    href: "/brands/farris-engineering/products/series-3800",
    aspect: "aspect-[4/3]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/4200-SERIES-STEAM-SAFETY-VALVE.jpg",
    href: "/brands/farris-engineering/products/series-4200",
    aspect: "aspect-[4/5]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/4700.jpg",
    href: "/brands/farris-engineering/products/series-4700",
    aspect: "aspect-square",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/2600_1.png",
    href: "/brands/farris-engineering/products/series-2600",
    aspect: "aspect-square",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Farris-Valves/images/3800_1.jpg",
    href: "/brands/farris-engineering/products/series-3800",
    aspect: "aspect-[4/3]",
    groupKey: "farris" as const,
  },
  {
    src: "/Data/Dynaflo/images/4000LB-withstickers-2.png",
    href: "/brands/dyna-flo/products/dyna-4000",
    aspect: "aspect-[4/3]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/DFN.png",
    href: "/brands/dyna-flo/products/dyna-dfn",
    aspect: "aspect-[4/5]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/760.png",
    href: "/brands/dyna-flo/products/dyna-positioners",
    aspect: "aspect-square",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/PS2.png",
    href: "/brands/dyna-flo/products/dyna-positioners",
    aspect: "aspect-[4/3]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/control-air-T950XP.png",
    href: "/brands/dyna-flo/products/dyna-t950xp",
    aspect: "aspect-[4/5]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/5000.png",
    href: "/brands/dyna-flo/products/dyna-5000",
    aspect: "aspect-[4/3]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/DFC-DFO_front.png",
    href: "/brands/dyna-flo/products/dyna-dfc-dfo",
    aspect: "aspect-square",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/DFRP_Front.png",
    href: "/brands/dyna-flo/products/dyna-dfrp",
    aspect: "aspect-[4/5]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/DFLP_Front.png",
    href: "/brands/dyna-flo/products/dyna-dflp",
    aspect: "aspect-[4/5]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/Dynaflo/images/DFR220_Front.png",
    href: "/brands/dyna-flo/products/dyna-dfr",
    aspect: "aspect-[4/5]",
    groupKey: "dynaflo" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/Field-Services-2.jpg",
    href: "/brands/est",
    aspect: "aspect-[4/5]",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/Tube-Sleeve-Before-After.png",
    href: "/brands/est",
    aspect: "aspect-square",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/sr-plus-kit-capped.png",
    href: "/brands/est/products/est-smart-ram",
    aspect: "aspect-[4/3]",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/Tooling-Package.png",
    href: "/brands/est",
    aspect: "aspect-[4/3]",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/enhanced/dbb.png",
    href: "/brands/est/products/est-dbb",
    aspect: "aspect-square",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/enhanced/cpi-perma.png",
    href: "/brands/est/products/est-cpi-perma",
    aspect: "aspect-[4/3]",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/enhanced/ram.png",
    href: "/brands/est/products/est-ram",
    aspect: "aspect-[4/3]",
    groupKey: "est" as const,
  },
  {
    src: "/Data/EST/images/Product-Photos/enhanced/griptight-elbow.png",
    href: "/brands/est/products/est-griptight-elbow",
    aspect: "aspect-[4/5]",
    groupKey: "est" as const,
  },
];

/* The homepage sets its own metadata rather than leaning on the layout's.
 * The layout's block is inherited by ~120 pages, so anything page-specific
 * left there leaks everywhere — see the note above `generateMetadata` in
 * app/[lang]/layout.tsx. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(lang);
  return buildMetadata({
    title: dict.meta.title,
    description: dict.meta.description,
    path: "/",
    lang,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "ar" ? "ar" : "en";
  const dict = getDict(lang);
  const hm = dict.home;

  const fieldProofItems = engagementHighlights.map((e) => ({
    slug: e.slug,
    sector: hm.proven.sectors[e.slug] ?? e.slug,
    title: hm.proven.items[e.slug]?.title ?? e.title,
    text: hm.proven.items[e.slug]?.text ?? e.text,
  }));

  const activities = activityBase.map((a, i) => ({
    src: a.src,
    href: a.href,
    aspect: a.aspect,
    label: hm.gallery.items[i]?.label ?? "",
    sub: hm.gallery.items[i]?.sub ?? "",
    group: hm.gallery.groups[a.groupKey],
  }));

  const arrowNudge =
    "transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1";

  /* WebPage + the three brand hubs as an ItemList. The homepage is the entry
     point Google crawls first, so naming the brand pages here — with the same
     `@id`s the layout's Organization node references — is what ties the whole
     ACTS → Curtiss-Wright → Farris/Dyna-Flo/EST → products chain together. */
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: dict.meta.title,
      description: dict.meta.description,
      inLanguage: lang === "ar" ? "ar-EG" : "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: `${SITE_URL}/images/refinery-blue.jpg`,
    },
    itemListSchema(
      "Manufacturers represented by ACTS in Egypt",
      brands.map((b) => ({ name: b.name, path: `/brands/${b.slug}` }))
    ),
  ];

  return (
    <>
      <JsonLd schema={homeSchema} />
      <Hero t={hm.hero} lang={lang} />

      {/* ============ CLIENT MARQUEE ============ */}
      <section className="py-9 sm:py-14 md:py-16 border-b border-gray-100">
        <Reveal>
          <p className="text-center text-[12px] font-bold text-gray-500 uppercase tracking-[0.22em]">
            {hm.marquee}
          </p>
        </Reveal>
        <div className="mt-9 overflow-hidden marquee-mask pause-on-hover" dir="ltr">
          <div className="flex w-max animate-marquee items-start gap-12 pr-12">
            {[...clients, ...clients].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                title={c.name}
                className="logo-tile flex flex-col items-center gap-3 shrink-0 w-44"
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    fill
                    loading="eager"
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
                <div className="text-[13px] font-semibold text-navy/80 text-center leading-tight">
                  {c.short}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section id="what-we-do" className="scroll-anchor py-12 sm:py-20 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl"
              tier="xl"
              title={hm.whatWeDo.title}
              subtitle={hm.whatWeDo.subtitle}
              lede={hm.whatWeDo.lede}
            />
          </Reveal>
          <div className="mt-7 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hm.whatWeDo.items.map((w, i) => {
              const Icon = whatWeDoIcons[i] ?? Gauge;
              return (
                <Reveal
                  key={w.title}
                  delay={i * 100}
                  // Three cards in two columns leaves the third alone beside
                  // an empty half row. Between `sm` and `lg`, where that is
                  // the shape, it takes the full width instead.
                  className={
                    i === hm.whatWeDo.items.length - 1
                      ? "sm:max-lg:col-span-2"
                      : ""
                  }
                >
                  <SpotlightCard className="group card-premium glow-hover h-full p-7">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <Icon size={23} />
                      </div>
                      <CardLogoMark />
                    </div>
                    <h3 className="mt-5 text-fluid-h5 font-bold text-navy">{w.title}</h3>
                    <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                      {w.text}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section id="brands" className="scroll-anchor py-12 sm:py-20 md:py-24 lg:py-28 bg-[#f6f8fb] border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-safe">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                className="max-w-2xl"
                tier="xl"
                title={hm.brands.title}
                subtitle={hm.brands.subtitle}
                lede={hm.brands.lede}
              />
              <Link
                href="/brands"
                className="btn btn-ghost-light px-6 py-3 text-[15px] group"
              >
                {hm.brands.allBrands}
                <ArrowRight size={16} className={arrowNudge} />
              </Link>
            </div>
          </Reveal>
          {/* Stages 1 → 2 → 3 up, like WHAT WE DO above it. Going straight to
              three columns at `md:` put three 224px cards on an iPad portrait
              screen: with the card's own p-7 that leaves 168px of content, so
              "Dyna-Flo Control Valve Services" broke over three lines and the
              footer row wrapped "View products" and "Curtiss-Wright" onto two
              lines each. The 2-up stage gives them 348px at 768 and the third
              column arrives at `lg:`, where there is room for it (307px). */}
          <div className="mt-7 sm:mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((b, i) => {
              // Auto-rotating gallery of normalized card tiles (lead cut-out
              // first) — every frame is the product centered on an identical
              // 5:3 white canvas, so one fit works for all of them.
              const folder = brandSlugToFolder[b.slug];
              const galleryImages = folder ? brandCardImages[folder] : [b.image];
              const meta = hm.brands.meta[b.slug] ?? {
                category: b.category,
                summary: b.summary,
              };
              const hoverZoom =
                "transition-transform duration-500 ease-out group-hover:scale-105";
              return (
              <Reveal key={b.slug} delay={i * 120}>
                <SpotlightCard className="group card-premium glow-hover flex flex-col h-full overflow-hidden !rounded-3xl">
                  <Link
                    href={`/brands/${b.slug}`}
                    className="relative aspect-5/3 block overflow-hidden bg-white border-b border-gray-100"
                  >
                    <AutoRotateImage
                      images={galleryImages}
                      alt={`${b.name} ${b.category.toLowerCase()}`}
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      imgClassName={`object-cover ${hoverZoom}`}
                      intervalMs={8000}
                      startDelayMs={i * 2200}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-white to-transparent" />
                    <div className="absolute bottom-3.5 left-5 text-[11.5px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                      {b.no}
                    </div>
                    {/* The card tiles are generated with this badge's corner
                        treated as a keep-out (see scripts/normalize-brand-cards.mjs),
                        so no product ever runs under it and the badge needs no
                        scrim of its own to stay legible. */}
                    {b.logo && (
                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg shadow-ink/10 ring-1 ring-gray-200/70">
                        <Image
                          src={b.logo}
                          alt={`${b.name} logo`}
                          width={90}
                          height={32}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    {/* The card's own p-5 keeps the 8px of overlay this adds
                        clear of the image link above it, and the line below is
                        a plain category label, not a target. */}
                    <Link href={`/brands/${b.slug}`} className="tap-target block">
                      <h3 className="text-fluid-h5 font-extrabold text-navy transition-colors group-hover:text-brand">
                        {b.name}
                      </h3>
                    </Link>
                    <div className="mt-1 text-sm font-semibold text-brand">
                      {meta.category}
                    </div>
                    <div className="mt-3 flex-1">
                      <p className="text-[15px] text-gray-600 leading-snug line-clamp-3">
                        {meta.summary}
                      </p>
                    </div>
                    {b.bestSellers && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {b.bestSellers.map((s) => (
                          <span
                            key={s}
                            className="text-[11.5px] font-semibold text-brand-dark bg-brand-light rounded-full px-2 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Both are ~110-130px wide and only 20-23px tall, and they
                        share a single row, so the tap-target overlays can only
                        grow downward/upward — there is no vertical neighbour to
                        take taps from, and horizontally each is already well
                        past 44px. Painted row is unchanged. */}
                    <div className="mt-3.5 flex items-center justify-between gap-3">
                      <Link
                        href={`/brands/${b.slug}`}
                        className="tap-target inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition-colors hover:text-brand"
                      >
                        {hm.brands.viewProducts}
                        <ArrowRight size={16} className={arrowNudge} />
                      </Link>
                      <a
                        href={b.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap-target inline-flex items-center gap-1 text-[13px] font-semibold text-gray-500 transition-colors hover:text-brand"
                      >
                        Curtiss-Wright
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
              );
            })}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 text-center text-[14.5px] text-gray-500">
              {fill(hm.brands.pastNote, {
                names: pastManufacturers.map((s) => s.name).join(", "),
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ GLOBAL REACH ============ */}
      <section id="global-reach" className="scroll-anchor relative overflow-hidden bg-ink text-white py-12 sm:py-20 md:py-24 lg:py-28">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <MeshBlob variant="brass" className="w-96 h-96 -top-40 -left-24 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-safe grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal>
            <SectionHeading
              tier="xl"
              tone="dark"
              title={hm.global.title}
              subtitle={hm.global.subtitle}
              lede={hm.global.lede}
              ledeClassName="max-w-lg"
            />
            <div
              className="mt-8 flex flex-wrap gap-2.5"
              style={{ "--chip-count": brands.length } as React.CSSProperties}
            >
              {brands.map((b, i) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  style={{ "--i": i } as React.CSSProperties}
                  className="hero-brand-chip glass-dark rounded-full px-3.5 py-2 text-[13px] font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/70"
                >
                  {b.name}
                  <span className="text-white/40"> · {b.origin.split(" · ")[0]}</span>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="flex justify-center">
            <RotatingEarth width={520} height={520} lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* ============ WHY ACTS — STICKY RAIL + PROOF CARDS ============ */}
      {/* The argument holds still while the evidence moves: the headline and
          CTA pin in a rail on the left, the proof cards travel past them on the
          right. Everything sits at full size in normal document flow — no
          nested scroller, nothing clipped, nothing behind a second gesture. */}
      {/* `overflow-x-clip`, never `overflow-hidden`: hidden would make this
          section the scroll container for the sticky rail inside it, and the
          rail would silently stop sticking. `clip` isn't a scroll container. */}
      <section id="why-acts" className="why-section scroll-anchor relative overflow-x-clip py-14 sm:py-24 md:py-28 lg:py-32">
        <div className="why-backdrop" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-safe">
          <ContainerScroll>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.6fr)] lg:gap-16">
            {/* ---------- Narrative rail ---------- */}
            {/* Sticky only at `lg:`, where there are two columns for it to be
                sticky *within*. It was previously sticky below lg as well,
                dressed as a white panel — a sticky *header* rather than a
                sticky *column*, on the theory that it was the phone-sized
                equivalent of "argument holds still, evidence moves".

                That only works if the argument is short, and this one is not.
                The block is the section title, a three-line display headline, a
                four-line lede and two CTAs: 665px on a 390px-wide phone, 556px
                at 768. Pinned at top-20 on an 844px viewport it left ~99px of
                clearance, and the sticky header on top of that. So the entire
                evidence column — the anchor card and six proof tiles, some
                3,300px of it — travelled through a roughly one-line-tall slot
                behind an opaque panel. The one thing the section exists to show
                was the one thing you could not read.

                There is no version of this that fits: a sticky element has to
                be a small fraction of the viewport, and nothing short of
                cutting the copy gets this under ~200px. Stacked flow is the
                honest phone layout — read the argument once, then scroll the
                evidence at full width — and it is what the two-column
                composition degrades to anyway. `lg:` is byte-identical to
                before. */}
            <div className="self-start lg:sticky lg:top-28">
              <Reveal>
                <SectionHeading
                  tier="xl"
                  title={hm.why.title}
                  subtitle={hm.why.subtitle}
                  lede={hm.why.lede}
                  ledeClassName="max-w-md"
                />
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Magnetic>
                    <ShimmerButton
                      href={localeHref(lang, "/quote")}
                      className="group px-7 py-3.5 text-[15px] shadow-lg shadow-brand/25"
                    >
                      {hm.hero.ctaQuote}
                      <ArrowRight size={17} className={arrowNudge} />
                    </ShimmerButton>
                  </Magnetic>
                  <Link
                    href="/brands"
                    className="tap-target group inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition-colors hover:text-brand"
                  >
                    {hm.why.exclusive.link}
                    <ArrowRight size={16} className={arrowNudge} />
                  </Link>
                </div>
                {/* Renders as a horizontal bar below `lg:` and a vertical
                    one paired with the sticky column from `lg:` up — see
                    ScrollRail's own doc comment for why the orientation
                    itself has to change, not just show/hide. */}
                <ScrollRail className="mt-7 sm:mt-12" />
              </Reveal>
            </div>

            {/* ---------- Proof cards ---------- */}
            <div className="why-bento grid gap-5 sm:grid-cols-2 sm:gap-6">
              {/* Anchor card: the exclusive agency, with the three divisions
                  named — "three divisions" only means something once you can
                  see which three. */}
              <Reveal className="sm:col-span-2">
                <BorderBeam className="glow-hover relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-ink p-5 text-white sm:p-7 md:p-9">
                  <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
                  <MeshBlob variant="brass" className="-right-24 -bottom-32 h-80 w-80" />
                  <div className="dark-vignette" aria-hidden />

                  <div className="relative flex items-start justify-between gap-4">
                    <SectionHeading
                      tier="md"
                      tone="dark"
                      title={hm.why.exclusive.title}
                      subtitle={hm.why.exclusive.subtitle}
                      lede={hm.why.exclusive.text}
                      ledeClassName="max-w-lg"
                    />
                    <span className="sheen motion-ambient shrink-0 rounded-xl bg-white px-3 py-2 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)]">
                      <Image
                        src="/images/curtiss-wright-logo.png"
                        alt="Curtiss-Wright"
                        width={120}
                        height={38}
                        className="h-4.5 w-auto object-contain"
                      />
                    </span>
                  </div>
                  <div className="relative mt-8 border-t border-white/10">
                    {brands.map((b, i) => (
                      <Link
                        key={b.slug}
                        href={`/brands/${b.slug}`}
                        className="group flex items-center gap-4 border-b border-white/10 py-4 transition-colors hover:border-amber/30"
                      >
                        <span className="w-6 text-[11.5px] font-bold text-amber/70 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* Wraps rather than truncates: these names are the
                            point of the card, and a nowrap row would also force
                            the grid track wider than its column. */}
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15.5px] leading-snug font-bold transition-colors group-hover:text-amber">
                            {b.name}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-white/45">
                            {hm.brands.meta[b.slug]?.category ?? b.category}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-white/25 transition-colors group-hover:text-amber rtl:-scale-x-100"
                        />
                      </Link>
                    ))}
                  </div>
                </BorderBeam>
              </Reveal>

              {/* Numeral card: 24h */}
              <Parallax speed={12}>
                <Reveal delay={80} className="h-full">
                  <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-5 sm:p-7 md:p-8">
                    <div className="stat-numeral text-fluid-stat font-extrabold tracking-tight tabular-nums">
                      <span className="digit-rise">
                        {hm.why.fast.big.split("").map((d, i) => (
                          <span key={i} style={{ "--i": i } as React.CSSProperties}>
                            {d}
                          </span>
                        ))}
                      </span>
                      <span className="stat-unit text-brand text-[0.5em]">
                        {hm.why.fast.unit}
                      </span>
                    </div>
                    {/* Copy sits on the card's baseline so a card stretched by
                        its taller neighbour reads composed, not top-heavy. */}
                    <div className="mt-auto pt-5 sm:pt-7">
                      <span className="stat-rule mb-4 block h-px bg-brand/45" aria-hidden />
                      <h3 className="text-fluid-h5 font-bold text-navy">
                        {hm.why.fast.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                        {hm.why.fast.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </Parallax>

              {/* Icon card: engineers */}
              <Parallax speed={-10}>
                <Reveal delay={140} className="h-full">
                  <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-5 sm:p-7 md:p-8">
                    <div className="tile-icon">
                      <Wrench size={21} />
                    </div>
                    <div className="mt-auto pt-5 sm:pt-7">
                      <h3 className="text-fluid-h5 font-bold text-navy">
                        {hm.why.engineers.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                        {hm.why.engineers.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </Parallax>

              {/* Numeral card: since 2006 */}
              <Parallax speed={-12}>
                <Reveal delay={200} className="h-full">
                  <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-5 sm:p-7 md:p-8">
                    <div className="stat-numeral text-fluid-stat font-extrabold tracking-tight tabular-nums">
                      <span className="digit-rise">
                        {hm.why.since.big.split("").map((d, i) => (
                          <span key={i} style={{ "--i": i } as React.CSSProperties}>
                            {d}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-auto pt-5 sm:pt-7">
                      <span className="stat-rule mb-4 block h-px bg-brand/45" aria-hidden />
                      <h3 className="text-fluid-h5 font-bold text-navy">
                        {hm.why.since.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                        {hm.why.since.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </Parallax>

              {/* Icon card: genuine parts */}
              <Parallax speed={10}>
                <Reveal delay={260} className="h-full">
                  <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-5 sm:p-7 md:p-8">
                    <div className="tile-icon">
                      <ShieldCheck size={21} />
                    </div>
                    <div className="mt-auto pt-5 sm:pt-7">
                      <h3 className="text-fluid-h5 font-bold text-navy">
                        {hm.why.genuine.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                        {hm.why.genuine.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </Parallax>

              {/* Industries served — quick-scan chips */}
              <Reveal delay={300} className="sm:col-span-2">
                <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-5 sm:p-7 md:p-9">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.14em] text-brand-dark uppercase">
                    {hm.why.industriesTile.chip}
                  </div>
                  <h3 className="mt-4 text-fluid-h5 font-bold text-navy">
                    {hm.why.industriesTile.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {industries.slice(0, 6).map((ind, i) => (
                      <Link
                        key={ind.slug}
                        // Each sector's own page, not `/industries#<slug>`:
                        // that fragment only ever resolved to the hub's
                        // active tab panel, so five of these six chips
                        // landed on Oil & Gas whatever their label said.
                        href={industryHref(ind.slug)}
                        style={{ "--i": i } as React.CSSProperties}
                        className="chip-in inline-flex items-center pointer-coarse:min-h-11 pointer-coarse:px-4 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-light hover:text-brand"
                      >
                        {dict.industryNames[ind.slug] ?? ind.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/industries"
                    className="tap-target group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[14px] font-bold text-navy transition-colors hover:text-brand"
                  >
                    {hm.why.industriesTile.cta}
                    <ArrowRight size={15} className={arrowNudge} />
                  </Link>
                </SpotlightCard>
              </Reveal>

              {/* Local presence — the copy's claim, mapped. Text and map sit
                  in their own grid columns (stacked below the container
                  query threshold) so the map has dedicated space and can
                  never overlap the copy or the tappable pills, at any
                  breakpoint or hover/focus state. A container query (keyed
                  to this card's own rendered width) drives the split rather
                  than a viewport breakpoint — this tile's width doesn't
                  track the viewport linearly inside the bento grid's
                  scrollable "screen" panel, so `lg:` alone under-sized the
                  text column at plenty of real widths. */}
              <Reveal delay={340} className="sm:col-span-2">
                <SpotlightCard className="card-premium glow-hover @container relative h-full p-5 sm:p-7 md:p-9">
                  <div className="grid gap-6 @[36rem]:grid-cols-[minmax(0,1fr)_15rem] @[36rem]:items-center @[36rem]:gap-8">
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="tile-icon shrink-0">
                          <MapPin size={21} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-fluid-h5 font-bold text-navy">
                            {hm.why.locationTile.title}
                          </h3>
                          <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                            {hm.why.locationTile.text}
                          </p>
                        </div>
                      </div>
                      {/* Direct lines — the two things a procurement engineer
                          actually needs from this card, as tappable targets. */}
                      <div className="mt-6 grid gap-2">
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                        >
                          <Phone size={15} className="shrink-0 text-brand" />
                          <span className="ltr-inline truncate text-[14px] font-semibold text-navy">
                            {contact.phone}
                          </span>
                        </a>
                        <a
                          href={`mailto:${contact.salesEmail}`}
                          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                        >
                          <Mail size={15} className="shrink-0 text-brand" />
                          <span className="ltr-inline truncate text-[14px] font-semibold text-navy">
                            {contact.salesEmail}
                          </span>
                        </a>
                      </div>
                      <Link
                        href={localeHref(lang, "/contact")}
                        className="tap-target group mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-navy transition-colors hover:text-brand"
                      >
                        {hm.why.locationTile.cta}
                        <ArrowRight size={15} className={arrowNudge} />
                      </Link>
                    </div>
                    <div className="mx-auto w-full max-w-56 @[36rem]:max-w-none">
                      <EgyptReach lang={lang} />
                      <p className="mt-2 text-center text-[11.5px] text-gray-400">
                        {hm.why.locationTile.mapHint}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
          </ContainerScroll>
        </div>
      </section>

      {/* ============ PROVEN IN THE FIELD — DARK BAND ============ */}
      {/* Its own chapter: the dark band answers the "Why ACTS" claims above
          with the engagements that back them up, in the same visual language
          as the hero. The translucent carousel card lets the band's blueprint
          grid run through it, so the section reads as one continuous surface. */}
      <section id="proven" className="scroll-anchor relative overflow-hidden bg-ink text-white py-12 sm:py-20 md:py-24 lg:py-28">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <MeshBlob variant="steel" className="w-[30rem] h-[30rem] -top-44 -right-28 opacity-60" />
        <MeshBlob variant="brass" className="w-96 h-96 -bottom-48 -left-28 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl"
              tier="xl"
              tone="dark"
              title={hm.proven.title}
              subtitle={hm.proven.subtitle}
              lede={hm.proven.lede}
            />
          </Reveal>
          <div className="mt-10">
            <FieldProof
              items={fieldProofItems}
              dark
              labels={{
                confidential: hm.proven.confidential,
                seeWho: hm.proven.seeWho,
              }}
            />
          </div>
        </div>
      </section>

      {/* ============ COMPANY GALLERY ============ */}
      <section id="gallery" className="scroll-anchor pb-12 sm:pb-20 md:pb-24 lg:pb-28 pt-12 sm:pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-safe">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <SectionHeading
                  tier="xl"
                  title={hm.gallery.title}
                  subtitle={hm.gallery.subtitle}
                  lede={hm.gallery.lede}
                />
              </div>
              <Link
                href="/projects"
                className="btn btn-ghost-light px-6 py-3 text-[15px] group"
              >
                {hm.gallery.projectsBtn}
                <ArrowRight size={16} className={arrowNudge} />
              </Link>
            </div>
          </Reveal>
          <FieldGallery
            items={activities}
            labels={{
              allPhotos: hm.gallery.allPhotos,
              learnMore: hm.gallery.learnMore,
              closeLabel: hm.gallery.closeLabel,
              prevLabel: hm.gallery.prevLabel,
              nextLabel: hm.gallery.nextLabel,
              openLabel: hm.gallery.openLabel,
              thumbLabel: hm.gallery.thumbLabel,
              dialogLabel: hm.gallery.dialogLabel,
            }}
          />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 blueprint"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 90% at 50% 100%, black 20%, transparent 75%)",
            }}
          />
          <MeshBlob variant="brass" className="w-[40rem] h-[40rem] -bottom-72 left-1/2 -translate-x-1/2" />
          <MeshBlob variant="steel" className="w-96 h-96 -top-48 -right-24 opacity-60" />
          <div className="dark-vignette" />
        </div>
        <div className="relative max-w-4xl mx-auto px-safe py-14 sm:py-24 md:py-28 lg:py-32 text-center">
          <Reveal>
            <SectionHeading
              tier="hero"
              tone="dark"
              align="center"
              title={hm.cta.title}
              subtitle={hm.cta.subtitle}
              lede={hm.cta.lede}
              ledeClassName="mx-auto max-w-xl"
            />
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Magnetic>
                <ShimmerButton
                  href={localeHref(lang, "/quote")}
                  className="group px-8 py-4 text-base shadow-lg shadow-brand/25"
                >
                  {hm.cta.quote}
                  <ArrowRight size={18} className={arrowNudge} />
                </ShimmerButton>
              </Magnetic>
              <Link
                href={localeHref(lang, "/contact")}
                className="btn btn-ghost-dark px-8 py-4 text-base"
              >
                {hm.cta.contactUs}
              </Link>
            </div>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 text-[14.5px] text-white/50">
              {/* Real height rather than a tap-target overlay: below `sm:`
                  this row is `flex-col` with `gap-y-2`, so the two links sit
                  8px apart and 44px overlays would each reach a third of the
                  way into the other. Packed stack — grow the box. */}
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center hover:text-white transition-colors"
              >
                <span className="ltr-inline">{contact.phone}</span>
              </a>
              <span className="hidden sm:block w-px h-4 bg-white/15" />
              <a
                href={`mailto:${contact.salesEmail}`}
                className="inline-flex min-h-11 items-center hover:text-white transition-colors"
              >
                {contact.salesEmail}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick-navigation dock — jumps between this page's own sections. */}
      <SiteDock
        lang={lang}
        sections={[
          { id: "what-we-do", label: hm.whatWeDo.title, icon: <Gauge className="h-full w-full" strokeWidth={2.25} /> },
          { id: "brands", label: hm.brands.title, icon: <Package className="h-full w-full" strokeWidth={2.25} /> },
          { id: "global-reach", label: hm.global.title, icon: <Globe className="h-full w-full" strokeWidth={2.25} /> },
          { id: "why-acts", label: hm.why.title, icon: <ShieldCheck className="h-full w-full" strokeWidth={2.25} /> },
          { id: "proven", label: hm.proven.title, icon: <Briefcase className="h-full w-full" strokeWidth={2.25} /> },
          { id: "gallery", label: hm.gallery.chip, icon: <Camera className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
