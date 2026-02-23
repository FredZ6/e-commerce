# E-Commerce Shop Project

![CI](https://github.com/FredZ6/e-commerce/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/FredZ6/e-commerce/actions/workflows/e2e.yml/badge.svg)

This is an e-commerce shop project built with Spring Boot for the backend API and React for the frontend interface.

## Demo Access

- Local frontend (Docker default): `http://localhost:5173`
- Local backend API (Docker default): `http://localhost:8080/api/products`
- Admin login (created automatically when DB is empty):
  - Username: `admin`
  - Password: `Admin123@`
- Shopper login:
  - Register a user from `http://localhost:5173/register`, then sign in.
- Public cloud demo URL:
  - This project is cost-safe by design (no always-on public environment).
  - Use `manual-demo-deploy` workflow to create a temporary public URL and record it in `docs/deploy-proof-template.md`.

## Project Structure

The project is divided into two main parts:

- `backend/shop` - Spring Boot backend API
- `frontend/my-shop-frontend` - React frontend application

## Backend Technology Stack

- **Spring Boot 3.4.0** - Application framework
- **Spring Data JPA** - Data access
- **Spring Security** - Authentication and authorization
- **PostgreSQL** - Database
- **JWT** - User authentication
- **Maven** - Project management

## Frontend Technology Stack

- **React 18** - UI framework
- **React Router** - Routing management
- **Tailwind CSS** - Styling framework
- **Headless UI** - UI components
- **Axios** - HTTP client
- **Vite** - Build tool

## Features

### User Features

- User registration and login
- Product browsing and search
- Shopping cart management
- Order creation and viewing
- User profile management

### Admin Features

- Product management (add, edit, delete)
- Order management
- User management

## Backend API

The backend provides the following main APIs:

- `/api/users/*` - User-related APIs
- `/api/products/*` - Product-related APIs
- `/api/cart/*` - Shopping cart-related APIs
- `/api/orders/*` - Order-related APIs

## Getting Started

### Backend Setup

1. Ensure Java 17 and Maven are installed
2. Configure PostgreSQL database
3. Copy `.env.example` and set backend secrets (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`)
4. Run the following commands to start the backend:
```bash
cd backend/shop
./mvnw spring-boot:run
```


The backend will run at http://localhost:8080.

### Frontend Setup

1. Ensure Node.js is installed
2. Install dependencies and start the frontend:
```bash
cd frontend/my-shop-frontend
npm install
npm run dev
```

The frontend application will run at http://localhost:5173.

### Docker Compose Setup

Run the full stack (PostgreSQL + backend + frontend) with one command:

```bash
docker compose up -d --build
```

If local ports are already in use, override host ports:

```bash
POSTGRES_HOST_PORT=5433 BACKEND_HOST_PORT=8081 FRONTEND_HOST_PORT=5174 docker compose up -d --build
```

Compose does not pin explicit `container_name`, so multiple workspaces can run in parallel without name collisions.

Endpoints:

- Frontend: `http://localhost:${FRONTEND_HOST_PORT:-5173}`
- Backend API: `http://localhost:${BACKEND_HOST_PORT:-8080}/api/products`

Stop all services:

```bash
docker compose down
```

### Demo Smoke Check

After services are up, run:

```bash
./scripts/smoke-demo.sh
```

Or custom endpoints:

```bash
FRONTEND_URL=http://localhost:5174 BACKEND_URL=http://localhost:8082 ./scripts/smoke-demo.sh
```
## Quality Checks

Run the same checks that CI executes before pushing:

```bash
cd backend/shop
./mvnw -q test

cd ../../frontend/my-shop-frontend
npm run lint
npm run test:coverage
npm run build
```

## CI

GitHub Actions workflow is defined at `.github/workflows/ci.yml` and runs:

- Backend: `./mvnw -q test`
- Frontend: `npm ci`, `npm run lint`, `npm run test:coverage`, `npm run build`

Coverage thresholds enforced in CI:

- Frontend (Vitest): lines/functions/statements >= 40%, branches >= 30%
- Backend (JaCoCo): line >= 50%, branch >= 30%

Critical E2E workflow is defined at `.github/workflows/e2e.yml` and runs:

- Dockerized stack startup
- Playwright critical flows:
  - register -> login -> add to cart -> place order
  - admin updates order status -> user sees status change

## Results (Measured)

- Automated tests: **39 total** (`29` backend JUnit + `10` frontend/E2E via Vitest + Playwright).
- Workflows: **4 total** (`CI`, `E2E`, `manual-demo-deploy`, `manual-demo-destroy`).
- Coverage gates (enforced in CI):
  - Frontend: lines/functions/statements >= `40%`, branches >= `30%`
  - Backend JaCoCo: line >= `50%`, branch >= `30%`
- Performance baseline (2026-02-23, `200` requests, concurrency `10`):
  - `GET /api/products`: P95 `0.021s`, throughput `88.09 req/s`
  - `GET /actuator/health`: P95 `0.014s`, throughput `142.34 req/s`
- Security baseline:
  - Login abuse protection (attempt window + temporary block)
  - Admin-only actuator metrics endpoint
  - Role-protected admin order and product write operations

## Manual Cloud Deployment (Cost-safe)

This repository includes manual-only deployment workflows so cloud resources are never created on push/PR.

- Deploy workflow: `.github/workflows/manual-demo-deploy.yml`
- Destroy workflow: `.github/workflows/manual-demo-destroy.yml`
- Remote scripts: `scripts/cloud/deploy_demo_remote.sh`, `scripts/cloud/destroy_demo_remote.sh`
- Guardrail check script: `scripts/cloud/verify_manual_workflows.sh`
- Deploy env template: `.env.deploy.example`
- Full runbook: `docs/manual-cloud-deploy.md`
- Evidence template: `docs/deploy-proof-template.md`

You deploy only when needed for demos by running `workflow_dispatch` and entering confirm phrases.
After demo, run the destroy workflow to stop cost immediately.

### 5-Minute Demo + Rollback Flow

1. Run `manual-demo-deploy` with `confirm_phrase=DEPLOY_DEMO`, `deploy_ref=main`, `run_smoke_check=true`.
2. Open deployed app and API URL, then record evidence in `docs/deploy-proof-template.md`.
3. Run `manual-demo-destroy` with `confirm_phrase=DESTROY_DEMO`, `remove_volumes=true`.
4. Record destroy run URL and result in `docs/deploy-proof-template.md`.
5. Verify guardrails before/after edits:

```bash
./scripts/cloud/verify_manual_workflows.sh
```

## Project Docs

- Architecture summary: `docs/architecture.md`
- Resume bullets: `docs/resume-bullets.md`
- Manual cloud deploy runbook: `docs/manual-cloud-deploy.md`
- Deployment evidence template: `docs/deploy-proof-template.md`
## Security

- JWT for user authentication
- Role-based access control
- Encrypted password storage

## Data Models

Main entities include:

- User - User information
- Product - Product information
- Cart/CartItem - Shopping cart and cart items
- Order/OrderItem - Orders and order items

## License

[MIT License](LICENSE)
