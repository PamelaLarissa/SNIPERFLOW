import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Filter, ChevronDown, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLeads, type Lead } from "@/lib/mockData";

const getScoreColor = (score: number): string => {
  if (score <= 50) {
    const ratio = score / 50;
    const r = 255;
    const g = Math.round(255 * ratio);
    return `rgb(${r}, ${g}, 0)`;
  } else {
    const ratio = (score - 50) / 50;
    const r = Math.round(255 * (1 - ratio));
    const g = 200;
    return `rgb(${r}, ${g}, 50)`;
  }
};

// Map lead positions to percentage positions on the map image
const getMapPosition = (lat: number, lng: number) => {
  // Brazil bounds approximately: lat -33 to 5, lng -74 to -34
  const minLat = -33;
  const maxLat = 5;
  const minLng = -74;
  const maxLng = -34;
  
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
};

const RadarPage = () => {
  const [leads] = useState<Lead[]>(mockLeads.filter(l => l.lat && l.lng));
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const filteredLeads = leads.filter(l => l.score >= minScore);

  const getScoreVariant = (score: number): "score_high" | "score_medium" | "score_low" => {
    if (score >= 80) return "score_high";
    if (score >= 50) return "score_medium";
    return "score_low";
  };

  return (
    <DashboardLayout>
      <Header 
        title="Mapa Radar" 
        subtitle="Visualize seus leads geograficamente" 
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {filteredLeads.length} leads no mapa
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Score Mínimo: {minScore}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getScoreColor(0) }} />
                      <span>0</span>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
                    <div className="flex items-center gap-2 text-xs">
                      <span>100</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getScoreColor(100) }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Map and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card variant="glass" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full relative bg-gradient-to-br from-secondary/50 to-background">
                  {/* SVG Map Background */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="absolute inset-0 w-full h-full opacity-20"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    {[...Array(10)].map((_, i) => (
                      <g key={i}>
                        <line 
                          x1={i * 10} y1="0" x2={i * 10} y2="100" 
                          stroke="currentColor" 
                          strokeWidth="0.2" 
                          className="text-primary/30"
                        />
                        <line 
                          x1="0" y1={i * 10} x2="100" y2={i * 10} 
                          stroke="currentColor" 
                          strokeWidth="0.2" 
                          className="text-primary/30"
                        />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Map Title */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary" className="text-xs">
                      Brasil - Mapa de Leads
                    </Badge>
                  </div>
                  
                  {/* Lead Markers */}
                  {filteredLeads.map((lead) => {
                    const pos = getMapPosition(lead.lat!, lead.lng!);
                    return (
                      <motion.button
                        key={lead.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.3 }}
                        className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{ 
                          left: `${pos.x}%`, 
                          top: `${pos.y}%`,
                        }}
                        onClick={() => setSelectedLead(lead)}
                      >
                        {/* Pulse effect */}
                        <span 
                          className="absolute inset-0 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: getScoreColor(lead.score) }}
                        />
                        {/* Marker */}
                        <span 
                          className="relative flex h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-white/50 shadow-lg"
                          style={{ backgroundColor: getScoreColor(lead.score) }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                            <p className="text-xs font-semibold">{lead.name}</p>
                            <p className="text-[10px] text-muted-foreground">{lead.company}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px]">Score:</span>
                              <span 
                                className="text-[10px] font-bold"
                                style={{ color: getScoreColor(lead.score) }}
                              >
                                {lead.score}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
                    <p className="text-xs font-medium mb-2">Legenda</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Baixo</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>Médio</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Alto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Lead Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLead ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold">
                        {selectedLead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{selectedLead.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedLead.company}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Score</p>
                        <Badge variant={getScoreVariant(selectedLead.score)} className="mt-1">
                          {selectedLead.score}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Fonte</p>
                        <p className="text-xs font-medium mt-1">{selectedLead.source}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Status</p>
                        <p className="text-xs font-medium mt-1 capitalize">{selectedLead.status || 'Novo'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">WhatsApp</p>
                        <p className="text-xs font-medium mt-1">{selectedLead.whatsapp ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-2">
                      Ver Detalhes
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Clique em um lead no mapa para ver detalhes
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Total no Mapa</span>
                  <span className="font-semibold">{filteredLeads.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Score Médio</span>
                  <span className="font-semibold">
                    {filteredLeads.length > 0 
                      ? Math.round(filteredLeads.reduce((a, b) => a + b.score, 0) / filteredLeads.length)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Score Alto (&gt;80)</span>
                  <span className="font-semibold text-accent">
                    {filteredLeads.filter(l => l.score >= 80).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Lead List */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Todos os Leads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      selectedLead?.id === lead.id 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-secondary/20 hover:bg-secondary/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">{lead.name}</p>
                        <p className="text-[10px] text-muted-foreground">{lead.company}</p>
                      </div>
                      <Badge variant={getScoreVariant(lead.score)} className="text-[10px]">
                        {lead.score}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RadarPage;