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
const dataSources = [
  { name: 'Google Maps', icon: MapPin, color: 'text-green-600', description: 'Radar de estabelecimentos físicos, horários e rotas locais.', details: ['Localização Exata', 'Horários de Funcionamento', 'Fotos e Avaliações', 'Site e Telefone'] },
  { name: 'LinkedIn', icon: Globe, color: 'text-sky-600', description: 'Monitoramento de decisores, cargos e posts corporativos.', details: ['Decisores e Sócios', 'Tamanho da Empresa', 'Vagas em Aberto', 'Investimento em Ads'] },
  { name: 'Instagram', icon: InstaIcon, color: 'text-pink-500', description: 'Análise de presença social, engajamento e estética visual.', details: ['Engajamento e Seguidores', 'Frequência de Posts', 'Qualidade Visual', 'Links na Bio'] },
  { name: 'Junta Comercial', icon: Globe, color: 'text-slate-600', description: 'Acesso a documentos oficiais, capital social e histórico.', details: ['Histórico da Empresa', 'Capital Social / Porte', 'Filiais', 'Documentos Oficiais'] },
  { name: 'SEBRAE', icon: Globe, color: 'text-blue-700', description: 'Dados de maturidade empresarial e programas de crescimento.', details: ['Porte da Empresa', 'Nível de Maturidade Digital', 'Potencial de Crescimento', 'Programas Participados'] },
  { name: 'ReclameAqui', icon: SearchIcon, color: 'text-orange-600', description: 'Sensor de dores, reclamações frequentes e reputação.', details: ['Reputação da Marca', 'Principais Reclamações', 'Tempo de Resposta', 'Índice de Solução'] },
  { name: 'Facebook', icon: Globe, color: 'text-blue-600', description: 'Varredura de pixels de rastreamento e biblioteca de anúncios.', details: ['Pixel e Rastreamento', 'Atividade Recente', 'Anúncios Ativos', 'Avaliações de Usuários'] },
  { name: 'Workana', icon: MousePointer2, color: 'text-emerald-500', description: 'Projetos publicados e tecnologias em demanda pelo alvo.', details: ['Projetos Publicados', 'Ticket Médio', 'Frequência de Contratação', 'Tecnologias Contratadas'] },
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
    resetForm();
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign.mutate(id);
    setDeleteConfirm(null);
  };

  const openEditModal = (campaign: Campaign) => {
    console.log("Opening edit for:", campaign.id);
    toast({ title: "Carregando Missão", description: `Preparando parametrização de "${campaign.name}"...` });

    // Reset any previous state first
    resetForm();
    setIsCreateOpen(false); // Ensure create mode is off

    setCampaignData({
      ...campaign,
      locations: Array.isArray(campaign.location) ? campaign.location : [campaign.location || ""],
      tempLocation: "",
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

    // Restore location scope and radius
    if (campaign.location === 'Brasil') {
      setLocationScope('national');
      setCampaignData(prev => ({ ...prev, locations: [] }));
    } else if (campaign.location) {
      setLocationScope('local');
      const locationStr = String(campaign.location);
      const match = locationStr.match(/(.*) \(\+(\d+)km\)/);
      if (match) {
        setCampaignData(prev => ({ ...prev, locations: match[1].split(', ').filter(Boolean) }));
        setLocationRadius([parseInt(match[2])]);
      } else {
        setCampaignData(prev => ({ ...prev, locations: locationStr.split(', ').filter(Boolean) }));
        setLocationRadius([0]);
      }
    } else {
      setLocationScope('local');
      setCampaignData(prev => ({ ...prev, locations: [] }));
      setLocationRadius([0]);
    }

    setEditingCampaign(campaign);
    // Explicitly scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isCreateOpen || !!editingCampaign) {
    return (
      <DashboardLayout>
        <div className="space-y-8 pb-20">
          {/* Operation Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setIsCreateOpen(false); setEditingCampaign(null); resetForm(); }}
                className="rounded-full hover:bg-secondary/80"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-tighter">
                  {editingCampaign ? "🚀 Recalibrar Missão" : "🚀 Lançar Missão de Prospecção"}
                </h2>
                <p className="text-sm font-medium text-muted-foreground/80">
                  {editingCampaign ? `Ajustando parâmetros da missão: ${editingCampaign.name}` : "Configure o radar, os sensores de inteligência e o payload da missão."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={() => { setIsCreateOpen(false); setEditingCampaign(null); resetForm(); }}
                className="flex-1 sm:flex-none font-bold text-base"
              >
                Descartar Alterações
              </Button>
              <Button
                onClick={editingCampaign ? handleEditCampaign : handleCreateCampaign}
                disabled={createCampaign.isPending || updateCampaign.isPending}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 gap-2 px-8 h-12 text-lg font-black shadow-lg shadow-primary/20 uppercase tracking-tighter"
              >
                {editingCampaign
                  ? (updateCampaign.isPending ? "Atualizando..." : "Salvar Missão")
                  : (createCampaign.isPending ? "Lançando..." : "Lançar Míssil Agora")
                } <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto space-y-12">
            {/* STEP 1: CALIBRATION & SENSORS */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b pb-2">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm">01</span>
                  Calibração & Sensores de Elite
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Selecione o perfil do alvo e ative os sensores de dor para filtrar empresas com problemas específicos.
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
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b pb-2">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm">02</span>
                  Inteligência de Dados (Radar)
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Escolha as fontes de dados para varredura e extração de contatos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dataSources.map((source) => (
                  <button
                    key={source.name}
                    type="button"
                    onClick={() => toggleSource(source.name)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all h-full relative overflow-hidden ${campaignData.sources.includes(source.name)
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/10"
                      : "border-border hover:bg-secondary/50"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <source.icon className={`h-8 w-8 ${campaignData.sources.includes(source.name) ? 'text-primary' : source.color}`} />
                      <span className="font-bold text-2xl leading-tight tracking-tighter">{source.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-snug">{source.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: RADAR (ALVO) */}
            <div className="space-y-6" ref={step3Ref}>
              <div className="flex flex-col gap-1 border-b pb-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Target className="h-5 w-5" />
                  <span className="text-xl font-bold">Passo 3: Radar (Alvo)</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium italic">
                  Defina o raio geográfico e o perfil das empresas que deseja prospectar.
                </p>
              </div>

              <div className="space-y-6 p-6 border rounded-2xl bg-secondary/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-bold">Nome da Missão</Label>
                      <Input
                        placeholder="Ex: Prospecção de Agências - SP"
                        className="bg-background text-lg py-6"
                        value={campaignData.name}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-base font-bold">
                          <MapPin className="h-5 w-5 text-primary" />
                          Localização do Alvo
                        </Label>
                        <div className="flex bg-secondary/30 p-1 rounded-lg">
                          <button
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${locationScope === 'local' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setLocationScope('local')}
                          >
                            Local/Regional
                          </button>
                          <button
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${locationScope === 'national' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setLocationScope('national')}
                          >
                            Brasil (Todo País)
                          </button>
                        </div>
                      </div>

                      {locationScope === 'local' && (
                        <div className="space-y-4 animate-in slide-in-from-top-2">
                          <div className="relative">
                            <Input
                              placeholder="Digite o nome da cidade ou estado..."
                              className="bg-background py-6 pl-4"
                              value={campaignData.tempLocation}
                              onChange={(e) => {
                                setCampaignData(prev => ({ ...prev, tempLocation: e.target.value }));
                                setShowLocationSuggestions(true);
                              }}
                              onFocus={() => setShowLocationSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                            />
                            {showLocationSuggestions && (
                              <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-popover border border-border rounded-xl shadow-2xl z-50">
                                {filteredLocations.map((loc) => (
                                  <div
                                    key={loc}
                                    className="px-4 py-3 text-sm cursor-pointer hover:bg-accent border-b last:border-0"
                                    onMouseDown={() => selectLocation(loc)}
                                  >
                                    {loc}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {campaignData.locations.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-background">
                              {campaignData.locations.map(loc => (
                                <Badge key={loc} variant="secondary" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary gap-2">
                                  {loc}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCampaignData(prev => ({ ...prev, locations: prev.locations.filter(l => l !== loc) }))} />
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-muted-foreground">Raio de Cobertura</span>
                              <span className="text-primary font-bold">{locationRadius[0] === 0 ? 'Centro Exato' : `+${locationRadius[0]}km`}</span>
                            </div>
                            <Slider
                              defaultValue={[0]}
                              max={100}
                              step={5}
                              value={locationRadius}
                              onValueChange={setLocationRadius}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-base font-bold">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Nichos e Públicos Segmentados
                      </Label>
                      <div className="relative">
                        <div className="p-3 min-h-[50px] border rounded-xl bg-background flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">
                          {nicheTags.map(tag => (
                            <Badge key={tag} variant="outline" className="px-3 py-1 bg-secondary border-border gap-2">
                              {tag}
                              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeNicheTag(tag)} />
                            </Badge>
                          ))}
                          <input
                            className="flex-1 bg-transparent border-none outline-none text-sm min-w-[150px]"
                            placeholder="Adicione nichos (ex: Clínicas, Lojas...)"
                            value={nicheInput}
                            onChange={(e) => setNicheInput(e.target.value)}
                            onKeyDown={handleNicheKeyDown}
                          />
                        </div>
                        {nicheInput && (
                          <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-popover border rounded-xl shadow-2xl z-50">
                            {filteredNicheSuggestions.map(s => (
                              <div key={s} className="px-4 py-3 text-sm cursor-pointer hover:bg-accent" onMouseDown={() => addNicheTag(s)}>
                                {s}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {ecosystems.slice(0, 4).map(eco => (
                        <Button
                          key={eco.id}
                          variant="outline"
                          className={`h-auto py-4 flex flex-col gap-2 items-center justify-center text-center transition-all ${eco.niches.every(n => nicheTags.includes(n)) ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => toggleEcosystem(eco)}
                        >
                          <eco.icon className={`h-6 w-6 ${eco.niches.every(n => nicheTags.includes(n)) ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-xs font-bold leading-tight">{eco.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: SWEEP SETTINGS */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b pb-2">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm">03</span>
                  Filtros de Segmentação
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Refine o radar por localização, nicho e qualidade dos dados.
                </p>
              </div>

              <div className="p-8 border rounded-2xl bg-secondary/5">
                <AdvancedFilters
                  data={campaignData as unknown as AdvancedFiltersData}
                  onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                  section="filters"
                />
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-4 border-t">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => { setIsCreateOpen(false); setEditingCampaign(null); resetForm(); }}
              >
                Cancelar Operação
              </Button>
              <Button
                onClick={editingCampaign ? handleEditCampaign : handleCreateCampaign}
                disabled={createCampaign.isPending || updateCampaign.isPending}
                className="bg-primary hover:bg-primary/90 gap-3 px-16 h-16 text-xl font-black shadow-2xl shadow-primary/30 uppercase tracking-widest group"
              >
                {editingCampaign
                  ? (updateCampaign.isPending ? "Lançando Missão..." : "Salvar Alterações")
                  : (createCampaign.isPending ? "Lançando Missão..." : "Lançar Míssil Agora")
                } <Zap className="h-7 w-7 animate-pulse group-hover:scale-125 transition-transform" />
              </Button>
            </div>

            <div className="h-20" />
          </div>
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
          <Button variant="glow" onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </motion.div >

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
                                toast({ title: "Re-varredura Iniciada", description: `Atualizando leads de "${campaign.name}"...` });
                                // TODO: Implement re-scan logic
                              }}
                            >
                              <Zap className="h-4 w-4" /> Re-varrer
                            </Button>
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <Button variant="secondary" size="sm" className="flex-1 text-xs font-bold" onClick={() => openEditModal(campaign)}>
                              <Settings className="h-4 w-4 mr-1" /> Editar
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
