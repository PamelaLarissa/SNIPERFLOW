import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard";
import { LeadsPage } from "./pages/Leads";
import { CampaignsPage } from "./pages/Campaigns";
import { SettingsPage } from "./pages/Settings";
import RadarPage from "./pages/Radar";
import { SchedulesPage } from "./pages/Schedules";
import { KanbanPage } from "./pages/Kanban";
import { ProposalsPage } from "./pages/Proposals";
import { ABTestPage } from "./pages/ABTest";
import { EmailLogsPage } from "./pages/EmailLogs";
import { LeadDetailsPage } from "./pages/LeadDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/ab-test" element={<ABTestPage />} />
          <Route path="/email-logs" element={<EmailLogsPage />} />
          <Route path="/leads/:id" element={<LeadDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
