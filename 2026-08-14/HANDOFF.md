# ACTS website optimization — handoff

Session of 2026-08-26. Branch `refactor/responsive-system`. **Nothing committed** —
all changes are in the working tree, on top of the ~37 files that were already
modified when the session started.

State at handoff: `next build` ✅ · `tsc --noEmit` ✅ · `eslint` ✅ ·
`npm run test:smoke` 9/9 ✅ (includes axe a11y).
`npm run test:visual` and `npm run test:responsive` **not yet run** — see below.

---

## 1. Why the transformations were burning — diagnosis

Vercel bills an Image Transformation **for every cache MISS and every STALE**
(`vercel.com/docs/image-optimization` → "How Image Optimization works"). The
cache key is `{project, source content hash, w, q, normalized Accept}`. Four
things multiplied together here:

| Factor | Was | Effect |
| --- | --- | --- |
| `minimumCacheTTL` | unset → **4 h** default in Next 16 | every still-requested variant went STALE and was re-billed up to **6× a day** |
| Upstream `Cache-Control` | Vercel's `max-age=0, must-revalidate` on `public/` | capped the optimized TTL at that 4 h (TTL = max(minimumCacheTTL, upstream max-age)) |
| `formats` | `['image/avif','image/webp']` | **2× every variant** — the two Accept headers key separately |
| `deviceSizes` + `imageSizes` | 8 + 8 = 16 widths | wide srcsets, and 16 × 2 q × 2 formats = **64 reachable variants per source** on a public endpoint with no allowlist |

Measured surface: **168 distinct source images**, **1,729 distinct
`(source, width, quality)` srcset entries** across all 59 sitemap routes.
Before the change that was ~2,500 entries × 2 formats ≈ 5,000 possible
variants, each re-billable 6×/day. That is the 75%-of-5,000.

Two specific code bugs made it worse:

- `components/ui/CardLogoMark.tsx` declared `width={1330}` with no `sizes`, so
  a logo painted at 72–192 px was requested at **w=1920 and w=3840**. Used on
  5 pages, ~12 instances.
- `components/PageHeroBackground.tsx` did the same (`width={1310}`, no `sizes`,
  painted ≤352 px) on **every dark-hero page**, and `priority`-preloaded it.

---

## 2. What was changed

### `next.config.js` (the main fix)

- `minimumCacheTTL: 2678400` (31 days) — the single biggest lever.
- `formats: ['image/webp']` — halves every variant. Verified: an
  `Accept: image/avif,image/webp` request now returns `Content-Type: image/webp`.
- `deviceSizes: [640, 828, 1080, 1920, 2560, 3840]` (was 8 entries; dropped
  750/1200/2048 as redundant, **kept 3840** so 4K/DPR-2 screens still get
  native resolution — no quality reduction anywhere).
- `imageSizes: [64, 96, 128, 256, 384]` (dropped 16/32/48 — nothing renders
  below 56 CSS px).
- `qualities: [75, 90]` unchanged, so existing `q=75` cache keys survive.
- `localPatterns` allowlist: `/images/**`, `/videos/**`, `/Data/*/images/**`,
  `/logo-transparent.png`. Deliberately narrower than `/Data/**` so the ~370 MB
  PDF library cannot be pointed at the optimizer. Verified: out-of-list paths,
  widths and qualities all return **400**.
- New `headers()` rules: `Cache-Control: public, max-age=2678400` on
  `/images/**`, `/videos/**`, `/Data/**`, `/geo/**`, `/logo-transparent.png`,
  `/apple-touch-icon.png`. This raises the optimizer's upstream TTL *and* stops
  repeat visitors re-downloading the PDFs and videos. HTML is untouched
  (`s-maxage=31536000` from Next, as before).
  **Consequence: change a filename when you change a picture**, or purge with
  `vercel cache invalidate --srcimg /images/foo.jpg`.

### Components

| File | Change |
| --- | --- |
| `ui/CardLogoMark.tsx` | added `sizes` off the real painted width (was minting 1920/3840) |
| `PageHeroBackground.tsx` | added `sizes`; `priority` prop renamed to `eager` and mapped to `loading`, not a preload (it is a 20%-opacity decoration that was outranking the hero). Caller in `projects/page.tsx` updated |
| `home/AutoRotateImage.tsx` | dropped `priority` — 3 below-the-fold brand cards were preloading against the hero |
| `ui/progressive-blur-card.tsx` | dropped `priority` (the CEO card is far below the fold on /about); removed a dead `quality={20}` that Next was snapping to 75 anyway |
| `ui/scroll-expansion-hero.tsx` | `priority` → `preload` on the establishing shot only (the real LCP); poster + image-mode media → `loading="eager" fetchPriority="high"` so one fold no longer has three preloads |
| `home/HeroProductCards.tsx` | `priority` → `preload` (Next 16 spelling) |
| `Navbar.tsx` | `priority` → `loading="eager"` |
| `brands/[slug]/page.tsx` | `priority` → `preload` on the still-photo brand hero |
| `SectorPanel.tsx` | emblem `sizes` `30vw` → `320px` (it is height-capped and was fetching 640–1080 for a 320 px paint); photo + its blurred mat `40vw` → `512px` (2/5 of a max-w-7xl column — `40vw` was asking for 1920w against a 1600 px source). **The mat and the photo must keep character-identical `sizes` or they stop sharing one request** |
| `brands/BrandHeroVideo.tsx` | poster `<img>` gets `fetchPriority="high"` + `decoding="async"` — it is the LCP on brand pages with film |

`priority` is deprecated in Next 16 (`@deprecated Use 'preload' prop instead`).
There are now **zero** `priority` props left on `<Image>`.

### Archive — `2026-08-14/` (83 MB, 74 files)

Created with a `README.md` explaining every subfolder and how to restore.
`public/` went **565 MB → 483 MB**. Also added `.vercelignore` (archive +
Playwright artefacts + the ~80 MB of visual baselines).

Moved: 6 superseded/unused videos (15.6 MB incl. the 7.4 MB pre-scrub
`Ceo.mp4`), the 6 Wikimedia stock photos `ATTRIBUTIONS.md` already listed as
"no longer referenced" plus `logo-white.png`, the 9 sector-artwork sources
(script updated to read them from the archive — **verified it reproduces
`public/images/sectors/*.jpg` byte-for-byte**), the byte-duplicate
`Enhancement for EST/` (40 MB) and `farris/Enhancement/` folders, the orphaned
Farris valve frame plus its card tile, `public/Clients logo/`, the four
`*-Data.md` scrape notes (were publicly downloadable), and the unimported
`components/BrandIcon.tsx`.

### Documentation touched

`public/images/ATTRIBUTIONS.md` (new paths), `lib/brandHub.ts` header comment
(points at `2026-08-14/data-notes/`), `scripts/normalize-sector-images.mjs`
(`SRC_DIR`).

---

## 3. ⚠️ A mistake that was made and corrected — read this first

`public/Data/{Dynaflo,EST,Farris-Valves}/images/` (71 MB) was archived and then
**restored**. Those images ARE live: `lib/brandHub.ts` builds 73 paths from the
`F`/`D`/`E`/`EE` prefix constants at lines 76–79, and `lib/data.ts`,
`app/[lang]/page.tsx` and `app/[lang]/brands/[slug]/page.tsx` name 37 more.
The initial scan missed them because most are **template literals**, not quoted
paths. `npm run test:smoke` caught it as 400s on the Farris page.

**Lesson for the next pass: never archive an asset on a quoted-string grep
alone.** The rigorous method that worked, and that should be re-used:

1. Static scan that first substitutes `const X = "/path"` prefixes into
   `${X}/...` template literals, then also imports `lib/brandProductImages.ts`
   and expands `brandProductImages` / `brandCardImages` at runtime.
2. Independently crawl every URL in `/sitemap.xml` against a production server
   and collect every `/_next/image?url=` source plus every direct
   `src=`/`href=` under `/images|/videos|/Data|/geo`.
3. Archive only what **both** methods call unused, then confirm with a
   per-basename `grep -rlF` across `app components lib scripts`.

Both methods currently agree on a set of **78 unreferenced files**.

---

## 4. What is left to do

### a. Archive the remaining 66 unused `/Data/*/images/**` files (~1.1 MB)

Verified unused by all three methods above (static scan, live crawl,
per-basename grep — the grep returned zero hits for all 66). They are EST
website chrome (`Site-Icons-Logos/`, incl. a 232 KB animated ad GIF), EST
scrape thumbnails (1–8 KB each), and ~13 Dyna-Flo category JPEGs. Suggested
destination `2026-08-14/brand-source-media-unused/`. Re-derive the exact list
before moving — do not trust this paragraph, re-run the scan.

The other 12 of the 78 should **stay**: `/images/home/bestseller-*.jpg` (3 —
inputs to `normalize-brand-cards.mjs`, referenced without a leading slash),
the 6 `CARD_EXCLUDE` card tiles the script regenerates, `/apple-touch-icon.png`,
`/images/ATTRIBUTIONS.md`, `/llms.txt`.

### b. Run the two remaining suites

```
npm run test:visual        # PW_PROD=1, --workers=2
npm run test:responsive
```

`test:visual` **is expected to produce diffs** — AVIF→WebP decodes slightly
differently, and several `sizes` changes alter which srcset width is chosen.
Per the note at the top of `tests/visual.spec.ts`, eyeball each diff before
`--update-snapshots`; do not accept blind. Anything more than a sub-pixel
encoding difference is a real regression — look hardest at `SectorPanel`
emblems (`/industries`, `/projects`) and the `CardLogoMark` corners, since
those two changed which resolution is fetched the most.

### c. Decide the `deviceSizes: 3840` question

3840 was kept for quality. Note that Next always sets the `src` fallback
attribute to the **largest** srcset entry, so every page's HTML contains a
`w=3840` URL. Real browsers ignore it (they use `srcset`), but a naive crawler
that regexes `src` would mint a 3840 variant per source — bounded now at ~168
once per 31 days. If Vercel usage is still high after a month on the new
config, capping `deviceSizes` at 2560 is the next lever; the visible cost is
a ~15% upscale on 100vw heroes for DPR-2 laptops wider than 1280 CSS px.

### d. Source-image weight — deliberately NOT touched, decide whether to

No product photography was re-encoded. Reasoning: users are served WebP by the
optimizer either way, so re-encoding the sources changes **zero** transformations,
**zero** cache writes and **zero** end-user bytes — it only affects origin fetch
and deploy size, which is not the problem that was asked about. Given "preserve
media quality" is rule #1, churning 24 product PNGs for no user-facing gain was
judged the wrong trade. If deploy size matters later, the candidates are:
`/images/ayman-el-mohamady-sakr.png` (2.1 MB PNG of a **photo**, no alpha — the
one genuinely wrong-format file), 24 product PNGs at 0.5–1 MB
(`images/{est,farris,dynaflo}/*.png`), the three brand logos at 2448–3600 px
rendered at 90–120 px, `/images/clients/dlng.png` (1440×720 / 470 KB where every
sibling is 440×220), and `est-field-service.jpg` / `dynaflo-control-valve.jpg`
(both 3264×2448).

### e. Smaller loose ends

- **`sharp` is imported by two scripts but is not in `package.json`** — it
  currently resolves as a transitive dep of Next. Add it to `devDependencies`.
- `/[lang]/industries` and `/[lang]/quote` render dynamically (ƒ) because they
  `await searchParams`. Legitimate, but it means no CDN caching and a function
  invocation per visit. Making them static would need the query read on the
  client behind `<Suspense>` — a real architectural change, not done.
- Remaining `sizes` values were reviewed but only the worst were changed. Still
  slightly loose: `progressive-blur-card` main image (a 672 px card fetching
  1920 at DPR 2), `ProductHub` `(max-width: 1024px) 100vw, 40vw`,
  `BrandResourceCard` / `ProductFlipCard` / `FieldGallery` grid tiles. Each is a
  small win; none is a bug.
- The orphaned Farris valve image — decide whether it belongs on the site (see
  `2026-08-14/README.md` → `images/orphaned-card/`).
- The user's `next dev` server was killed during this session (it was returning
  500 with stale state and holding port 3000, which `test:smoke` needs).
  Restart with `npm run dev`.

### f. Not started at all

Steps 9 (UI/UX polish) and 11 (SEO / OG / heading structure) of the original
brief were only spot-checked. The axe pass in `test:smoke` is green on all 9
routes, and metadata / OG / sitemap / robots all exist and look correct, but no
deliberate UI/UX or SEO improvement pass was made.

### g. What was audited and found already good — do not redo

`MapEmbed` (Google Maps facade), `BrandHeroVideo` (mobile encode, Save-Data /
2G / reduced-motion opt-out, IntersectionObserver pause), `scroll-expansion-hero`
video gating (media budget + IO-gated mount so the preload scanner never sees
the scrub video), three.js / d3 / flip-disk all lazily `next/dynamic`-imported,
CSP + security headers, and dependency hygiene (every declared dependency is
used; nothing unused to remove).

---

# Session 2 — 2026-08-27 (continuation)

Picked up from section 4 above. Branch unchanged (`refactor/responsive-system`).

## Done this session

**4.a — the 66 unused `/Data/*/images/**` files: ARCHIVED.**
Re-derived from scratch rather than trusting the list in section 4.a, using all
three methods. All three agreed on exactly the same 66 files / 1,044,537 bytes
as the previous session had found. Moved to
`2026-08-14/brand-source-media-unused/`, structure preserved, documented in
`2026-08-14/README.md`. 151 → 85 files remain under `public/Data/*/images/`.

Then verified against a running production server, which is the check that
matters (a quoted-string grep is what got this wrong last time):
every one of the 59 sitemap routes returns 200, all 258 distinct static assets
(images, videos, PDFs) return 200, all 168 optimized image sources return 200
through `/_next/image`, and all 59 internal page links return 200.
**Zero broken links.**

> Note for whoever writes the next link-checker: un-escape HTML entities
> (`&amp;` → `&`) but do NOT percent-decode the href before fetching it. Doing
> so reported `DC2513 - GripTight PE Test Plugs Sizes & Specs.pdf` as a 404
> that does not exist — the file is present and serves 200 at its encoded URL.

**4.e — `sharp` added to `devDependencies`** (`^0.35.3`, the version already
resolving transitively). The two scripts that import it no longer depend on it
being a Next transitive dep.

**Ran `test:responsive`: 27 failures, all now fixed. 194 pass, 0 fail.**
This suite had never been run against the working tree. Three real defects and
one test gap:

| Fix | File | What was wrong |
| --- | --- | --- |
| Utility bar touch targets (19 failures, every route at tablet width) | `components/Navbar.tsx` | `sm:h-9` pinned the bar to 36px, shorter than the 44px `.tap-target` overlay on the phone/email links. The overlay's bottom fell outside the bar and the nav row below — a later sibling — painted over it, so the links were ~36px to a finger. Now `sm:min-h-9` + `pointer-coarse:min-h-11`; fine-pointer widths unchanged. |
| FloatingNav overflow (4 failures, `/brands/[slug]` at 390–393px) | `components/ui/floating-nav.tsx` | Centred with `left-1/2 + -translate-x-1/2`, which leaves a fixed element with no width constraint, so the column sized to its content and the scroller's own `overflow-x-auto` never engaged: 419px of bar on a 393px viewport, 13px off both edges. Adopted `<Dock>`'s pattern — `inset-x-0` wrapper, `w-full` collapse wrapper, `w-fit max-w-full` scroller. |
| Breadcrumb touch targets (4 failures, product detail at phone width) | `app/[lang]/brands/[slug]/products/[productId]/page.tsx` | Two crumbs were 20px tall with no touch treatment at all. They sit in a packed flex row, so per the note in `globals.css` they grow their own box (`inline-flex items-center pointer-coarse:min-h-11`) rather than take a `.tap-target` overlay that would spill onto the neighbouring crumb. |
| Flip-card false positive (2 failures, `/brands` at tablet) | `tests/responsive.spec.ts` | **Not a site defect.** `BrandResourceCard` and `ProductFlipCard` render both faces at all times and mark the away-facing one `inert` — correctly, and that is also what removes it from hit-testing. The walk was measuring the hidden back face's controls, whose probes correctly land on the front face painted over them. The walk now skips `[inert]` subtrees, the same class of exclusion as the `display:none` / `visibility:hidden` check beside it. |

`test:smoke` re-run after all of the above: **9/9 pass**, axe included.

## Deliberately NOT done, with reasons

- **`test:visual` was not run this session.** It remains the one suite with no
  fresh result. Expect diffs regardless — the AVIF→WebP switch and the `sizes`
  changes from session 1 both alter which bytes get decoded, and this session's
  Navbar change adds 8px to the utility bar under a coarse pointer, so every
  tablet/mobile/ios baseline shifts. Eyeball each diff before
  `--update-snapshots`; do not accept blind.
- **4.c — `deviceSizes: 3840` kept.** No new evidence either way; revisit after
  a month of real Vercel usage data, as section 4.c already says.
- **4.d — source images still not re-encoded.** Session 1's reasoning holds:
  users are served WebP by the optimizer either way, so re-encoding changes
  zero transformations and zero end-user bytes. `ayman-el-mohamady-sakr.png`
  (2.1 MB PNG of a photo with no alpha) is still the one genuinely wrong-format
  file if deploy size ever matters.
- **4.e — the remaining loose `sizes` were left alone.** They are the ones
  session 1 assessed as "a small win; none is a bug." Tightening a `sizes` can
  only make a browser fetch a *smaller* variant, which risks a visibly softer
  image — and preserving media quality outranks saving transformations. Not a
  trade worth making on the way out the door.

## Measured state

- Transformation surface: **168 distinct source images, 1,730 distinct
  `(source, width, quality)` srcset entries** across all 59 routes —
  unchanged from session 1's 1,729, as expected. Session 1's win came from
  `minimumCacheTTL` and the WebP-only switch, not from srcset breadth.
- `public/` 482 MB · archive 84 MB / 141 files (excluded from Vercel upload).
