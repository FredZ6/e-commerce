# Resume Bullets

- Built and shipped a full-stack e-commerce platform using Spring Boot (Java 17), React 18, PostgreSQL, and JWT auth with role-based access control.
- Stabilized frontend/backend contracts with dedicated contract tests (MockMvc + Vitest), reducing integration drift between order/product payloads.
- Implemented inventory-aware checkout logic with transactional stock validation and decrement to prevent overselling.
- Added admin order operations (list + status transitions) and secured admin-only endpoints through unified Spring Security rules.
- Introduced integration test coverage for checkout and admin flows, plus a GitHub Actions CI pipeline that runs backend tests and frontend lint/test/build on every push and PR.
- Containerized the stack with Docker Compose (frontend + backend + PostgreSQL) and documented local deployment and architecture for interview-ready demos.
