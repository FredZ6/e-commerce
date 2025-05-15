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
3. Set up database connection in `application.properties`
4. Run the following commands to start the backend:
bash
cd backend/shop
./mvnw spring-boot:run


The backend will run at http://localhost:8080.

### Frontend Setup

1. Ensure Node.js is installed
2. Install dependencies and start the frontend:
bash
cd frontend/my-shop-frontend
npm install
npm run dev


The frontend application will run at http://localhost:5173.

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