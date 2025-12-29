// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== LEADS API ====================

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
  lat?: number;
  lng?: number;
  assignedTo?: string;
  status?: 'new' | 'qualified' | 'proposal' | 'won' | 'lost';
  invoiceDue?: string;
  avgTicket?: number;
  rating?: number;
  campaignId?: string;
}

export interface LeadFilters {
  campaignId?: string;
  status?: string;
  minScore?: number;
  source?: string;
  isVerified?: boolean;
  limit?: number;
}

export const leadsApi = {
  list: (filters?: LeadFilters): Promise<Lead[]> => {
    const params = new URLSearchParams();
    if (filters?.campaignId) params.append('campaignId', filters.campaignId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minScore !== undefined) params.append('minScore', String(filters.minScore));
    if (filters?.source) params.append('source', filters.source);
    if (filters?.isVerified !== undefined) params.append('isVerified', String(filters.isVerified));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const query = params.toString();
    return apiFetch<Lead[]>(`/api/leads${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Lead> => {
    return apiFetch<Lead>(`/api/leads/${id}`);
  },

  create: (lead: Partial<Lead>): Promise<Lead> => {
    return apiFetch<Lead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  },

  update: (id: string, updates: Partial<Lead>): Promise<Lead> => {
    return apiFetch<Lead>(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CAMPAIGNS API ====================

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
  workspaceId?: string;
}

export interface CampaignFilters {
  status?: string;
  workspaceId?: string;
}

export const campaignsApi = {
  list: (filters?: CampaignFilters): Promise<Campaign[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId);
    
    const query = params.toString();
    return apiFetch<Campaign[]>(`/api/campaigns${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Campaign> => {
    return apiFetch<Campaign>(`/api/campaigns/${id}`);
  },

  create: (campaign: Partial<Campaign>): Promise<Campaign> => {
    return apiFetch<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  update: (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    return apiFetch<Campaign>(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== SCHEDULES API ====================

export interface Schedule {
  id: string;
  leadId: string;
  leadName: string;
  date: string;
  hour: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
}

export interface ScheduleFilters {
  leadId?: string;
  status?: string;
  date?: string;
}

export const schedulesApi = {
  list: (filters?: ScheduleFilters): Promise<Schedule[]> => {
    const params = new URLSearchParams();
    if (filters?.leadId) params.append('leadId', filters.leadId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    
    const query = params.toString();
    return apiFetch<Schedule[]>(`/api/schedules${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Schedule> => {
    return apiFetch<Schedule>(`/api/schedules/${id}`);
  },

  create: (schedule: Partial<Schedule>): Promise<Schedule> => {
    return apiFetch<Schedule>('/api/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  },

  update: (id: string, updates: Partial<Schedule>): Promise<Schedule> => {
    return apiFetch<Schedule>(`/api/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PROPOSALS API ====================

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

export interface ProposalFilters {
  leadId?: string;
  status?: string;
}

export const proposalsApi = {
  list: (filters?: ProposalFilters): Promise<Proposal[]> => {
    const params = new URLSearchParams();
    if (filters?.leadId) params.append('leadId', filters.leadId);
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString();
    return apiFetch<Proposal[]>(`/api/proposals${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Proposal> => {
    return apiFetch<Proposal>(`/api/proposals/${id}`);
  },

  create: (proposal: Partial<Proposal>): Promise<Proposal> => {
    return apiFetch<Proposal>('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(proposal),
    });
  },
};

// ==================== STATS API ====================

export interface DashboardStats {
  totalLeads: number;
  verifiedLeads: number;
  avgScore: number;
  activeCampaigns: number;
  leadsThisWeek: number;
  conversionRate: number;
  moneyLeft?: number;
}

export interface SourceStats {
  source: string;
  count: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
}

export const statsApi = {
  dashboard: (): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>('/api/stats/dashboard');
  },

  leadsBySource: (): Promise<SourceStats[]> => {
    return apiFetch<SourceStats[]>('/api/stats/leads-by-source');
  },

  scoreDistribution: (): Promise<ScoreDistribution[]> => {
    return apiFetch<ScoreDistribution[]>('/api/stats/score-distribution');
  },
};

// ==================== HEALTH CHECK ====================

export interface HealthStatus {
  status: string;
  db: string;
  timestamp: string;
}

export const healthApi = {
  check: (): Promise<HealthStatus> => {
    return apiFetch<HealthStatus>('/health');
  },
};

// Export all APIs
export const api = {
  leads: leadsApi,
  campaigns: campaignsApi,
  schedules: schedulesApi,
  proposals: proposalsApi,
  stats: statsApi,
  health: healthApi,
};

export default api;
