import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";

/**
 * Inngest Background Functions
 *
 * Background job processing for NodeBase workflow automation with reliable execution
 * and automatic retries for workflow steps.
 *
 * Key Features:
 * - Workflow execution with topological sorting
 * - Node-by-node processing with status tracking
 * - Sentry monitoring and error handling
 *
 * Development:
 * - Use `npx inngest-cli@latest dev` for local development
 * - Visit `/api/inngest` for development UI
 * - Add new functions to `/api/inngest/route.ts` serve array
 *
 * @see {@link https://www.inngest.com/docs} Inngest Documentation
 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/} Sentry Integration
 */

/**
 * Workflow Execution Function
 *
 * Loads workflow from database and executes nodes in topological order based on connections.
 * Each node runs with proper error handling and status tracking via channels.
 *
 * @param event.data.workflowId - Workflow ID to execute
 * @returns Executed workflow context with results
 *
 * @example
 * // Trigger from tRPC:
 * await inngest.send({ name: "workflows/execute.workflow", data: { workflowId: "wf_123" } });
 */
export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO: Remove in Prod
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
    ],
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
      ...context,
    };
  }
);
