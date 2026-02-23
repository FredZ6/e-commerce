# Resume Bullets

- Delivered a full-stack e-commerce platform with Spring Boot, React 18, PostgreSQL, and JWT RBAC, packaged as a 3-service Docker Compose stack (`frontend` + `backend` + `postgres`) for one-command local demos.
- Built and enforced quality automation across 28 tests (20 backend JUnit + 7 frontend Vitest + 1 Playwright E2E) with 2 push/PR workflows (CI + E2E) plus 2 manual deploy/destroy workflows for cost-safe demos.
- Added contract and integration coverage for core commerce flows, including login, product browsing, cart updates, checkout, and admin order status transitions.
- Implemented transactional inventory protection (stock validation and decrement at checkout) to prevent overselling and keep order state/data consistent.
- Hardened security by removing permissive JWT defaults in non-local environments, adding startup secret validation, and introducing login abuse controls (5 attempts/5-minute window, 15-minute block).
- Improved demo reliability with local profile seeding of 6 curated products and deterministic local SVG product assets, plus retryable catalog error states in the product listing UX.
- Enforced measurable coverage gates: frontend (lines/functions/statements >= 30%, branches >= 20%) and backend JaCoCo (line >= 35%, branch >= 20%).
