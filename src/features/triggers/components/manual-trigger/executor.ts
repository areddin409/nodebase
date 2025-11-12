/**
 * Manual Trigger Node Executor
 *
 * Pass-through executor for manually triggered workflows and initial nodes.
 * Returns workflow context unchanged with status tracking.
 */

import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

/**
 * Executes manual trigger node by passing context through.
 * Used for INITIAL and MANUAL_TRIGGER node types.
 *
 * @param nodeId - Node identifier for status tracking
 * @param context - Workflow context to pass through
 * @param step - Inngest step utilities
 * @param publish - Status publishing function
 * @returns Unchanged workflow context
 */
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run(
    `manual-trigger-${nodeId}`,
    async () => context
  );

  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
