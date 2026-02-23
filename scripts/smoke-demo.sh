#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"

echo "Checking frontend: ${FRONTEND_URL}"
curl -fsS "${FRONTEND_URL}" >/dev/null

echo "Checking backend direct endpoint: ${BACKEND_URL}/api/products"
curl -fsS "${BACKEND_URL}/api/products" >/dev/null

echo "Checking backend via frontend reverse proxy: ${FRONTEND_URL}/api/products"
curl -fsS "${FRONTEND_URL}/api/products" >/dev/null

echo "Smoke check passed."
