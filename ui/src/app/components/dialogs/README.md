# Dialog Component Structure

Dialogs are grouped by ownership:

- `assistant`: assistant configuration and deployment dialogs.
- `endpoint`: endpoint configuration, instructions, and trace dialogs.
- `conversation`: conversation-specific detail and telemetry dialogs.
- `knowledge`: knowledge-base document and segment dialogs.
- `provider`: provider credential dialogs.
- `workspace`: project and user management dialogs.
- `activity`: activity log detail dialogs.
- `shared`: reusable modal shells, confirmations, and small dialog helpers.

Prefer importing from the owning group index, for example
`@/app/components/dialogs/assistant`. Keep new domain-specific dialogs out of
`shared` unless they are reused by multiple groups.

Within dialog modules, exact imports from sibling shared modules are acceptable when
they avoid loading unrelated dialog groups or browser-only dependencies.

Tests may import or mock specific dialog files when that keeps the test focused. New
production code should use the group index.
