# UI Component Structure

This directory is split by component responsibility:

- `primitives`: reusable design-system wrappers and small base components.
- `composites`: reusable UI assemblies built from primitives or Carbon components.
- `feedback`: notifications, empty states, indicators, and loading states.
- `editor`: code, JSON, and markdown editing or rendering components.
- `table`: table-specific components and cells.

Prefer adding new shared controls to the smallest matching group. Keep domain-specific
behavior in `components/domain` or the owning page folder.
