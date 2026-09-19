# UI Testing

## Jest

Use the repository `just` recipes from the repository root for the standard UI
workflow:

```bash
just ui
```

This installs UI dependencies, prepares generated CSS, generates an Allure
report, and builds Storybook static docs. After it completes, use:

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

Generate fresh Allure results and build the HTML report with:

```bash
just ui-report
```

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

Allure writes generated files to `ui/allure-results` and `ui/allure-report`.
Both folders are ignored by git.
