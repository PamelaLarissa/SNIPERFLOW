import { motion } from "framer-motion";
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ title, value, change, icon, delay = 0 }: StatCardProps) => {
  const isPositive = change && change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card variant="stat" className="group cursor-pointer h-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
              {change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium flex-wrap",
                  isPositive ? "text-accent" : "text-destructive"
                )}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 shrink-0" />
                  )}
                  <span>{Math.abs(change)}% vs semana passada</span>
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface StatsGridProps {
  totalLeads: number;
  verifiedLeads: number;
  avgScore: number;
  activeCampaigns: number;
}

export const StatsGrid = ({ totalLeads, verifiedLeads, avgScore, activeCampaigns }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Total de Leads"
        value={totalLeads.toLocaleString('pt-BR')}
        change={12.5}
        icon={<Users className="h-5 w-5" />}
        delay={0}
      />
      <StatCard
        title="Leads Verificados"
        value={verifiedLeads.toLocaleString('pt-BR')}
        change={8.3}
        icon={<CheckCircle className="h-5 w-5" />}
        delay={0.1}
      />
      <StatCard
        title="Score Médio"
        value={avgScore}
        change={5.2}
        icon={<TrendingUp className="h-5 w-5" />}
        delay={0.2}
      />
      <StatCard
        title="Campanhas Ativas"
        value={activeCampaigns}
        icon={<Zap className="h-5 w-5" />}
        delay={0.3}
      />
    </div>
  );
};
