import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";

/**
 * Main tRPC API Router
 *
 * This file defines the primary API router for the NodeBase application using tRPC.
 * It provides type-safe API endpoints with authentication and subscription protection.
 *
 * Key Features:

 *
 * Procedure Types:
 * - protectedProcedure: Requires user authentication
 * - premiumProcedure: Requires active subscription (extends protectedProcedure)
 *
 * @see {@link https://trpc.io/docs/server/routers} tRPC Router Documentation
 */

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});

/**
 * Type Export for Client-Side Type Safety
 *
 * This type export enables full type safety across the client-server boundary.
 * The AppRouter type is used by the tRPC client to provide:
 * - Autocompletion for all available procedures
 * - Type checking for procedure inputs and outputs
 * - IntelliSense support in IDEs
 * - Runtime type validation
 *
 * Usage:
 * - Imported in tRPC client setup
 * - Used for type inference in React Query hooks
 * - Enables end-to-end type safety from database to UI
 *
 * @see {@link https://trpc.io/docs/client/vanilla/infer-types} tRPC Type Inference
 */
export type AppRouter = typeof appRouter;
