# Agent Tooling Lessons

This ledger records recurring, evidence-backed defects in the repository development workflow.
Each lesson must identify the failure, the durable rule, and its executable guard. Do not add
speculative preferences.

| ID | Observed failure | Durable rule | Guard or regression test |
| --- | --- | --- | --- |
| ATL-001 | A publishing command nested in a shell could avoid direct command matching, including after a visible command was parsed. | Every publication signature must map to one validated invocation or fail closed. | `tests/agent_tooling/test_pr_gate.py` exercises standalone and mixed nested publishing commands. |
| ATL-002 | Generated policy files under `ui/src/` selected the full UI test suite despite changing no UI source. | Test selection uses source-file types, not directory membership alone. | `tests/agent_tooling/test_policy_tools.py` covers policy and UI source paths. |
| ATL-003 | Documentation placed inside a submodule boundary was invisible to the parent repository. | New repository policy documents remain in a path owned by the parent repository. | `bin/check-agent-docs` validates the root documentation set. |
| ATL-004 | Hook behavior without regression coverage can drift silently. | Every deny, allow, injection, and publication path added to a hook includes a focused test. | `just test-agent-hooks` runs the repository hook suite. |
| ATL-005 | The UI provider suite passed but remained interactive, then a fixed provider selector skipped a changed authentication test. | Finalizer-owned UI tests set CI mode, disable watch mode, and execute the changed focused tests. | `tests/agent_tooling/test_policy_tools.py` locks the selected command and environment. |
| ATL-006 | Synthetic repositories inherited the caller hook's Git state, which redirected fixtures into the real repository. | Validators clear repository-local Git environment variables before creating fixtures, and fixture commits use Git plumbing. | The pre-push `agent-pr-ready` gate runs `bin/validate-development-process` in its hook environment. |
| ATL-007 | A deleted allowed file was withheld because egress validation inspected only its missing worktree path. | Deleted diff sections use the diff as content while retaining path and secret checks. | `tests/agent_tooling/test_policy_tools.py` covers allowed and sensitive deletions. |
| ATL-008 | Git status text could remain stable while a review candidate's bytes changed. | Review approval is bound to the exact candidate boundary and digest before and after reviewers run. | `tests/agent_tooling/test_agent_review.py` changes bytes under stable status. |
| ATL-009 | Destructive Git variants and curl payload aliases were absent from exact deny checks. | Safety guards cover equivalent destructive and outbound-data forms, with explicit safe exceptions. | `tests/agent_tooling/test_bash_guard.py` covers checkout, restore, and curl variants. |
| ATL-010 | A branch with no diff from the selected base was rejected during every push. | PR readiness is a no-op when the selected boundary has no committed changes. | `tests/agent_tooling/test_git_hooks.py` covers an empty revision boundary. |

Add a lesson only after a concrete defect or repeated review finding. Prefer extending an existing
lesson when the invariant is unchanged.
