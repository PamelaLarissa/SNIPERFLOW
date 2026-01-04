import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Users,
    Search,
    MoreVertical,
    Shield,
    Wallet,
    Ban,
    CheckCircle,
    BarChart3,
    CreditCard,
    Crown,
    UserPlus,
    Settings,
    AlertTriangle,
    MessageCircle,
    Phone,
    Mail,
    FileText,
    Trash2,
    Key,
    LogOut,
    TrendingUp,
    DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Mock Data
const MOCK_USERS = [
    { id: 1, name: "Pamela Larissa", email: "pamela@agency.com", phone: "11999998888", plan: "Enterprise", credits: 2500, status: "active", lastLogin: "2 min atrás", joined: "10/01/2024", totalSpent: "R$ 5.400,00" },
    { id: 2, name: "João Silva", email: "joao.silva@startups.com.br", phone: "11988887777", plan: "Pro", credits: 120, status: "active", lastLogin: "1 dia atrás", joined: "15/02/2024", totalSpent: "R$ 1.200,00" },
    { id: 3, name: "Maria Oliveira", email: "maria.o@consulting.com", phone: "11977776666", plan: "Basic", credits: 50, status: "inactive", lastLogin: "5 dias atrás", joined: "20/03/2024", totalSpent: "R$ 299,00" },
    { id: 4, name: "Carlos Souza", email: "carlos@freelancer.net", phone: "11966665555", plan: "Basic", credits: 0, status: "blocked", lastLogin: "1 mês atrás", joined: "05/04/2024", totalSpent: "R$ 0,00" },
    { id: 5, name: "Ana Costa", email: "ana@marketing.com", phone: "11955554444", plan: "Pro", credits: 850, status: "active", lastLogin: "3 horas atrás", joined: "12/05/2024", totalSpent: "R$ 890,00" },
];

export const AdminUsersPage = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Dialogs State
    const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
    const [isConfigPlansDialogOpen, setIsConfigPlansDialogOpen] = useState(false);
    const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);

    // Form States
    const [creditAmount, setCreditAmount] = useState("");
    const [planSelection, setPlanSelection] = useState("");
    const [newUser, setNewUser] = useState({ name: "", email: "", plan: "Basic" });

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const churnRiskUsers = users.filter(u => u.status === 'blocked' || u.status === 'inactive' || u.credits < 10);

    const handleAddCredits = (userId: number) => {
        const amount = parseInt(creditAmount);
        if (isNaN(amount)) return;
        setUsers(users.map(u => u.id === userId ? { ...u, credits: u.credits + amount } : u));
        toast({ title: "Créditos Adicionados!", description: `${amount} créditos foram creditados com sucesso.` });
        setIsCreditDialogOpen(false);
        setCreditAmount("");
    };

    const handleChangePlan = (userId: number) => {
        if (!planSelection) return;
        setUsers(users.map(u => u.id === userId ? { ...u, plan: planSelection } : u));
        toast({ title: "Plano Atualizado!", description: `Plano alterado para ${planSelection}.` });
        setIsPlanDialogOpen(false);
    };

    const handleCreateUser = () => {
        const id = users.length + 1;
        setUsers([...users, { ...newUser, id, credits: 100, status: 'active', lastLogin: 'Agora', phone: "", joined: new Date().toLocaleDateString(), totalSpent: "R$ 0,00" } as any]);
        toast({ title: "Usuário Criado!", description: `${newUser.name} foi adicionado à base.` });
        setIsNewUserDialogOpen(false);
        setNewUser({ name: "", email: "", plan: "Basic" });
    };

    const openUserSheet = (user: any) => {
        setSelectedUser(user);
        setIsUserSheetOpen(true);
    };

    const toggleUserStatus = (userId: number) => {
        setUsers(users.map(u => {
            if (u.id === userId) {
                const newStatus = u.status === 'blocked' ? 'active' : 'blocked';
                toast({
                    title: newStatus === 'blocked' ? "Acesso Bloqueado" : "Acesso Liberado",
                    variant: newStatus === 'blocked' ? "destructive" : "default"
                });
                return { ...u, status: newStatus };
            }
            return u;
        }));
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 p-8 max-w-[1600px] mx-auto pb-20">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" /> Painel do Dono (SaaS)
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Visão geral de faturamento, gestão de clientes e recuperação.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => setIsConfigPlansDialogOpen(true)}>
                            <Settings className="h-4 w-4" /> Configurar Planos
                        </Button>
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsNewUserDialogOpen(true)}>
                            <UserPlus className="h-4 w-4" /> Novo Usuário
                        </Button>
                    </div>
                </div>

                {/* Business Intelligence Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-background to-secondary/10 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" /> Receita Mensal (MRR)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">R$ 15.450,00</div>
                            <p className="text-xs text-primary font-bold mt-1">+12% este mês</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-background to-secondary/10 border-emerald-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-emerald-500" /> Lucro Líquido Est.
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-500">R$ 12.100,00</div>
                            <p className="text-xs text-muted-foreground mt-1">Margem de 78%</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-background to-secondary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" /> Base Ativa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{users.filter(u => u.status === 'active').length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total: {users.length} cadastros</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-background to-secondary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Créditos Circulando
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-accent">
                                {users.reduce((acc, u) => acc + u.credits, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Potencial de consumo</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main User Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Base de Clientes</CardTitle>
                                    <div className="relative w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por nome ou email..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Plano</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Créditos</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openUserSheet(user)}>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex flex-col cursor-pointer" onClick={() => openUserSheet(user)}>
                                                        <span className="font-bold hover:underline hover:text-primary">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`
                            ${user.plan === 'Enterprise' ? 'border-primary text-primary bg-primary/10' :
                                                            user.plan === 'Pro' ? 'border-accent text-accent bg-accent/10' :
                                                                'border-muted text-muted-foreground'}
                          `}>
                                                        {user.plan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' :
                                                                user.status === 'blocked' ? 'bg-destructive' : 'bg-gray-400'
                                                            }`} />
                                                        <span className="capitalize text-sm">{user.status === 'active' ? 'Ativo' : user.status === 'blocked' ? 'Bloqueado' : 'Inativo'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 font-bold">
                                                        <Wallet className="h-3 w-3 text-muted-foreground" />
                                                        {user.credits}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Admin do Usuário</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsCreditDialogOpen(true); }}>
                                                                <Wallet className="mr-2 h-4 w-4" /> Gerenciar Créditos
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsPlanDialogOpen(true); }}>
                                                                <Crown className="mr-2 h-4 w-4" /> Alterar Plano
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openUserSheet(user)}>
                                                                <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Key className="mr-2 h-4 w-4" /> Resetar Senha
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className={user.status === 'blocked' ? "text-emerald-500" : "text-destructive"}
                                                                onClick={() => toggleUserStatus(user.id)}
                                                            >
                                                                {user.status === 'blocked' ? <CheckCircle className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />}
                                                                {user.status === 'blocked' ? "Desbloquear" : "Bloquear Acesso"}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Churn CRM & Recovery */}
                    <div className="space-y-6">
                        <Card className="bg-destructive/5 border-destructive/20 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" /> CRM de Recuperação
                                </CardTitle>
                                <CardDescription>
                                    Usuários em risco de churn ou inadimplentes. Ação rápida necessária.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {churnRiskUsers.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        Nenhum usuário em risco. 🚀
                                    </div>
                                ) : (
                                    churnRiskUsers.map(user => (
                                        <div key={user.id} className="p-3 bg-background rounded-lg border flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-sm">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        {user.status === 'blocked' ? <Badge variant="destructive" className="h-4 text-[10px] px-1">Bloqueado</Badge> :
                                                            user.status === 'inactive' ? <Badge variant="secondary" className="h-4 text-[10px] px-1">Inativo</Badge> :
                                                                <Badge variant="outline" className="h-4 text-[10px] px-1 text-amber-500 border-amber-500">Poucos Créditos</Badge>}
                                                        <span>• {user.credits} CR</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                    onClick={() => window.open(`https://wa.me/${user.phone}?text=Olá ${user.name}, notamos que sua conta está ${user.status === 'blocked' ? 'bloqueada' : 'inativa'}. Podemos ajudar?`, '_blank')}
                                                >
                                                    <MessageCircle className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <div className="flex gap-2 text-xs w-full">
                                                <Button variant="outline" size="sm" className="h-6 flex-1 text-[10px]" onClick={() => { setSelectedUser(user); setIsCreditDialogOpen(true); }}>
                                                    Oferecer Crédito
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-6 flex-1 text-[10px]" onClick={() => openUserSheet(user)}>
                                                    Ver Perfil
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- DIALOGS & SHEETS --- */}

                {/* User Details Sheet */}
                <Sheet open={isUserSheetOpen} onOpenChange={setIsUserSheetOpen}>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                        {selectedUser && (
                            <>
                                <SheetHeader className="pb-6 border-b">
                                    <SheetTitle className="flex items-center gap-2 text-2xl">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                        {selectedUser.name}
                                    </SheetTitle>
                                    <SheetDescription>
                                        Cliente desde {selectedUser.joined} • ID: #{selectedUser.id}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="py-6 space-y-6">
                                    {/* Status & Credits */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center">
                                            <span className="text-xs text-muted-foreground uppercase font-bold">Status da Conta</span>
                                            <Badge className="mt-2" variant={selectedUser.status === 'active' ? 'default' : selectedUser.status === 'blocked' ? 'destructive' : 'secondary'}>
                                                {selectedUser.status === 'active' ? 'Ativo' : selectedUser.status === 'blocked' ? 'Bloqueado' : 'Inativo'}
                                            </Badge>
                                        </div>
                                        <div className="p-4 rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center">
                                            <span className="text-xs text-muted-foreground uppercase font-bold">Saldo de Créditos</span>
                                            <div className="flex items-center gap-1 mt-1 text-2xl font-black text-accent pl-2">
                                                {selectedUser.credits} <Wallet className="h-4 w-4 opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" /> Dados Pessoais
                                        </h3>
                                        <div className="grid gap-3 p-4 border rounded-lg">
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-sm text-muted-foreground">Email:</span>
                                                <span className="text-sm font-medium">{selectedUser.email}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-sm text-muted-foreground">Telefone:</span>
                                                <span className="text-sm font-medium">{selectedUser.phone || "(11) 99999-0000"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Plano Atual:</span>
                                                <span className="text-sm font-bold text-primary">{selectedUser.plan}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Financeiro
                                        </h3>
                                        <div className="grid gap-3 p-4 border rounded-lg bg-secondary/5">
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-sm text-muted-foreground">Total Gasto (LTV):</span>
                                                <span className="text-sm font-black text-emerald-500">{selectedUser.totalSpent}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Último Pagamento:</span>
                                                <span className="text-sm font-medium">10/06/2024 (Via Pix)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 flex flex-col gap-2">
                                        <Button className="w-full gap-2" variant="outline" onClick={() => window.open(`https://wa.me/${selectedUser.phone}`, '_blank')}>
                                            <MessageCircle className="h-4 w-4 text-emerald-500" /> Contatar via WhatsApp
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button className="flex-1 gap-2" variant="outline">
                                                <Mail className="h-4 w-4" /> Enviar Email
                                            </Button>
                                            <Button className="flex-1 gap-2" variant="destructive" onClick={() => toggleUserStatus(selectedUser.id)}>
                                                <Ban className="h-4 w-4" /> {selectedUser.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Credit Dialog */}
                <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Gerenciar Créditos</DialogTitle>
                            <DialogDescription>
                                Adicionar ou remover créditos para <strong>{selectedUser?.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>Quantidade de Créditos</Label>
                            <Input
                                type="number"
                                placeholder="Ex: 500"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                                className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-2">Use números negativos para remover créditos.</p>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsCreditDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={() => selectedUser && handleAddCredits(selectedUser.id)}>Confirmar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Plan Dialog */}
                <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Alterar Plano</DialogTitle>
                            <DialogDescription>
                                Selecione o novo plano para <strong>{selectedUser?.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Select onValueChange={setPlanSelection}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um plano" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic (Trial)</SelectItem>
                                    <SelectItem value="Pro">Pro (Growth)</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise (Scale)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsPlanDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={() => selectedUser && handleChangePlan(selectedUser.id)}>Confirmar Alteração</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* New User Dialog */}
                <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Usuário</DialogTitle>
                            <DialogDescription>
                                Adicione um novo cliente manualmente ao sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Ex: João Silva" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Ex: joao@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Plano Inicial</Label>
                                <Select value={newUser.plan} onValueChange={v => setNewUser({ ...newUser, plan: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Basic">Basic</SelectItem>
                                        <SelectItem value="Pro">Pro</SelectItem>
                                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsNewUserDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleCreateUser} disabled={!newUser.name || !newUser.email}>Criar Usuário</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Config Plans Dialog (Mock) */}
                <Dialog open={isConfigPlansDialogOpen} onOpenChange={setIsConfigPlansDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Configurar Planos Pricing</DialogTitle>
                            <DialogDescription>
                                Ajuste os valores e limites dos planos SaaS.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-8 text-center text-muted-foreground">
                            <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>Funcionalidade de edição de planos em breve.</p>
                            <p className="text-xs">Edite diretamente no arquivo de configuração por enquanto.</p>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsConfigPlansDialogOpen(false)}>Fechar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};
