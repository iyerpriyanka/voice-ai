# Stores

Zustand stores live in `src/stores`.

Stores own page and workflow state, including pagination, selected records,
loading orchestration callbacks, and state updates after client responses.

## Layout

- `activity`: activity, conversation, tool, and webhook log state.
- `app`: application-wide UI state.
- `assistant`: assistant listing, provider, chat, conversation, and action state.
- `auth`: authentication session state.
- `endpoint`: endpoint listing, version, provider model, and log state.
- `knowledge`: knowledge base, document, segment, creation, and log state.
- `user`: user listing state.

Stores should call `src/clients` for API access. They should not import
`connectionConfig` or call `@rapidaai/react` API functions directly.

Keep store tests in the nearest `__tests__` folder and mock `src/clients`.
