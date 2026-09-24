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
