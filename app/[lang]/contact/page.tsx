import type { Metadata } from "next";
import Image from "next/image";
import arkanPlaza from "@/public/images/arkan-plaza.jpg";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SiteDock from "@/components/SiteDock";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import SpecSheet from "@/components/SpecSheet";
import MapEmbed from "@/components/MapEmbed";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/SectionHeading";
import { contact, team, departments } from "@/lib/data";
import { getDict, localeHref, type Locale } from "@/lib/i18n";
import { SITE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const c = getDict(lang).contact;
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/contact",
    lang,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "ar" ? "ar" : "en";
  const c = getDict(lang).contact;
  const isAr = lang === "ar";
  const arrowNudge =
    "transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${SITE_URL}${isAr ? "/ar" : ""}/contact#webpage`,
      url: `${SITE_URL}${isAr ? "/ar" : ""}/contact`,
      name: c.metaTitle,
      description: c.metaDescription,
      inLanguage: isAr ? "ar-EG" : "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
  ];

  return (
    <>
      <JsonLd schema={schema} />
      {/* Page hero */}
      {/* The photograph is the backdrop from `sm` up and the band's opening
          plate below it.

          No crop of a 3:2 photograph fits a portrait band — at best it shows
          72% of its width, and widening that only trades the plaza's
          colonnade for its paving — so on a phone it stops being a backdrop
          and becomes a plate at its exact 1264/843, the whole shot, both lit
          signs, the full run of the promenade.

          It leads the band rather than following the copy. Under the copy it
          landed at y=389 of a 627px band on a 664px screen, which put its
          bottom third behind the floating quick-nav: the first thing a reader
          saw of it was a photograph cut off by a toolbar. Above the copy it
          opens fully inside the fold, and the eyebrow -> h1 -> subtitle ->
          lede tier below it is unchanged.

          `sm:` and up is untouched: same band, same crop, same scrim. */}
      <section className="relative overflow-hidden bg-navy flex items-center min-h-115 md:min-h-140">
        <div className="absolute inset-0 grain max-sm:hidden" aria-hidden>
          <Image
            src={arkanPlaza}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            quality={90}
            sizes="100vw"
            className="object-cover object-[50%_42%]"
          />
          <div className="absolute inset-0 hero-scrim" />
        </div>
        {/* What the phone band stands on instead — the same blueprint grid
            and vignette every other dark band on the site carries, so the
            copy is not sitting on flat navy. */}
        <div className="absolute inset-0 sm:hidden" aria-hidden>
          <div className="absolute inset-0 blueprint opacity-50" />
          <div className="dark-vignette" />
        </div>
        {/* w-full is load-bearing: the section is a flex container, so without
            it this div shrink-wraps to its content and mx-auto centres the
            copy instead of aligning it to the max-w-6xl column the rest of the
            site's page heroes use. */}
        {/* `pt-8` is the phone step: 80px of navy above the plate pushed the
            h1 to the fold's edge, and the plate does not need the standoff a
            backdrop-and-copy composition does. `sm:pt-40` is unchanged, where
            the padding is what holds the copy off the photograph behind it. */}
        <Container className="relative w-full pt-8 pb-10 sm:pt-40 sm:pb-16 md:pt-56 md:pb-20">
          {/* The plate. `aspect-1264/843` is the source's own ratio, so
              `object-cover` has nothing left to cut — the same pairing the
              About page's headquarters photo uses. It carries the alt text the
              backdrop cannot: as a backdrop the photograph is decoration, as a
              plate it is content, and it is the only picture of the office on
              a page inviting the reader to visit it.

              The caption is what makes it a plate rather than a decoration:
              a photograph of a plaza means nothing to a reader who has not
              been to Sheikh Zayed City, and naming it turns the picture into
              the answer to "where are you".

              Same `quality={90}` and `sizes` as the layer above, deliberately:
              that layer is `hidden` here rather than unmounted, and a hidden
              <img> is still fetched, so matching both keeps the two srcsets
              resolving to one URL and the browser to one request. */}
          <Reveal>
            <figure className="relative mb-9 aspect-1264/843 overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] ring-1 ring-white/15 sm:hidden">
              <Image
                src={arkanPlaza}
                alt="Arkan Plaza's lit promenade at night, ACTS' headquarters complex in Sheikh Zayed City"
                fill
                loading="eager"
                fetchPriority="high"
                quality={90}
                sizes="100vw"
                className="object-cover"
              />
              {/* Floor for the caption, and it doubles as the plate's own
                  weight along the bottom edge so it reads as a print rather
                  than a pasted rectangle. */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/75 to-transparent"
                aria-hidden
              />
              <figcaption className="absolute inset-x-3 bottom-3 flex items-center gap-2 text-[12.5px] font-semibold text-white/90">
                <MapPin size={14} className="shrink-0 text-amber" />
                <span className="truncate">{c.plateCaption}</span>
              </figcaption>
            </figure>
          </Reveal>
          {/* Eyebrow -> title -> subtitle -> lede, on <PageHero>'s own tier.
              This hero used to run that backwards: a 36->60px amber category
              label above a 24->30px <h1>, so the page's most important line
              was its third-largest. */}
          <Reveal>
            <SectionHeading
              as="h1"
              tier="page"
              tone="dark"
              className="hero-copy-shadow max-w-3xl"
              eyebrow={c.heroChip}
              title={c.heroTitle}
              subtitle={c.heroSubtitle}
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="hero-copy-shadow mt-6 text-fluid-lede text-white/65 max-w-xl">
              {c.lede}{" "}
              <Link
                href={localeHref(lang, "/quote")}
                className="text-amber font-semibold hover:underline"
              >
                {c.quoteInstead}
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="office" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Reveal>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-brand">
                        {c.office.tag}
                      </div>
                      <div className="font-bold text-navy mt-0.5">
                        {c.companyFull}
                      </div>
                      <div className="text-[15px] text-gray-600 mt-0.5">
                        {c.office.name}, {c.office.address}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={90}>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    {c.meetTeam}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {team.map((t) => (
                      <div key={t.name} className="flex items-baseline gap-2 text-[15px]">
                        <span className="font-semibold text-navy">{t.name}</span>
                        <span className="text-gray-500">
                          , {c.teamRoles[t.role] ?? t.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={150}>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    {c.officeHoursTitle}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {c.officeHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-center justify-between text-[15px] text-gray-600"
                      >
                        <span>{h.day}</span>
                        <span className="font-medium text-navy">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={210}>
                <Magnetic>
                  <Link
                    href={localeHref(lang, "/quote")}
                    className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                  >
                    {c.requestQuote}
                    <ArrowRight size={18} className={arrowNudge} />
                  </Link>
                </Magnetic>
              </Reveal>
            </div>

            <Reveal delay={150} className="h-full">
              <div className="flex h-full min-h-100 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
                      <MapPin size={16} />
                    </span>
                    <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-navy">
                      {c.headquarters}
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    {c.openInMaps}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </a>
                </div>
                <MapEmbed
                  src="https://maps.google.com/maps?q=Arkan%20Plaza%2C%20Sheikh%20Zayed%20City%2C%20Giza%2C%20Egypt&z=13&output=embed"
                  title={c.mapTitle}
                  address={c.mapAddress}
                  loadLabel={c.mapLoad}
                  hint={c.mapHint}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Reach the right team */}
      <section id="departments" className="scroll-anchor py-10 sm:py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              eyebrow={c.deptChip}
              title={c.deptTitle}
              subtitle={c.deptSubtitle}
              lede={c.deptLede}
            />
          </Reveal>
          <div className="mt-10">
            <SpecSheet
              records={departments.map((d) => ({
                title: c.departmentNames[d.name] ?? d.name,
                fields: [
                  // These are the page's whole job: on a phone, tapping a
                  // number IS the conversion. They were the smallest targets
                  // on the site — a 14.5px line box, 17px tall — so `tel:`
                  // links you are meant to tap with a thumb were half the
                  // 44px floor everything else on the site now meets.
                  //
                  // `tap-target` rather than real padding: each of these sits
                  // alone in its own <dd>, and the nearest other link is the
                  // next field's value ~50px away centre-to-centre, so a 44px
                  // overlay clears its neighbour with room to spare and the
                  // datasheet's tight field rhythm is preserved exactly.
                  {
                    label: c.specLabels.phone,
                    value: (
                      <a
                        href={`tel:${d.phone.replace(/\s/g, "")}`}
                        className="tap-target hover:text-brand transition-colors"
                      >
                        <span className="ltr-inline">{d.phone}</span>
                      </a>
                    ),
                  },
                  // Spread, not a plain entry: `mobile` is absent on the
                  // departments whose second line was the same number as
                  // `phone` (see the Department type in lib/data.ts), and a
                  // row repeating the number just above it is worse than no
                  // row at all.
                  ...(d.mobile
                    ? [
                        {
                          label: c.specLabels.mobile,
                          value: (
                            <a
                              href={`tel:${d.mobile.replace(/\s/g, "")}`}
                              className="tap-target hover:text-brand transition-colors"
                            >
                              <span className="ltr-inline">{d.mobile}</span>
                            </a>
                          ),
                        },
                      ]
                    : []),
                  {
                    label: c.specLabels.fax,
                    value: <span className="ltr-inline">{d.fax}</span>,
                  },
                  {
                    label: c.specLabels.email,
                    value: (
                      // The exception to the rule above: these stack 2px
                      // apart, so overlays would sit on top of each other and
                      // each address would swallow taps meant for the one
                      // below. Packed rows grow their real box instead — the
                      // same call the chips and filter pills make.
                      <span className="flex flex-col gap-0.5">
                        {d.emails.map((e) => (
                          <a
                            key={e}
                            href={`mailto:${e}`}
                            className="flex min-h-6 items-center pointer-coarse:min-h-11 hover:text-brand transition-colors break-all"
                          >
                            {e}
                          </a>
                        ))}
                      </span>
                    ),
                  },
                ],
              }))}
            />
          </div>
        </Container>
      </section>

      {/* Let's connect */}
      <section id="connect" className="scroll-anchor py-10 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto mb-10 max-w-2xl"
              title={c.connectTitle}
              subtitle={c.connectSubtitle}
              lede={c.connectLede}
            />
          </Reveal>
          {/* sm:grid-cols-3 with no intermediate stage packed each card into
              ~190px in the 640-767px band, holding an email at 15px with no
              wrap escape — break-all below is the other half of that fix. */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-5">
            <Reveal delay={60}>
              <a
                href={`mailto:${contact.infoEmail}`}
                className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.emailLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy break-all">
                    {contact.infoEmail}
                  </div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.phoneLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy">
                    <span className="ltr-inline">{contact.phone}</span>
                  </div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={180}>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza"
                target="_blank"
                rel="noopener noreferrer"
                className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.locationLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy">
                    {c.locationValue}
                  </div>
                </div>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <SiteDock
        lang={lang}
        sections={[
          { id: "office", label: c.headquarters, icon: <MapPin className="h-full w-full" strokeWidth={2.25} /> },
          { id: "departments", label: c.deptChip, icon: <Phone className="h-full w-full" strokeWidth={2.25} /> },
          { id: "connect", label: c.connectTitle, icon: <Mail className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
