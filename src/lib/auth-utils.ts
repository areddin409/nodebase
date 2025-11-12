/**
 * Authentication Guard Utilities
 *
 * Server-side authentication guards for Next.js pages using Better Auth.
 * Automatically redirects users based on session state.
 *
 * @see {@link https://better-auth.com/docs} Better Auth Documentation
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Requires authenticated user, redirects to login if not authenticated.
 * Use in protected pages.
 *
 * @returns User session
 * @example
 * // In a protected page:
 * export default async function DashboardPage() {
 *   const session = await requireAuth();
 *   return <div>Welcome {session.user.email}</div>;
 * }
 */
export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return session;
};

/**
 * Requires no authentication, redirects to home if authenticated.
 * Use in auth pages (login, signup).
 *
 * @returns Session (null if not authenticated)
 * @example
 * // In login/signup pages:
 * export default async function LoginPage() {
 *   await requireNoAuth();
 *   return <LoginForm />;
 * }
 */
export const requireNoAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/");
  }
  return session;
};
