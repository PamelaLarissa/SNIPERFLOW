import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulesApi, Schedule, ScheduleFilters } from '@/lib/api';
import { toast } from 'sonner';

// Query keys
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters?: ScheduleFilters) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
};

// Hooks
export function useSchedules(filters?: ScheduleFilters) {
  return useQuery({
    queryKey: scheduleKeys.list(filters),
    queryFn: () => schedulesApi.list(filters),
    staleTime: 30000,
  });
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => schedulesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: Partial<Schedule>) => schedulesApi.create(schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar agendamento: ${error.message}`);
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Schedule> }) =>
      schedulesApi.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.setQueryData(scheduleKeys.detail(data.id), data);
      toast.success('Agendamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar agendamento: ${error.message}`);
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => schedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      toast.success('Agendamento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover agendamento: ${error.message}`);
    },
  });
}
