# App Shell Components

App shell components own route-level side effects. They are mounted around pages
and should not render product UI, layout chrome, or reusable controls.

## Components

- `Helmet`: sets the document title and route metadata from the active theme.
- `GA`: sends route pageviews only when analytics is enabled for the current
  runtime environment and host.

## Development Rules

- Keep shell components small and side-effect focused.
- Do not import page modules, domain components, dialogs, or layout components
  into this folder.
- Keep runtime reads behind explicit adapters, such as `getRuntimeEnv`, so
  Create React App and future Vite migration work stay isolated.
- Prefer pure exported functions for behavior that needs tests, such as route
  path creation or analytics gating.
- Shell stories should use native Storybook CSF and autodocs. Avoid extra demo
  pages or custom documentation layouts here.

## Storybook

Each shell component should have a nearby `*.stories.tsx` file with:

- `tags: ['autodocs']`
- controls for public props
- one default story
- edge stories for guarded or fallback behavior

The global Storybook preview owns the light and dark background switch. App shell
stories should not add their own theme wrapper unless the component contract needs
one.

## Testing

Each shell behavior should have nearby tests:

- `helmet.test.tsx` verifies document title and meta behavior.
- `ga.test.tsx` verifies analytics gating, route path creation, and tracking
  calls.

Run focused checks with:

```bash
CI=true yarn --cwd ui test --watchAll=false src/app/components/app-shell
yarn --cwd ui build-storybook --quiet
```

Create a focused Allure report for this folder with:

```bash
just ui-report src/app/components/app-shell
```

See `../../../../TESTING.md` for the UI-wide test and report workflow.

## License

This folder is covered by the repository license in `../../../../../LICENSE.md`.
