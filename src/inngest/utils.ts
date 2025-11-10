/**
 * Inngest Workflow Execution Utilities
 *
 * This module provides utility functions for processing and executing workflows
 * within Inngest background jobs. It handles the complex logic of determining
 * the correct execution order for workflow nodes based on their connections.
 *
 * Key Features:
 * - Topological sorting of workflow nodes based on connections
 * - Cycle detection to prevent infinite loops
 * - Handling of disconnected nodes and independent execution paths
 *
 * @see https://en.wikipedia.org/wiki/Topological_sorting - Topological sort algorithm
 * @see https://www.npmjs.com/package/toposort - Toposort library documentation
 */

import { Connection, Node } from "@/generated/prisma";
import toposort from "toposort";

/**
 * Performs topological sorting on workflow nodes based on their connections.
 *
 * This function determines the correct execution order for workflow nodes by analyzing
 * their dependencies (connections). It ensures that nodes are executed in the proper
 * order where dependency nodes run before dependent nodes.
 *
 * Algorithm Details:
 * 1. If no connections exist, returns nodes in original order (all independent)
 * 2. Converts database connections to edge format for topological sorting
 * 3. Adds self-edges for disconnected nodes to ensure they're included in sort
 * 4. Uses toposort library to determine execution order
 * 5. Detects and throws error for cyclic dependencies
 * 6. Maps sorted IDs back to original node objects
 *
 * @param nodes - Array of workflow nodes to be sorted
 * @param connections - Array of connections defining node dependencies
 * @returns Array of nodes sorted in topological order (dependencies first)
 *
 * @throws {Error} "Cycle detected in workflow connections" - When circular dependencies exist
 * @throws {Error} Original toposort error - For other sorting failures
 *
 * @example
 * ```typescript
 * // Example workflow: A → B → C, with D disconnected
 * const nodes = [
 *   { id: 'node-a', type: 'trigger', ... },
 *   { id: 'node-b', type: 'action', ... },
 *   { id: 'node-c', type: 'action', ... },
 *   { id: 'node-d', type: 'action', ... }
 * ];
 *
 * const connections = [
 *   { fromNodeId: 'node-a', toNodeId: 'node-b' },
 *   { fromNodeId: 'node-b', toNodeId: 'node-c' }
 * ];
 *
 * const sorted = topologicalSort(nodes, connections);
 * // Result: [node-a, node-b, node-c, node-d] or [node-a, node-d, node-b, node-c]
 * // (node-d can be anywhere since it's disconnected)
 * ```
 *
 * @example
 * ```typescript
 * // Error case: Cyclic dependency A → B → A
 * const nodes = [
 *   { id: 'node-a', type: 'trigger', ... },
 *   { id: 'node-b', type: 'action', ... }
 * ];
 *
 * const connections = [
 *   { fromNodeId: 'node-a', toNodeId: 'node-b' },
 *   { fromNodeId: 'node-b', toNodeId: 'node-a' }
 * ];
 *
 * // Throws: Error("Cycle detected in workflow connections")
 * topologicalSort(nodes, connections);
 * ```
 *
 * @since 1.0.0
 * @category Workflow Execution
 */

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // Early return: if no connections exist, all nodes are independent
  // and can be executed in any order (return original order)
  if (connections.length === 0) {
    return nodes;
  }

  // Convert database connections to edge format required by toposort library
  // Each connection becomes a [source, target] tuple representing dependency
  const edges: [string, string][] = connections.map(conn => [
    conn.fromNodeId, // Source node (dependency)
    conn.toNodeId, // Target node (dependent)
  ]);

  // Track which nodes are involved in connections to identify disconnected nodes
  const connectedNodeIds = new Set<string>();
  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }

  // Add self-edges for disconnected nodes to ensure they appear in the sorted result
  // Self-edges (node → node) don't affect topological order but include the node
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // Perform topological sort using the toposort library
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);

    // Remove duplicate IDs that result from self-edges for disconnected nodes
    // Set automatically handles deduplication while preserving order
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (e) {
    // Handle specific case of cyclic dependencies with a user-friendly error
    if (e instanceof Error && e.message.includes("Cyclic")) {
      throw new Error("Cycle detected in workflow connections");
    }
    // Re-throw any other errors from toposort library
    throw e;
  }

  // Map sorted node IDs back to their corresponding node objects
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  // Convert IDs to nodes, filtering out any that don't exist (safety check)
  return sortedNodeIds
    .map(id => nodeMap.get(id)!) // Non-null assertion: IDs should exist
    .filter(Boolean); // Filter out any undefined values (safety)
};
