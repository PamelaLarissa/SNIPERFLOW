import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { Card } from "@/components/ui/card";
import {
  ScoreDistributionChart,
  LeadsTrendChart,
  LeadsBySourceChart
} from "@/components/dashboard/Charts";
import { useStats, useScoreDistribution, useLeadsBySource, useLeadsTrend } from "@/hooks/useStats";
import { useLeads } from "@/hooks/useLeads";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Target } from "lucide-react";

import { ActiveMissions } from "@/components/dashboard/ActiveMissions";

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
        <Header title="Dashboard" subtitle="Iniciando Sistemas de Combate..." />
        <div className="space-y-6 text-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse font-black uppercase tracking-widest text-xs">Carregando Radar...</p>
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
