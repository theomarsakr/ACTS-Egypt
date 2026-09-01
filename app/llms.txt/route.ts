/* /llms.txt — the AI-answer-surface equivalent of the sitemap.
 *
 * This replaces the hand-written public/llms.txt, which listed the company,
 * the three brands and the index pages but none of the 45 product pages. That
 * is the half that matters: an assistant asked "where do I get Farris 2600
 * relief valves in Egypt" or "who supplies Pop-A-Plug in Egypt" needs the leaf
 * URL and one line of what is on it, and hand-maintaining 45 of those against
 * a catalog that lives in lib/brandHub would have rotted on the first product
 * added. Generating it from the same source as the sitemap and the pages
 * themselves means it cannot disagree with them.
 *
 * Prose sections stay hand-written — they carry the facts about ACTS that no
 * data structure holds. Only the link lists are derived.
 */

import { brands, contact, industries, industryHref } from "@/lib/data";
import { industrySeo } from "@/lib/industrySeo";
import { HUB_BRANDS, getBrandHubData } from "@/lib/brandHub";
import { productSeo } from "@/lib/productSeo";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function brandSection(slug: string): string {
  const brand = brands.find((b) => b.slug === slug);
  const hub = getBrandHubData(slug);
  if (!brand || !hub) return "";
  const lines = hub.products.map((p) => {
    const seo = productSeo(slug, brand.name, p);
    return `- [${seo.title}](${SITE_URL}/brands/${slug}/products/${p.id}): ${p.tagline}${
      p.standard ? ` (${p.standard})` : ""
    }`;
  });
  return [
    `### ${brand.seoTitle}`,
    "",
    `[Brand page](${SITE_URL}/brands/${slug}) — ${brand.seoDescription}`,
    `${hub.totalDocs} manufacturer PDFs (catalogs, IOM manuals, bulletins) are linked from that page's Engineering Resource Center.`,
    "",
    ...lines,
    "",
  ].join("\n");
}

function industrySection(): string {
  return industries
    .map((i) => {
      const seo = industrySeo(i.slug, i.name, i.intro);
      const areas = i.applications.map((a) => a.area).join(", ");
      return `- [${seo.heading}](${SITE_URL}${industryHref(i.slug)}): ${seo.description} Process areas: ${areas}.`;
    })
    .join("\n");
}

export function GET(): Response {
  const body = `# ACTS Egypt (Advanced Company for Trading Services)

> Egypt's exclusive agent for Farris Engineering safety relief valves, Dyna-Flo control valves, and EST (Curtiss-Wright) heat exchanger tube plugging & pressure testing equipment. Supplies, supports, and maintains critical process equipment for Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries in Egypt.

Founded in 2006 and based in Sheikh Zayed City, Giza, Egypt. ACTS is the sole in-country agent for three Curtiss-Wright divisions — Farris Engineering, Dyna-Flo, and EST — and provides application engineering, sizing/selection support, actuator sizing, aftermarket repair, and field services alongside equipment supply. Clients include ENPPI, Petrojet, GASCO, Khalda Petroleum, SUMED, PETROBEL, and other major Egyptian oil & gas and industrial operators.

Contact: ${contact.salesEmail} · ${contact.phone} · Arkan Plaza, Building 4, 4th Floor, Office #409, Sheikh Zayed City, Giza 12451, Egypt. Office hours Sunday–Thursday, 9:00 AM–5:00 PM Cairo time.

## Company

- [About ACTS](${SITE_URL}/about): Company history, mission, and timeline since 2006.
- [Contact](${SITE_URL}/contact): Office address, phone, email, and office hours.
- [Projects & clients](${SITE_URL}/projects): Track record with major Egyptian operators across Oil & Gas, Petrochemicals, Power Generation, and Fertilizers.
- [Products & services overview](${SITE_URL}/products): Four service pillars — valves; actuators & instrumentation; heat exchanger & pressure testing equipment; and technical advisory & aftermarket services.
- [Industries served](${SITE_URL}/industries): Oil & Gas, Petrochemical, Power Generation, Water Treatment, Fertilizers, and General Industrial.
- [Request a quote](${SITE_URL}/quote): Pricing for Farris, Dyna-Flo, or EST products in Egypt. Application engineers typically respond within 24 hours.

## Industries

Each sector has its own page: the process areas ACTS works in, the engineering challenge in each, the product line that answers it, and the manufacturer documentation behind it.

${industrySection()}

## Arabic

The homepage, contact page and quote form are also published in Arabic:

- [الصفحة الرئيسية](${SITE_URL}/ar)
- [اتصل بنا](${SITE_URL}/ar/contact)
- [اطلب عرض سعر](${SITE_URL}/ar/quote)

## Brands and products

All three brands are divisions of Curtiss-Wright. ACTS is their sole agent in Egypt.

- [All brands](${SITE_URL}/brands)

${HUB_BRANDS.map(brandSection).join("\n")}
## Notes

Prices, stock levels and lead times are not published — ACTS quotes per application. Specifications on the product pages are transcribed from manufacturer datasheets; confirm final selection with ACTS or the linked catalog.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
