# SmartQuery Context

## Purpose
`/api/smartquery` accepts a natural-language sentence, converts it to a single SQL statement, and executes it against the MySQL database. It also supports `dryRun` to return the generated SQL without executing.

## Current Behavior
- **Route**: `POST /api/smartquery`
- **Body**:
  - `query` (string, required)
  - `dryRun` (boolean, optional, default `false`)
- **Response**:
  - For SELECT-like queries: `data: { headers: [...], rows: [...] }`
  - For non-SELECT: `data: { headers: [], rows: <raw result> }`
  - On `dryRun`: returns `sql` and `params`, does not execute

## Implementation Notes
- Controller: `src/controllers/SmartQueryController.js` uses `req.body`.
- Service: `src/services/SmartQueryService.js`
  - Builds prompt with schema context from `information_schema`.
  - Uses OpenAI (`OPENAI_API_KEY`, optional `OPENAI_MODEL`).
  - Enforces single-statement SQL and JSON-only LLM output.
  - Uses `database.queryWithFields` for SELECT to capture headers.
  - Logs audit rows to `smart_query_audit`.

## Schema & Audit
- Audit DDL: `app-data/smart_query_audit.sql`
- Insert query: `app-data/queries.js` → `smartQuery.insertAudit`

## Environment
- `.env.example` includes `OPENAI_API_KEY` and `OPENAI_MODEL`.

## Known Limitations / Follow-ups
- No strict allowlist for tables/operations (full SQL allowed).
- No pagination or row limits enforced.
- No tests yet for smartQuery flow.
