import { test, expect, type Page } from "@playwright/test";

// This suite checks static geometry (overflow, touch targets), not motion —
// tests/smoothness.spec.ts is where motion itself gets verified, and that
// suite must NOT force reduced motion, or it would measure a site with every
// effect it exists to check already turned off.
//
// The first-visit IntroOverlay curtain is a separate problem: it's a
// `fixed inset-0` canvas layer that covers the entire page for ~1-2.5s (up
// to 6s on a slow connection) and intercepts every pointer hit, which would
// contaminate every overflow/tap-target check on a fresh browser context.
// IntroOverlay only skips itself under prefers-reduced-motion OR once
// acts-intro-seen is set in localStorage — the emulated media query proved
// unreliable to depend on here, so set the flag directly via an init script,
// which is the more direct statement of intent anyway ("skip the curtain,
// we're testing layout") and runs before the page's own scripts on every
// navigation in every test in this file.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("acts-intro-seen", "1");
    } catch {
      /* storage blocked — IntroOverlay treats this as already-seen too */
    }
  });
});

// Every top-level route, in both locales. /ar is in this sweep from day one,
// not a follow-up — RTL overflow appears on the opposite edge from LTR (see
// overflowReport below), and several of this refactor's fixes (the dock's
// restored labels, the header's utility bar) are specifically riskier in
// Arabic, where labels run ~20% wider.
const paths = [
  "/",
  "/about",
  "/industries",
  "/products",
  "/projects",
  "/contact",
  "/brands",
  "/brands/farris-engineering",
  "/brands/farris-engineering/products/series-2600",
  "/quote",
  "/this-route-does-not-exist",
];
const routes = paths.flatMap((p) => [`/en${p}`, `/ar${p}`]);

// Elements this suite must not flag, with the reason inline next to the
// selector so an allowlist entry can't outlive its justification.
const ALLOW_SMALL_TARGET = "[data-allow-small-target]";

type Offender = { tag: string; cls: string; left: number; right: number };

async function overflowReport(page: Page): Promise<{ docOverflow: number; offenders: Offender[] }> {
  return page.evaluate(() => {
    const de = document.documentElement;
    const vw = window.innerWidth;
    // Cheap signal, kept alongside the element walk below — but NOT trusted
    // alone: body { overflow-x: hidden } (globals.css) clips real overflow
    // rather than producing a scrollbar, so this can read 0 on a badly
    // broken page.
    const docOverflow = de.scrollWidth - de.clientWidth;

    const clippedByAncestor = (el: Element) => {
      // Walk UP but STOP BEFORE <body>. body carries overflow-x: hidden
      // site-wide, so a naive ancestor check marks EVERY element as
      // "legitimately clipped" and this would pass on a completely broken
      // page. Genuine scrollers (the dock, tab strips, thumbnail rails) all
      // nest well below body, so stopping there excuses them without
      // excusing the page itself.
      let p: Element | null = el.parentElement;
      while (p && p !== document.body) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
        p = p.parentElement;
      }
      return false;
    };

    const offenders: Offender[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n as HTMLElement;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      // Both edges — in RTL, overflow shows up on the LEFT, not the right.
      if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el)) {
        offenders.push({
          tag: el.tagName,
          cls: String(el.className).slice(0, 140),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
      if (offenders.length >= 20) break;
    }
    return { docOverflow, offenders };
  });
}

async function settleMotion(page: Page) {
  // Same rationale as smoke.spec.ts: measure the resting state, not a
  // mid-fade frame.
  await page.addStyleTag({
    content:
      ".reveal { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }",
  });
  await page.waitForTimeout(150);
}

for (const route of routes) {
  const isNotFoundRoute = route.includes("this-route-does-not-exist");

  test(`${route} has no horizontal overflow`, async ({ page }) => {
    const response = await page.goto(route);
    const status = response?.status();
    // Every other route should be a clean 2xx/3xx; the deliberately-missing
    // route exercises app/[lang]/[...notFound]/page.tsx, whose whole job is
    // to answer 404 — that's the "non-error status" for it.
    if (isNotFoundRoute) {
      expect(status, `${route} should respond 404 via [...notFound]`).toBe(404);
    } else {
      expect(status, `${route} should respond with a non-error status`).toBeLessThan(400);
    }
    await page.waitForLoadState("networkidle");
    await settleMotion(page);

    const { docOverflow, offenders } = await overflowReport(page);
    expect(offenders, `${route} has overflowing elements:\n${JSON.stringify(offenders, null, 2)}`).toEqual([]);
    expect(docOverflow, `${route} document.scrollWidth exceeds clientWidth by ${docOverflow}px`).toBeLessThanOrEqual(1);
  });
}

// Coarse-pointer only: .tap-target's ::after overlay and every
// pointer-coarse: utility in globals.css only apply under (pointer: coarse),
// so this assertion is meaningless (and the desktop/laptop projects would
// fail it spuriously) anywhere else.
for (const route of routes) {
  const isNotFoundRoute = route.includes("this-route-does-not-exist");

  test(`${route} has no touch target under 44px`, async ({ page }, testInfo) => {
    test.skip(!/tablet|mobile|ios/.test(testInfo.project.name), "coarse-pointer projects only");

    const response = await page.goto(route);
    const status = response?.status();
    if (isNotFoundRoute) {
      expect(status).toBe(404);
    } else {
      expect(status).toBeLessThan(400);
    }
    await page.waitForLoadState("networkidle");
    await settleMotion(page);

    const failures = await page.evaluate((allowSelector) => {
      const selector =
        'a[href], button, [role="button"], input:not([type=hidden]), select, summary, [tabindex]:not([tabindex="-1"])';
      const allowed = new Set(document.querySelectorAll(allowSelector));
      const bad: { tag: string; cls: string; w: number; h: number }[] = [];

      for (const el of document.querySelectorAll(selector)) {
        if (allowed.has(el) || el.closest(allowSelector)) continue;
        const cs = getComputedStyle(el as HTMLElement);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        // Only controls fully inside the current viewport are checked. A
        // control straddling the fold has probes that are legitimately
        // off-screen (skipped) sitting alongside probes that land on
        // whatever real content occupies that same on-screen pixel, which
        // is a fold-position artifact, not a sizing defect. This is a
        // single-pass, no-scroll check (fast across the whole route matrix);
        // it only asserts on what's already laid out above the fold at load.
        if (r.top < 0 || r.bottom > window.innerHeight || r.left < 0 || r.right > window.innerWidth) continue;

        // Hit-test, not a rect measurement: .tap-target grows the hit area
        // via a ::after overlay with no DOM box of its own, so a rect check
        // would report (e.g.) 36px on a control that is genuinely 44px to a
        // finger. Pseudo-elements ARE hit-testable via elementFromPoint and
        // attribute back to their originating element, which is the only
        // way to see the overlay.
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // 21, not 22: a control that is EXACTLY 44px (the floor, not a
        // violation) puts a ±22 probe on its exact boundary pixel, where
        // subpixel rounding can land the hit just outside the element and
        // fail a passing control. 1px of margin keeps the probe safely
        // inside a control that truly meets the floor while still catching
        // anything meaningfully short of it.
        const reach = 21;
        const probes: [number, number][] = [
          [cx - reach, cy],
          [cx + reach, cy],
          [cx, cy - reach],
          [cx, cy + reach],
        ];
        const hits = probes.every((([px, py]) => {
          if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) return true; // off-viewport probe, don't penalize
          const hit = document.elementFromPoint(px, py);
          return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
        }));
        if (!hits) {
          bad.push({
            tag: el.tagName,
            cls: String((el as HTMLElement).className).slice(0, 140),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      }
      return bad;
    }, ALLOW_SMALL_TARGET);

    expect(failures, `${route} has controls under a 44px touch target:\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
  });
}

// Regression locks: cheap assertions that make reverting the documented
// prior work (commit 5cc1f03 and its ancestors) fail the build instead of
// silently shipping.
test.describe("regression locks", () => {
  test("gray-400 stays pinned for WCAG AA (fixed 400+ contrast failures on /brands)", async ({ page }) => {
    await page.goto("/en/brands");
    await page.waitForLoadState("networkidle");
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--color-gray-400").trim()
    );
    expect(value).toBe("#6b7280");
  });

  test("no fixed/sticky element carries backdrop-filter (tablet sticky-header ghosting fix)", async ({ page }) => {
    await page.goto("/en/");
    await page.waitForLoadState("networkidle");
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("*")]
        .filter((el) => {
          const cs = getComputedStyle(el);
          return /fixed|sticky/.test(cs.position) && (cs.backdropFilter ?? "none") !== "none";
        })
        .map((el) => String((el as HTMLElement).className).slice(0, 100))
    );
    expect(offenders).toEqual([]);
  });

  test("form controls stay >=16px under coarse pointer (iOS focus-zoom fix)", async ({ page }, testInfo) => {
    test.skip(!/tablet|mobile|ios/.test(testInfo.project.name), "coarse-pointer projects only");
    await page.goto("/en/quote");
    await page.waitForLoadState("networkidle");
    const undersized = await page.evaluate(() =>
      [...document.querySelectorAll("input, select, textarea")]
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => String((el as HTMLElement).className).slice(0, 100))
    );
    expect(undersized).toEqual([]);
  });

  test("viewport meta permits pinch zoom", async ({ page }) => {
    await page.goto("/en/");
    const content = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(content ?? "").not.toMatch(/user-scalable\s*=\s*no/i);
    expect(content ?? "").not.toMatch(/maximum-scale\s*=\s*[01](\.0*)?(?!\d)/i);
  });
});
