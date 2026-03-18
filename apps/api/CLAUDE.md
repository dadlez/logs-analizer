# apps/api

Fastify backend for the Logs Analyzer. Port 3001.

## Key patterns

### buildApp factory

`src/app.ts` exports `buildApp({ db? })`. Tests pass a mock db. Production uses the real postgres.js instance from `src/db.ts`.

### Route file structure

Each route file exports:

1. A pure `buildXQuery(params)` function → returns a descriptor object (no DB calls, testable without mocking)
2. A `xRoute(fastify, db)` registration function

### DB client

`src/db.ts` exports `const db = postgres(DATABASE_URL, { max: 10 })` — named `db` throughout (not `sql`).
All route handlers receive `db` as a parameter (injected via `buildApp`).

### SQL safety

- Table/column names validated via `SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/`
- Values always parameterized via `db.unsafe(sql, params[])` with `$1, $2...` placeholders

## Test conventions (BDD)

All tests follow:

```ts
it("should [outcome] when [condition]", () => {
  // given
  // when
  // then
});
```

## Endpoints

- GET /health → { status: "ok", database: "ok"|"error" }
- GET /docs → Swagger UI
- GET /api/schema
- GET /api/logs
- GET /api/correlations
- GET /api/correlations/:id
- GET /api/analytics/modules|event-types|flows|timeline
- GET /api/history

## Env vars

DATABASE_URL (required), PORT (default 3001) — set in apps/api/.env
