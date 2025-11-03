import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflows-params";

/**
 * Hook to fetch all workflows using suspense.
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Hook to fetch a single workflow using suspense.
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/**
 * Hook to create a new workflow.
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: data => {
        toast.success(`Workflow "${data.name}" created`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: error => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove a workflow
 */
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: data => {
        toast.success(`Workflow "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: error => {
        toast.error(`Failed to remove workflow: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update a workflow's name.
 */
export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onMutate: async ({ id, name }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(
          trpc.workflows.getOne.queryOptions({ id })
        );
        await queryClient.cancelQueries(
          trpc.workflows.getMany.queryOptions({})
        );

        // Get the previous data for rollback
        const previousWorkflow = queryClient.getQueryData(
          trpc.workflows.getOne.queryOptions({ id }).queryKey
        );
        const previousWorkflows = queryClient.getQueryData(
          trpc.workflows.getMany.queryOptions({}).queryKey
        );

        // Optimistically update the single workflow
        queryClient.setQueryData(
          trpc.workflows.getOne.queryOptions({ id }).queryKey,
          (old: any) => (old ? { ...old, name } : old)
        );

        // Optimistically update the workflows list
        queryClient.setQueryData(
          trpc.workflows.getMany.queryOptions({}).queryKey,
          (old: any) => {
            if (!old?.items) return old;
            return {
              ...old,
              items: old.items.map((w: any) =>
                w.id === id ? { ...w, name } : w
              ),
            };
          }
        );

        // Return a context object with the snapshotted value
        return { previousWorkflow, previousWorkflows };
      },
      onError: (error, variables, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousWorkflow) {
          queryClient.setQueryData(
            trpc.workflows.getOne.queryOptions({ id: variables.id }).queryKey,
            context.previousWorkflow
          );
        }
        if (context?.previousWorkflows) {
          queryClient.setQueryData(
            trpc.workflows.getMany.queryOptions({}).queryKey,
            context.previousWorkflows
          );
        }
        toast.error(`Failed to update workflow: ${error.message}`);
      },
      onSuccess: data => {
        toast.success(`Workflow "${data.name}" updated`);
      },
      onSettled: data => {
        // Always refetch after error or success to ensure we have the latest data
        if (data) {
          queryClient.invalidateQueries(
            trpc.workflows.getMany.queryOptions({})
          );
          queryClient.invalidateQueries(
            trpc.workflows.getOne.queryOptions({ id: data.id })
          );
        }
      },
    })
  );
};
