import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Gauge,
  LineChart,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Hero from "@/components/home/Hero";
import FieldProof from "@/components/home/FieldProof";
import FieldGallery from "@/components/home/FieldGallery";
import AutoRotateImage from "@/components/home/AutoRotateImage";
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
import {
  brandProductImages,
  brandSlugToFolder,
} from "@/lib/brandProductImages";
import { fill, getDict, localeHref, type Locale } from "@/lib/i18n";

const whatWeDoIcons = [Gauge, Wrench, LineChart];

/* Lead product shot on each brand card — frame 0 of the auto-rotating gallery,
   a clean cut-out on white before the card cycles through the brand's range. */
const brandLeadShots: Record<string, string> = {
  "farris-engineering": "/images/home/bestseller-farris.jpg",
  "dyna-flo": "/images/home/bestseller-dynaflo.jpg",
  est: "/images/home/bestseller-est.jpg",
};

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
      <section className="py-20 md:py-28">
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
      <section className="py-20 md:py-28 bg-[#f6f8fb] border-y border-gray-200/70">
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
              // Auto-rotating gallery: the lead cut-out first, then the brand's
              // full product range from its public/images/<folder>/.
              const folder = brandSlugToFolder[b.slug];
              const lead = brandLeadShots[b.slug];
              const galleryImages = folder
                ? [lead, ...brandProductImages[folder]]
                : [lead ?? b.image];
              const meta = hm.brands.meta[b.slug] ?? {
                category: b.category,
                summary: b.summary,
              };
              // The lead cut-out is a clean product on white → contain it. The
              // datasheet shots carry a branded footer we don't want here → fill
              // + top-anchor so the footer is cropped, leaving just the product.
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
                      imgClassName={`object-cover object-top ${hoverZoom}`}
                      leadSrc={lead}
                      leadClassName={`object-contain p-3 pb-9 ${hoverZoom}`}
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

      {/* ============ WHY ACTS — BENTO ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-brand">{hm.why.eyebrow}</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                {hm.why.title}
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                {hm.why.lede}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Large tile: exclusive agency */}
            <Reveal className="md:col-span-2 lg:row-span-2">
              <div className="border-beam glow-hover relative h-full min-h-[22rem] rounded-3xl overflow-hidden bg-ink text-white border border-white/5 p-8 flex flex-col">
                <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
                <div className="mesh mesh-brass w-80 h-80 -bottom-32 -right-24" aria-hidden />
                <div className="relative flex-1">
                  <div className="eyebrow text-amber">{hm.why.exclusive.eyebrow}</div>
                  <h3 className="mt-4 text-2xl md:text-[1.8rem] font-extrabold tracking-tight leading-tight">
                    {hm.why.exclusive.title}
                  </h3>
                  <p className="mt-4 text-[15.5px] text-white/65 leading-relaxed max-w-md">
                    {hm.why.exclusive.text}
                  </p>
                </div>
                <div className="relative mt-8 flex flex-wrap items-center gap-2.5">
                  {[
                    { src: "/images/farris-logo.png", alt: "Farris Engineering" },
                    { src: "/images/dynaflo-logo.png", alt: "Dyna-Flo" },
                    { src: "/images/curtiss-wright-logo.png", alt: "Curtiss-Wright" },
                  ].map((l) => (
                    <span key={l.src} className="bg-white rounded-xl px-3.5 py-2">
                      <Image
                        src={l.src}
                        alt={l.alt}
                        width={110}
                        height={36}
                        className="h-5.5 w-auto object-contain"
                      />
                    </span>
                  ))}
                  <Link
                    href="/brands"
                    className="ms-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-amber hover:text-white transition-colors"
                  >
                    {hm.why.exclusive.link}{" "}
                    <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Numeral tile: 24h */}
            <Reveal delay={80}>
              <SpotlightCard className="card-premium glow-hover h-full p-7 flex flex-col">
                <div className="text-5xl font-extrabold tracking-tight text-navy tabular-nums">
                  {hm.why.fast.big}
                  <span className="text-brand text-[0.6em]">{hm.why.fast.unit}</span>
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-navy">
                  {hm.why.fast.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  {hm.why.fast.text}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Icon tile: engineers */}
            <Reveal delay={140}>
              <SpotlightCard className="group card-premium glow-hover h-full p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Wrench size={21} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-navy">
                  {hm.why.engineers.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  {hm.why.engineers.text}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Numeral tile: since 2006 */}
            <Reveal delay={200}>
              <SpotlightCard className="card-premium glow-hover h-full p-7 flex flex-col">
                <div className="text-5xl font-extrabold tracking-tight text-navy tabular-nums">
                  {hm.why.since.big}
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-navy">
                  {hm.why.since.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  {hm.why.since.text}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Icon tile: genuine parts */}
            <Reveal delay={260}>
              <SpotlightCard className="group card-premium glow-hover h-full p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <ShieldCheck size={21} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-navy">
                  {hm.why.genuine.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  {hm.why.genuine.text}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Half tile: industries served — quick-scan chips */}
            <Reveal delay={280} className="md:col-span-2">
              <SpotlightCard className="card-premium glow-hover h-full p-7 md:p-8 flex flex-col">
                <div className="inline-flex w-fit items-center gap-2 text-[12.5px] font-bold text-brand-dark uppercase tracking-[0.14em] bg-brand-light rounded-full px-3.5 py-1.5">
                  {hm.why.industriesTile.chip}
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-navy">
                  {hm.why.industriesTile.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {industries.slice(0, 6).map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries#${ind.slug}`}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-gray-600 transition-colors hover:border-brand/40 hover:bg-brand-light hover:text-brand"
                    >
                      {dict.industryNames[ind.slug] ?? ind.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/industries"
                  className="group mt-auto pt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-navy transition-colors hover:text-brand"
                >
                  {hm.why.industriesTile.cta}
                  <ArrowRight size={15} className={arrowNudge} />
                </Link>
              </SpotlightCard>
            </Reveal>

            {/* Half tile: local presence */}
            <Reveal delay={320} className="md:col-span-2">
              <SpotlightCard className="card-premium glow-hover h-full p-7 md:p-8 flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-light text-brand shrink-0">
                    <MapPin size={21} />
                  </div>
                  <h3 className="text-[16px] font-bold text-navy">
                    {hm.why.locationTile.title}
                  </h3>
                </div>
                <p className="mt-3.5 text-[14.5px] text-gray-600 leading-relaxed">
                  {hm.why.locationTile.text}
                </p>
                {/* Direct lines — the two things a procurement engineer
                    actually needs from this card. */}
                <div className="mt-4 flex flex-col gap-1.5 text-[14px] font-semibold">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="w-fit text-gray-600 transition-colors hover:text-brand"
                  >
                    <span className="ltr-inline">{contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${contact.salesEmail}`}
                    className="w-fit text-gray-600 transition-colors hover:text-brand"
                  >
                    {contact.salesEmail}
                  </a>
                </div>
                <Link
                  href={localeHref(lang, "/contact")}
                  className="group mt-auto pt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-navy transition-colors hover:text-brand"
                >
                  {hm.why.locationTile.cta}
                  <ArrowRight size={15} className={arrowNudge} />
                </Link>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PROVEN IN THE FIELD — DARK BAND ============ */}
      {/* Its own chapter: the dark band answers the "Why ACTS" claims above
          with the engagements that back them up, in the same visual language
          as the hero. The translucent carousel card lets the band's blueprint
          grid run through it, so the section reads as one continuous surface. */}
      <section className="relative overflow-hidden bg-ink text-white py-20 md:py-28">
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
      <section className="pb-20 md:pb-28 pt-20 md:pt-28">
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
    </>
  );
}
