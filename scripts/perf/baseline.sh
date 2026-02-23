#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
ENDPOINTS="${ENDPOINTS:-/api/products,/actuator/health}"
REQUESTS="${REQUESTS:-120}"
CONCURRENCY="${CONCURRENCY:-8}"
OUTPUT_MD="${OUTPUT_MD:-}"

if ! [[ "${REQUESTS}" =~ ^[0-9]+$ ]] || ! [[ "${CONCURRENCY}" =~ ^[0-9]+$ ]]; then
  echo "REQUESTS and CONCURRENCY must be positive integers." >&2
  exit 1
fi

if [[ "${REQUESTS}" -le 0 || "${CONCURRENCY}" -le 0 ]]; then
  echo "REQUESTS and CONCURRENCY must be greater than zero." >&2
  exit 1
fi

measure_endpoint() {
  local endpoint="$1"
  local raw_file
  raw_file="$(mktemp)"

  seq "${REQUESTS}" | xargs -I{} -P "${CONCURRENCY}" bash -c '
    code_and_time="$(curl -sS -o /dev/null -w "%{http_code} %{time_total}" "'"${BASE_URL}${endpoint}"'")"
    printf "%s\n" "${code_and_time}"
  ' >> "${raw_file}"

  local total success
  total="$(wc -l < "${raw_file}" | tr -d ' ')"
  success="$(awk '$1 ~ /^2/ {c++} END {print c+0}' "${raw_file}")"

  local times_file
  times_file="$(mktemp)"
  awk '{print $2}' "${raw_file}" > "${times_file}"

  local min_s max_s avg_s p95_s p99_s total_s rps
  min_s="$(sort -n "${times_file}" | head -n 1)"
  max_s="$(sort -n "${times_file}" | tail -n 1)"
  avg_s="$(awk '{sum+=$1} END {if (NR>0) printf "%.6f", sum/NR; else print "0"}' "${times_file}")"
  p95_s="$(sort -n "${times_file}" | awk -v n="${total}" 'NR==int((n*0.95)+0.999999){printf "%.6f",$1}')"
  p99_s="$(sort -n "${times_file}" | awk -v n="${total}" 'NR==int((n*0.99)+0.999999){printf "%.6f",$1}')"
  total_s="$(awk '{sum+=$1} END {if (NR>0) printf "%.6f", sum; else print "0"}' "${times_file}")"
  rps="$(awk -v n="${total}" -v t="${total_s}" 'BEGIN {if (t>0) printf "%.2f", n/t; else print "0"}')"

  printf "| %s | %s | %s | %s | %s | %s | %s | %s | %s |\n" \
    "${endpoint}" "${total}" "${success}" "${avg_s}" "${p95_s}" "${p99_s}" "${min_s}" "${max_s}" "${rps}"

  rm -f "${raw_file}" "${times_file}"
}

emit_report() {
  local target_file="$1"
  local generated_at
  generated_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

  {
    echo "# API Performance Baseline"
    echo
    echo "- Generated at (UTC): ${generated_at}"
    echo "- Base URL: \`${BASE_URL}\`"
    echo "- Requests per endpoint: \`${REQUESTS}\`"
    echo "- Concurrency: \`${CONCURRENCY}\`"
    echo
    echo "| Endpoint | Requests | 2xx | Avg (s) | P95 (s) | P99 (s) | Min (s) | Max (s) | Throughput (req/s) |"
    echo "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
    IFS=',' read -r -a endpoint_array <<< "${ENDPOINTS}"
    for endpoint in "${endpoint_array[@]}"; do
      measure_endpoint "${endpoint}"
    done
  } > "${target_file}"
}

if [[ -n "${OUTPUT_MD}" ]]; then
  emit_report "${OUTPUT_MD}"
  echo "Performance report written to ${OUTPUT_MD}"
else
  tmp_md="$(mktemp)"
  emit_report "${tmp_md}"
  cat "${tmp_md}"
  rm -f "${tmp_md}"
fi
