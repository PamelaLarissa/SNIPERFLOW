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
import { mockCampaigns, type Campaign } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdvancedFilters,
  type AdvancedFiltersData,
  defaultAdvancedFilters,
} from "@/components/campaigns/AdvancedFilters";

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
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    location: "",
    sources: ["Google", "LinkedIn"] as string[],
    minScore: 50,
    verifiedOnly: false,
  });

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersData>(
    defaultAdvancedFilters,
  );

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      niche: "",
      location: "",
      sources: ["Google", "LinkedIn"],
      minScore: 50,
      verifiedOnly: false,
    });
    setAdvancedFilters(defaultAdvancedFilters);
  };

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name || 'Nova Campanha',
      niche: formData.niche || 'Não definido',
      location: formData.location || 'Brasil',
      status: 'active',
      leadsFound: 0,
      leadsVerified: 0,
      createdAt: new Date().toISOString(),
      sources: formData.sources,
      filters: {
        minScore: formData.minScore,
        verifiedOnly: formData.verifiedOnly,
      },
    };
    setCampaigns([newCampaign, ...campaigns]);
    toast({
      title: "Campanha criada!",
      description: "Sua nova campanha foi criada com sucesso.",
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditCampaign = () => {
    if (!editingCampaign) return;
    
    setCampaigns(campaigns.map(c => 
      c.id === editingCampaign.id 
        ? {
            ...c,
            name: formData.name || c.name,
            niche: formData.niche || c.niche,
            location: formData.location || c.location,
            sources: formData.sources,
            filters: {
              minScore: formData.minScore,
              verifiedOnly: formData.verifiedOnly,
            },
          }
        : c
    ));
    toast({
      title: "Campanha atualizada!",
      description: "As alterações foram salvas.",
    });
    setEditingCampaign(null);
    resetForm();
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast({
      title: "Campanha excluída",
      description: "A campanha foi removida com sucesso.",
    });
    setDeleteConfirm(null);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    ));
  };

  const openEditModal = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      niche: campaign.niche,
      location: campaign.location,
      sources: campaign.sources || [],
      minScore: campaign.filters?.minScore || 50,
      verifiedOnly: campaign.filters?.verifiedOnly || false,
    });
    setEditingCampaign(campaign);
  };

  const toggleSource = (source: string) => {
    setFormData(prev => ({
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

  // Form fields directly inline to prevent focus loss

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
            <DialogContent className="max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
                <DialogDescription>
                  Configure os parâmetros da sua campanha de prospecção
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <ScrollArea className="max-h-[calc(90vh-240px)] pr-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Nome da Campanha</Label>
                        <Input
                          placeholder="Ex: Agências de Marketing SP"
                          className="bg-secondary/50"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Nicho/Segmento</Label>
                        <Input
                          placeholder="Ex: Agências de Marketing Digital"
                          className="bg-secondary/50"
                          value={formData.niche}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, niche: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Localização</Label>
                        <Input
                          placeholder="Ex: São Paulo, SP"
                          className="bg-secondary/50"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Fontes de Dados</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableSources.map((source) => (
                            <label
                              key={source}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                                formData.sources.includes(source)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-secondary/50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.sources.includes(source)}
                                onChange={() => toggleSource(source)}
                                className="rounded border-border"
                              />
                              <span className="text-sm">{source}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Score Mínimo</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="bg-secondary/50"
                            value={formData.minScore}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                minScore: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <Label className="text-sm font-medium">Apenas Verificados</Label>
                          <Switch
                            checked={formData.verifiedOnly}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({ ...prev, verifiedOnly: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="advanced">
                  <ScrollArea className="max-h-[calc(90vh-240px)] pr-4">
                    <AdvancedFilters data={advancedFilters} onChange={setAdvancedFilters} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateCampaign}>Criar Campanha</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Edit Modal */}
        <Dialog open={!!editingCampaign} onOpenChange={(open) => { if (!open) { setEditingCampaign(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Campanha</DialogTitle>
              <DialogDescription>Altere os parâmetros da campanha</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Nome da Campanha</Label>
                <Input 
                  placeholder="Ex: Agências de Marketing SP" 
                  className="bg-secondary/50"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Nicho/Segmento</Label>
                <Input 
                  placeholder="Ex: Agências de Marketing Digital" 
                  className="bg-secondary/50"
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Localização</Label>
                <Input 
                  placeholder="Ex: São Paulo, SP" 
                  className="bg-secondary/50"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Fontes de Dados</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSources.map(source => (
                    <label 
                      key={source} 
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        formData.sources.includes(source) 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-secondary/50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={formData.sources.includes(source)}
                        onChange={() => toggleSource(source)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Score Mínimo</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    className="bg-secondary/50"
                    value={formData.minScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <Label className="text-sm font-medium">Apenas Verificados</Label>
                  <Switch 
                    checked={formData.verifiedOnly}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verifiedOnly: checked }))}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                <Button variant="outline" onClick={() => { setEditingCampaign(null); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleEditCampaign}>
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </div>
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
              <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteCampaign(deleteConfirm)}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="stat">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Campanhas Ativas</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {campaigns.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-accent/10">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="stat">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Leads Este Mês</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {campaigns.reduce((acc, c) => acc + c.leadsFound, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card variant="stat">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Verificação</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {campaigns.length > 0 
                        ? Math.round((campaigns.reduce((acc, c) => acc + c.leadsVerified, 0) / campaigns.reduce((acc, c) => acc + c.leadsFound, 0)) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-accent/10">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <Card variant="glass" className="hover:border-primary/30 transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-semibold">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{campaign.niche}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{campaign.location}</span>
                          </div>
                          {campaign.lastRun && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Última execução: </span>
                              <span>{new Date(campaign.lastRun).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex gap-4 sm:gap-6 mr-2 sm:mr-4">
                          <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-primary">{campaign.leadsFound}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Encontrados</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-accent">{campaign.leadsVerified}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Verificados</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {campaign.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 sm:h-10 sm:w-10"
                              onClick={() => toggleCampaignStatus(campaign.id)}
                            >
                              {campaign.status === 'active' ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => openEditModal(campaign)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 sm:h-10 sm:w-10 text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(campaign.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Sources */}
                    {campaign.sources && campaign.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.sources.map(source => (
                          <Badge key={source} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma campanha encontrada</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
