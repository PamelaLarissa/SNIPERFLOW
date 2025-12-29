import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { freelanceSources, FreelanceSourceCheckbox } from "./FreelancePlatformSources";

export interface AdvancedFiltersData {
  employeeRange: [number, number];
  revenueMin: number;
  revenueMax: number;
  technologies: string[];
  digitalPresence: {
    oldWebsite: boolean;
    noInstagram: boolean;
    adsDisabled: boolean;
  };
  painPoints: {
    lowRating: boolean;
    openComplaints: boolean;
    notMobile: boolean;
  };
  advancedSources: string[];
  tags: string[];
  contentLanguage: string;
  verificationMode: 'email' | 'whatsapp' | 'both';
  searchRadius: number;
  updateFrequency: 'daily' | 'thrice_weekly' | 'weekly';
  approachTemplate: string;
}

export const defaultAdvancedFilters: AdvancedFiltersData = {
  employeeRange: [1, 100],
  revenueMin: 0,
  revenueMax: 50000000,
  technologies: [],
  digitalPresence: {
    oldWebsite: false,
    noInstagram: false,
    adsDisabled: false,
  },
  painPoints: {
    lowRating: false,
    openComplaints: false,
    notMobile: false,
  },
  advancedSources: [],
  tags: [],
  contentLanguage: 'pt-BR',
  verificationMode: 'both',
  searchRadius: 50,
  updateFrequency: 'daily',
  approachTemplate: '',
};

const availableTechnologies = [
  'WordPress', 'Shopify', 'WooCommerce', 'Magento', 'React', 'Vue', 
  'Angular', 'Next.js', 'Laravel', 'Node.js', 'Python', 'PHP',
  'RD Station', 'HubSpot', 'Salesforce', 'Mailchimp', 'Google Analytics'
];

const advancedSourcesList = [
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
}

export const AdvancedFilters = ({ data, onChange }: AdvancedFiltersProps) => {
  const [tagInput, setTagInput] = useState('');

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
    <div className="space-y-6 border-t border-border pt-4 mt-4">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Filtros Avançados
      </h4>

      {/* Faixa de Funcionários */}
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

      {/* Faixa de Faturamento */}
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

      {/* Presença Digital */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Presença Digital</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Site antigo ({'>'}3 anos)</span>
            <Switch
              checked={data.digitalPresence.oldWebsite}
              onCheckedChange={(checked) => 
                updateField('digitalPresence', { ...data.digitalPresence, oldWebsite: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Sem Instagram</span>
            <Switch
              checked={data.digitalPresence.noInstagram}
              onCheckedChange={(checked) => 
                updateField('digitalPresence', { ...data.digitalPresence, noInstagram: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Anúncios desativados</span>
            <Switch
              checked={data.digitalPresence.adsDisabled}
              onCheckedChange={(checked) => 
                updateField('digitalPresence', { ...data.digitalPresence, adsDisabled: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Dor Detectada */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Dor Detectada</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <span className="text-sm">Avaliação {'<'} 3 estrelas</span>
            <Switch
              checked={data.painPoints.lowRating}
              onCheckedChange={(checked) => 
                updateField('painPoints', { ...data.painPoints, lowRating: checked })
              }
            />
          </div>
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
        </div>
      </div>

      {/* Fontes Avançadas (incluindo Freelance) */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Fontes Avançadas</Label>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Plataformas Freelance</p>
          <div className="grid grid-cols-2 gap-2">
            {freelanceSources.map(source => (
              <FreelanceSourceCheckbox
                key={source.id}
                source={source}
                checked={data.advancedSources.includes(source.id)}
                onChange={toggleAdvancedSource}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Outras Fontes</p>
          <div className="flex flex-wrap gap-2">
            {advancedSourcesList.map(source => (
              <Badge
                key={source}
                variant={data.advancedSources.includes(source) ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => toggleAdvancedSource(source)}
              >
                {source}
              </Badge>
            ))}
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
              className={`flex-1 p-2 text-center text-sm rounded-lg border cursor-pointer transition-all ${
                data.verificationMode === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-secondary/50'
              }`}
            >
              <input
                type="radio"
                name="verificationMode"
                value={option.id}
                checked={data.verificationMode === option.id}
                onChange={(e) => updateField('verificationMode', e.target.value as 'email' | 'whatsapp' | 'both')}
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
              className={`flex-1 p-2 text-center text-sm rounded-lg border cursor-pointer transition-all ${
                data.updateFrequency === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-secondary/50'
              }`}
            >
              <input
                type="radio"
                name="updateFrequency"
                value={option.id}
                checked={data.updateFrequency === option.id}
                onChange={(e) => updateField('updateFrequency', e.target.value as 'daily' | 'thrice_weekly' | 'weekly')}
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
    </div>
  );
};
