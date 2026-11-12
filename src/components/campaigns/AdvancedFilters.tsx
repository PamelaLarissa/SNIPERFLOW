import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Gauge,
  Layers,
  Building2,
  Code2,
  BarChart3,
  Palette,
  PenTool,
  Workflow,
  Layout,
  Bot,
  Briefcase,
  X,
  Sparkles,
  Zap,
  CheckCircle,
  Users,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface AdvancedFiltersData {
  employeeCategories: ('1-10' | '11-50' | '50+')[];
  revenueCategories: ('<100k' | '100k-500k' | '>500k')[];
  technologies: string[];
  digitalPresence: {
    adsStatus: 'all' | 'active' | 'inactive';
    googleQuality: 'all' | 'high' | 'low';
    instagramStatus: 'all' | 'with' | 'without';
    siteTechnology: 'all' | 'modern' | 'old' | 'none';
    pixelStatus: 'all' | 'with' | 'without';
    presenceLevel: 'all' | 'none' | 'precarious' | 'mature';
    infrastructureLevel: 'all' | 'no_ssl' | 'slow' | 'legacy';
  };
  painPoints: {
    openComplaints: boolean;
    notMobile: boolean;
    noChatbot: boolean;
  };
  advancedSources: string[];
  tags: string[];
  contentLanguage: string;
  verificationMode: 'email' | 'whatsapp' | 'both';
  searchRadius: number;
  updateFrequency: 'daily' | 'thrice_weekly' | 'weekly';
  approachTemplate: string;
  professionalProfile?: 'agency' | 'dev' | 'traffic_manager' | 'web_designer' | 'copywriter' | 'automations' | 'websites' | 'ai_specialist';

  decisionMakerContact: boolean;
  onlyActiveStatus: boolean;
  cnaes: string[];
  negativeKeywords: string[];
  searchMode: 'blitz' | 'sniper' | 'custom';
}

export const defaultAdvancedFilters: AdvancedFiltersData = {
  employeeCategories: [],
  revenueCategories: [],
  technologies: [],
  digitalPresence: {
    adsStatus: 'all',
    googleQuality: 'all',
    instagramStatus: 'all',
    siteTechnology: 'all',
    pixelStatus: 'all',
    presenceLevel: 'all',
    infrastructureLevel: 'all',
  },
  painPoints: {
    openComplaints: false,
    notMobile: false,
    noChatbot: false,
  },
  advancedSources: [],
  tags: [],
  contentLanguage: 'pt-BR',
  verificationMode: 'both',
  searchRadius: 50,
  updateFrequency: 'daily',
  approachTemplate: '',
  decisionMakerContact: false,
  onlyActiveStatus: true,
  cnaes: [],
  negativeKeywords: [],
  searchMode: 'custom',
};

export const professionalPresets: Record<string, {
  label: string;
  subLabel: string;
  filters: Partial<Omit<AdvancedFiltersData, 'digitalPresence' | 'painPoints'>> & {
    digitalPresence?: Partial<AdvancedFiltersData['digitalPresence']>;
    painPoints?: Partial<AdvancedFiltersData['painPoints']>;
  }
}> = {
  agency: {
    label: 'Agência',
    subLabel: 'Escala e Gestão',
    filters: {
      technologies: ['RD Station', 'HubSpot', 'Salesforce', 'LinkedIn Ads', 'Meta Ads'],
      digitalPresence: { instagramStatus: 'with', presenceLevel: 'mature' }
    }
  },
  dev: {
    label: 'Programador',
    subLabel: 'Infra e Performance',
    filters: {
      technologies: ['PHP', 'Laravel', 'Node.js', 'Python', 'React', 'Vue', 'Angular', 'Next.js'],
      digitalPresence: { infrastructureLevel: 'legacy' }
    }
  },
  traffic_manager: {
    label: 'Gestor Tráfego',
    subLabel: 'Ads & ROI',
    filters: {
      technologies: ['Facebook Ads (Meta)', 'Google Ads', 'Google Tag Manager', 'Shopify', 'WooCommerce', 'Google Analytics'],
      digitalPresence: { adsStatus: 'active', pixelStatus: 'without' }
    }
  },
  web_designer: {
    label: 'Web Designer',
    subLabel: 'UI/UX e Visual',
    filters: {
      technologies: ['WordPress', 'Shopify', 'Wix', 'Squarespace', 'Magento'],
      digitalPresence: { siteTechnology: 'old' },
      painPoints: { notMobile: true }
    }
  },
  copywriter: {
    label: 'Copywriter',
    subLabel: 'Vendas e Narrativa',
    filters: {
      technologies: ['Mailchimp', 'RD Station', 'HubSpot', 'Hotmart', 'ClickFunnels'],
      digitalPresence: { adsStatus: 'active' }
    }
  },
  automations: {
    label: 'Automações',
    subLabel: 'CRM e Processos',
    filters: {
      technologies: ['RD Station', 'HubSpot', 'Salesforce', 'Mailchimp', 'Zapier', 'Make'],
      digitalPresence: { presenceLevel: 'mature' },
      painPoints: { noChatbot: true }
    }
  },
  websites: {
    label: 'WebSites',
    subLabel: 'Presença Digital',
    filters: {
      technologies: ['WordPress', 'PHP', 'Google Analytics', 'Elementor'],
      digitalPresence: { presenceLevel: 'precarious', siteTechnology: 'old' }
    }
  },
  ai_specialist: {
    label: 'IA Specialist',
    subLabel: 'Bots e Dados',
    filters: {
      technologies: ['Zendesk', 'Intercom', 'HubSpot', 'Salesforce', 'Node.js'],
      digitalPresence: { adsStatus: 'active', presenceLevel: 'mature' },
      painPoints: { openComplaints: true, noChatbot: true }
    }
  },
  consulting: {
    label: 'Consultoria',
    subLabel: 'Estratégia Business',
    filters: {
      technologies: ['Salesforce', 'SAP', 'Oracle', 'HubSpot', 'RD Station'],
      revenueCategories: ['>500k'],
    }
  }
};

export const profileNiches: Record<string, string[]> = {
  agency: ['Contas High-Ticket', 'Dominação Local', 'Gestão de Crise', 'Projetos White Label'],
  dev: ['Sistemas Legados', 'Falhas de Segurança', 'Integração de APIs', 'Apps & Dashboards'],
  traffic_manager: ['Abandono de Pixel', 'Criação de Anúncios', 'Concorrência Agressiva', 'Escala B2B'],
  web_designer: ['Retrofit Digital', 'Identidade Visual', 'Design de Ofertas', 'Social Media Aesthetic'],
  copywriter: ['Quebra de Objeção', 'Funis de vendas', 'VSL & Vídeo Sales', 'Scripts de Prospecção'],
  automations: ['Triagem de WhatsApp', 'Recuperação de Carrinho', 'Sincronização de CRM', 'Workflow de Vendas'],
  websites: ['Oceano Azul (Sem Site)', 'Migração de Plataforma', 'Otimização de SEO', 'E-commerce'],
  ai_specialist: ['Atendimento 24/7', 'Agentes Analistas', 'Fluxos Cognitivos', 'Automação de Conteúdo'],
  consulting: ['Eficiência Financeira', 'Expansão de Mercado', 'Recrutamento Ativo', 'Planejamento 360º']
};

export const profileInfos = [
  { id: 'agency', label: 'Agência', sub: 'Foco: Escala e Gestão', icon: Building2, color: 'text-blue-500' },
  { id: 'dev', label: 'Programador', sub: 'Foco: Infra e Performance', icon: Code2, color: 'text-emerald-500' },
  { id: 'traffic_manager', label: 'Tráfego', sub: 'Foco: Ads e ROI', icon: BarChart3, color: 'text-amber-500' },
  { id: 'web_designer', label: 'Designer', sub: 'Foco: UI/UX e Visual', icon: Palette, color: 'text-pink-500' },
  { id: 'copywriter', label: 'Copywriter', sub: 'Foco: Vendas e Narrativa', icon: PenTool, color: 'text-purple-500' },
  { id: 'automations', label: 'Automações', sub: 'Foco: CRM e Processos', icon: Workflow, color: 'text-cyan-500' },
  { id: 'websites', label: 'WebSites', sub: 'Foco: Presença Digital', icon: Layout, color: 'text-orange-500' },
  { id: 'ai_specialist', label: 'IA Specialist', sub: 'Foco: Bots e Dados', icon: Bot, color: 'text-rose-500' },
  { id: 'consulting', label: 'Consultoria', sub: 'Foco: Estratégia Business', icon: Briefcase, color: 'text-slate-500' },
];

const eliteOpportunities: {
  id: string;
  label: string;
  icon: any;
  color: string;
  description: string;
  explanation: string;
  filters: {
    digitalPresence?: Partial<AdvancedFiltersData['digitalPresence']>;
    painPoints?: Partial<AdvancedFiltersData['painPoints']>;
    technologies?: string[];
    advancedSources?: string[];
    revenueMin?: number;
    revenueMax?: number;
  };
}[] = [
    {
      id: 'agency',
      label: 'Agência (Escala)',
      icon: Building2,
      color: 'text-blue-500',
      description: 'Grandes contas e gestão de tráfego avançada.',
      explanation: 'Foco em RD Station, HubSpot e rastreadores de anúncios (LinkedIn/Meta).',
      filters: {
        technologies: ['RD Station', 'HubSpot', 'Salesforce', 'LinkedIn Ads', 'Meta Ads'],
        digitalPresence: { instagramStatus: 'with', presenceLevel: 'mature' }
      }
    },
    {
      id: 'dev',
      label: 'Programador (Infra)',
      icon: Code2,
      color: 'text-green-500',
      description: 'Sistemas legados e stacks técnicas de alta performance.',
      explanation: 'Mantém a estrutura técnica precisa: Laravel, Node, React, Next.js.',
      filters: {
        technologies: ['PHP', 'Laravel', 'Node.js', 'Python', 'React', 'Vue', 'Angular', 'Next.js'],
        digitalPresence: { infrastructureLevel: 'legacy' }
      }
    },
    {
      id: 'traffic_manager',
      label: 'Tráfego (Ads & ROI)',
      icon: BarChart3,
      color: 'text-amber-500',
      description: 'Investimento em Ads com falhas de rastreamento.',
      explanation: 'Foca em Google/Meta Ads e GTM para otimizar o ROI do cliente.',
      filters: {
        technologies: ['Facebook Ads (Meta)', 'Google Ads', 'Google Tag Manager', 'Shopify', 'WooCommerce', 'Google Analytics'],
        digitalPresence: { adsStatus: 'active', pixelStatus: 'without' }
      }
    },
    {
      id: 'web_designer',
      label: 'Designer (UI/UX)',
      icon: Palette,
      color: 'text-purple-500',
      description: 'Redesign profissional em plataformas populares.',
      explanation: 'Alvos fáceis para redesign: WordPress, Wix, Squarespace, Shopify.',
      filters: {
        technologies: ['WordPress', 'Shopify', 'Wix', 'Squarespace', 'Magento'],
        painPoints: { notMobile: true },
        digitalPresence: { siteTechnology: 'old' }
      }
    },
    {
      id: 'copywriter',
      label: 'Copywriter (Vendas)',
      icon: PenTool,
      color: 'text-orange-500',
      description: 'Funis de vendas e e-mail marketing sem conversão.',
      explanation: 'Foca em ferramentas de funil (ClickFunnels) e CRM (RD, HubSpot).',
      filters: {
        technologies: ['Mailchimp', 'RD Station', 'HubSpot', 'Hotmart', 'ClickFunnels'],
        digitalPresence: { adsStatus: 'active' }
      }
    },
    {
      id: 'automations',
      label: 'Automações (CRM)',
      icon: Workflow,
      color: 'text-cyan-500',
      description: 'Processos internos manuais em empresas maduras.',
      explanation: 'Identifica uso de Zapier/Make para automação de CRM e Fluxos.',
      filters: {
        technologies: ['RD Station', 'HubSpot', 'Salesforce', 'Mailchimp', 'Zapier', 'Make'],
        digitalPresence: { presenceLevel: 'mature' },
        painPoints: { noChatbot: true }
      }
    },
    {
      id: 'websites',
      label: 'WebSites (Presença)',
      icon: Layout,
      color: 'text-pink-500',
      description: 'Otimização de performance e conversão visual.',
      explanation: 'Foco em Elementor e WordPress para vender otimização de sites lentos.',
      filters: {
        technologies: ['WordPress', 'PHP', 'Google Analytics', 'Elementor'],
        digitalPresence: { presenceLevel: 'precarious', siteTechnology: 'old' }
      }
    },
    {
      id: 'ai_specialist',
      label: 'IA Specialist (Bots)',
      icon: Bot,
      color: 'text-indigo-500',
      description: 'Atendimento precário em empresas com alto volume.',
      explanation: 'Filtra Zendesk/Intercom e reclamações para vender IAs de atendimento.',
      filters: {
        technologies: ['Zendesk', 'Intercom', 'HubSpot', 'Salesforce', 'Node.js'],
        painPoints: { openComplaints: true, noChatbot: true }
      }
    },
    {
      id: 'consulting',
      label: 'Consultoria (Biz)',
      icon: Briefcase,
      color: 'text-red-500',
      description: 'Leads Enterprise (Grandes Corporações).',
      explanation: 'Atrai empresas que usam SAP/Oracle e precisam de estratégia business.',
      filters: {
        technologies: ['Salesforce', 'SAP', 'Oracle', 'HubSpot', 'RD Station'],
        revenueMin: 1000000,
        advancedSources: ['LinkedIn']
      }
    }
  ];

export const availableTechnologies = [
  'WordPress', 'Shopify', 'WooCommerce', 'Magento', 'React', 'Vue',
  'Angular', 'Next.js', 'Laravel', 'Node.js', 'Python', 'PHP',
  'RD Station', 'HubSpot', 'Salesforce', 'Mailchimp', 'Google Analytics'
];

interface AdvancedFiltersProps {
  data: AdvancedFiltersData;
  onChange: (data: AdvancedFiltersData) => void;
  selectedSources?: string[];
  section?: 'sensors' | 'filters' | 'tech' | 'financial';
  // Props for unified sensor loop
  onProfileToggle?: (id: string) => void;
  activeProfiles?: string[];
}

export const AdvancedFilters = ({
  data,
  onChange,
  section = 'sensors',
  onProfileToggle,
  activeProfiles = []
}: AdvancedFiltersProps) => {

  const updateField = <K extends keyof AdvancedFiltersData>(
    field: K,
    value: AdvancedFiltersData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const toggleTechnology = (tech: string) => {
    if (data.technologies.includes(tech)) {
      updateField('technologies', data.technologies.filter(t => t !== tech));
    } else {
      updateField('technologies', [...data.technologies, tech]);
    }
  };

  const applyEliteFilter = (opportunity: typeof eliteOpportunities[0]) => {
    // FIX: If the profile is active, toggling the sensor should toggle the profile for precision
    if (activeProfiles.includes(opportunity.id)) {
      onProfileToggle?.(opportunity.id);
      return;
    }

    const newData = { ...data };
    const isActive = isEliteActive(opportunity);

    if (isActive) {
      // DE-SELECTING: Remove filters
      if (opportunity.filters.technologies) {
        newData.technologies = newData.technologies.filter(t => !opportunity.filters.technologies!.includes(t));
      }

      if (opportunity.filters.digitalPresence) {
        // Reset only the fields that were set by this opportunity back to default
        const newDP = { ...newData.digitalPresence };
        Object.keys(opportunity.filters.digitalPresence).forEach((key) => {
          (newDP as any)[key] = (defaultAdvancedFilters.digitalPresence as any)[key];
        });
        newData.digitalPresence = newDP;
      }

      if (opportunity.filters.painPoints) {
        const newPP = { ...newData.painPoints };
        Object.keys(opportunity.filters.painPoints).forEach((key) => {
          (newPP as any)[key] = (defaultAdvancedFilters.painPoints as any)[key];
        });
        newData.painPoints = newPP;
      }

      // Note: mapping revenue/employees back to categories for de-selection
      if (opportunity.filters.revenueMin !== undefined) {
        // Simplified: if it set a revenue min, we could uncheck some categories
        // But for now let's just clear categories if it matches
        newData.revenueCategories = [];
      }

    } else {
      // SELECTING: Apply filters (existing logic)
      if (opportunity.filters.digitalPresence) {
        newData.digitalPresence = { ...newData.digitalPresence, ...opportunity.filters.digitalPresence } as any;
      }

      if (opportunity.filters.painPoints) {
        newData.painPoints = { ...newData.painPoints, ...opportunity.filters.painPoints } as any;
      }

      if (opportunity.filters.technologies) {
        const currentTechs = new Set(newData.technologies);
        opportunity.filters.technologies.forEach(t => currentTechs.add(t));
        newData.technologies = Array.from(currentTechs);
      }

      if (opportunity.filters.advancedSources) {
        const currentSources = new Set(newData.advancedSources);
        opportunity.filters.advancedSources.forEach(s => currentSources.add(s));
        newData.advancedSources = Array.from(currentSources);
      }

      if (opportunity.filters.revenueMin !== undefined) {
        // Map numeric revenue to categories
        if (opportunity.filters.revenueMin >= 1000000) newData.revenueCategories = ['>500k'];
        else if (opportunity.filters.revenueMin >= 100000) newData.revenueCategories = ['100k-500k'];
        else newData.revenueCategories = ['<100k'];
      }
    }

    onChange(newData);
  };

  const isEliteActive = (opportunity: typeof eliteOpportunities[0]) => {
    // Check if the profile ID matches the currently active professional profiles
    const profileActive = activeProfiles.includes(opportunity.id);
    if (profileActive) return true;

    const dpOk = !opportunity.filters.digitalPresence || Object.entries(opportunity.filters.digitalPresence).every(([k, v]) => (data.digitalPresence as any)[k] === v);
    const ppOk = !opportunity.filters.painPoints || Object.entries(opportunity.filters.painPoints).every(([k, v]) => (data.painPoints as any)[k] === v);
    const techOk = !opportunity.filters.technologies || opportunity.filters.technologies.every(t => data.technologies.includes(t));

    // Check if the categorical filters match the profile requirements
    let revOk = true;
    if (opportunity.filters.revenueMin !== undefined) {
      if (opportunity.filters.revenueMin >= 1000000) revOk = data.revenueCategories.includes('>500k');
      else if (opportunity.filters.revenueMin >= 100000) revOk = data.revenueCategories.includes('100k-500k');
    }

    return dpOk && ppOk && techOk && revOk;
  };

  return (
    <div className="space-y-6">
      {/* 1. CALIBRATION CENTER (Profiles + Sensors Integrated) */}
      {(section === 'sensors' || section === 'tech') && (
        <div className="space-y-4 p-4 border rounded-xl bg-secondary/10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {eliteOpportunities.map((opp) => {
              const active = isEliteActive(opp);
              const profile = profileInfos.find(p => p.id === opp.id);
              const isProfileSelected = activeProfiles.includes(opp.id);

              return (
                <div key={opp.id} className="flex flex-col gap-2 h-full">
                  {/* TOP: PROFILE CALIBRATION CARD */}
                  {profile && (
                    <button
                      type="button"
                      onClick={() => onProfileToggle?.(opp.id)}
                      className={`flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all relative overflow-hidden ${isProfileSelected
                        ? "border-accent bg-accent/10 ring-1 ring-accent shadow-sm"
                        : "border-border hover:bg-secondary/50"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1 w-full">
                        <profile.icon className={`h-5 w-5 ${isProfileSelected ? 'text-accent' : profile.color}`} />
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-base leading-snug">{profile.label}</span>
                          <span className="text-xs text-muted-foreground font-semibold">{profile.sub}</span>
                        </div>
                        {isProfileSelected && <CheckCircle className="h-4 w-4 text-accent ml-auto flex-shrink-0" />}
                      </div>
                      <div className="space-y-1.5 w-full pl-0.5">
                        {profileNiches[opp.id]?.slice(0, 4).map((ex, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              • {ex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </button>
                  )}

                  {/* BOTTOM: ELITE SENSOR CARD */}
                  <div
                    onClick={() => applyEliteFilter(opp)}
                    className={`flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all flex-1 h-full cursor-pointer relative overflow-hidden ${active
                      ? "border-accent bg-accent/15 ring-2 ring-accent/20 shadow-lg shadow-accent/5 scale-[1.02] z-20"
                      : "border-border hover:bg-secondary/50"
                      }`}
                  >
                    {/* Status Indicator at the very bottom/edge */}
                    <div className={`absolute top-0 right-0 px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-bl-lg transition-colors ${active ? 'bg-accent text-accent-foreground animate-pulse' : 'bg-secondary text-muted-foreground'}`}>
                      {active ? 'Sensor Ativo' : 'Offline'}
                    </div>

                    <div className="space-y-3 w-full flex-1">
                      <div className="space-y-1">
                        <span className={`text-xs font-black uppercase tracking-wider block ${active ? 'text-accent' : 'text-muted-foreground'}`}>Filtro de Dor:</span>
                        <p className="text-sm text-foreground font-extrabold leading-relaxed italic">“{opp.description}”</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className={`text-xs font-black uppercase tracking-wider block ${active ? 'text-accent' : 'text-muted-foreground'}`}>Stack Alvo:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {opp.filters.technologies?.map(t => (
                            <span key={t} className={`text-[10px] border px-2 py-1 rounded font-black transition-colors ${active ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-secondary/80 text-secondary-foreground border-border/50'}`}>{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className={`pt-3 border-t space-y-1.5 ${active ? 'border-accent/20' : 'border-accent/5'}`}>
                        <span className={`text-xs font-black uppercase tracking-wider block ${active ? 'text-accent' : 'text-muted-foreground'}`}>Inteligência:</span>
                        <p className="text-sm leading-tight text-muted-foreground font-semibold">{opp.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INTELIGÊNCIA DE NEGÓCIO & CONFIGS */}
      {(section === 'filters' || section === 'financial') && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                <div className="space-y-1">
                  <span className="text-base font-bold">Status Operacional (RF)</span>
                  <p className="text-xs text-muted-foreground font-medium">Ocultar baixas/inativas</p>
                </div>
                <Switch checked={data.onlyActiveStatus} onCheckedChange={(checked) => updateField('onlyActiveStatus', checked)} />
              </div>
              {/* Decisores (Switch) */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50 hover:bg-secondary/20 transition-all cursor-pointer" onClick={() => updateField('decisionMakerContact', !data.decisionMakerContact)}>
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg bg-accent/10 text-accent`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-black">Alvos de Alto Valor (Decisores)</p>
                    <p className="text-xs text-muted-foreground font-medium">Filtra contatos de sócios e diretores</p>
                  </div>
                </div>
                <Switch checked={data.decisionMakerContact} onCheckedChange={(val) => updateField('decisionMakerContact', val)} />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-bold">Protocolo de Varredura</Label>
                <div className="flex gap-2">
                  <Select value={data.verificationMode} onValueChange={(value) => updateField('verificationMode', value as any)}>
                    <SelectTrigger className="bg-secondary/50 flex-1 h-11 text-sm font-semibold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both" className="text-sm">E-mail + WhatsApp</SelectItem>
                      <SelectItem value="email" className="text-sm">Só E-mail</SelectItem>
                      <SelectItem value="whatsapp" className="text-sm">Só Whats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-bold">Cadência de Reconhecimento</Label>
                <ToggleGroup
                  type="single"
                  value={data.updateFrequency}
                  onValueChange={(value) => value && updateField('updateFrequency', value as any)}
                  className="bg-secondary/30 p-1.5 rounded-lg w-full"
                >
                  <ToggleGroupItem value="daily" className="text-sm font-bold flex-1 data-[state=on]:bg-transparent data-[state=on]:border-2 data-[state=on]:border-accent data-[state=on]:text-accent">Diária</ToggleGroupItem>
                  <ToggleGroupItem value="thrice_weekly" className="text-sm font-bold flex-1 data-[state=on]:bg-transparent data-[state=on]:border-2 data-[state=on]:border-accent data-[state=on]:text-accent">3x/Sem</ToggleGroupItem>
                  <ToggleGroupItem value="weekly" className="text-sm font-bold flex-1 data-[state=on]:bg-transparent data-[state=on]:border-2 data-[state=on]:border-accent data-[state=on]:text-accent">Semanal</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
