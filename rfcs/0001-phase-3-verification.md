# RFC 0001 Phase 3 Verification

- Date: 2026-08-22
- Implementation status: Verified; delivery gates pending
- Independent code review: Approved after RFC 0002 re-review

## Source and Contract Checks

- Production-source scan for `created_by`, `updated_by`, `CreatedBy`, and `UpdatedBy`, excluding migrations, tests, and generated protobuf files: passed with zero matches.
- Protobuf declaration scan for `createdBy`, `updatedBy`, `createdUser`, and `updatedUser`: passed with zero active declarations.
- `go test ./protos/... -run TestAuditActorContract`: passed.
- `bash bin/artifacts-generate.sh`: passed. The plan's literal `bin/generate` path does not exist in this checkout; `bin/artifacts-generate.sh` is the repository generation entrypoint.
- `git diff --check`: passed.
- Production-source scans found no registry RPC, registry verifier, Ed25519 service-key environment variable, service key ID, or system-actor environment reference.
- Generated root, Document API, and SDK Web API contracts contain no service/system identity validation RPC while retaining actor-aware scoped-authentication fields.

## Go Verification

- `go test ./pkg/... ./api/assistant-api/... ./api/endpoint-api/... ./api/web-api/... ./api/integration-api/... ./cmd/assistant ./cmd/endpoint ./cmd/web ./cmd/integration ./protos/...`: passed.
- `go vet ./pkg/... ./api/assistant-api/... ./api/endpoint-api/... ./api/web-api/... ./api/integration-api/... ./cmd/assistant ./cmd/endpoint ./cmd/web ./cmd/integration ./protos/...`: passed.

## Database Verification

PostgreSQL 16.4 full histories were applied from version zero for all four databases.

| Database | Legacy columns after cleanup | Immutable creation-actor triggers | Actor pair constraints |
| --- | ---: | ---: | ---: |
| Assistant | 0 | 41 | 82 |
| Endpoint | 0 | 10 | 20 |
| Web | 0 | 14 | 22 plus stricter identity-table constraints |
| Integration | 0 | 2 | 4 |

- Each final cleanup down migration refused execution and directed operators to backup restoration.
- Representative Assistant, Endpoint, and Web rows verified direct conversion of positive legacy IDs to matching `user` actors, with null update attribution remaining null. Invalid null or non-positive legacy IDs fail before any backfill update runs.
- Representative writes in Assistant, Endpoint, Web, and Integration verified that invalid actor pairs are rejected and creation actor changes are blocked by the database trigger.
- `bash bin/verify-phase3-migrations.sh`: passed on PostgreSQL 16.4. Full histories reached Assistant 60, Endpoint 6, Web 12, and Integration 6. The validator checked every audited table's direct-update inventory, actor-column coverage, validated constraints, call-context schema and rollback, organization credential security, registry dependency-safe rollback, invalid-source preflight behavior, and absence of migration procedures and metrics tables.
- `PREVIOUS_RELEASE_REF=v3.0.0 bash bin/verify-phase3-rollback.sh`: passed. A four-database custom-format backup set was captured before cleanup, Web cleanup applied both versions 11 and 12, all four databases were restored together, restored active service/system registry linkage was verified, legacy read/write smoke tests passed, all prior `v3.0.0` service binaries built, and the restored prior Web binary reached its health endpoint.
- Restored legacy-column counts were Assistant 78, Endpoint 20, Web 24, and Integration 0, matching the pre-cleanup schemas.

## SDK and UI Verification

- Go SDK `go test ./...`: passed.
- Node SDK `npm test -- --runInBand`: 12 suites and 235 tests passed.
- Node SDK `npm run build`: passed.
- React SDK `npm run test:ci`: 14 suites and 298 tests passed after installing the undeclared `jest-junit` and `@testing-library/dom` test-only dependencies and restoring the lockfile's React 19.0.0 peer versions, without changing repository manifests or lockfiles.
- React SDK `npm run build`: passed; existing generated declaration warnings about `UnaryResponse` remained non-fatal.
- React widget tests: 2 suites and 15 tests passed.
- React widget build: passed with existing bundle-size warnings.
- UI tests: 95 suites and 758 tests passed.
- UI build: passed with existing lint and bundle warnings.
- Python SDK tests ran in an isolated virtual environment: 719 tests passed. `python3 -m compileall -q sdks/python api/document-api/app` also passed.
- `bash bin/verify-phase3-ui-types.sh`: passed. TypeScript 5.9.3 reported no diagnostic rooted in a changed Phase 3 UI source file; eight unrelated repository diagnostics remain.
- Phase 3 Document API tests: 31 passed. The exact full-suite command remains blocked during collection by the pre-existing mismatch between `tests/bridges/test_integration_bridge.py`, which expects provider-specific stubs, and the generated `UnifiedProviderServiceStub`; neither file is changed by Phase 3.

## RFC 0002 JWT-Only Service Authentication

- Service assertions now use HS256 with the existing application secret and `RAPIDA_service_id`; private-key, public-key, and key-ID configuration is removed.
- Go tests cover success, wrong secret, wrong algorithm, expiry, excessive lifetime, invalid actor IDs, malformed delegated scope, and prohibited user forwarding.
- Document API middleware verifies the same HS256 service contract, including audience, issuer presence, five-minute maximum lifetime, actor range, tenant scope, and absence of forwarded user identity.
- Web registry RPC handlers, runtime verifiers, entity/service code, and generated contracts are removed.
- Append-only Web migration `000012_remove_service_identity_registry` removes both registry tables and refuses unsafe down migration.

## Review Gate

Independent reviewer Hume approved the complete JWT-only implementation diff on 2026-08-22 with no critical or major findings after fixes for exact bigint decoding, non-service actor spoofing, and registry-aware rollback startup validation. The review record is preserved in `rfcs/0002-jwt-only-service-auth.review.md`.

Generated protobuf and SDK changes are committed in their nested repositories and recorded by the root Phase 3 commit.

Deployment of the simplified direct backfill remains gated on release-owner approval recorded in the release pull request.

## RFC 0003 Simplified Audit Backfill

- Persisted migration metrics, stored backfill procedures, batch loops, and interruption-resume logic are removed.
- Assistant, Endpoint, and Web legacy audit IDs map directly to `user` actor pairs; Integration history remains `unknown` because it has no legacy actor ID.
- Go tests that parsed migration SQL, including the call-context migration-file test, are removed. Their contracts are covered by executable PostgreSQL validation.
- RFC 0003 was independently challenged and approved before implementation; deployment remains blocked until operational readiness is approved.
