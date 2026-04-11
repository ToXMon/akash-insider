# Akash Insider

A members-only platform for the Akash Network community — featuring user profiles, authentication, metrics tracking, and OpenTelemetry observability.

## Overview

Akash Insider provides an authenticated community portal where Akash Network operators, developers, and enthusiasts can create profiles, track network metrics, and connect with other community members. Built with Next.js and backed by SQLite for lightweight deployment.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/ToXMon/akash-insider.git
cd akash-insider/akash-insiders

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your JWT secret and admin credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

## Architecture

```
User → Next.js Frontend (:3000) → Auth (JWT + bcrypt)
  ↓
API Routes (/api/health, /api/metrics) → Better-SQLite3
  ↓
OpenTelemetry → Metrics Collection
```

**Core modules:**
- `akash-insiders/src/lib/auth.ts` — JWT authentication (jose + bcrypt)
- `akash-insiders/src/lib/database.ts` — SQLite database with user schema
- `akash-insiders/src/app/api/` — Health check + metrics endpoints
- `akash-insiders/instrumentation.ts` — OpenTelemetry setup

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Auth | JWT (jose) + bcrypt |
| Database | Better-SQLite3 (file-based) |
| Observability | OpenTelemetry (metrics + tracing) |
| UI | Radix UI + Tailwind CSS + Recharts |
| Forms | react-hook-form + Zod validation |

## Environment Variables

See [`akash-insiders/.env.example`](akash-insiders/.env.example) for the full list.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT
