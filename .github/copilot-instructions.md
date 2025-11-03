# NodeBase AI Coding Instructions

This is a modern Next.js 15 app with tRPC, Better Auth, Prisma, and event-driven architecture via Inngest. It's a workflow automation platform with a React Flow-based visual editor.

## Architecture Overview

- **Frontend**: Next.js 15 App Router with shadcn/ui components and Tailwind CSS v4
- **Backend**: tRPC for type-safe APIs with protected procedures
- **Database**: PostgreSQL with Prisma ORM (client generated to `src/generated/prisma/`)
- **Authentication**: Better Auth with email/password, configured in `src/lib/auth.ts`
- **Subscriptions**: Polar.sh integration for premium features with `premiumProcedure`
- **Background Jobs**: Inngest for event-driven processing with AI model integrations
- **Visual Editor**: React Flow for workflow node editing with custom node types
- **Code Quality**: Biome for linting/formatting (no ESLint/Prettier)
- **Monitoring**: Sentry integrated with Vercel AI SDK telemetry

## Key Patterns & Conventions

### Route Structure & Auth Guards

- **Route Groups**: `(auth)` for auth pages, `(dashboard)` for protected areas with `(rest)` and `(editor)` sub-groups
- **Auth Guards**: Use `requireAuth()` in protected pages, `requireNoAuth()` in auth pages - auto-redirects with session check
- **Page Pattern**: All protected pages call `await requireAuth()` at top, auth pages call `await requireNoAuth()`
- **Dashboard Layout**: Uses `SidebarProvider` with `AppSidebar` and `SidebarInset` structure

### Database & Auth Flow

- Prisma client in `src/lib/db.ts` with custom output `src/generated/prisma/`
- Better Auth API routes at `/api/auth/[...all]` using `toNextJsHandler(auth)`
- Auth client (`src/lib/auth-client.ts`) handles sign in/out with toast notifications
- Session management through Better Auth headers integration in tRPC middleware

### API Layer (tRPC)

- **Main Router**: `src/trpc/routers/_app.ts` exports `AppRouter` type for client
- **Protected Procedures**: Use `protectedProcedure` - auto-injects session context or throws UNAUTHORIZED
- **Inngest Integration**: API procedures trigger background jobs via `inngest.send({ name: "event/name" })`
- **Error Handling**: tRPC errors automatically handled by client with toast notifications

### UI Components & Forms

- **shadcn/ui**: Configured in `components.json` with "new-york" style, CSS variables, Lucide icons
- **Forms**: React Hook Form + Zod resolver pattern with `onSubmit` using `authClient` methods
- **CVA Patterns**: All components use class-variance-authority for variant styling
- **Toast Integration**: Sonner toasts for auth feedback (`toast.success`, `toast.error`)

### Background Processing & AI

- **Inngest Client**: App ID "my-app" in `src/inngest/client.ts`
- **AI Functions**: Multiple providers (Google, OpenAI, Anthropic) with `step.ai.wrap()` for telemetry
- **Function Registration**: Add functions to `/api/inngest/route.ts` serve array
- **Development**: Visit `/api/inngest` for Inngest dev UI

## Development Workflow

### Commands

- `npm run dev:all` - Start Next.js + Inngest via mprocs (recommended)
- `npm run dev` - Next.js only with Turbopack
- `npm run inngest:dev` - Inngest dev server only
- `npm run lint` / `npm run format` - Biome (not ESLint/Prettier)

### Database Operations

- Schema changes: Edit `prisma/schema.prisma` → `npx prisma db push`
- Prisma client auto-regenerates to `src/generated/prisma/`
- Use `npx prisma studio` for database GUI

### Adding Features

1. **New Pages**: Use appropriate route group, add auth guard, follow layout patterns
2. **API Endpoints**: Add `protectedProcedure` to `_app.ts`, integrate Inngest events if needed
3. **UI Components**: Use `npx shadcn@latest add [component]`
4. **Background Jobs**: Create function in `src/inngest/functions.ts`, register in route handler

## Integration Points

- **Sentry**: Configured in `next.config.ts`, server/edge configs with Vercel AI integration
- **Type Safety**: Full stack via Prisma → tRPC → TanStack Query
- **Session Flow**: Better Auth → tRPC middleware → protected procedures → client auth state
- **AI Telemetry**: Vercel AI SDK + Sentry + Inngest `step.ai.wrap()` pattern

## Current State

- Minimal tRPC router (workflow CRUD + AI test endpoint)
- Basic Better Auth (email/password, social UI exists but not configured)
- Dashboard shell with sidebar navigation (workflows, credentials, executions)
- Working Inngest integration with multi-provider AI functions
