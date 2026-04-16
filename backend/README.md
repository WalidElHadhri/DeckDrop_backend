# DeckDrop Backend (Spring Boot)

This folder contains the backend API for DeckDrop.

## Prerequisites

- Java 17+
- PostgreSQL running locally

## Configure PostgreSQL

The app reads DB configuration from environment variables:

- `DB_URL` (default: `jdbc:postgresql://localhost:5432/deckdrop`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)

If your DB uses different values, set environment variables before running.

## Run locally (Windows cmd)

From this `backend` folder:

1. Start app in dev mode:
   - `mvnw.cmd spring-boot:run`
2. Check health endpoint:
   - `http://localhost:8080/api/health`

## Current starter endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (ADMIN only)
- `PUT /api/products/{id}` (ADMIN only)
- `DELETE /api/products/{id}` (ADMIN only)

## Authentication (JWT)

### Public auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

### Register payload

```json
{
   "email": "admin@deckdrop.local",
   "password": "StrongPass123"
}
```

> First registered user is assigned `ADMIN` role automatically; next users get `USER`.

### Login payload

```json
{
   "email": "admin@deckdrop.local",
   "password": "StrongPass123"
}
```

### Use token

Set header:

- `Authorization: Bearer <token>`

for protected write endpoints.

## Security configuration notes

- API is stateless (`SessionCreationPolicy.STATELESS`)
- Passwords are hashed with BCrypt
- Default HTTP basic and form login are disabled
- Generic server errors are not exposed in responses

## Database migrations

Flyway migration scripts are under `src/main/resources/db/migration`.
