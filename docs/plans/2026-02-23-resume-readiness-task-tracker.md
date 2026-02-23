# Resume Bonus 6-Task Tracker (Canonical)

Updated: 2026-02-23

Use this file as the single source of truth for the "6 resume boost tasks".

Startup rule:
- Before starting any new task, read this file first:
  - `sed -n '1,260p' docs/plans/2026-02-23-resume-readiness-task-tracker.md`
- If another checklist conflicts with this one, this file wins.

## Progress Snapshot

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| 1 | One-click demo deploy proof | Partially Completed | `bca9592`, `a12ed16` |
| 2 | E2E tests + quality gates | Completed | `8b25d86`, `37e8562`, `2c6d52c` |
| 3 | Observability (logs/metrics/health) | Completed | `c6585a6` |
| 4 | Replace external images with controllable assets | Completed | `1656c19`, `8584840` |
| 5 | Performance + security baseline | Partially Completed | `3342745`, `1bba829`, `326ee81` |
| 6 | Rewrite README + quantified resume bullets | Partially Completed | `13f5392`, `bca9592`, `2c6d52c` |

## Task 1 - One-Click Demo Deploy Proof

Status: Partially Completed

Done:
- Manual deploy/destroy workflows and safety guards are in place.
- Deploy runbook and proof template exist.

Remaining:
- Run one real `manual-demo-deploy` and one `manual-demo-destroy`.
- Fill `docs/deploy-proof-template.md` with run URLs.
- Add real live demo URL and screenshot(s) to `README.md`.

## Task 2 - E2E Tests and Quality Gates

Status: Completed

Done:
- Playwright critical flow covers register/login -> add to cart -> place order -> admin status update.
- Frontend and backend coverage thresholds are enforced in CI.

## Task 3 - Observability

Status: Completed

Done:
- Added request ID propagation (`X-Request-Id`) and MDC logging.
- Added health and metrics exposure with actuator/prometheus endpoints.
- Added integration tests for health and request ID behavior.

## Task 4 - Replace External Images With Controllable Assets

Status: Completed

Done:
- Product images are served from repository-controlled static assets.
- Seeder syncs demo catalog image URLs on startup for stable demos.
- Home page "Travel Kits" image mapping issue was fixed.

## Task 5 - Performance and Security Baseline

Status: Partially Completed

Done:
- Security baseline exists: role-based guards, login abuse protection, startup secret validation.
- OpenAPI docs are now published and contract-tested (useful for security checklisting).

Remaining:
- Add a reproducible API performance baseline report (load test script + results in docs).
- Add a concise "authz checklist" doc for critical endpoints and expected roles.

## Task 6 - README and Resume Bullets (Quantified)

Status: Partially Completed

Done:
- `docs/resume-bullets.md` is quantified and interview-ready.
- README contains architecture/stack/quality/deploy sections.

Remaining:
- Replace `TBD` live demo fields in README with actual URLs and credentials (when deployed).
- Add one short "results" section with measurable outcomes (tests, CI, deployment mode).

## Notes

- The OpenAPI publishing commit `326ee81` is an extra improvement (not one of the original 6 tasks).
