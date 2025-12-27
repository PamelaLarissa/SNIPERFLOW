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
import type { Lead } from "@/lib/mockData";
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {showViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary">
              Ver todos
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Lead</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Empresa</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Contato</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Fonte</th>
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
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{lead.company}</span>
                      </div>
                      {lead.website && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span>{lead.website}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                          {lead.whatsapp && (
                            <MessageCircle className="h-3 w-3 text-accent" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={getScoreVariant(lead.score)}>
                        {lead.score} - {getScoreLabel(lead.score)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {lead.isVerified ? (
                        <div className="flex items-center justify-center gap-1 text-accent">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm hidden sm:inline">Verificado</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-pending">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm hidden sm:inline">Pendente</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
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
