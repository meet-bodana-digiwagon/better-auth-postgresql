# AGENTS.md - Express + Prisma + Better Auth

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and Better Auth secret

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start dev server (with file watching)
npm run dev
```

## Essential Commands

```bash
npm run dev          # Start dev server with --watch
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

## Architecture

- **Express 5** with ESM modules (`"type": "module"`)
- **Prisma** ORM with PostgreSQL
- **Better Auth** for authentication (email/password + OAuth ready)
- **Role-based access control**: `customer`, `vendor`, `admin`

### Key Files

- `src/server.js` - Entry point
- `src/app.js` - Express app configuration
- `src/apps/auth/auth.js` - Better Auth configuration
- `src/apps/admin/admin-router.js` - Admin API routes
- `src/middleware/auth.js` - Authentication & authorization middleware
- `prisma/schema.prisma` - Database schema

### API Routes

- `GET /health` - Health check (public)
- `/api/auth/*` - Better Auth endpoints (rate-limited: 10 req/15min)
- `/api/admin/*` - Admin endpoints (authenticated + admin role, rate-limited: 50 req/15min)

## Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Min 32 characters
- `BETTER_AUTH_URL` - Default: `http://localhost:3000`
- `CLIENT_ORIGIN_URL` - Default: `http://localhost:5173`

## Development Notes

- CSRF check is disabled in development mode (`NODE_ENV=development`)
- Email functions are mocked (console.log only)
- No test suite currently configured
- Logging via pino with pretty printing in development
- Global rate limit: 100 requests per 15 minutes

## Code Style

- ESLint with Node.js plugin
- Prettier: 180 char width, single quotes, trailing commas
- No TypeScript - pure JavaScript with ESM imports
