# Component Structure

This tree is organized by ownership and reuse level:

- `app-shell`: application-level shell concerns such as document metadata.
- `layout`: reusable page layout, navigation, section, and wrapper components.
- `ui`: shared design-system components and reusable UI assemblies.
- `dialogs`: modal workflows grouped by product domain.
- `domain`: reusable business-domain components that are not generic UI primitives.

Use the narrowest owner that matches the component:

- Generic controls belong in `ui`.
- Page layout belongs in `layout`.
- Product concepts such as provider cards, tool forms, and config renderers belong in
  `domain`.
- Modal workflows belong in the matching `dialogs` domain folder.

See `domain/README.md`, `dialogs/README.md`, and `ui/README.md` for group-level
contracts and import rules.

Production consumers outside a component group should prefer group indexes such as
`components/ui/primitives` or `components/dialogs/assistant`. Files inside
`components/ui` and `components/dialogs` may import exact sibling modules to avoid
barrel cycles and unrelated test dependencies. Tests may mock specific files directly
when a focused mock would be clearer than mocking an entire group barrel.
