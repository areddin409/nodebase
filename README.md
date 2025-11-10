<div align="center">
  <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <img src="public/logos/logo.svg" alt="NodeBase Logo" width="60" height="auto" />
    <h1 style="margin: 0; font-size: 3em;">NodeBase</h1>
  </div>
  
  **A modern workflow automation platform with visual node editor that executes workflows as background jobs, built on Next.js 15 with tRPC, Better Auth, Prisma, and event-driven architecture**

  <br/>

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

</div>

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with [Better Auth](https://better-auth.com/)
- 💎 **Premium Subscriptions** - Integrated billing and subscription management with [Polar.sh](https://polar.sh/)
- 🎨 **Modern UI** - Beautiful components built with [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://radix-ui.com/)
- 🗄️ **Database** - PostgreSQL integration with [Prisma ORM](https://prisma.io/)
- 🔄 **Type-Safe APIs** - End-to-end type safety with [tRPC](https://trpc.io/)
- ⚡ **Background Jobs** - Event-driven processing with [Inngest](https://inngest.com/)
- 🤖 **AI Integration** - Multiple AI providers (Google, OpenAI, Anthropic) with telemetry
- 🎯 **Visual Editor** - React Flow-based workflow editor with custom node types and execution engine
- 🔄 **Node Execution** - Type-safe executor pattern with background job processing via Inngest
- 🔗 **Variable Passing** - WorkflowContext system for data flow between workflow nodes
- 🎯 **Form Management** - Robust forms with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- 🌙 **Dark Mode** - Theme switching with [next-themes](https://github.com/pacocoursey/next-themes)
- 📱 **Responsive Design** - Mobile-first design with [Tailwind CSS](https://tailwindcss.com/)
- 🔧 **Developer Experience** - Hot reload, TypeScript, and Biome for code quality

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Visual Editor**: React Flow for workflow automation with node execution engine
- **Node Execution**: Type-safe executor pattern with WorkflowContext variable passing
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Icons**: Lucide React

### Backend

- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with Polar.sh subscriptions
- **Background Jobs**: Inngest for event-driven workflow execution and processing
- **Node Architecture**: Dual implementation pattern (React components + executor functions)
- **AI Integration**: Google Gemini, OpenAI, Anthropic Claude
- **Monitoring**: Sentry with Vercel AI SDK telemetry
- **Validation**: Zod schemas

### Development Tools

- **Code Quality**: Biome (linting & formatting)
- **Package Manager**: npm/yarn/pnpm/bun
- **Build Tool**: Turbopack (Next.js 15)

## 🏗️ Architecture Overview

NodeBase follows a **feature-based architecture** with a sophisticated node execution system:

- **Visual Editor**: React Flow-based interface for creating workflows with drag-and-drop nodes
- **Dual Node Pattern**: Each node type has both a React component (editor) and executor function (runtime)
- **Type-Safe Execution**: `NodeExecutor<TData>` interface ensures type safety from editor to execution
- **Background Processing**: Inngest executes workflows as background jobs with step-by-step reliability
- **Variable Flow**: `WorkflowContext` system passes data between nodes during execution
- **Subscription Gating**: Premium features protected via Polar.sh integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/areddin409/nodebase.git
   cd nodebase
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/nodebase"

   # Auth
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # AI Providers (Optional)
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"
   OPENAI_API_KEY="your-openai-key"
   ANTHROPIC_API_KEY="your-anthropic-key"

   # Polar.sh Subscriptions (Optional)
   POLAR_ACCESS_TOKEN="your-polar-access-token"

   # Inngest (Optional - for production)
   INNGEST_EVENT_KEY="your-inngest-event-key"
   INNGEST_SIGNING_KEY="your-inngest-signing-key"

   # Optional: Production settings
   NODE_ENV="development"
   COOKIE_DOMAIN="localhost"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # Optional: Seed the database
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) to see your application running!

## 📁 Project Structure

```
nodebase/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   │   ├── (editor)/  # Visual editor routes
│   │   │   └── (rest)/    # Other dashboard pages
│   │   ├── api/           # API routes (auth, tRPC, Inngest)
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable UI components
│   │   └── ui/           # shadcn/ui components
│   ├── config/           # Configuration files
│   │   ├── constants.ts  # App constants
│   │   └── node-components.ts # React Flow node registry
   ├── features/         # Feature-based organization
   │   ├── auth/         # Authentication features
   │   ├── editor/       # Visual workflow editor
   │   ├── executions/   # Workflow execution engine & node executors
   │   ├── subscriptions/# Premium subscription management
   │   ├── triggers/     # Workflow triggers (manual, scheduled, etc.)
   │   └── workflows/    # Workflow CRUD operations
│   ├── generated/        # Auto-generated files
│   │   └── prisma/       # Prisma client
│   ├── hooks/            # Custom React hooks
│   ├── inngest/          # Background job functions
│   │   ├── client.ts     # Inngest client setup
│   │   └── functions.ts  # Background job definitions
│   ├── lib/              # Utility functions and configurations
│   │   ├── auth.ts       # Better Auth configuration
│   │   ├── auth-client.ts# Client-side auth utilities
│   │   ├── auth-utils.ts # Auth guards and helpers
│   │   ├── db.ts         # Prisma client
│   │   ├── polar.ts      # Polar.sh subscription client
│   │   └── utils.ts      # General utilities
│   └── trpc/             # tRPC configuration and routers
├── public/               # Static assets
├── biome.json           # Biome configuration
├── components.json      # shadcn/ui configuration
├── mprocs.yaml          # Multi-process development setup
├── next.config.ts       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## 📝 Available Scripts

- `npm run dev:all` - Start development server with Next.js + Inngest (recommended)
- `npm run dev` - Start Next.js development server with Turbopack only
- `npm run inngest:dev` - Start Inngest development server only
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linting
- `npm run format` - Format code with Biome

## 🔧 Configuration

### Database

The project uses Prisma with PostgreSQL. Update your `DATABASE_URL` in `.env.local` to connect to your database.

### Authentication & Subscriptions

Better Auth is configured in `src/lib/auth.ts` with email/password authentication and Polar.sh integration for premium subscriptions. You can extend it with additional providers.

### Background Jobs

Inngest handles event-driven background processing. Visit `/api/inngest` during development to access the Inngest dev UI.

### Workflow Node Development

Adding new node types requires a dual implementation:

1. **React Component** (`src/features/[domain]/components/[node-name]/node.tsx`)
2. **Executor Function** (`src/features/executions/components/[node-name]/executor.ts`)
3. **Registry Updates** (both `nodeComponents` and `executorRegistry`)
4. **Prisma Schema** (add to `NodeType` enum)

Example node types: `HTTP_REQUEST`, `MANUAL_TRIGGER`, `INITIAL`

### AI Integration

Multiple AI providers are configured with telemetry via Sentry. Add your API keys to `.env.local`:

- `GOOGLE_GENERATIVE_AI_API_KEY` for Google Gemini
- `OPENAI_API_KEY` for OpenAI models
- `ANTHROPIC_API_KEY` for Anthropic Claude

### UI Components

The project uses shadcn/ui components. Add new components with:

```bash
npx shadcn@latest add [component-name]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Better Auth](https://better-auth.com/) - Modern authentication for TypeScript
- [Prisma](https://prisma.io/) - Next-generation ORM for TypeScript & JavaScript
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs

---

## 📋 README Documentation Status

<!--
This section tracks what features are documented in this README vs what exists in the codebase.
Update this when adding new features to help maintain accurate documentation.
-->

### ✅ Currently Documented Features:

- [x] Better Auth authentication (email/password)
- [x] Polar.sh premium subscription integration
- [x] Prisma + PostgreSQL database integration
- [x] tRPC for type-safe APIs with protected/premium procedures
- [x] shadcn/ui components setup
- [x] Next.js 15 with App Router and route groups
- [x] TypeScript configuration
- [x] Tailwind CSS v4 styling
- [x] React Hook Form + Zod validation
- [x] Dark mode with next-themes
- [x] Biome for linting and formatting
- [x] Feature-based project structure
- [x] Authentication forms (login/register)
- [x] Environment setup guide
- [x] React Flow visual editor integration
- [x] Inngest background job processing
- [x] Multi-AI provider integration (Google, OpenAI, Anthropic)
- [x] Sentry monitoring with AI telemetry
- [x] Multi-process development setup (mprocs)
- [x] Node execution architecture (dual implementation pattern)
- [x] WorkflowContext variable passing system
- [x] NodeExecutor<TData> type-safe interface

### 🔄 Features in Codebase (Need Documentation Updates):

- [ ] HTTP Request node implementation details
- [ ] Manual Trigger node implementation details
- [ ] Workflow execution flow and error handling
- [ ] Trigger system implementation details
- [ ] Database schema relationships and models
- [ ] Custom hooks documentation (use-mobile.ts, etc.)
- [ ] Specific tRPC procedures and their usage
- [ ] Auth guard implementation details
- [ ] Premium subscription flow and gating logic
- [ ] Inngest step functions and error handling
- [ ] Node status indicators and real-time updates

### 📝 Future Documentation TODOs:

- [ ] Add screenshots/demo section
- [ ] API documentation
- [ ] Deployment guides (Vercel, Docker, etc.)
- [ ] Testing setup and guidelines
- [ ] Performance optimizations
- [ ] Security best practices
- [ ] Troubleshooting section
- [ ] Component documentation
- [ ] Database schema visualization

### 🏷️ Last Updated: November 10, 2025

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/areddin409">areddin409</a>
</div>
