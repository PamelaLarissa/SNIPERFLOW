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
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdvancedFilters,
  type AdvancedFiltersData,
  defaultAdvancedFilters,
} from "@/components/campaigns/AdvancedFilters";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, type Campaign } from "@/hooks/useCampaigns";

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
    createCampaign.mutate({
      name: formData.name || 'Nova Campanha',
      niche: formData.niche || 'Não definido',
      location: formData.location || 'Brasil',
      status: 'active',
      sources: formData.sources,
      filters: {
        minScore: formData.minScore,
        verifiedOnly: formData.verifiedOnly,
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
        name: formData.name || editingCampaign.name,
        niche: formData.niche || editingCampaign.niche,
        location: formData.location || editingCampaign.location,
        sources: formData.sources,
        filters: {
          minScore: formData.minScore,
          verifiedOnly: formData.verifiedOnly,
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
                <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
                  {createCampaign.isPending ? "Criando..." : "Criar Campanha"}
                </Button>
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
                <Button onClick={handleEditCampaign} disabled={updateCampaign.isPending}>
                  {updateCampaign.isPending ? "Salvando..." : "Salvar Alterações"}
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
