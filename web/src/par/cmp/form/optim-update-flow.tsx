import { QueryKey, QueryClient } from "@tanstack/react-query";

export interface OptimisticUpdateFlowContext<T> {
  previousList: T[] | undefined;
  previousItem: T | undefined;
}

export interface OptimisticUpdateFlowOptions<T, U extends Partial<T>> {
  queryClient: QueryClient;
  itemId: string;
  itemKey: QueryKey;
  listKey: QueryKey;
  onMutate?: (updatedFields: U) => unknown | Promise<unknown>;
  onError?: (
    err: unknown,
    updatedFields: U,
    context: OptimisticUpdateFlowContext<T> | undefined
  ) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
}

/**
 * Returns an object containing `onMutate`, `onError`, and `onSettled` handlers
 * to be spread into a useMutation configuration for performing optimistic updates.
 *
 * @example
 * const updateUserMutation = useMutation({
 *   mutationFn: (updatedFields: Partial<User>) =>
 *     apiRoutes.updateUser(updatedFields, user.id),
 *   ...optimisticUpdateFlow<User, Partial<User>>({
 *     itemId: user.id,
 *     itemKey: userQueryKey(user.id),
 *     listKey: listQueryKey,
 *     onError: (err, updatedFields, context) => {
 *       toast.error("Failed to update user");
 *     },
 *     onSettled: () => {
 *       toast.success("User updated successfully");
 *     },
 *   }),
 * });
 */
export function optimisticUpdateFlow<T, U extends Partial<T> = Partial<T>>(
  options: OptimisticUpdateFlowOptions<T, U>
) {
  const {
    queryClient,
    itemId,
    itemKey,
    listKey,
    onMutate: externalOnMutate,
    onError: externalOnError,
    onSettled: externalOnSettled,
    onSuccess
  } = options;

  return {
    onMutate: async (
      updatedFields: U
    ): Promise<OptimisticUpdateFlowContext<T>> => {
      // Cancel any outgoing refetches for both queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: itemKey })
      ]);

      // Snapshot previous state
      const previousList = queryClient.getQueryData<T[]>(listKey);
      const previousItem = queryClient.getQueryData<T>(itemKey);

      // Optimistically update the list
      queryClient.setQueryData<T[]>(
        listKey,
        oldList =>
          oldList?.map(item =>
            /* @ts-ignore */
            item.id === itemId ? { ...item, ...updatedFields } : item
          ) ?? []
      );

      // Optimistically update the individual item
      queryClient.setQueryData<T>(itemKey, oldItem =>
        oldItem ? { ...oldItem, ...updatedFields } : oldItem
      );

      // Optional external onMutate callback
      if (externalOnMutate) {
        await externalOnMutate(updatedFields);
      }

      return { previousList, previousItem };
    },

    onError: async (
      err: unknown,
      updatedFields: U,
      context: OptimisticUpdateFlowContext<T> | undefined
    ) => {
      if (context?.previousList !== undefined) {
        queryClient.setQueryData<T[]>(listKey, context.previousList);
      }
      if (context?.previousItem !== undefined) {
        queryClient.setQueryData<T>(itemKey, context.previousItem);
      }
      if (externalOnError) {
        return externalOnError(err, updatedFields, context);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: listKey });
      await queryClient.invalidateQueries({ queryKey: itemKey });
      if (externalOnSettled) {
        return externalOnSettled();
      }
    },

    // Just for convenience
    onSuccess
  };
}
