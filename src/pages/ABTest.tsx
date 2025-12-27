import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TestTube2, 
  Plus, 
  Edit, 
  Trash2, 
  Trophy,
  Send,
  BarChart3,
  Percent
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { mockMessageVariants, mockCampaigns, type MessageVariant } from "@/lib/mockData";

export const ABTestPage = () => {
  const [variants, setVariants] = useState<MessageVariant[]>(mockMessageVariants);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<MessageVariant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    campaignId: '',
    name: '',
    text: '',
  });

  const resetForm = () => {
    setFormData({
      campaignId: '',
      name: '',
      text: '',
    });
  };

  const handleCreate = () => {
    if (!formData.campaignId || !formData.name || !formData.text) {
      toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const newVariant: MessageVariant = {
      id: Date.now().toString(),
      campaignId: formData.campaignId,
      name: formData.name,
      text: formData.text,
      sent: 0,
      opened: 0,
    };

    setVariants([...variants, newVariant]);
    toast({ title: "Variante criada!" });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingVariant) return;
    
    setVariants(variants.map(v => 
      v.id === editingVariant.id
        ? { ...v, name: formData.name, text: formData.text, campaignId: formData.campaignId }
        : v
    ));
    toast({ title: "Variante atualizada!" });
    setEditingVariant(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
    toast({ title: "Variante excluída" });
    setDeleteConfirm(null);
  };

  const simulateSend = (id: string) => {
    setVariants(variants.map(v => {
      if (v.id === id) {
        const newSent = v.sent + 10;
        const openRate = 0.2 + Math.random() * 0.3; // 20-50% open rate
        const newOpened = v.opened + Math.round(10 * openRate);
        return { ...v, sent: newSent, opened: newOpened };
      }
      return v;
    }));
    toast({ title: "Envio simulado!", description: "10 mensagens enviadas" });
    
    // Check for winner after 100 sends
    setTimeout(() => checkForWinner(), 100);
  };

  const checkForWinner = () => {
    const grouped = variants.reduce((acc, v) => {
      if (!acc[v.campaignId]) acc[v.campaignId] = [];
      acc[v.campaignId].push(v);
      return acc;
    }, {} as Record<string, MessageVariant[]>);

    Object.entries(grouped).forEach(([campaignId, campaignVariants]) => {
      const allOver100 = campaignVariants.every(v => v.sent >= 100);
      if (allOver100 && !campaignVariants.some(v => v.isWinner)) {
        const best = campaignVariants.reduce((a, b) => 
          (a.opened / a.sent) > (b.opened / b.sent) ? a : b
        );
        setVariants(prev => prev.map(v => 
          v.id === best.id ? { ...v, isWinner: true } : v
        ));
        toast({ 
          title: "Vencedor detectado!", 
          description: `"${best.name}" tem a melhor taxa de abertura!` 
        });
      }
    });
  };

  const openEditModal = (variant: MessageVariant) => {
    setFormData({
      campaignId: variant.campaignId,
      name: variant.name,
      text: variant.text,
    });
    setEditingVariant(variant);
  };

  const getOpenRate = (variant: MessageVariant) => 
    variant.sent > 0 ? ((variant.opened / variant.sent) * 100).toFixed(1) : '0.0';

  const getCampaignName = (campaignId: string) => 
    mockCampaigns.find(c => c.id === campaignId)?.name || 'Campanha';

  // Group variants by campaign
  const groupedVariants = variants.reduce((acc, v) => {
    if (!acc[v.campaignId]) acc[v.campaignId] = [];
    acc[v.campaignId].push(v);
    return acc;
  }, {} as Record<string, MessageVariant[]>);

  return (
    <DashboardLayout>
      <Header 
        title="Teste A/B" 
        subtitle="Teste diferentes versões de mensagens" 
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
              <TestTube2 className="h-3 w-3 mr-1" />
              {variants.length} variantes
            </Badge>
            <Badge variant="verified" className="text-sm">
              {variants.filter(v => v.isWinner).length} vencedoras
            </Badge>
          </div>
          <Button variant="glow" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Variante
          </Button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Como funciona</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Crie variantes de mensagens para cada campanha. Após 100 envios por variante, 
                    o sistema identifica automaticamente a versão com melhor taxa de abertura.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaigns with variants */}
        {Object.entries(groupedVariants).map(([campaignId, campaignVariants], groupIndex) => (
          <motion.div
            key={campaignId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + groupIndex * 0.1 }}
          >
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                  <span>{getCampaignName(campaignId)}</span>
                  <Badge variant="outline" className="text-xs">
                    {campaignVariants.length} variantes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaignVariants.map((variant, index) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${
                        variant.isWinner 
                          ? 'bg-accent/10 border-accent/30' 
                          : 'bg-secondary/20 border-border/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{variant.name}</span>
                          {variant.isWinner && (
                            <Badge variant="verified" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Vencedor
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => openEditModal(variant)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive"
                            onClick={() => setDeleteConfirm(variant.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {variant.text}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Taxa de Abertura</span>
                          <span className="font-semibold text-primary">{getOpenRate(variant)}%</span>
                        </div>
                        <Progress 
                          value={parseFloat(getOpenRate(variant))} 
                          className="h-2"
                        />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded bg-secondary/30 text-center">
                            <p className="text-muted-foreground">Enviados</p>
                            <p className="font-semibold">{variant.sent}</p>
                          </div>
                          <div className="p-2 rounded bg-secondary/30 text-center">
                            <p className="text-muted-foreground">Abertos</p>
                            <p className="font-semibold">{variant.opened}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => simulateSend(variant.id)}
                        >
                          <Send className="h-3 w-3 mr-2" />
                          Simular Envio (+10)
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {Object.keys(groupedVariants).length === 0 && (
          <Card variant="glass">
            <CardContent className="p-8 text-center">
              <TestTube2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma variante criada ainda</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Variante
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Variante</DialogTitle>
            <DialogDescription>Crie uma nova versão de mensagem para teste</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Campanha</Label>
              <Select value={formData.campaignId} onValueChange={(v) => setFormData(prev => ({ ...prev, campaignId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione uma campanha" />
                </SelectTrigger>
                <SelectContent>
                  {mockCampaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Nome da Variante</Label>
              <Input 
                placeholder="Ex: Versão A - Formal"
                className="bg-secondary/50"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Texto da Mensagem</Label>
              <Textarea 
                placeholder="Use {nome} para personalizar..."
                className="bg-secondary/50 min-h-[100px]"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Variante</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingVariant} onOpenChange={(open) => { if (!open) { setEditingVariant(null); resetForm(); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Variante</DialogTitle>
            <DialogDescription>Altere os dados da variante</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Campanha</Label>
              <Select value={formData.campaignId} onValueChange={(v) => setFormData(prev => ({ ...prev, campaignId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCampaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Nome da Variante</Label>
              <Input 
                className="bg-secondary/50"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Texto da Mensagem</Label>
              <Textarea 
                className="bg-secondary/50 min-h-[100px]"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingVariant(null)}>Cancelar</Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir esta variante?</DialogDescription>
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
