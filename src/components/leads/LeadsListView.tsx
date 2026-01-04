import { useState, useEffect, useRef } from "react";
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
import { Campaign } from "@/hooks/useCampaigns";
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
    campaigns?: Campaign[];
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
    campaigns = [],
}: LeadsListViewProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [minScore, setMinScore] = useState<number>(0);
    const [campaignSearchTerm, setCampaignSearchTerm] = useState("");
    const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);
    const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);

    const campaignDropdownRef = useRef<HTMLDivElement>(null);
    const sourceDropdownRef = useRef<HTMLDivElement>(null);

    const LEADS_PER_PAGE = 15;

    // Get unique campaigns from leads with better names from the actual campaigns list
    const uniqueCampaigns = Array.from(new Set(leads.map(l => l.campaignId).filter(Boolean)));
    const campaignOptions = uniqueCampaigns.map(id => {
        // Find campaign name in the provided campaigns list
        const campaign = campaigns.find(c => c.id === id);
        if (campaign) return { id, name: campaign.name };

        const campaignLeads = leads.filter(l => l.campaignId === id);
        const firstLead = campaignLeads[0];
        // Fallback to lead data if campaign not found in list
        const name = firstLead?.niche || firstLead?.company || `ID: ${id.slice(0, 8)}`;
        return { id, name };
    });
    const filteredCampaignOptions = campaignOptions.filter(c =>
        c.name.toLowerCase().includes(campaignSearchTerm.toLowerCase())
    );

    const sources = [
        'Google', 'Maps', 'Linkedin', 'Instagram',
        'Junta Comercial', 'Sebrae', 'Reclame Aqui',
        'Facebook', 'Workana'
    ];

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target as Node)) {
                setCampaignDropdownOpen(false);
            }
            if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target as Node)) {
                setSourceDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Apply all filters
    let filteredLeads = leads.filter(lead =>
        (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCampaigns.length === 0 || selectedCampaigns.includes(lead.campaignId || '')) &&
        (selectedSources.length === 0 || selectedSources.includes(lead.source)) &&
        (lead.score >= minScore)
    );

    const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * LEADS_PER_PAGE,
        currentPage * LEADS_PER_PAGE
    );

    const toggleCampaign = (campaignId: string) => {
        setSelectedCampaigns(prev =>
            prev.includes(campaignId)
                ? prev.filter(id => id !== campaignId)
                : [...prev, campaignId]
        );
    };

    const toggleSource = (source: string) => {
        setSelectedSources(prev =>
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    const clearFilters = () => {
        setSelectedCampaigns([]);
        setSelectedSources([]);
        setMinScore(0);
    };

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
                                placeholder="Explorar alvos..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 bg-secondary/50"
                            />
                        </div>
                        <Button variant="outline" onClick={onFilterToggle} className="shrink-0">
                            <Filter className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Critérios Táticos</span>
                            <ChevronDown className={`h-4 w-4 ml-1 sm:ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <Button variant="outline" className="flex-1 sm:flex-none" onClick={onRefresh}>
                            <RefreshCw className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Recon</span>
                        </Button>
                        <Button variant="outline" onClick={onExport} className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Baixar Intel</span>
                        </Button>
                        <Button variant="glow" onClick={onCreateOpen} className="flex-1 sm:flex-none">
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Identificar Alvo</span>
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
                    className="relative z-40"
                >
                    <Card variant="glass">
                        <CardContent className="p-3 sm:p-4 space-y-4 overflow-visible">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {/* Campaign Filter */}
                                <div className="space-y-2 relative z-50" ref={campaignDropdownRef}>
                                    <Label className="text-xs sm:text-sm font-medium">Campanhas</Label>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between bg-secondary/50 text-xs"
                                            onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
                                        >
                                            <span className="truncate">
                                                {selectedCampaigns.length === 0
                                                    ? "Filtrar Missões..."
                                                    : `${selectedCampaigns.length} selecionada(s)`}
                                            </span>
                                            <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${campaignDropdownOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                        {campaignDropdownOpen && (
                                            <div className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-md shadow-2xl">
                                                <div className="p-2">
                                                    <Input
                                                        placeholder="Buscar..."
                                                        value={campaignSearchTerm}
                                                        onChange={(e) => setCampaignSearchTerm(e.target.value)}
                                                        className="bg-secondary/50 text-xs h-8"
                                                    />
                                                </div>
                                                <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                                                    {filteredCampaignOptions.length === 0 ? (
                                                        <p className="text-xs text-muted-foreground text-center py-2">Nenhuma campanha</p>
                                                    ) : (
                                                        filteredCampaignOptions.map(campaign => (
                                                            <label key={campaign.id} className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 p-1.5 rounded text-xs">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedCampaigns.includes(campaign.id)}
                                                                    onChange={() => toggleCampaign(campaign.id)}
                                                                    className="h-3 w-3 rounded border-border bg-secondary/50 text-primary"
                                                                />
                                                                <span className="flex-1 truncate">{campaign.name}</span>
                                                            </label>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sources Filter */}
                                <div className="space-y-2 relative z-50" ref={sourceDropdownRef}>
                                    <Label className="text-xs sm:text-sm font-medium">Fontes</Label>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between bg-secondary/50 text-xs"
                                            onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
                                        >
                                            <span className="truncate">
                                                {selectedSources.length === 0
                                                    ? "Filtrar Origem..."
                                                    : `${selectedSources.length} selecionada(s)`}
                                            </span>
                                            <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${sourceDropdownOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                        {sourceDropdownOpen && (
                                            <div className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-md shadow-2xl">
                                                <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                                                    {sources.map(source => (
                                                        <label key={source} className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 p-1.5 rounded text-xs">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSources.includes(source)}
                                                                onChange={() => toggleSource(source)}
                                                                className="h-3 w-3 rounded border-border bg-secondary/50 text-primary"
                                                            />
                                                            <span className="flex-1">{source}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Score Filter */}
                                <div className="space-y-2">
                                    <Label className="text-xs sm:text-sm font-medium">Score Mínimo</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={minScore || ''}
                                        onChange={(e) => setMinScore(Number(e.target.value) || 0)}
                                        className="bg-secondary/50"
                                    />
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-xs">
                                        Resetar Critérios
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
                        {selectedLeads.length} alvo(s) marcados
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="ghost" size="sm" onClick={onClearSelection} className="flex-1 sm:flex-none">
                            Desmarcar
                        </Button>
                        <Button size="sm" onClick={onExportSelected} className="flex-1 sm:flex-none">
                            Extrair Dados
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
