import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { PRO_SLUG } from "@/config/constants";

/**
 * Better Auth Server Configuration with Polar Integration
 *
 * This file configures the server-side authentication system with:
 * - Prisma database adapter for user/session storage
 * - Email/password authentication with auto sign-in
 * - Polar integration for subscription management
 * - Checkout functionality for premium subscriptions
 * - Customer portal access for subscription management
 *
 * Key Features:
 * - Automatic customer creation on user sign-up
 * - Pre-configured product checkout (Nodebase Pro)
 * - Authenticated-only checkout flow
 * - Success URL redirection after purchase
 *
 * Environment Variables Required:
 * - POLAR_ACCESS_TOKEN: Polar API access token
 * - POLAR_SUCCESS_URL: Redirect URL after successful purchase
 *
 * @example
 * ```typescript
 * // Used in API routes and middleware
 * const session = await auth.api.getSession({ headers });
 * ```
 *
 * @see {@link https://better-auth.com/docs} Better Auth Documentation
 * @see {@link https://polar.sh/docs} Polar Documentation
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "3c295f0f-8482-4c54-a6a4-3e2ad0260f67",
              slug: PRO_SLUG,
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
