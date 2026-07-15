import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
