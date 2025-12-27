import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, MobileHeader } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          isOpen={mobileMenuOpen}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless menu is open */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "p-4 sm:p-6 lg:p-8",
          "pt-20 md:pt-6 lg:pt-8", // Extra top padding on mobile for header
          isMobile ? "ml-0" : (sidebarCollapsed ? "ml-20" : "ml-64")
        )}
      >
        {children}
      </main>
    </div>
  );
};
