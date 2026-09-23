# Testing

Reusable test data lives in `src/testing`.

- `fixtures` contains realistic JSON payloads grouped by domain.
- `builders` converts fixture rows into protobuf-like test doubles when existing
  UI code expects SDK getter methods.

Page and store tests should prefer fixture-backed client mocks over hard-coded
inline data when testing end-to-end UI flows.
