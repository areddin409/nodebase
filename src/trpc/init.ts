import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
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
 * A middleware procedure that checks for user authentication.
 * If the user is not authenticated, it throws an UNAUTHORIZED error.
 * @middleware
 * @throws {TRPCError} With code "UNAUTHORIZED" if user is not authenticated
 *  * @param ctx - The context object containing request information
 *
 * @param next - The next middleware function in the chain
 * @returns A modified context object with authenticated user information
 * @example
 * ```ts
 * const myProtectedRoute = protectedProcedure.query(async ({ ctx }) => {
 * // Only accessible by authenticated users
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
 * A middleware procedure that checks if a user has an active premium subscription.
 * Extends the protected procedure by verifying the customer's subscription status.
 *
 * @middleware
 * @throws {TRPCError} With code "FORBIDDEN" if user has no active subscriptions
 *
 * @param ctx - The context object from the protected procedure
 * @param ctx.auth.user.id - The authenticated user's ID used as external ID for Polar
 * @param next - The next middleware function in the chain
 *
 * @returns A modified context object with customer information if validation passes
 *
 * @example
 * ```ts
 * const myPremiumRoute = premiumProcedure.query(async ({ ctx }) => {
 *   // Only accessible by users with active subscriptions
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
