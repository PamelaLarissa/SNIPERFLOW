import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Settings,
  MoreVertical,
  MapPin,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@/lib/api";

interface CampaignsListProps {
  campaigns: Campaign[];
}

const getStatusBadge = (status: Campaign['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="verified">Ativa</Badge>;
    case 'paused':
      return <Badge variant="pending">Pausada</Badge>;
    case 'completed':
      return <Badge variant="outline">Concluída</Badge>;
  }
};

export const CampaignsList = ({ campaigns }: CampaignsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Campanhas</CardTitle>
          <Button variant="outline" size="sm">
            Nova Campanha
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{campaign.name}</h4>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{campaign.niche}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{campaign.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {campaign.status === 'active' ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                      <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  ) : campaign.status === 'paused' ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">{campaign.leadsFound}</span> encontrados
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-muted-foreground">
                    <span className="text-accent font-medium">{campaign.leadsVerified}</span> verificados
                  </span>
                </div>
                {campaign.lastRun && (
                  <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Última: {new Date(campaign.lastRun).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
