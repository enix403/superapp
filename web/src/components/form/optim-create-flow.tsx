import { useQueryClient, QueryKey, QueryClient } from "@tanstack/react-query";

export interface OptimisticCreateFlowContext<T> {
  previousList: T[] | undefined;
}

export interface OptimisticCreateFlowOptions<T> {
  queryClient: QueryClient;
  listKey: QueryKey;
  getOptimisticItem: (input: any) => T;
  onMutate?: (input: any) => unknown | Promise<unknown>;
  onError?: (
    err: unknown,
    input: any,
    context: OptimisticCreateFlowContext<T> | undefined
  ) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
}

/**
 * Reusable optimistic creation handler for useMutation.
 * Adds the new item optimistically into the list queryKey.
 *
 * @example
 * const createUserMutation = useMutation({
 *   mutationFn: (data) => apiRoutes.createUser(data),
 *   ...optimisticCreateFlow<User>({
 *     listKey: ["users", "list"],
 *     getOptimisticItem: (data) => ({
 *       ...data,
 *       id: uuid(), // temporary ID
 *     }),
 *     onError: () => toast.error("Failed to create user"),
 *     onSettled: () => toast.success("User created"),
 *   }),
 * });
 */
export function optimisticCreateFlow<T>(
  options: OptimisticCreateFlowOptions<T>
) {
  const {
    queryClient,
    listKey,
    getOptimisticItem,
    onMutate: externalOnMutate,
    onError: externalOnError,
    onSettled: externalOnSettled,
    onSuccess
  } = options;

  return {
    onMutate: async (input: any): Promise<OptimisticCreateFlowContext<T>> => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousList = queryClient.getQueryData<T[]>(listKey);

      const optimisticItem = getOptimisticItem(input);

      queryClient.setQueryData<T[]>(listKey, oldList => [
        ...(oldList ?? []),
        optimisticItem
      ]);

      if (externalOnMutate) await externalOnMutate(input);

      return { previousList };
    },

    onError: async (
      err: unknown,
      input: any,
      context: OptimisticCreateFlowContext<T> | undefined
    ) => {
      if (context?.previousList) {
        queryClient.setQueryData<T[]>(listKey, context.previousList);
      }

      if (externalOnError) {
        await externalOnError(err, input, context);
      }
    },

    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: listKey });

      if (externalOnSettled) await externalOnSettled();
    },

    onSuccess
  };
}
