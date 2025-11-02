import { inngest } from "@/inngest/client";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "../init";
import prisma from "@/lib/db";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

/**
 * Main TRPC Router
 *
 * This file defines the main API router for the application using TRPC.
 * It includes procedures for managing workflows and demonstrates integration
 * with Inngest for background job processing.
 *
 * Key Features:
 * - Type-safe API procedures
 * - Authentication protection via protectedProcedure
 * - Integration with Prisma for database operations
 * - Event-driven background processing with Inngest
 *
 * @see https://trpc.io/docs/server/routers
 */

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job Queued" };
  }),

  /**
   * Get Workflows Query
   *
   * Retrieves all workflows from the database for the authenticated user.
   * This is a protected procedure that requires user authentication.
   *
   * @returns Promise<Workflow[]> - Array of workflow objects from database
   *
   * @example
   * ```typescript
   * // Client usage:
   * const { data: workflows } = useQuery(trpc.getWorkflows.queryOptions());
   * ```
   */
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  /**
   * Create Workflow Mutation
   *
   * Creates a new workflow in the database and triggers a background job
   * to handle additional processing. This demonstrates how to:
   *
   * - Create database records with Prisma
   * - Send events to Inngest for background processing
   * - Combine synchronous and asynchronous operations
   *
   * The function sends a "test/hello.world" event to trigger the helloWorld
   * background function, which could be extended to handle workflow-specific
   * processing like notifications, integrations, or data processing.
   *
   * @returns Promise<Workflow> - The created workflow object
   *
   * @example
   * ```typescript
   * // Client usage:
   * const createMutation = useMutation(trpc.createWorkflow.mutationOptions({
   *   onSuccess: () => {
   *     // Refresh workflows list
   *     queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
   *   }
   * }));
   *
   * createMutation.mutate();
   * ```
   *
   * @throws Will throw an error if workflow creation fails
   * @throws Will throw an error if Inngest event sending fails
   */
  createWorkflow: protectedProcedure.mutation(async () => {
    // Send event to trigger background processing
    // This could include workflow setup, notifications, or integrations
    await inngest.send({
      name: "test/hello.world",
      data: { email: "test@example.com" },
    });

    // Create the workflow record in the database
    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});

/**
 * Export type definition of API
 *
 * This type export enables full type safety across the client-server boundary.
 * It's used by the TRPC client to provide autocompletion and type checking
 * for all API calls.
 *
 * @see https://trpc.io/docs/client/vanilla/infer-types
 */
export type AppRouter = typeof appRouter;
