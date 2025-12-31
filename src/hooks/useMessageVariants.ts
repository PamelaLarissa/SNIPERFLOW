import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { variantsApi, MessageVariant } from '@/lib/api';

export const variantKeys = {
    all: ['variants'] as const,
    list: (campaignId?: string) => [...variantKeys.all, 'list', { campaignId }] as const,
};

export function useMessageVariants(campaignId?: string) {
    return useQuery({
        queryKey: variantKeys.list(campaignId),
        queryFn: () => variantsApi.list(campaignId),
    });
}

export function useCreateMessageVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (variant: Partial<MessageVariant>) => variantsApi.create(variant),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: variantKeys.all });
        },
    });
}

export function useUpdateMessageVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<MessageVariant> }) =>
            variantsApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: variantKeys.all });
        },
    });
}

export function useDeleteMessageVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => variantsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: variantKeys.all });
        },
    });
}
