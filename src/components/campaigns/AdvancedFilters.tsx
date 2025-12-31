import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { freelanceSources, FreelanceSourceCheckbox } from "./FreelancePlatformSources";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface AdvancedFiltersData {
  employeeRange: [number, number];
  revenueMin: number;
  revenueMax: number;
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
}

export const defaultAdvancedFilters: AdvancedFiltersData = {
  employeeRange: [1, 100],
  revenueMin: 0,
  revenueMax: 50000000,
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
};

export const professionalPresets: Record<string, { label: string; subLabel: string; filters: Partial<AdvancedFiltersData> }> = {
  agency: {
    label: 'Agência',
    subLabel: 'Mkt / Social Media',
    filters: {
      digitalPresence: {
        adsStatus: 'all',
        googleQuality: 'low',
        instagramStatus: 'with',
        siteTechnology: 'old',
        pixelStatus: 'with',
        presenceLevel: 'mature',
        infrastructureLevel: 'slow'
      },
      verificationMode: 'both'
    }
  },
  dev: {
    label: 'Programador',
    subLabel: 'Web / App / Systems',
    filters: {
      digitalPresence: {
        adsStatus: 'all',
        googleQuality: 'all',
        instagramStatus: 'all',
        siteTechnology: 'old',
        pixelStatus: 'all',
        presenceLevel: 'precarious',
        infrastructureLevel: 'legacy'
      },
      painPoints: {
        openComplaints: false,
        notMobile: true,
        noChatbot: false
      }
    }
  },
  traffic_manager: {
    label: 'Gestor Tráfego',
    subLabel: 'Ads / ROI / Tracking',
    filters: {
      digitalPresence: {
        adsStatus: 'inactive',
        googleQuality: 'all',
        instagramStatus: 'with',
        siteTechnology: 'modern',
        pixelStatus: 'without',
        presenceLevel: 'mature',
        infrastructureLevel: 'all'
      }
    }
  },
  web_designer: {
    label: 'Web Designer',
    subLabel: 'UI / UX / Redesign',
    filters: {
      digitalPresence: {
        siteTechnology: 'old',
        presenceLevel: 'precarious',
        infrastructureLevel: 'all',
        adsStatus: 'all',
        googleQuality: 'all',
        instagramStatus: 'all',
        pixelStatus: 'all'
      },
      painPoints: {
        notMobile: true,
        openComplaints: false,
        noChatbot: false
      }
    }
  },
  copywriter: {
    label: 'Copywriter',
    subLabel: 'Vendas / Conversão',
    filters: {
      digitalPresence: {
        adsStatus: 'active',
        googleQuality: 'all',
        instagramStatus: 'with',
        siteTechnology: 'all',
        pixelStatus: 'all',
        presenceLevel: 'all',
        infrastructureLevel: 'all'
      },
      advancedSources: ['ReclameAqui']
    }
  },
  automations: {
    label: 'Automações',
    subLabel: 'CRM / Fluxos / API',
    filters: {
      painPoints: {
        noChatbot: true,
        openComplaints: false,
        notMobile: false
      },
      digitalPresence: {
        adsStatus: 'all',
        googleQuality: 'all',
        instagramStatus: 'all',
        siteTechnology: 'modern',
        pixelStatus: 'all',
        presenceLevel: 'mature',
        infrastructureLevel: 'all'
      }
    }
  },
  websites: {
    label: 'WebSites',
    subLabel: 'Landing Pages / LP',
    filters: {
      digitalPresence: {
        presenceLevel: 'none',
        siteTechnology: 'none',
        adsStatus: 'all',
        googleQuality: 'all',
        instagramStatus: 'all',
        pixelStatus: 'all',
        infrastructureLevel: 'all'
      }
    }
  },
  ai_specialist: {
    label: 'IA',
    subLabel: 'GPTs / Agentes',
    filters: {
      painPoints: {
        openComplaints: true,
        notMobile: false,
        noChatbot: true
      },
      digitalPresence: {
        adsStatus: 'active',
        googleQuality: 'all',
        instagramStatus: 'all',
        siteTechnology: 'all',
        pixelStatus: 'all',
        presenceLevel: 'mature',
        infrastructureLevel: 'all'
      }
    }
  }
};

export const availableTechnologies = [
  'WordPress', 'Shopify', 'WooCommerce', 'Magento', 'React', 'Vue',
  'Angular', 'Next.js', 'Laravel', 'Node.js', 'Python', 'PHP',
  'RD Station', 'HubSpot', 'Salesforce', 'Mailchimp', 'Google Analytics'
];

export const advancedSourcesList = [
  'Workana', '99Freelas', 'GetNinjas', 'ReclameAqui', 'SEBRAE',
  'Junta Comercial', 'CNPJ Aberto', 'Google My Business', 'Yelp',
  'Facebook Pages', 'Twitter/X', 'Crunchbase', 'AngelList'
];

const templateOptions = [
  { id: 'cold', name: 'Cold Outreach (Primeira abordagem)' },
  { id: 'followup', name: 'Follow-up (Acompanhamento)' },
  { id: 'reactivation', name: 'Reativação (Cliente antigo)' },
  { id: 'referral', name: 'Indicação (Via parceiro)' },
];

interface AdvancedFiltersProps {
  data: AdvancedFiltersData;
  onChange: (data: AdvancedFiltersData) => void;
  selectedSources?: string[];
}

export const AdvancedFilters = ({ data, onChange, selectedSources = [] }: AdvancedFiltersProps) => {
  const [tagInput, setTagInput] = useState('');
  const [cnaeInput, setCnaeInput] = useState('');

  const updateField = <K extends keyof AdvancedFiltersData>(
    field: K,
    value: AdvancedFiltersData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateField('tags', [...data.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateField('tags', data.tags.filter(t => t !== tag));
  };

  const addCnae = () => {
    if (cnaeInput.trim() && !data.cnaes.includes(cnaeInput.trim())) {
      updateField('cnaes', [...data.cnaes, cnaeInput.trim()]);
      setCnaeInput('');
    }
  };

  const removeCnae = (cnae: string) => {
    updateField('cnaes', data.cnaes.filter(c => c !== cnae));
  };

  const toggleTechnology = (tech: string) => {
    if (data.technologies.includes(tech)) {
      updateField('technologies', data.technologies.filter(t => t !== tech));
    } else {
      updateField('technologies', [...data.technologies, tech]);
    }
  };

  const toggleAdvancedSource = (source: string) => {
    if (data.advancedSources.includes(source)) {
      updateField('advancedSources', data.advancedSources.filter(s => s !== source));
    } else {
      updateField('advancedSources', [...data.advancedSources, source]);
    }
  };

  return (
    <div className="space-y-6">

      {/* Faixa de Funcionários (Contextual: Somente para Google/Maps/LinkedIn) */}
      {(selectedSources.includes('Google') || selectedSources.includes('Maps') || selectedSources.includes('LinkedIn')) && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Faixa de Funcionários: {data.employeeRange[0]} - {data.employeeRange[1]}
          </Label>
          <Slider
            value={data.employeeRange}
            onValueChange={(value) => updateField('employeeRange', value as [number, number])}
            min={1}
            max={500}
            step={5}
            className="mt-2"
          />
        </div>
      )}

      {/* Faixa de Faturamento (Contextual: Google/Maps) */}
      {(selectedSources.includes('Google') || selectedSources.includes('Maps')) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Faturamento Mínimo (R$)</Label>
            <Input
              type="number"
              min={0}
              className="bg-secondary/50"
              value={data.revenueMin}
              onChange={(e) => updateField('revenueMin', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Faturamento Máximo (R$)</Label>
            <Input
              type="number"
              min={0}
              className="bg-secondary/50"
              value={data.revenueMax}
              onChange={(e) => updateField('revenueMax', parseInt(e.target.value) || 0)}
              placeholder="50.000.000"
            />
          </div>
        </div>
      )}

      {/* Dados de Empresa & Inteligência */}
      <div className="space-y-4 pt-2">
        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
          <Settings className="h-3 w-3 text-primary" />
          Inteligência de Negócio
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/5">
            <div className="space-y-0.5">
              <span className="text-sm font-medium">Situação Ativa</span>
              <p className="text-[10px] text-muted-foreground">Filtro de Receita Federal</p>
            </div>
            <Switch
              checked={data.onlyActiveStatus}
              onCheckedChange={(checked) => updateField('onlyActiveStatus', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-primary">Contato Decisor</span>
              <p className="text-[10px] text-muted-foreground">Sócio / Proprietário</p>
            </div>
            <Switch
              checked={data.decisionMakerContact}
              onCheckedChange={(checked) => updateField('decisionMakerContact', checked)}
            />
          </div>
        </div>

        {/* CNAE Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium block">CNAE (Ramo de Atividade)</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Ex: 6201-5/00 ou nome..."
              className="bg-secondary/50"
              value={cnaeInput}
              onChange={(e) => setCnaeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCnae())}
            />
            <Button type="button" variant="outline" size="icon" onClick={addCnae}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.cnaes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.cnaes.map(cnae => (
                <Badge key={cnae} variant="verified" className="pl-2 pr-1">
                  {cnae}
                  <button
                    type="button"
                    onClick={() => removeCnae(cnae)}
                    className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tecnologias Utilizadas */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Tecnologias Utilizadas</Label>
        <div className="flex flex-wrap gap-2">
          {availableTechnologies.map(tech => (
            <Badge
              key={tech}
              variant={data.technologies.includes(tech) ? "default" : "outline"}
              className="cursor-pointer transition-all"
              onClick={() => toggleTechnology(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">

        {/* Presença Digital (Objective Based) */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-primary">Presença Digital</span>
            <p className="text-[10px] text-muted-foreground uppercase">Objetivo da Venda</p>
          </div>
          <ToggleGroup
            type="single"
            value={data.digitalPresence.presenceLevel}
            onValueChange={(value) => value && updateField('digitalPresence', { ...data.digitalPresence, presenceLevel: value as any })}
            className="bg-background/50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="none" className="text-[10px] h-7 px-2">Inexistente (Site Novo)</ToggleGroupItem>
            <ToggleGroupItem value="precarious" className="text-[10px] h-7 px-2">Precária (Reforma)</ToggleGroupItem>
            <ToggleGroupItem value="mature" className="text-[10px] h-7 px-2">Madura (Expansão)</ToggleGroupItem>
            <ToggleGroupItem value="all" className="text-[10px] h-7 px-2">Todas</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Infraestrutura Técnica */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-accent/20 bg-accent/5">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-accent">Infraestrutura Técnica</span>
            <p className="text-[10px] text-muted-foreground uppercase">Dores Técnicas</p>
          </div>
          <ToggleGroup
            type="single"
            value={data.digitalPresence.infrastructureLevel}
            onValueChange={(value) => value && updateField('digitalPresence', { ...data.digitalPresence, infrastructureLevel: value as any })}
            className="bg-background/50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="no_ssl" className="text-[10px] h-7 px-2">Sem SSL</ToggleGroupItem>
            <ToggleGroupItem value="slow" className="text-[10px] h-7 px-2">Lento</ToggleGroupItem>
            <ToggleGroupItem value="legacy" className="text-[10px] h-7 px-2">Defasado</ToggleGroupItem>
            <ToggleGroupItem value="all" className="text-[10px] h-7 px-2">Todas</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Rastreamento (Pixel) */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-verified/20 bg-verified/5">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-verified">Rastreamento & ROI</span>
            <p className="text-[10px] text-muted-foreground uppercase">Foco em Tráfego</p>
          </div>
          <ToggleGroup
            type="single"
            value={data.digitalPresence.pixelStatus}
            onValueChange={(value) => value && updateField('digitalPresence', { ...data.digitalPresence, pixelStatus: value as any })}
            className="bg-background/50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="without" className="text-[10px] h-7 px-2">Sem Pixel (Venda Gestão)</ToggleGroupItem>
            <ToggleGroupItem value="with" className="text-[10px] h-7 px-2">Com Pixel (Venda ROI)</ToggleGroupItem>
            <ToggleGroupItem value="all" className="text-[10px] h-7 px-2">Ambos</ToggleGroupItem>
          </ToggleGroup>
        </div>


        <div className="space-y-3 mt-4">
          {/* Status de Anúncios */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/5">
            <span className="text-sm font-medium">Anúncios</span>
            <ToggleGroup
              type="single"
              value={data.digitalPresence.adsStatus}
              onValueChange={(value) => value && updateField('digitalPresence', { ...data.digitalPresence, adsStatus: value as any })}
            >
              <ToggleGroupItem value="active" className="text-[10px] h-7 px-2">Ativos</ToggleGroupItem>
              <ToggleGroupItem value="inactive" className="text-[10px] h-7 px-2">Inativos</ToggleGroupItem>
              <ToggleGroupItem value="all" className="text-[10px] h-7 px-2">Todos</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Redes Sociais */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/5">
            <span className="text-sm font-medium">Instagram</span>
            <ToggleGroup
              type="single"
              value={data.digitalPresence.instagramStatus}
              onValueChange={(value) => value && updateField('digitalPresence', { ...data.digitalPresence, instagramStatus: value as any })}
            >
              <ToggleGroupItem value="with" className="text-[10px] h-7 px-2">Com</ToggleGroupItem>
              <ToggleGroupItem value="without" className="text-[10px] h-7 px-2">Sem</ToggleGroupItem>
              <ToggleGroupItem value="all" className="text-[10px] h-7 px-2">Ambos</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Outros Critérios */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Outros Critérios</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Reclamações abertas</span>
            <Switch
              checked={data.painPoints.openComplaints}
              onCheckedChange={(checked) =>
                updateField('painPoints', { ...data.painPoints, openComplaints: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Site não-mobile</span>
            <Switch
              checked={data.painPoints.notMobile}
              onCheckedChange={(checked) =>
                updateField('painPoints', { ...data.painPoints, notMobile: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Sem Chatbot/Automação</span>
            <Switch
              checked={data.painPoints.noChatbot}
              onCheckedChange={(checked) =>
                updateField('painPoints', { ...data.painPoints, noChatbot: checked })
              }
            />
          </div>
        </div>
      </div>


      {/* Tags / Palavras-chave */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Tags / Palavras-chave</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Ex: clínica, odontologia..."
            className="bg-secondary/50"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" size="icon" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="pl-2 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Idioma do Conteúdo */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Idioma do Conteúdo</Label>
        <Select
          value={data.contentLanguage}
          onValueChange={(value) => updateField('contentLanguage', value)}
        >
          <SelectTrigger className="bg-secondary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (BR)</SelectItem>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es-ES">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Modo de Verificação */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Modo de Verificação</Label>
        <div className="flex gap-2">
          {[
            { id: 'email', label: 'Somente E-mail OK' },
            { id: 'whatsapp', label: 'Somente WhatsApp OK' },
            { id: 'both', label: 'Ambos' },
          ].map(option => (
            <label
              key={option.id}
              className={`flex-1 p-2 text-center text-sm rounded-lg border cursor-pointer transition-all ${data.verificationMode === option.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-secondary/50'
                }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateField('verificationMode', option.id as 'email' | 'whatsapp' | 'both');
              }}
            >
              <input
                type="radio"
                name="verificationMode"
                value={option.id}
                checked={data.verificationMode === option.id}
                onChange={() => { }}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Intervalo de Busca (km) */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Intervalo de Busca: {data.searchRadius} km
        </Label>
        <Slider
          value={[data.searchRadius]}
          onValueChange={(value) => updateField('searchRadius', value[0])}
          min={0}
          max={200}
          step={5}
          className="mt-2"
        />
      </div>

      {/* Frequência de Atualização */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Frequência de Atualização</Label>
        <div className="flex gap-2">
          {[
            { id: 'daily', label: 'Diária' },
            { id: 'thrice_weekly', label: '3× semana' },
            { id: 'weekly', label: 'Semanal' },
          ].map(option => (
            <label
              key={option.id}
              className={`flex-1 p-2 text-center text-sm rounded-lg border cursor-pointer transition-all ${data.updateFrequency === option.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-secondary/50'
                }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateField('updateFrequency', option.id as 'daily' | 'thrice_weekly' | 'weekly');
              }}
            >
              <input
                type="radio"
                name="updateFrequency"
                value={option.id}
                checked={data.updateFrequency === option.id}
                onChange={() => { }}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Template de Abordagem */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Template de Abordagem</Label>
        <Select
          value={data.approachTemplate}
          onValueChange={(value) => updateField('approachTemplate', value)}
        >
          <SelectTrigger className="bg-secondary/50">
            <SelectValue placeholder="Selecione um template..." />
          </SelectTrigger>
          <SelectContent>
            {templateOptions.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div >
  );
};
