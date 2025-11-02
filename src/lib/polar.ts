import { Polar } from "@polar-sh/sdk";

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN is required");
}

/**
 * Polar SDK Client Configuration
 *
 * This file creates and configures the Polar SDK client for subscription
 * management and customer operations. Polar handles:
 * - Subscription billing and management
 * - Customer account management
 * - Product and pricing configuration
 * - Webhook events for subscription changes
 *
 * Configuration:
 * - Uses sandbox server for development/testing
 * - Access token from environment variables
 * - Integrated with Better Auth for seamless user experience
 *
 * Environment Variables Required:
 * - POLAR_ACCESS_TOKEN: Your Polar API access token
 *
 * Usage:
 * - Used in tRPC middleware for subscription validation
 * - Integrated with Better Auth plugins
 * - Provides customer state and subscription data
 *
 * @example
 * ```typescript
 * // Get customer by external ID (user ID)
 * const customer = await polarClient.customers.getStateExternal({
 *   externalId: userId
 * });
 *
 * // Check for active subscriptions
 * const hasActiveSubscription = customer.activeSubscriptions.length > 0;
 * ```
 *
 * @see {@link https://polar.sh/docs} Polar SDK Documentation
 */
export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
});
