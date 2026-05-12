# Copilot Instructions for Portfolio Website Backend

## Architecture Overview

This is a **Cloudflare Workers** backend for a portfolio website contact form. The codebase uses a **layered handler pattern** organized as:

- **Routes** (`src/routes/`) → **Handlers** (`src/handlers/`) → **Services** (`src/services/`) → **Repositories** (`src/repositories/`)
- Routes call handlers, handlers invoke services, services coordinate business logic and persistence
- Middleware (CORS, logging) wraps responses and requests
- Schemas validate input at the handler boundary

Key files: [src/handlers/contact.handler.ts](src/handlers/contact.handler.ts), [src/services/contact.service.ts](src/services/contact.service.ts), [src/repositories/message.repository.ts](src/repositories/message.repository.ts)

## Critical Developer Workflows

### Running & Testing

- `npm run dev` - Start local Cloudflare Workers dev server (port 8787)
- `npm run test` - Run Vitest suite with Cloudflare pool
- `npm run typecheck` - Verify TypeScript without emitting
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Regenerate `Env` types after adding bindings to `wrangler.jsonc`

**Important:** After modifying `wrangler.jsonc` (adding KV namespaces, databases, secrets), regenerate types with `cf-typegen` to update the `Env` interface. Add `worker-configuration.d.ts` to git.

### Testing Framework

- Uses **Vitest** with `@cloudflare/vitest-pool-workers` for Worker-specific testing
- Import test utilities from `cloudflare:test` (see [test/index.spec.ts](test/index.spec.ts))
- Tests should use `IncomingRequest` type and `createExecutionContext()` for proper Worker simulation

## Project-Specific Patterns

### Error Handling

- All async functions throw errors; handlers catch and convert to JSON responses
- Use `errorResponse()` from [src/utils/response.ts](src/utils/response.ts) to standardize error payloads
- Error messages appear in JSON: `{ error: "message" }` with 400 status

### Input Validation

- Schemas validate at handler boundary before passing to services
- Example: [src/schemas/contact.schema.ts](src/schemas/contact.schema.ts) validates `ContactInput`
- Validation throws; handler catches and returns 400

### Response Utilities

- `jsonResponse(data, status)` - Creates JSON response with proper headers
- `parseJson(request)` - Safely parses request body, throws on invalid JSON
- `errorResponse(error)` - Standardizes error responses

### CORS Middleware

- `applyCors()` in [src/middleware/cors.middleware.ts](src/middleware/cors.middleware.ts) adds standard headers
- Currently allows all origins (`*`), methods (`GET, POST, OPTIONS`), headers (`Content-Type`)

## Adding New Features

When adding endpoints:

1. Create `src/schemas/{feature}.schema.ts` with validation logic
2. Create `src/services/{feature}.service.ts` with business rules
3. Create `src/handlers/{feature}.handler.ts` to orchestrate (validate → service → response)
4. Create `src/routes/{feature}.route.ts` as thin router wrapper
5. Update main router in `src/index.ts`
6. Add tests in `test/{feature}.test.ts`

## Configuration & Bindings

- Wrangler configuration: [wrangler.jsonc](wrangler.jsonc)
- Environment variables in `vars` object (non-sensitive)
- Secrets via `wrangler secret put` (for sensitive data)
- Bindings (KV, D1, R2, etc.) added to `wrangler.jsonc` require `npm run cf-typegen`
- Repository placeholder shows pattern for persistence: currently logs only, ready for D1/KV/email integration

## TypeScript Configuration

- Strict mode enabled in [tsconfig.json](tsconfig.json)
- `Env` type auto-generated from `wrangler.jsonc` bindings
- Path aliases NOT configured; use relative imports

## Integration Notes

- Contact handler validates, stores messages via repository, returns 201 on success
- Service enforces business rule: message must be ≥10 characters
- No external API calls currently; repository is persistence layer (email/database integration point)
- CORS headers applied to all responses
