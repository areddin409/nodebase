"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export type ManualTriggerToken = Realtime.Token<
  typeof manualTriggerChannel,
  ["status"]
>;

/**
 * Obtain a realtime subscription token for the manual trigger's "status" topic.
 *
 * @returns A `ManualTriggerToken` that can be used to subscribe to realtime "status" updates for the manual trigger channel.
 */
export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });

  return token;
}