import type { Metadata } from "next";
import Image from "next/image";
import RFQForm from "@/components/RFQForm";
import Reveal from "@/components/Reveal";
import { getBrand } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quote for Farris Engineering, Dyna-Flo, and EST products in Egypt — our application engineers typically respond within 24 hours.",
};

const steps = [
  { step: "1. Acknowledgment", text: "You'll receive an auto-confirmation of your submission" },
  { step: "2. Technical Review", text: "Our engineering team reviews your requirements" },
  { step: "3. Quotation", text: "A formal quote is prepared and sent to you" },
  { step: "4. Follow-Up", text: "One of our engineers will contact you to clarify any details" },
];

type Props = {
  searchParams: Promise<{ brand?: string }>;
};

export default async function QuotePage({ searchParams }: Props) {
  const { brand: brandSlug } = await searchParams;
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
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              Request a quote
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Get a quotation
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Complete the form below and one of our application engineers
              will respond with a formal quote — typically within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <RFQForm initialBrand={brand?.name} />
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-navy">
                What Happens Next?
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="text-sm font-bold text-brand">{s.step}</div>
                  <p className="mt-1.5 text-[15px] text-gray-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
