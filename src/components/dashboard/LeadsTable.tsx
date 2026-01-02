import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Globe,
  Target,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/api";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const getScoreVariant = (score: number) => {
  if (score >= 80) return "score_high";
  if (score >= 50) return "score_medium";
  return "score_low";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Alto";
  if (score >= 50) return "Médio";
  return "Baixo";
};

export const LeadsTable = ({ leads, title = "Feed de Abates (Últimos Alvos)", showViewAll = true, onViewAll }: LeadsTableProps) => {
  const getTheWound = (lead: Lead) => {
    if (lead.score >= 90) return { label: "Sem Pixel / SEO Fraco", color: "text-red-500 bg-red-500/10 border-red-500/20" };
    if (lead.score >= 70) return { label: "Site Lento (Mobile)", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { label: "Sem GTM / Conversão", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card variant="glass" className="border-primary/10">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-6 pb-0">
          <div>
            <CardTitle className="text-base sm:text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              {title}
            </CardTitle>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter mt-1">
              Lista atualizada em tempo real pelos mísseis
            </p>
          </div>
          {showViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary h-8 font-bold text-xs uppercase tracking-wider">
              Central de Leads
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Empresa / Alvo</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">A Ferida (Pain)</th>
                  <th className="text-center py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ataque Rápido</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => {
                  const wound = getTheWound(lead);
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0 shadow-inner">
                            {lead.company.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{lead.company}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {lead.website && (
                                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                  <Globe className="h-2.5 w-2.5" />
                                  {lead.website.replace('https://', '').replace('www.', '')}
                                </span>
                              )}
                              <span className="text-[10px] text-primary/60 font-black px-1 border border-primary/20 rounded uppercase bg-primary/5">
                                {lead.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight",
                          wound.color
                        )}>
                          <Zap className="h-3 w-3" />
                          {wound.label}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={cn(
                            "text-sm font-black",
                            lead.score >= 80 ? "text-accent" : lead.score >= 50 ? "text-amber-500" : "text-muted-foreground"
                          )}>
                            {lead.score}
                          </span>
                          <div className="w-8 h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                lead.score >= 80 ? "bg-accent" : lead.score >= 50 ? "bg-amber-500" : "bg-muted-foreground"
                              )}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-accent/30 hover:bg-accent hover:text-accent-foreground text-accent"
                            title="Ataque via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground text-primary"
                            title="Ataque via E-mail"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
