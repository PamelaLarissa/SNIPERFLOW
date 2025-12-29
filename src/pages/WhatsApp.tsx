import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Phone,
  CheckCheck,
  Clock,
  User,
  BarChart3,
  RefreshCw,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLeads } from "@/hooks/useLeads";
import { Lead } from "@/lib/api";
import { format } from "date-fns";

interface Message {
  id: string;
  leadId: string;
  leadName: string;
  text: string;
  direction: 'sent' | 'received';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export const WhatsAppPage = () => {
  const { data: leads = [], isLoading } = useLeads();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [commandInput, setCommandInput] = useState("");
  const { toast } = useToast();

  const leadsWithWhatsapp = leads.filter(l => l.whatsapp);
  const selectedMessages = messages.filter(m => m.leadId === selectedLead);

  const mockStats = {
    totalSent: messages.filter(m => m.direction === 'sent').length,
    totalDelivered: messages.filter(m => m.status === 'delivered' || m.status === 'read').length,
    totalRead: messages.filter(m => m.status === 'read').length,
    responseRate: messages.length > 0 ? Math.round((messages.filter(m => m.direction === 'received').length / messages.filter(m => m.direction === 'sent').length) * 100) || 0 : 0,
  };

  const handleSendMessage = () => {
    if (!selectedLead || !newMessage.trim()) return;

    const lead = leads.find(l => l.id === selectedLead);
    const message: Message = {
      id: Date.now().toString(),
      leadId: selectedLead,
      leadName: lead?.name || 'Lead',
      text: newMessage,
      direction: 'sent',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages([...messages, message]);
    setNewMessage("");
    toast({ title: "Mensagem enviada!" });

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'delivered' as const } : m
      ));
    }, 1000);
  };

  const handleCommand = () => {
    if (commandInput.toLowerCase() === 'relatório' || commandInput.toLowerCase() === 'relatorio') {
      toast({
        title: "Relatório WhatsApp",
        description: `Enviados: ${mockStats.totalSent} | Entregues: ${mockStats.totalDelivered} | Lidos: ${mockStats.totalRead} | Taxa resposta: ${mockStats.responseRate}%`,
      });
    } else {
      toast({
        title: "Comando não reconhecido",
        description: "Comandos disponíveis: 'relatório'",
        variant: "destructive",
      });
    }
    setCommandInput("");
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="WhatsApp" subtitle="Gerencie conversas e veja relatórios" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header 
        title="WhatsApp" 
        subtitle="Gerencie conversas e veja relatórios" 
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Enviadas</p>
                <p className="text-2xl font-bold mt-1">{mockStats.totalSent}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold mt-1">{mockStats.totalDelivered}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Lidas</p>
                <p className="text-2xl font-bold mt-1 text-primary">{mockStats.totalRead}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card variant="stat">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Taxa Resposta</p>
                <p className="text-2xl font-bold mt-1 text-accent">{mockStats.responseRate}%</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Command Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Digite 'relatório' para ver estatísticas..."
                  className="bg-secondary/50"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                />
                <Button onClick={handleCommand}>
                  <BarChart3 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Executar</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Webhook simulado: envie comandos como "relatório" para obter estatísticas
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Contacts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass" className="h-[500px] flex flex-col">
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                  <span>Contatos</span>
                  <Badge variant="outline" className="text-xs">
                    {leadsWithWhatsapp.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2 p-3">
                {leadsWithWhatsapp.map((lead) => {
                  const lastMessage = messages
                    .filter(m => m.leadId === lead.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                  
                  return (
                    <motion.div
                      key={lead.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedLead === lead.id 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-secondary/30 hover:bg-secondary/50'
                      }`}
                      onClick={() => setSelectedLead(lead.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-green-500 font-bold shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {lastMessage?.text || 'Nenhuma mensagem'}
                          </p>
                        </div>
                        {lastMessage && (
                          <div className="flex items-center gap-1 shrink-0">
                            {getStatusIcon(lastMessage.status)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {leadsWithWhatsapp.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum lead com WhatsApp</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card variant="glass" className="h-[500px] flex flex-col">
              <CardHeader className="pb-3 shrink-0 border-b border-border">
                {selectedLead ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-green-500 font-bold">
                      {leads.find(l => l.id === selectedLead)?.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {leads.find(l => l.id === selectedLead)?.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {leads.find(l => l.id === selectedLead)?.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <CardTitle className="text-base text-muted-foreground">
                    Selecione um contato
                  </CardTitle>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedLead ? (
                  selectedMessages.length > 0 ? (
                    selectedMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.direction === 'sent' 
                            ? 'bg-primary/20 rounded-br-sm' 
                            : 'bg-secondary/50 rounded-bl-sm'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(message.timestamp), 'HH:mm')}
                            </span>
                            {message.direction === 'sent' && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Inicie a conversa
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">Selecione um contato para ver as mensagens</p>
                  </div>
                )}
              </CardContent>

              {selectedLead && (
                <div className="p-4 border-t border-border shrink-0">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Digite sua mensagem..."
                      className="bg-secondary/50 min-h-[44px] max-h-24 resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="shrink-0"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
