import type { MetadataRoute } from "next";
import { brands } from "@/lib/data";
import { HUB_BRANDS, getBrandHubData } from "@/lib/brandHub";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.actsegypt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.7 },
    { path: "/industries", priority: 0.8 },
    { path: "/products", priority: 0.8 },
    { path: "/projects", priority: 0.7 },
    { path: "/brands", priority: 0.8 },
    { path: "/contact", priority: 0.6 },
    { path: "/quote", priority: 0.9 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${siteUrl}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = HUB_BRANDS.flatMap((slug) => {
    const hub = getBrandHubData(slug);
    return (hub?.products ?? []).map((p) => ({
      url: `${siteUrl}/brands/${slug}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  });

  // Arabic pages (phase 1: the translated conversion path).
  const arabicEntries: MetadataRoute.Sitemap = ["/ar", "/ar/contact", "/ar/quote"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "/ar" ? 0.9 : 0.6,
    })
  );

  return [...staticEntries, ...brandEntries, ...productEntries, ...arabicEntries];
}
