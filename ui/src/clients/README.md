# Clients

All UI API access belongs in `src/clients`.

Current client files:

- `activity.client.ts`
- `assistant.client.ts`
- `authentication.client.ts`
- `connect.client.ts`
- `credential.client.ts`
- `endpoint.client.ts`
- `knowledge.client.ts`
- `runtime.client.ts`
- `user.client.ts`
- `workspace.client.ts`

Client files own:

- `@rapidaai/react` calls.
- `connectionConfig` usage.
- API metadata/header mapping.
- Request and response transport details.

Hooks and Zustand stores own:

- Page or workflow state.
- Loading, error, and success orchestration.
- Updating local state after a client response.

Pages and components should not call `@rapidaai/react` directly. During migration,
move one workflow at a time and keep the existing hook or store API stable.
