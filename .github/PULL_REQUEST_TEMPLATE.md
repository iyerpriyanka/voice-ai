## Summary

<!-- What changed and why? -->

- Workflow tier: Fast / Standard / Governed

## Approved Plan

<!-- Link or summarize the approved plan, including the simpler options considered. -->

- Acceptance criteria:
- In scope:
- Out of scope:
- Ownership:
- Rollback or disablement:

## RFC

<!-- Required only for Governed changes. Use N/A for Fast or Standard changes. -->

- Accepted RFC:
- Approval:

## Principles

<!-- Explain relevant tradeoffs. Use N/A only when genuinely inapplicable. -->

- KISS / smallest complete solution:
- YAGNI / rejected speculation:
- Single source of truth and ownership:
- Contracts and compatibility:
- Failure safety and cleanup:
- Security and least privilege:
- Observability:

## Testing

<!-- List exact commands and results. Explain any omitted validation. -->

## Independent Code Review

<!-- Reviewer must not be an implementation author. -->

- Reviewer:
- Review report or Orca task:
- Decision: pending
- Critical findings: 0
- Major findings: 0
- Unresolved follow-ups:

## Checklist

- [ ] The selected workflow tier matches `DEVELOPMENT_PROCESS.md`.
- [ ] For Governed work, the plan and RFC were challenged and approved before implementation.
- [ ] I kept the change focused.
- [ ] I updated tests or docs where needed.
- [ ] Required validation commands passed.
- [ ] `just agent-pr-ready <base>` passed for the committed branch.
- [ ] An independent code reviewer approved the complete diff.
- [ ] Critical and major review findings are resolved.
- [ ] Rollback, migration, and operational impact are documented where relevant.
- [ ] I did not commit secrets or generated noise.
