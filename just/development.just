# Validate development process rules.
validate-development-process:
    bash bin/validate-development-process

# Validate agent tooling rules.
validate-agent-tooling:
    bash bin/validate-agent-tooling

# Validate agent documentation references and skill metadata.
check-agent-docs:
    python3 bin/check-agent-docs

# Detect drift across generated path rules and paired agent tooling.
agent-drift-check:
    python3 bin/check-agent-drift

# Check added prose and identifiers in the working tree or a revision range.
agent-style-check revision_range="":
    #!/usr/bin/env bash
    if [[ -n "{{revision_range}}" ]]; then
      python3 bin/check-agent-style --range "{{revision_range}}"
    else
      python3 bin/check-agent-style
    fi

# Run deterministic tests for agent hooks and policy utilities.
test-agent-hooks:
    python3 -m unittest discover -s tests/agent_tooling -p 'test_*.py' -v

# Run the stable browser accessibility and screenshot contract.
ui-browser-test:
    cd ui && yarn test:e2e

# Validate the agent capability and coverage registry.
agent-manifest-check:
    python3 bin/check-agent-manifest

# Run configured independent reviewers and aggregate their decisions.
agent-review risk="standard" base="main":
    python3 bin/agent-review --risk "{{risk}}" --base "{{base}}"

# Validate the committed branch against its intended pull request base.
agent-pr-ready base="main":
    bash bin/agent-pr-ready "{{base}}"

# Validate RFC structure and metadata.
validate-rfc-layout:
    python3 bin/validate-rfc-layout

# Validate all development tooling.
validate-development-toolkit: validate-development-process validate-agent-tooling agent-manifest-check agent-drift-check validate-rfc-layout

# Run scoped repository finalization checks.
agent-finalize changed_files=env_var_or_default("CHANGED_FILES", "") agent_root=env_var_or_default("AGENT_ROOT", ".codex"):
    @test -n "{{changed_files}}" || { echo "Usage: just agent-finalize 'path/a.go,path/a_test.go' [agent-root]" >&2; exit 2; }
    AGENT_ROOT="{{agent_root}}" CHANGED_FILES="{{changed_files}}" bash bin/agent-finalize

# Start a governed Orca development run.
orca-development-run objective=env_var_or_default("OBJECTIVE", "") rfc=env_var_or_default("RFC", "") agent=env_var_or_default("AGENT", "codex"):
    @test -n "{{objective}}" -a -n "{{rfc}}" || { echo "Usage: just orca-development-run '<objective>' 'rfcs/NNNN-name.md' [agent]" >&2; exit 2; }
    bash bin/orca-development-run "{{objective}}" "{{agent}}" "{{rfc}}"

# Render the Orca development panel.
orca-panel input=env_var_or_default("PANEL_INPUT", ".codex/orchestrator/examples/lifecycle-input.json") output=env_var_or_default("PANEL_OUTPUT", ".cache/orca-development-panel.html"):
    python3 bin/orca-development-panel --input "{{input}}" --output "{{output}}"

# Render and open the Orca development panel.
orca-panel-open input=env_var_or_default("PANEL_INPUT", ".codex/orchestrator/examples/lifecycle-input.json") output=env_var_or_default("PANEL_OUTPUT", ".cache/orca-development-panel.html"):
    python3 bin/orca-development-panel --input "{{input}}" --output "{{output}}" --open
