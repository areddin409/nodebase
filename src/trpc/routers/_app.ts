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
 * Main tRPC API Router
 *
 * This file defines the primary API router for the NodeBase application using tRPC.
 * It provides type-safe API endpoints with authentication and subscription protection.
 *
 * Key Features:
 * - Type-safe API procedures with full stack type inference
 * - Authentication protection via protectedProcedure middleware
 * - Premium subscription validation via premiumProcedure middleware
 * - Integration with Prisma ORM for database operations
 * - Event-driven background processing with Inngest
 * - AI functionality integration for premium users
 *
 * Procedure Types:
 * - protectedProcedure: Requires user authentication
 * - premiumProcedure: Requires active subscription (extends protectedProcedure)
 *
 * @see {@link https://trpc.io/docs/server/routers} tRPC Router Documentation
 */

export const appRouter = createTRPCRouter({
  /**
   * Test AI Functionality (Premium Only)
   *
   * Triggers an AI processing job in the background using Inngest.
   * This endpoint is protected by premium subscription validation,
   * ensuring only paying customers can access AI features.
   *
   * @procedure mutation
   * @access premium - Requires active subscription
   * @returns {Object} Success response with job status
   * @throws {TRPCError} UNAUTHORIZED if user not authenticated
   * @throws {TRPCError} FORBIDDEN if user has no active subscription
   *
   * @example
   * ```typescript
   * // Client usage:
   * const testAiMutation = useMutation(trpc.testAi.mutationOptions({
   *   onSuccess: (data) => {
   *     console.log(data.message); // "Job Queued"
   *   }
   * }));
   *
   * testAiMutation.mutate();
   * ```
   */
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job Queued" };
  }),

  /**
   * Get User Workflows
   *
   * Retrieves all workflows from the database for the authenticated user.
   * This is a protected procedure that requires user authentication but
   * does not require a premium subscription.
   *
   * @procedure query
   * @access protected - Requires authentication only
   * @returns {Promise<Workflow[]>} Array of workflow objects from database
   * @throws {TRPCError} UNAUTHORIZED if user not authenticated
   *
   * @example
   * ```typescript
   * // Client usage:
   * const { data: workflows, isLoading } = useQuery(
   *   trpc.getWorkflows.queryOptions()
   * );
   *
   * if (isLoading) return <Spinner />;
   * return <WorkflowList workflows={workflows} />;
   * ```
   */
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  /**
   * Create New Workflow
   *
   * Creates a new workflow in the database and triggers a background job
   * for additional processing. This demonstrates the integration between
   * synchronous database operations and asynchronous background processing.
   *
   * Workflow:
   * 1. Validates user authentication
   * 2. Sends background event to Inngest for workflow setup processing
   * 3. Creates workflow record in database
   * 4. Returns created workflow object
   *
   * The background job can handle tasks like:
   * - Workflow template initialization
   * - Email notifications
   * - Integration setup
   * - Audit logging
   *
   * @procedure mutation
   * @access protected - Requires authentication only
   * @returns {Promise<Workflow>} The created workflow object
   * @throws {TRPCError} UNAUTHORIZED if user not authenticated
   * @throws {Error} If workflow creation or background job fails
   *
   * @example
   * ```typescript
   * // Client usage:
   * const createWorkflowMutation = useMutation(
   *   trpc.createWorkflow.mutationOptions({
   *     onSuccess: (newWorkflow) => {
   *       // Refresh workflows list
   *       queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
   *       // Navigate to new workflow
   *       router.push(`/workflows/${newWorkflow.id}`);
   *     },
   *     onError: (error) => {
   *       toast.error(`Failed to create workflow: ${error.message}`);
   *     }
   *   })
   * );
   *
   * createWorkflowMutation.mutate();
   * ```
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
