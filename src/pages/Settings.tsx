import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Upload,
  Palette,
  Globe,
  Mail,
  Bell,
  Shield,
  Zap,
  Building,
  Loader2,
  TestTube2,
  History
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ABTestView } from "@/components/settings/ABTestView";
import { EmailLogsView } from "@/components/settings/EmailLogsView";

export const SettingsPage = () => {
  const [workspaceName, setWorkspaceName] = useState("Minha Agência");
  const [primaryColor, setPrimaryColor] = useState("#06b6d4");
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: 587,
    user: "",
    pass: "",
    from: "LeadScan 365"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings');
      const data = await response.json();
      if (data.smtp_config) {
        setSmtpConfig(data.smtp_config);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleSaveSmtp = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });

      if (response.ok) {
        toast({ title: "Configuração Salva", description: "SMTP configurado e persistido com sucesso." });
      } else {
        const error = await response.json();
        toast({ title: "Erro na Configuração", description: error.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao conectar com o servidor.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('http://localhost:3001/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });

      if (response.ok) {
        toast({ title: "Conexão Bem-sucedida", description: "O servidor SMTP respondeu corretamente." });
      } else {
        const error = await response.json();
        toast({ title: "Falha na Conexão", description: error.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao testar conexão.", variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <DashboardLayout>
      <Header
        title="Sistema e Configurações"
        subtitle="Gerencie sua conta, configurações técnicas e ferramentas do sistema"
      />

      <Tabs defaultValue="workspace" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-secondary/50 border border-border p-1 w-max">
            <TabsTrigger value="workspace" className="gap-2 px-4 whitespace-nowrap">
              <Building className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="whitelabel" className="gap-2 px-4 whitespace-nowrap">
              <Palette className="h-4 w-4" />
              White-Label
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2 px-4 whitespace-nowrap">
              <Zap className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 px-4 whitespace-nowrap">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2 px-4 whitespace-nowrap">
              <Mail className="h-4 w-4" />
              E-mail (SMTP)
            </TabsTrigger>
            <TabsTrigger value="abtest" className="gap-2 px-4 whitespace-nowrap">
              <TestTube2 className="h-4 w-4" />
              Teste A/B
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2 px-4 whitespace-nowrap">
              <History className="h-4 w-4" />
              Logs de E-mail
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="workspace">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Informações do Workspace
                </CardTitle>
                <CardDescription>Configure as informações básicas da sua organização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome do Workspace</label>
                  <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="bg-secondary/50 max-w-md" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">E-mail de Contato</label>
                  <Input type="email" placeholder="contato@suaempresa.com" className="bg-secondary/50 max-w-md" />
                </div>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar Alterações</Button>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div>
                    <h4 className="font-semibold text-base">Plano Pro</h4>
                    <p className="text-xs text-muted-foreground">2.000 leads/mês • 3 nichos • 3 localidades • API</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold">R$ 197<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto">Upgrade para Agência</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="whitelabel">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Personalização Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-secondary/50 border border-dashed border-border flex items-center justify-center">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm">Fazer Upload</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cor Primária</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-secondary/50 max-w-[120px] uppercase" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subdomínio</label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="suaempresa" className="bg-secondary/50 max-w-[160px]" />
                    <span className="text-sm text-muted-foreground">.leadscan365.com</span>
                  </div>
                </div>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar Alterações</Button>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl border border-border" style={{ background: `linear-gradient(135deg, ${primaryColor}10 0%, transparent 100%)` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: primaryColor }}><Zap className="h-4 w-4 text-white" /></div>
                    <span className="font-bold">{workspaceName}</span>
                  </div>
                  <div className="space-y-2 mb-4"><div className="h-2 bg-secondary/50 rounded w-3/4" /><div className="h-2 bg-secondary/50 rounded w-1/2" /></div>
                  <Button size="sm" style={{ background: primaryColor }}>Ação</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="integrations">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Google Sheets', connected: true },
              { name: 'Slack', connected: true },
              { name: 'Trello', connected: false },
              { name: 'Webhook', connected: false },
              { name: 'PipeDrive', connected: false },
              { name: 'HubSpot', connected: false },
            ].map((int) => (
              <Card key={int.name} variant="glass">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center"><Globe className="h-4 w-4 text-muted-foreground" /></div>
                    <span className="font-medium text-sm">{int.name}</span>
                  </div>
                  <Switch checked={int.connected} />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Card variant="glass">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Preferências</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Novos leads', desc: 'Alertas de novos leads encontrados' },
                  { label: 'Relatório diário', desc: 'Resumo por e-mail' },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div><h4 className="font-medium text-sm">{n.label}</h4><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                    <Switch defaultChecked />
                  </div>
                ))}
                <Button onClick={handleSave} size="sm"><Save className="h-4 w-4 mr-2" />Salvar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="email">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />SMTP</CardTitle>
                <CardDescription>Configure seu servidor de e-mail para campanhas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-medium">Host</label><Input value={smtpConfig.host} onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Porta</label><Input type="number" value={smtpConfig.port} onChange={e => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value) || 587 })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Usuário</label><Input value={smtpConfig.user} onChange={e => setSmtpConfig({ ...smtpConfig, user: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Senha</label><Input type="password" value={smtpConfig.pass} onChange={e => setSmtpConfig({ ...smtpConfig, pass: e.target.value })} /></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSaveSmtp} disabled={isSaving} size="sm">{isSaving && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}Salvar</Button>
                  <Button variant="outline" onClick={handleTestConnection} disabled={isTesting} size="sm">{isTesting && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}Testar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="abtest">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ABTestView />
          </motion.div>
        </TabsContent>

        <TabsContent value="logs">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <EmailLogsView />
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};
