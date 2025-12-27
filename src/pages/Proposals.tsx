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
  XCircle
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
import { useToast } from "@/hooks/use-toast";
import { mockProposals, mockLeads, type Proposal } from "@/lib/mockData";
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
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

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
    if (!formData.leadId || formData.products.length === 0) {
      toast({ title: "Erro", description: "Selecione um lead e adicione produtos", variant: "destructive" });
      return;
    }

    const lead = mockLeads.find(l => l.id === formData.leadId);
    const newProposal: Proposal = {
      id: Date.now().toString(),
      leadId: formData.leadId,
      leadName: `${lead?.name} - ${lead?.company}`,
      products: formData.products,
      discount: formData.discount,
      total: calculateTotal(),
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    setProposals([newProposal, ...proposals]);
    toast({ title: "Proposta criada!", description: `Total: R$ ${newProposal.total.toFixed(2)}` });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingProposal) return;
    
    const lead = mockLeads.find(l => l.id === formData.leadId);
    setProposals(proposals.map(p => 
      p.id === editingProposal.id
        ? {
            ...p,
            leadId: formData.leadId,
            leadName: `${lead?.name} - ${lead?.company}`,
            products: formData.products,
            discount: formData.discount,
            total: calculateTotal(),
          }
        : p
    ));
    toast({ title: "Proposta atualizada!" });
    setEditingProposal(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProposals(proposals.filter(p => p.id !== id));
    toast({ title: "Proposta excluída" });
    setDeleteConfirm(null);
  };

  const handleSend = (id: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, status: 'sent' as const } : p
    ));
    toast({ title: "Proposta enviada!", description: "O lead receberá a proposta por e-mail" });
  };

  const handleStatusChange = (id: string, status: 'accepted' | 'rejected') => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, status } : p
    ));
    toast({ 
      title: status === 'accepted' ? "Proposta aceita!" : "Proposta recusada",
      description: status === 'accepted' ? "Parabéns! Negócio fechado!" : "Lead marcado como perdido"
    });
  };

  const openEditModal = (proposal: Proposal) => {
    setFormData({
      leadId: proposal.leadId,
      products: proposal.products,
      discount: proposal.discount,
    });
    setEditingProposal(proposal);
  };

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="verified">Aceita</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Recusada</Badge>;
      case 'sent':
        return <Badge variant="pending">Enviada</Badge>;
      default:
        return <Badge variant="outline">Rascunho</Badge>;
    }
  };

  // Form fields inline to prevent focus loss

  return (
    <DashboardLayout>
      <Header 
        title="Propostas" 
        subtitle="Crie e gerencie propostas comerciais" 
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
              {proposals.length} propostas
            </Badge>
            <Badge variant="verified" className="text-sm">
              {proposals.filter(p => p.status === 'accepted').length} aceitas
            </Badge>
          </div>
          <Button variant="glow" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Proposta
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Propostas</p>
                <p className="text-2xl font-bold mt-1">{proposals.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Aceitas</p>
                <p className="text-2xl font-bold mt-1 text-accent">
                  {proposals.filter(p => p.status === 'accepted').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold mt-1 text-primary">
                  {proposals.filter(p => p.status === 'sent' || p.status === 'draft').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Valor Total</p>
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
                      <p className="text-xs text-muted-foreground">+ {proposal.products.length - 2} item(s)</p>
                    )}
                  </div>

                  {proposal.discount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-accent mb-2">
                      <span>Desconto</span>
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
                      Ver
                    </Button>
                    {proposal.status === 'draft' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openEditModal(proposal)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSend(proposal.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Enviar
                        </Button>
                      </>
                    )}
                    {proposal.status === 'sent' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-accent border-accent/30 hover:bg-accent/10"
                          onClick={() => handleStatusChange(proposal.id, 'accepted')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aceitar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleStatusChange(proposal.id, 'rejected')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Recusar
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive shrink-0"
                      onClick={() => setDeleteConfirm(proposal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
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
            <DialogTitle>Nova Proposta</DialogTitle>
            <DialogDescription>Crie uma proposta comercial para seu lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Lead</Label>
              <Select value={formData.leadId} onValueChange={(v) => setFormData(prev => ({ ...prev, leadId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um lead" />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Adicionar Produto</Label>
              <Select onValueChange={addProduct}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um produto" />
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
                <Label className="text-sm font-medium">Produtos Selecionados</Label>
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
                <Label className="text-sm font-medium mb-2 block">Desconto (%)</Label>
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
                <Label className="text-sm font-medium mb-2 block">Total</Label>
                <div className="h-10 flex items-center px-3 rounded-md bg-primary/10 border border-primary/20 font-semibold text-primary">
                  R$ {calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Criar Proposta</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingProposal} onOpenChange={(open) => { if (!open) { setEditingProposal(null); resetForm(); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proposta</DialogTitle>
            <DialogDescription>Altere os dados da proposta</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Lead</Label>
              <Select value={formData.leadId} onValueChange={(v) => setFormData(prev => ({ ...prev, leadId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um lead" />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Adicionar Produto</Label>
              <Select onValueChange={addProduct}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um produto" />
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
                <Label className="text-sm font-medium">Produtos Selecionados</Label>
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
                <Label className="text-sm font-medium mb-2 block">Desconto (%)</Label>
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
                <Label className="text-sm font-medium mb-2 block">Total</Label>
                <div className="h-10 flex items-center px-3 rounded-md bg-primary/10 border border-primary/20 font-semibold text-primary">
                  R$ {calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={() => { setEditingProposal(null); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewingProposal} onOpenChange={(open) => { if (!open) setViewingProposal(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
          </DialogHeader>
          {viewingProposal && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{viewingProposal.leadName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(viewingProposal.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
                {getStatusBadge(viewingProposal.status)}
              </div>
              
              <div className="border border-border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm mb-3">Itens</h4>
                {viewingProposal.products.map((product, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{product.name} x{product.quantity}</span>
                    <span>R$ {(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {viewingProposal.discount > 0 && (
                  <div className="flex justify-between text-sm text-accent pt-2 border-t border-border">
                    <span>Desconto</span>
                    <span>-{viewingProposal.discount}%</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">R$ {viewingProposal.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setViewingProposal(null)}>Fechar</Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF (Simulado)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir esta proposta?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
