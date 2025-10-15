"use client";
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

/**
 * Obtain a React Query QueryClient appropriate for the current runtime environment.
 *
 * On the server this always creates and returns a new QueryClient. In the browser
 * this returns a singleton QueryClient, creating and caching it on first call to
 * avoid recreating the client across renders (e.g., during Suspense).
 *
 * @returns A QueryClient instance: a new instance on the server, or a cached singleton in the browser.
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * Determine the full TRPC HTTP endpoint URL for the current runtime environment.
 *
 * @returns The TRPC endpoint URL (`<base>/api/trpc`) where `base` is:
 * - an empty string in the browser (relative path),
 * - `https://<VERCEL_URL>` when running on a server with `VERCEL_URL` set,
 * - `http://localhost:3000` otherwise.
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

/**
 * Supplies a React Query client and a tRPC client to all descendant components.
 *
 * Renders a provider tree that injects a QueryClient and a tRPC client into React context so child components can use React Query and tRPC hooks.
 *
 * @param props.children - React nodes to render inside the providers
 * @returns The provider tree wrapping `props.children`
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}