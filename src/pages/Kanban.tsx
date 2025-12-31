import { useState } from "react";
import { motion } from "framer-motion";
import {
  GripVertical,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Edit,
  Eye
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLeads, useUpdateLead, type Lead } from "@/hooks/useLeads";
import {
  kanbanColumns,
  kanbanColumnLabels,
  kanbanColumnColors,
  type KanbanColumn
} from "@/lib/constants";

const getScoreVariant = (score: number) => {
  if (score >= 80) return "score_high";
  if (score >= 50) return "score_medium";
  return "score_low";
};

// AI keywords for auto-movement
const aiKeywords: Record<string, KanbanColumn> = {
  'quero': 'qualified',
  'interesse': 'qualified',
  'gostei': 'qualified',
  'envia proposta': 'proposal',
  'manda proposta': 'proposal',
  'proposta': 'proposal',
  'fechado': 'won',
  'aceito': 'won',
  'não quero': 'lost',
  'cancelar': 'lost',
};

export const KanbanPage = () => {
  const { data: leads = [], isLoading } = useLeads();
  const updateLead = useUpdateLead();

  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [selectedForAi, setSelectedForAi] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    status: 'new' as KanbanColumn,
  });

  const getLeadsByColumn = (column: KanbanColumn) =>
    leads.filter(l => (l.status || 'new') === column);

  const moveLeadToColumn = (leadId: string, newColumn: KanbanColumn) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    updateLead.mutate({
      id: leadId,
      updates: { status: newColumn }
    });

    toast({
      title: "Lead movido!",
      description: `${lead.name} → ${kanbanColumnLabels[newColumn]}`,
    });
  };

  const handleAiAnalysis = () => {
    if (!selectedForAi || !aiInput.trim()) return;

    const lowerInput = aiInput.toLowerCase();
    let newStatus: KanbanColumn | null = null;

    for (const [keyword, status] of Object.entries(aiKeywords)) {
      if (lowerInput.includes(keyword)) {
        newStatus = status;
        break;
      }
    }

    if (newStatus) {
      moveLeadToColumn(selectedForAi, newStatus);
      toast({
        title: "IA detectou intenção!",
        description: `Movido automaticamente para "${kanbanColumnLabels[newStatus]}"`,
      });
    } else {
      toast({
        title: "Nenhuma intenção detectada",
        description: "Tente palavras como 'quero', 'proposta', 'fechado'",
        variant: "destructive",
      });
    }

    setAiInput("");
    setSelectedForAi(null);
  };

  const openEditModal = (lead: Lead) => {
    setFormData({
      name: lead.name,
      company: lead.company,
      status: lead.status || 'new',
    });
    setEditingLead(lead);
  };

  const handleEdit = () => {
    if (!editingLead) return;
    updateLead.mutate({
      id: editingLead.id,
      updates: { name: formData.name, company: formData.company, status: formData.status }
    });
    setEditingLead(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Kanban AI" subtitle="Carregando..." />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-96 w-72" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Kanban AI"
        subtitle="Funil de vendas com movimentação inteligente"
      />

      <div className="space-y-4 sm:space-y-6">
        {/* AI Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Análise AI - Simular mensagem do lead
                  </Label>
                  <div className="flex gap-2">
                    <Select value={selectedForAi || ''} onValueChange={setSelectedForAi}>
                      <SelectTrigger className="bg-secondary/50 w-full sm:w-48">
                        <SelectValue placeholder="Selecione lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Ex: 'Quero saber mais sobre o produto'"
                      className="bg-secondary/50 flex-1"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiAnalysis()}
                    />
                  </div>
                </div>
                <Button onClick={handleAiAnalysis} disabled={!selectedForAi || !aiInput.trim()}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analisar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Palavras-chave: "quero", "interesse" → Qualificado | "proposta" → Proposta | "fechado", "aceito" → Ganho | "não quero" → Perdido
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
            {kanbanColumns.map((column, colIndex) => (
              <motion.div
                key={column}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colIndex * 0.1 }}
                className="w-72 sm:w-auto shrink-0 sm:shrink"
              >
                <Card variant="glass" className={`${kanbanColumnColors[column]} h-full`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm sm:text-base">{kanbanColumnLabels[column]}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {getLeadsByColumn(column).length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 min-h-[300px] max-h-[60vh] overflow-y-auto">
                    {getLeadsByColumn(column).map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                        className="bg-card/80 rounded-lg p-3 border border-border/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="font-medium text-sm line-clamp-1">{lead.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{lead.company}</p>
                            </div>
                          </div>
                          <Badge variant={getScoreVariant(lead.score)} className="text-xs shrink-0">
                            {lead.score}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Mail className="h-3 w-3" />
                            </Button>
                            {lead.whatsapp && (
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setViewingLead(lead)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openEditModal(lead)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {/* Quick Move Buttons */}
                        <div className="flex gap-1 mt-2 pt-2 border-t border-border/30">
                          {kanbanColumns.filter(c => c !== column).slice(0, 2).map(targetCol => (
                            <Button
                              key={targetCol}
                              variant="ghost"
                              size="sm"
                              className="text-[10px] h-6 flex-1 px-1"
                              onClick={() => moveLeadToColumn(lead.id, targetCol)}
                            >
                              → {kanbanColumnLabels[targetCol]}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    {getLeadsByColumn(column).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhum lead
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={!!viewingLead} onOpenChange={(open) => { if (!open) setViewingLead(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          {viewingLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-xl">
                  {viewingLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{viewingLead.name}</h3>
                  <p className="text-muted-foreground">{viewingLead.company}</p>
                </div>
                <Badge variant={getScoreVariant(viewingLead.score)} className="ml-auto text-base px-3 py-1">
                  {viewingLead.score}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm truncate">{viewingLead.email}</p>
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
                  <p className="text-sm capitalize">{kanbanColumnLabels[viewingLead.status || 'new']}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setViewingLead(null)}>Fechar</Button>
            <Button onClick={() => { viewingLead && openEditModal(viewingLead); setViewingLead(null); }}>Editar</Button>
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
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as KanbanColumn }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kanbanColumns.map(col => (
                    <SelectItem key={col} value={col}>{kanbanColumnLabels[col]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingLead(null)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={updateLead.isPending}>
              {updateLead.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
