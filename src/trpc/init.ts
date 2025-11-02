import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * tRPC Context Creation
 *
 * Creates the base context for all tRPC procedures. Currently returns
 * a placeholder user ID, but can be extended to include request-specific
 * data like headers, database connections, or other shared resources.
 *
 * @returns {Promise<Object>} Base context object for tRPC procedures
 *
 * @see {@link https://trpc.io/docs/server/context} tRPC Context Documentation
 */
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});

/**
 * tRPC Instance Initialization
 *
 * Creates the base tRPC instance with configuration options.
 * Currently no transformer is used, but superjson could be enabled
 * for enhanced serialization of complex data types.
 */
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * Protected Procedure Middleware
 *
 * A middleware procedure that checks for user authentication using Better Auth.
 * This middleware:
 * - Retrieves session from request headers
 * - Throws UNAUTHORIZED error if no valid session found
 * - Injects authenticated user session into procedure context
 *
 * @middleware
 * @throws {TRPCError} With code "UNAUTHORIZED" if user is not authenticated
 * @param {Object} ctx - The context object containing request information
 * @param {Function} next - The next middleware function in the chain
 * @returns {Promise<Object>} Modified context object with authenticated user information
 *
 * @example
 * ```typescript
 * // Create a protected route
 * const getProfile = protectedProcedure.query(async ({ ctx }) => {
 *   // ctx.auth contains the authenticated user session
 *   return { userId: ctx.auth.user.id };
 * });
 * ```
 */
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});

/**
 * Premium Subscription Middleware
 *
 * A middleware procedure that checks if a user has an active premium subscription.
 * This extends the protected procedure by additionally verifying the customer's
 * subscription status through the Polar API.
 *
 * Flow:
 * 1. Inherits authentication check from protectedProcedure
 * 2. Uses authenticated user ID as external ID for Polar customer lookup
 * 3. Verifies customer has at least one active subscription
 * 4. Throws FORBIDDEN error if no active subscriptions found
 * 5. Injects customer data into context for subscription-gated features
 *
 * @middleware
 * @throws {TRPCError} With code "FORBIDDEN" if user has no active subscriptions
 * @param {Object} ctx - The context object from the protected procedure
 * @param {string} ctx.auth.user.id - The authenticated user's ID used as external ID for Polar
 * @param {Function} next - The next middleware function in the chain
 * @returns {Promise<Object>} Modified context object with customer information if validation passes
 *
 * @example
 * ```typescript
 * // Create a premium-only route
 * const getPremiumFeature = premiumProcedure.query(async ({ ctx }) => {
 *   // ctx.auth contains authenticated user session
 *   // ctx.customer contains Polar customer data with active subscriptions
 *   return { subscriptions: ctx.customer.activeSubscriptions };
 * });
 * ```
 */
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Active membership required",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  }
);
