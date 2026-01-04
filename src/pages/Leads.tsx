import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Plus,
  Building2,
  Info,
  Mail,
  Phone,
  Globe,
  X,
  Filter,
  Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeads, useCreateLead, useUpdateLead, type Lead } from "@/hooks/useLeads";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";
import { kanbanColumnLabels } from "@/lib/constants";
import { LeadsListView } from "@/components/leads/LeadsListView";
import { LeadsKanbanView } from "@/components/leads/LeadsKanbanView";
import { LeadsRadarView } from "@/components/leads/LeadsRadarView";
import { useSearchParams, useNavigate } from "react-router-dom";

export const LeadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const campaignFilter = searchParams.get('campaign');

  const { data: allLeads = [], isLoading, refetch } = useLeads();
  const { data: campaigns = [] } = useCampaigns();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const { toast } = useToast();

  // Filter leads by campaign if campaignFilter is present
  const leads = campaignFilter
    ? allLeads.filter(lead => lead.campaignId === campaignFilter)
    : allLeads;

  const activeCampaign = campaignFilter
    ? campaigns.find(c => c.id === campaignFilter)
    : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cnpjSearch, setCnpjSearch] = useState("");
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    whatsapp: false,
    score: 0,
    status: 'new' as Lead['status'],
    website: '',
    address: '',
    niche: '',
    whatsappNumber: '',
    street: '',
    numberComplement: '',
    neighborhood: '',
    zipCode: '',
    cityState: '',
  });

  const handleExportCSV = () => {
    const list = selectedLeads.length > 0 ? selectedLeads : (searchTerm ? leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map(l => l.id) : leads.map(l => l.id));
    toast({
      title: "Extração de Dados Iniciada",
      description: `${list.length} alvos sendo exportados para relatório tático.`,
    });
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const openEditModal = (lead: Lead) => {
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      whatsapp: lead.whatsapp ?? false,
      score: lead.score,
      status: lead.status || 'new',
      website: lead.website || '',
      address: lead.address || '',
      niche: lead.niche || '',
      whatsappNumber: lead.whatsappNumber || '',
      street: lead.street || '',
      numberComplement: lead.numberComplement || '',
      neighborhood: lead.neighborhood || '',
      zipCode: lead.zipCode || '',
      cityState: lead.cityState || '',
    });
    setEditingLead(lead);
  };

  const handleEditLead = () => {
    if (!editingLead) return;
    updateLead.mutate({
      id: editingLead.id,
      updates: { ...formData }
    });
    setEditingLead(null);
  };

  const handleCreateLead = () => {
    createLead.mutate({
      ...formData,
      name: formData.name || 'Alvo Não Identificado',
      source: 'manual',
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', company: '', email: '', phone: '',
      whatsapp: false, score: 0, status: 'new',
      website: '', address: '', niche: '', whatsappNumber: '',
      street: '', numberComplement: '', neighborhood: '',
      zipCode: '', cityState: '',
    });
    setCnpjSearch("");
    setEnrichedData(null);
  };

  const handleSearchCNPJ = async () => {
    const cleanCNPJ = cnpjSearch.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) {
      toast({ title: "CNPJ Inválido", description: "O código deve ter 14 dígitos.", variant: "destructive" });
      return;
    }
    setIsSearchingCNPJ(true);
    try {
      const response = await fetch(`http://localhost:3001/api/enrich/cnpj/${cleanCNPJ}`);
      const data = await response.json();

      if (response.ok) {
        let calculatedScore = 0;
        if (data.capital_social > 1000000) calculatedScore += 40;
        else if (data.capital_social > 100000) calculatedScore += 20;

        const isMobile = data.phone && data.phone.length >= 10 && data.phone.substring(2, 3) === '9';

        setEnrichedData(data);
        setFormData(prev => ({
          ...prev,
          name: data.name,
          company: data.company,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          whatsapp: isMobile || prev.whatsapp,
          whatsappNumber: isMobile ? data.phone : prev.whatsappNumber,
          score: Math.min(100, calculatedScore),
          website: data.email ? `https://www.${data.email.split('@')[1]}` : prev.website,
          address: data.address,
          street: data.street,
          numberComplement: `${data.number}${data.complement ? ' - ' + data.complement : ''}`,
          neighborhood: data.neighborhood,
          zipCode: data.zip_code,
          cityState: `${data.city} - ${data.state}`,
        }));
        toast({ title: "Intel Coletada!", description: "Dados do alvo preenchidos com sucesso." });
      } else {
        throw new Error(data.error || "Erro na busca");
      }
    } catch (error) {
      toast({ title: "Falha na Inteligência", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Base de Alvos" subtitle="Carregando inteligência..." />
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title={activeCampaign ? `Alvos da Missão: ${activeCampaign.name}` : "Base de Alvos"}
        subtitle={activeCampaign ? "Visualize os alvos engajados nesta missão." : "Gerencie e qualifique seus alvos mapeados."}
      />

      {/* Campaign Filter Indicator */}
      {activeCampaign && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <Filter className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                Filtro de Missão Ativo: <span className="text-primary">{activeCampaign.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Exibindo {leads.length} alvos desta operação.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/leads')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar Filtro
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rastrear por nome, empresa ou e-mail..."
            className="pl-10 bg-secondary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedLeads.length > 0 && (
            <Button variant="outline" size="sm" className="h-9 gap-2">
              Ações Táticas ({selectedLeads.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/campaigns?new=true')}
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Zap className="h-4 w-4" />
            Nova Missão
          </Button>
          <Button variant="glow" onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Inserir Alvo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="list" className="px-6">Relatório (Lista)</TabsTrigger>
            <TabsTrigger value="kanban" className="px-6">Quadro Tático (Kanban)</TabsTrigger>
            <TabsTrigger value="radar" className="px-6">Radar (Mapa)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="m-0 focus-visible:ring-0">
          <LeadsListView
            leads={leads}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterToggle={() => setFilterOpen(!filterOpen)}
            filterOpen={filterOpen}
            onRefresh={() => refetch()}
            onExport={handleExportCSV}
            onCreateOpen={() => setIsCreateOpen(true)}
            selectedLeads={selectedLeads}
            onToggleLeadSelection={toggleLeadSelection}
            onClearSelection={() => setSelectedLeads([])}
            onExportSelected={handleExportCSV}
            onViewLead={setViewingLead}
            onEditLead={openEditModal}
            campaigns={campaigns}
          />
        </TabsContent>

        <TabsContent value="kanban" className="m-0 focus-visible:ring-0">
          <LeadsKanbanView
            leads={leads}
            onMoveLead={(id, status) => updateLead.mutate({ id, updates: { status } })}
            onViewLead={setViewingLead}
            onEditLead={openEditModal}
          />
        </TabsContent>

        <TabsContent value="radar" className="m-0 focus-visible:ring-0">
          <LeadsRadarView
            leads={leads}
            onViewLead={setViewingLead}
          />
        </TabsContent>
      </Tabs>

      {/* Shared Modals (Creation, Edit, View) */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Alvo</DialogTitle>
            <DialogDescription>Adicione manualmente ou busque por CNPJ para autopreencher</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
              <Input
                placeholder="Digite o CNPJ..."
                value={cnpjSearch}
                onChange={(e) => setCnpjSearch(e.target.value)}
                className="bg-background"
              />
              <Button onClick={handleSearchCNPJ} disabled={isSearchingCNPJ || !cnpjSearch}>
                {isSearchingCNPJ ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {enrichedData && (
              <div className="p-3 bg-accent/5 rounded border border-accent/20 text-xs grid grid-cols-2 gap-2">
                <p><span className="text-muted-foreground">Capital:</span> R$ {enrichedData.capital_social?.toLocaleString()}</p>
                <p><span className="text-muted-foreground">Porte:</span> {enrichedData.porte}</p>
                <p className="col-span-2"><span className="text-muted-foreground">Situação:</span> {enrichedData.situacao}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Abortar</Button>
            <Button onClick={handleCreateLead}>Registrar Alvo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {
        editingLead && (
          <Dialog open={!!editingLead} onOpenChange={open => !open && setEditingLead(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Intel do Alvo</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as Lead['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(kanbanColumnLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Score</Label>
                  <Input type="number" value={formData.score} onChange={e => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingLead(null)}>Abortar</Button>
                <Button onClick={handleEditLead}>Atualizar Intel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }

      {
        viewingLead && (
          <Dialog open={!!viewingLead} onOpenChange={open => !open && setViewingLead(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dossiê do Alvo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {viewingLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{viewingLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{viewingLead.company}</p>
                  </div>
                  <Badge className="ml-auto">{viewingLead.score}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">E-mail</span>
                    <span className="text-foreground truncate">{viewingLead.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Tel</span>
                    <span className="text-foreground">{viewingLead.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Nicho</span>
                    <span className="text-foreground">{viewingLead.niche}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-foreground capitalize">{kanbanColumnLabels[viewingLead.status || 'new']}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </DashboardLayout>
  );
};
