import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

/**
 * React Query hook for fetching customer subscription state from Polar.
 *
 * This hook fetches the current customer's state including active subscriptions,
 * subscription history, and other customer-related data from the Polar API.
 *
 * @returns {UseQueryResult} TanStack Query result object containing customer state data
 *
 * @example
 * ```typescript
 * const { data: customerState, isLoading, error } = useSubscription();
 * console.log(customerState?.activeSubscriptions);
 * ```
 */
export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const { data } = await authClient.customer.state();
        return data;
      } catch (error) {
        console.error("Error fetching customer state:", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Convenience hook that checks if the current user has an active subscription.
 *
 * This hook wraps `useSubscription` and provides convenient boolean flags
 * and the first active subscription for easy access in components.
 *
 * @returns {Object} Object containing subscription status and data
 * @returns {boolean} hasActiveSubscription - True if user has any active subscriptions
 * @returns {Subscription} subscription - The first active subscription (if any)
 * @returns {boolean} isLoading - Loading state from the underlying query
 * @returns {...UseQueryResult} ...rest - All other properties from the useQuery result
 *
 * @example
 * ```typescript
 * const { hasActiveSubscription, subscription, isLoading } = useHasActiveSubscription();
 *
 * if (isLoading) return <Spinner />;
 * if (!hasActiveSubscription) return <UpgradePrompt />;
 *
 * return <PremiumFeatures subscription={subscription} />;
 * ```
 */
export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
