import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

/**
 * Options for the useNodeStatus hook.
 */
interface UseNodeStatusOptions {
  /** The unique identifier of the node to track status for */
  nodeId: string;
  /** The Inngest channel to subscribe to for status updates */
  channel: string;
  /** The specific topic within the channel to monitor */
  topic: string;
  /** Function that returns a promise resolving to a subscription token for Inngest realtime */
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

/**
 * Custom React hook for tracking the real-time status of a specific workflow node.
 *
 * This hook subscribes to Inngest realtime updates and monitors status changes
 * for a particular node in a workflow execution. It filters incoming messages
 * by channel, topic, and nodeId to ensure only relevant status updates are processed.
 *
 * @param options - Configuration options for the hook
 * @param options.nodeId - The unique identifier of the node to track
 * @param options.channel - The Inngest channel to subscribe to
 * @param options.topic - The specific topic within the channel to monitor
 * @param options.refreshToken - Function to refresh the subscription token
 *
 * @returns The current status of the node, updated in real-time
 *
 * @example
 * ```typescript
 * const nodeStatus = useNodeStatus({
 *   nodeId: "node_123",
 *   channel: "workflow-execution",
 *   topic: "node-status",
 *   refreshToken: async () => await getSubscriptionToken()
 * });
 *
 * // nodeStatus will be one of: "initial" | "running" | "completed" | "failed"
 * ```
 */
export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  // Initialize status with "initial" state
  const [status, setStatus] = useState<NodeStatus>("initial");

  // Subscribe to Inngest realtime updates
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  // Process incoming messages to update node status
  useEffect(() => {
    // Exit early if no data is available
    if (!data?.length) return;

    // Find the latest message for this specific node
    // Filter by channel, topic, and nodeId to ensure we only process relevant messages
    const latestMessage = data
      .filter(
        msg =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId
      )
      // Sort by creation time to get the most recent message
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    // Update the status if we found a valid message
    if (latestMessage?.kind === "data") {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, channel, topic, nodeId]);

  return status;
}
