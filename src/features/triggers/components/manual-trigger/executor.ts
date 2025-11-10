import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish 'loading' state for manual trigger

  const result = await step.run(
    `manual-trigger-${nodeId}`,
    async () => context
  );

  // TODO: publish 'success' state for manual trigger

  return result;
};
