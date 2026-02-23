#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  CONFIRM_DESTROY=DESTROY_DEMO \
  DEPLOY_HOST=<host> \
  DEPLOY_USER=<user> \
  DEPLOY_SSH_KEY_PATH=<path-to-private-key> \
  ./scripts/cloud/destroy_demo_remote.sh

Required environment variables:
  CONFIRM_DESTROY       Must be DESTROY_DEMO
  DEPLOY_HOST           Remote host/IP
  DEPLOY_USER           SSH user on remote host
  DEPLOY_SSH_KEY_PATH   Local private key path for SSH

Optional environment variables:
  DEPLOY_PATH           Remote project path (default: /opt/e-commerce)
  COMPOSE_PROJECT_NAME  Compose project name (default: ecommerce-demo)
  REMOTE_ENV_FILE       Remote env file name (default: .env.deploy)
  REMOVE_VOLUMES        true/false (default: true)
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${CONFIRM_DESTROY:-}" != "DESTROY_DEMO" ]]; then
  echo "Refusing to destroy. Set CONFIRM_DESTROY=DESTROY_DEMO to continue." >&2
  exit 1
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required}"
: "${DEPLOY_USER:?DEPLOY_USER is required}"
: "${DEPLOY_SSH_KEY_PATH:?DEPLOY_SSH_KEY_PATH is required}"

DEPLOY_PATH="${DEPLOY_PATH:-/opt/e-commerce}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-ecommerce-demo}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-.env.deploy}"
REMOVE_VOLUMES="${REMOVE_VOLUMES:-true}"

if [[ ! -f "$DEPLOY_SSH_KEY_PATH" ]]; then
  echo "SSH key file not found: $DEPLOY_SSH_KEY_PATH" >&2
  exit 1
fi

SSH_OPTS=(
  -i "$DEPLOY_SSH_KEY_PATH"
  -o StrictHostKeyChecking=accept-new
  -o UserKnownHostsFile="${HOME}/.ssh/known_hosts"
)

echo "Stopping remote demo stack ..."
ssh "${SSH_OPTS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" \
  DEPLOY_PATH="$DEPLOY_PATH" \
  COMPOSE_PROJECT_NAME="$COMPOSE_PROJECT_NAME" \
  REMOTE_ENV_FILE="$REMOTE_ENV_FILE" \
  REMOVE_VOLUMES="$REMOVE_VOLUMES" \
  bash -s <<'EOF'
set -euo pipefail

if [[ ! -d "${DEPLOY_PATH}" ]]; then
  echo "Remote path not found: ${DEPLOY_PATH}. Nothing to destroy."
  exit 0
fi

cd "${DEPLOY_PATH}"

if [[ "${REMOVE_VOLUMES}" == "true" ]]; then
  docker compose \
    --project-name "${COMPOSE_PROJECT_NAME}" \
    --env-file "${REMOTE_ENV_FILE}" \
    down --remove-orphans --volumes || true
else
  docker compose \
    --project-name "${COMPOSE_PROJECT_NAME}" \
    --env-file "${REMOTE_ENV_FILE}" \
    down --remove-orphans || true
fi

docker compose \
  --project-name "${COMPOSE_PROJECT_NAME}" \
  --env-file "${REMOTE_ENV_FILE}" \
  ps || true
EOF

echo "Remote demo stack destroyed."
