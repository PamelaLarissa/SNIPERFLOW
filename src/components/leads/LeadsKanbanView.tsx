import { useState, useRef } from "react";
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

    // Drag and Drop Logic
    const [draggingId, setDraggingId] = useState<string | null>(null);
    // Refs for columns to detect drop zones
    const columnRefs = {
        new: useRef<HTMLDivElement>(null),
        qualified: useRef<HTMLDivElement>(null),
        proposal: useRef<HTMLDivElement>(null),
        won: useRef<HTMLDivElement>(null),
        lost: useRef<HTMLDivElement>(null),
    };

    const handleDragEnd = (event: any, info: any, leadId: string, currentStatus: KanbanColumn) => {
        setDraggingId(null);
        const dropPoint = {
            x: info.point.x,
            y: info.point.y
        };

        // Check which column contains the drop point
        for (const [colId, ref] of Object.entries(columnRefs)) {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                if (
                    dropPoint.x >= rect.left &&
                    dropPoint.x <= rect.right &&
                    dropPoint.y >= rect.top &&
                    dropPoint.y <= rect.bottom
                ) {
                    if (colId !== currentStatus) {
                        onMoveLead(leadId, colId as KanbanColumn);
                    }
                    return;
                }
            }
        }
    };

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
                title: "Intel Tática Confirmada!",
                description: `Alvo redistribuído para "${kanbanColumnLabels[newStatus]}"`,
            });
        } else {
            toast({
                title: "Nenhum padrão tático identificado",
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
                                <Label className="text-sm font-medium mb-2">
                                    Análise Tática - Simular Interceptação
                                </Label>
                                <div className="flex gap-2">
                                    <Select value={selectedForAi || ''} onValueChange={setSelectedForAi}>
                                        <SelectTrigger className="bg-secondary/50 w-full sm:w-48">
                                            <SelectValue placeholder="Selecionar Alvo" />
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
                            <Button variant="outline" onClick={handleAiAnalysis} disabled={!selectedForAi || !aiInput.trim()}>
                                Decodificar
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Padrões de Intel: "quero", "interesse" → Alvo Confirmado | "proposta" → Proposta | "fechado", "aceito" → Missão Cumprida | "não quero" → Baixa Confirmada
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
                            ref={columnRefs[column]}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: colIndex * 0.1 }}
                            className="w-72 sm:w-80 shrink-0 sm:shrink flex flex-col"
                        >
                            <Card variant="glass" className={`h-full flex flex-col border-t-4 ${kanbanColumnColors[column]}`}>
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
                                            layoutId={lead.id}
                                            drag
                                            dragSnapToOrigin
                                            dragElastic={0.1}
                                            onDragStart={() => setDraggingId(lead.id)}
                                            onDragEnd={(e, info) => handleDragEnd(e, info, lead.id, column)}
                                            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1, zIndex: draggingId === lead.id ? 100 : 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-card/80 rounded-lg p-3 border border-border/50 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/40 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate leading-tight">{lead.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={getScoreVariant(lead.score)} className="text-[10px] px-1.5 h-5 shrink-0">
                                                    {lead.score}
                                                </Badge>
                                            </div>

                                            {/* Extra Info Fields */}
                                            <div className="space-y-1 mb-3">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <span className="font-semibold text-primary/70 text-[10px] uppercase tracking-wider">Local:</span>
                                                    <span className="truncate text-foreground/90">{lead.cityState || lead.address || "Brasil"}</span>
                                                </div>
                                                {lead.notes && (
                                                    <div className="bg-secondary/30 p-1.5 rounded text-[10px] text-muted-foreground italic truncate border border-white/5">
                                                        "{lead.notes.length > 40 ? lead.notes.substring(0, 40) + '...' : lead.notes}"
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
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
