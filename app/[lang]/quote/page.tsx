import type { Metadata } from "next";
import Image from "next/image";
import arkanPlaza from "@/public/images/arkan-plaza.jpg";
import { ClipboardCheck, ListChecks } from "lucide-react";
import RFQForm from "@/components/RFQForm";
import Reveal from "@/components/Reveal";
import SiteDock from "@/components/SiteDock";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CardLogoMark from "@/components/ui/CardLogoMark";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/SectionHeading";
import { getBrand } from "@/lib/data";
import { getDict, type Locale } from "@/lib/i18n";
import { SITE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type PageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ brand?: string; email?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const q = getDict(lang).quote;
  return buildMetadata({
    title: q.metaTitle,
    description: q.metaDescription,
    path: "/quote",
    lang,
  });
}

export default async function QuotePage({ params, searchParams }: PageProps) {
  const [{ lang: rawLang }, { brand: brandSlug, email }] = await Promise.all([
    params,
    searchParams,
  ]);
  const lang: Locale = rawLang === "ar" ? "ar" : "en";
  const dict = getDict(lang);
  const q = dict.quote;
  const brand = brandSlug ? getBrand(brandSlug) : undefined;

  const isAr = lang === "ar";
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}${isAr ? "/ar" : ""}/quote#webpage`,
      url: `${SITE_URL}${isAr ? "/ar" : ""}/quote`,
      name: q.metaTitle,
      description: q.metaDescription,
      inLanguage: isAr ? "ar-EG" : "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([{ name: "Request a quote", path: "/quote" }]),
  ];

  return (
    <>
      <JsonLd schema={schema} />
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy flex items-center min-h-115 md:min-h-140">
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
              eyebrow={q.heroChip}
              title={q.heroTitle}
              subtitle={q.heroSubtitle}
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="hero-copy-shadow mt-6 text-fluid-lede text-white/65 max-w-xl">
              {q.lede}
            </p>
          </Reveal>
        </Container>
      </section>

      <section
        id="form"
        // The dock is a fixed bottom-4 panel; on a short viewport its
        // footprint can sit over the form's last field otherwise. Reads the
        // dock's real published height (lib/hooks.ts's
        // usePublishFloatingNavHeight, read by <Dock>) rather than a fixed
        // guess, so it tracks the dock through its own open/collapse states
        // and at every viewport — not just below one hard-coded breakpoint.
        className="scroll-anchor py-10 sm:py-16 pb-[calc(var(--floating-nav-h,0px)+1.5rem)]"
      >
        <Container className="max-w-2xl">
          <Reveal>
            <RFQForm initialBrand={brand?.name} initialEmail={email} t={dict.rfq} />
          </Reveal>
        </Container>
      </section>

      <section id="next-steps" className="scroll-anchor pb-16">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              align="center"
              tier="md"
              className="mb-8"
              title={q.nextTitle}
              subtitle={q.nextSubtitle}
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {q.steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <SpotlightCard className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  {/* Step label and ACTS mark share the header line, the same
                      way every other card grid on the site is built (about's
                      vision/mission, the homepage tiles, the projects trust
                      cards). Narrower than the standard 104px mark those use,
                      because these tiles sit two-up in a max-w-2xl column: at
                      full size the lockup outweighs the step label beside it
                      and crowds one as long as "2. Technical Review". */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-bold text-brand">{s.step}</div>
                    <CardLogoMark width={72} />
                  </div>
                  <p className="mt-3 text-[15px] text-gray-600">{s.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SiteDock
        lang={lang}
        sections={[
          { id: "form", label: dict.rfq.title, icon: <ClipboardCheck className="h-full w-full" strokeWidth={2.25} /> },
          { id: "next-steps", label: q.nextTitle, icon: <ListChecks className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
