import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
/**
 * Create a QueryClient configured with application defaults for query caching and dehydration.
 *
 * @returns A QueryClient configured with a 30-second query staleTime and a dehydration policy that treats queries as dehydrated when they meet the default criteria or have a state status of `"pending"`.
 */

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}