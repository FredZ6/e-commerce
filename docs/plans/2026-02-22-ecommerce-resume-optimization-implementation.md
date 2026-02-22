# E-Commerce Resume Optimization (Plan B) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship an interview-ready, deployable e-commerce project with stable FE/BE contracts, robust auth/authorization, inventory-aware ordering, CI, tests, and polished documentation.

**Architecture:** Keep a monorepo with one Spring Boot backend and one React frontend. Lock API contracts first, then implement business logic hardening and admin workflows, then add test/CI/deployment layers. Prefer incremental TDD with small, reviewable commits.

**Tech Stack:** Spring Boot 3.4 + Spring Security + JPA + PostgreSQL + JWT, React 18 + Vite + React Router + Axios + Tailwind, JUnit 5 + MockMvc + Testcontainers, Vitest + React Testing Library, GitHub Actions, Docker Compose.

---

## Execution Rules

1. Follow `@superpowers:test-driven-development` for every behavior change.
2. Use `@superpowers:systematic-debugging` when any test fails unexpectedly.
3. Run `@superpowers:verification-before-completion` before claiming done.
4. Use frequent commits (one commit per task).
5. Keep scope to Plan B (no payment integration, no microservice split).

### Task 1: Create Isolated Worktree and Baseline Snapshot

**Files:**
- Create: `../e-commerce-planb` (git worktree directory)
- Modify: `docs/plans/2026-02-22-ecommerce-resume-optimization-implementation.md` (if path updates are needed)

**Step 1: Create worktree branch**

```bash
git worktree add ../e-commerce-planb -b codex/planb-resume-optimization
```

**Step 2: Verify clean baseline in worktree**

Run: `cd ../e-commerce-planb && git status --short`
Expected: no unstaged/staged project changes.

**Step 3: Capture baseline flow checklist**

```text
- User register/login
- Product browse/detail
- Cart add/update/remove/clear
- Checkout
- Admin product CRUD
```

**Step 4: Save baseline checklist**

Create `docs/baseline-checklist.md` with the checklist above.

**Step 5: Commit**

```bash
cd ../e-commerce-planb
git add docs/baseline-checklist.md
git commit -m "docs: add baseline verification checklist"
```

### Task 2: Lock Product Contract (stock/details) with Failing Backend Tests

**Files:**
- Create: `backend/shop/src/test/java/com/example/shop/contract/ProductContractTest.java`
- Modify: `backend/shop/src/main/java/com/example/shop/model/Product.java`
- Modify: `backend/shop/src/main/java/com/example/shop/service/ProductService.java`

**Step 1: Write failing contract test**

```java
@Test
void createProduct_shouldPersistStockAndDetails() throws Exception {
    String body = """
      {"name":"Keyboard","description":"Mech","price":99.99,
       "imageUrl":"https://img","stock":12,"details":"Hot-swappable"}
      """;

    mockMvc.perform(post("/api/products/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body)
            .header("Authorization", adminToken()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.stock").value(12))
        .andExpect(jsonPath("$.details").value("Hot-swappable"));
}
```

**Step 2: Run test to verify failure**

Run: `cd backend/shop && ./mvnw -q -Dtest=ProductContractTest test`
Expected: FAIL due missing `stock`/`details` mapping.

**Step 3: Implement minimal model/service changes**

```java
@Column(nullable = false)
private Integer stock = 0;

@Column(columnDefinition = "TEXT")
private String details;
```

Also update `ProductService.updateProduct(...)` to apply `stock` and `details` updates when provided.

**Step 4: Re-run contract test**

Run: `cd backend/shop && ./mvnw -q -Dtest=ProductContractTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/java/com/example/shop/model/Product.java \
  backend/shop/src/main/java/com/example/shop/service/ProductService.java \
  backend/shop/src/test/java/com/example/shop/contract/ProductContractTest.java
git commit -m "feat: add product stock and details contract"
```

### Task 3: Lock Order Response Contract with Failing Backend Tests

**Files:**
- Create: `backend/shop/src/test/java/com/example/shop/contract/OrderContractTest.java`
- Modify: `backend/shop/src/main/java/com/example/shop/dto/OrderDto.java`
- Modify: `backend/shop/src/main/java/com/example/shop/dto/OrderItemDto.java`
- Modify: `backend/shop/src/main/java/com/example/shop/service/OrderService.java`

**Step 1: Write failing test for order payload shape**

```java
@Test
void getOrders_shouldReturnFrontendCompatibleFields() throws Exception {
    mockMvc.perform(get("/api/orders").header("Authorization", userToken()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").exists())
        .andExpect(jsonPath("$[0].totalPrice").exists())
        .andExpect(jsonPath("$[0].orderItems[0].productName").exists())
        .andExpect(jsonPath("$[0].orderItems[0].unitPrice").exists());
}
```

**Step 2: Run test to verify failure**

Run: `cd backend/shop && ./mvnw -q -Dtest=OrderContractTest test`
Expected: FAIL due DTO mismatch/serialization mismatch.

**Step 3: Implement minimal DTO/mapping updates**

```java
itemDto.setProductImageUrl(product.getImageUrl());
itemDto.setTotalPrice(item.getUnitPrice()
    .multiply(BigDecimal.valueOf(item.getQuantity())));
```

Add required DTO fields used by frontend and populate in `convertToDTO`.

**Step 4: Re-run test**

Run: `cd backend/shop && ./mvnw -q -Dtest=OrderContractTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/java/com/example/shop/dto/OrderDto.java \
  backend/shop/src/main/java/com/example/shop/dto/OrderItemDto.java \
  backend/shop/src/main/java/com/example/shop/service/OrderService.java \
  backend/shop/src/test/java/com/example/shop/contract/OrderContractTest.java
git commit -m "feat: align order response contract with frontend"
```

### Task 4: Unify Security Configuration and Protect Admin APIs

**Files:**
- Delete: `backend/shop/src/main/java/com/example/shop/config/SecurityConfig.java`
- Modify: `backend/shop/src/main/java/com/example/shop/config/WebSecurityConfig.java`
- Modify: `backend/shop/src/main/resources/application.properties`
- Create: `backend/shop/src/test/java/com/example/shop/security/SecurityRulesTest.java`

**Step 1: Write failing security rules test**

```java
@Test
void nonAdminCannotCreateProduct() throws Exception {
    mockMvc.perform(post("/api/products/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}")
            .header("Authorization", userToken()))
        .andExpect(status().isForbidden());
}
```

**Step 2: Run test to verify failure**

Run: `cd backend/shop && ./mvnw -q -Dtest=SecurityRulesTest test`
Expected: FAIL if wrong filter chain/rules are active.

**Step 3: Keep one canonical security config**

- Remove duplicate `SecurityConfig`.
- Ensure canonical rules in `WebSecurityConfig`:
  - public: `GET /api/products/**`, `/api/users/register`, `/api/users/login`
  - admin-only: non-GET `/api/products/**`, admin order ops
  - authenticated: cart/order/user self endpoints

**Step 4: Re-run test**

Run: `cd backend/shop && ./mvnw -q -Dtest=SecurityRulesTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/java/com/example/shop/config/WebSecurityConfig.java \
  backend/shop/src/main/resources/application.properties \
  backend/shop/src/test/java/com/example/shop/security/SecurityRulesTest.java
git rm backend/shop/src/main/java/com/example/shop/config/SecurityConfig.java
git commit -m "refactor: unify security configuration and enforce admin guards"
```

### Task 5: Add Inventory-Aware Checkout Rules

**Files:**
- Modify: `backend/shop/src/main/java/com/example/shop/service/OrderService.java`
- Modify: `backend/shop/src/main/java/com/example/shop/service/CartService.java`
- Create: `backend/shop/src/test/java/com/example/shop/service/OrderServiceStockTest.java`

**Step 1: Write failing insufficient-stock test**

```java
@Test
void createOrder_shouldFailWhenStockInsufficient() {
    assertThrows(RuntimeException.class, () -> orderService.createOrder(user));
}
```

**Step 2: Run failing test**

Run: `cd backend/shop && ./mvnw -q -Dtest=OrderServiceStockTest test`
Expected: FAIL because checkout currently ignores stock.

**Step 3: Implement transactional stock checks/decrement**

```java
if (product.getStock() < cartItem.getQuantity()) {
    throw new RuntimeException("Insufficient stock: " + product.getName());
}
product.setStock(product.getStock() - cartItem.getQuantity());
```

Ensure method is transactional and persists updated product stock.

**Step 4: Re-run test**

Run: `cd backend/shop && ./mvnw -q -Dtest=OrderServiceStockTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/java/com/example/shop/service/OrderService.java \
  backend/shop/src/main/java/com/example/shop/service/CartService.java \
  backend/shop/src/test/java/com/example/shop/service/OrderServiceStockTest.java
git commit -m "feat: enforce stock validation during checkout"
```

### Task 6: Add Admin Order Management API (Status Updates)

**Files:**
- Modify: `backend/shop/src/main/java/com/example/shop/controller/OrderController.java`
- Modify: `backend/shop/src/main/java/com/example/shop/service/OrderService.java`
- Create: `backend/shop/src/test/java/com/example/shop/controller/AdminOrderControllerTest.java`

**Step 1: Write failing admin status update API test**

```java
@Test
void adminCanUpdateOrderStatus() throws Exception {
    mockMvc.perform(put("/api/orders/admin/{id}/status", orderId)
            .param("status", "SHIPPED")
            .header("Authorization", adminToken()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("SHIPPED"));
}
```

**Step 2: Run failing test**

Run: `cd backend/shop && ./mvnw -q -Dtest=AdminOrderControllerTest test`
Expected: FAIL endpoint missing.

**Step 3: Implement minimal endpoint + service**

```java
@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/admin/{orderId}/status")
public ResponseEntity<OrderDto> updateOrderStatus(...) { ... }
```

Validate legal status transitions in service layer.

**Step 4: Re-run test**

Run: `cd backend/shop && ./mvnw -q -Dtest=AdminOrderControllerTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/java/com/example/shop/controller/OrderController.java \
  backend/shop/src/main/java/com/example/shop/service/OrderService.java \
  backend/shop/src/test/java/com/example/shop/controller/AdminOrderControllerTest.java
git commit -m "feat: add admin order status management api"
```

### Task 7: Externalize Secrets and Add Environment Templates

**Files:**
- Modify: `backend/shop/src/main/resources/application.properties`
- Create: `backend/shop/src/main/resources/application-local.properties`
- Create: `.env.example`
- Modify: `README.md`

**Step 1: Write failing config-load test**

```java
@Test
void contextLoadsWithEnvBackedSecrets() {
    assertThat(environment.getProperty("jwt.secret")).isNotBlank();
}
```

**Step 2: Run failing test**

Run: `cd backend/shop && ./mvnw -q -Dtest=ConfigLoadTest test`
Expected: FAIL after removing hardcoded fallback.

**Step 3: Implement env-driven properties**

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/ecommerce_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
jwt.secret=${JWT_SECRET:replace-this-local-dev-secret}
```

**Step 4: Re-run test**

Run: `cd backend/shop && ./mvnw -q -Dtest=ConfigLoadTest test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/src/main/resources/application.properties \
  backend/shop/src/main/resources/application-local.properties \
  .env.example README.md
git commit -m "chore: move secrets to env-based configuration"
```

### Task 8: Set Up Frontend Test Infrastructure

**Files:**
- Modify: `frontend/my-shop-frontend/package.json`
- Create: `frontend/my-shop-frontend/vitest.config.js`
- Create: `frontend/my-shop-frontend/src/test/setup.js`
- Modify: `frontend/my-shop-frontend/src/main.jsx` (if test wrappers are needed)

**Step 1: Add a failing smoke component test**

```jsx
import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders app shell', () => {
  render(<App />)
  expect(screen.getByText(/E-Shop/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify failure**

Run: `cd frontend/my-shop-frontend && npm run test -- --run`
Expected: FAIL (missing test config/libs/scripts).

**Step 3: Add minimal Vitest/RTL config and scripts**

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

**Step 4: Re-run tests**

Run: `cd frontend/my-shop-frontend && npm run test:run`
Expected: PASS for smoke test.

**Step 5: Commit**

```bash
git add frontend/my-shop-frontend/package.json \
  frontend/my-shop-frontend/vitest.config.js \
  frontend/my-shop-frontend/src/test/setup.js \
  frontend/my-shop-frontend/src/test/App.test.jsx
git commit -m "test: add frontend vitest and rtl setup"
```

### Task 9: Unify Frontend Auth Context and Route Guard Behavior

**Files:**
- Delete: `frontend/my-shop-frontend/src/contexts/AuthContext/index.jsx`
- Delete: `frontend/my-shop-frontend/src/contexts/AuthContext/context.js`
- Modify: `frontend/my-shop-frontend/src/contexts/AuthContext.jsx`
- Modify: `frontend/my-shop-frontend/src/components/PrivateRoute.jsx`
- Create: `frontend/my-shop-frontend/src/test/auth/AuthContext.test.jsx`

**Step 1: Write failing auth behavior test**

```jsx
test('redirects unauthenticated user to login', () => {
  // render PrivateRoute with no auth user
  // expect navigation to /login
})
```

**Step 2: Run failing test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/auth/AuthContext.test.jsx`
Expected: FAIL due duplicated/inconsistent auth state providers.

**Step 3: Keep single AuthContext implementation**

- Keep `src/contexts/AuthContext.jsx` as source of truth.
- Remove duplicate folder-based implementation.
- Ensure `isAuthenticated`, `loading`, `roles` work consistently.

**Step 4: Re-run test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/auth/AuthContext.test.jsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add frontend/my-shop-frontend/src/contexts/AuthContext.jsx \
  frontend/my-shop-frontend/src/components/PrivateRoute.jsx \
  frontend/my-shop-frontend/src/test/auth/AuthContext.test.jsx
git rm frontend/my-shop-frontend/src/contexts/AuthContext/index.jsx \
  frontend/my-shop-frontend/src/contexts/AuthContext/context.js
git commit -m "refactor: unify frontend auth context and guards"
```

### Task 10: Align Frontend Product and Order Pages to API Contract

**Files:**
- Modify: `frontend/my-shop-frontend/src/pages/Admin/Products/ProductForm.jsx`
- Modify: `frontend/my-shop-frontend/src/pages/Orders/index.jsx`
- Modify: `frontend/my-shop-frontend/src/pages/Orders/OrderDetail.jsx`
- Modify: `frontend/my-shop-frontend/src/services/order.js`
- Create: `frontend/my-shop-frontend/src/test/orders/OrderPages.test.jsx`

**Step 1: Write failing UI contract tests**

```jsx
test('renders order list using orderItems fields', async () => {
  // mock API payload { totalPrice, orderItems }
  // assert productName and unitPrice render
})
```

**Step 2: Run failing test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/orders/OrderPages.test.jsx`
Expected: FAIL due stale field assumptions (`items`, `totalAmount`, etc.).

**Step 3: Implement minimal UI mapping changes**

```jsx
{order.orderItems.map((item) => (
  <p key={item.id}>{item.productName} x {item.quantity}</p>
))}
<p>总计：¥{order.totalPrice}</p>
```

**Step 4: Re-run test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/orders/OrderPages.test.jsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add frontend/my-shop-frontend/src/pages/Admin/Products/ProductForm.jsx \
  frontend/my-shop-frontend/src/pages/Orders/index.jsx \
  frontend/my-shop-frontend/src/pages/Orders/OrderDetail.jsx \
  frontend/my-shop-frontend/src/services/order.js \
  frontend/my-shop-frontend/src/test/orders/OrderPages.test.jsx
git commit -m "fix: align frontend order and product pages with backend contract"
```

### Task 11: Build Admin Order Management Page

**Files:**
- Create: `frontend/my-shop-frontend/src/pages/Admin/Orders/index.jsx`
- Modify: `frontend/my-shop-frontend/src/App.jsx`
- Modify: `frontend/my-shop-frontend/src/components/Layout/MainLayout.jsx`
- Modify: `frontend/my-shop-frontend/src/services/order.js`
- Create: `frontend/my-shop-frontend/src/test/admin/AdminOrders.test.jsx`

**Step 1: Write failing admin page test**

```jsx
test('admin can update order status from list', async () => {
  // render admin orders page, click status action
  // expect update API called and UI refreshed
})
```

**Step 2: Run failing test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/admin/AdminOrders.test.jsx`
Expected: FAIL page/route/service missing.

**Step 3: Implement minimal admin order UI + route + service methods**

```jsx
<Route path="/admin/orders" element={<PrivateRoute requiredRole="ADMIN"><MainLayout><AdminOrders /></MainLayout></PrivateRoute>} />
```

Add `getAllOrdersForAdmin` and `updateOrderStatus` service methods.

**Step 4: Re-run test**

Run: `cd frontend/my-shop-frontend && npm run test:run -- src/test/admin/AdminOrders.test.jsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add frontend/my-shop-frontend/src/pages/Admin/Orders/index.jsx \
  frontend/my-shop-frontend/src/App.jsx \
  frontend/my-shop-frontend/src/components/Layout/MainLayout.jsx \
  frontend/my-shop-frontend/src/services/order.js \
  frontend/my-shop-frontend/src/test/admin/AdminOrders.test.jsx
git commit -m "feat: add admin order management page"
```

### Task 12: Add Backend Integration Tests for Critical Flows

**Files:**
- Create: `backend/shop/src/test/java/com/example/shop/integration/CheckoutFlowIT.java`
- Create: `backend/shop/src/test/java/com/example/shop/integration/AdminFlowIT.java`
- Modify: `backend/shop/pom.xml` (testcontainers dependencies if missing)

**Step 1: Write failing checkout integration test**

```java
@Test
void checkoutFlow_shouldCreateOrderAndClearCart() { /* arrange -> act -> assert */ }
```

**Step 2: Run failing integration test**

Run: `cd backend/shop && ./mvnw -q -Dtest=CheckoutFlowIT test`
Expected: FAIL before testcontainer/test setup and final contract alignment.

**Step 3: Add minimal test infra + fixtures**

```xml
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>postgresql</artifactId>
  <scope>test</scope>
</dependency>
```

**Step 4: Re-run integration tests**

Run: `cd backend/shop && ./mvnw -q -Dtest=CheckoutFlowIT,AdminFlowIT test`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/shop/pom.xml \
  backend/shop/src/test/java/com/example/shop/integration/CheckoutFlowIT.java \
  backend/shop/src/test/java/com/example/shop/integration/AdminFlowIT.java
git commit -m "test: add backend integration tests for checkout and admin flows"
```

### Task 13: Add CI Pipeline (Frontend + Backend)

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

**Step 1: Write failing local CI dry-run checklist**

```text
- backend: ./mvnw test
- frontend: npm run lint && npm run test:run && npm run build
```

**Step 2: Execute local commands and capture failures**

Run:
- `cd backend/shop && ./mvnw -q test`
- `cd frontend/my-shop-frontend && npm run lint && npm run test:run && npm run build`

Expected: initial failures reveal missing scripts/config gaps.

**Step 3: Implement workflow yaml**

```yaml
jobs:
  backend:
    steps: [checkout, setup-java, mvn test]
  frontend:
    steps: [checkout, setup-node, npm ci, lint, test:run, build]
```

**Step 4: Re-run local checks**

Expected: all local checks PASS before pushing.

**Step 5: Commit**

```bash
git add .github/workflows/ci.yml README.md
git commit -m "ci: add fullstack validation workflow"
```

### Task 14: Docker Compose + README + Resume Artifacts

**Files:**
- Create: `docker-compose.yml`
- Create: `backend/shop/Dockerfile`
- Create: `frontend/my-shop-frontend/Dockerfile`
- Modify: `README.md`
- Create: `docs/resume-bullets.md`
- Create: `docs/architecture.md`

**Step 1: Write failing startup validation checklist**

```text
docker compose up -d
curl backend /api/products -> 200
open frontend -> product list visible
```

**Step 2: Run command to expose gaps**

Run: `docker compose up --build`
Expected: FAIL initially until Dockerfiles/env wiring are complete.

**Step 3: Implement minimal containerization and docs**

- Backend container runs Spring Boot with env vars.
- Frontend container serves built Vite app.
- Compose wires frontend/backend/postgres.

**Step 4: Re-run validation**

Run:
- `docker compose up -d --build`
- `curl -f http://localhost:8080/api/products`
Expected: PASS.

**Step 5: Commit**

```bash
git add docker-compose.yml backend/shop/Dockerfile frontend/my-shop-frontend/Dockerfile \
  README.md docs/resume-bullets.md docs/architecture.md
git commit -m "docs: add deployable setup and resume-ready project artifacts"
```

## Final Verification Checklist

1. Backend tests:
   - `cd backend/shop && ./mvnw -q test`
2. Frontend checks:
   - `cd frontend/my-shop-frontend && npm run lint && npm run test:run && npm run build`
3. Manual smoke:
   - Register/login
   - Product browse/detail
   - Cart CRUD
   - Checkout success/fail on low stock
   - Admin product CRUD
   - Admin order status update
4. CI green on branch PR.

## Deliverables at Completion

1. Stable FE/BE contracts for products/orders/auth.
2. Inventory-aware ordering and admin order management.
3. Automated tests + CI pipeline.
4. Dockerized local startup + deployment-ready docs.
5. Resume bullets and architecture summary for interviews.
