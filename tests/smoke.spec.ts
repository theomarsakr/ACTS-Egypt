import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Scan the settled, reduced-motion state: entrance fades snap to their resting
// values instantly, so axe measures true resting contrast instead of catching
// text mid-fade at partial opacity. Set here rather than in the shared
// playwright.config.ts `use` block, which would silently disable every effect
// the responsive/smoothness suites exist to verify is actually running.
//
// Routed through `contextOptions` deliberately. The obvious spelling —
// `test.use({ reducedMotion: "reduce" })` — type-checks (test.d.ts declares
// the key) but is silently DISCARDED by the runner: node_modules/playwright/
// lib/index.js defines a fixture per context option and assembles them in
// `_combinedContextOptions`, and `reducedMotion` appears in neither (nor does
// `forcedColors`) — grep the file, it contains zero occurrences. The last line
// of that fixture spreads `...contextOptions` straight into newContext(), so
// this form is the one that actually reaches the browser. Verified by hand:
// with the plain spelling, matchMedia("(prefers-reduced-motion: reduce)")
// reported false inside the page while `colorScheme` and `locale` set the same
// way both applied. That silent drop is what made this suite flaky — SpecSheet
// reads the query via useReducedMotion() to decide whether to skip its 0.55s
// opacity ramp, never saw it, and axe sampled a row mid-fade: the brass token
// #8a6a30 (5.02:1 on white) blended toward white to #987c49 at 3.95:1, a
// "serious" contrast violation that no user could ever encounter at rest.
test.use({ contextOptions: { reducedMotion: "reduce" } });

// axe injects ~600KB of axe-core into every frame, then walks the whole DOM
// twice (runPartial per frame, then finishRun on a second blank page). On the
// heaviest routes — / and /brands — that is 10-25s on its own, and Playwright's
// 30s default leaves no headroom once parallel workers are also competing for
// Turbopack's first-compile of each route. The symptom is a `page.evaluate:
// Test timeout` attributed to AxeBuilder.analyze, which reads like an axe crash
// but is only this suite running out of clock. This is a health gate, not a
// performance budget: give it room rather than reporting harness starvation as
// a page failure.
test.describe.configure({ timeout: 120_000 });

const routes = [
  "/",
  "/about",
  "/industries",
  "/products",
  "/projects",
  "/contact",
  "/brands",
  "/brands/farris-engineering",
  "/quote",
];

for (const route of routes) {
  test(`${route} loads cleanly and passes critical a11y checks`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status(), `${route} should respond with a non-error status`).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Force scroll-reveal wrappers to their settled, fully-opaque resting state
    // before the a11y scan. WCAG contrast applies to the readable resting state,
    // not the sub-second entrance fade; without this, axe can sample text
    // mid-transition at partial opacity and report false contrast failures.
    await page.addStyleTag({
      content:
        ".reveal { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }",
    });

    // The rule above only reaches CSS-driven reveals. Components that animate
    // through `motion` write opacity as an inline style on each element, which
    // no stylesheet selector here can target, so snap any still-running
    // entrance to its final frame as well. `networkidle` is not a settle
    // signal for these: in dev the client chunk can hydrate and mount *after*
    // the network goes quiet, starting the fade only once we have finished
    // waiting for it.
    // Only finite ones: the site's ambient loops (mesh drift, shimmer spark,
    // border-beam) iterate forever, and `finish()` on an infinite effect throws
    // InvalidStateError, which would fail every route here. Those loops are
    // decorative and never gate text legibility, so skipping them is correct as
    // well as necessary.
    await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        const endTime = animation.effect?.getComputedTiming().endTime;
        if (!Number.isFinite(Number(endTime))) continue;
        try {
          animation.finish();
        } catch {
          // Already finished, or not yet ready — either way, nothing to settle.
        }
      }
    });
    await page.waitForTimeout(150);

    expect(consoleErrors, `${route} should have no console errors:\n${consoleErrors.join("\n")}`).toEqual([]);

    const results = await new AxeBuilder({ page })
      .include("body")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const seriousOrWorse = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(
      seriousOrWorse,
      `${route} has critical/serious a11y violations:\n${JSON.stringify(seriousOrWorse, null, 2)}`
    ).toEqual([]);
  });
}
