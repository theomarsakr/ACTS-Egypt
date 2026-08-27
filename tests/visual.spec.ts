import { test, expect, type Page } from "@playwright/test";

// Screenshot baselines for the same route set as responsive.spec.ts. Locked
// as of the plan's commit C20, against the fully-restored, fully-optimized
// build (3.C's effects-at-every-width + Phase 5's survivability work both
// landed). Any further intentional visual change should be reviewed with
// --update-snapshots as a per-commit artifact (eyeball the diff, don't just
// accept it) rather than committed blind.
//
// Baselines are per-project AND per-platform: font hinting and subpixel
// rounding differ across OSes, so a baseline generated on Windows will
// immediately mismatch on a Linux runner. These were generated on Windows
// (there's no CI pipeline in this repo yet, so there's nothing to gate) —
// they're a dev-only regression check for `npm run test:visual` on this
// platform. Regenerate inside the matching
// mcr.microsoft.com/playwright:v1.61.1-noble image before trusting them as
// a gate in Linux CI.
//
// Run this through `npm run test:visual`, which pins PW_PROD=1 and --workers=2.
// Both matter. Turbopack's dev server intermittently serves a route as an empty
// document under this suite's load (a full-page shot came back 1440x900 — the
// bare viewport — against a 1440x11202 baseline), so dev is not a trustworthy
// source for baselines. And 100 full-page captures of pages up to ~13,000px
// tall will starve this machine at the default worker count: the failure shows
// up as "Failed to take two consecutive stable screenshots" on whichever routes
// happen to lose the race, and the same tests pass serially. Neither is a page
// defect, and neither should be diagnosed as one.
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
];
const routes = paths.flatMap((p) => [`/en${p}`, `/ar${p}`]);

// One test here is a navigation, a settle, and then two or more full-page
// captures of a page that can be 12,000px tall. The screenshot budget below is
// 30s on its own, which cannot fit inside Playwright's 30s default for the
// whole test — the tall desktop routes failed with a bare "Test timeout of
// 30000ms exceeded" before this was raised.
test.describe.configure({ timeout: 120_000 });

/**
 * Block until the DOM stops changing for `quietMs`, or `timeoutMs` elapses.
 *
 * `networkidle` is not a settle signal for this site: in dev the client bundle
 * hydrates *after* the network goes quiet, so the hero's entrance animations
 * (Hero.tsx's stat strip runs on `delay: 0.5-0.75s` from mount) only *begin*
 * once we have finished waiting for it. Those are driven by `motion`, which
 * rewrites the inline `style` attribute every frame, so nothing declarative
 * reaches them: `animations: "disabled"` on the assertion below fast-forwards
 * CSS animations and transitions, and a stylesheet override would be CSS-only
 * too. The visible symptom was not a pixel diff but
 * "generating new stable screenshot expectation ... Timeout 5000ms exceeded":
 * toHaveScreenshot spent its whole stabilisation budget re-shooting a page
 * that was still moving, so 9 of the 10 home baselines were never written at
 * all when this suite was first locked.
 */
async function waitForDomQuiet(page: Page, quietMs = 600, timeoutMs = 15000) {
  await page.evaluate(
    ([quiet, cap]) =>
      new Promise<void>((resolve) => {
        let lastChange = performance.now();
        const started = lastChange;
        const observer = new MutationObserver(() => {
          lastChange = performance.now();
        });
        observer.observe(document.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        });
        const tick = () => {
          const now = performance.now();
          // The cap is a floor under pathological pages, not the happy path:
          // reaching it means something mutates forever, and a slightly
          // unstable shot beats hanging the suite.
          if (now - lastChange >= quiet || now - started >= cap) {
            observer.disconnect();
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    [quietMs, timeoutMs] as const
  );
}

test.beforeEach(async ({ page }) => {
  // Same rationale as responsive.spec.ts: skip the first-visit curtain, it
  // has nothing to do with what this suite is checking.
  await page.addInitScript(() => {
    try {
      localStorage.setItem("acts-intro-seen", "1");
    } catch {
      /* storage blocked — IntroOverlay treats this as already-seen too */
    }
  });
});

for (const route of routes) {
  test(`${route} visual baseline`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    // Put every scroll-reveal into the state it reaches once scrolled to.
    // `fullPage` captures beyond the viewport *without scrolling*, so the
    // IntersectionObserver behind `.reveal` never fires for anything below the
    // fold and those sections stay at their `opacity: 0` base. That is why the
    // baselines locked in 18e5e05 are mostly blank below the first screen:
    // they were only ever able to catch an above-the-fold regression.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll(".reveal")) el.classList.add("in-view");
    });

    // NOTE: this deliberately does *not* inject `animation: none !important`.
    // That override used to live here, and it was self-defeating: `.digit-rise
    // > span`, `.stat-unit`, `.stat-rule` and `.chip-in` are all invisible at
    // their base (`opacity: 0` / `width: 0`) and are made visible only by a
    // `forwards` animation, so deleting the animation deletes the content.
    // It also disarmed `animations: "disabled"` below, which is Playwright's
    // supported way to do this properly — it fast-forwards finite animations
    // to their final frame and rewinds infinite ones to a fixed initial frame,
    // which is both more stable and more faithful than having no animation at
    // all. The rAF-driven loops the old comment worried about (WebGL scene,
    // d3 globe, flip-disk board) all paint into <canvas>, which is masked.
    // Load every deferred image before capturing. A `fullPage` shot can trigger
    // `loading="lazy"` images to fetch *during* the capture, so a below-the-fold
    // image is absent in one frame and present in the next. That is what stopped
    // /brands/farris-engineering from ever producing two matching frames — the
    // two attempts came out the same height (13238px) but different pixels, so
    // it was late-arriving image data, not a layout shift.
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll("img"));
      for (const img of images) if (img.loading === "lazy") img.loading = "eager";
      const settled = images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
      );
      // Capped: a masked remote poster that never resolves must not hang the run.
      await Promise.race([
        Promise.all(settled),
        new Promise<void>((resolve) => setTimeout(resolve, 8000)),
      ]);
    });

    await waitForDomQuiet(page);

    await expect(page).toHaveScreenshot(`${route.replace(/\//g, "_")}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
      // ytimg posters are fetched from YouTube's CDN, so whether they arrive —
      // and which frame they are — is outside this repo's control. A baseline
      // that fails when a third-party CDN is slow is testing the CDN, so mask
      // them for the same reason <video> and <canvas> are masked.
      mask: [
        page.locator("video"),
        page.locator("canvas"),
        page.locator('img[src*="ytimg.com"]'),
      ],
      // These pages are long — /en/ is 1440x12386 — and toHaveScreenshot needs
      // two *consecutive identical* captures before it will compare or write.
      // At this size a single full-page capture against the dev server is
      // already seconds, so the 5s default could not fit two of them even on a
      // perfectly static page: the shorter routes (/quote) and the narrower
      // viewports passed while the tall ones timed out with "generating new
      // stable screenshot expectation". That is a capture-budget limit, not a
      // page instability, and it is why most home baselines were never written.
      timeout: 30_000,
    });
  });
}
