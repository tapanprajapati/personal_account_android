# Repository Guidelines

## Project Structure & Module Organization
- `index.js` starts the Express server.
- `config/` holds server setup and database connection (`server.js`, `database.js`, `databaseFactory.js`).
- `src/routes/` defines API routes for users, groups, categories, entries, summaries, recurring, and smart queries.
- `src/controllers/` contains request/response handlers.
- `src/services/` contains business logic and database calls.
- `src/helper/validate/` contains request validation schemas.
- `app-data/` contains SQL query strings and DB config.
- SmartQuery context: `docs/smartQuery-context.md`.

## Build, Test, and Development Commands
- `npm start`: Run the API server.
- `npm run start-env`: Run with `.env` loaded via `dotenv`.
- `npm test`: Currently placeholder (exits with error).

## Coding Style & Naming Conventions
- Use 2-space indentation and CommonJS `require`/`module.exports`.
- Files use `PascalCase.js` for controllers/services (e.g., `SmartQueryService.js`), and `camelCase.js` for routes and helpers (e.g., `smartQueryRoute.js`).
- Keep route handlers thin; put SQL and logic in services.
- Prefer parameterized SQL with `mysql.format` to avoid injection.

## Testing Guidelines
- No test framework is configured yet. If adding tests, choose a Node.js framework (e.g., Jest) and document how to run them.
- Test file naming suggestion: `*.test.js` under a new `tests/` folder.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative, sentence-case summaries (e.g., “Clean up server”, “Fix start date compare”).
- Follow that style; keep messages under 72 characters when possible.
- PRs should include: a concise description, linked issue (if any), and notes about DB or API changes. Add example requests/responses for API changes.

## Security & Configuration Tips
- Store secrets in `.env` (see `.env.example`). Do not commit real keys.
- Database credentials and `OPENAI_API_KEY` must be set in the environment.
- Apply DB schema updates manually when adding new tables (see `app-data/`).
