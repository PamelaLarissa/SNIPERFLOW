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
import { 
  mockDashboardStats, 
  mockLeads, 
  mockCampaigns,
  mockScoreDistribution,
  mockLeadsTrend,
  mockLeadsBySource
} from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Header 
        title="Dashboard" 
        subtitle="Visão geral da sua prospecção automática" 
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <StatsGrid
          totalLeads={mockDashboardStats.totalLeads}
          verifiedLeads={mockDashboardStats.verifiedLeads}
          avgScore={mockDashboardStats.avgScore}
          activeCampaigns={mockDashboardStats.activeCampaigns}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <LeadsTrendChart data={mockLeadsTrend} />
          <ScoreDistributionChart data={mockScoreDistribution} />
          <LeadsBySourceChart data={mockLeadsBySource} />
        </div>

        {/* Leads Table & Campaigns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <LeadsTable 
              leads={mockLeads.slice(0, 5)} 
              onViewAll={() => navigate("/leads")}
            />
          </div>
          <div>
            <CampaignsList campaigns={mockCampaigns.slice(0, 3)} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
