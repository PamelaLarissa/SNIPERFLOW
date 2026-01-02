import { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Filter,
    Users,
    Building2,
    Mail,
    Phone,
    Globe,
    Info,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lead } from "@/hooks/useLeads";

interface LeadsRadarViewProps {
    leads: Lead[];
    onViewLead: (lead: Lead) => void;
}

const getScoreVariant = (score: number) => {
    if (score >= 80) return "score_high";
    if (score >= 50) return "score_medium";
    return "score_low";
};

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent fill-accent";
    if (score >= 50) return "text-primary fill-primary";
    return "text-muted-foreground fill-muted-foreground";
};

export const LeadsRadarView = ({ leads: allLeads, onViewLead }: LeadsRadarViewProps) => {
    const leads = allLeads.filter(l => l.lat && l.lng);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [minScore, setMinScore] = useState(0);

    const filteredLeads = leads.filter(l => l.score >= minScore);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[600px]">
            {/* Map Column */}
            <Card variant="glass" className="lg:col-span-3 overflow-hidden relative group">
                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                    {/* Brazil Map Placeholder */}
                    <div className="relative w-full h-full p-4 sm:p-8">
                        <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-20 fill-primary/20 transition-all duration-700 group-hover:opacity-30">
                            <path d="M450,100 L550,120 L700,200 L850,350 L900,500 L800,650 L650,850 L450,900 L250,850 L150,700 L100,500 L150,300 L250,150 Z" />
                        </svg>

                        {/* Lead Markers */}
                        {filteredLeads.map((lead) => (
                            <motion.div
                                key={lead.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute cursor-pointer transition-transform hover:scale-125 hover:z-50"
                                style={{
                                    left: `${((lead.lng || 0) + 75) * 15}%`,
                                    top: `${((lead.lat || 0) + 35) * -15}%`
                                }}
                                onClick={() => setSelectedLead(lead)}
                            >
                                <div className="relative group/pin">
                                    <MapPin className={`h-6 w-6 ${getScoreColor(lead.score)} drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]`} />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:block">
                                        <Card variant="glass" className="p-2 whitespace-nowrap border-primary/50">
                                            <p className="text-xs font-bold">{lead.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{lead.company}</p>
                                        </Card>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Button
                            variant="glass"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                        <div className="bg-background/80 backdrop-blur-md rounded-lg p-3 border border-border/50 text-xs space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                                <span>Alta Qualificação (80+)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span>Média (50-79)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                                <span>Baixa (&lt;50)</span>
                            </div>
                        </div>
                    </div>

                    {filterOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-16 right-4 w-64"
                        >
                            <Card variant="glass" className="p-4">
                                <Label className="text-xs mb-2 block">Score Mínimo: {minScore}</Label>
                                <Input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={minScore}
                                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                                    className="mb-4"
                                />
                                <Button variant="secondary" size="sm" className="w-full" onClick={() => setMinScore(0)}>
                                    Resetar Filtros
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </Card>

            {/* Leads Sidebar */}
            <Card variant="glass" className="overflow-hidden flex flex-col">
                <CardHeader className="p-4 border-b border-border/50">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Leads Georreferenciados
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">{filteredLeads.length} no mapa</Badge>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    {selectedLead ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 space-y-4"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">{selectedLead.name}</h3>
                                    <p className="text-xs text-muted-foreground">{selectedLead.company}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <Badge variant={getScoreVariant(selectedLead.score)} className="w-full justify-center py-1">
                                        Score: {selectedLead.score}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-2 p-2 rounded bg-secondary/30 text-[10px]">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <span className="truncate">{selectedLead.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded bg-secondary/30 text-[10px]">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <span>{selectedLead.phone}</span>
                                    </div>
                                    {selectedLead.website && (
                                        <div className="flex items-center gap-2 p-2 rounded bg-secondary/30 text-[10px]">
                                            <Globe className="h-3 w-3 text-muted-foreground" />
                                            <span className="truncate">{selectedLead.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 space-y-2">
                                <Button variant="glow" size="sm" className="w-full text-[10px]" onClick={() => onViewLead(selectedLead)}>
                                    Ficha Completa
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-[10px]" onClick={() => setSelectedLead(null)}>
                                    Voltar para Lista
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {filteredLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="p-2 rounded hover:bg-secondary/30 cursor-pointer transition-colors border border-transparent hover:border-primary/20 text-xs"
                                    onClick={() => setSelectedLead(lead)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold line-clamp-1">{lead.name}</span>
                                        <Badge variant={getScoreVariant(lead.score)} className="text-[10px] scale-75 origin-right">
                                            {lead.score}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <MapPin className="h-2 w-2" />
                                        <span className="line-clamp-1">{lead.cityState || 'Localização aproximada'}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredLeads.length === 0 && (
                                <div className="text-center py-10 px-4">
                                    <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                                    <p className="text-xs text-muted-foreground">Nenhum lead encontrado nesta região com os filtros atuais.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
