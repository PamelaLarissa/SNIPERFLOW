import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { profileInfos } from "@/components/campaigns/AdvancedFilters";
import {
    Download,
    RefreshCw,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    MessageCircle,
    Building2,
    Edit,
    Eye,
    Calendar
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
    onRefresh: () => void;
    onExport: () => void;
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
    onRefresh,
    onExport,
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
                className="flex flex-col sm:flex-row gap-3 justify-end"
            >
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Recon</span>
                </Button>
                <Button variant="outline" onClick={onExport} className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Baixar Intel</span>
                </Button>
            </motion.div>

            {/* Filter Panel - Always Visible */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                {paginatedLeads.map((lead, index) => {
                    const campaign = campaigns.find(c => c.id === lead.campaignId);

                    // Data Preparation
                    const profiles = campaign?.professionalProfiles || [];
                    const sources = campaign?.sources || [];
                    const leadSource = lead.source ? [lead.source] : [];
                    const displaySources = leadSource.length > 0 ? leadSource : sources;

                    const niche = lead.niche || campaign?.niche || "Geral";
                    const stack = lead.techStack || campaign?.technologies || [];
                    const teamSize = lead.employeeCount || (campaign?.employeeCategories && campaign.employeeCategories.length > 0 ? campaign.employeeCategories.join(', ') : "Não identificado");
                    const city = lead.cityState || (campaign?.locations && campaign.locations.length > 0 ? campaign.locations.join(', ') : campaign?.location || "Brasil");
                    const revenue = lead.revenueRange || (campaign?.revenueCategories && campaign.revenueCategories.length > 0 ? campaign.revenueCategories.join(', ') : "Não estimado");
                    const statusRF = lead.situacao || (campaign?.onlyActiveStatus ? "Ativa" : "Todas");
                    const isDecisionMaker = lead.partners ? true : (campaign?.hasDecisionMakers || false);

                    // Profile Mapping Helper
                    const getProfileLabel = (id: string) => {
                        const info = profileInfos.find(p => p.id === id);
                        return info ? info.label : id;
                    };
                    const profileLabel = profiles.length > 0 ? profiles.map(getProfileLabel).join(', ') : "Padrão";

                    return (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card variant="glass" className={`h-full border-l-4 flex flex-col ${selectedLeads.includes(lead.id) ? 'border-primary' : 'border-transparent'}`}>
                                <CardContent className="p-4 flex flex-col flex-1 gap-3">

                                    {/* HEADER */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 overflow-hidden">
                                            <input
                                                type="checkbox"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => onToggleLeadSelection(lead.id)}
                                                className="mt-1 h-4 w-4 rounded border-border bg-secondary/50 text-primary focus:ring-primary shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-sm sm:text-base truncate leading-tight">{lead.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                    <Building2 className="h-3 w-3 shrink-0" />
                                                    <span className="truncate font-medium">{lead.company}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <Badge variant={getScoreVariant(lead.score)} className="text-[10px] h-5 px-1.5">
                                                Score {lead.score}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] capitalize h-5 px-1.5">
                                                {kanbanColumnLabels[lead.status || 'new']}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* CONTACT */}
                                    <div className="flex flex-col gap-3 text-xs border-y border-border/40 py-3">
                                        {/* Email */}
                                        <div className="flex flex-col gap-1">
                                            {lead.email ? (
                                                <>
                                                    <a
                                                        href={`mailto:${lead.email}`}
                                                        className="flex items-center gap-1.5 text-foreground font-medium hover:underline w-fit"
                                                    >
                                                        <Mail className="h-3 w-3 shrink-0" />
                                                        <span>Contato Individual Email</span>
                                                    </a>
                                                    <span className="text-muted-foreground pl-0.5">{lead.email}</span>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                                    <Mail className="h-3 w-3 shrink-0" />
                                                    <span>Email não selecionado</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="flex flex-col gap-1">
                                            {lead.whatsapp ? (
                                                <>
                                                    <a
                                                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-emerald-500 font-medium hover:underline w-fit"
                                                    >
                                                        <MessageCircle className="h-3 w-3 fill-emerald-500 shrink-0" />
                                                        <span>Contato Individual WhatsApp</span>
                                                    </a>
                                                    <span className="text-muted-foreground pl-0.5">{lead.phone}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-1.5 text-foreground">
                                                        <Phone className="h-3 w-3 shrink-0" />
                                                        <span>Não verificado para WhatsApp</span>
                                                    </div>
                                                    <span className="text-muted-foreground pl-0.5">{lead.phone}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="space-y-1.5 text-xs flex-1">
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Perfil:</span>
                                            <span className="text-foreground truncate">{profileLabel}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Intel:</span>
                                            <span className="text-foreground truncate">{displaySources.join(', ')}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Nichos:</span>
                                            <span className="text-foreground truncate">{niche}</span>
                                        </div>
                                        {(stack.length > 0) && (
                                            <div className="flex items-start gap-1.5">
                                                <span className="font-bold text-muted-foreground min-w-[60px]">Stack:</span>
                                                <span className="text-foreground truncate">{stack.join(', ')}</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Time:</span>
                                            <span className="text-foreground truncate">{teamSize}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Cidade:</span>
                                            <span className="text-foreground truncate">{city}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Fat:</span>
                                            <span className="text-foreground truncate">{revenue}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Status:</span>
                                            <span className="text-foreground truncate">{statusRF}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Decisor:</span>
                                            <span className={isDecisionMaker ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
                                                {isDecisionMaker ? 'Sim' : 'Empresa'}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-border/40">
                                            <span className="font-bold text-muted-foreground min-w-[60px]">Campanha:</span>
                                            <span className="text-foreground truncate">{campaign?.name || "Desconhecida"}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            <span className="font-bold text-muted-foreground min-w-[50px]">Captura:</span>
                                            <span className="text-foreground truncate">
                                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')} {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* FOOTER */}
                                    <div className="pt-3 mt-auto border-t border-border/50">
                                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-medium" onClick={() => onEditLead(lead)}>
                                            <Edit className="h-3 w-3 mr-1.5" />
                                            Editar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
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
