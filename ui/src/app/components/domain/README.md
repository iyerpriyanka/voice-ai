# Domain Component Structure

Domain components are reusable product components. They may know about Rapida
model objects, workflow names, provider metadata, or project concepts, but they
should not own page routing or global layout.

Current groups:

- `avatar`: user and project avatar presentation.
- `cards`: repeated domain cards for knowledge, providers, credentials, and tools.
- `conditions`: reusable condition builders.
- `configuration`: shared configuration editors and prompt controls.
- `dropdowns`: domain-aware selector controls.
- `external-api`: request and parameter UI for external API tools.
- `indicators`: status, role, source, and version indicators.
- `integration-document`: generated integration snippets and guides.
- `pills`: compact domain labels.
- `prompt-editor`: prompt editor logic and suggestions.
- `providers`: provider-specific configuration panels.
- `tags`: duplicate-free domain tag catalogs for selectors.
- `tools`: assistant tool configuration components.

Add a folder when a component belongs to a new product concept and is reused
across pages. Keep page-only UI in the owning page folder.
