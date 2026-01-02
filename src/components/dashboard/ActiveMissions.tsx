import { motion } from "framer-motion";
import { Zap, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Mission {
    id: string;
    name: string;
    progress: number;
    targetsFound: number;
    status: 'scanning' | 'enriching' | 'finishing';
}

export const ActiveMissions = ({ missions }: { missions: Mission[] }) => {
    return (
        <Card variant="glass" className="h-full border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                    <Zap className="h-4 w-4 animate-pulse" />
                    Mísseis em Voo (Live)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {missions.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs italic">
                        Nenhum míssil ativo no momento...
                    </div>
                ) : (
                    missions.map((mission) => (
                        <div key={mission.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-foreground">{mission.name}</p>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        {mission.status === 'scanning' ? 'Varrendo Google/Maps...' : 'Enriquecendo Dados...'}
                                        <Loader2 className="h-2 w-2 animate-spin" />
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-primary">{mission.targetsFound} 🎯</span>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-full h-1.5 bg-secondary">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mission.progress}%` }}
                                    className="absolute h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                />
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};
