
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Target, Zap, Rocket, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const BillingPage = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Starter',
            motto: 'Ideal para validação',
            price: 'R$ 297',
            missiles: '500',
            description: 'Mísseis para prospecção inicial',
            features: ['500 Mísseis Mensais', 'Filtros Básicos', 'Suporte por Email', 'Exportação CSV'],
            icon: <Target className="h-8 w-8 text-slate-400" />,
            color: 'border-slate-200'
        },
        {
            name: 'Professional',
            motto: 'O favorito das agências',
            popular: true,
            price: 'R$ 497',
            missiles: '1.500',
            description: 'Poder de fogo para escala real',
            features: ['1.500 Mísseis Mensais', 'Filtros Avançados', 'Enriquecimento de CNPJ', 'Suporte Prioritário'],
            icon: <Zap className="h-8 w-8 text-emerald-500" />,
            color: 'border-emerald-500 shadow-lg shadow-emerald-500/10'
        },
        {
            name: 'Enterprise',
            motto: 'Domínio total de mercado',
            price: 'R$ 997',
            missiles: '5.000',
            description: 'Arsenal pesado para grandes times',
            features: ['5.000 Mísseis Mensais', 'API Privada', 'Gerente de Contas', 'Consultoria Operacional'],
            icon: <Rocket className="h-8 w-8 text-primary" />,
            color: 'border-primary/50'
        }
    ];

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-8 gap-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Base Operacional
                </Button>

                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 text-emerald-500 border-emerald-500/50 bg-emerald-500/5 animate-pulse">
                        CENTRO DE REABASTECIMENTO
                    </Badge>
                    <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Arsenal de Mísseis</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Não deixe sua operação parar. Escolha o poder de fogo ideal para sua próxima missão de prospecção.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`relative flex flex-col h-full border-2 ${plan.color} transition-all duration-300 hover:scale-[1.02]`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-4 leading-none">
                                            MAIS REQUISITADO
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pt-8">
                                    <div className="mb-4 flex justify-center">{plan.icon}</div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">{plan.name}</CardTitle>
                                    <CardDescription className="font-medium text-muted-foreground">{plan.motto}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-6">
                                    <div className="text-center">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-black">{plan.price}</span>
                                            <span className="text-muted-foreground font-medium">/mês</span>
                                        </div>
                                        <div className="mt-2 text-emerald-500 font-bold text-sm bg-emerald-500/5 py-1 rounded-full border border-emerald-500/10">
                                            {plan.missiles} MÍSSEIS TÁTICOS
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                                                <div className="mt-1 bg-emerald-500/10 p-0.5 rounded-full">
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pb-8">
                                    <Button className={`w-full font-black uppercase py-6 transition-all duration-300 ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600 scale-105 shadow-xl shadow-emerald-500/20' : ''}`}>
                                        Recarregar Arsenal
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto">
                    <Card className="bg-muted/50 border-dashed">
                        <CardContent className="p-6 flex items-center gap-6">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold">Garantia de Entrega Operacional</h4>
                                <p className="text-xs text-muted-foreground">
                                    Seus mísseis são processados via nossa rede neural de alta precisão.
                                    Garantimos dados frescos e verificados em todas as extrações.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

// export { BillingPage };
