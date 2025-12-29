import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalsApi, Proposal, ProposalFilters } from '@/lib/api';
import { toast } from 'sonner';

// Query keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters?: ProposalFilters) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
};

// Hooks
export function useProposals(filters?: ProposalFilters) {
  return useQuery({
    queryKey: proposalKeys.list(filters),
    queryFn: () => proposalsApi.list(filters),
    staleTime: 30000,
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposal: Partial<Proposal>) => proposalsApi.create(proposal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      toast.success('Proposta criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar proposta: ${error.message}`);
    },
  });
}
