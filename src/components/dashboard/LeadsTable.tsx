import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Globe
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

export const LeadsTable = ({ leads, title = "Leads Recentes", showViewAll = true, onViewAll }: LeadsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card variant="glass">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-semibold">{title}</CardTitle>
          {showViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary h-8">
              Ver todos
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">Lead</th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">Empresa</th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">Contato</th>
                  <th className="text-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground hidden sm:table-cell">Fonte</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-xs sm:text-sm truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden truncate">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground text-xs sm:text-sm truncate">{lead.company}</span>
                      </div>
                      {lead.website && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lead.website}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lead.phone}</span>
                          {lead.whatsapp && (
                            <MessageCircle className="h-3 w-3 text-accent shrink-0" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                      <Badge variant={getScoreVariant(lead.score)} className="text-xs whitespace-nowrap">
                        {lead.score}
                      </Badge>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                      {lead.isVerified ? (
                        <div className="flex items-center justify-center gap-1 text-accent">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="text-xs hidden sm:inline">Verificado</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-pending">
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="text-xs hidden sm:inline">Pendente</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {lead.source}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
