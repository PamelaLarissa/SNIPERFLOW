import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  X as XIcon,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from "@/hooks/useSchedules";
import { useLeads } from "@/hooks/useLeads";
import { Schedule } from "@/lib/api";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export const SchedulesPage = () => {
  const { data: schedules = [], isLoading } = useSchedules();
  const { data: leads = [] } = useLeads();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    leadId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hour: '10:00',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      leadId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      hour: '10:00',
      notes: '',
    });
  };

  const schedulesForDate = schedules.filter(s => 
    isSameDay(parseISO(s.date), selectedDate)
  );

  const checkConflict = (date: string, hour: string, excludeId?: string) => {
    return schedules.some(s => 
      s.date === date && 
      s.hour === hour && 
      s.id !== excludeId &&
      s.status !== 'cancelled'
    );
  };

  const handleCreate = () => {
    if (!formData.leadId) return;

    if (checkConflict(formData.date, formData.hour)) return;

    const lead = leads.find(l => l.id === formData.leadId);
    createSchedule.mutate({
      leadId: formData.leadId,
      leadName: lead?.name || 'Lead',
      date: formData.date,
      hour: formData.hour,
      status: 'pending',
      notes: formData.notes,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
      }
    });
  };

  const handleEdit = () => {
    if (!editingSchedule) return;

    if (checkConflict(formData.date, formData.hour, editingSchedule.id)) return;

    const lead = leads.find(l => l.id === formData.leadId);
    updateSchedule.mutate({
      id: editingSchedule.id,
      updates: {
        leadId: formData.leadId,
        leadName: lead?.name || editingSchedule.leadName,
        date: formData.date,
        hour: formData.hour,
        notes: formData.notes,
      }
    }, {
      onSuccess: () => {
        setEditingSchedule(null);
        resetForm();
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteSchedule.mutate(id, {
      onSuccess: () => setDeleteConfirm(null)
    });
  };

  const handleComplete = (id: string) => {
    updateSchedule.mutate({
      id,
      updates: { status: 'completed' }
    });
  };

  const openEditModal = (schedule: Schedule) => {
    setFormData({
      leadId: schedule.leadId,
      date: schedule.date,
      hour: schedule.hour,
      notes: schedule.notes || '',
    });
    setEditingSchedule(schedule);
  };

  const getStatusBadge = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="verified">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="pending">Pendente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Agendamentos" subtitle="Gerencie suas reuniões e compromissos" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header 
        title="Agendamentos" 
        subtitle="Gerencie suas reuniões e compromissos" 
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"
        >
          <Badge variant="outline" className="text-sm w-fit">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {schedules.filter(s => s.status === 'pending').length} agendamentos pendentes
          </Badge>
          <Button variant="glow" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </motion.div>

        {/* Calendar and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md"
                  modifiers={{
                    hasSchedule: schedules.map(s => parseISO(s.date)),
                  }}
                  modifiersStyles={{
                    hasSchedule: { 
                      backgroundColor: 'hsl(var(--primary) / 0.2)',
                      borderRadius: '50%',
                    }
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schedulesForDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum agendamento para esta data</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedulesForDate
                      .sort((a, b) => a.hour.localeCompare(b.hour))
                      .map((schedule, index) => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm sm:text-base">{schedule.hour}</span>
                                {getStatusBadge(schedule.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{schedule.leadName}</p>
                              {schedule.notes && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{schedule.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {schedule.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleComplete(schedule.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-accent" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => openEditModal(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirm(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* All Schedules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {schedules
                  .filter(s => s.status === 'pending')
                  .sort((a, b) => `${a.date}${a.hour}`.localeCompare(`${b.date}${b.hour}`))
                  .slice(0, 6)
                  .map((schedule, index) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-secondary/20 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{schedule.leadName}</span>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(parseISO(schedule.date), 'dd/MM/yyyy')}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{schedule.hour}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Agende uma reunião com um lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Lead</Label>
              <Select value={formData.leadId} onValueChange={(v) => setFormData(prev => ({ ...prev, leadId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Data</Label>
                <Input 
                  type="date" 
                  className="bg-secondary/50"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Horário</Label>
                <Select value={formData.hour} onValueChange={(v) => setFormData(prev => ({ ...prev, hour: v }))}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Observações</Label>
              <Textarea 
                className="bg-secondary/50"
                placeholder="Detalhes da reunião..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createSchedule.isPending}>
              {createSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingSchedule} onOpenChange={(open) => { if (!open) { setEditingSchedule(null); resetForm(); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>Altere os dados do agendamento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Lead</Label>
              <Select value={formData.leadId} onValueChange={(v) => setFormData(prev => ({ ...prev, leadId: v }))}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione um lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Data</Label>
                <Input 
                  type="date" 
                  className="bg-secondary/50"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Horário</Label>
                <Select value={formData.hour} onValueChange={(v) => setFormData(prev => ({ ...prev, hour: v }))}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Observações</Label>
              <Textarea 
                className="bg-secondary/50"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingSchedule(null)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={updateSchedule.isPending}>
              {updateSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir este agendamento?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              {deleteSchedule.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
