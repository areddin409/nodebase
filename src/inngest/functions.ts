import { channel } from "@inngest/realtime";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";

/**
 * Inngest Background Functions
 *
 * This module contains all Inngest functions for background processing in the NodeBase
 * workflow automation platform. Functions handle asynchronous tasks like workflow
 * execution, node processing, and other background operations.
 *
 * Key Dependencies:
 * - NonRetriableError: Used for validation errors that shouldn't be retried
 * - Prisma Client: Database access for workflow and node operations
 * - Inngest Client: Background job processing and step management
 *
 * Development Notes:
 * - Use `npx inngest-cli@latest dev` to start the Inngest dev server
 * - Visit `/api/inngest` for the Inngest development UI
 * - All functions are automatically instrumented with Sentry for monitoring
 * - Functions support retries, delays, and complex multi-step workflows
 * - Use step functions for reliable execution and state management
 * - Use NonRetriableError for validation failures to prevent infinite retries
 *
 * @see https://www.inngest.com/docs - Inngest documentation
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/ - Sentry documentation
 */

/**
 * Function Registration Guide
 *
 * To register new Inngest functions:
 * 1. Create the function using inngest.createFunction() with a unique ID
 * 2. Export it from this module
 * 3. Add it to the serve array in /api/inngest/route.ts
 * 4. Update this documentation to describe the new function
 *
 * @example
 * // In this file:
 * export const myWorkflowFunction = inngest.createFunction(
 *   { id: "my-workflow-function" },
 *   { event: "workflows/my.event" },
 *   async ({ event, step }) => {
 *     await step.run("process-step", async () => {
 *       // Function logic here
 *       return { success: true };
 *     });
 *   }
 * );
 *
 * // In /api/inngest/route.ts:
 * import { executeWorkflow, myWorkflowFunction } from "@/inngest/functions";
 *
 * export const { GET, POST, PUT } = serve({
 *   client: inngest,
 *   functions: [executeWorkflow, myWorkflowFunction], // Add here
 * });
 */

/**
 * Execute Workflow Function
 *
 * This function handles the background execution of user workflows. It loads the workflow
 * and its associated nodes/connections from the database and prepares them for execution.
 *
 * Current Implementation:
 * - Validates workflowId is provided in event data
 * - Loads workflow with nodes and connections from database
 * - Uses NonRetriableError for validation failures to prevent infinite retries
 * - Returns workflow nodes for further processing
 *
 * Future Extensions:
 * - Node-by-node execution processing based on connections
 * - State management between workflow steps
 * - Result persistence and execution status tracking
 * - Support for different node types and their specific execution logic
 *
 * @event workflows/execute.workflow - Triggered when a workflow execution is requested
 * @param event.data.workflowId - The ID of the workflow to execute (required)
 * @returns Promise that resolves with workflow nodes and execution metadata
 * @throws NonRetriableError when workflowId is missing or workflow not found
 *
 * @example
 * // Trigger this function from the workflows tRPC router:
 * await inngest.send({
 *   name: "workflows/execute.workflow",
 *   data: { workflowId: workflow.id }
 * });
 *
 * @todo Implement node execution logic based on node types
 * @todo Add connection-based execution flow
 * @todo Add execution result persistence
 * @todo Add progress tracking and status updates
 */
export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO: Remove in Prod
  },
  {
    event: "workflows/execute.workflow",
    channels: [httpRequestChannel(), manualTriggerChannel()],
  },

  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("No workflowId provided in event data");
    }

    await step.run("save-workflow", async () => {});

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    //Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    //execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
