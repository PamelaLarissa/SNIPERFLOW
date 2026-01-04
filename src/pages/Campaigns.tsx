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
  Globe2,
  Database,
  Utensils,
  GraduationCap,
  Car,
  Home,
  ShoppingBag,
  Stethoscope,
  Scale,
  Scissors,
  Factory,
  Truck,
  Camera,
  Users
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { citiesList } from "@/data/brazilCities";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  profileNiches,
  profileInfos
} from "@/components/campaigns/AdvancedFilters";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, type Campaign } from "@/hooks/useCampaigns";
import { useMessageVariants } from "@/hooks/useMessageVariants";
import { useLeads } from "@/hooks/useLeads";
import { useSearchParams, Link } from "react-router-dom";

// --- INTELLIGENCE DATA ---
const detailedSources = [
  { name: 'Google', icon: Globe, color: 'text-blue-500', details: ['Visibilidade Orgânica / SEO', 'Domínio e Autoridade', 'Tecnologias do Site', 'Páginas Indexadas'] },
  { name: 'Maps', icon: MapPin, color: 'text-red-500', details: ['Visibilidade Local', 'Reviews e Reputação', 'SEO Local (Pack)', 'Horários e Fotos'] },
  { name: 'LinkedIn', icon: Globe, color: 'text-sky-600', details: ['Decisores e Sócios', 'Tamanho da Empresa', 'Vagas em Aberto', 'Investimento em Ads'] },
  { name: 'Instagram', icon: InstaIcon, color: 'text-pink-500', details: ['Engajamento e Seguidores', 'Frequência de Posts', 'Qualidade Visual', 'Links na Bio'] },
  { name: 'Junta Comercial', icon: Globe, color: 'text-slate-600', details: ['Histórico da Empresa', 'Capital Social / Porte', 'Filiais', 'Documentos Oficiais'] },
  { name: 'SEBRAE', icon: Globe, color: 'text-blue-700', details: ['Porte da Empresa', 'Nível de Maturidade Digital', 'Potencial de Crescimento', 'Programas Participados'] },
  { name: 'ReclameAqui', icon: SearchIcon, color: 'text-orange-600', details: ['Reputação da Marca', 'Principais Reclamações', 'Tempo de Resposta', 'Índice de Solução'] },
  { name: 'Facebook', icon: Globe, color: 'text-blue-600', details: ['Pixel e Rastreamento', 'Atividade Recente', 'Anúncios Ativos', 'Avaliações de Usuários'] },
  { name: 'Workana', icon: MousePointer2, color: 'text-emerald-500', details: ['Projetos Publicados', 'Ticket Médio', 'Frequência de Contratação', 'Tecnologias Contratadas'] },
];

// profileNiches and profileInfos have been moved to AdvancedFilters.tsx


// Mock data for Location Autocomplete
// Initial static data as fallback, will be populated by API
// Initial empty array, to be populated by API inside component
// const brazilLocations is removed from here to be state inside component

const ecosystems = [
  { id: 'health', label: 'Saúde e Bem-estar', icon: Stethoscope, niches: ['Academias / Crossfit', 'Consultórios Médicos', 'Clínicas Médicas', 'Clínicas de Estética', 'Dentistas', 'Nutricionistas', 'Psicólogos', 'Laboratórios', 'Fisioterapeutas', 'Veterinários'] },
  { id: 'legal', label: 'Jurídico e Financeiro', icon: Scale, niches: ['Advocacia', 'Contabilidade', 'Consultoria', 'Seguros', 'Cartórios', 'Peritos', 'Despachantes', 'Cobrança', 'Investimentos', 'Auditoria'] },
  { id: 'retail', label: 'Varejo Local', icon: ShoppingBag, niches: ['Shopping Centers', 'Pet Shops', 'Lojas de Roupas', 'Floriculturas', 'Supermercados', 'Óticas', 'Joalherias', 'Calçados', 'Materiais Constr.', 'Papelarias'] },
  { id: 'food', label: 'Gastronomia', icon: Utensils, niches: ['Mercearias / Minimercados', 'Restaurantes', 'Hamburguerias', 'Pizzarias', 'Padarias', 'Bares', 'Cafeterias', 'Buffets', 'Delivery', 'Confeitarias'] },
  { id: 'auto', label: 'Automotivo', icon: Car, niches: ['Mecânicas', 'Concessionárias', 'Lojas de Pneus', 'Estética Auto', 'Auto Peças', 'Locadoras', 'Blindadoras', 'Vistorias', 'Funilarias', 'Auto Elétrica'] },
  { id: 'real_estate', label: 'Imobiliário e Casa', icon: Home, niches: ['Imobiliárias', 'Construtoras', 'Arquitetos', 'Móveis', 'Energia Solar', 'Marcenarias', 'Decoradores', 'Condomínios', 'Engenharia', 'Paisagismo'] },
  { id: 'education', label: 'Educação e Ensino', icon: GraduationCap, niches: ['Escolas (Pv)', 'Idiomas', 'Faculdades', 'Cursos Livres', 'Treinamentos', 'Música', 'Creches', 'Reforço', 'EAD / Online', 'Intercâmbio'] },
  { id: 'beauty', label: 'Beleza e Serviços', icon: Scissors, niches: ['Salões Beleza', 'Barbearias', 'Spas', 'Tatuagem', 'Depilação', 'Manicures', 'Sobrancelhas', 'Maquiadores', 'Podologia', 'Massagem'] },
  { id: 'b2b', label: 'Indústria e B2B', icon: Factory, niches: ['Indústrias', 'Atacadistas', 'Distribuidores', 'Móveis (Fab)', 'Têxtil', 'Usinas', 'Metalúrgicas', 'Gráficas', 'Embalagens', 'Brindes Corp.'] },
  { id: 'tech', label: 'Tecnologia e Startups', icon: Code2, niches: ['Software', 'Startups', 'Marketing', 'Internet (ISP)', 'Consultoria TI', 'Data Centers', 'E-commerce', 'SaaS', 'Telecom', 'Infoprodutos'] },
  { id: 'logistics', label: 'Logística e Transportes', icon: Truck, niches: ['Transportadoras', 'Mudanças', 'Log. Reversa', 'Entregas', 'Armazéns', 'Guinchos', 'Import/Export', 'Frota', 'Portos/Aéreo', 'Motoboy'] },
  { id: 'events', label: 'Eventos e Turismo', icon: Camera, niches: ['Turismo', 'Casas de Festas', 'Organizadores', 'Hotéis', 'Fotógrafos', 'Vídeo', 'Buffet Infantil', 'Decoração', 'DJs e Bandas', 'Formaturas'] },
];

const allNiches: string[] = [
  ...new Set([
    ...Object.values(profileNiches).flat(),
    ...ecosystems.flatMap(e => e.niches)
  ])
].sort();

interface CampaignState extends AdvancedFiltersData {
  name: string;
  niche: string;
  locations: string[];
  tempLocation: string;
  minScore: number;
  verifiedOnly: boolean;
  sources: string[];
  professionalProfiles: string[];
}

export const CampaignsPage = () => {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || "all";
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const step3Ref = useRef<HTMLDivElement>(null);

  // --- IBGE LOCATIONS STATE ---
  // Initialize with local comprehensive list
  const [brazilLocations, setBrazilLocations] = useState<string[]>(citiesList);

  // Load IBGE Locations (Update/Hydrate)
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then(res => res.json())
      .then(data => {
        const locations = data.map((city: any) => `${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`);
        // Merge with local list to ensure no duplicates but maximize coverage
        // Using Set to deduplicate
        setBrazilLocations(prev => {
          const combined = new Set([...prev, ...locations]);
          return Array.from(combined).sort();
        });
      })
      .catch(err => {
        console.error("Failed to load IBGE data, using local fallback", err);
        // Fallback is already set, no action needed
      });
  }, []);



  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW STATES FOR RADAR ---
  const [locationScope, setLocationScope] = useState<'local' | 'national'>('local');
  const [locationRadius, setLocationRadius] = useState([0]); // 0 = Exact
  const [nicheTags, setNicheTags] = useState<string[]>([]);
  const [nicheInput, setNicheInput] = useState("");

  // Autocomplete States
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showNicheSuggestions, setShowNicheSuggestions] = useState(false);

  const [campaignData, setCampaignData] = useState<CampaignState>({
    name: "",
    niche: "", // Will be computed from tags
    locations: [] as string[], // Multi-select support
    tempLocation: "", // For the input field
    minScore: 50,
    verifiedOnly: false,
    ...defaultAdvancedFilters,
    sources: ["Google", "LinkedIn"] as string[],
    professionalProfiles: [] as string[],
  });

  const [highlightedSources, setHighlightedSources] = useState<string[]>([]);

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
      toast({ title: "Sem Alvos", description: "Esta campanha não possui alvos para envio.", variant: "destructive" });
      return;
    }

    toast({ title: "Iniciando Disparos", description: `Enviando para ${campaignLeads.length} alvos...` });
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
      locations: [],
      tempLocation: "",
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
  };

  const handleCreateCampaign = () => {
    // Compute final strings from smart inputs
    const computedNiche = nicheTags.join(', ');
    const computedLocation = locationScope === 'national'
      ? 'Brasil'
      : `${campaignData.locations.join(', ')}${locationRadius[0] > 0 ? ` (+${locationRadius[0]}km)` : ''}`;

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
      } as any,
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
        location: `${campaignData.locations.join(', ')}${locationRadius[0] > 0 ? ` (+${locationRadius[0]}km)` : ''}`,
        sources: campaignData.sources,
        filters: {
          ...campaignData,
        },
      }
    });
    setEditingCampaign(null);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign.mutate(id);
    setDeleteConfirm(null);
  };

  const openEditModal = (campaign: Campaign) => {
    let initialLocations: string[] = [];
    let initialScope: 'local' | 'national' = 'local';
    let initialRadius = [0];

    // Restore location scope and radius
    if (campaign.location === 'Brasil') {
      initialScope = 'national';
    } else if (campaign.location) {
      initialScope = 'local';
      const match = campaign.location.match(/(.*) \(\+(\d+)km\)/);
      if (match) {
        initialLocations = match[1].split(', ').filter(Boolean);
        initialRadius = [parseInt(match[2])];
      } else {
        initialLocations = campaign.location.split(', ').filter(Boolean);
      }
    }

    const filters = campaign.filters || {};

    // Defensive Safe Merge
    const safeState: CampaignState = {
      // 1. Base Campaign Fields
      name: campaign.name || "",
      niche: campaign.niche || "",
      locations: initialLocations,
      tempLocation: "",
      minScore: filters.minScore || 50,
      verifiedOnly: filters.verifiedOnly || false,
      sources: campaign.sources || [],

      // 2. Default Values (Safety Net)
      ...defaultAdvancedFilters,

      // 3. Override with Campaign Filters (Shallow)
      ...(filters as unknown as AdvancedFiltersData),

      // 4. Critical Deep Merges & Array Safety
      // Ensure nested objects don't get wiped or become partial
      digitalPresence: {
        ...defaultAdvancedFilters.digitalPresence,
        ...(filters as any)?.digitalPresence,
      },
      painPoints: {
        ...defaultAdvancedFilters.painPoints,
        ...(filters as any)?.painPoints,
      },

      // Ensure arrays are never undefined
      employeeCategories: (filters as any)?.employeeCategories || [],
      revenueCategories: (filters as any)?.revenueCategories || [],
      technologies: (filters as any)?.technologies || [],
      advancedSources: (filters as any)?.advancedSources || [],
      tags: (filters as any)?.tags || [],
      cnaes: (filters as any)?.cnaes || [],
      negativeKeywords: (filters as any)?.negativeKeywords || [],
      professionalProfiles: (filters as any)?.professionalProfiles || [],
    };

    setCampaignData(safeState);

    if (campaign.niche) {
      setNicheTags(campaign.niche.split(',').map(s => s.trim()).filter(Boolean));
    } else {
      setNicheTags([]);
    }

    setLocationScope(initialScope);
    setLocationRadius(initialRadius);
    setNicheInput("");
    setEditingCampaign(campaign);
    setIsCreateOpen(true);
  };

  const toggleSource = (source: string) => {
    setCampaignData(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        // Add glow feedback for 3 seconds
        setHighlightedSources(presetSources);
        setTimeout(() => setHighlightedSources([]), 3000);
      }

      const {
        digitalPresence: presetDP,
        painPoints: presetPP,
        ...otherFilters
      } = preset.filters;

      return {
        ...prev,
        ...otherFilters,
        digitalPresence: {
          ...prev.digitalPresence,
          ...(presetDP || {})
        },
        painPoints: {
          ...prev.painPoints,
          ...(presetPP || {})
        },
        professionalProfiles: newProfiles,
        sources: newSources
      };
    });
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

  const selectLocation = (suggestion: string) => {
    setCampaignData(prev => ({
      ...prev,
      locations: [...prev.locations, suggestion],
      tempLocation: ""
    }));
    setShowLocationSuggestions(false);
  };

  const filteredLocations = campaignData.tempLocation && brazilLocations
    ? brazilLocations.filter(l => normalizeText(l).includes(normalizeText(campaignData.tempLocation))).slice(0, 50)
    : (brazilLocations || []).slice(0, 10);

  const filteredNicheSuggestions = nicheInput
    ? allNiches.filter(n => {
      const normalizedNiche = normalizeText(n);
      const searchWords = normalizeText(nicheInput).split(/\s+/).filter(Boolean);
      return searchWords.every(word => normalizedNiche.includes(word)) && !nicheTags.includes(n);
    }).slice(0, 15)
    : allNiches.filter(n => !nicheTags.includes(n)).slice(0, 15);

  // --- CURRENCY FORMATTING ---
  const formatBRL = (value: number) => {
    if (!value) return '';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const parseBRL = (value: string) => {
    return Number(value.replace(/\D/g, ''));
  };

  const getGroupedSuggestions = () => {
    const groups: { label: string; icon: any; items: string[] }[] = [];

    // 2. Profile Groups
    campaignData.professionalProfiles.forEach(p => {
      const items = profileNiches[p] || [];
      if (items.length > 0) {
        // Find profile info to get label/icon
        const profileInfo = [
          { id: 'agency', label: 'Agência', icon: Building2 },
          { id: 'dev', label: 'Programador', icon: Code2 },
          { id: 'traffic_manager', label: 'Tráfego', icon: BarChart3 },
          { id: 'web_designer', label: 'Designer', icon: Palette },
          { id: 'copywriter', label: 'Copywriter', icon: PenTool },
          { id: 'automations', label: 'Automações', icon: Workflow },
          { id: 'websites', label: 'WebSites', icon: Layout },
          { id: 'ai_specialist', label: 'IA Specialist', icon: Bot },
          { id: 'consulting', label: 'Consultoria', icon: Briefcase },
        ].find(pi => pi.id === p);

        groups.push({
          label: `Específico para ${profileInfo?.label || 'Perfil'}`,
          icon: profileInfo?.icon || Briefcase,
          items
        });
      }
    });

    return groups;
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
          <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar missões..."
                className="pl-10 bg-secondary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[240px] bg-secondary/50">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Missões</SelectItem>
                <SelectItem value="active">🟢 Ativa MISSÃO EM CURSO</SelectItem>
                <SelectItem value="paused">🟡 Pausada RECALIBRANDO</SelectItem>
                <SelectItem value="completed">🔴 Encerrada ALVOS EXTRAÍDOS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) { setEditingCampaign(null); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button variant="glow" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[95vw] md:max-w-6xl h-[100dvh] max-h-none flex flex-col overflow-hidden p-0 gap-0 border-none shadow-2xl">
              <div className="flex h-full overflow-hidden">
                {/* Single View Form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <DialogHeader className="p-3 sm:p-4 pb-1 shrink-0 border-b border-border/50">
                    <DialogTitle className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-tighter">
                      🚀 {editingCampaign ? `Editar Míssil: ${editingCampaign.name}` : 'Lançar Míssil de Prospecção'}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                      Configure o radar, os sensores de inteligência e o payload da sua nova missão operacional.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="flex-1 px-4 sm:px-8">
                    <div className="py-10 space-y-12">

                      {/* STEP 1: CALIBRATION & SENSORS */}
                      <div className="space-y-8 min-h-[450px]">
                        <div className="flex flex-col gap-1.5 border-b pb-3">
                          <div className="flex items-center gap-3 text-primary font-semibold">
                            <Sparkles className="h-6 w-6" />
                            <span className="text-xl font-black">Passo 1: Calibração de Perfil & Sensores</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-bold">
                            Escolha seu perfil para ativar os sensores de inteligência correspondentes.
                          </p>
                        </div>
                        <AdvancedFilters
                          data={campaignData as unknown as AdvancedFiltersData}
                          onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                          section="sensors"
                          onProfileToggle={(id) => applyPreset(id as any)}
                          activeProfiles={campaignData.professionalProfiles}
                        />
                      </div>

                      {/* STEP 2: INTELLIGENCE & DATA SOURCES */}
                      <div className="space-y-8 min-h-[350px]" ref={step3Ref}>
                        <div className="flex flex-col gap-1.5 border-b pb-3">
                          <div className="flex items-center gap-3 text-primary font-semibold">
                            <Database className="h-6 w-6" />
                            <span className="text-xl font-black">Passo 2: Inteligência de Dados</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-bold">
                            O sistema pré-configurou as fontes de dados ideais para o seu perfil. Sinta-se à vontade para ajustar os canais de busca abaixo.
                          </p>
                        </div>

                        {/* DATA SOURCES CARD */}
                        <div className="space-y-6 p-6 border rounded-2xl bg-secondary/10">
                          <Label className="flex items-center gap-3 mb-4 text-base font-black uppercase tracking-tight">
                            <Database className="h-5 w-5 text-primary" />
                            Fontes de Dados Estratégicas
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {detailedSources.map((source) => (
                              <button
                                key={source.name}
                                type="button"
                                onClick={() => toggleSource(source.name)}
                                className={`flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all h-full relative overflow-hidden ${campaignData.sources.includes(source.name)
                                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                                  : "border-border hover:bg-secondary/50"
                                  } ${highlightedSources.includes(source.name) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : ''}`}
                              >
                                {highlightedSources.includes(source.name) && (
                                  <div className="absolute top-0 right-0 p-1">
                                    <Sparkles className="h-3 w-3 text-primary animate-bounce" />
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mb-1">
                                  <source.icon className={`h-6 w-6 ${campaignData.sources.includes(source.name) ? 'text-primary' : source.color}`} />
                                  <span className="font-black text-base leading-tight">{source.name}</span>
                                </div>
                                <div className="space-y-1 w-full">
                                  {source.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <CheckCircle className={`h-4 w-4 ${campaignData.sources.includes(source.name) ? 'text-primary/70' : 'text-muted-foreground'}`} />
                                      <span className="text-xs text-muted-foreground font-bold">{detail}</span>
                                    </div>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* STEP 3: RADAR (ALVO) - MOVED BELOW INTELLIGENCE */}
                      <div className="space-y-8 min-h-[450px]">
                        <div className="flex flex-col gap-1.5 border-b pb-3">
                          <div className="flex items-center gap-3 text-primary font-semibold">
                            <Target className="h-6 w-6" />
                            <span className="text-xl font-black">Passo 3: Radar (Alvo)</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-bold">
                            Defina o raio geográfico e o perfil financeiro das empresas que deseja prospectar.
                          </p>
                        </div>

                        {/* LOCATION & NAME CARD */}
                        <div className="space-y-6 p-6 border rounded-2xl bg-secondary/10">
                          {/* CAMPAIGN NAME */}
                          <div className="space-y-2">
                            <Label className="text-base font-black">Nome da Campanha</Label>
                            <Input
                              placeholder="Ex: Prospecção Agências"
                              className="bg-secondary/20 bg-background text-lg py-7"
                              value={campaignData.name}
                              onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-3 text-base font-black">
                              <MapPin className="h-5 w-5 text-primary" />
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
                              <div className="flex flex-col gap-2 relative">
                                {campaignData.locations.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-lg bg-secondary/10">
                                    {campaignData.locations.map(loc => (
                                      <Badge key={loc} variant="secondary" className="flex items-center gap-1 bg-background border shadow-sm">
                                        {loc}
                                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setCampaignData(prev => ({ ...prev, locations: prev.locations.filter(l => l !== loc) }))} />
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <div className="relative flex-1">
                                  <Input
                                    placeholder="Digite Estado ou Cidade:"
                                    className="bg-background w-full"
                                    value={campaignData.tempLocation}
                                    onChange={(e) => {
                                      setCampaignData(prev => ({ ...prev, tempLocation: e.target.value }));
                                      setShowLocationSuggestions(true);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && campaignData.tempLocation) {
                                        e.preventDefault();
                                        if (!campaignData.locations.includes(campaignData.tempLocation)) {
                                          setCampaignData(prev => ({ ...prev, locations: [...prev.locations, prev.tempLocation], tempLocation: "" }));
                                        }
                                      }
                                    }}
                                  />
                                  {/* LOCATION AUTOCOMPLETE DROPDOWN */}
                                  {showLocationSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-50">
                                      {filteredLocations.length > 0 ? (
                                        filteredLocations.map((loc) => (
                                          <div
                                            key={loc}
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                            onMouseDown={() => {
                                              if (!campaignData.locations.includes(loc)) {
                                                selectLocation(loc);
                                              }
                                              setShowLocationSuggestions(false);
                                            }}
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
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span className="font-bold">Precisão de Localização</span>
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

                              {/* FILTROS DE PODER (OPCIONAIS) - INSIDE RADAR CARD */}
                              <div className="pt-4 border-t border-border/50 space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Zap className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-black text-primary uppercase tracking-wider">Filtros de Poder (Opcionais)</span>
                                </div>

                                <div className="space-y-4">
                                  {/* Tamanho do Time */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-black text-muted-foreground uppercase">Tamanho do Time</span>
                                    </div>
                                    <ToggleGroup
                                      type="multiple"
                                      value={campaignData.employeeCategories}
                                      onValueChange={(val) => setCampaignData(prev => ({ ...prev, employeeCategories: val as any }))}
                                      className="justify-start gap-2"
                                    >
                                      <ToggleGroupItem value="1-10" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        1-10 (MEI/Pequena)
                                      </ToggleGroupItem>
                                      <ToggleGroupItem value="11-50" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        11-50 (Média)
                                      </ToggleGroupItem>
                                      <ToggleGroupItem value="50+" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        50+ (Enterprise)
                                      </ToggleGroupItem>
                                    </ToggleGroup>
                                  </div>

                                  {/* Faturamento Estimado */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-black text-muted-foreground uppercase">Faturamento Estimado</span>
                                    </div>
                                    <ToggleGroup
                                      type="multiple"
                                      value={campaignData.revenueCategories}
                                      onValueChange={(val) => setCampaignData(prev => ({ ...prev, revenueCategories: val as any }))}
                                      className="justify-start gap-2"
                                    >
                                      <ToggleGroupItem value="<100k" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        Até 100k
                                      </ToggleGroupItem>
                                      <ToggleGroupItem value="100k-500k" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        100k a 500k
                                      </ToggleGroupItem>
                                      <ToggleGroupItem value=">500k" className="text-xs h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold">
                                        +500k
                                      </ToggleGroupItem>
                                    </ToggleGroup>
                                  </div>
                                </div>
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

                        {/* SMART NICHE SELECTION CARD */}
                        <div className="space-y-4 p-4 border rounded-xl bg-secondary/10">
                          <Label className="flex items-center gap-2 mb-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Seleção de Público (Nichos)
                          </Label>

                          {/* 2. TAG INPUT + MEGA MENU */}
                          <div className="p-2 min-h-[42px] border rounded-lg bg-secondary/10 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background relative z-20">
                            {nicheTags.map(tag => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-background border shadow-sm">
                                {tag}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => removeNicheTag(tag)}
                                />
                              </Badge>
                            ))}
                            <div className="relative flex-1 min-w-[200px]">
                              <input
                                className="w-full bg-transparent border-none outline-none text-sm h-6 font-medium placeholder:text-muted-foreground/70"
                                placeholder={
                                  nicheTags.length === 0
                                    ? "Busque por nichos de sua preferência ou selecione um perfil pré-calibrado do nosso Ecossistema:"
                                    : ""
                                }
                                value={nicheInput}
                                onChange={(e) => {
                                  setNicheInput(e.target.value);
                                }}
                                onKeyDown={handleNicheKeyDown}
                              />
                            </div>

                            {/* MEGA MENU - STATIC & ALWAYS VISIBLE (NO SCROLL) */}
                            <div className="w-full mt-3 border border-border rounded-xl bg-background/50 overflow-hidden flex flex-col">
                              {nicheInput ? (
                                // SEARCH MODE
                                <div className="p-2">
                                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Resultados da busca</p>
                                    {nicheInput && !allNiches.some(n => normalizeText(n) === normalizeText(nicheInput)) && (
                                      <Button
                                        variant="glow"
                                        size="sm"
                                        className="h-7 text-[10px] px-2"
                                        onMouseDown={(e) => { e.preventDefault(); addNicheTag(nicheInput.trim()); }}
                                      >
                                        <Plus className="h-3 w-3 mr-1" /> Adicionar "{nicheInput}"
                                      </Button>
                                    )}
                                  </div>
                                  {filteredNicheSuggestions.length > 0 ? (
                                    filteredNicheSuggestions.map((suggestion) => (
                                      <div
                                        key={suggestion}
                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md flex items-center gap-2"
                                        onMouseDown={(e) => { e.preventDefault(); addNicheTag(suggestion); }}
                                      >
                                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                                        {suggestion}
                                      </div>
                                    ))
                                  ) : (
                                    !allNiches.some(n => normalizeText(n) === normalizeText(nicheInput)) && (
                                      <div className="p-4 text-center text-sm text-muted-foreground">
                                        Nenhum nicho encontrado. <span className="text-primary cursor-pointer hover:underline" onMouseDown={(e) => { e.preventDefault(); addNicheTag(nicheInput.trim()); }}>Clique para adicionar personalizado.</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                // DISCOVERY MODE (CATALOG)
                                <div className="p-4 space-y-6">

                                  <div className="text-center pb-4 border-b border-border/50">
                                    <p className="text-sm text-muted-foreground">
                                      Selecione um <strong>Ecossistema</strong> para adicionar todos os seus nichos, ou clique em itens específicos.
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                    {ecosystems.map(group => (
                                      <div key={group.id} className="space-y-3">
                                        <div
                                          className="flex items-center gap-2 group/header cursor-pointer"
                                          onClick={() => toggleEcosystem(group)}
                                        >
                                          <div className={`p-2 rounded-lg bg-primary/10 text-primary group-hover/header:bg-primary group-hover/header:text-primary-foreground transition-colors`}>
                                            <group.icon className="h-5 w-5" />
                                          </div>
                                          <div>
                                            <h4 className="font-extrabold text-base flex items-center gap-2">
                                              {group.label}
                                              {group.niches.every(n => nicheTags.includes(n)) && <CheckCircle className="h-3 w-3 text-primary" />}
                                            </h4>
                                            <p className="text-xs font-bold text-muted-foreground group-hover/header:text-primary decoration-primary/50 underline-offset-2 group-hover/header:underline">
                                              {group.niches.every(n => nicheTags.includes(n)) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-border/50 ml-4">
                                          {group.niches.map(item => (
                                            <div
                                              key={item}
                                              className={`cursor-pointer text-xs p-1.5 rounded-md transition-all flex items-center gap-2 ${nicheTags.includes(item) ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'}`}
                                              onMouseDown={(e) => { e.preventDefault(); if (nicheTags.includes(item)) removeNicheTag(item); else addNicheTag(item); }}
                                            >
                                              <span className={`w-1.5 h-1.5 rounded-full ${nicheTags.includes(item) ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* STEP 4: FINAL PAYLOAD & SWEEP SETTINGS */}
                      <div className="space-y-8 min-h-[350px]">
                        <div className="flex flex-col gap-1.5 border-b pb-3">
                          <div className="flex items-center gap-3 text-primary font-semibold">
                            <Settings className="h-6 w-6" />
                            <span className="text-xl font-black">Passo 4: Filtros de Varredura</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-bold">
                            Configure o modo de validação de contatos e a frequência de atualização da campanha.
                          </p>
                        </div>

                        <div className="space-y-6 p-6 border rounded-2xl bg-secondary/10">
                          <AdvancedFilters
                            data={campaignData as unknown as AdvancedFiltersData}
                            onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                            section="filters"
                          />
                        </div>
                      </div>

                      <div className="h-10"></div> {/* Bottom Spacer */}
                    </div>
                  </ScrollArea>

                  <DialogFooter className="p-3 sm:p-4 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-sm flex flex-row justify-between items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreateOpen(false)}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      Cancelar
                    </Button>

                    <Button
                      onClick={editingCampaign ? handleEditCampaign : handleCreateCampaign}
                      disabled={createCampaign.isPending || updateCampaign.isPending}
                      className="bg-primary hover:bg-primary/90 gap-2 text-xs sm:text-sm px-6 h-11 font-black uppercase tracking-tighter"
                    >
                      {editingCampaign
                        ? (updateCampaign.isPending ? "Atualizando..." : "Atualizar Míssil")
                        : (createCampaign.isPending ? "Lançando..." : "Lançar Míssil")
                      } <Zap className="h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Campaign List Render (Unchanged) */}
        {
          Object.entries(filteredCampaigns.reduce((acc, campaign) => {
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
                {statusCampaigns.map(campaign => {
                  const qualifiedLeads = Math.floor((campaign.leadsVerified / campaign.leadsFound) * 100) || 0;

                  return (
                    <Card key={campaign.id} variant="glass" className="group hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{campaign.name}</h4>
                              <p className="text-sm text-muted-foreground">{campaign.niche}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{campaign.location}</span>
                              </div>
                            </div>
                            <Badge
                              variant={campaign.status === 'active' ? 'verified' : campaign.status === 'paused' ? 'outline' : 'secondary'}
                              className="flex items-center gap-1"
                            >
                              {campaign.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                              {campaign.status === 'active' ? 'Ativo' : campaign.status === 'paused' ? 'Pausado' : 'Concluído'}
                            </Badge>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex flex-col items-center justify-center">
                              <span className="font-black text-2xl text-primary">{campaign.leadsFound}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Capturados</span>
                            </div>
                            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg flex flex-col items-center justify-center">
                              <span className="font-black text-2xl text-accent">{campaign.leadsVerified}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Verificados</span>
                            </div>
                            <div className="p-3 bg-secondary/50 border border-border rounded-lg flex flex-col items-center justify-center">
                              <span className="font-black text-2xl text-foreground">{qualifiedLeads}%</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Qualidade</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 gap-2 font-bold"
                              onClick={() => window.location.href = `/leads?campaign=${campaign.id}`}
                            >
                              <Users className="h-4 w-4" /> Ver Alvos
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={() => {
                                toast({ title: "Re-varredura Iniciada", description: `Atualizando alvos de "${campaign.name}"...` });
                                // TODO: Implement re-scan logic
                              }}
                            >
                              <Zap className="h-4 w-4" /> Re-varrer
                            </Button>
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => openEditModal(campaign)}>
                              <Settings className="h-3 w-3 mr-1" /> Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => handleSendCampaign(campaign)}>
                              <Play className="h-3 w-3 mr-1" />
                              <div className="flex flex-col items-start leading-none">
                                <span>Disparar</span>
                                <span className="text-[8px] opacity-50">Enviar para Alvos</span>
                              </div>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteConfirm(campaign.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        }
      </div >
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disparar Campanha</DialogTitle>
            <DialogDescription>
              Selecione uma variante de mensagem para enviar aos alvos de <strong>{selectedCampaignForSend?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Variante de Mensagem</Label>
              <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma variante..." />
                </SelectTrigger>
                <SelectContent>
                  {variants.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                  {variants.length === 0 && (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      Nenhuma variante encontrada. <Link to="/settings" className="text-primary hover:underline">Configurar no Sistema</Link>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedVariantId && (
              <div className="p-3 bg-secondary/30 rounded-lg border text-xs italic text-muted-foreground">
                "{variants.find(v => v.id === selectedVariantId)?.text.substring(0, 100)}..."
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSendDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmSend} disabled={!selectedVariantId}>Iniciar Disparos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir Missão?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todos os dados coletados nesta missão serão perdidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteCampaign(deleteConfirm)}>Excluir Permanentemente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout >
  );
};
