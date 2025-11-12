/**
 * Polar.sh SDK Client
 *
 * Subscription management and billing via Polar.sh integrated with Better Auth.
 *
 * Key Features:
 * - Subscription validation in tRPC premiumProcedure
 * - Customer state management with external ID (user ID)
 * - Sandbox support for development
 *
 * Environment Variables:
 * - POLAR_ACCESS_TOKEN (required)
 * - POLAR_SERVER (optional: "sandbox" | "production")
 *
 * @see {@link https://docs.polar.sh} Polar.sh Documentation
 */

import { Polar } from "@polar-sh/sdk";

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN is required");
}

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
});
