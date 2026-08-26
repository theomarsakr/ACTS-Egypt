import { test, expect } from "@playwright/test";

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

    // Freeze every animation and transition dead rather than relying on the
    // `reducedMotion` context option alone: the orbit, mesh drift, marquee,
    // WebGL scene and d3 globe redraw are all driven by rAF loops that don't
    // read prefers-reduced-motion at all in some components (see the plan's
    // audit of RotatingEarth), so only a hard style override guarantees a
    // stable frame to screenshot.
    await page.addStyleTag({
      content: "*, *::before, *::after { animation: none !important; transition: none !important; }",
    });
    await page.waitForTimeout(150);

    await expect(page).toHaveScreenshot(`${route.replace(/\//g, "_")}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
      mask: [page.locator("video"), page.locator("canvas")],
    });
  });
}
