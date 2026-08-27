# Archive — 2026-08-14

Everything in here was **removed from active use, not deleted**. Nothing under
this folder is served: it sits outside `public/`, and `.vercelignore` keeps it
out of CLI uploads, so it costs nothing on the CDN while staying in the repo.
83 MB, 74 files.

Two things still read from here (both are dev-time scripts, never the app):

- `scripts/normalize-sector-images.mjs` → `images/sector-sources/`
- `lib/brandHub.ts` cites `data-notes/` as the provenance of its product facts

Restoring anything is a plain `mv` back to the path noted below.

---

## videos/ — 15.6 MB

Original encodes that the shipped files were derived from, plus two clips
nothing ever referenced. No page loads any of these; the site plays
`Ceo-scrub.mp4`, `*-hero.mp4` and their `-mobile` variants, which stay in
`public/videos/`.

| File | Was at | Why |
| --- | --- | --- |
| `Ceo.mp4` (7.4 MB) | `public/videos/` | Pre-scrub master; superseded by `Ceo-scrub.mp4` + `Ceo-scrub-mobile.mp4` |
| `dyna-flo-df400.mp4` | `public/videos/` | Never referenced |
| `est-pop-a-plug.mp4` | `public/videos/` | Never referenced |
| `farris-valves.mp4` | `public/videos/` | Never referenced |
| `Google Ai Flow.mp4`, `Google Ai Flow 1.mp4` | `public/images/home/` | Never referenced |

## images/unused-photos/ — 9.4 MB

The six Wikimedia stock shots that carried the industry and client-portfolio
tabs before ACTS supplied its own artwork, plus one unused logo cut.
`public/images/ATTRIBUTIONS.md` already recorded these as "no longer
referenced". Licences are listed there.

`logo-white.png` was not referenced anywhere; the site uses
`public/logo-transparent.png`.

## images/sector-sources/ — 7.0 MB

**Still live inputs.** The nine client-supplied originals that
`scripts/normalize-sector-images.mjs` turns into `public/images/sectors/*.jpg`.
The script points here; re-running it reproduces the current derivatives
byte-for-byte. They were moved out of `public/` only so the CDN does not carry
7 MB of full-size art no page loads.

## images/est-enhancement/ — 40 MB

`public/images/est/Enhancement for EST/` — a working folder of upscaled product
renders. Every file is **byte-identical** to one still in
`public/Data/EST/images/Product-Photos/`, so nothing was lost by moving this
copy, and nothing referenced *this* copy: the EST pages load
`public/images/est/<slug>.png|jpg` (the finished cuts) and the gallery loads the
`Data/` originals.

## images/farris-enhancement/ — 0.9 MB

`public/images/farris/Enhancement/` — one file,
`Gemini_Generated_Image_kyatm6kyatm6kyat.png`, byte-identical to
`public/images/farris/insure-monitoring-compact.png` (still in place).

## images/orphaned-card/ — 0.9 MB

`Farris Engineering Spring-Operated Safety Relief Valve.png` was in
`public/images/farris/`, so `scripts/normalize-brand-cards.mjs` (which reads the
whole folder) generated a card tile for it — but the name is not in
`FARRIS_NAMES` in `lib/brandProductImages.ts`, so neither the source nor the
tile was ever rendered. **If this valve should be on the site**, move the `.png`
back to `public/images/farris/`, add `"Farris Engineering Spring-Operated Safety
Relief Valve"` to `FARRIS_NAMES`, and re-run the card script.

## brand-source-media/ — RESTORED, do not archive again

`public/Data/{Dynaflo,EST,Farris-Valves}/images/` was moved here and then put
back. **Those images are live**: `lib/brandHub.ts` builds 73 paths out of them
from the `F`/`D`/`E`/`EE` prefix constants, and `lib/data.ts`,
`app/[lang]/page.tsx` and `app/[lang]/brands/[slug]/page.tsx` name 37 more
directly. A grep for the literal string `/Data/` finds them; a grep for quoted
paths ending in an image extension does not, because most are template
literals. 66 individual files in those folders *are* unreferenced — see
`HANDOFF.md`.

## clients-logo-sources/ — 164 KB

`public/Clients logo/` — the customers' logo files as supplied. The site renders
the normalised cuts in `public/images/clients/*.png`.

## data-notes/ — 26 KB

`*-Data.md` transcription notes that used to sit in `public/Data/<brand>/`, so
they were publicly downloadable at e.g. `/Data/EST/EST-Data.md`. They are the
provenance for the product facts in `lib/brandHub.ts`, not site content.

## code/ — 4 KB

`components/BrandIcon.tsx` — line-art SVG icons for `solent-pratt` and
`cwt-valve`, brand slugs that do not exist in `lib/data.ts`. Nothing imported
it.

## brand-source-media-unused/ — 1.0 MB, 66 files

The 66 files inside `public/Data/{Dynaflo,EST,Farris-Valves}/images/` that no
page, component, script or test references. The other 85 files in those folders
stayed put — see `brand-source-media/` above for why that distinction matters.

Verified unused by three independent methods, all of which must agree before a
file is moved:

1. A static scan that first resolves every `const X = "/path"` declaration and
   substitutes it into `${X}/...` template literals, then matches both full
   paths and bare basenames across `app components lib scripts tests public/Data`.
2. `grep -rlF <basename>` per file across the same trees — zero hits for all 66.
3. A check that no code builds a `/Data/...` path from a runtime variable. The
   only dynamic asset paths in the codebase are in `lib/brandProductImages.ts`
   and they target `/images/**`, never `/Data/**`.

Contents: EST website chrome (`Site-Icons-Logos/` — social icons, event logos,
a 232 KB animated ad GIF), EST scrape thumbnails (mostly 1-8 KB, far too small
to render), and 14 Dyna-Flo category JPEGs superseded by the product photography
`lib/brandHub.ts` actually names.

To restore one: move it back to the matching path under `public/Data/`.
