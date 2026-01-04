
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ScoreDistributionChart,
  LeadsTrendChart,
  LeadsBySourceChart
} from "@/components/dashboard/Charts";
import { useStats, useScoreDistribution, useLeadsBySource, useLeadsTrend } from "@/hooks/useStats";
import { useLeads } from "@/hooks/useLeads";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Target,
  Compass,
  Download,
  Plus,
  Activity,
  DollarSign,
  TrendingUp
} from "lucide-react";

import { ActiveMissions } from "@/components/dashboard/ActiveMissions";

const MetricCard = ({ title, value, change, icon: Icon, trend, description, color }: any) => (
  <Card className="p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all dark:bg-muted/20">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
          {change}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </Card>
);

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leads } = useLeads();
  const { data: scoreDistribution } = useScoreDistribution();
  const { data: leadsBySource } = useLeadsBySource();
  const { data: leadsTrend } = useLeadsTrend();

  // Mock Active Missions
  const activeMissions = [
    { id: '1', name: 'Blitz: Estética SP', progress: 65, targetsFound: 24, status: 'scanning' as const },
    { id: '2', name: 'Sniper: Academias RJ', progress: 32, targetsFound: 8, status: 'enriching' as const },
  ];

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 md:space-y-8 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                <Compass className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse-slow" />
                Sala de Situação
              </h1>
              <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-2xl font-medium">
                Visão tática em tempo real do campo de batalha. Monitore seus alvos e suprimentos.
              </p>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Button variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 font-bold">
                <Download className="mr-2 h-4 w-4" /> Exportar Relatório
              </Button>
              <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-black tracking-wide bg-gradient-to-r from-primary to-accent hover:scale-105">
                <Plus className="mr-2 h-5 w-5" /> NOVA MISSÃO
              </Button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard
              title="Alvos Engajados"
              value="1,234"
              change="+12.5%"
              icon={Target}
              trend="up"
              description="Leads com contato estabelecido"
              color="text-blue-500"
            />
            <MetricCard
              title="Taxa de Conversão"
              value="24.8%"
              change="+2.1%"
              icon={Activity}
              trend="up"
              description="Eficiência de abate"
              color="text-emerald-500"
            />
            <MetricCard
              title="Espólios de Guerra (Receita)"
              value="R$ 45.2k"
              change="+18.2%"
              icon={DollarSign}
              trend="up"
              description="Faturamento confirmado"
              color="text-amber-500"
            />
            <MetricCard
              title="Operações Ativas"
              value="12"
              change="-2"
              icon={TrendingUp}
              trend="down"
              description="Campanhas em andamento"
              color="text-purple-500"
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Mission Control"
        subtitle="Gerenciamento de mísseis, alvos e conversão em tempo real"
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Row 1: Tactical Stats */}
        <StatsGrid
          totalAlvos={stats?.totalLeads ?? 0}
          activeMissions={activeMissions.length}
          creditsRemaining={stats?.remainingCredits}
          usedCredits={stats?.usedCredits}
          onTargetsClick={() => navigate('/leads')}
          onMissionsClick={() => navigate('/campaigns?status=active')}
          onNewCampaignClick={() => navigate('/campaigns?new=true')}
          onReloadClick={() => navigate('/billing')}
        />
        {/* Row 2: Live Operations & Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <ActiveMissions missions={activeMissions} />
          </div>
          <div className="lg:col-span-1">
            <ScoreDistributionChart data={scoreDistribution ?? []} />
          </div>
          <div className="lg:col-span-1">
            <LeadsTrendChart data={leadsTrend ?? []} />
          </div>
          <div className="lg:col-span-1">
            <LeadsBySourceChart data={leadsBySource ?? []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
