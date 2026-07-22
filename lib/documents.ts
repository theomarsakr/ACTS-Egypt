// Server-only document catalog. Walks the PDF library under public/Data at
// build time and turns raw manufacturer filenames into a clean, grouped list
// of downloadable resources per brand. This is read on the (statically
// rendered) Brands page and the humanized result is passed to client
// components as plain data — never import this into a client component.

import fs from "node:fs";
import path from "node:path";

export type BrandDoc = {
  title: string; // human-readable document name
  ref?: string; // manufacturer doc code shown as a badge (e.g. "MK0001")
  lang?: string; // language label when not English/neutral (e.g. "French")
  href: string; // public URL to the PDF
  category: string; // category label it belongs to
};

export type DocCategory = {
  slug: string;
  label: string;
  docs: BrandDoc[];
};

export type BrandDocuments = {
  slug: string; // matches a brand in lib/data
  name: string; // display name
  anchor: string; // library section id
  categories: DocCategory[];
  featured: BrandDoc[]; // curated brochures/catalogs for the flip card
  total: number;
};

// ── Humanizer ──────────────────────────────────────────────────────────────

const LANGS: Record<string, string> = {
  ENG: "English", ENGLISH: "English",
  FRE: "French", FRENCH: "French",
  GER: "German", GERMAN: "German",
  SPE: "Spanish", SPA: "Spanish", SPANISH: "Spanish",
  POR: "Portuguese", PORTUGUESE: "Portuguese",
  ITA: "Italian", ITALIAN: "Italian",
  CHS: "Chinese", CHINESE: "Chinese",
  POL: "Polish", POLISH: "Polish",
  RUS: "Russian", RUSSIAN: "Russian",
  JAP: "Japanese", JAPANESE: "Japanese",
  KOR: "Korean", KOREAN: "Korean",
  FIN: "Finnish", FINNISH: "Finnish",
  EUS: "Spanish (EU)",
};

const STOP = new Set([
  "and", "of", "for", "the", "from", "to", "vs", "on", "in", "with", "a", "an",
]);

function stripLangTokens(name: string): { name: string; langs: string[] } {
  const found = new Set<string>();
  for (const code of Object.keys(LANGS)) {
    const re = new RegExp(`(^|[_\\-\\s])(${code})(?=$|[_\\-\\s])`, "gi");
    if (re.test(name)) {
      found.add(LANGS[code]);
      name = name.replace(re, "$1");
    }
  }
  return { name, langs: [...found].filter((l) => l !== "English") };
}

function splitCamel(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([0-9])([A-Z][a-z])/g, "$1 $2");
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w, i) => {
      if (!w) return w;
      if (/^[a-z]+$/.test(w)) {
        if (i !== 0 && STOP.has(w)) return w;
        return w[0].toUpperCase() + w.slice(1);
      }
      return w; // keep mixed-case / all-caps / codes / hyphenated
    })
    .join(" ");
}

function humanize(basename: string): { title: string; ref?: string; lang?: string } {
  let name = basename.replace(/\.[a-z0-9]+$/i, "");
  let ref: string | undefined;

  const estMatch = name.match(/^(MK\d{3,}|DC\d{3,}[A-Za-z]?)[-_ ]?(.*)$/);
  if (estMatch) {
    ref = estMatch[1].toUpperCase();
    name = estMatch[2];
  }
  const trailRef = name.match(/[-_\s]?\((MK\d+|DC\d+)\)\s*$/i);
  if (trailRef && trailRef.index !== undefined) {
    if (!ref) ref = trailRef[1].toUpperCase();
    name = name.slice(0, trailRef.index);
  }

  name = name.replace(/^CW[-_]\s?/i, "");
  name = name.replace(/^DF-(?=[A-Z])/, "Dyna-Flo ");

  name = name.replace(/[_-]P-[A-Z0-9]+(-\d+)?$/i, "");
  name = name.replace(/[_-]\d{3,4}[A-Z](?=($|[_-]))/g, "");
  name = name.replace(/[_-]\d{3,4}T(?=($|[_-]R))/gi, "");
  name = name.replace(/^\d{3,4}T[_-]+/i, "");

  name = name.replace(
    /(^|[_\-\s])(A4|LATAM|EUR|US-?Letter|Low-?Res|Hi-?Res|Digital|Intl|PRB|SPC)(?=$|[_\-\s])/gi,
    "$1"
  );

  const NOISE =
    /[_\s-]+(R\d+[a-z]?(-\d+)*|V\d+|Rev|\(\d+\)|\d{4}-\d{2}-\d{2}|\d{1,2}-\d{1,2}-\d{2,4}|\d{1,2}-\d{2,4}|\d)$/i;
  let prev: string;
  do {
    prev = name;
    name = name.replace(NOISE, "");
  } while (name !== prev);

  const langRes = stripLangTokens(name);
  name = langRes.name;

  name = name.replace(/_+/g, " ");
  name = splitCamel(name);

  let hp: string;
  do {
    hp = name;
    name = name.replace(/(\D)-(\D)/g, "$1 $2");
  } while (name !== hp);
  name = name.replace(/-{2,}/g, " ");
  name = name.replace(/\s+/g, " ").trim();

  name = name
    .replace(/\bi PRSM\b/gi, "iPRSM")
    .replace(/\bIn Sure\b/gi, "InSure")
    .replace(/\bGrip Tight\b/g, "GripTight")
    .replace(/\bHydra Loc\b/gi, "Hydra-Loc")
    .replace(/\bMain Man\b/g, "Maintenance Manual")
    .replace(/\bProd Line\b/gi, "Product Line")
    .replace(/\bHX\b/g, "Heat Exchanger")
    .replace(/\bEq\b/g, "Equipment")
    .replace(/\bIso\b/g, "Isolation");

  name = titleCase(name);

  name = name
    .replace(/\bPop A Plug\b/gi, "Pop-A-Plug")
    .replace(/\bHydra Loc\b/gi, "Hydra-Loc")
    .replace(/\bD Series\b/g, "D-Series")
    .replace(/\bG (\d{3})\b/g, "G-$1")
    .replace(/\bGriptight\b/g, "GripTight")
    .replace(/\bAche\b/g, "ACHE")
    .replace(/\bCpi\b/g, "CPI");

  name = name.replace(/\s{2,}/g, " ").replace(/^[\s-]+|[\s-]+$/g, "").trim();

  if (!name && ref) {
    name = ref;
    ref = undefined;
  }
  if (!name) name = basename.replace(/\.[a-z0-9]+$/i, "");

  return { title: name, ref, lang: langRes.langs.length ? langRes.langs.join(", ") : undefined };
}

// ── Catalog configuration ────────────────────────────────────────────────

type ScanDir = { dir: string; slug: string; label: string };
type BrandConfig = {
  slug: string;
  name: string;
  root: string; // folder under public/Data
  scan: ScanDir[];
  featuredFrom: string[]; // category slugs to draw flip-card highlights from
  featuredLimit: number;
};

const CONFIG: BrandConfig[] = [
  {
    slug: "farris-engineering",
    name: "Farris Engineering",
    root: "Farris-Valves",
    scan: [
      { dir: "Additional-Library/Brochures", slug: "brochures", label: "Brochures" },
      { dir: "Additional-Library/Series-Catalogs", slug: "series-catalogs", label: "Series Catalogs" },
      { dir: "Additional-Library/Installation-Maintenance-Manuals", slug: "iomm", label: "Installation & Maintenance Manuals" },
      { dir: "pdfs", slug: "insure", label: "iNSURE® Monitoring" },
      { dir: "Additional-Library/iPRSM", slug: "iprsm", label: "iPRSM Program" },
      { dir: "Additional-Library/Overview-Brochures-Multilingual", slug: "overview-ml", label: "Overview Brochures (Multilingual)" },
      { dir: "Additional-Library/Technical-Articles-Compliance", slug: "articles", label: "Technical Articles & Compliance" },
    ],
    featuredFrom: ["brochures", "series-catalogs", "insure", "iprsm"],
    featuredLimit: 8,
  },
  {
    slug: "dyna-flo",
    name: "Dyna-Flo",
    root: "Dynaflo",
    scan: [
      { dir: "pdfs/Brochures", slug: "brochures", label: "Brochures" },
      { dir: "pdfs/Bulletins", slug: "bulletins", label: "Product Bulletins" },
      { dir: "pdfs/Instructions", slug: "instructions", label: "Instruction Manuals" },
    ],
    featuredFrom: ["brochures", "bulletins"],
    featuredLimit: 8,
  },
  {
    slug: "est",
    name: "EST",
    root: "EST",
    scan: [
      { dir: "pdfs/Marketing-Literature", slug: "marketing", label: "Marketing Literature" },
      { dir: "pdfs/Case-Studies-Whitepapers", slug: "case-studies", label: "Case Studies & Whitepapers" },
      { dir: "pdfs/Certifications-Reports", slug: "certs", label: "Certifications & Reports" },
      { dir: "pdfs/Technical-Procedures", slug: "procedures", label: "Technical Procedures" },
    ],
    featuredFrom: ["marketing", "case-studies", "certs"],
    featuredLimit: 8,
  },
];

const DATA_ROOT = path.join(process.cwd(), "public", "Data");

function encodePath(p: string): string {
  // Encode each path segment so spaces / symbols / non-ASCII resolve, keeping "/".
  return (
    "/Data/" +
    p
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/")
  );
}

function listPdfs(absDir: string): string[] {
  if (!fs.existsSync(absDir)) return [];
  return fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".pdf"))
    .map((e) => e.name);
}

function sortDocs(docs: BrandDoc[]): BrandDoc[] {
  return [...docs].sort((a, b) => {
    if (a.ref && b.ref && a.ref !== b.ref)
      return a.ref.localeCompare(b.ref, undefined, { numeric: true });
    // English/neutral first within a ref group
    const la = a.lang ? 1 : 0;
    const lb = b.lang ? 1 : 0;
    if (la !== lb) return la - lb;
    return a.title.localeCompare(b.title, undefined, { numeric: true });
  });
}

let cache: BrandDocuments[] | null = null;

export function getBrandDocuments(): BrandDocuments[] {
  if (cache) return cache;

  cache = CONFIG.map((brand) => {
    const categories: DocCategory[] = [];

    for (const s of brand.scan) {
      const files = listPdfs(path.join(DATA_ROOT, brand.root, s.dir));
      if (!files.length) continue;
      const docs: BrandDoc[] = files.map((file) => {
        const { title, ref, lang } = humanize(file);
        return {
          title,
          ref,
          lang,
          href: encodePath(`${brand.root}/${s.dir}/${file}`),
          category: s.label,
        };
      });
      categories.push({ slug: s.slug, label: s.label, docs: sortDocs(docs) });
    }

    const total = categories.reduce((n, c) => n + c.docs.length, 0);

    // Flip-card highlights: English/neutral docs from the marketing-facing
    // categories, de-duplicated by title.
    const featured: BrandDoc[] = [];
    const seen = new Set<string>();
    for (const slug of brand.featuredFrom) {
      const cat = categories.find((c) => c.slug === slug);
      if (!cat) continue;
      for (const d of cat.docs) {
        if (d.lang) continue;
        if (seen.has(d.title)) continue;
        seen.add(d.title);
        featured.push(d);
        if (featured.length >= brand.featuredLimit) break;
      }
      if (featured.length >= brand.featuredLimit) break;
    }

    return {
      slug: brand.slug,
      name: brand.name,
      anchor: `library-${brand.slug}`,
      categories,
      featured,
      total,
    };
  });

  return cache;
}

export function totalDocumentCount(): number {
  return getBrandDocuments().reduce((n, b) => n + b.total, 0);
}
