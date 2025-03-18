# SanctusExpeditus Backend

A logistics API to manage package shipping from Medellin to cities across Colombia.

## Overview

SanctusExpeditus is a RESTful API built with Node.js, Express, TypeScript, MySQL, and Redis for handling logistics operations. The system provides endpoints for managing shipments, tracking packages, and user authentication.

## Features

- User authentication and authorization (register, login) with JWT
- Package shipment management
- Delivery route optimization and tracking
- Order status tracking and history
- Geocoding integration with OpenStreetMap's Nominatim API

## Technologies

- Node.js & Express
- TypeScript
- MySQL (with connection pooling)
- Redis for caching
- JWT Authentication
- Swagger for API documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL server
- Redis server
- npm or yarn

## Instructions for Accessing Shared Resources

A Google Drive folder has been created to share key project files, including:

logistics_backup.sql – The MySQL database backup.
SanctusExpeditus.postman_collection.json – The Postman collection for API testing.
You will receive an email invitation to collaborate on this folder. Please check your inbox and ensure you have access.

Additionally, a separate invitation will be sent directly via Postman, allowing you to collaborate on the API collection within Postman itself. This will enable seamless API testing and team coordination.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/SanctusExpeditusBackend.git
   cd SanctusExpeditusBackend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=logistics

   PORT=3000

   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=48h
   ```

4. Set up MySQL database:

   - Ensure your MySQL server is running
   - Create a database named `logistics`
   - The application will connect to the database with the credentials from your `.env` file

5. Set up Redis:
   - Ensure Redis server is running on localhost:6379
   - The application uses Redis for caching and performance optimization

## Running the Application

### Development mode

```bash
npm run dev
```

### Development mode with auto-reload

```bash
npm run dev:watch
```

### Build for production

```bash
npm run build
```

### Run production build

```bash
npm start
```

### Run tests

```bash
npm test
```

## API Documentation

The API documentation is available via Swagger UI at:

```
http://localhost:3000/api-docs
```

The API provides the following main endpoints:

- **Authentication**

  - POST /api/auth/register - Register a new user
  - POST /api/auth/login - Login a user

- **Users**

  - GET /api/users - Get all users
  - GET /api/users/:id - Get user by ID
  - GET /api/users/email - Get user by email
  - POST /api/users - Create a user
  - PUT /api/users/:id - Update a user
  - DELETE /api/users/:id - Delete a user

- **Orders**

  - GET /api/orders - Get all orders
  - GET /api/orders/user/:id - Get orders by user ID
  - GET /api/orders/email - Get orders by user email
  - POST /api/orders - Create a new order
  - PUT /api/orders/:id/status - Update order status
  - PUT /api/orders/:id/route - Update order route
  - GET /api/orders/:id/history - Get order status history

- **Routes**
  - GET /api/routes - Get all routes
  - PUT /api/routes/:id/status - Update route status
  - PUT /api/routes/:id/current-stop - Update route's current stop

### Authentication

API requests to protected endpoints must include a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is obtained after successful login or registration.

### API Response Format

All API responses follow a standard format:

**Success Response:**

```json
{
  "status": 200,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "status": 400,
  "error": "Error message",
  "details": { ... } // Optional additional error details
}
```

## Project Structure

```
src/
├── app/
│   ├── core/             # Core modules, constants, and middleware
│   ├── features/         # Feature modules (auth, users, orders, routes)
│   └── utils/            # Utility functions
├── config/               # Configuration files (MySQL, Redis, Swagger)
├── docs/                 # Swagger documentation
├── tests/                # Test files
└── server.ts             # Application entry point
```

## Database Configuration

The MySQL database connection is configured in `src/config/mySql.ts` using a connection pool for better performance. The configuration is loaded from environment variables.

## Redis Configuration

Redis is used for caching and is configured in `src/config/redisClient.ts`. The default connection is to localhost:6379.

## License

MIT

## Development Environment

### TypeScript Configuration

The project uses TypeScript for type safety. The TypeScript configuration is specified in `tsconfig.json`.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:

   - Check that MySQL server is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Redis Connection Issues**:

   - Check that Redis server is running on port 6379
   - If using a different port, update it in `src/config/redisClient.ts`

3. **JWT Token Invalid**:
   - Ensure you're using the correct token obtained from login/register
   - Check that token hasn't expired (default is 48h)

### Getting Help

If you encounter any issues or have questions, please [create an issue](https://github.com/crishood/SanctusExpeditusBackend/issues) on GitHub.
