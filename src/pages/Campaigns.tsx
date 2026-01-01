import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Settings,
  Trash2,
  MapPin,
  Target,
  BarChart3,
  Bot,
  Sparkles,
  Globe,
  Instagram as InstaIcon,
  Search as SearchIcon,
  MousePointer2,
  Palette,
  Workflow,
  Layout,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle,
  Building2,
  Code2,
  PenTool,
  ArrowRight,
  ArrowLeft,
  Zap,
  Crosshair,
  User,
  Lightbulb,
  Briefcase,
  X,
  Gauge,
  Layers,
  Globe2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdvancedFilters,
  type AdvancedFiltersData,
  defaultAdvancedFilters,
  professionalPresets,
} from "@/components/campaigns/AdvancedFilters";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, type Campaign } from "@/hooks/useCampaigns";
import { useMessageVariants } from "@/hooks/useMessageVariants";
import { useLeads } from "@/hooks/useLeads";

// --- INTELLIGENCE DATA ---
const detailedSources = [
  { name: 'Google', icon: Globe, color: 'text-blue-500', details: ['Visibilidade Orgânica / SEO', 'Domínio e Autoridade', 'Tecnologias do Site', 'Páginas Indexadas'] },
  { name: 'Maps', icon: MapPin, color: 'text-red-500', details: ['Visibilidade Local', 'Reviews e Reputação', 'SEO Local (Pack)', 'Horários e Fotos'] },
  { name: 'LinkedIn', icon: Globe, color: 'text-sky-600', details: ['Decisores e Sócios', 'Tamanho da Empresa', 'Vagas em Aberto', 'Newsletters Recentes'] },
  { name: 'Instagram', icon: InstaIcon, color: 'text-pink-500', details: ['Engajamento e Seguidores', 'Frequência de Posts', 'Qualidade Visual', 'Links na Bio'] },
  { name: 'Junta Comercial', icon: Globe, color: 'text-slate-600', details: ['Histórico da Empresa', 'Alterações Contratuais', 'Filiais', 'Documentos Oficiais'] },
  { name: 'SEBRAE', icon: Globe, color: 'text-blue-700', details: ['Porte da Empresa', 'Consultorias Realizadas', 'Potencial de Crescimento', 'Programas Participados'] },
  { name: 'ReclameAqui', icon: SearchIcon, color: 'text-orange-600', details: ['Reputação da Marca', 'Principais Reclamações', 'Tempo de Resposta', 'Índice de Solução'] },
  { name: 'Facebook', icon: Globe, color: 'text-blue-600', details: ['Páginas e Grupos', 'Atividade Recente', 'Anúncios Ativos', 'Avaliações de Usuários'] },
  { name: 'Workana', icon: MousePointer2, color: 'text-emerald-500', details: ['Projetos Publicados', 'Ticket Médio', 'Frequência de Contratação', 'Histórico na Plataforma'] },
];

const profileNiches: Record<string, string[]> = {
  agency: ['E-commerce de Moda', 'Clínicas de Estética', 'Imobiliárias', 'Academias'],
  dev: ['Startups SaaS', 'Fintechs', 'Logística', 'E-commerces Grandes'],
  traffic_manager: ['Info-produtos', 'Dropshipping', 'Negócios Locais', 'Delivery'],
  web_designer: ['Advogados', 'Arquitetos', 'Psicólogos', 'Consultórios'],
  copywriter: ['Lançamentos', 'E-mail Marketing', 'Páginas de Vendas', 'Blogs'],
  automations: ['Call Centers', 'Financeiras', 'Atendimento', 'Sistemas'],
  websites: ['Profissionais', 'Pequenos Negócios', 'Prestadores', 'Lojas'],
  ai_specialist: ['Tech Companies', 'Startups', 'Data Science', 'Content'],
  consulting: ['Gestão Empresarial', 'Recursos Humanos', 'Financeiro', 'Processos']
};

// --- DATA FOR SMART RADAR ---
const maturityLevels = [
  { id: 'blue_ocean', label: 'Oceano Azul', desc: 'Baixa digitalização', icon: Globe2 },
  { id: 'scale', label: 'Escala', desc: 'Já investem', icon: BarChart3 },
  { id: 'enterprise', label: 'Enterprise', desc: 'Alta complexidade', icon: Building2 },
];

const ecosystems = [
  { id: 'health', label: 'Saúde e Bem-estar', niches: ['Clínicas', 'Academias', 'Nutricionistas', 'Psicólogos', 'Dentistas'] },
  { id: 'pro_services', label: 'Serviços Profissionais', niches: ['Advogados', 'Contadores', 'Consultores', 'Arquitetos', 'Engenheiros'] },
  { id: 'retail', label: 'Varejo Local', niches: ['Restaurantes', 'Pet Shops', 'Lojas de Roupa', 'Mercados', 'Farmácias'] },
  { id: 'auto', label: 'Automotivo', niches: ['Oficinas', 'Concessionárias', 'Lava-rápidos', 'Auto peças'] },
];

const maturitySuggestions = {
  blue_ocean: ['Borracharias', 'Oficinas Mecânicas', 'Depósitos de Construção', 'Padarias', 'Salões de Beleza'],
  scale: ['Clínicas de Estética', 'Imobiliárias', 'Dentistas', 'Escolas Particulares', 'E-commerces'],
  enterprise: ['Indústrias', 'Logística', 'Hospitais', 'Atacadistas', 'Franquias'],
};

// Mock data for Location Autocomplete
// Initial static data as fallback, will be populated by API
const [brazilLocations, setBrazilLocations] = useState<string[]>([
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Brasília, DF",
  "Curitiba, PR", "Porto Alegre, RS", "Salvador, BA", "Fortaleza, CE",
  "Recife, PE", "Goiânia, GO"
]);

const allNiches = [
  ...new Set([
    ...Object.values(maturitySuggestions).flat(),
    ...Object.values(profileNiches).flat(),
    ...ecosystems.flatMap(e => e.niches)
  ])
].sort();

export const CampaignsPage = () => {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  // Load IBGE Locations
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then(res => res.json())
      .then(data => {
        const locations = data.map((city: any) => `${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`);
        setBrazilLocations(locations.sort());
      })
      .catch(err => console.error("Failed to load IBGE data", err));
  }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW STATES FOR RADAR ---
  const [locationScope, setLocationScope] = useState<'local' | 'national'>('local');
  const [locationRadius, setLocationRadius] = useState([0]); // 0 = Exact
  const [nicheTags, setNicheTags] = useState<string[]>([]);
  const [nicheInput, setNicheInput] = useState("");
  const [maturityLevel, setMaturityLevel] = useState<string>('scale');

  // Autocomplete States
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showNicheSuggestions, setShowNicheSuggestions] = useState(false);

  const [campaignData, setCampaignData] = useState({
    name: "",
    niche: "", // Will be computed from tags
    location: "", // Will be computed from scope + input + radius
    minScore: 50,
    verifiedOnly: false,
    ...defaultAdvancedFilters,
    sources: ["Google", "LinkedIn"] as string[],
    professionalProfiles: [] as string[],
  });

  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedCampaignForSend, setSelectedCampaignForSend] = useState<Campaign | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const { data: variants = [] } = useMessageVariants(selectedCampaignForSend?.id);
  const { data: allLeads = [] } = useLeads();
  const { toast } = useToast();

  const handleSendCampaign = (campaign: Campaign) => {
    setSelectedCampaignForSend(campaign);
    setIsSendDialogOpen(true);
  };

  const confirmSend = async () => {
    if (!selectedCampaignForSend || !selectedVariantId) return;

    const variant = variants.find(v => v.id === selectedVariantId);
    if (!variant) return;

    const campaignLeads = allLeads.filter(l => l.campaignId === selectedCampaignForSend.id);

    if (campaignLeads.length === 0) {
      toast({ title: "Sem Leads", description: "Esta campanha não possui leads para envio.", variant: "destructive" });
      return;
    }

    toast({ title: "Iniciando Disparos", description: `Enviando para ${campaignLeads.length} leads...` });
    setIsSendDialogOpen(false);

    let successCount = 0;
    for (const lead of campaignLeads) {
      try {
        const response = await fetch('http://localhost:3001/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            subject: variant.name || "Prospecção",
            html: variant.text,
            leadId: lead.id,
            leadName: lead.name
          })
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error('Failed to send email to', lead.email, error);
      }
    }

    toast({
      title: "Campanha Finalizada",
      description: `${successCount} de ${campaignLeads.length} e-mails enviados com sucesso.`
    });
  };

  const resetForm = () => {
    setCampaignData({
      name: "",
      niche: "",
      location: "",
      sources: ["Google", "LinkedIn"],
      minScore: 50,
      verifiedOnly: false,
      ...defaultAdvancedFilters,
      professionalProfiles: [],
    });
    setNicheTags([]);
    setNicheInput("");
    setLocationScope('local');
    setLocationRadius([0]);
    setMaturityLevel('scale');
  };

  const handleCreateCampaign = () => {
    // Compute final strings from smart inputs
    const computedNiche = nicheTags.join(', ');
    const computedLocation = locationScope === 'national'
      ? 'Brasil'
      : `${campaignData.location}${locationRadius[0] > 0 ? ` (+${locationRadius[0]}km)` : ''}`;

    createCampaign.mutate({
      name: campaignData.name || 'Nova Campanha',
      niche: computedNiche || 'Não definido',
      location: computedLocation || 'Brasil',
      status: 'active',
      sources: campaignData.sources,
      filters: {
        ...campaignData,
        niche: computedNiche, // Ensure consistency
        location: computedLocation
      },
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditCampaign = () => {
    if (!editingCampaign) return;

    updateCampaign.mutate({
      id: editingCampaign.id,
      updates: {
        name: campaignData.name || editingCampaign.name,
        niche: campaignData.niche || editingCampaign.niche,
        location: campaignData.location || editingCampaign.location,
        sources: campaignData.sources,
        filters: {
          ...campaignData,
        },
      }
    });
    setEditingCampaign(null);
    resetForm();
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign.mutate(id);
    setDeleteConfirm(null);
  };

  const openEditModal = (campaign: Campaign) => {
    setCampaignData({
      name: campaign.name,
      niche: campaign.niche,
      location: campaign.location,
      sources: campaign.sources || [],
      minScore: campaign.filters?.minScore || 50,
      verifiedOnly: campaign.filters?.verifiedOnly || false,
      ...(campaign.filters as unknown as AdvancedFiltersData || defaultAdvancedFilters),
      professionalProfiles: (campaign.filters as any)?.professionalProfiles || [],
    });

    // Try to restore tags from comma separated string
    if (campaign.niche) {
      setNicheTags(campaign.niche.split(',').map(s => s.trim()).filter(Boolean));
    }

    setEditingCampaign(campaign);
  };

  const toggleSource = (source: string) => {
    setCampaignData(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const applyPreset = (profileId: string) => {
    const preset = professionalPresets[profileId] || {
      label: 'Personalizado',
      filters: defaultAdvancedFilters
    };

    setCampaignData(prev => {
      const isSelected = prev.professionalProfiles.includes(profileId);
      let newProfiles = isSelected
        ? prev.professionalProfiles.filter(p => p !== profileId)
        : [...prev.professionalProfiles, profileId];

      if (newProfiles.length === 0) {
        return {
          ...prev,
          professionalProfiles: [],
        };
      }

      let newSources = [...prev.sources];
      const presetSources = profileId === 'dev' ? ['Google', 'Maps'] :
        profileId === 'traffic_manager' ? ['Instagram', 'Facebook Pages'] :
          profileId === 'copywriter' ? ['LinkedIn', 'Workana'] :
            profileId === 'ai_specialist' ? ['GetNinjas', '99Freelas'] :
              profileId === 'automations' ? ['Google', 'LinkedIn'] :
                profileId === 'web_designer' ? ['Maps', 'Instagram'] :
                  profileId === 'websites' ? ['Google', 'Maps'] :
                    profileId === 'consulting' ? ['LinkedIn', 'Google'] :
                      ['Google', 'LinkedIn', 'Maps'];

      if (!isSelected) {
        newSources = Array.from(new Set([...newSources, ...presetSources]));
      }

      return {
        ...prev,
        ...preset.filters,
        professionalProfiles: newProfiles,
        sources: newSources
      };
    });
  };

  const applySearchMode = (mode: 'blitz' | 'sniper') => {
    setCampaignData(prev => ({
      ...prev,
      searchMode: mode,
      searchRadius: mode === 'blitz' ? 100 : 15,
      // Reset or set strict filters could go here
    }));
    toast({ title: `Modo ${mode === 'blitz' ? 'BLITZ' : 'SNIPER'} Ativado`, description: mode === 'blitz' ? 'Alcance máximo, filtros abertos.' : 'Precisão cirúrgica, raio curto.' });
  };

  // --- SMART NICHE HANDLERS ---
  const addNicheTag = (tag: string) => {
    if (!nicheTags.includes(tag)) {
      setNicheTags([...nicheTags, tag]);
    }
    setNicheInput("");
    setShowNicheSuggestions(false);
  };

  const removeNicheTag = (tag: string) => {
    setNicheTags(nicheTags.filter(t => t !== tag));
  };

  const handleNicheKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = nicheInput.trim();
      if (val) addNicheTag(val);
    }
    if (e.key === 'Backspace' && !nicheInput && nicheTags.length > 0) {
      removeNicheTag(nicheTags[nicheTags.length - 1]);
    }
  };

  const toggleEcosystem = (eco: typeof ecosystems[0]) => {
    // Check if all are present
    const allPresent = eco.niches.every(n => nicheTags.includes(n));
    if (allPresent) {
      // Remove all
      setNicheTags(nicheTags.filter(t => !eco.niches.includes(t)));
    } else {
      // Add all (unique)
      const toAdd = eco.niches.filter(n => !nicheTags.includes(n));
      setNicheTags([...nicheTags, ...toAdd]);
    }
  };

  // --- LOCATION AC HANDLERS ---
  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const selectLocation = (loc: string) => {
    setCampaignData(prev => ({ ...prev, location: loc }));
    setShowLocationSuggestions(false);
  };

  const filteredLocations = campaignData.location
    ? brazilLocations.filter(l => normalizeText(l).includes(normalizeText(campaignData.location))).slice(0, 50)
    : brazilLocations.slice(0, 10);

  const filteredNicheSuggestions = nicheInput
    ? allNiches.filter(n => normalizeText(n).includes(normalizeText(nicheInput)) && !nicheTags.includes(n)).slice(0, 10)
    : allNiches.filter(n => !nicheTags.includes(n)).slice(0, 10);

  // Compute suggestions based on Maturity + Profiles
  const getSmartSuggestions = () => {
    let suggestions = new Set<string>();

    // Add maturity based suggestions
    (maturitySuggestions[maturityLevel as keyof typeof maturitySuggestions] || []).forEach(s => suggestions.add(s));

    // Add profile based suggestions
    campaignData.professionalProfiles.forEach(p => {
      (profileNiches[p] || []).forEach(s => suggestions.add(s));
    });

    return Array.from(suggestions).slice(0, 10); // Limit to 10
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Campanhas" subtitle="Carregando..." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Campanhas"
        subtitle="Gerencie suas campanhas de prospecção"
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between"
        >
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanhas..."
              className="pl-10 bg-secondary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="glow" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[95vw] md:max-w-4xl h-[90vh] sm:h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
              <div className="flex h-full overflow-hidden">
                {/* Single View Form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <DialogHeader className="p-4 sm:p-6 pb-2 shrink-0 border-b border-border/50">
                    <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Configurar Míssil de Prospecção
                    </DialogTitle>
                    <DialogDescription>
                      Configuração completa do radar e payload.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="flex-1 px-4 sm:px-6">
                    <div className="py-6 space-y-8">

                      {/* --- SECTION 1: RADAR --- */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                          <Target className="h-5 w-5" />
                          <span className="text-lg">Radar (Alvo)</span>
                        </div>

                        {/* CAMPAIGN NAME */}
                        <div className="space-y-2">
                          <Label>Nome da Campanha</Label>
                          <Input
                            placeholder="Ex: Prospecção Agências"
                            className="bg-secondary/20"
                            value={campaignData.name}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        {/* LOCATION */}
                        <div className="space-y-3 p-4 border rounded-xl bg-secondary/10">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Localização do Alvo
                            </Label>
                            <div className="flex bg-secondary/30 p-1 rounded-lg">
                              <button
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${locationScope === 'local' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setLocationScope('local')}
                              >
                                Local/Regional
                              </button>
                              <button
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${locationScope === 'national' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setLocationScope('national')}
                              >
                                Brasil (Todo País)
                              </button>
                            </div>
                          </div>

                          {locationScope === 'local' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in relative">
                              <div className="flex gap-2 relative">
                                <div className="relative flex-1">
                                  <Input
                                    placeholder="Digite Estado ou Cidade..."
                                    className="bg-background w-full"
                                    value={campaignData.location}
                                    onChange={(e) => {
                                      setCampaignData(prev => ({ ...prev, location: e.target.value }));
                                      setShowLocationSuggestions(true);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                                  />
                                  {/* LOCATION AUTOCOMPLETE DROPDOWN */}
                                  {showLocationSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-50">
                                      {filteredLocations.length > 0 ? (
                                        filteredLocations.map((loc) => (
                                          <div
                                            key={loc}
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                            onMouseDown={() => selectLocation(loc)}
                                          >
                                            {loc}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                          Nenhuma localização encontrada.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Precisão de Localização</span>
                                  <span className="font-bold text-primary">{locationRadius[0] === 0 ? 'Exato' : `+${locationRadius[0]}km`}</span>
                                </div>
                                <Slider
                                  defaultValue={[0]}
                                  max={100}
                                  step={5}
                                  value={locationRadius}
                                  onValueChange={setLocationRadius}
                                  className="py-2"
                                />
                              </div>
                            </div>
                          )}
                          {locationScope === 'national' && (
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 fade-in">
                              <Globe2 className="h-8 w-8 text-primary/50" />
                              <div>
                                <p className="font-bold text-sm text-primary">Busca Nacional Ativada</p>
                                <p className="text-xs text-primary/80">O sistema irá buscar leads em todo o território brasileiro sem restrição de raio.</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CALIBRATION PROFILES - MOVED UP */}
                        <div className="space-y-3 pt-2">
                          <Label className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Perfis para Calibração
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                              { id: 'agency', label: 'Agência', icon: Building2, color: 'text-blue-500' },
                              { id: 'dev', label: 'Programador', icon: Code2, color: 'text-emerald-500' },
                              { id: 'traffic_manager', label: 'Tráfego', icon: BarChart3, color: 'text-amber-500' },
                              { id: 'web_designer', label: 'Designer', icon: Palette, color: 'text-pink-500' },
                              { id: 'copywriter', label: 'Copywriter', icon: PenTool, color: 'text-purple-500' },
                              { id: 'automations', label: 'Automações', icon: Workflow, color: 'text-cyan-500' },
                              { id: 'websites', label: 'WebSites', icon: Layout, color: 'text-orange-500' },
                              { id: 'ai_specialist', label: 'IA', icon: Bot, color: 'text-rose-500' },
                              { id: 'consulting', label: 'Consultoria', icon: Briefcase, color: 'text-slate-500' },
                            ].map((profile) => (
                              <button
                                key={profile.id}
                                type="button"
                                onClick={() => applyPreset(profile.id as any)}
                                className={`flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all h-full ${campaignData.professionalProfiles.includes(profile.id)
                                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                                  : "border-border hover:bg-secondary/50"
                                  }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <profile.icon className={`h-5 w-5 ${campaignData.professionalProfiles.includes(profile.id) ? 'text-primary' : profile.color}`} />
                                  <span className="font-bold text-sm leading-tight">{profile.label}</span>
                                </div>
                                <div className="space-y-1 w-full pl-0.5">
                                  {profileNiches[profile.id]?.slice(0, 4).map((ex, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                        • {ex}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SMART NICHE SELECTION - MOVED DOWN */}
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Seleção de Público (Nichos)
                          </Label>

                          {/* 1. MATURITY SELECTOR */}
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {maturityLevels.map(level => (
                              <div
                                key={level.id}
                                onClick={() => setMaturityLevel(level.id)}
                                className={`cursor-pointer p-2 rounded-lg border flex flex-col items-center text-center gap-1 transition-all ${maturityLevel === level.id ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-background border-border hover:bg-secondary/50'}`}
                              >
                                <level.icon className={`h-4 w-4 ${maturityLevel === level.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="text-xs font-bold">{level.label}</span>
                                <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{level.desc}</span>
                              </div>
                            ))}
                          </div>

                          {/* 2. TAG INPUT + AUTOCOMPLETE */}
                          <div className="p-2 min-h-[42px] border rounded-lg bg-secondary/10 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background relative">
                            {nicheTags.map(tag => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-background border shadow-sm">
                                {tag}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => removeNicheTag(tag)}
                                />
                              </Badge>
                            ))}
                            <div className="relative flex-1 min-w-[120px]">
                              <input
                                className="w-full bg-transparent border-none outline-none text-sm h-6"
                                placeholder={nicheTags.length === 0 ? "Digite nichos (ex: Imobiliárias, Dentistas)..." : ""}
                                value={nicheInput}
                                onChange={(e) => {
                                  setNicheInput(e.target.value);
                                  setShowNicheSuggestions(true);
                                }}
                                onFocus={() => setShowNicheSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowNicheSuggestions(false), 200)}
                                onKeyDown={handleNicheKeyDown}
                              />
                              {/* NICHE AUTOCOMPLETE DROPDOWN */}
                              {showNicheSuggestions && filteredNicheSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
                                  {filteredNicheSuggestions.map((suggestion) => (
                                    <div
                                      key={suggestion}
                                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                      onMouseDown={() => addNicheTag(suggestion)}
                                    >
                                      {suggestion}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 3. ECOSYSTEMS & SMART TAGS */}
                          <div className="space-y-3 mt-2">
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                                <Layers className="h-3 w-3" /> Ecossistemas (Combos)
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {ecosystems.map(eco => (
                                  <Badge
                                    key={eco.id}
                                    variant="outline"
                                    className={`cursor-pointer hover:bg-primary/20 ${eco.niches.every(n => nicheTags.includes(n)) ? 'bg-primary/20 border-primary text-primary' : ''}`}
                                    onClick={() => toggleEcosystem(eco)}
                                  >
                                    {eco.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" /> Sugestões Inteligentes
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {getSmartSuggestions().filter(s => !nicheTags.includes(s)).map(s => (
                                  <Badge
                                    key={s}
                                    variant="secondary"
                                    className="cursor-pointer bg-secondary/30 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors border-0"
                                    onClick={() => addNicheTag(s)}
                                  >
                                    + {s}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* --- SECTION 2: INTELLIGENCE --- */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                          <Zap className="h-5 w-5" />
                          <span className="text-lg">Inteligência de Dados</span>
                        </div>

                        <div className="space-y-3">
                          <Label>Fontes de Dados</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {detailedSources.map((source) => (
                              <button
                                key={source.name}
                                type="button"
                                onClick={() => toggleSource(source.name)}
                                className={`flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all h-full ${campaignData.sources.includes(source.name)
                                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                                  : "border-border hover:bg-secondary/50"
                                  }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <source.icon className={`h-5 w-5 ${campaignData.sources.includes(source.name) ? 'text-primary' : source.color}`} />
                                  <span className="font-bold text-sm leading-tight">{source.name}</span>
                                </div>
                                <div className="space-y-1 w-full">
                                  {source.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <CheckCircle className={`h-3 w-3 ${campaignData.sources.includes(source.name) ? 'text-primary/70' : 'text-muted-foreground'}`} />
                                      <span className="text-[10px] text-muted-foreground font-medium">{detail}</span>
                                    </div>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <AdvancedFilters
                            data={campaignData as unknown as AdvancedFiltersData}
                            onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                            selectedSources={campaignData.sources}
                            section="financial"
                          />
                        </div>
                      </div>

                      {/* --- SECTION 3: PAYLOAD --- */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                          <Crosshair className="h-5 w-5" />
                          <span className="text-lg">Payload (Carga e Filtros)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                            onClick={() => applySearchMode('blitz')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${campaignData.searchMode === 'blitz' ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-5 w-5 text-amber-500" />
                              <span className="font-bold text-lg">Modo BLITZ</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Busca rápida, raio de 100km, filtros abertos. Foco em VOLUME.</p>
                          </div>
                          <div
                            onClick={() => applySearchMode('sniper')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${campaignData.searchMode === 'sniper' ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Crosshair className="h-5 w-5 text-red-500" />
                              <span className="font-bold text-lg">Modo SNIPER</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Busca precisa, raio de 15km, filtros rigorosos. Foco em QUALIDADE.</p>
                          </div>
                        </div>

                        <AdvancedFilters
                          data={campaignData as unknown as AdvancedFiltersData}
                          onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                          selectedSources={campaignData.sources}
                          section="tech"
                        />

                        <div className="space-y-2 pt-4 border-t">
                          <Label>Palavras Negativas</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Franquia, Governo, Filial..."
                              className="bg-secondary/20"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val && !campaignData.negativeKeywords.includes(val)) {
                                    setCampaignData(prev => ({ ...prev, negativeKeywords: [...prev.negativeKeywords, val] }));
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {campaignData.negativeKeywords.map(kw => (
                              <Badge key={kw} variant="destructive" className="cursor-pointer" onClick={() => setCampaignData(prev => ({ ...prev, negativeKeywords: prev.negativeKeywords.filter(k => k !== kw) }))}>
                                - {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="h-10"></div> {/* Bottom Spacer */}
                    </div>
                  </ScrollArea>

                  <DialogFooter className="p-4 sm:p-6 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-sm flex flex-row justify-between items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreateOpen(false)}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      Cancelar
                    </Button>

                    <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending} className="bg-primary hover:bg-primary/90 gap-2 text-xs sm:text-sm px-6">
                      {createCampaign.isPending ? "Lançando..." : "Lançar Míssil"} <Zap className="h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Campaign List Render (Unchanged) */}
        {Object.entries(campaigns.reduce((acc, campaign) => {
          const status = campaign.status;
          if (!acc[status]) acc[status] = [];
          acc[status].push(campaign);
          return acc;
        }, {} as Record<string, Campaign[]>)).map(([status, statusCampaigns]) => (
          <div key={status} className="space-y-4">
            <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
              {status === 'active' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {status === 'active' ? 'Ativas' : status === 'paused' ? 'Pausadas' : 'Concluídas'}
              <span className="text-sm font-normal text-muted-foreground">({statusCampaigns.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {statusCampaigns.map(campaign => (
                <Card key={campaign.id} variant="glass" className="group hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.niche} • {campaign.location}</p>
                        </div>
                        <Badge variant={campaign.status === 'active' ? 'verified' : 'outline'}>{campaign.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-secondary/30 rounded flex flex-col items-center justify-center">
                          <span className="font-bold text-xl">{campaign.leadsFound}</span>
                          <span className="text-xs text-muted-foreground">Leads</span>
                        </div>
                        <div className="p-2 bg-secondary/30 rounded flex flex-col items-center justify-center">
                          <span className="font-bold text-xl">{campaign.leadsVerified}</span>
                          <span className="text-xs text-muted-foreground">Verificados</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(campaign)}>
                          <Settings className="h-4 w-4 mr-2" /> Configurar
                        </Button>
                        <Button variant="default" size="sm" className="flex-1" onClick={() => handleSendCampaign(campaign)}>
                          <Play className="h-4 w-4 mr-2" /> Disparar
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(campaign.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
