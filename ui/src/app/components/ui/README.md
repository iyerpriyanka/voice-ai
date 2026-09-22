# UI Component Structure

This directory is split by component responsibility:

- `primitives`: reusable design-system wrappers and small base components.
- `composites`: reusable UI assemblies built from primitives or Carbon components.
- `feedback`: notifications, empty states, indicators, and loading states.
- `editor`: code, JSON, and markdown editing or rendering components.
- `table`: table-specific components and cells.

Prefer adding new shared controls to the smallest matching group. Keep domain-specific
behavior in `components/domain` or the owning page folder.

Complex composites can use folder modules when they need private model logic or
subcomponents. For example, `composites/query-search` owns its parser/model module,
component, tests, and public index together.

New shared imports from page and domain code should prefer the group indexes when
practical:

- `@/app/components/ui/primitives`
- `@/app/components/ui/composites`
- `@/app/components/ui/feedback`
- `@/app/components/ui/editor`
- `@/app/components/ui/table`

Inside `components/ui`, prefer exact sibling module imports over group indexes. This
keeps primitive, editor, feedback, and table modules from creating barrel cycles or
loading unrelated browser-only dependencies during focused tests.

Components that import browser-only packages or app configuration should stay
direct-import only and should not be exported from group barrels. Current examples are
`composites/audio-player`, `editor/markdown-viewer`,
`primitives/buttons/arrow-button`, and `primitives/buttons/social-button-group`.
Dialog modules with store dependencies, such as `dialogs/shared/create-tag-modal`,
follow the same direct-import rule.

Avoid importing production page or domain code from a specific shared component file
unless the module has a default export, owns a browser-only dependency, or a focused
test mock needs a file-level boundary.

## Stories And Tests

Use native Storybook CSF stories beside the component group they document. Small
wrappers may share a group story when the story still exposes each public state clearly;
for example, `primitives/primitives.stories.tsx` documents the primitive wrappers and
`table/table.stories.tsx` documents table composition and pagination.

Keep UI component tests in the nearest `__tests__` folder:

- `primitives/__tests__` for primitive wrappers.
- `table/__tests__` for table primitives and pagination.
- `feedback/__tests__`, `editor/__tests__`, and `composites/__tests__` for their
  matching groups.
- Folder modules, such as `composites/query-search`, may keep their own local
  `__tests__` folder beside private model code.

Run focused UI tests with:

```bash
just ui-test src/app/components/ui
```

Build Storybook before publishing UI structure changes:

```bash
just ui-storybook-build
```
