# Your API  that emphasize JWT authentication

## Description
A production-ready REST API with JWT authentication and role-based authorization.

## Features
- JWT-based authentication
- Role-based authorization (User, Admin)
- CRUD operations for Products, Orders, Users
- Search, filtering, and pagination
- Comprehensive error handling
- Unit tests

## Tech Stack
- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd your-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
PORT=3000
```

4. Run migrations
```bash
npm run migrate
```

5. Start the server
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Protected)
- `PUT /api/products/:id` - Update product (Protected, Owner/Admin)
- `DELETE /api/products/:id` - Delete product (Protected, Owner/Admin)

## Authentication
Include JWT token in request headers:
```
Authorization: Bearer <your-token>
```

## User Roles
- **User**: Can create/read/update/delete their own resources
- **Admin**: Full access to all resources

## Testing
```bash
npm test
```

## Deployment
Deployed on Render: https://img.shields.io/badge/PostgreSQL-13%2B-blue

## License
MIT
