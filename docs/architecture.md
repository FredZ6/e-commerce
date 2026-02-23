# Architecture Summary

## Overview

This project is a full-stack monorepo with:

- `backend/shop`: Spring Boot REST API
- `frontend/my-shop-frontend`: React SPA
- PostgreSQL as the system of record

## Backend (Spring Boot)

- **Layers**: controller -> service -> repository -> PostgreSQL
- **Auth**: JWT-based stateless auth with role checks (`USER`, `ADMIN`)
- **Core domains**: user, product, cart/cart items, order/order items
- **Business rules**:
  - inventory checks at checkout
  - stock decrement in the same transaction as order creation
  - admin-only product writes and order status updates

## Frontend (React + Vite)

- **Routing**: React Router with private route guards
- **State**: context-based auth and cart state
- **Data access**: Axios service layer targeting `/api/*`
- **Admin UI**: product management and order management workflows

## Data and Integrations

- PostgreSQL is used for persistent storage.
- Backend reads connection/JWT settings from environment variables.
- Frontend talks directly to backend API on `http://localhost:8080/api`.

## Quality and Delivery

- **Backend tests**: JUnit 5 + MockMvc + integration flows
- **Frontend tests**: Vitest + React Testing Library
- **CI**: GitHub Actions workflow (`.github/workflows/ci.yml`) runs backend tests and frontend lint/test/build
- **Local deployment**: Docker Compose orchestrates PostgreSQL, backend, and frontend containers
