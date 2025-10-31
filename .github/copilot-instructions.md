# NodeBase AI Coding Instructions

This is a modern Next.js 15 app with tRPC, Better Auth, Prisma, and event-driven architecture via Inngest.

## Architecture Overview

- **Frontend**: Next.js 15 App Router with shadcn/ui components and Tailwind CSS v4
- **Backend**: tRPC for type-safe APIs with protected procedures
- **Database**: PostgreSQL with Prisma ORM (client generated to `src/generated/prisma/`)
- **Authentication**: Better Auth with email/password, configured in `src/lib/auth.ts`
- **Background Jobs**: Inngest for event-driven processing with AI model integrations
- **Code Quality**: Biome for linting/formatting (no ESLint/Prettier)

## Key Patterns & Conventions

### Database & Auth

- Prisma client is in `src/lib/db.ts` with custom output path `src/generated/prisma/`
- Auth uses Better Auth with Prisma adapter, session-based authentication
- All database operations go through tRPC protected procedures in `src/trpc/routers/`

### API Layer (tRPC)

- Main router: `src/trpc/routers/_app.ts`
- Use `protectedProcedure` for authenticated endpoints (auto-throws if no session)
- Context includes auth session when using protected procedures
- Integration with Inngest for background jobs via `inngest.send()`

### UI Components

- All UI components use shadcn/ui patterns with CVA (class-variance-authority)
- Forms use React Hook Form + Zod validation consistently
- Button component example shows focus-visible ring styling pattern
- Auth forms in `src/features/auth/components/` use toast notifications

### Background Processing

- Inngest client configured in `src/inngest/client.ts` with app ID "my-app"
- Functions in `src/inngest/functions.ts` integrate multiple AI providers (Google, OpenAI, Anthropic)
- All AI functions use `step.ai.wrap()` for telemetry tracking
- Sentry logging integrated in background functions

## Development Workflow

### Commands

- `npm run dev` - Start Next.js with Turbopack
- `npm run dev:all` - Start both Next.js and Inngest dev server via mprocs
- `npm run inngest:dev` - Inngest dev server only
- `npm run lint` / `npm run format` - Biome (not ESLint/Prettier)

### Database Operations

- Schema changes: Edit `prisma/schema.prisma` then run `npx prisma db push`
- Prisma client regenerates to custom path automatically
- Use `npx prisma studio` for database GUI

### Adding Features

1. **New API endpoints**: Add to `src/trpc/routers/_app.ts` using `protectedProcedure`
2. **UI components**: Use `npx shadcn@latest add [component]`
3. **Auth flows**: Follow patterns in `src/features/auth/components/`
4. **Background jobs**: Create Inngest functions with `step.ai.wrap()` for AI operations

## File Structure Specifics

- `/src/app/(auth)/` - Auth-specific routes with shared layout
- `/src/components/ui/` - shadcn/ui components only
- `/src/features/` - Feature-specific components and logic
- `/src/trpc/` - All tRPC configuration and routers
- `/src/inngest/` - Event-driven background processing

## Integration Points

- **AI Models**: Configured in Inngest functions with telemetry via Vercel AI SDK
- **Monitoring**: Sentry integrated throughout (Next.js config and Inngest functions)
- **Session Management**: Better Auth handles sessions, integrated with tRPC middleware
- **Type Safety**: Full stack type safety from database → API → frontend via Prisma + tRPC

## Current Limitations

- Minimal tRPC router (only workflow CRUD + AI test endpoint)
- Basic auth setup (email/password only, though social auth UI exists)
- Simple database schema (User, Session, Account, Verification, Workflow models)
