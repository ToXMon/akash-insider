# Akash Insider — Agent Documentation

## Repo Purpose
Members-only community platform for Akash Network. Features user profiles (with roles, company, location), JWT authentication, SQLite database, health/metrics API endpoints, and OpenTelemetry observability. Deployed as a Docker container.

## Tech Stack
- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Auth**: JWT via jose library + bcrypt password hashing
- **Database**: Better-SQLite3 (file-based, no external DB needed)
- **Observability**: OpenTelemetry (metrics + tracing via @opentelemetry/sdk-node)
- **UI**: Radix UI primitives + Tailwind CSS + Recharts (charts)
- **Forms**: react-hook-form + Zod validation
- **Notifications**: Sonner (toast)

## Module Map

| Directory | Purpose |
|-----------|---------|
| `akash-insiders/src/app/` | Pages — home page, API routes (health, metrics) |
| `akash-insiders/src/lib/auth.ts` | JWT auth — token creation, verification, bcrypt hashing |
| `akash-insiders/src/lib/database.ts` | SQLite setup — schema creation, user table |
| `akash-insiders/instrumentation.ts` | OpenTelemetry setup — metrics exporter, tracing |
| `akash-insiders/Dockerfile` | Production Docker build |

## Global Standards
- TypeScript strict mode
- JWT-based auth with bcrypt password hashing
- SQLite for lightweight file-based storage (no external DB dependency)
- OpenTelemetry for observability (metrics + tracing)
- Radix UI primitives for accessible components

## Environment Setup
Env vars in `.env.example`. Key groups:
- **Auth**: JWT_SECRET (required), ADMIN_EMAIL + ADMIN_PASSWORD (initial admin)
- **App**: NODE_ENV
- **Telemetry**: OTEL_METRICS_ENABLED, NEXT_TELEMETRY_DEBUG

## Key Patterns

### Auth Flow
Admin login → bcrypt verify → JWT signed (jose, HS256, 7-day expiry) → token stored client-side → verified on API requests.

### Database Pattern
`database.ts` creates a shared Better-SQLite3 instance with WAL mode. Schema auto-creates on first run. User table includes roles, company, location, bio, social links.

### OpenTelemetry
`instrumentation.ts` sets up OTel SDK with auto-instrumentations for Node.js. Metrics exported via OTLP HTTP. Enabled/disabled via OTEL_METRICS_ENABLED env var.
