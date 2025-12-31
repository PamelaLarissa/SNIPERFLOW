import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Building,
    Mail,
    Phone,
    Globe,
    Calendar,
    FileText,
    History,
    User,
    MapPin,
    TrendingUp,
    CheckCircle,
    Clock,
    ExternalLink
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadDetails {
    id: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    score: number;
    status: string;
    source: string | null;
    website: string | null;
    location: string | null;
    techStack: string[];
    socialProfiles: Record<string, string>;
    createdAt: string;
    schedules: any[];
    proposals: any[];
    emailLogs: any[];
}

export const LeadDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState<LeadDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) fetchLeadDetails();
    }, [id]);

    const fetchLeadDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/leads/${id}/details`);
            const data = await response.json();
            setLead(data);
        } catch (error) {
            console.error('Error fetching lead details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-64 col-span-1" />
                        <Skeleton className="h-64 col-span-2" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!lead) {
        return (
            <DashboardLayout>
                <div className="p-12 text-center">
                    <h2 className="text-2xl font-bold">Lead não encontrado</h2>
                    <Button variant="ghost" onClick={() => navigate('/leads')} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Leads
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/leads')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{lead.name}</h1>
                    <p className="text-muted-foreground">{lead.company || 'Empresa não informada'}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Badge variant={lead.score > 70 ? 'verified' : 'outline'} className="text-lg px-3 py-1">
                        Score: {lead.score}
                    </Badge>
                    <Badge variant="secondary" className="text-lg px-3 py-1 uppercase">
                        {lead.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações de Contato
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate">{lead.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm">{lead.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-primary" />
                                <a href={lead.website || '#'} target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    {lead.website || 'N/A'} {lead.website && <ExternalLink className="h-3 w-3" />}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm">{lead.location || 'Brasil'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Tecnologias & Social
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {lead.techStack.length > 0 ? lead.techStack.map(tech => (
                                    <Badge key={tech} variant="secondary">{tech}</Badge>
                                )) : <span className="text-sm text-muted-foreground italic">Nenhuma tech detectada</span>}
                            </div>
                            <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-2">Perfis Sociais</p>
                                <div className="flex gap-3">
                                    {Object.entries(lead.socialProfiles).map(([platform, url]) => (
                                        <a key={platform} href={url} target="_blank" className="text-primary hover:text-primary/80">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ))}
                                    {Object.keys(lead.socialProfiles).length === 0 && <span className="text-sm text-muted-foreground italic">Nenhum perfil encontrado</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="activity" className="w-full">
                        <TabsList className="w-full justify-start bg-secondary/30 border-b border-border/50 rounded-none h-auto p-0">
                            <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">
                                <Clock className="h-4 w-4 mr-2" /> Atividade
                            </TabsTrigger>
                            <TabsTrigger value="emails" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">
                                <Mail className="h-4 w-4 mr-2" /> E-mails
                            </TabsTrigger>
                            <TabsTrigger value="proposals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">
                                <FileText className="h-4 w-4 mr-2" /> Propostas
                            </TabsTrigger>
                            <TabsTrigger value="schedules" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6">
                                <Calendar className="h-4 w-4 mr-2" /> Agendamentos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity" className="mt-6">
                            <Card variant="glass">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Lead Criado</p>
                                                <p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
                                                <p className="text-sm mt-1 text-muted-foreground">Lead capturado via {lead.source || 'sistema'}.</p>
                                            </div>
                                        </div>
                                        {/* More activity items could be mapped here */}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="emails" className="mt-6">
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {lead.emailLogs.length > 0 ? lead.emailLogs.map(log => (
                                        <Card key={log.id} variant="glass">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{log.subject}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={log.status === 'sent' ? 'verified' : 'destructive'}>
                                                    {log.status === 'sent' ? 'Enviado' : 'Falhou'}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="text-center py-12 text-muted-foreground italic">
                                            Nenhum e-mail enviado para este lead.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="proposals" className="mt-6">
                            <div className="space-y-4">
                                {lead.proposals.length > 0 ? lead.proposals.map(proposal => (
                                    <Card key={proposal.id} variant="glass">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Proposta #{proposal.id.slice(0, 8)}</p>
                                                    <p className="text-xs text-muted-foreground">Total: R$ {proposal.total.toLocaleString('pt-BR')}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">{proposal.status}</Badge>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="text-center py-12 text-muted-foreground italic">
                                        Nenhuma proposta gerada para este lead.
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="schedules" className="mt-6">
                            <div className="space-y-4">
                                {lead.schedules.length > 0 ? lead.schedules.map(schedule => (
                                    <Card key={schedule.id} variant="glass">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{schedule.date} às {schedule.hour}</p>
                                                    <p className="text-xs text-muted-foreground">{schedule.notes || 'Sem observações'}</p>
                                                </div>
                                            </div>
                                            <Badge variant="pending">{schedule.status}</Badge>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="text-center py-12 text-muted-foreground italic">
                                        Nenhum agendamento para este lead.
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
};
