import { motion } from "framer-motion";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Rocket,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  delay?: number;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  onClick?: () => void;
  className?: string;
  action?: React.ReactNode;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  delay = 0,
  subtitle,
  subtitleClassName,
  onClick,
  className,
  action
}: StatCardProps) => {
  const isPositive = change && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={cn("h-full", onClick && "cursor-pointer", className)}
    >
      <Card variant="stat" className="group h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{title}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
                {action}
              </div>
              {subtitle && (
                <p className={cn(
                  "text-[10px] sm:text-xs font-semibold mt-1",
                  subtitleClassName || "text-muted-foreground"
                )}>
                  {subtitle}
                </p>
              )}
              {change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] sm:text-xs font-semibold flex-wrap",
                  isPositive ? "text-accent" : "text-destructive"
                )}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{Math.abs(change)}%</span>
                  <span className="text-muted-foreground font-medium ml-0.5">vs Semana passada</span>
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

import { Button } from "@/components/ui/button";

interface StatsGridProps {
  totalAlvos: number;
  activeMissions: number;
  creditsRemaining?: number;
  usedCredits?: number;
  onTargetsClick?: () => void;
  onMissionsClick?: () => void;
  onNewCampaignClick?: () => void;
  onReloadClick?: () => void;
}

export const StatsGrid = ({
  totalAlvos,
  activeMissions,
  creditsRemaining = 0,
  usedCredits = 0,
  onTargetsClick,
  onMissionsClick,
  onNewCampaignClick,
  onReloadClick
}: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <StatCard
        title="Alvos Neutralizados"
        value={totalAlvos}
        change={12.5}
        icon={<Users className="h-5 w-5 text-primary" />}
        onClick={onTargetsClick}
        delay={0}
      />
      <StatCard
        title="Operações em Curso"
        value={activeMissions}
        change={activeMissions > 0 ? 100 : 0}
        icon={<Rocket className="h-5 w-5 text-accent" />}
        onClick={onMissionsClick}
        action={
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 gap-1.5 rounded-full border-accent/50 hover:bg-accent/10 text-accent text-[10px] font-black uppercase tracking-tight"
            onClick={(e) => {
              e.stopPropagation();
              onNewCampaignClick?.();
            }}
          >
            <Plus className="h-3 w-3" />
            Nova Missão
          </Button>
        }
        delay={0.1}
      />
      <StatCard
        title="Arsenal Disponível"
        value={creditsRemaining}
        subtitle={
          <div className="flex items-center gap-1">
            <span className="text-emerald-500 font-bold">{usedCredits}</span>
            <span className="text-muted-foreground font-semibold">Munições gastas</span>
          </div>
        }
        icon={<Zap className="h-5 w-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />}
        action={
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 gap-1.5 rounded-full border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tight"
            onClick={(e) => {
              e.stopPropagation();
              onReloadClick?.();
            }}
          >
            <Plus className="h-3 w-3" />
            Solicitar Munição
          </Button>
        }
        delay={0.2}
      />
    </div>
  );
};
