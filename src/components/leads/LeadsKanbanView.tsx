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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import {
    kanbanColumns,
    kanbanColumnLabels,
    kanbanColumnColors,
    type KanbanColumn
} from "@/lib/constants";

interface LeadsKanbanViewProps {
    leads: Lead[];
    onMoveLead: (leadId: string, newColumn: KanbanColumn) => void;
    onViewLead: (lead: Lead) => void;
    onEditLead: (lead: Lead) => void;
}

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

export const LeadsKanbanView = ({
    leads,
    onMoveLead,
    onViewLead,
    onEditLead
}: LeadsKanbanViewProps) => {
    const [aiInput, setAiInput] = useState("");
    const [selectedForAi, setSelectedForAi] = useState<string | null>(null);
    const { toast } = useToast();

    const getLeadsByColumn = (column: KanbanColumn) =>
        leads.filter(l => (l.status || 'new') === column);

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
            onMoveLead(selectedForAi, newStatus);
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

    return (
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
                                                        onClick={() => onViewLead(lead)}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => onEditLead(lead)}
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
                                                        onClick={() => onMoveLead(lead.id, targetCol)}
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
    );
};
