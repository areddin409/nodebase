/**
 * tRPC Configuration & Procedures
 *
 * Core tRPC setup with Better Auth integration and Polar.sh subscription gating.
 *
 * Key Features:
 * - SuperJSON transformer for complex data types
 * - Protected procedures with Better Auth session validation
 * - Premium procedures with Polar.sh subscription checks
 *
 * @see {@link https://trpc.io/docs} tRPC Documentation
 * @see {@link https://better-auth.com/docs} Better Auth
 * @see {@link https://docs.polar.sh} Polar.sh API
 */

import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

/** Creates tRPC context for all procedures */
export const createTRPCContext = cache(async () => {
  return { userId: "user_123" };
});

// Initialize tRPC with SuperJSON transformer
const t = initTRPC.create({
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * Protected procedure requiring authentication.
 * Injects session into context, throws UNAUTHORIZED if not authenticated.
 *
 * @example
 * const getProfile = protectedProcedure.query(({ ctx }) => {
 *   return { userId: ctx.auth.user.id };
 * });
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
 * Premium procedure requiring active subscription.
 * Extends protectedProcedure with Polar.sh subscription validation.
 * Throws FORBIDDEN if no active subscriptions found.
 *
 * @example
 * const createWorkflow = premiumProcedure.mutation(({ ctx }) => {
 *   // ctx.auth has user session, ctx.customer has subscription data
 *   return prisma.workflow.create({ data: { userId: ctx.auth.user.id } });
 * });
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
