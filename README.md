# E-Commerce Shop Project

![CI](https://github.com/FredZ6/e-commerce/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/FredZ6/e-commerce/actions/workflows/e2e.yml/badge.svg)

This is an e-commerce shop project built with Spring Boot for the backend API and React for the frontend interface.

## Live Demo

- Frontend: `TBD`
- Backend API: `TBD`
- Demo user: `TBD`

Note: after deploying this repository to cloud, update these links and credentials.

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

- Frontend (Vitest): lines/functions/statements >= 30%, branches >= 20%
- Backend (JaCoCo): line >= 35%, branch >= 20%

Critical E2E workflow is defined at `.github/workflows/e2e.yml` and runs:

- Dockerized stack startup
- Playwright critical flow: register -> login -> add to cart -> place order

## Manual Cloud Deployment (Cost-safe)

This repository includes manual-only deployment workflows so cloud resources are never created on push/PR.

- Deploy workflow: `.github/workflows/manual-demo-deploy.yml`
- Destroy workflow: `.github/workflows/manual-demo-destroy.yml`
- Remote scripts: `scripts/cloud/deploy_demo_remote.sh`, `scripts/cloud/destroy_demo_remote.sh`
- Deploy env template: `.env.deploy.example`
- Full runbook: `docs/manual-cloud-deploy.md`

You deploy only when needed for demos by running `workflow_dispatch` and entering confirm phrases.
After demo, run the destroy workflow to stop cost immediately.

## Project Docs

- Architecture summary: `docs/architecture.md`
- Resume bullets: `docs/resume-bullets.md`
- Manual cloud deploy runbook: `docs/manual-cloud-deploy.md`
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
