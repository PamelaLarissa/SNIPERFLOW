// Mock data for the LeadScan 365 application

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: boolean;
  score: number;
  isVerified: boolean;
  source: string;
  website?: string;
  employeeCount?: string;
  revenueRange?: string;
  techStack?: string[];
  socialProfiles?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: string;
  // New fields
  lat?: number;
  lng?: number;
  assignedTo?: string;
  status?: 'new' | 'qualified' | 'proposal' | 'won' | 'lost';
  invoiceDue?: string;
  avgTicket?: number;
}

export interface Campaign {
  id: string;
  name: string;
  niche: string;
  location: string;
  status: 'active' | 'paused' | 'completed';
  leadsFound: number;
  leadsVerified: number;
  createdAt: string;
  lastRun?: string;
  sources?: string[];
  filters?: {
    minScore?: number;
    maxScore?: number;
    verifiedOnly?: boolean;
  };
}

export interface DashboardStats {
  totalLeads: number;
  verifiedLeads: number;
  avgScore: number;
  activeCampaigns: number;
  leadsThisWeek: number;
  conversionRate: number;
  moneyLeft?: number;
}

export interface Schedule {
  id: string;
  leadId: string;
  leadName: string;
  date: string;
  hour: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MessageVariant {
  id: string;
  campaignId: string;
  name: string;
  text: string;
  sent: number;
  opened: number;
  isWinner?: boolean;
}

export interface Proposal {
  id: string;
  leadId: string;
  leadName: string;
  products: { name: string; price: number; quantity: number }[];
  discount: number;
  total: number;
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    company: 'TechBR Soluções',
    email: 'carlos@techbr.com.br',
    phone: '+55 11 98765-4321',
    whatsapp: true,
    score: 87,
    isVerified: true,
    source: 'Google',
    website: 'techbr.com.br',
    employeeCount: '50-100',
    revenueRange: 'R$ 5M - R$ 10M',
    techStack: ['WordPress', 'WooCommerce', 'Google Analytics'],
    socialProfiles: {
      linkedin: 'linkedin.com/company/techbr',
      instagram: '@techbr_oficial',
    },
    createdAt: '2024-01-15T10:30:00Z',
    lat: -23.5505,
    lng: -46.6333,
    status: 'qualified',
    avgTicket: 5000,
    assignedTo: 'seller1',
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    company: 'Marketing Digital Pro',
    email: 'ana@mkdigitalpro.com',
    phone: '+55 21 99876-5432',
    whatsapp: true,
    score: 92,
    isVerified: true,
    source: 'LinkedIn',
    website: 'mkdigitalpro.com',
    employeeCount: '10-25',
    revenueRange: 'R$ 1M - R$ 5M',
    techStack: ['HubSpot', 'Salesforce', 'Meta Ads'],
    socialProfiles: {
      linkedin: 'linkedin.com/company/mkdigitalpro',
      instagram: '@mkdigitalpro',
      facebook: 'facebook.com/mkdigitalpro',
    },
    createdAt: '2024-01-14T14:20:00Z',
    lat: -22.9068,
    lng: -43.1729,
    status: 'proposal',
    avgTicket: 8000,
    assignedTo: 'seller2',
  },
  {
    id: '3',
    name: 'Roberto Almeida',
    company: 'E-commerce Express',
    email: 'roberto@ecomexpress.com.br',
    phone: '+55 31 98765-1234',
    whatsapp: false,
    score: 73,
    isVerified: true,
    source: 'Google Maps',
    website: 'ecomexpress.com.br',
    employeeCount: '100-200',
    revenueRange: 'R$ 10M - R$ 30M',
    techStack: ['Shopify', 'Klaviyo', 'Google Ads'],
    createdAt: '2024-01-13T09:45:00Z',
    lat: -19.9167,
    lng: -43.9345,
    status: 'new',
    avgTicket: 12000,
    assignedTo: 'seller1',
  },
  {
    id: '4',
    name: 'Fernanda Costa',
    company: 'Consultoria FC',
    email: 'fernanda@consultoriafc.com',
    phone: '+55 41 99887-6655',
    whatsapp: true,
    score: 65,
    isVerified: false,
    source: 'Instagram',
    website: 'consultoriafc.com',
    employeeCount: '5-10',
    revenueRange: 'R$ 500K - R$ 1M',
    socialProfiles: {
      instagram: '@consultoriafc',
    },
    createdAt: '2024-01-12T16:10:00Z',
    lat: -25.4284,
    lng: -49.2733,
    status: 'new',
    avgTicket: 3000,
  },
  {
    id: '5',
    name: 'Paulo Mendes',
    company: 'Startup Lab Brasil',
    email: 'paulo@startuplab.com.br',
    phone: '+55 51 98765-9876',
    whatsapp: true,
    score: 45,
    isVerified: true,
    source: 'TikTok',
    website: 'startuplab.com.br',
    employeeCount: '25-50',
    revenueRange: 'R$ 2M - R$ 5M',
    techStack: ['React', 'Node.js', 'AWS'],
    socialProfiles: {
      linkedin: 'linkedin.com/company/startuplab',
      instagram: '@startuplabbr',
    },
    createdAt: '2024-01-11T11:30:00Z',
    lat: -30.0346,
    lng: -51.2177,
    status: 'won',
    avgTicket: 6000,
    assignedTo: 'seller2',
  },
  {
    id: '6',
    name: 'Juliana Torres',
    company: 'Agência Impulso',
    email: 'juliana@agenciaimpulso.com',
    phone: '+55 11 97654-3210',
    whatsapp: true,
    score: 88,
    isVerified: true,
    source: 'YouTube',
    website: 'agenciaimpulso.com',
    employeeCount: '15-30',
    revenueRange: 'R$ 3M - R$ 8M',
    techStack: ['RD Station', 'WordPress', 'Facebook Ads'],
    socialProfiles: {
      linkedin: 'linkedin.com/company/agenciaimpulso',
      instagram: '@agenciaimpulso',
      facebook: 'facebook.com/agenciaimpulso',
    },
    createdAt: '2024-01-10T08:15:00Z',
    lat: -23.5505,
    lng: -46.6333,
    status: 'lost',
    avgTicket: 7500,
    assignedTo: 'seller1',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Agências de Marketing SP',
    niche: 'Agências de Marketing Digital',
    location: 'São Paulo, SP',
    status: 'active',
    leadsFound: 324,
    leadsVerified: 287,
    createdAt: '2024-01-01T00:00:00Z',
    lastRun: '2024-01-15T06:00:00Z',
    sources: ['Google', 'LinkedIn', 'Instagram'],
    filters: { minScore: 60, verifiedOnly: true },
  },
  {
    id: '2',
    name: 'E-commerces Brasil',
    niche: 'Lojas Virtuais',
    location: 'Brasil',
    status: 'active',
    leadsFound: 512,
    leadsVerified: 445,
    createdAt: '2024-01-05T00:00:00Z',
    lastRun: '2024-01-15T06:00:00Z',
    sources: ['Google', 'Maps', 'YouTube'],
    filters: { minScore: 50 },
  },
  {
    id: '3',
    name: 'Startups Tech RJ',
    niche: 'Startups de Tecnologia',
    location: 'Rio de Janeiro, RJ',
    status: 'paused',
    leadsFound: 156,
    leadsVerified: 134,
    createdAt: '2024-01-08T00:00:00Z',
    lastRun: '2024-01-12T06:00:00Z',
    sources: ['LinkedIn', 'TikTok'],
  },
  {
    id: '4',
    name: 'Consultorias Financeiras',
    niche: 'Consultoria Financeira',
    location: 'Brasil',
    status: 'completed',
    leadsFound: 89,
    leadsVerified: 78,
    createdAt: '2024-01-02T00:00:00Z',
    lastRun: '2024-01-10T06:00:00Z',
    sources: ['Google', 'LinkedIn'],
  },
];

export const mockDashboardStats: DashboardStats = {
  totalLeads: 1081,
  verifiedLeads: 944,
  avgScore: 76,
  activeCampaigns: 2,
  leadsThisWeek: 127,
  conversionRate: 87.3,
  moneyLeft: 145000, // leads_not_answered * avg_ticket * 0.67
};

export const mockScoreDistribution = [
  { range: '0-20', count: 23 },
  { range: '21-40', count: 67 },
  { range: '41-60', count: 189 },
  { range: '61-80', count: 412 },
  { range: '81-100', count: 390 },
];

export const mockLeadsBySource = [
  { source: 'Google', count: 345 },
  { source: 'LinkedIn', count: 278 },
  { source: 'Google Maps', count: 198 },
  { source: 'Instagram', count: 145 },
  { source: 'YouTube', count: 78 },
  { source: 'TikTok', count: 37 },
];

export const mockLeadsTrend = [
  { date: '01/01', leads: 45 },
  { date: '02/01', leads: 52 },
  { date: '03/01', leads: 38 },
  { date: '04/01', leads: 65 },
  { date: '05/01', leads: 78 },
  { date: '06/01', leads: 92 },
  { date: '07/01', leads: 85 },
  { date: '08/01', leads: 110 },
  { date: '09/01', leads: 95 },
  { date: '10/01', leads: 125 },
  { date: '11/01', leads: 142 },
  { date: '12/01', leads: 118 },
  { date: '13/01', leads: 136 },
  { date: '14/01', leads: 127 },
];

export const mockSchedules: Schedule[] = [
  { id: '1', leadId: '1', leadName: 'Carlos Silva', date: '2024-01-20', hour: '10:00', status: 'pending', notes: 'Primeira reunião' },
  { id: '2', leadId: '2', leadName: 'Ana Rodrigues', date: '2024-01-20', hour: '14:00', status: 'pending', notes: 'Apresentar proposta' },
  { id: '3', leadId: '3', leadName: 'Roberto Almeida', date: '2024-01-21', hour: '09:00', status: 'pending' },
  { id: '4', leadId: '4', leadName: 'Fernanda Costa', date: '2024-01-22', hour: '11:00', status: 'pending' },
  { id: '5', leadId: '5', leadName: 'Paulo Mendes', date: '2024-01-18', hour: '15:00', status: 'completed' },
];

export const mockMessageVariants: MessageVariant[] = [
  { id: '1', campaignId: '1', name: 'Versão A - Formal', text: 'Olá {nome}, gostaríamos de apresentar nossa solução...', sent: 150, opened: 45 },
  { id: '2', campaignId: '1', name: 'Versão B - Casual', text: 'Oi {nome}! Tudo bem? Vi que você trabalha com...', sent: 150, opened: 62, isWinner: true },
  { id: '3', campaignId: '2', name: 'Versão A - Direto', text: 'Sua empresa pode economizar 30% com nossa solução...', sent: 100, opened: 28 },
  { id: '4', campaignId: '2', name: 'Versão B - Pergunta', text: 'Você sabia que 80% das empresas do seu setor já...', sent: 100, opened: 35 },
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    leadId: '1',
    leadName: 'Carlos Silva - TechBR',
    products: [
      { name: 'Plano Pro', price: 197, quantity: 1 },
      { name: 'Setup Inicial', price: 500, quantity: 1 },
    ],
    discount: 10,
    total: 627.30,
    createdAt: '2024-01-15T10:00:00Z',
    status: 'sent',
  },
  {
    id: '2',
    leadId: '2',
    leadName: 'Ana Rodrigues - MKDigital',
    products: [
      { name: 'Plano Agência', price: 497, quantity: 1 },
    ],
    discount: 0,
    total: 497,
    createdAt: '2024-01-14T15:00:00Z',
    status: 'accepted',
  },
];

// Kanban columns
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
