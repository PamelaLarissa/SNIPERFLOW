import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Globe,
  ChevronDown,
  Edit,
  Eye,
  X,
  Plus,
  Info,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { kanbanColumnLabels } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeads, useCreateLead, useUpdateLead, type Lead } from "@/hooks/useLeads";

const getScoreVariant = (score: number) => {
  if (score >= 80) return "score_high";
  if (score >= 50) return "score_medium";
  return "score_low";
};

export const LeadsPage = () => {
  const { data: leads = [], isLoading, refetch } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cnpjSearch, setCnpjSearch] = useState("");
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const { toast } = useToast();
  const LEADS_PER_PAGE = 15;

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

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    toast({
      title: "Exportação iniciada",
      description: `${selectedLeads.length > 0 ? selectedLeads.length : filteredLeads.length} leads serão exportados`,
    });
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
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
      updates: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        score: formData.score,
        status: formData.status,
        website: formData.website,
        whatsappNumber: formData.whatsappNumber,
        street: formData.street,
        numberComplement: formData.numberComplement,
        neighborhood: formData.neighborhood,
        zipCode: formData.zipCode,
        cityState: formData.cityState,
      }
    });
    setEditingLead(null);
  };

  const handleCreateLead = () => {
    createLead.mutate({
      name: formData.name || 'Novo Lead',
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      score: formData.score,
      status: formData.status,
      website: formData.website,
      source: 'manual',
      address: formData.address,
      niche: formData.niche,
      whatsappNumber: formData.whatsappNumber,
      street: formData.street,
      numberComplement: formData.numberComplement,
      neighborhood: formData.neighborhood,
      zipCode: formData.zipCode,
      cityState: formData.cityState,
      situacao: enrichedData?.situacao,
      capitalSocial: enrichedData?.capital_social,
      naturezaJuridica: enrichedData?.natureza_juridica,
      partners: enrichedData?.partners,
      inicioAtividade: enrichedData?.inicio_atividade,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      whatsapp: false,
      score: 0,
      status: 'new',
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
    setCnpjSearch("");
    setEnrichedData(null);
  };

  const handleSearchCNPJ = async () => {
    const cleanCNPJ = cnpjSearch.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) {
      toast({ title: "CNPJ Inválido", description: "O CNPJ deve ter 14 dígitos.", variant: "destructive" });
      setIsSearchingCNPJ(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/enrich/cnpj/${cleanCNPJ}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("O servidor retornou uma resposta inválida (não-JSON). Verifique se o backend está rodando corretamente.");
      }

      const data = await response.json();

      if (response.ok) {
        // Calculate a basic score based on company data
        let calculatedScore = 0;
        if (data.capital_social > 1000000) calculatedScore += 40;
        else if (data.capital_social > 100000) calculatedScore += 20;

        if (data.porte === 'DEMAIS') calculatedScore += 30;
        else if (data.porte === 'EPP') calculatedScore += 20;

        const yearsInBusiness = new Date().getFullYear() - new Date(data.inicio_atividade).getFullYear();
        if (yearsInBusiness > 10) calculatedScore += 30;
        else if (yearsInBusiness > 5) calculatedScore += 15;

        // Detect if phone is likely a mobile (WhatsApp)
        const isMobile = data.phone && data.phone.length >= 10 && data.phone.substring(2, 3) === '9';

        // Format date from YYYY-MM-DD to DD/MM/YYYY
        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          const [y, m, d] = dateStr.split('-');
          return `${d}/${m}/${y}`;
        };

        const formattedInicio = formatDate(data.inicio_atividade);
        const formattedSituacaoDate = formatDate(data.data_situacao);

        setEnrichedData({
          ...data,
          inicio_atividade_formatada: formattedInicio,
          data_situacao_formatada: formattedSituacaoDate
        });

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
          niche: data.niche,
          street: data.street,
          numberComplement: `${data.number}${data.complement ? ' - ' + data.complement : ''}`,
          neighborhood: data.neighborhood,
          zipCode: data.zip_code,
          cityState: `${data.city} - ${data.state}`,
          ...data
        }));
        toast({ title: "Dados encontrados!", description: "Score e campos preenchidos automaticamente." });
      } else {
        throw new Error(data.error || "Erro desconhecido na busca");
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Leads" subtitle="Carregando..." />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Leads"
        subtitle="Gerencie e exporte seus leads qualificados"
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)} className="shrink-0">
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtros</span>
                <ChevronDown className={`h-4 w-4 ml-1 sm:ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button variant="default" onClick={handleExportCSV} className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Exportar CSV</span>
              </Button>
              <Button variant="glow" onClick={() => setIsCreateOpen(true)} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Lead</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card variant="glass">
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Score Mínimo</Label>
                    <Input type="number" placeholder="0" className="bg-secondary/50" />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Fonte</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="maps">Google Maps</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Status</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="verified">Verificado</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="secondary" className="w-full">
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Selection Info */}
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <span className="text-sm font-medium">
              {selectedLeads.length} lead(s) selecionado(s)
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" size="sm" onClick={() => setSelectedLeads([])} className="flex-1 sm:flex-none">
                Limpar seleção
              </Button>
              <Button size="sm" onClick={handleExportCSV} className="flex-1 sm:flex-none">
                Exportar selecionados
              </Button>
            </div>
          </motion.div>
        )}

        {/* Create Modal */}
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lead</DialogTitle>
              <DialogDescription>Adicione um novo lead manualmente ou busque por CNPJ</DialogDescription>
            </DialogHeader>

            {/* CNPJ Search */}
            <div className="flex flex-col gap-2 p-4 bg-secondary/30 rounded-lg border border-border/50 mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o CNPJ para buscar dados..."
                  value={cnpjSearch}
                  onChange={(e) => setCnpjSearch(e.target.value)}
                  className="bg-background"
                />
                <Button onClick={handleSearchCNPJ} disabled={isSearchingCNPJ || !cnpjSearch}>
                  {isSearchingCNPJ ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {enrichedData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 p-3 bg-background/50 rounded border border-accent/20 text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-accent">Informações Adicionais Encontradas:</h4>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setEnrichedData(null)}>Limpar</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p><span className="text-muted-foreground">Capital Social:</span> R$ {enrichedData.capital_social?.toLocaleString()}</p>
                    <p><span className="text-muted-foreground">Porte:</span> {enrichedData.porte}</p>
                    <p className="col-span-2"><span className="text-muted-foreground">Natureza:</span> {enrichedData.natureza_juridica}</p>
                    <p className="col-span-2"><span className="text-muted-foreground">Sócios:</span> {enrichedData.partners}</p>
                    <p><span className="text-muted-foreground">Abertura:</span> {enrichedData.inicio_atividade_formatada}</p>
                    <p><span className="text-muted-foreground">Situação:</span> <span className={enrichedData.situacao === 'ATIVA' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{enrichedData.situacao}</span></p>
                    <p className="col-span-2"><span className="text-muted-foreground">Ativa desde:</span> {enrichedData.data_situacao_formatada}</p>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex items-start gap-2 text-amber-500/80 italic">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    <p>Nota: O telefone e e-mail vêm da Receita Federal e podem estar desatualizados. Recomendamos validar antes do contato.</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Nome</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Empresa</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Website</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Atividade (Nicho)</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">E-mail</Label>
                <Input
                  type="email"
                  className="bg-secondary/50"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Telefone</Label>
                  <Input
                    className="bg-secondary/50"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Score (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="bg-secondary/50"
                    value={formData.score}
                    onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <h4 className="text-sm font-semibold text-accent">Endereço Detalhado</h4>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Logradouro (Rua/Av)</Label>
                  <Input
                    className="bg-secondary/50"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Número e Complemento</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.numberComplement}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberComplement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bairro</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">CEP</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Cidade e Estado</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.cityState}
                      onChange={(e) => setFormData(prev => ({ ...prev, cityState: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Lead['status'] }))}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(kanbanColumnLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 space-y-3">
                <div className="flex items-start gap-2 text-accent">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Número Dedicado para WhatsApp</p>
                    <p className="text-muted-foreground italic">
                      Muitas vezes o telefone do CNPJ é fixo. Use este campo para informar o celular/WhatsApp direto do contato.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 11999999999"
                    className="bg-background"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        whatsappNumber: val,
                        whatsapp: val.length > 0
                      }));
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-[10px] h-10"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      whatsappNumber: prev.phone,
                      whatsapp: prev.phone.length > 0
                    }))}
                  >
                    Copiar Principal
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateLead} disabled={createLead.isPending}>
                {createLead.isPending ? "Criando..." : "Criar Lead"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={!!editingLead} onOpenChange={(open) => { if (!open) setEditingLead(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Lead</DialogTitle>
              <DialogDescription>Altere os dados do lead</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Nome</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Empresa</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Website</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Atividade (Nicho)</Label>
                <Input
                  className="bg-secondary/50"
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">E-mail</Label>
                <Input
                  type="email"
                  className="bg-secondary/50"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Telefone</Label>
                  <Input
                    className="bg-secondary/50"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Score (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="bg-secondary/50"
                    value={formData.score}
                    onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <h4 className="text-sm font-semibold text-accent">Endereço Detalhado</h4>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Logradouro (Rua/Av)</Label>
                  <Input
                    className="bg-secondary/50"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Número e Complemento</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.numberComplement}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberComplement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bairro</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">CEP</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Cidade e Estado</Label>
                    <Input
                      className="bg-secondary/50"
                      value={formData.cityState}
                      onChange={(e) => setFormData(prev => ({ ...prev, cityState: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Lead['status'] }))}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(kanbanColumnLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 space-y-3">
                <div className="flex items-start gap-2 text-accent">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Número Dedicado para WhatsApp</p>
                    <p className="text-muted-foreground italic">
                      Muitas vezes o telefone do CNPJ é fixo. Use este campo para informar o celular/WhatsApp direto do contato.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 11999999999"
                    className="bg-background"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        whatsappNumber: val,
                        whatsapp: val.length > 0
                      }));
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-[10px] h-10"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      whatsappNumber: prev.phone,
                      whatsapp: prev.phone.length > 0
                    }))}
                  >
                    Copiar Principal
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingLead(null)}>Cancelar</Button>
              <Button onClick={handleEditLead} disabled={updateLead.isPending}>
                {updateLead.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={!!viewingLead} onOpenChange={(open) => { if (!open) setViewingLead(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Lead</DialogTitle>
            </DialogHeader>
            {viewingLead && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-2xl">
                    {viewingLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{viewingLead.name}</h3>
                    <p className="text-muted-foreground">{viewingLead.company}</p>
                  </div>
                  <Badge variant={getScoreVariant(viewingLead.score)} className="ml-auto text-lg px-3 py-1">
                    {viewingLead.score}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm">{viewingLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm">{viewingLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fonte</p>
                    <p className="text-sm">{viewingLead.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm">{kanbanColumnLabels[viewingLead.status || 'new']}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingLead(null)}>Fechar</Button>
              <Button onClick={() => { setViewingLead(null); viewingLead && openEditModal(viewingLead); }}>Editar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {paginatedLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                variant="glass"
                className={`cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5 ${selectedLeads.includes(lead.id) ? 'border-primary ring-1 ring-primary' : ''
                  }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                      onClick={() => toggleLeadSelection(lead.id)}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-base sm:text-lg shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{lead.name}</h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={getScoreVariant(lead.score)}>
                        {lead.score}
                      </Badge>
                      {lead.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{lead.phone}</span>
                      {lead.whatsapp && (
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    {lead.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{lead.website}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-border/50">
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                    <div className="flex gap-1">
                      <Link to={`/leads/${lead.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => openEditModal(lead)}
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {paginatedLeads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum lead encontrado
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
