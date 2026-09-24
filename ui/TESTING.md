# UI Testing

## Jest

Use the repository `just` recipes from the repository root for the standard UI
workflow:

```bash
just ui
```

This installs UI dependencies, prepares generated CSS, generates Allure and
coverage reports, and builds Storybook static docs. After it completes, use:

```bash
just ui-storybook
just ui-report-open
```

Run the full UI test suite with:

```bash
just ui-test
```

Run coverage with:

```bash
just ui-test-coverage
```

## Allure Report

Allure is opt-in for local report generation. Normal Jest commands do not write
Allure artifacts.

The Allure CLI requires Java at runtime.

Generate fresh Allure results, build the HTML report, and write Jest coverage
with:

```bash
just ui-report
```

The full report command writes:

- Allure test report: `ui/allure-report/index.html`
- Jest coverage report: `ui/coverage/lcov-report/index.html`

Open an existing generated report with:

```bash
just ui-report-open
```

Serve a temporary report directly from test results with:

```bash
just ui-report-serve
```

Run a focused component report by passing the Jest path:

```bash
just ui-report src/app/components/app-shell
```

Focused reports write Allure results for the selected path. They do not run
global coverage because repository coverage thresholds are intended for the full
UI suite.

Allure writes generated files to `ui/allure-results` and `ui/allure-report`.
Coverage writes generated files to `ui/coverage`. These folders are ignored by
git.

## Playwright E2E

Playwright covers browser-level route smoke, accessibility, and screenshot
journeys. Install browsers once after dependencies are installed:

```bash
just ui-e2e-install
```

Run the route coverage tripwire without starting a browser:

```bash
just ui-e2e-routes
```

Run focused browser lanes:

```bash
just ui-e2e-smoke
just ui-e2e-a11y
just ui-e2e-screenshots
```

Run the complete Playwright lane:

```bash
just ui-e2e
```

The route manifest lives in `ui/e2e/route-manifest.js`. Every top-level app
route in `ui/src/app/index.tsx` must be represented there as a journey, an
explicit deferred route, or a disabled feature route. Every nested route path
literal in `ui/src/app/routes/*.tsx` must also have an explicit source-route
decision in the manifest.

Screenshot artifacts are written under `ui/e2e-artifacts/screenshots` and are
ignored by git. Visual regression baselines are kept beside the screenshot spec
in Playwright's snapshot folder and should be updated intentionally with:

```bash
cd ui && yarn playwright test e2e/screenshot-journey.spec.js --update-snapshots
```

Known serious or critical accessibility findings are scoped in
`ui/e2e/a11y-baseline.js`. Remove an entry when the underlying UI issue is
fixed. New unlisted serious or critical findings fail `just ui-e2e-a11y`.
