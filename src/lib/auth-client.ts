import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Configuration with Polar Integration
 *
 * This file creates the client-side authentication instance that handles:
 * - User authentication (sign in, sign out, session management)
 * - Polar integration for subscription and customer management
 * - Client-side auth state management
 *
 * The client is configured with the Polar plugin to enable subscription-related
 * functionality like customer state checking, subscription management, and
 * checkout/portal access.
 *
 * @example
 * ```typescript
 * // Sign in user
 * await authClient.signIn.email({
 *   email: "user@example.com",
 *   password: "password123"
 * });
 *
 * // Get customer state (subscription info)
 * const { data } = await authClient.customer.state();
 *
 * // Sign out user
 * await authClient.signOut();
 * ```
 *
 * @see {@link https://better-auth.com/docs} Better Auth Documentation
 * @see {@link https://polar.sh/docs} Polar Documentation
 */
export const authClient = createAuthClient({
  plugins: [polarClient()],
});
