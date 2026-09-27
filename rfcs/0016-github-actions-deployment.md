# RFC 0016: Separate GitHub Actions Validation, Publication, and Deployment

- Status: Draft
- Owner: Voice AI maintainers
- Created: 2026-09-27
- Updated: 2026-09-27
- Reviewers: Independent repository maintainer, release owner, and deployment owner

## Summary

Reorganize GitHub Actions into three trust boundaries: credential-free validation,
trusted publication, and environment-gated deployment. Preserve `Continuous Integration`
and its `CI Complete` result for pull requests and pushes, but remove inherited secrets
and any registry or environment access from code validation. After successful validation
of an exact `main` commit, publish immutable release assets and digest-addressed container
images once, then promote those same artifacts to `dev` or `production` without rebuilding.
Reorder independent validation jobs and reuse Docker build caches so a warm-cache full CI
run completes in under 30 minutes without reducing coverage.

The design gives validation, publication, containers, and deployment distinct entry
points, with deployment scoped through a GitHub Environment. It avoids broad permissions,
dynamic environment selection, and unrelated workflows.

Deployment remains blocked while this RFC is Draft. The repository has no verified runtime
target, deploy command, health check, rollback command, `dev` or `production` Environment,
environment reviewer assignment, or registry retention contract.

## Context

The current workflow graph mixes trust and release timing:

- `.github/workflows/ci.yml` runs the integrated Go, UI, repository, Docker, native, and
  end-to-end validation graph. Its Go and UI reusable calls use `secrets: inherit` only so
  optional Codecov tokens can be passed.
- `.github/workflows/reusable-docker-ci.yml` correctly sets `push: "false"`.
  `.github/actions/docker-build/action.yml` now validates registry credentials and logs in
  only when `push` is true. This fixed the unconditional Docker Hub login that failed fork
  pull requests 220 and 205, and the contract must not regress.
- `.github/workflows/docker-publish.yml` runs independently on pushes and can publish
  `latest`, date, and short-SHA aliases before the matching `Continuous Integration` run has
  succeeded.
- `.github/workflows/tag-and-package-services.yml` admits successful same-repository
  `main` push runs and creates an immutable `build-YYYYMMDD-<short-sha>` tag. Its reusable
  `.github/workflows/package.yml` still uses `gh release upload --clobber`, so a rerun can
  replace release assets.
- The five active release services are `web-api`, `integration-api`, `endpoint-api`,
  `assistant-api`, and `ui`, as established by RFC 0012 and the current CI and package
  matrices.
- The repository has only a `main` branch. Existing `develop` and `saas` triggers do not
  represent current upstream branches.
- GitHub currently has only an unprotected `copilot` Environment. `dev` and `production`
  do not exist.
- `.github/workflows/build-aws-ami.yml` fails because AWS credentials are unavailable, and
  both marketplace workflows reference absent paths under `deploy/`. The GCP workflow is
  manually triggerable and uses a long-lived service account key.
- Three recent successful full CI runs took 52 minutes 45 seconds, 54 minutes 24 seconds,
  and 60 minutes 19 seconds. The graph serializes roughly 5 minutes of basic checks, 4 to 7
  minutes of Docker builds, 16 to 17 minutes of assistant native verification, and 27 to
  31 minutes of end-to-end jobs.
- The assistant native job consumes no Docker or end-to-end output, but waits for Docker.
  Each end-to-end job uses an isolated Compose project and consumes no result from the
  preceding test job, but integration, smoke, and the final two suites are serialized.
- End-to-end cache scopes include the workflow run ID. They cannot reuse the stable
  per-service cache created by Docker validation or a preceding CI run.

This is a Governed change because it defines credential boundaries and production rollout
behavior. This RFC contains the authoritative proposed design at the baseline commit
`80a98d8c7dbf840e6fa38094f9c022164816a9e0`.

## Goals

- Make every pull-request validation path succeed without repository, organization, or
  environment secrets, including pull requests from forks.
- Preserve one stable `Continuous Integration` workflow and `CI Complete` required-check
  conclusion with the existing validation coverage.
- Reduce a warm-cache full CI run from the observed 53 to 60 minutes to under 30 minutes,
  and keep documentation-only validation under 5 minutes, without removing a check.
- Admit publication only for an exact commit on `main` whose push-triggered
  `Continuous Integration` run succeeded.
- Preserve the RFC 0012 build-tag and five-package contracts while making release assets
  conflict-safe.
- Publish all five container images with full-SHA tags and record their immutable registry
  digests in a versioned `images.json` release asset.
- Promote an existing build to `dev` or `production` through separate, guarded GitHub
  Environments without rebuilding or retagging its deployable identity.
- Give each job only the GitHub and external permissions needed for its own operation,
  preferring environment-scoped OIDC for deployment.
- Make source selection, artifact verification, environment approval, deployment health,
  and rollback observable and testable.

## Non-Goals

- Application, API, UI, database, schema, authentication, Dockerfile, Compose, or provider
  behavior changes.
- New cloud infrastructure or restoration of the removed Azure deployment.
- A registry migration, custom GitHub App, generic workflow generator, or multi-cloud
  deployment framework.
- Splitting the integrated CI graph merely to mirror another workflow layout.
- `pull_request_target`, deploy-time builds, automatic production deployment, or dynamic
  GitHub Environment names.
- Automated deletion of tags, releases, container digests, deployment history, or
  environment records.
- Restoring either marketplace image workflow without a separate approved source, target,
  OIDC, verification, and rollback contract.

## Scope and Ownership

### Allowed Paths

- `.github/actions/docker-build/action.yml`: Docker validation and publication guard.
- `.github/workflows/ci.yml`: credential-free validation entry point and stable result.
- `.github/workflows/reusable-go-ci.yml`: Go validation without inherited secrets.
- `.github/workflows/reusable-ui-ci.yml`: UI validation without inherited secrets.
- `.github/workflows/reusable-repository-ci.yml`: repository validation.
- `.github/workflows/reusable-docker-ci.yml`: non-publishing Docker validation.
- `.github/workflows/reusable-assistant-native-ci.yml`: native assistant validation.
- `.github/workflows/reusable-end-to-end-ci.yml`: end-to-end validation.
- `.github/workflows/package.yml`: reusable generation of the five service packages.
- `.github/workflows/publish.yml`: trusted source admission, build tag, images, manifest,
  and release publication.
- `.github/workflows/deploy.yml`: static `dev` and `production` promotion jobs after the
  blocking deployment contract is resolved.
- `.github/workflows/docker-publish.yml`: removal from active publication after replacement
  verification.
- `.github/workflows/tag-and-package-services.yml`: removal from active publication after
  replacement verification.
- `.github/workflows/build-aws-ami.yml`: removal from active Actions if confirmed obsolete.
- `.github/workflows/build-gcp-image.yml`: removal from active Actions if confirmed obsolete.
- `just/ci.just`: workflow policy validation integration.
- `just/ci-service-boundaries.sh`: service-matrix parity if the workflow reorganization
  changes its current assertions.
- `just/ci-github-actions.sh`: focused workflow trust and immutability contract checks.
- `README.md`: operator-facing publication, environment, verification, and rollback
  documentation.
- `rfcs/0016-github-actions-deployment.md`: this RFC.

### Out-of-Scope Paths

- `api/**`
- `cmd/**`
- `pkg/**`
- `ui/**`
- `docker/**`
- `docker-compose*.yml`
- `env/**`
- `config/**`
- `protos/**`
- `sdks/**`
- `.github/workflows/docker-publish-base.yml`
- `deploy/**`

### Ownership

- The CI workflow implementer owns fork-safe validation and the stable `CI Complete`
  conclusion.
- The publishing implementer owns trusted source admission, immutable build tags and
  release assets, full-SHA image tags, registry digests, and retirement of duplicate
  publication entry points.
- The deployment implementer owns the two static environment jobs and target-specific
  deploy, health, and rollback behavior only after the target decisions are approved.
- The workflow contract implementer owns executable trigger, secret, environment, digest,
  and workflow-name checks.
- The documentation implementer owns operator guidance.
- The repository administrator owns branch protection, GitHub Environment policy,
  environment-scoped identities, reviewer configuration, Docker Hub credential scope, and
  registry retention outside Git.

No implementation owner may edit an out-of-scope path. A required runtime manifest or
script under `deploy/**` requires a separately approved scope change before work starts.

## Proposed Design

### Trust Boundary and Flow

The three entry points have one-way authority:

1. `ci.yml` validates an untrusted or trusted source commit and produces only the
   `CI Complete` result for that exact SHA.
2. `publish.yml` independently proves that the source is a successful same-repository
   `main` push, then creates the immutable build record for that SHA.
3. `deploy.yml` accepts only an existing build tag, verifies its release assets and image
   digests, and promotes it through one selected GitHub Environment.

Validation never calls publication or deployment. Publication never deploys. Deployment
never checks out a different commit, rebuilds a package or image, or derives an image from
a mutable alias.

### Credential-Free Validation

Keep `.github/workflows/ci.yml` as the only integrated validation entry point for
`pull_request`, pushes to `main`, and manual validation. Remove the obsolete `develop`
push trigger. Keep the workflow-level GitHub token read-only and preserve the workflow name
`Continuous Integration` and terminal job name `05 CI Complete` unless branch protection is
updated atomically.

The Go and UI reusable workflow calls receive no inherited repository, organization, or
environment secrets. Codecov upload may use its public-repository tokenless behavior and
remains non-blocking, but a missing external token must not change validation success. No
PR-reachable job may log in to a registry, publish an artifact outside the run, request an
OIDC token, or bind a GitHub Environment. The only GitHub credential available to a PR job
is the platform-provided ephemeral token constrained by the declared read-only permissions.

Keep `push: "false"` at the call from `reusable-docker-ci.yml` into the composite Docker
action. The action keeps both credential validation and registry login behind
`inputs.push == 'true'`. `just/ci-github-actions.sh`, called by the repository CI checks,
must fail if this relationship changes or if any PR-reachable workflow gains a secret,
write permission, publish step, or environment.

### CI Performance and Stage Graph

Keep the numbered job names as the visual CI stages. Do not add a deployment `stage`
input to validation workflows. Environment names such as `dev` and `production` select
deployment infrastructure; they are not CI ordering mechanisms.

The optimized full-validation graph is:

1. Run the existing Go, UI, and repository basics in parallel.
2. After basics pass, run Docker validation and assistant native verification in parallel.
3. After Docker validation has populated its caches, run all-service integration, smoke,
   user flows, and telephony callbacks in parallel. Each keeps its own Compose project,
   volumes, credentials, diagnostics, and reports.
4. Preserve `05 CI Complete` as the sole integrated result and make it account for passed
   and intentionally skipped jobs.

No current dependency passes an artifact or mutable state to the next stage. The existing
ordering is fail-fast policy only, so removing those false dependencies does not change
the assertions executed by each suite.

Use the same stable per-service BuildKit cache scopes in Docker and end-to-end validation.
Add the end-to-end test-runner image to the Docker cache-warming stage. A pull request may
read the default branch cache, but it receives no credential and must remain correct on a
cache miss. BuildKit continues to validate source-dependent layers, so cache reuse cannot
substitute artifacts from another commit.

Add one read-only change-classification job inside `ci.yml`. Documentation-only changes
skip Go, UI, Docker, native, and end-to-end execution but still produce `05 CI Complete`.
Any change to workflow policy, dependencies, Dockerfiles, Compose, CI scripts, shared Go
packages, generated contracts, or an unclassified path runs the full graph. Keep this
classifier conservative and cover it in `just/ci-github-actions.sh`; do not use top-level
`paths-ignore`, which can leave a required check absent.

Do not combine the already parallel Go and UI jobs in the first optimization pass. Their
current critical path is about five minutes, and serializing them would trade a small
runner-cost reduction for slower feedback. Revisit grouping only after the stage graph,
cache reuse, and path classification are measured.

Measure the created-to-completed duration for at least three successful warm-cache full
runs. The median must be under 30 minutes, no individual job may lose an assertion, and a
cache miss must pass. If the target is missed, retain the safe parallel graph and inspect
recorded job timing before adding another optimization.

### Trusted Publication Admission

`.github/workflows/publish.yml` becomes the single automatic and manual publication entry
point.

For `workflow_run`, publication proceeds only when every condition below is true:

- the completed workflow is exactly `Continuous Integration`;
- its conclusion is `success`;
- its triggering event is `push`;
- its head repository is exactly `rapidaai/voice-ai`;
- its head branch is `main`; and
- the selected source is exactly the 40-character `workflow_run.head_sha`.

For `workflow_dispatch`, the required input is a full 40-character commit SHA. The
workflow proves that the commit is on `main` and that a successful push-triggered
`Continuous Integration` run exists for exactly that SHA. A branch name, tag, abbreviated
SHA, pull-request run, fork run, or successful run for another SHA is rejected.

Source selection happens before any write permission or Docker Hub credential is exposed.
Read-only admission jobs may use `contents: read` and `actions: read`. The job that creates
the build tag and release receives job-local `contents: write`. Only image publication jobs
receive the namespace-limited Docker Hub robot identity. Checkouts that do not push a tag
set `persist-credentials: false`.

Publication concurrency is keyed by the full source SHA and uses
`cancel-in-progress: false`. A rerun may finish an incomplete publication but cannot move a
tag, replace a conflicting release asset, or associate a build tag with another commit.

### Immutable Build Record

Preserve RFC 0012's annotated tag:

`build-<UTC commit date as YYYYMMDD>-<first 7 characters of full source SHA>`

The tag must resolve to the admitted full SHA. If the tag is absent, the privileged tag job
creates it. If it exists at the same commit, a rerun reuses it. If it points anywhere else,
publication stops.

`.github/workflows/package.yml` continues to produce exactly five archives for
`web-api`, `integration-api`, `endpoint-api`, `assistant-api`, and `ui`, plus
`SHA256SUMS`. It builds from the full admitted SHA whose tag was verified. Publication
removes `--clobber`. If a named release asset already exists, the workflow succeeds only
when its recorded SHA-256 equals the newly generated file; otherwise it fails and leaves
the existing asset unchanged.

The same source SHA produces one container image for each of the five active services. The
required registry tag is the full 40-character source SHA. A full-SHA tag is never a
deployment input. After push, publication resolves the registry-provided digest and writes
that digest to `images.json`.

`images.json` is a UTF-8 JSON release asset with this version 1 contract:

```json
{
  "schema_version": 1,
  "source_sha": "<40-character commit SHA>",
  "build_tag": "build-YYYYMMDD-<7-character SHA>",
  "images": {
    "assistant-api": "rapidaai/assistant-api@sha256:<64 lowercase hex characters>",
    "endpoint-api": "rapidaai/endpoint-api@sha256:<64 lowercase hex characters>",
    "integration-api": "rapidaai/integration-api@sha256:<64 lowercase hex characters>",
    "ui": "rapidaai/ui@sha256:<64 lowercase hex characters>",
    "web-api": "rapidaai/web-api@sha256:<64 lowercase hex characters>"
  }
}
```

The field set is closed for version 1, the five keys are required, and output order is
stable. The manifest is authoritative for deployment. Mutable aliases, if retained after
consumer inventory, are compatibility conveniences only and are updated after all
immutable outputs succeed. They never appear in `images.json` and never select a deployed
version.

The Git tag identifies source, its prerelease owns the five packages, `SHA256SUMS`, and
`images.json`, and `images.json` owns the deployable image digests. No second release
database is introduced.

### Guarded Deployment

`.github/workflows/deploy.yml` is manual-only until a separate proposal approves
automation. It accepts exactly:

- `target`: a choice of `dev` or `production`;
- `build_tag`: an existing `build-*` tag.

Use two statically named jobs rather than a caller-controlled environment expression:

- `deploy-dev`, guarded by `target == 'dev'`, binds `environment: dev`;
- `deploy-production`, guarded by `target == 'production'`, binds
  `environment: production`.

Each environment has a separate concurrency group and `cancel-in-progress: false`, so only
one deployment per environment can mutate runtime state at a time and an in-flight
deployment is not cancelled midway. Both environments restrict deployable source to the
approved branch policy. Production additionally requires at least one maintainer approval;
the exact reviewer group, self-review rule, and administrator-bypass rule remain blocking
decisions.

Each deployment job starts with `contents: read`. If the approved target supports GitHub
OIDC, only that environment-bound job receives `id-token: write`; repository-level static
cloud credentials are prohibited. The cloud trust policy must restrict repository,
environment, audience, and target role claims. If OIDC is unavailable, the owner must
approve an environment-scoped, least-privilege alternative in an RFC revision before
deployment is enabled. Deployment receives no Docker Hub publish credential.

Before changing runtime state, the job:

1. Resolves the build tag and proves its commit matches `images.json.source_sha`.
2. Downloads the release assets without overwriting local files.
3. Runs `sha256sum --check SHA256SUMS` for all five package archives.
4. Parses `images.json` version 1, requires all five services, and rejects tags or mutable
   references in each image value.
5. Resolves every digest at the registry and proves it is available.
6. Records the currently deployed build tag and digest manifest as the rollback candidate.

Only then may the target-specific deploy command run with the five digest references. The
target-specific health command must prove the new revision is ready before success is
reported. On deploy or health failure, the approved target-specific rollback command uses
the recorded prior manifest through the same environment gate and repeats health
verification. The concrete runtime, commands, timeouts, and ownership are unresolved;
therefore no executable deployment may be enabled from this draft.

### Retired and Duplicate Workflows

After replacement publication has succeeded once from `main`, remove
`docker-publish.yml` and `tag-and-package-services.yml` as active entry points so only one
workflow owns publication. Keep their history in Git rather than leaving disabled copies
that can be manually invoked.

Remove `build-aws-ami.yml` and `build-gcp-image.yml` from active Actions if the repository
owner confirms they are obsolete. Restoring either is a separate Governed change because
their source directories are absent and their target, identity, verification, and rollback
contracts are not approved. `.github/workflows/docker-publish-base.yml` remains untouched
and outside this RFC.

## Contracts and Compatibility

- `Continuous Integration` and `05 CI Complete` remain the stable branch-protection
  contract. A rename requires an atomic required-check update and API verification.
- A warm-cache full CI run has a median duration under 30 minutes across three successful
  runs, and documentation-only validation completes in under 5 minutes.
- Pull-request validation requires no repository, organization, environment, registry, or
  cloud secret. It has no external write side effect.
- Publication trusts only a successful same-repository `main` push CI result for the exact
  full SHA. Manual publication proves the same condition independently.
- Build tags retain `build-YYYYMMDD-<7-character-sha>` and never move.
- The five RFC 0012 package names and `SHA256SUMS` remain available.
- Release assets are append-once. An identical rerun may be treated as success; a byte
  conflict fails without replacement.
- Every active service has a full-SHA registry tag. `images.json` version 1 and its digest
  references are the only deployment image contract.
- Existing mutable image aliases are neither source nor deployment identity. Their
  temporary compatibility period depends on the consumer inventory in Open Questions.
- `dev` and `production` are literal environment names with independent identities,
  histories, policy, and serialized concurrency.
- Deployment accepts an existing build and never rebuilds packages or images.
- No application API, protocol, persistent schema, or runtime configuration contract
  changes in this RFC.

## Failure and Recovery

- Failed, cancelled, fork, pull-request, wrong-repository, wrong-branch, or wrong-SHA CI
  evidence produces no tag, release, or registry write.
- Missing or ambiguous manual CI evidence fails before credentials are exposed.
- An existing build tag at another commit is a hard conflict and is never moved or deleted.
- Missing packages, checksum mismatch, malformed `images.json`, a missing service, or an
  unresolvable digest blocks release completion and every deployment.
- An existing release asset with different bytes is a hard conflict. The workflow never
  uses `--clobber`.
- A publication rerun may reuse an identical tag, image digest, or release asset. Any
  different immutable result stops the rerun for operator investigation.
- Partial publication can leave a correct tag or content-addressed image in place. These
  are retained, and an idempotent rerun completes the build record. No deployment consumes
  a release until all seven assets are present and verified: five packages,
  `SHA256SUMS`, and `images.json`.
- Deployment validation failure changes no runtime state. Deployment or health failure
  triggers the approved rollback path and reports both forward and rollback health.
- If rollback fails, the job remains failed, preserves the prior and attempted manifests,
  and requires the target's named operator escalation path. That path is an acceptance
  blocker until the deployment target is selected.
- Concurrency never cancels an in-flight publication or deployment. Operators may disable
  a workflow or environment before starting another run, but do not delete evidence.

## Security and Privacy

- Untrusted pull-request code never runs with inherited secrets, registry login, OIDC,
  GitHub write permission, or a GitHub Environment.
- `pull_request_target` is prohibited for validation and publication.
- Privileged `workflow_run` code rechecks conclusion, event, repository, branch, and exact
  SHA before exposing write permission or external credentials. It never consumes an
  artifact produced by a pull-request run.
- GitHub permissions are declared read-only by default and widened only on the job that
  owns the write. The Docker Hub robot can write only the approved namespace.
- Deployment prefers short-lived OIDC credentials issued only after the selected
  environment's protection rules pass. Production approval protects credential access as
  well as runtime mutation.
- Actions remain pinned to immutable commit SHAs. Shell steps use quoted inputs, strict
  error handling, and reject caller-controlled refs where a full SHA or enumerated choice
  is required.
- Logs and summaries do not print secrets, OIDC tokens, registry credentials, or cloud
  credential material. Release artifacts contain build output and provenance only.
- No new customer, tenant, or personal data is collected.

## Observability

- `CI Complete` reports each existing validation area and the exact source SHA.
- Publication summaries record the source CI run, full source SHA, build tag, package
  checksums, image digest per service, release URL, and whether any identical output was
  reused.
- Rejection paths identify the failed admission predicate or immutable conflict without
  printing credential values.
- GitHub Environment deployment history records actor, environment, build tag, source SHA,
  and workflow run. The job summary records preflight checks, prior manifest, attempted
  manifest, target-specific health result, rollback invocation, and final health result.
- Repository administrators audit required-check names, environment protection, OIDC trust,
  Docker Hub identity scope, and digest retention before enablement and during release
  audits.
- Alert routing, health timeout, and target telemetry remain blocking parts of the runtime
  deployment contract.

## Data and Migration

No persistent application-data or schema change exists.

GitHub Actions state migrates in ordered phases:

1. Make validation credential-free and add workflow contract tests while preserving the
   required-check names.
2. Add the single publication path and run it for one successful `main` build while
   deployment remains disabled.
3. Inventory consumers of mutable aliases, retain only required aliases temporarily, and
   document their removal owner and date.
4. Create and audit `dev` and `production` Environments, their protection rules, identities,
   and registry retention.
5. Add the approved target-specific deployment commands, enable `dev`, verify a deployment,
   and rehearse rollback.
6. Verify the production approval behavior, then allow manual production promotion.
7. Remove duplicate publication and obsolete marketplace entry points only after their
   replacements and owner decisions are recorded.

Existing build tags, releases, digests, and deployment records are retained. No backfill of
historical releases is required. A historical release without `images.json` is not
deployable through the new workflow.

## Rollout

Rollout cannot begin until all blocking Open Questions are resolved, this RFC is revised,
independently challenged, marked `Accepted`, and approved by the responsible owner.

After approval:

1. Land CI hardening and the focused workflow contract test. Verify local CI and a real
   fork pull request with repository and environment secrets unavailable.
2. Land publication consolidation. Verify rejected fork, pull-request, branch, abbreviated
   SHA, and failed-CI sources before permitting a successful `main` publication.
3. Publish one successful `main` build. Verify the immutable tag, five packages,
   `SHA256SUMS`, five full-SHA image tags, five digests, and `images.json` all identify the
   same source.
4. Audit mutable alias consumers and registry retention. Keep deployment disabled until a
   prior digest remains available for the full rollback window.
5. Create and audit `dev` and `production`, including source restrictions, reviewer policy,
   environment identities, and OIDC trust claims.
6. Deploy one build to `dev`, verify target health, and rehearse rollback to the retained
   prior digest manifest.
7. Prove the production approval gate with a non-production-changing test, then promote an
   already verified build manually.
8. Remove the duplicate and confirmed-obsolete workflow entry points after replacement
   evidence is retained.

Stop rollout on any required-check rename, secret access from a PR, source mismatch,
immutable conflict, missing digest, failed environment-policy audit, failed health check,
or failed rollback rehearsal.

## Rollback

Workflow rollback is non-destructive. Disable `publish.yml` or `deploy.yml`, or revert the
workflow reorganization, without deleting build tags, release assets, container digests,
GitHub Environment history, or deployment evidence. Restore the previous CI graph only if
the `Continuous Integration` and `CI Complete` required-check contract remains satisfied.

Runtime rollback always promotes the retained prior `images.json` digest set through the
same target Environment and identity, runs the approved target-specific rollback command,
and repeats the approved health check. It never rebuilds or selects `latest`, a date tag, or
a short-SHA alias. The deployment workflow records the current manifest before mutation so
the prior version is explicit. The exact rollback command, health timeout, retention
window, and escalation owner must be added before this RFC can be accepted.

## Alternatives Considered

- Copy a generic workflow set and permissions: rejected because workflows, credentials,
  and broad permissions must follow this repository's trust boundaries.
- Split every current CI area into independent top-level workflows: rejected because the
  integrated graph already provides one stable required conclusion and ordering.
- Keep `docker-publish.yml` and `tag-and-package-services.yml` as independent publishers:
  rejected because independent triggers can publish unvalidated or inconsistent outputs
  and duplicate ownership.
- Deploy a mutable `latest`, date, or short-SHA image tag: rejected because the selected
  bytes can change and rollback provenance would be ambiguous.
- Rebuild during deployment: rejected because production would no longer run the bytes
  validated and published for the selected commit.
- Use long-lived repository-level cloud keys: rejected because every eligible workflow run
  would share broad, durable authority. Environment-scoped OIDC is preferred.
- Use one dynamic deployment job with an arbitrary environment input: rejected because
  static jobs make each trust boundary, policy, and credential grant reviewable.
- Automatically deploy production after publication: rejected because production requires
  an explicit maintainer approval and a verified rollback candidate.
- Restore AWS or GCP marketplace builds as part of this work: rejected because their source
  paths and operational contracts are absent.

## Testing and Verification

### Static and Local Verification

- `git diff --check`
- `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 -color`
- `bash just/ci-github-actions.sh`
- `just ci-check`
- `just ci`
- `just agent-finalize ".github/actions/docker-build/action.yml,.github/workflows/ci.yml,.github/workflows/reusable-go-ci.yml,.github/workflows/reusable-ui-ci.yml,.github/workflows/reusable-repository-ci.yml,.github/workflows/reusable-docker-ci.yml,.github/workflows/reusable-assistant-native-ci.yml,.github/workflows/reusable-end-to-end-ci.yml,.github/workflows/package.yml,.github/workflows/publish.yml,.github/workflows/deploy.yml,.github/workflows/docker-publish.yml,.github/workflows/tag-and-package-services.yml,.github/workflows/build-aws-ami.yml,.github/workflows/build-gcp-image.yml,just/ci.just,just/ci-service-boundaries.sh,just/ci-github-actions.sh,README.md,rfcs/0016-github-actions-deployment.md"`

The focused workflow test must cover at least:

- no PR-reachable `secrets: inherit`, named secret, environment, registry login, publish
  action, `id-token: write`, or other write permission;
- Docker CI passes `push: "false"`, and Docker credential validation and login are
  conditional on `push == 'true'`;
- stable `Continuous Integration` and `05 CI Complete` names;
- exact `workflow_run` repository, event, branch, conclusion, and SHA admission;
- manual full-SHA and matching successful push-CI admission;
- non-cancelling SHA-keyed publication and environment-keyed deployment concurrency;
- static `dev` and `production` jobs and no caller-controlled environment name;
- full-SHA image tags, digest-only `images.json`, append-once release assets, and no
  `--clobber`;
- no deployment build step or mutable image input.

### GitHub and Runtime Verification

- Run a real fork pull request and execute
  `gh pr checks "${FORK_PR_NUMBER:?set fork PR number}" --repo rapidaai/voice-ai --watch --fail-fast`.
  All existing validation areas and `CI Complete` must pass without secrets.
- Attempt automatic publication from a fork, pull-request run, failed CI, another branch,
  and another repository. Each must stop before any tag, release, or registry mutation.
- Attempt manual publication with a branch, tag, abbreviated SHA, SHA not on `main`, and SHA
  without a successful push CI run. Each must be rejected.
- Publish one eligible `main` SHA, rerun it, and prove the tag and asset bytes do not change.
  Introduce a release-asset conflict in an isolated test repository and prove publication
  fails without replacement.
- Resolve both Environments with
  `gh api repos/rapidaai/voice-ai/environments/dev` and
  `gh api repos/rapidaai/voice-ai/environments/production`; inspect protection rules,
  reviewers, source restrictions, and environment-scoped variables or secrets.
- Deploy the published manifest to `dev`, verify all five running digests and target health,
  then rehearse rollback to the recorded prior manifest and verify health again.
- Start a production deployment and prove no environment credential or runtime mutation is
  available before the required approval. Reject it and verify no change, then approve a
  later run and verify the exact selected digest set.

Runtime commands and expected health evidence cannot be made exact until the blocking
target decisions are resolved. Their absence blocks acceptance and implementation of
`deploy.yml`.

## Acceptance Criteria

- [ ] Every `pull_request` validation path succeeds when repository and environment secrets
  are unavailable.
- [ ] No PR-reachable workflow inherits secrets, logs in to a registry, publishes
  externally, requests OIDC, or targets a GitHub Environment.
- [ ] The workflow contract test preserves `push: "false"` for Docker validation and
  conditional registry credential validation and login.
- [ ] `Continuous Integration` remains the single integrated validation conclusion with the
  existing Go, UI, repository, Docker, native, and end-to-end coverage.
- [ ] Three successful warm-cache full runs have a median duration under 30 minutes,
  documentation-only validation completes in under 5 minutes, and no assertion is removed.
- [ ] Automatic publication runs only after successful same-repository `main` push CI for
  exactly `workflow_run.head_sha`.
- [ ] Manual publication accepts only a full SHA on `main` with a successful push CI run for
  exactly that SHA.
- [ ] Publication preserves the RFC 0012 build tag and five package contracts, refuses
  release-asset conflicts, publishes five full-SHA image tags, and records five digests in
  `images.json`.
- [ ] Deployment accepts only `dev` or `production` plus an existing build tag, verifies
  package checksums and image digests, and never rebuilds.
- [ ] Deployment uses separate static environment jobs and non-cancelling per-environment
  concurrency.
- [ ] Only publication receives a namespace-limited Docker Hub identity; deployment uses
  an approved environment-scoped identity, preferably OIDC with job-local
  `id-token: write`.
- [ ] Production requires the approved maintainer review policy and has a documented,
  rehearsed rollback to retained prior digests.
- [ ] Broken marketplace workflows are removed from active Actions unless their source,
  target, OIDC, verification, and rollback contracts are separately approved.
- [ ] Static lint, policy contracts, local CI, a real fork pull request, accepted and
  rejected publication cases, `dev` deployment, production approval behavior, and rollback
  rehearsal all pass.
- [ ] Required-check, Environment, credential, digest-retention, verification, and rollback
  evidence is recorded before rollout.

## Open Questions

| Blocking | Decision | Owner | Recommended default |
| --- | --- | --- | --- |
| Yes | Which runtime does `deploy.yml` update, and what exact deploy, health-check, timeout, rollback, and escalation commands prove success? | Deployment owner | No default. Do not enable deployment without a verified target contract. |
| Yes | Do both `dev` and `production` promote published `main` builds, or must maintainers create protected branches? | Repository owner | Manually promote an already published `main` build to either environment. |
| Yes | Which maintainers review production, and are self-review and administrator bypass disabled? | Repository owner | Require at least one maintainer, prevent self-review, disable administrator bypass, and restrict deployments to the default branch. |
| Yes | Are the broken AWS and GCP marketplace workflows obsolete? | Product and release owners | Remove them. Restoration requires a separate Governed design. |
| Yes | Can a namespace-limited Docker Hub robot token be provisioned, and what digest-retention window covers rollback? | Registry owner | Retain every deployed and prior rollback digest for at least the approved rollback window. |
| No | Which consumers still require `latest`, date, short-SHA, or `saas` aliases, and when can each alias be removed? | Release owner | Keep only documented aliases temporarily and never deploy them. |

## Challenge Resolution

Pending independent challenge. No challenge revision cycle has been consumed. The RFC
must remain `Draft` while any blocking Open Question lacks owner confirmation. Before a
final approval, record the reviewer or owner decision and set the sole metadata line to
`- Status: Accepted`. A later material decision change requires a superseding RFC.

## Decision Log

| Date | Decision | Owner | Evidence |
| --- | --- | --- | --- |
| 2026-09-27 | Preserve integrated CI but separate validation, publication, and deployment trust boundaries | Task planner | RFC context and design |
| 2026-09-27 | Use the build tag and prerelease as the source record and image digests as deployment identity | Task planner | RFC context and design |
| 2026-09-27 | Keep deployment manual and blocked until exact target and recovery contracts are approved | Task planner | RFC context and design |
