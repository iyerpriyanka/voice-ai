# Layout Components

Layout components own page structure, shell navigation, headers, footers, and
section framing. They may compose shared UI primitives and Carbon shell
components, but they should not own product workflows or domain data behavior.

## Component Groups

- `brand`: branded layout elements such as `BrandedLogo`.
- `blocks`: reusable page header, title, action, pagination, and divider blocks.
- `container`: page-level containers such as authenticated and unauthenticated
  shells.
- `footer`: footer shell components.
- `heading`: reusable heading treatments for page-level content.
- `navigation`: application navigation surfaces such as header, action bar, and
  sidebar.
- `sections`: repeated page section containers.
- `wrapper`: local framing wrappers used by pages and forms.

## Development Rules

- Keep layout components focused on structure, spacing, and navigation.
- Do not place product-specific state machines, provider rules, or form business
  logic in this folder.
- Prefer Carbon shell components for navigation, header, footer, global actions,
  and menu-like controls.
- Prefer theme tokens such as `bg-shell`, `bg-surface`, `text-foreground`, and
  `border-border-subtle` over hard-coded light and dark color pairs.
- Keep route-level side effects in `app-shell`, not `layout`.
- Keep tests and stories beside the component they document.

## Storybook

Layout stories should use native Storybook CSF and autodocs. Stories should show
stable layout states such as default, compact, loading, and error states. Do not
add standalone demo pages when a focused component story is enough.

Run layout stories locally with:

```bash
just ui-storybook
```

Build the static Storybook output with:

```bash
just ui-storybook-build
```

## Testing

Layout tests should assert observable structure and accessibility:

- landmarks, labels, and links
- Carbon component usage where it affects behavior
- theme-driven logo and link rendering
- collapsed, expanded, loading, and guarded states

Run focused layout tests with:

```bash
just ui-test src/app/components/layout
```

Create a focused layout Allure report with:

```bash
just ui-report src/app/components/layout
```

## License

This folder is covered by the repository license in `../../../../../LICENSE.md`.
