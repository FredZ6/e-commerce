# E-Commerce Shop Project

This is an e-commerce shop project built with Spring Boot for the backend API and React for the frontend interface.

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

If local port `5432` is already in use, set a different host port for PostgreSQL:

```bash
POSTGRES_HOST_PORT=5433 docker compose up -d --build
```

Endpoints:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/products

Stop all services:

```bash
docker compose down
```
## Quality Checks

Run the same checks that CI executes before pushing:

```bash
cd backend/shop
./mvnw -q test

cd ../../frontend/my-shop-frontend
npm run lint
npm run test:run
npm run build
```

## CI

GitHub Actions workflow is defined at `.github/workflows/ci.yml` and runs:

- Backend: `./mvnw -q test`
- Frontend: `npm ci`, `npm run lint`, `npm run test:run`, `npm run build`

## Project Docs

- Architecture summary: `docs/architecture.md`
- Resume bullets: `docs/resume-bullets.md`
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
