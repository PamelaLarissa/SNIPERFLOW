import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    History,
    Search,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    Filter
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailLog {
    id: string;
    leadId: string | null;
    leadName: string | null;
    recipient: string;
    subject: string;
    status: 'sent' | 'failed';
    error: string | null;
    createdAt: string;
}

export const EmailLogsPage = () => {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/email/logs');
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.leadName && log.leadName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Header
                title="Logs de E-mail"
                subtitle="Histórico de comunicações enviadas pelo sistema"
            />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por destinatário, lead ou assunto..."
                            className="pl-10 bg-secondary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Últimos 50 envios
                        </Badge>
                    </div>
                </div>

                <Card variant="glass" className="overflow-hidden">
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-280px)]">
                            <div className="min-w-[800px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-secondary/30">
                                            <th className="p-4 font-semibold text-sm">Data/Hora</th>
                                            <th className="p-4 font-semibold text-sm">Lead</th>
                                            <th className="p-4 font-semibold text-sm">Destinatário</th>
                                            <th className="p-4 font-semibold text-sm">Assunto</th>
                                            <th className="p-4 font-semibold text-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            [1, 2, 3, 4, 5].map(i => (
                                                <tr key={i} className="border-b border-border/50">
                                                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                                    <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                                                    <td className="p-4"><Skeleton className="h-4 w-56" /></td>
                                                    <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                                                </tr>
                                            ))
                                        ) : filteredLogs.length > 0 ? (
                                            filteredLogs.map((log, index) => (
                                                <motion.tr
                                                    key={log.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                                                >
                                                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                                                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                                                    </td>
                                                    <td className="p-4 text-sm font-medium">
                                                        {log.leadName || <span className="text-muted-foreground italic">N/A</span>}
                                                    </td>
                                                    <td className="p-4 text-sm">
                                                        {log.recipient}
                                                    </td>
                                                    <td className="p-4 text-sm truncate max-w-[200px]">
                                                        {log.subject}
                                                    </td>
                                                    <td className="p-4">
                                                        {log.status === 'sent' ? (
                                                            <Badge variant="verified" className="gap-1">
                                                                <CheckCircle className="h-3 w-3" />
                                                                Enviado
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="gap-1">
                                                                <XCircle className="h-3 w-3" />
                                                                Falhou
                                                            </Badge>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                                    Nenhum log de e-mail encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};
