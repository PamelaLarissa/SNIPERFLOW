import { useState } from "react";
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
  X
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { kanbanColumnLabels } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeads, useUpdateLead, type Lead } from "@/hooks/useLeads";

const getScoreVariant = (score: number) => {
  if (score >= 80) return "score_high";
  if (score >= 50) return "score_medium";
  return "score_low";
};

export const LeadsPage = () => {
  const { data: leads = [], isLoading, refetch } = useLeads();
  const updateLead = useUpdateLead();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
      }
    });
    setEditingLead(null);
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

        {/* Edit Modal */}
        <Dialog open={!!editingLead} onOpenChange={(open) => { if (!open) setEditingLead(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Lead</DialogTitle>
              <DialogDescription>Altere os dados do lead</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <Label className="text-sm font-medium mb-2 block">Website</Label>
                <Input 
                  className="bg-secondary/50"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <Label className="text-sm font-medium">WhatsApp</Label>
                  <Switch 
                    checked={formData.whatsapp}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsapp: checked }))}
                  />
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
                className={`cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5 ${
                  selectedLeads.includes(lead.id) ? 'border-primary ring-1 ring-primary' : ''
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => setViewingLead(lead)}
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
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
