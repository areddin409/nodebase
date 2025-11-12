import { StripeTriggerNode } from "./../features/triggers/components/stripe-trigger/node";
import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

/**
 * React Flow Node Registry
 *
 * Maps Prisma NodeType enum values to React Flow node components for visual editor.
 * All workflow nodes must be registered here to appear in the editor.
 *
 * Adding New Node Types:
 * 1. Add to Prisma schema NodeType enum
 * 2. Create React component in features/[domain]/components/[node-name]/node.tsx
 * 3. Register component here
 * 4. Add executor to executor-registry.ts
 *
 * @see {@link https://reactflow.dev/api-reference/types/node-types} React Flow NodeTypes
 */

/** Type-safe mapping of node types to React components */
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
