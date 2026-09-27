#!/usr/bin/env bash
set -Eeuo pipefail

ci_workflow=.github/workflows/ci.yml
docker_workflow=.github/workflows/reusable-docker-ci.yml
end_to_end_workflow=.github/workflows/reusable-end-to-end-ci.yml
docker_action=.github/actions/docker-build/action.yml

require_text() {
  local file=$1
  local expected=$2

  if ! grep -Fq -- "$expected" "$file"; then
    printf '%s must contain: %s\n' "$file" "$expected" >&2
    exit 1
  fi
}

require_text "$ci_workflow" "group: ci-\${{ github.event.pull_request.number || github.ref }}"
require_text "$ci_workflow" 'cancel-in-progress: true'
require_text "$ci_workflow" 'name: 00 Changes'
require_text "$ci_workflow" 'name: 01 Validate - Go'
require_text "$ci_workflow" 'name: 01 Validate - UI'
require_text "$ci_workflow" 'name: 01 Validate - Repository'
require_text "$ci_workflow" 'name: 02 Build - Docker Images'
require_text "$ci_workflow" 'name: 02 Build - Assistant Native'
require_text "$ci_workflow" 'name: 03 End-to-End Verification'
require_text "$ci_workflow" 'name: 05 CI Complete'
require_text "$ci_workflow" "mode=documentation"
require_text "$ci_workflow" "*.md | docs/* | rfcs/*"
require_text "$ci_workflow" "git diff --name-only -z \"\$BASE_SHA...\$HEAD_SHA\""
require_text "$ci_workflow" "Unknown CI mode: \$CI_MODE"
require_text "$ci_workflow" 'Heavy CI stages must be skipped for documentation-only changes'

single_service_block=$(sed -n '/^  single-service:/,/^  end-to-end:/p' "$ci_workflow")
if grep -Fq 'needs: docker' <<< "$single_service_block"; then
  echo 'Assistant native verification must run in parallel with Docker validation.' >&2
  exit 1
fi

require_text "$docker_workflow" 'component: test-runner'
require_text "$docker_workflow" 'dockerfile: ./tests/smoke/Dockerfile'
require_text "$docker_workflow" 'max-parallel: 6'
require_text "$docker_workflow" 'push: "false"'

if grep -Eq '^[[:space:]]+needs:' "$end_to_end_workflow"; then
  echo 'End-to-end suites must remain independent and run in parallel.' >&2
  exit 1
fi

cache_scope_count=$(grep -Fc 'CI_STACK_CACHE_SCOPE: ci' "$end_to_end_workflow")
if [[ "$cache_scope_count" -ne 4 ]]; then
  echo 'Every end-to-end suite must use the stable CI cache scope.' >&2
  exit 1
fi

login_guard_count=$(grep -Fc "if: inputs.push == 'true'" "$docker_action")
if [[ "$login_guard_count" -lt 2 ]]; then
  echo 'Docker credential validation and login must require push=true.' >&2
  exit 1
fi

echo 'GitHub Actions stage, concurrency, cache, and Docker login contracts pass.'
