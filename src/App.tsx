import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard";
import { LeadsPage } from "./pages/Leads";
import { CampaignsPage } from "./pages/Campaigns";
import { SettingsPage } from "./pages/Settings";
import { SchedulesPage } from "./pages/Schedules";
import { ProposalsPage } from "./pages/Proposals";
import { LeadDetailsPage } from "./pages/LeadDetails";
import { WhatsAppPage } from "./pages/WhatsApp";
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
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/leads/:id" element={<LeadDetailsPage />} />

          {/* Legacy Redirects to Unified Hubs */}
          <Route path="/kanban" element={<Navigate to="/leads" replace />} />
          <Route path="/radar" element={<Navigate to="/leads" replace />} />
          <Route path="/ab-test" element={<Navigate to="/settings" replace />} />
          <Route path="/email-logs" element={<Navigate to="/settings" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
