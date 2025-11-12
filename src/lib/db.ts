/**
 * Prisma Database Client
 *
 * Singleton Prisma client instance with hot-reload support for development.
 * Prevents multiple instances during Next.js hot module replacement.
 *
 * Database Schema: PostgreSQL with custom output directory (src/generated/prisma/)
 *
 * @see {@link https://www.prisma.io/docs} Prisma Documentation
 */

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Reuse client in development to prevent exhausting database connections
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
