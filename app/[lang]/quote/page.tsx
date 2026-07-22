import type { Metadata } from "next";
import Image from "next/image";
import RFQForm from "@/components/RFQForm";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { getBrand } from "@/lib/data";
import { getDict, type Locale } from "@/lib/i18n";

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
  return { title: q.metaTitle, description: q.metaDescription };
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

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/hero-plant.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50 rtl:bg-linear-to-l" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              {q.heroChip}
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              {q.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              {q.lede}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <RFQForm initialBrand={brand?.name} initialEmail={email} t={dict.rfq} />
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-navy">
                {q.nextTitle}
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {q.steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <SpotlightCard className="h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="text-sm font-bold text-brand">{s.step}</div>
                  <p className="mt-1.5 text-[15px] text-gray-600">{s.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
