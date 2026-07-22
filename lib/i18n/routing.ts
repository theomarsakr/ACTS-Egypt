/* Locale routing helpers — deliberately free of dictionary imports so client
   components can use them without pulling both full dictionaries into the
   browser bundle. Server code can import everything from "@/lib/i18n". */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Routes that exist in Arabic (phase 1: the conversion path). */
export const arRoutes = new Set(["/", "/contact", "/quote"]);

/**
 * Locale-aware href: keeps Arabic navigation inside /ar for translated pages
 * and falls back to the English page for everything else (interim state until
 * the remaining pages are translated).
 */
export function localeHref(lang: string, href: string): string {
  if (lang !== "ar") return href;
  const [path, suffix] = splitPath(href);
  if (!arRoutes.has(path)) return href;
  return (path === "/" ? "/ar" : `/ar${path}`) + suffix;
}

/** Strip an /ar prefix, giving the canonical English path. */
export function stripLocale(pathname: string): string {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) return pathname.slice(3);
  return pathname;
}

function splitPath(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

/** Fill {placeholders} in a dictionary template string. */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}
