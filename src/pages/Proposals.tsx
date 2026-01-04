import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProposals, useCreateProposal } from "@/hooks/useProposals";
import { useLeads } from "@/hooks/useLeads";
import { Proposal } from "@/lib/api";
import { format } from "date-fns";

const defaultProducts = [
  { name: 'Plano Básico', price: 97 },
  { name: 'Plano Pro', price: 197 },
  { name: 'Plano Agência', price: 497 },
  { name: 'Setup Inicial', price: 500 },
  { name: 'Treinamento', price: 300 },
  { name: 'Consultoria', price: 250 },
];

export const ProposalsPage = () => {
  const { data: proposals = [], isLoading } = useProposals();
  const { data: leads = [] } = useLeads();
  const createProposal = useCreateProposal();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);

  const [formData, setFormData] = useState({
    leadId: '',
    products: [] as { name: string; price: number; quantity: number }[],
    discount: 0,
  });

  const resetForm = () => {
    setFormData({
      leadId: '',
      products: [],
      discount: 0,
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    return subtotal * (1 - formData.discount / 100);
  };

  const addProduct = (productName: string) => {
    const product = defaultProducts.find(p => p.name === productName);
    if (!product) return;

    const existing = formData.products.find(p => p.name === productName);
    if (existing) {
      setFormData({
        ...formData,
        products: formData.products.map(p =>
          p.name === productName ? { ...p, quantity: p.quantity + 1 } : p
        )
      });
    } else {
      setFormData({
        ...formData,
        products: [...formData.products, { ...product, quantity: 1 }]
      });
    }
  };

  const removeProduct = (productName: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.name !== productName)
    });
  };

  const handleCreate = () => {
    if (!formData.leadId || formData.products.length === 0) return;

    const lead = leads.find(l => l.id === formData.leadId);
    createProposal.mutate({
      leadId: formData.leadId,
      leadName: `${lead?.name} - ${lead?.company}`,
      products: formData.products,
      discount: formData.discount,
      total: calculateTotal(),
      status: 'draft',
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
      }
    });
  };

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="verified">Missão Cumprida</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Abortada</Badge>;
      case 'sent':
        return <Badge variant="pending">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">Planejamento</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Relatórios de Combate" subtitle="Carregando estratégias..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Propostas de Missão"
        subtitle="Elabore e envie estratégias comerciais para seus alvos."
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"
        >
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm">
              <FileText className="h-3 w-3 mr-1" />
              {proposals.length} docs
            </Badge>
            <Badge variant="verified" className="text-sm">
              {proposals.filter(p => p.status === 'accepted').length} vitórias
            </Badge>
          </div>
          <Button variant="glow" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Estratégia
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total de Docs</p>
                <p className="text-2xl font-bold mt-1">{proposals.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Vitórias</p>
                <p className="text-2xl font-bold mt-1 text-accent">
                  {proposals.filter(p => p.status === 'accepted').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Em Curso</p>
                <p className="text-2xl font-bold mt-1 text-primary">
                  {proposals.filter(p => p.status === 'sent' || p.status === 'draft').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Potencial Bélico</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  R$ {proposals.filter(p => p.status === 'accepted').reduce((a, p) => a + p.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Proposals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="glass" className="h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{proposal.leadName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(proposal.createdAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    {getStatusBadge(proposal.status)}
                  </div>

                  <div className="space-y-1 mb-3">
                    {proposal.products.slice(0, 2).map((product, idx) => (
                      <div key={idx} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">{product.name} x{product.quantity}</span>
                        <span>R$ {(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {proposal.products.length > 2 && (
                      <p className="text-xs text-muted-foreground">+ {proposal.products.length - 2} recurso(s)</p>
                    )}
                  </div>

                  {proposal.discount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-accent mb-2">
                      <span>Incentivo Tático</span>
                      <span>-{proposal.discount}%</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {proposal.total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewingProposal(proposal)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Inspecionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Estratégia</DialogTitle>
            <DialogDescription>Crie uma proposta tática para engajar o alvo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Alvo</Label>
              <Select value={formData.leadId} onValueChange={(v) => setFormData(prev => ({ ...prev, leadId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um alvo" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Adicionar Recurso</Label>
              <Select onValueChange={addProduct}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um recurso" />
                </SelectTrigger>
                <SelectContent>
                  {defaultProducts.map(product => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name} - R$ {product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.products.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recursos Selecionados</Label>
                {formData.products.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{product.name}</span>
                      <Badge variant="outline" className="text-xs">x{product.quantity}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">R$ {(product.price * product.quantity).toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeProduct(product.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Incentivo (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  className="bg-secondary/50"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: Math.min(50, Math.max(0, parseInt(e.target.value) || 0)) }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Total da Operação</Label>
                <div className="h-10 px-3 rounded-md bg-secondary/50 flex items-center font-bold text-primary">
                  R$ {calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Abortar</Button>
            <Button onClick={handleCreate} disabled={createProposal.isPending}>
              {createProposal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Gerar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewingProposal} onOpenChange={(open) => { if (!open) setViewingProposal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Estratégia</DialogTitle>
          </DialogHeader>
          {viewingProposal && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{viewingProposal.leadName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(viewingProposal.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                {getStatusBadge(viewingProposal.status)}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                {viewingProposal.products.map((product, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{product.name} x{product.quantity}</span>
                    <span>R$ {(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {viewingProposal.discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Incentivo Tático</span>
                  <span>-{viewingProposal.discount}%</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border text-lg font-bold">
                <span>Total Confirmado</span>
                <span className="text-primary">R$ {viewingProposal.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
