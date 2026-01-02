import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { IAPitchRoom } from "@/components/dashboard/IAPitchRoom";
import { MessageSquare, Zap, Target, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const WhatsAppPage = () => {
    return (
        <DashboardLayout>
            <Header
                title="WhatsApp API"
                subtitle="Gerencie seus disparos e scripts de conversão"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="glass" className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Conexão WhatsApp
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-10 text-center">
                            <div className="w-48 h-48 bg-white p-4 rounded-xl mb-6 shadow-glow border-4 border-primary/20">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LeadScan365" alt="QR Code" className="w-full h-full grayscale opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Escaneie para Conectar</h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                Conecte seu WhatsApp para habilitar os disparos automáticos e o uso dos scripts de IA do LeadScan365.
                            </p>
                            <div className="flex gap-3">
                                <Button className="font-bold uppercase tracking-wider">Gerar Novo QR Code</Button>
                                <Button variant="outline" className="font-bold uppercase tracking-wider text-muted-foreground">O que é isso?</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">1.2k</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Disparos Hoje</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">84%</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Taxa de Abertura</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <IAPitchRoom />

                    <Card variant="glass" className="border-accent/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Bot className="h-4 w-4 text-accent" />
                                Dica da IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Empresas que recebem uma abordagem nos primeiros **5 minutos** após a varredura têm uma taxa de conversão **300% maior**. Use os botões de ataque rápido na Dashboard.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};
