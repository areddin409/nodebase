<div align="center">
  <img src="public/logos/logo.svg" alt="NodeBase Logo" width="200" height="auto" />
</div>

# 🚀 NodeBase

<div align="center">

**A modern, full-stack Next.js application with authentication, database integration, and beautiful UI components**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

</div>

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with [Better Auth](https://better-auth.com/)
- 🎨 **Modern UI** - Beautiful components built with [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://radix-ui.com/)
- 🗄️ **Database** - PostgreSQL integration with [Prisma ORM](https://prisma.io/)
- 🔄 **Type-Safe APIs** - End-to-end type safety with [tRPC](https://trpc.io/)
- 🎯 **Form Management** - Robust forms with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- 🌙 **Dark Mode** - Theme switching with [next-themes](https://github.com/pacocoursey/next-themes)
- 📱 **Responsive Design** - Mobile-first design with [Tailwind CSS](https://tailwindcss.com/)
- 🔧 **Developer Experience** - Hot reload, TypeScript, ESLint, and Prettier

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Icons**: Lucide React

### Backend

- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Validation**: Zod schemas

### Development Tools

- **Code Quality**: Biome (linting & formatting)
- **Package Manager**: npm/yarn/pnpm/bun
- **Build Tool**: Turbopack (Next.js 15)

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
│   │   ├── api/           # API routes
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable UI components
│   │   └── ui/           # shadcn/ui components
│   ├── features/         # Feature-specific components
│   │   └── auth/         # Authentication components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   │   ├── auth.ts       # Better Auth configuration
│   │   ├── db.ts         # Prisma client
│   │   └── utils.ts      # Utility functions
│   └── trpc/             # tRPC configuration and routers
├── public/               # Static assets
├── biome.json           # Biome configuration
├── components.json      # shadcn/ui configuration
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linting
- `npm run format` - Format code with Biome

## 🔧 Configuration

### Database

The project uses Prisma with PostgreSQL. Update your `DATABASE_URL` in `.env.local` to connect to your database.

### Authentication

Better Auth is configured in `src/lib/auth.ts` with email/password authentication. You can extend it with additional providers.

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
- [x] Prisma + PostgreSQL database integration
- [x] tRPC for type-safe APIs
- [x] shadcn/ui components setup
- [x] Next.js 15 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS v4 styling
- [x] React Hook Form + Zod validation
- [x] Dark mode with next-themes
- [x] Biome for linting and formatting
- [x] Basic project structure
- [x] Authentication forms (login/register)
- [x] Environment setup guide

### 🔄 Features in Codebase (Need Documentation Updates):

- [ ] Social auth providers (GitHub/Google buttons exist in register form)
- [ ] Specific tRPC routers and procedures
- [ ] Database models and relationships
- [ ] Custom hooks (use-mobile.ts)
- [ ] Specific UI components available
- [ ] Session management configuration
- [ ] Cookie security settings
- [ ] API endpoints structure

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

### 🏷️ Last Updated: October 21, 2025

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/areddin409">areddin409</a>
</div>
