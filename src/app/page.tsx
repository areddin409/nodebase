import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

/**
 * Renders the app's centered root layout that provides dehydrated React Query state and a Suspense boundary for the client UI.
 *
 * Initializes a query client and initiates a background prefetch of the users query, then hydrates that prefetched state into the rendered React tree and renders the Client component inside a Suspense fallback.
 *
 * @returns A React element containing a centered container with a HydrationBoundary (populated with the dehydrated query cache), a Suspense fallback, and the Client component
 */
export default async function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}