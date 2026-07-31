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
  LineChart,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
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
import Magnetic from "@/components/ui/Magnetic";
import ShimmerButton from "@/components/ui/ShimmerButton";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import {
  brands,
  pastManufacturers,
  clients,
  industries,
  engagementHighlights,
  contact,
} from "@/lib/data";
import { brandCardImages, brandSlugToFolder } from "@/lib/brandProductImages";
import { fill, getDict, localeHref, type Locale } from "@/lib/i18n";

const whatWeDoIcons = [Gauge, Wrench, LineChart];

/* Gallery photos — labels/subtitles/groups come from the locale dictionary
   (aligned by index); the structural fields live here. */
const activityBase = [
  { src: "/images/refinery-blue.jpg", href: "/industries/oil-gas", aspect: "aspect-[4/5]", groupKey: "sites" as const },
  { src: "/images/farris-relief-valves.jpg", href: "/brands/farris-engineering", aspect: "aspect-[4/3]", groupKey: "equipment" as const },
  { src: "/images/offshore-rig.jpg", href: "/industries/oil-gas", aspect: "aspect-square", groupKey: "sites" as const },
  { src: "/images/dynaflo-control-valve.jpg", href: "/brands/dyna-flo", aspect: "aspect-[4/3]", groupKey: "equipment" as const },
  { src: "/images/power-station.jpg", href: "/industries/power-generation", aspect: "aspect-[4/5]", groupKey: "sites" as const },
  { src: "/images/est-field-service.jpg", href: "/brands/est", aspect: "aspect-[4/3]", groupKey: "equipment" as const },
  { src: "/images/gas-plant.jpg", href: "/industries/oil-gas", aspect: "aspect-square", groupKey: "sites" as const },
  { src: "/images/petrochemical-plant.jpg", href: "/industries/petrochemical", aspect: "aspect-[4/3]", groupKey: "sites" as const },
  { src: "/images/upstream-drilling-rig.jpg", href: "/projects", aspect: "aspect-[4/5]", groupKey: "sites" as const },
];

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
    group:
      a.groupKey === "sites" ? hm.gallery.groups.sites : hm.gallery.groups.equipment,
  }));

  const arrowFlip = "rtl:rotate-180";
  const arrowNudge =
    "transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1";

  return (
    <>
      <Hero t={hm.hero} lang={lang} />

      {/* ============ CLIENT MARQUEE ============ */}
      <section className="py-14 md:py-16 border-b border-gray-100">
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
      <section id="what-we-do" className="scroll-mt-28 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-brand">{hm.whatWeDo.eyebrow}</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                {hm.whatWeDo.title}
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                {hm.whatWeDo.lede}
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hm.whatWeDo.items.map((w, i) => {
              const Icon = whatWeDoIcons[i] ?? Gauge;
              return (
                <Reveal key={w.title} delay={i * 100}>
                  <SpotlightCard className="group card-premium glow-hover h-full p-7">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon size={23} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy">{w.title}</h3>
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
      <section id="brands" className="scroll-mt-28 py-20 md:py-28 bg-[#f6f8fb] border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="eyebrow text-brand">{hm.brands.eyebrow}</div>
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                  {hm.brands.title}
                </h2>
              </div>
              <Link
                href="/brands"
                className="btn btn-ghost-light px-6 py-3 text-[15px] group"
              >
                {hm.brands.allBrands}
                <ArrowRight size={16} className={arrowNudge} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {brands.map((b, i) => {
              // Auto-rotating gallery of normalized card tiles (lead cut-out
              // first) — every frame is the product centered on an identical
              // 15:16 white canvas, so one fit works for all of them.
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
                    className="relative aspect-15/16 block overflow-hidden bg-white border-b border-gray-100"
                  >
                    <AutoRotateImage
                      images={galleryImages}
                      alt={`${b.name} product`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      imgClassName={`object-cover ${hoverZoom}`}
                      intervalMs={8000}
                      startDelayMs={i * 2200}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent" />
                    <div className="absolute bottom-3.5 left-5 text-[11.5px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                      {b.no}
                    </div>
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
                  <div className="p-7 flex flex-col flex-1">
                    <Link href={`/brands/${b.slug}`}>
                      <h3 className="text-xl font-extrabold text-navy transition-colors group-hover:text-brand">
                        {b.name}
                      </h3>
                    </Link>
                    <div className="mt-1 text-sm font-semibold text-brand">
                      {meta.category}
                    </div>
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed flex-1">
                      {meta.summary}
                    </p>
                    {b.bestSellers && (
                      <div className="mt-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          {hm.brands.featured}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {b.bestSellers.map((s) => (
                            <span
                              key={s}
                              className="text-[12.5px] font-semibold text-brand-dark bg-brand-light rounded-full px-2.5 py-1"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Link
                        href={`/brands/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition-colors hover:text-brand"
                      >
                        {hm.brands.viewProducts}
                        <ArrowRight size={16} className={arrowNudge} />
                      </Link>
                      <a
                        href={b.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-500 transition-colors hover:text-brand"
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
      <section id="global-reach" className="scroll-mt-28 relative overflow-hidden bg-ink text-white py-20 md:py-28">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div
          className="mesh mesh-brass w-96 h-96 -top-40 -left-24 opacity-50"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal>
            <div className="eyebrow text-amber">{hm.global.eyebrow}</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
              {hm.global.title}
            </h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-lg">
              {hm.global.lede}
            </p>
            <div
              className="mt-8 flex flex-wrap gap-2.5"
              style={{ "--chip-count": brands.length } as React.CSSProperties}
            >
              {brands.map((b, i) => (
                <span
                  key={b.slug}
                  className="brand-chip glass-dark rounded-full px-3.5 py-2 text-[13px] font-semibold text-white/80"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {b.name}
                  <span className="text-white/40"> · {b.origin.split(" · ")[0]}</span>
                </span>
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
      <section id="why-acts" className="why-section scroll-mt-28 relative overflow-x-clip py-24 md:py-32">
        <div className="why-backdrop" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6">
          <ContainerScroll label={hm.why.eyebrow}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.6fr)] lg:gap-16">
            {/* ---------- Sticky narrative rail ---------- */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="eyebrow text-brand">{hm.why.eyebrow}</div>
                <h2 className="mt-4 text-4xl leading-[1.06] font-extrabold tracking-tight text-balance text-navy md:text-5xl xl:text-[3.3rem]">
                  {hm.why.title}
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
                  {hm.why.lede}
                </p>
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
                    className="group inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition-colors hover:text-brand"
                  >
                    {hm.why.exclusive.link}
                    <ArrowRight size={16} className={arrowNudge} />
                  </Link>
                </div>
                <ScrollRail className="mt-12" />
              </Reveal>
            </div>

            {/* ---------- Proof cards ---------- */}
            <div className="why-bento grid gap-5 sm:grid-cols-2 sm:gap-6">
              {/* Anchor card: the exclusive agency, with the three divisions
                  named — "three divisions" only means something once you can
                  see which three. */}
              <Reveal className="sm:col-span-2">
                <div className="border-beam glow-hover relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-ink p-7 text-white md:p-9">
                  <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
                  <div className="mesh mesh-brass -right-24 -bottom-32 h-80 w-80" aria-hidden />
                  <div className="dark-vignette" aria-hidden />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="eyebrow text-amber">{hm.why.exclusive.eyebrow}</div>
                    <span className="sheen shrink-0 rounded-xl bg-white px-3 py-2 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)]">
                      <Image
                        src="/images/curtiss-wright-logo.png"
                        alt="Curtiss-Wright"
                        width={120}
                        height={38}
                        className="h-4.5 w-auto object-contain"
                      />
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-[1.7rem] leading-[1.14] font-extrabold tracking-tight text-balance md:text-[2.05rem]">
                    {hm.why.exclusive.title}
                  </h3>
                  <p className="relative mt-4 max-w-lg text-[15.5px] leading-relaxed text-white/60">
                    {hm.why.exclusive.text}
                  </p>

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
                </div>
              </Reveal>

              {/* Numeral card: 24h */}
              <Parallax speed={12}>
                <Reveal delay={80} className="h-full">
                  <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-7 md:p-8">
                    <div className="stat-numeral text-[3.4rem] leading-none font-extrabold tracking-tight tabular-nums">
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
                    <div className="mt-auto pt-7">
                      <span className="stat-rule mb-4 block h-px bg-brand/45" aria-hidden />
                      <h3 className="text-[17px] font-bold text-navy">
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
                  <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-7 md:p-8">
                    <div className="tile-icon">
                      <Wrench size={21} />
                    </div>
                    <div className="mt-auto pt-7">
                      <h3 className="text-[17px] font-bold text-navy">
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
                  <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-7 md:p-8">
                    <div className="stat-numeral text-[3.4rem] leading-none font-extrabold tracking-tight tabular-nums">
                      <span className="digit-rise">
                        {hm.why.since.big.split("").map((d, i) => (
                          <span key={i} style={{ "--i": i } as React.CSSProperties}>
                            {d}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-auto pt-7">
                      <span className="stat-rule mb-4 block h-px bg-brand/45" aria-hidden />
                      <h3 className="text-[17px] font-bold text-navy">
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
                  <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-7 md:p-8">
                    <div className="tile-icon">
                      <ShieldCheck size={21} />
                    </div>
                    <div className="mt-auto pt-7">
                      <h3 className="text-[17px] font-bold text-navy">
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
                <SpotlightCard className="card-premium glow-hover flex h-full flex-col p-7 md:p-9">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.14em] text-brand-dark uppercase">
                    {hm.why.industriesTile.chip}
                  </div>
                  <h3 className="mt-4 text-[17px] font-bold text-navy">
                    {hm.why.industriesTile.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {industries.slice(0, 6).map((ind, i) => (
                      <Link
                        key={ind.slug}
                        href={`/industries#${ind.slug}`}
                        style={{ "--i": i } as React.CSSProperties}
                        className="chip-in inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-light hover:text-brand"
                      >
                        {dict.industryNames[ind.slug] ?? ind.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/industries"
                    className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[14px] font-bold text-navy transition-colors hover:text-brand"
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
                <SpotlightCard className="card-premium glow-hover @container relative h-full p-7 md:p-9">
                  <div className="grid gap-6 @[36rem]:grid-cols-[minmax(0,1fr)_15rem] @[36rem]:items-center @[36rem]:gap-8">
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="tile-icon shrink-0">
                          <MapPin size={21} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-bold text-navy">
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
                        className="group mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-navy transition-colors hover:text-brand"
                      >
                        {hm.why.locationTile.cta}
                        <ArrowRight size={15} className={arrowNudge} />
                      </Link>
                    </div>
                    <div className="mx-auto w-full max-w-56 @[36rem]:max-w-none">
                      <EgyptReach />
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
      <section id="proven" className="scroll-mt-28 relative overflow-hidden bg-ink text-white py-20 md:py-28">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div
          className="mesh mesh-steel w-[30rem] h-[30rem] -top-44 -right-28 opacity-60"
          aria-hidden
        />
        <div
          className="mesh mesh-brass w-96 h-96 -bottom-48 -left-28 opacity-50"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-amber">{hm.proven.eyebrow}</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
                {hm.proven.title}
              </h2>
              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                {hm.proven.lede}
              </p>
            </div>
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

      {/* ============ CLIENT TESTIMONIALS ============ */}
      {/* Placeholder content — English only until real quotes are supplied. */}
      {lang !== "ar" && <TestimonialCarousel />}

      {/* ============ COMPANY GALLERY ============ */}
      <section id="gallery" className="scroll-mt-28 pb-20 md:pb-28 pt-20 md:pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-brand-dark uppercase tracking-[0.14em] bg-brand-light rounded-full px-3.5 py-1.5">
                  {hm.gallery.chip}
                </div>
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                  {hm.gallery.title}
                </h2>
                <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                  {hm.gallery.lede}
                </p>
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
          <div className="mesh mesh-brass w-[40rem] h-[40rem] -bottom-72 left-1/2 -translate-x-1/2" />
          <div className="mesh mesh-steel w-96 h-96 -top-48 -right-24 opacity-60" />
          <div className="dark-vignette" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <Reveal>
            <div className="eyebrow text-amber justify-center [&::before]:hidden">
              <span className="w-6.5 h-0.5 rounded bg-current opacity-85" />
              {hm.cta.eyebrow}
              <span className="w-6.5 h-0.5 rounded bg-current opacity-85" />
            </div>
            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] text-balance">
              {hm.cta.title}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl mx-auto">
              {hm.cta.lede}
            </p>
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
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                <span className="ltr-inline">{contact.phone}</span>
              </a>
              <span className="hidden sm:block w-px h-4 bg-white/15" />
              <a
                href={`mailto:${contact.salesEmail}`}
                className="hover:text-white transition-colors"
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
          { id: "what-we-do", label: hm.whatWeDo.eyebrow, icon: <Gauge className="h-full w-full" strokeWidth={2.25} /> },
          { id: "brands", label: hm.brands.eyebrow, icon: <Package className="h-full w-full" strokeWidth={2.25} /> },
          { id: "global-reach", label: hm.global.navLabel, icon: <Globe className="h-full w-full" strokeWidth={2.25} /> },
          { id: "why-acts", label: hm.why.eyebrow, icon: <ShieldCheck className="h-full w-full" strokeWidth={2.25} /> },
          { id: "proven", label: hm.proven.eyebrow, icon: <Briefcase className="h-full w-full" strokeWidth={2.25} /> },
          { id: "gallery", label: hm.gallery.chip, icon: <Camera className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
