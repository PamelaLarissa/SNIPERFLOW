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
  Key,
  Zap,
  Building,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
        title="Configurações"
        subtitle="Personalize sua experiência no LeadScan 365"
      />

      <Tabs defaultValue="workspace" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-secondary/50 border border-border p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="workspace" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Building className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Workspace</span>
            <span className="xs:hidden">WS</span>
          </TabsTrigger>
          <TabsTrigger value="whitelabel" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">White-Label</span>
            <span className="xs:hidden">WL</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Integrações</span>
            <span className="sm:hidden">Int</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Notificações</span>
            <span className="sm:hidden">Not</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">E-mail (SMTP)</span>
            <span className="sm:hidden">Mail</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Informações do Workspace
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua organização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome do Workspace</label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-secondary/50 max-w-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">E-mail de Contato</label>
                  <Input
                    type="email"
                    placeholder="contato@suaempresa.com"
                    className="bg-secondary/50 max-w-md"
                  />
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
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
                    <h4 className="font-semibold text-base sm:text-lg">Plano Pro</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">2.000 leads/mês • 3 nichos • 3 localidades • API</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold">R$ 197<span className="text-xs sm:text-sm font-normal text-muted-foreground">/mês</span></p>
                    <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto">
                      Upgrade para Agência
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="whitelabel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Personalização Visual
                </CardTitle>
                <CardDescription>
                  Personalize a aparência para seus clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-secondary/50 border border-dashed border-border flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Fazer Upload
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">PNG, SVG até 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Cor Primária</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-secondary/50 max-w-[120px] uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subdomínio Personalizado</label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="suaempresa"
                      className="bg-secondary/50 max-w-[200px]"
                    />
                    <span className="text-muted-foreground">.leadscan365.com</span>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Veja como ficará para seus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="p-6 rounded-xl border border-border"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}10 0%, transparent 100%)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: primaryColor }}
                    >
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-lg">{workspaceName}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-secondary/50 rounded w-3/4" />
                    <div className="h-3 bg-secondary/50 rounded w-1/2" />
                  </div>
                  <Button
                    className="mt-4"
                    style={{ background: primaryColor }}
                  >
                    Botão de Ação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { name: 'Google Sheets', description: 'Sincronize leads automaticamente', connected: true },
              { name: 'Slack', description: 'Receba notificações de novos leads', connected: true },
              { name: 'Trello', description: 'Crie cards automaticamente', connected: false },
              { name: 'Webhook', description: 'Envie dados para qualquer API', connected: false },
              { name: 'PipeDrive', description: 'Integração com CRM', connected: false },
              { name: 'HubSpot', description: 'Sincronize contatos e deals', connected: false },
            ].map((integration) => (
              <Card key={integration.name} variant="glass">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Switch checked={integration.connected} />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Novos leads encontrados', description: 'Receber alerta quando novos leads forem encontrados', enabled: true },
                  { label: 'Relatório diário', description: 'Resumo diário de atividades por e-mail', enabled: true },
                  { label: 'Leads de alta qualidade', description: 'Alerta imediato para leads com score > 80', enabled: true },
                  { label: 'Erros de verificação', description: 'Notificar quando houver falhas na verificação', enabled: false },
                  { label: 'Atualizações do sistema', description: 'Novidades e melhorias da plataforma', enabled: false },
                ].map((notification) => (
                  <div key={notification.label} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div>
                      <h4 className="font-medium">{notification.label}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
                <Button onClick={handleSave} className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="email">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Configuração SMTP
                </CardTitle>
                <CardDescription>
                  Configure seu servidor de e-mail para envio de campanhas automáticas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Host SMTP</label>
                    <Input
                      placeholder="smtp.gmail.com"
                      className="bg-secondary/50"
                      value={smtpConfig.host}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Porta</label>
                    <Input
                      type="number"
                      placeholder="587"
                      className="bg-secondary/50"
                      value={smtpConfig.port}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value) || 587 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Usuário</label>
                    <Input
                      placeholder="seu@email.com"
                      className="bg-secondary/50"
                      value={smtpConfig.user}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Senha</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-secondary/50"
                      value={smtpConfig.pass}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Nome do Remetente</label>
                    <Input
                      placeholder="LeadScan 365"
                      className="bg-secondary/50"
                      value={smtpConfig.from}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, from: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveSmtp} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar Configuração
                  </Button>
                  <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                    {isTesting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};
