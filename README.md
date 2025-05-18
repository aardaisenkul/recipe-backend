# Recipe App Backend

A RESTful API backend for a recipe application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- User authentication (register, login, profile management)
- Recipe management (CRUD operations)
- Ingredient management
- Search functionality
- JWT-based authentication
- PostgreSQL database

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd recipe-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```sql
CREATE DATABASE recipe_app;
```

4. Create a `.env` file in the root directory with the following variables:
```
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=recipe_app
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

5. Run the database migrations:
```bash
psql -U your_db_user -d recipe_app -f src/db/schema.sql
```

6. Start the development server:
```bash
npm run dev
```

7. Seed the database:
```bash
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- `POST /api/users/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- `GET /api/users/profile` - Get user profile (requires authentication)
- `PATCH /api/users/profile` - Update user profile (requires authentication)

### Recipes

- `POST /api/recipes` - Create a new recipe (requires authentication)
  - Body: `{ "title": "string", "description": "string", "instructions": "string", "cooking_time": number, "servings": number, "difficulty": "easy" | "medium" | "hard" }`

- `GET /api/recipes` - Get all recipes for the authenticated user
- `GET /api/recipes/:id` - Get a specific recipe
- `PATCH /api/recipes/:id` - Update a recipe (requires authentication)
- `DELETE /api/recipes/:id` - Delete a recipe (requires authentication)

### Ingredients

- `POST /api/recipes/:id/ingredients` - Add ingredients to a recipe (requires authentication)
  - Body: `{ "name": "string", "amount": number, "unit": "string" }`

### Search

- `GET /api/recipes/search/:query` - Search recipes by title, description, or instructions

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

HTTP Request → Route → Middleware → Controller → Model → Database
Response ← Controller ← Model 