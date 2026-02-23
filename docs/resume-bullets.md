# Resume Bullets

- Delivered a full-stack e-commerce platform (Spring Boot 3.4 + React 18 + PostgreSQL + JWT RBAC) packaged as a 3-service Docker Compose stack for one-command local demos.
- Built and enforced quality automation across **39 tests** (`29` backend JUnit + `10` frontend/E2E via Vitest + Playwright) with **4 GitHub Actions workflows** (`CI`, `E2E`, manual deploy, manual destroy).
- Implemented contract/integration coverage for core commerce paths (register/login, product browse, cart operations, checkout, admin order status updates) and locked API documentation with OpenAPI contract tests.
- Hardened runtime security with startup JWT secret validation, login abuse protection (`5` attempts/`5` minutes + `15`-minute block), and admin-only protection for privileged endpoints (including actuator metrics).
- Established a reproducible API performance baseline script and report (`200` requests, concurrency `10`): `GET /api/products` P95 `0.021s` at `88.09 req/s`.
- Improved demo stability with deterministic local assets (6 seeded products + local SVG image paths) to avoid external image host failures during demos.
- Enforced CI coverage gates: frontend lines/functions/statements >= `40%`, branches >= `30%`; backend JaCoCo line >= `50%`, branch >= `30%`.
