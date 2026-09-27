# Orchestrator Hooks (Claude)

This folder provides the contract and runner for Governed-tier subagent gates across four stages:

1. `pre-implementation`
2. `post-implementation`
3. `post-verification`
4. `post-review`

## Layout

- `schemas/envelope.schema.json`: shared run envelope shape
- `schemas/pre-implementation-input.schema.json`
- `schemas/post-implementation-input.schema.json`
- `schemas/post-verification-input.schema.json`
- `schemas/post-review-input.schema.json`
- `scripts/hook-run.py`: stage runner
- `examples/lifecycle-input.json`: one full evidence envelope used across all gates

## CLI

```bash
python3 .claude/orchestrator/scripts/hook-run.py \
  --stage pre-implementation \
  --input .claude/orchestrator/examples/lifecycle-input.json \
  --output /tmp/hook-out.json
```

Valid stages:

- `pre-implementation`
- `post-implementation`
- `post-verification`
- `post-review`

Exit codes:

- `0`: hook executed (check `status` inside output json)
- `2`: invalid input arguments/json
- `3`: internal hook error

## Contract summary

- `pre-implementation` validates plan completeness and required test/command declarations.
- `pre-implementation` also requires principle decisions, explicit ownership, an independent plan challenge, and approval.
- `post-implementation` enforces file scope guard and test-category presence.
- `post-verification` enforces command success and routes the task to independent code review.
- `post-review` enforces reviewer independence, review evidence, and resolution of critical or major findings before shipping.

Each stage receives the same cumulative lifecycle envelope. Later stages re-run all earlier gates, so review cannot replace an approved plan, implementation report, or successful verification with a standalone boolean.

The approved plan is embedded as `task_plan`. The pre-implementation gate requires an
independent challenger, an explicit approver, and no open blockers.

Templates:

- `templates/task-plan.md`
- `templates/code-review.md`

Create the corresponding Orca Run, task DAG, approval gate, and planner worker with:

```bash
just orca-development-run "describe the desired outcome" \
  "rfcs/NNNN-short-name.md" claude
```

Use this only when a Governed trigger from `DEVELOPMENT_PROCESS.md` applies. It creates
only the planner, RFC-author, and challenger tasks and starts the planner.
After the challenge is resolved, record reviewer or owner approval and set the RFC status
to `Accepted` before creating or starting implementation tasks.

## Notes

- This is intentionally conservative and can be extended with repo-specific checks.
- Path guard uses exact matches for file paths and prefix matches for paths ending in `/`.
