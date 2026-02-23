#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  CONFIRM_DEPLOY=DEPLOY_DEMO \
  DEPLOY_HOST=<host> \
  DEPLOY_USER=<user> \
  DEPLOY_SSH_KEY_PATH=<path-to-private-key> \
  LOCAL_ENV_FILE=.env.deploy \
  ./scripts/cloud/deploy_demo_remote.sh

Required environment variables:
  CONFIRM_DEPLOY        Must be DEPLOY_DEMO
  DEPLOY_HOST           Remote host/IP
  DEPLOY_USER           SSH user on remote host
  DEPLOY_SSH_KEY_PATH   Local private key path for SSH

Optional environment variables:
  DEPLOY_REF            Git ref to deploy (default: main)
  REPO_URL              Git repository URL (default: current origin or GitHub URL)
  DEPLOY_PATH           Remote project path (default: /opt/e-commerce)
  COMPOSE_PROJECT_NAME  Compose project name (default: ecommerce-demo)
  LOCAL_ENV_FILE        Local env file to upload (default: .env.deploy)
  REMOTE_ENV_FILE       Remote env file name (default: .env.deploy)
  RUN_SMOKE_CHECK       true/false (default: true)
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${CONFIRM_DEPLOY:-}" != "DEPLOY_DEMO" ]]; then
  echo "Refusing to deploy. Set CONFIRM_DEPLOY=DEPLOY_DEMO to continue." >&2
  exit 1
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required}"
: "${DEPLOY_USER:?DEPLOY_USER is required}"
: "${DEPLOY_SSH_KEY_PATH:?DEPLOY_SSH_KEY_PATH is required}"

DEPLOY_REF="${DEPLOY_REF:-main}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/e-commerce}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-ecommerce-demo}"
LOCAL_ENV_FILE="${LOCAL_ENV_FILE:-.env.deploy}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-.env.deploy}"
RUN_SMOKE_CHECK="${RUN_SMOKE_CHECK:-true}"

if [[ ! -f "$DEPLOY_SSH_KEY_PATH" ]]; then
  echo "SSH key file not found: $DEPLOY_SSH_KEY_PATH" >&2
  exit 1
fi

if [[ ! -f "$LOCAL_ENV_FILE" ]]; then
  echo "Deploy env file not found: $LOCAL_ENV_FILE" >&2
  echo "Tip: copy .env.deploy.example to .env.deploy and fill values." >&2
  exit 1
fi

require_cmd ssh
require_cmd scp
require_cmd git

REPO_URL="${REPO_URL:-$(git remote get-url origin 2>/dev/null || true)}"
if [[ -z "$REPO_URL" ]]; then
  REPO_URL="https://github.com/${GITHUB_REPOSITORY:-FredZ6/e-commerce}.git"
fi

SSH_OPTS=(
  -i "$DEPLOY_SSH_KEY_PATH"
  -o StrictHostKeyChecking=accept-new
  -o UserKnownHostsFile="${HOME}/.ssh/known_hosts"
)

echo "Preparing remote path ${DEPLOY_PATH} ..."
ssh "${SSH_OPTS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}'"

echo "Uploading deploy env file ..."
scp "${SSH_OPTS[@]}" "$LOCAL_ENV_FILE" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/${REMOTE_ENV_FILE}.tmp"

echo "Deploying ${REPO_URL}@${DEPLOY_REF} on remote host ..."
ssh "${SSH_OPTS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" \
  DEPLOY_PATH="$DEPLOY_PATH" \
  REPO_URL="$REPO_URL" \
  DEPLOY_REF="$DEPLOY_REF" \
  REMOTE_ENV_FILE="$REMOTE_ENV_FILE" \
  COMPOSE_PROJECT_NAME="$COMPOSE_PROJECT_NAME" \
  RUN_SMOKE_CHECK="$RUN_SMOKE_CHECK" \
  bash -s <<'EOF'
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is not installed on remote host." >&2
  exit 1
fi

if [[ ! -d "${DEPLOY_PATH}/.git" ]]; then
  git clone "${REPO_URL}" "${DEPLOY_PATH}"
fi

cd "${DEPLOY_PATH}"
git fetch --all --prune
git checkout "${DEPLOY_REF}"
git reset --hard "origin/${DEPLOY_REF}"

mv "${REMOTE_ENV_FILE}.tmp" "${REMOTE_ENV_FILE}"
chmod 600 "${REMOTE_ENV_FILE}"

docker compose \
  --project-name "${COMPOSE_PROJECT_NAME}" \
  --env-file "${REMOTE_ENV_FILE}" \
  up -d --build

if [[ "${RUN_SMOKE_CHECK}" == "true" ]]; then
  FRONTEND_PORT="$(awk -F= '/^FRONTEND_HOST_PORT=/{print $2}' "${REMOTE_ENV_FILE}" | tail -n1)"
  BACKEND_PORT="$(awk -F= '/^BACKEND_HOST_PORT=/{print $2}' "${REMOTE_ENV_FILE}" | tail -n1)"
  FRONTEND_PORT="${FRONTEND_PORT:-80}"
  BACKEND_PORT="${BACKEND_PORT:-8080}"

  curl -fsS "http://127.0.0.1:${FRONTEND_PORT}/" >/dev/null
  curl -fsS "http://127.0.0.1:${BACKEND_PORT}/api/products" >/dev/null
fi

docker compose \
  --project-name "${COMPOSE_PROJECT_NAME}" \
  --env-file "${REMOTE_ENV_FILE}" \
  ps
EOF

echo "Remote deploy completed."
