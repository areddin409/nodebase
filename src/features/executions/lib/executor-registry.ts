/**
 * Node Executor Registry
 *
 * Maps Prisma NodeType enum to executor functions for workflow execution.
 * Executors run in Inngest background jobs and process node logic.
 *
 * Adding New Executors:
 * 1. Create executor in features/[domain]/components/[node-name]/executor.ts
 * 2. Implement NodeExecutor<TData> interface
 * 3. Register executor here
 * 4. Add node component to node-components.ts
 */

import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";

/** Type-safe mapping of node types to executor functions */
export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

/**
 * Retrieves executor function for a given node type.
 * @throws Error if no executor registered for type
 */
export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};
