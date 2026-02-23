# Resume Readiness Task Tracker (Priority-First)

Updated: 2026-02-23

## Task R1 (Highest): Public Demo Readiness + Verification

Status: Completed

Goal:
- Make the project demo-ready for external reviewers with clear entry links, CI badge, and a repeatable smoke check.

Deliverables:
- README has CI badge + demo section.
- Dockerized frontend can reach backend in stack mode without manual proxy hacks.
- `scripts/smoke-demo.sh` validates frontend and backend endpoints.
- Optional cloud deployment manifest is documented for one-click hosting handoff.

Acceptance:
- `docker compose up -d --build` succeeds.
- Frontend entry responds `200`.
- Backend products endpoint responds `200` through published endpoint.
- Verified on 2026-02-23 with:
  - `POSTGRES_HOST_PORT=5435 BACKEND_HOST_PORT=8083 FRONTEND_HOST_PORT=5175 docker compose up -d --build`
  - `FRONTEND_URL=http://localhost:5175 BACKEND_URL=http://localhost:8083 ./scripts/smoke-demo.sh`

---

## Task R2: End-to-End Critical User Journey (Playwright)

Status: Completed

Goal:
- Add one E2E flow: login -> product browse -> add to cart -> checkout -> order visible.

Deliverables:
- Playwright config + spec.
- CI job for E2E (or dedicated workflow).

Acceptance:
- E2E test passes locally and in CI.
- Verified locally on 2026-02-23 with:
  - `POSTGRES_HOST_PORT=5436 BACKEND_HOST_PORT=8084 FRONTEND_HOST_PORT=5176 docker compose up -d --build`
  - `E2E_FRONTEND_URL=http://localhost:5176 E2E_API_URL=http://localhost:8084 npm run e2e`

---

## Task R3: Coverage Gate (Frontend + Backend)

Status: Completed

Goal:
- Add measurable coverage thresholds and enforce them in CI.

Deliverables:
- Frontend Vitest coverage config and threshold.
- Backend JaCoCo report + threshold.
- CI fails when thresholds are not met.

Acceptance:
- Coverage reports generated and thresholds enforced.
- Verified on 2026-02-23 with:
  - `cd frontend/my-shop-frontend && npm run test:coverage`
  - `cd backend/shop && ./mvnw -q test` (JaCoCo check bound to test phase)

---

## Task R4: Security Hardening for Resume Credibility

Status: Completed

Goal:
- Remove weak defaults and tighten runtime safety for production mode.

Deliverables:
- No permissive default JWT secret outside local/test profile.
- Production logging reduced from debug to safe defaults.
- Basic login abuse protection (rate limit/lock window) documented and implemented.

Acceptance:
- App startup fails fast when critical prod secrets are missing.
- Security regression tests pass.
- Verified on 2026-02-23 with:
  - `cd backend/shop && ./mvnw -q -Dtest=SecurityStartupValidatorTest,LoginRateLimitTest test`
  - `cd backend/shop && ./mvnw -q test`

---

## Task R5: UX Data States + Demo Seed Data

Status: Completed

Goal:
- Ensure reviewer sees a polished UI with meaningful demo content immediately.

Deliverables:
- Seeded products for local/demo profile.
- Better loading/empty/error states in key pages.
- Stable image fallback behavior.

Acceptance:
- Fresh environment shows curated products without manual DB edits.
- Verified on 2026-02-23 with:
  - `cd backend/shop && ./mvnw -q -Dtest=DemoCatalogSeederTest test`
  - `cd backend/shop && ./mvnw -q test`
  - `cd frontend/my-shop-frontend && npm run test:run -- src/test/products/ProductsPageStates.test.jsx`
  - `cd frontend/my-shop-frontend && npm run lint && npm run test:run && npm run build`

---

## Task R6: Resume Bullets with Quantified Impact

Status: Completed

Goal:
- Rewrite resume bullets to include measurable outcomes and technical depth.

Deliverables:
- Updated `docs/resume-bullets.md` with numbers (test count, CI, containerization, flows).

Acceptance:
- Bullets are concise, metric-based, and interview-ready.
- Verified on 2026-02-23 with:
  - `rg -n "@Test" backend/shop/src/test/java | wc -l` -> 20 backend tests
  - `rg -n "\\btest\\(" frontend/my-shop-frontend/src/test frontend/my-shop-frontend/e2e | wc -l` -> 8 frontend/e2e tests
  - `ls -1 .github/workflows | wc -l` -> 2 workflows
  - `sed -n '1,240p' docs/resume-bullets.md` (content review)
