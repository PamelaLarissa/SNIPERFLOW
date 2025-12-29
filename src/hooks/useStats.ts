import { useQuery } from '@tanstack/react-query';
import { statsApi, DashboardStats, SourceStats, ScoreDistribution } from '@/lib/api';

// Query keys
export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  leadsBySource: () => [...statsKeys.all, 'leads-by-source'] as const,
  scoreDistribution: () => [...statsKeys.all, 'score-distribution'] as const,
};

// Hooks
export function useStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: () => statsApi.dashboard(),
    staleTime: 60000, // 1 minute
  });
}

export function useLeadsBySource() {
  return useQuery({
    queryKey: statsKeys.leadsBySource(),
    queryFn: () => statsApi.leadsBySource(),
    staleTime: 60000,
  });
}

export function useScoreDistribution() {
  return useQuery({
    queryKey: statsKeys.scoreDistribution(),
    queryFn: () => statsApi.scoreDistribution(),
    staleTime: 60000,
  });
}
