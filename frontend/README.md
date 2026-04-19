# DeckDrop Frontend

Initial React frontend for DeckDrop backend integration.

## Features included

- Register (`/api/auth/register`)
- Login (`/api/auth/login`)
- JWT token persistence in local storage
- Public product listing (`GET /api/products`)
- Admin-only create product (`POST /api/products`)
- Clear success/error feedback for API calls

## Setup

1. Copy env file:
	- `.env.example` -> `.env`
2. Ensure backend is running on your configured URL.

Default:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- First registered backend user becomes `ADMIN` (as implemented server-side).
- Product creation button is enabled only when logged in as `ADMIN`.
