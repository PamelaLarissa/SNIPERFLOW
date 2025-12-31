import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  Settings,
  Trash2,
  MapPin,
  Target,
  Calendar,
  TrendingUp,
  Search,
  CheckCircle,
  Edit,
  Mail,
  Building2,
  Code2,
  BarChart3,
  PenTool,
  Bot,
  Sparkles,
  Globe,
  Instagram as InstaIcon,
  Search as SearchIcon,
  MousePointer2,
  Palette,
  Workflow,
  Layout,
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
  availableTechnologies,
  advancedSourcesList,
  professionalPresets,
} from "@/components/campaigns/AdvancedFilters";
import { Slider } from "@/components/ui/slider";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, type Campaign } from "@/hooks/useCampaigns";
import { useMessageVariants } from "@/hooks/useMessageVariants";
import { useLeads } from "@/hooks/useLeads";

const getStatusBadge = (status: Campaign['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="verified">Ativa</Badge>;
    case 'paused':
      return <Badge variant="pending">Pausada</Badge>;
    case 'completed':
      return <Badge variant="outline">Concluída</Badge>;
  }
};

const availableSources = ['Google', 'LinkedIn', 'Maps', 'Instagram', 'TikTok', 'YouTube'];

export const CampaignsPage = () => {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [campaignData, setCampaignData] = useState({
    name: "",
    niche: "",
    location: "",
    minScore: 50,
    verifiedOnly: false,
    ...defaultAdvancedFilters,
    sources: ["Google", "LinkedIn"] as string[],
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
    });
  };

  const handleCreateCampaign = () => {
    createCampaign.mutate({
      name: campaignData.name || 'Nova Campanha',
      niche: campaignData.niche || 'Não definido',
      location: campaignData.location || 'Brasil',
      status: 'active',
      sources: campaignData.sources,
      filters: {
        ...campaignData,
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

  const toggleCampaignStatus = (campaign: Campaign) => {
    updateCampaign.mutate({
      id: campaign.id,
      updates: {
        status: campaign.status === 'active' ? 'paused' : 'active'
      }
    });
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
    });
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

  const calculateEstimate = () => {
    let leadCount = 2500;

    // Basic criteria reduction
    leadCount -= (campaignData.sources.length * 50);
    leadCount -= (campaignData.technologies.length * 100);
    leadCount -= (campaignData.minScore * 15);

    // Strategic Filters
    if (campaignData.digitalPresence.adsStatus !== 'all') leadCount *= 0.65;
    if (campaignData.digitalPresence.googleQuality !== 'all') leadCount *= 0.75;
    if (campaignData.digitalPresence.instagramStatus !== 'all') leadCount *= 0.8;
    if (campaignData.digitalPresence.pixelStatus !== 'all') leadCount *= 0.55;
    if (campaignData.digitalPresence.siteTechnology !== 'all') leadCount *= 0.7;
    if (campaignData.digitalPresence.presenceLevel !== 'all') leadCount *= 0.6;
    if (campaignData.digitalPresence.infrastructureLevel !== 'all') leadCount *= 0.65;

    // Pain Points
    if (campaignData.painPoints.openComplaints) leadCount *= 0.4;
    if (campaignData.painPoints.notMobile) leadCount *= 0.5;
    if (campaignData.painPoints.noChatbot) leadCount *= 0.45;

    // Business Intelligence Filters
    if (campaignData.decisionMakerContact) leadCount *= 0.2; // Much harder but higher value
    if (campaignData.onlyActiveStatus) leadCount *= 0.85;
    if (campaignData.cnaes.length > 0) leadCount *= 0.4;

    const leads = Math.max(12, Math.floor(leadCount));

    // Revenue Estimation
    const ticketSizes: Record<string, number> = {
      agency: 5000,
      dev: 3500,
      traffic_manager: 2500,
      web_designer: 3000,
      copywriter: 1500,
      automations: 6000,
      websites: 2500,
      ai_specialist: 8000
    };

    const currentTicket = campaignData.professionalProfile ? ticketSizes[campaignData.professionalProfile] : 2000;
    const conversionRate = 0.02; // 2% conversion expectation
    const revenue = leads * conversionRate * currentTicket;

    return { leads, revenue };
  };

  const applyPreset = (profileId: string) => {
    const preset = professionalPresets[profileId];
    if (preset) {
      setCampaignData(prev => ({
        ...prev,
        ...preset.filters,
        professionalProfile: profileId as any,
        // Preset specific sources
        sources: profileId === 'dev' ? ['Google', 'Maps'] :
          profileId === 'traffic_manager' ? ['Instagram', 'Facebook Pages'] :
            profileId === 'copywriter' ? ['LinkedIn', 'Workana'] :
              profileId === 'ai_specialist' ? ['GetNinjas', '99Freelas'] :
                profileId === 'automations' ? ['Google', 'LinkedIn'] :
                  profileId === 'web_designer' ? ['Maps', 'Instagram'] :
                    profileId === 'websites' ? ['Google', 'Maps'] :
                      ['Google', 'LinkedIn', 'Maps']
      }));
      toast({
        title: "Preset Aplicado",
        description: `Configurações otimizadas para: ${preset.label} (${preset.subLabel})`,
      });
    }
  };

  const { leads, revenue } = calculateEstimate();

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <DialogContent className="max-w-5xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
              <div className="flex h-full overflow-hidden">
                {/* Left Side: Form Area */}
                <div className="flex-1 flex flex-col border-r border-border/50 overflow-hidden">
                  <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Configurar Míssil de Prospecção
                    </DialogTitle>
                    <DialogDescription>
                      Defina os parâmetros para uma busca ultra-segmentada
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-8 py-6">
                      {/* Presets de Perfil Profissional */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          Selecione seu Perfil para Auto-Configurar
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { id: 'agency', label: 'Agência', subLabel: 'Marketing', icon: Building2, color: 'text-blue-500' },
                            { id: 'dev', label: 'Programador', subLabel: 'Sistemas', icon: Code2, color: 'text-emerald-500' },
                            { id: 'traffic_manager', label: 'Tráfego', subLabel: 'Ads/ROI', icon: BarChart3, color: 'text-amber-500' },
                            { id: 'web_designer', label: 'Designer', subLabel: 'UI/UX', icon: Palette, color: 'text-pink-500' },
                            { id: 'copywriter', label: 'Copywriter', subLabel: 'Vendas', icon: PenTool, color: 'text-purple-500' },
                            { id: 'automations', label: 'Automações', subLabel: 'CRM/API', icon: Workflow, color: 'text-cyan-500' },
                            { id: 'websites', label: 'WebSites', subLabel: 'LP/Sites', icon: Layout, color: 'text-orange-500' },
                            { id: 'ai_specialist', label: 'IA', subLabel: 'GPT/Bots', icon: Bot, color: 'text-rose-500' },
                          ].map((profile) => (
                            <Button
                              key={profile.id}
                              variant={campaignData.professionalProfile === profile.id ? "default" : "outline"}
                              className={`h-auto py-3 px-1 flex flex-col gap-1.5 transition-all ${campaignData.professionalProfile === profile.id ? "ring-2 ring-primary ring-offset-2" : "hover:bg-secondary/50"}`}
                              onClick={() => applyPreset(profile.id as any)}
                            >
                              <profile.icon className={`h-5 w-5 ${campaignData.professionalProfile === profile.id ? 'text-white' : profile.color}`} />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold leading-none">{profile.label}</span>
                                <span className="text-[8px] opacity-60 font-medium leading-tight mt-0.5">{profile.subLabel}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Section 1: Identidade e Origem */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <Target className="h-5 w-5" />
                          <span className="text-lg">Identidade e Origem</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome da Campanha</Label>
                            <Input
                              placeholder="Ex: Agências de Marketing SP"
                              className="bg-secondary/20"
                              value={campaignData.name}
                              onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Nicho/Segmento</Label>
                            <Input
                              placeholder="Ex: Agências de Marketing Digital"
                              className="bg-secondary/20"
                              value={campaignData.niche}
                              onChange={(e) => setCampaignData(prev => ({ ...prev, niche: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Localização</Label>
                          <Input
                            placeholder="Ex: São Paulo, SP"
                            className="bg-secondary/20"
                            value={campaignData.location}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label>Fontes de Dados (Foco no Alvo)</Label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {[
                              { name: 'Google', icon: Globe, color: 'text-blue-500' },
                              { name: 'Maps', icon: MapPin, color: 'text-red-500' },
                              { name: 'LinkedIn', icon: Globe, color: 'text-sky-600' },
                              { name: 'Instagram', icon: InstaIcon, color: 'text-pink-500' },
                              { name: 'Workana', icon: MousePointer2, color: 'text-emerald-500' },
                              { name: '99Freelas', icon: MousePointer2, color: 'text-blue-400' },
                              { name: 'GetNinjas', icon: MousePointer2, color: 'text-amber-500' },
                              { name: 'ReclameAqui', icon: SearchIcon, color: 'text-green-600' },
                            ].map((source) => (
                              <button
                                key={source.name}
                                onClick={() => toggleSource(source.name)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${campaignData.sources.includes(source.name)
                                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                                  : "border-border hover:bg-secondary/50"
                                  }`}
                              >
                                <source.icon className={`h-6 w-6 ${campaignData.sources.includes(source.name) ? 'text-primary' : source.color}`} />
                                <span className="text-[10px] font-medium">{source.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Qualificação, Oportunidade e Configurações via AdvancedFilters */}
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <AdvancedFilters
                          data={campaignData}
                          onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                          selectedSources={campaignData.sources}
                        />
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter className="p-6 border-t border-border/50 shrink-0">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending} className="bg-primary hover:bg-primary/90">
                      {createCampaign.isPending ? "Lançando..." : "Lançar Míssil"}
                    </Button>
                  </DialogFooter>
                </div>

                {/* Right Side: Preview Panel */}
                <div className="hidden lg:flex w-80 bg-secondary/20 flex-col overflow-hidden">
                  <div className="p-6 border-b border-border/50 shrink-0">
                    <h4 className="font-bold flex items-center gap-2">
                      <Play className="h-4 w-4 text-primary" />
                      Live Preview
                    </h4>
                  </div>
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimativa de Leads</p>
                          <p className="text-3xl font-black text-primary">~{leads}</p>
                        </div>
                        <div className="pt-2 border-t border-primary/10">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Faturamento Estimado</p>
                          <p className="text-2xl font-black text-emerald-500">
                            R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Expectativa baseada em 2% de conversão</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Baseado nos filtros atuais em {campaignData.location || "Brasil"}</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Resumo do Alvo</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Nicho:</span>
                            <span className="font-medium">{campaignData.niche || "Geral"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Fontes:</span>
                            <span className="font-medium">{campaignData.sources.length} ativas</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tecnologias:</span>
                            <span className="font-medium">{campaignData.technologies.length} selecionadas</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Qualificação:</span>
                            <span className="font-medium">{campaignData.minScore}%+</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                          "Este míssil varrerá as fontes selecionadas em busca de leads que atendam exatamente aos seus critérios de dor e qualificação."
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Edit Modal */}
        <Dialog open={!!editingCampaign} onOpenChange={(open) => { if (!open) { setEditingCampaign(null); resetForm(); } }}>
          <DialogContent className="max-w-5xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
            <div className="flex h-full overflow-hidden">
              {/* Left Side: Form Area */}
              <div className="flex-1 flex flex-col border-r border-border/50 overflow-hidden">
                <DialogHeader className="p-6 pb-2 shrink-0">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Editar Míssil de Prospecção
                  </DialogTitle>
                  <DialogDescription>Altere os parâmetros do alvo</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-8 py-6">
                    {/* Presets de Perfil Profissional */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Selecione seu Perfil para Auto-Configurar
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'agency', label: 'Agência', icon: Building2, color: 'text-blue-500' },
                          { id: 'dev', label: 'Web Dev', icon: Code2, color: 'text-emerald-500' },
                          { id: 'traffic_manager', label: 'Gestor Tráfego', icon: BarChart3, color: 'text-amber-500' },
                          { id: 'copywriter', label: 'Copywriter', icon: PenTool, color: 'text-purple-500' },
                          { id: 'ai_specialist', label: 'Especia. IA', icon: Bot, color: 'text-rose-500' },
                        ].map((profile) => (
                          <Button
                            key={profile.id}
                            variant={campaignData.professionalProfile === profile.id ? "default" : "outline"}
                            className={`h-auto py-3 px-2 flex flex-col gap-2 transition-all ${campaignData.professionalProfile === profile.id ? "ring-2 ring-primary ring-offset-2" : "hover:bg-secondary/50"}`}
                            onClick={() => applyPreset(profile.id as any)}
                          >
                            <profile.icon className={`h-5 w-5 ${campaignData.professionalProfile === profile.id ? 'text-white' : profile.color}`} />
                            <span className="text-[10px] font-bold">{profile.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Identidade e Origem */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <Target className="h-5 w-5" />
                        <span className="text-lg">Identidade e Origem</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome da Campanha</Label>
                          <Input
                            placeholder="Ex: Agências de Marketing SP"
                            className="bg-secondary/20"
                            value={campaignData.name}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nicho/Segmento</Label>
                          <Input
                            placeholder="Ex: Agências de Marketing Digital"
                            className="bg-secondary/20"
                            value={campaignData.niche}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, niche: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Localização</Label>
                        <Input
                          placeholder="Ex: São Paulo, SP"
                          className="bg-secondary/20"
                          value={campaignData.location}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Fontes de Dados (Foco no Alvo)</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {[
                            { name: 'Google', icon: Globe, color: 'text-blue-500' },
                            { name: 'Maps', icon: MapPin, color: 'text-red-500' },
                            { name: 'LinkedIn', icon: Globe, color: 'text-sky-600' },
                            { name: 'Instagram', icon: InstaIcon, color: 'text-pink-500' },
                            { name: 'Workana', icon: MousePointer2, color: 'text-emerald-500' },
                            { name: '99Freelas', icon: MousePointer2, color: 'text-blue-400' },
                            { name: 'GetNinjas', icon: MousePointer2, color: 'text-amber-500' },
                            { name: 'ReclameAqui', icon: SearchIcon, color: 'text-green-600' },
                          ].map((source) => (
                            <button
                              key={source.name}
                              onClick={() => toggleSource(source.name)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${campaignData.sources.includes(source.name)
                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                : "border-border hover:bg-secondary/50"
                                }`}
                            >
                              <source.icon className={`h-6 w-6 ${campaignData.sources.includes(source.name) ? 'text-primary' : source.color}`} />
                              <span className="text-[10px] font-medium">{source.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Qualificação, Oportunidade e Configurações via AdvancedFilters */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <AdvancedFilters
                        data={campaignData}
                        onChange={(newData) => setCampaignData(prev => ({ ...prev, ...newData }))}
                        selectedSources={campaignData.sources}
                      />
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter className="p-6 border-t border-border/50 shrink-0">
                  <Button variant="outline" onClick={() => setEditingCampaign(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditCampaign} disabled={updateCampaign.isPending} className="bg-primary hover:bg-primary/90">
                    {updateCampaign.isPending ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right Side: Preview Panel */}
              <div className="hidden lg:flex w-80 bg-secondary/20 flex-col overflow-hidden">
                <div className="p-6 border-b border-border/50 shrink-0">
                  <h4 className="font-bold flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    Live Preview
                  </h4>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimativa de Leads</p>
                        <p className="text-3xl font-black text-primary">~{leads}</p>
                      </div>
                      <div className="pt-2 border-t border-primary/10">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Faturamento Estimado</p>
                        <p className="text-2xl font-black text-emerald-500">
                          R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-[9px] text-muted-foreground">Expectativa baseada em 2% de conversão</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Baseado nos filtros atuais em {campaignData.location || "Brasil"}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Resumo do Alvo</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Nicho:</span>
                          <span className="font-medium">{campaignData.niche || "Geral"}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Fontes:</span>
                          <span className="font-medium">{campaignData.sources.length} ativas</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Tecnologias:</span>
                          <span className="font-medium">{campaignData.technologies.length} selecionadas</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Qualificação:</span>
                          <span className="font-medium">{campaignData.minScore}%+</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                        "Este míssil varrerá as fontes selecionadas em busca de leads que atendam exatamente aos seus critérios de dor e qualificação."
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send Campaign Dialog */}
        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disparar Campanha</DialogTitle>
              <DialogDescription>
                Selecione uma variante de mensagem para enviar aos leads da campanha <strong>{selectedCampaignForSend?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Variante de Mensagem</Label>
                <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Selecione uma variante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map(variant => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} {variant.isWinner && "(Vencedora ⭐)"}
                      </SelectItem>
                    ))}
                    {variants.length === 0 && (
                      <SelectItem value="none" disabled>Nenhuma variante encontrada</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  As variantes são gerenciadas na página de <strong>Teste A/B</strong>.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>Cancelar</Button>
              <Button onClick={confirmSend} disabled={!selectedVariantId || selectedVariantId === "none"}>
                Confirmar e Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteCampaign(deleteConfirm)} disabled={deleteCampaign.isPending}>
                {deleteCampaign.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card variant="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Campanhas</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold">{campaigns.reduce((acc, c) => acc + (c.leadsFound || 0), 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{campaign.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{campaign.niche}</p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(campaign.sources || []).slice(0, 4).map(source => (
                        <Badge key={source} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                      {(campaign.sources || []).length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(campaign.sources || []).length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-xl sm:text-2xl font-bold text-primary">{campaign.leadsFound || 0}</p>
                        <p className="text-xs text-muted-foreground">Leads Encontrados</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-secondary/50">
                        <p className="text-xl sm:text-2xl font-bold text-emerald-500">{campaign.leadsVerified || 0}</p>
                        <p className="text-xs text-muted-foreground">Leads Verificados</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t border-border/50 divide-x divide-border/50">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm"
                      onClick={() => toggleCampaignStatus(campaign)}
                    >
                      {campaign.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-1.5" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1.5" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm"
                      onClick={() => openEditModal(campaign)}
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 sm:h-12 text-destructive hover:text-destructive text-xs sm:text-sm"
                      onClick={() => setDeleteConfirm(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Excluir
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm"
                      onClick={() => handleSendCampaign(campaign)}
                    >
                      <Mail className="h-4 w-4 mr-1.5" />
                      Enviar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma campanha encontrada
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
