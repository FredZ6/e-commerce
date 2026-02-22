# E-Commerce Resume Optimization Design (Plan B)

Date: 2026-02-22
Owner: Codex + Fredz
Scope: Full-stack hardening and feature completion for portfolio/resume use

## 1. Goals

1. Deliver a stable, demo-ready e-commerce system with clean end-to-end flows.
2. Raise engineering quality to interview-ready level (tests, CI, deployability, docs).
3. Add 1-2 meaningful product/engineering highlights that are defensible in interviews.
4. Produce measurable outcomes and artifacts that can be written directly on a resume.

## 2. Non-goals

1. No microservice split; keep single backend service for clarity and delivery speed.
2. No payment gateway integration in this phase (mock/state-based order lifecycle only).
3. No large redesign of UI system; prioritize correctness, consistency, and usability.

## 3. Current Gaps (from codebase scan)

1. Security config duplication may cause ambiguity:
   - `backend/shop/src/main/java/com/example/shop/config/SecurityConfig.java`
   - `backend/shop/src/main/java/com/example/shop/config/WebSecurityConfig.java`
2. Frontend auth context has duplicate implementations:
   - `frontend/my-shop-frontend/src/contexts/AuthContext.jsx`
   - `frontend/my-shop-frontend/src/contexts/AuthContext/index.jsx`
3. Product shape mismatch:
   - Frontend admin form uses `stock`, `details`
   - Backend `Product` entity lacks these fields
4. Order shape mismatch:
   - Frontend expects fields like `orderNumber/items/...`
   - Backend DTO currently returns `id/totalPrice/orderItems/...`
5. Plain secrets in backend config (`application.properties`), not environment-driven.
6. Missing complete engineering loop: tests + CI + containerized startup + deployment docs.

## 4. Chosen Approach (Plan B)

Balance speed and quality in a 10-14 day delivery:

1. First stabilize domain contracts and auth/security path.
2. Then complete product features with meaningful business logic depth.
3. Add verification guardrails (tests + CI).
4. Deploy and package project narrative for resume/interview usage.

Rationale: This yields strong resume value with contained complexity and low schedule risk.

## 5. Solution Design

### 5.1 Architecture and Contracts

1. Keep monorepo with separate backend/frontend apps.
2. Define backend response/request DTOs as single source of truth.
3. Align frontend models strictly to backend DTOs.
4. Unify auth/session model around JWT + role claims + centralized interceptors.

### 5.2 Backend Refactor

1. Keep one security configuration class only.
2. Introduce consistent API error model:
   - `code`, `message`, `details`, `timestamp`, `path`
3. Add/align product fields:
   - `stock` (integer)
   - `details` (text)
4. Harden order domain:
   - create order from cart
   - stock decrement with transactional boundary
   - fail fast on insufficient stock
   - order status transitions (`PENDING -> PAID -> SHIPPED -> COMPLETED`, `CANCELLED`)
5. Add admin endpoints for order management (status updates, listing).
6. Move secrets to environment variables with sane defaults for local dev.

### 5.3 Frontend Refactor

1. Keep one AuthContext implementation; remove duplicate/conflicting implementation.
2. Align pages to real DTO fields from backend.
3. Admin product management fully supports `stock/details` and validation.
4. Add admin order management page (status actions + filtering).
5. Improve user flow feedback with consistent loading/error/toast states.

### 5.4 Data Flow

1. User registers/logs in -> backend issues JWT.
2. Frontend stores token and sends token via interceptor.
3. Cart operations persist server-side per authenticated user.
4. Checkout triggers transactional order creation:
   - validate cart and stock
   - create order and order items
   - decrement inventory
   - clear cart
5. Order queries return normalized DTOs consumed directly by UI.

### 5.5 Error Handling

1. Backend throws typed exceptions (validation/not found/forbidden/business rule).
2. Global exception handler maps to standard error response.
3. Frontend maps API error response to user-facing messages without leaking internals.

### 5.6 Testing Strategy

1. Backend unit tests:
   - product/cart/order services (happy path + edge cases)
2. Backend integration tests:
   - auth, cart checkout, admin protected endpoints
   - PostgreSQL via Testcontainers
3. Frontend tests:
   - auth guard
   - cart update/checkout flow
   - admin product form validation
4. Smoke script:
   - boot services
   - execute key API sequence

### 5.7 CI/CD and Deployment

1. CI pipeline jobs:
   - frontend lint + test + build
   - backend test + package
2. Add Docker Compose for local one-command startup.
3. Deploy target:
   - frontend: Vercel
   - backend: Render/Railway
   - DB: managed PostgreSQL (Neon/Supabase)
4. Add deployment/runbook section in README.

## 6. Implementation Phases (10-14 days)

### Phase 1: Stabilization (Day 1-3)

1. Unify security and auth context implementations.
2. Align product/order DTO contracts between FE/BE.
3. Remove secret hardcoding and set env-based config.

Exit criteria:
- Core user flow runs without contract mismatch errors.

### Phase 2: Feature Completion (Day 4-7)

1. Add stock/details support end-to-end.
2. Implement order status lifecycle + admin order management APIs/pages.
3. Add list filters/search/pagination (products/orders).

Exit criteria:
- User and admin flows both demo-ready.

### Phase 3: Engineering Quality (Day 8-11)

1. Add backend and frontend tests for critical flows.
2. Add CI pipeline and compose-based local run.
3. Standardize error response and client handling.

Exit criteria:
- CI green, repeatable local setup, verified key tests.

### Phase 4: Delivery Packaging (Day 12-14)

1. Deploy to public URLs.
2. Finalize README (architecture, setup, test, demo accounts, API summary).
3. Prepare resume bullets and interview talking points with metrics.

Exit criteria:
- Public demo + polished project story + measurable outputs.

## 7. Resume-Facing Deliverables

1. Public demo links (frontend + backend health/API docs if exposed).
2. CI badge + test evidence.
3. Clear architecture and API section in README.
4. 3 concise resume bullets with measurable impact.

## 8. Risks and Mitigations

1. Scope creep risk
   - Mitigation: freeze Plan B scope; defer non-essential features.
2. Contract churn risk
   - Mitigation: lock DTO schema before UI polish.
3. Deployment instability risk
   - Mitigation: use managed PostgreSQL and minimal env matrix.
4. Test flakiness risk
   - Mitigation: deterministic fixtures and isolated test data.

## 9. Acceptance Criteria

1. Core user journey passes:
   - register/login -> browse -> add cart -> checkout -> order detail
2. Core admin journey passes:
   - login as admin -> product CRUD -> order status update
3. FE/BE contracts are consistent (no field mismatch in target flows).
4. CI passes on pull request.
5. Project is deployable and documented for a reviewer in under 10 minutes.

## 10. Success Metrics

1. Test pass rate in CI: 100% on required jobs.
2. Critical flow manual smoke: 0 blocking defects.
3. New contributor setup time: <= 10 minutes with docs.
4. Resume narrative: at least 3 technically defensible highlights.
