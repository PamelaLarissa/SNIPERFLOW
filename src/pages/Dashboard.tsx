import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { CampaignsList } from "@/components/dashboard/CampaignsList";
import {
  ScoreDistributionChart,
  LeadsTrendChart,
  LeadsBySourceChart,
  LeadsByEcosystemChart,
  TechnologiesDetectedChart
} from "@/components/dashboard/Charts";
import { useStats, useScoreDistribution, useLeadsBySource, useLeadsTrend } from "@/hooks/useStats";
import { useLeads } from "@/hooks/useLeads";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

import { ActiveMissions } from "@/components/dashboard/ActiveMissions";
import { IAPitchRoom } from "@/components/dashboard/IAPitchRoom";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
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
          totalLeads={stats?.totalLeads ?? 0}
          opportunities={Math.floor((stats?.totalLeads ?? 0) * 0.28)}
          activeMissions={activeMissions.length}
          creditsRemaining={1240}
        />

        {/* Row 2: Live Operations & Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <ActiveMissions missions={activeMissions} />
          </div>
          <div className="lg:col-span-1">
            <IAPitchRoom />
          </div>
          <div className="lg:col-span-1">
            <LeadsBySourceChart data={leadsBySource ?? []} />
          </div>
        </div>

        {/* Row 3: Main Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="xl:col-span-3">
            <LeadsTable
              leads={(leads ?? []).slice(0, 10)}
              onViewAll={() => navigate("/leads")}
            />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-4 sm:gap-6">
            <ScoreDistributionChart data={scoreDistribution ?? []} />
            <CampaignsList campaigns={(campaigns ?? []).slice(0, 4)} />
          </div>
        </div>

        {/* Row 4: Secondary Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <LeadsTrendChart data={leadsTrend ?? []} />
          <TechnologiesDetectedChart data={[
            { name: 'WhatsApp', count: 92 },
            { name: 'Instagram', count: 78 },
            { name: 'Pixel Detect', count: 45 },
            { name: 'Sem Site', count: 23 },
          ]} />
        </div>
      </div>
    </DashboardLayout>
  );
};
