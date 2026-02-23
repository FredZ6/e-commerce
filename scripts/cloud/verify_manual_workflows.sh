#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_WORKFLOW="${ROOT_DIR}/.github/workflows/manual-demo-deploy.yml"
DESTROY_WORKFLOW="${ROOT_DIR}/.github/workflows/manual-demo-destroy.yml"
DEPLOY_SCRIPT="${ROOT_DIR}/scripts/cloud/deploy_demo_remote.sh"
DESTROY_SCRIPT="${ROOT_DIR}/scripts/cloud/destroy_demo_remote.sh"

require_file() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
}

require_contains() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  if ! grep -Eq "$pattern" "$file"; then
    echo "Check failed: $description ($file)" >&2
    exit 1
  fi
}

require_absent() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  if grep -Eq "$pattern" "$file"; then
    echo "Check failed: $description ($file)" >&2
    exit 1
  fi
}

for file in "$DEPLOY_WORKFLOW" "$DESTROY_WORKFLOW" "$DEPLOY_SCRIPT" "$DESTROY_SCRIPT"; do
  require_file "$file"
done

# Workflows must stay manual-only.
require_contains "$DEPLOY_WORKFLOW" "workflow_dispatch:" "deploy workflow must be workflow_dispatch"
require_contains "$DESTROY_WORKFLOW" "workflow_dispatch:" "destroy workflow must be workflow_dispatch"
require_absent "$DEPLOY_WORKFLOW" "^[[:space:]]*push:" "deploy workflow must not auto-trigger on push"
require_absent "$DEPLOY_WORKFLOW" "^[[:space:]]*pull_request:" "deploy workflow must not auto-trigger on pull_request"
require_absent "$DESTROY_WORKFLOW" "^[[:space:]]*push:" "destroy workflow must not auto-trigger on push"
require_absent "$DESTROY_WORKFLOW" "^[[:space:]]*pull_request:" "destroy workflow must not auto-trigger on pull_request"

# Manual safety phrases must be present in workflows and scripts.
require_contains "$DEPLOY_WORKFLOW" "DEPLOY_DEMO" "deploy workflow must require DEPLOY_DEMO phrase"
require_contains "$DESTROY_WORKFLOW" "DESTROY_DEMO" "destroy workflow must require DESTROY_DEMO phrase"
require_contains "$DEPLOY_SCRIPT" "CONFIRM_DEPLOY" "deploy script must require CONFIRM_DEPLOY"
require_contains "$DEPLOY_SCRIPT" "DEPLOY_DEMO" "deploy script must enforce DEPLOY_DEMO phrase"
require_contains "$DESTROY_SCRIPT" "CONFIRM_DESTROY" "destroy script must require CONFIRM_DESTROY"
require_contains "$DESTROY_SCRIPT" "DESTROY_DEMO" "destroy script must enforce DESTROY_DEMO phrase"

echo "Manual deploy guardrails verified."
