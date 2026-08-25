import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    // NOT reducedMotion here — that used to live in this shared block, which
    // meant every spec (including the responsive/smoothness suites this
    // config now serves) silently measured the site with every animation
    // turned off. Left there, a suite meant to verify motion actually works
    // would pass against a site with the motion disabled. smoke.spec.ts opts
    // into it explicitly via test.use() instead, since ITS reasoning for
    // wanting the settled state (axe should sample resting contrast, not a
    // mid-fade frame) is specific to that spec.
  },
  projects: [
    // Desktop is the only project that also runs smoke.spec.ts — that suite
    // is a single basic health+a11y gate, not viewport coverage (that's what
    // the other four projects + the responsive/visual/smoothness suites are
    // for). Without this split, adding four projects would silently turn 9
    // smoke tests into 45.
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "laptop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } },
      testIgnore: /smoke\.spec\.ts/,
    },
    // Touch + coarse-pointer projects. isMobile/hasTouch (set by these
    // device presets) is what makes `pointer: coarse` actually match — the
    // .tap-target ::after overlays and every pointer-coarse: utility in
    // globals.css are inert without it, and a tap-target spec run under a
    // project missing this would silently measure the wrong thing.
    // Also overridden to chromium — iPad Mini defaults to webkit too, and
    // exhibits the identical @theme-resolution corruption described below.
    { name: "tablet", use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" }, testIgnore: /smoke\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 5"] }, testIgnore: /smoke\.spec\.ts/ },
    // "ios" is Chromium wearing the iPhone 12's viewport/UA/touch profile,
    // NOT real WebKit — verified by hand (see tests/responsive.spec.ts's
    // gray-400 regression lock) that Playwright's WebKit build on this
    // Windows machine fails to resolve Tailwind v4's @theme custom
    // properties at all: a `max-w-6xl` container computed `max-width: none`
    // instead of 1152px, `rounded-2xl` computed `0px` instead of 28px, and
    // every color token fell back to black. That's a documented category of
    // Playwright/WebKit limitation (microsoft/playwright#30208), not
    // something fixable from this repo, and it corrupts every dimension this
    // Tailwind v4 site depends on — not just color — so real WebKit here
    // would produce a baseline full of false overflow/sizing failures.
    // Overridden to chromium explicitly (spread order: this key must come
    // after ...devices, which sets defaultBrowserType: "webkit"). This still
    // covers what actually matters for THIS suite — the 390px viewport and
    // coarse pointer/touch — but NOT genuine WebKit engine divergence
    // (safe-area-inset, dvh/svh, real focus-zoom behavior). Verify those by
    // hand on a real device or a macOS-hosted CI; don't trust this project
    // for them.
    { name: "ios", use: { ...devices["iPhone 12"], defaultBrowserType: "chromium" }, testIgnore: /smoke\.spec\.ts/ },
  ],
  webServer: {
    // Turbopack dev-mode compiles routes on first request; a sweep hitting
    // ~20 routes x 5 projects in parallel triggers concurrent first-compiles
    // that can race (observed: a transient 500 from a manifest read during
    // another route's compile). PW_PROD=1 runs the real production build
    // instead, which has no such race. `npm run build && npm run start`
    // costs ~30-60s up front but is the actual gate signal.
    command: process.env.PW_PROD ? "npm run build && npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
