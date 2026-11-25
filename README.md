# RailCore Backend

Railway reservation & operations API — Node.js, Express 5, TypeScript, PostgreSQL (Sequelize), Docker.

Current scope: **Module 1 – Authentication (register + login)**.

## Run with Docker (API + PostgreSQL)

```sh
cp .env.example .env        # then set a real JWT_SECRET
docker compose up -d --build
curl http://localhost:5001/health
```

## Run the API locally (DB in Docker)

```sh
npm install
docker compose up -d db
npm run dev
```

## Endpoints

| Method | Path                    | Body                                                              |
| ------ | ----------------------- | ----------------------------------------------------------------- |
| GET    | `/health`               | –                                                                 |
| POST   | `/api/v1/auth/register` | `firstName`, `email`, `password`, optional `lastName`, `phoneNumber` |
| POST   | `/api/v1/auth/login`    | `email`, `password` → returns `accessToken` (Bearer JWT)          |

Rules:
- Password: 8–72 chars, at least one uppercase, one lowercase, one digit.
- Emails are stored lowercase and are unique (`409` on duplicate).
- Public registration always creates a `PASSENGER`; staff roles (`SUPER_ADMIN`, `ADMIN`,
  `OPERATIONS_MANAGER`, `STATION_MANAGER`, `CONDUCTOR`, `SUPPORT_AGENT`, `FINANCE_OFFICER`) are assigned by admins.
- Protect a route with `AuthMiddleware.auth` (`src/auth/jwt.ts`); the decoded token is on `req.user`.

## Project structure

```
settings/orm/sequelize.ts   DB connection + startup sync
src/index.ts                app bootstrap
src/routes/v1/              route definitions
src/dto/                    request validation (class-validator)
src/services/               request handlers / business logic
src/repositories/           data access
src/models/                 Sequelize models
src/middlewares/            response helpers + central error handler
```

> Tables are created with `sequelize.sync()` on startup. Move to migrations before production data exists.
