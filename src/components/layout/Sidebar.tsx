import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Bell,
  Menu,
  X,
  Calendar,
  FileText,
  MessageSquare,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Zap, label: "Motor de Prospecção", path: "/campaigns" },
  { icon: Users, label: "Central de Leads", path: "/leads" },
  { icon: Calendar, label: "Agendamentos", path: "/schedules" },
  { icon: FileText, label: "Vendas & Propostas", path: "/proposals" },
  { icon: MessageSquare, label: "WhatsApp API", path: "/whatsapp", badge: "Breve" },
  { icon: Settings, label: "Sistema", path: "/settings" },
];

export const Sidebar = ({ collapsed = false, onCollapse, mobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // On mobile, sidebar behavior is different
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={onMobileClose}
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              {/* Close button */}
              <div className="absolute right-3 top-3">
                <Button variant="ghost" size="icon" onClick={onMobileClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Logo */}
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground whitespace-nowrap">
                  LeadScan<span className="text-primary">365</span>
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
                  return (
                    <Link key={item.path} to={item.path} onClick={onMobileClose}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-11 relative",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicatorMobile"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                          />
                        )}
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="glow" className="text-[10px] h-4 px-1 leading-none">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-xl text-foreground whitespace-nowrap">
                LeadScan<span className="text-primary">365</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11 relative",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap flex items-center gap-2 flex-1"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="glow" className="text-[8px] h-3.5 px-1 leading-none uppercase font-bold">
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          onClick={() => onCollapse?.(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Recolher
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.aside>
  );
};

interface MobileHeaderProps {
  onMenuClick: () => void;
  isOpen: boolean;
}

export const MobileHeader = ({ onMenuClick, isOpen }: MobileHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar/95 backdrop-blur-lg border-b border-sidebar-border z-40 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">
            LeadScan<span className="text-primary">365</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
          U
        </div>
      </div>
    </header>
  );
};

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
      <div className="min-w-0">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1 truncate"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {!isMobile && (
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
            U
          </div>
        </div>
      )}
    </header>
  );
};
