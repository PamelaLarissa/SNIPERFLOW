import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    MessageCircle,
    Building2,
    Globe,
    Edit,
    Eye,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/hooks/useLeads";
import { kanbanColumnLabels } from "@/lib/constants";

interface LeadsListViewProps {
    leads: Lead[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onFilterToggle: () => void;
    filterOpen: boolean;
    onRefresh: () => void;
    onExport: () => void;
    onCreateOpen: () => void;
    selectedLeads: string[];
    onToggleLeadSelection: (id: string) => void;
    onClearSelection: () => void;
    onExportSelected: () => void;
    onViewLead: (lead: Lead) => void;
    onEditLead: (lead: Lead) => void;
}

const getScoreVariant = (score: number) => {
    if (score >= 80) return "score_high";
    if (score >= 50) return "score_medium";
    return "score_low";
};

export const LeadsListView = ({
    leads,
    searchTerm,
    onSearchChange,
    onFilterToggle,
    filterOpen,
    onRefresh,
    onExport,
    onCreateOpen,
    selectedLeads,
    onToggleLeadSelection,
    onClearSelection,
    onExportSelected,
    onViewLead,
    onEditLead,
}: LeadsListViewProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const LEADS_PER_PAGE = 15;

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * LEADS_PER_PAGE,
        currentPage * LEADS_PER_PAGE
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Actions Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 sm:gap-4"
            >
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-1 gap-2 sm:gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar leads..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 bg-secondary/50"
                            />
                        </div>
                        <Button variant="outline" onClick={onFilterToggle} className="shrink-0">
                            <Filter className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Filtros</span>
                            <ChevronDown className={`h-4 w-4 ml-1 sm:ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <Button variant="outline" className="flex-1 sm:flex-none" onClick={onRefresh}>
                            <RefreshCw className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Atualizar</span>
                        </Button>
                        <Button variant="outline" onClick={onExport} className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Exportar CSV</span>
                        </Button>
                        <Button variant="glow" onClick={onCreateOpen} className="flex-1 sm:flex-none">
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Novo Lead</span>
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Filter Panel */}
            {filterOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <Card variant="glass">
                        <CardContent className="p-3 sm:p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <div>
                                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Score Mínimo</Label>
                                    <Input type="number" placeholder="0" className="bg-secondary/50" />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Fonte</Label>
                                    <Select>
                                        <SelectTrigger className="bg-secondary/50">
                                            <SelectValue placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas</SelectItem>
                                            <SelectItem value="google">Google</SelectItem>
                                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                                            <SelectItem value="maps">Google Maps</SelectItem>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm font-medium mb-2 block">Status</Label>
                                    <Select>
                                        <SelectTrigger className="bg-secondary/50">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="verified">Verificado</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button variant="secondary" className="w-full">
                                        Aplicar Filtros
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Selection Info */}
            {selectedLeads.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                    <span className="text-sm font-medium">
                        {selectedLeads.length} lead(s) selecionado(s)
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="ghost" size="sm" onClick={onClearSelection} className="flex-1 sm:flex-none">
                            Limpar seleção
                        </Button>
                        <Button size="sm" onClick={onExportSelected} className="flex-1 sm:flex-none">
                            Exportar selecionados
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Leads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {paginatedLeads.map((lead, index) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card variant="glass" className={`h-full border-l-4 ${selectedLeads.includes(lead.id) ? 'border-primary' : 'border-transparent'}`}>
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedLeads.includes(lead.id)}
                                            onChange={() => onToggleLeadSelection(lead.id)}
                                            className="mt-1 h-4 w-4 rounded border-border bg-secondary/50 text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{lead.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                <Building2 className="h-3 w-3" />
                                                <span className="line-clamp-1">{lead.company}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={getScoreVariant(lead.score)} className="shrink-0">
                                        {lead.score}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <span className="truncate">{lead.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <span>{lead.phone}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px]">
                                            {lead.source}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] capitalize">
                                            {kanbanColumnLabels[lead.status || 'new']}
                                        </Badge>
                                        {lead.whatsapp && (
                                            <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                                                <MessageCircle className="h-2 w-2 fill-green-500 text-green-500" />
                                                WhatsApp
                                            </Badge>
                                        )}
                                        {lead.website && (
                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] hover:text-primary transition-colors text-muted-foreground">
                                                <Globe className="h-3 w-3" />
                                                Site
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-border/50">
                                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => onViewLead(lead)}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        Ver
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => onEditLead(lead)}>
                                        <Edit className="h-3 w-3 mr-1" />
                                        Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i}
                                variant={currentPage === i + 1 ? "secondary" : "ghost"}
                                size="sm"
                                className="w-8 h-8"
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
