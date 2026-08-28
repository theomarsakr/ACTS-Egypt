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
      {/* `min-h-90` below `sm` is the phone step, and it is the photo's
          framing that asks for it rather than the spacing: 460px against 353px
          of copy is 107px of height the band does not need, and on a 390px
          screen that forces a 3:2 photograph into a 0.85 box, so `object-fit:
          cover` shows 57% of its width — the plaza reduced to two facades.
          Letting the band sit just off the copy's own height puts 72% of the
          photograph back, which is the same "it is too zoomed in, it does not
          fit" report the About hero had, from the same cause. `sm:min-h-115`
          restores the original from 640px up. */}
      <section className="relative overflow-hidden bg-navy flex items-center min-h-90 sm:min-h-115 md:min-h-140">
        <div className="absolute inset-0 grain" aria-hidden>
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
        {/* w-full is load-bearing: the section is a flex container, so without
            it this div shrink-wraps to its content and mx-auto centres the
            copy instead of aligning it to the max-w-6xl column the rest of the
            site's page heroes use. */}
        <Container className="relative w-full pt-20 pb-10 sm:pt-40 sm:pb-16 md:pt-56 md:pb-20">
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
