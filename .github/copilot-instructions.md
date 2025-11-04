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

### Feature-Based Organization

- **Features**: Organized in `src/features/` with subfolders: `auth/`, `editor/`, `executions/`, `subscriptions/`, `triggers/`, `workflows/`
- **Feature Structure**: Each feature contains `components/`, `hooks/`, `server/` (for tRPC routers), and other domain-specific modules
- **Cross-Feature**: Shared components in `src/components/`, utilities in `src/lib/`, configuration in `src/config/`

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

### API Layer (tRPC) & Subscriptions

- **Main Router**: `src/trpc/routers/_app.ts` exports `AppRouter` type for client
- **Protected Procedures**: Use `protectedProcedure` - auto-injects session context or throws UNAUTHORIZED
- **Premium Procedures**: Use `premiumProcedure` - requires active Polar.sh subscription (extends `protectedProcedure`)
- **Feature Routers**: Each feature exports its own router (e.g., `workflowsRouter`) from `server/routers.ts` imported into main router
- **Inngest Integration**: API procedures trigger background jobs via `inngest.send({ name: "event/name" })`
- **Error Handling**: tRPC errors automatically handled by client with toast notifications

### React Flow Editor Architecture

- **Node Components**: Registered in `src/config/node-components.ts` with type-safe mapping to Prisma `NodeType` enum
- **Data Transform**: Server nodes/connections → React Flow format in tRPC procedures (see `workflowsRouter.getOne`)
- **Node Registration**: Add new node types to both Prisma schema and `nodeComponents` mapping
- **Editor State**: Local React state manages nodes/edges with `applyNodeChanges`/`applyEdgeChanges` hooks

### UI Components & Forms

- **shadcn/ui**: Configured in `components.json` with "new-york" style, CSS variables, Lucide icons
- **Forms**: React Hook Form + Zod resolver pattern with `onSubmit` using `authClient` methods
- **CVA Patterns**: All components use class-variance-authority for variant styling
- **Toast Integration**: Sonner toasts for auth feedback (`toast.success`, `toast.error`)

### Background Processing & AI

- **Inngest Client**: App ID "my-app" in `src/inngest/client.ts`
- **AI Functions**: Multiple providers (Google, OpenAI, Anthropic) with `step.ai.wrap()` for telemetry
- **Function Registration**: Add functions to `/api/inngest/route.ts` serve array
- **AI Telemetry**: Vercel AI SDK + Sentry integration for observability
- **Development**: Visit `/api/inngest` for Inngest dev UI

## Development Workflow

### Commands

- `npm run dev:all` - Start Next.js + Inngest via mprocs (recommended for full development)
- `npm run dev` - Next.js only with Turbopack
- `npm run inngest:dev` - Inngest dev server only
- `npm run lint` / `npm run format` - Biome (not ESLint/Prettier)

### Development Environment

- **Multi-Process**: Uses `mprocs.yaml` to run Next.js and Inngest concurrently
- **Package Manager**: Configured for Bun (see mprocs.yaml), but npm/yarn/pnpm also work
- **Hot Reload**: Turbopack for fast Next.js development with Inngest auto-reload

### Database Operations

- Schema changes: Edit `prisma/schema.prisma` → `npx prisma db push`
- Prisma client auto-regenerates to `src/generated/prisma/`
- Use `npx prisma studio` for database GUI

### Adding Features

1. **New Features**: Create folder in `src/features/` with components, hooks, server routers
2. **New Pages**: Use appropriate route group, add auth guard, follow layout patterns
3. **API Endpoints**: Add router to feature's `server/` folder, import into `_app.ts`
4. **Node Types**: Add to Prisma schema + `nodeComponents` mapping + create component
5. **UI Components**: Use `npx shadcn@latest add [component]`
6. **Background Jobs**: Create function in `src/inngest/functions.ts`, register in route handler

## Integration Points

- **Sentry**: Configured in `next.config.ts`, server/edge configs with Vercel AI integration
- **Type Safety**: Full stack via Prisma → tRPC → TanStack Query → React Flow
- **Session Flow**: Better Auth → tRPC middleware → protected procedures → client auth state
- **Subscription Flow**: Polar.sh → `premiumProcedure` → feature gating
- **Editor Flow**: Prisma nodes/connections → transform → React Flow → local state management

## Current State

- Feature-based architecture with workflows, editor, auth, subscriptions, triggers, executions
- React Flow editor with type-safe node registration system
- Premium subscription gating via Polar.sh integration
- Working Inngest integration with multi-provider AI functions and telemetry
- Dashboard shell with sidebar navigation (workflows, credentials, executions)
- Multiple AI providers integrated: Google Gemini, OpenAI, Anthropic Claude
