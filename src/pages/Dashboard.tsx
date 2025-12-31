import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { CampaignsList } from "@/components/dashboard/CampaignsList";
import {
  ScoreDistributionChart,
  LeadsTrendChart,
  LeadsBySourceChart
} from "@/components/dashboard/Charts";
import { useStats, useScoreDistribution, useLeadsBySource, useLeadsTrend } from "@/hooks/useStats";
import { useLeads } from "@/hooks/useLeads";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: scoreDistribution } = useScoreDistribution();
  const { data: leadsBySource } = useLeadsBySource();
  const { data: leadsTrend } = useLeadsTrend();

  if (statsLoading) {
    return (
      <DashboardLayout>
        <Header title="Dashboard" subtitle="Carregando..." />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="Dashboard"
        subtitle="Visão geral da sua prospecção automática"
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <StatsGrid
          totalLeads={stats?.totalLeads ?? 0}
          verifiedLeads={stats?.verifiedLeads ?? 0}
          avgScore={stats?.avgScore ?? 0}
          activeCampaigns={stats?.activeCampaigns ?? 0}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <LeadsTrendChart data={leadsTrend ?? []} />
          <ScoreDistributionChart data={scoreDistribution ?? []} />
          <LeadsBySourceChart data={leadsBySource ?? []} />
        </div>

        {/* Leads Table & Campaigns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <LeadsTable
              leads={(leads ?? []).slice(0, 5)}
              onViewAll={() => navigate("/leads")}
            />
          </div>
          <div>
            <CampaignsList campaigns={(campaigns ?? []).slice(0, 3)} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
