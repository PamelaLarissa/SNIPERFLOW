// Kanban configuration and other constants

export const kanbanColumns = ['new', 'qualified', 'proposal', 'won', 'lost'] as const;
export type KanbanColumn = typeof kanbanColumns[number];

export const kanbanColumnLabels: Record<KanbanColumn, string> = {
    new: 'Novos',
    qualified: 'Qualificados',
    proposal: 'Proposta',
    won: 'Ganhos',
    lost: 'Perdidos',
};

export const kanbanColumnColors: Record<KanbanColumn, string> = {
    new: 'bg-blue-500/20 border-blue-500/30',
    qualified: 'bg-yellow-500/20 border-yellow-500/30',
    proposal: 'bg-purple-500/20 border-purple-500/30',
    won: 'bg-green-500/20 border-green-500/30',
    lost: 'bg-red-500/20 border-red-500/30',
};
