import { useState } from "react";
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
  Building
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
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
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
      </Tabs>
    </DashboardLayout>
  );
};
