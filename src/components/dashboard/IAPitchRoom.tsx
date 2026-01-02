import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const IAPitchRoom = () => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const pitch = {
        market: "Gastronomia / Restaurantes",
        pain: "40% de falha em SEO Local (Maps)",
        script: "Olá [Nome], notei que o [Nome da Empresa] não está aparecendo nas primeiras buscas do Google Maps para a sua região. Isso acontece porque falta o selo de validação técnica que meu robô acabou de detectar. Quer ver como destravar isso em 24h?",
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(pitch.script);
        setCopied(true);
        toast({
            title: "Script Copiado!",
            description: "Pronto para o ataque no WhatsApp.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card variant="glass" className="h-full border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-accent">
                    <Bot className="h-4 w-4" />
                    IA Pitch Provider
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-background/50 border border-accent/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="h-4 w-4 text-accent" />
                    </div>

                    <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-black text-accent uppercase tracking-tighter">Oportunidade do Dia:</span>
                        <p className="text-xs font-bold">{pitch.market}</p>
                        <p className="text-[10px] text-muted-foreground italic">Identificado: {pitch.pain}</p>
                    </div>

                    <div className="bg-secondary/30 p-2 rounded text-[11px] leading-relaxed text-foreground font-medium border-l-2 border-accent mb-3">
                        "{pitch.script}"
                    </div>

                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-[10px] font-black uppercase tracking-wider gap-2 hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copiado para o Front' : 'Copiar Pitch de Ataque'}
                    </Button>
                </div>

                <div className="flex items-center gap-2 px-1">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-5 w-5 rounded-full border-2 border-background bg-secondary text-[8px] flex items-center justify-center font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] text-muted-foreground font-medium">Outros 14 especialistas online...</p>
                </div>
            </CardContent>
        </Card>
    );
};
