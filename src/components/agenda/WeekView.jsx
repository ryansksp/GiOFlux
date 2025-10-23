import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Calendar, ChevronRight } from "lucide-react";



export default function WeekView({ weekDays, currentDate, agendamentos, onDateClick, onAppointmentClick }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColors = {
    agendado: "bg-blue-100 text-blue-800",
    confirmado: "bg-green-100 text-green-800",
    realizado: "bg-purple-100 text-purple-800",
    cancelado: "bg-red-100 text-red-800",
    faltou: "bg-orange-100 text-orange-800"
  };

  const handleExpandDay = (day, e) => {
    e.stopPropagation();
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const selectedDayAppointments = selectedDay ? agendamentos
    .filter(a => isSameDay(new Date(a.data_hora), selectedDay))
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)) : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayAppointments = agendamentos.filter(a => isSameDay(new Date(a.data_hora), day));

          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, currentDate);

          return (
            <Card
              key={day.toISOString()}
              className={`border-purple-100 ${isSelected ? 'ring-2 ring-[#823a80]' : ''} ${isToday ? 'border-[#c43c8b]' : ''}`}
              onClick={() => onDateClick(day)}
            >
              <CardContent className="p-4">
                <div className={`text-center mb-3 pb-3 border-b ${isToday ? 'border-[#c43c8b]' : 'border-purple-100'}`}>
                  <p className="text-xs text-gray-500 uppercase">
                    {format(day, "EEE", { locale: ptBR })}
                  </p>
                  <p className={`text-2xl font-bold ${isToday ? 'text-[#c43c8b]' : 'text-gray-900'}`}>
                    {format(day, "dd")}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[120px] space-y-3">
                  {dayAppointments.length > 0 ? (
                    <>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-semibold text-gray-700">
                            {dayAppointments.length}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          agendamento{dayAppointments.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div
                        className="flex items-center justify-center gap-1.5 text-xs font-medium text-white cursor-pointer transition-all bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90 px-3 py-1.5 rounded-md shadow-sm hover:shadow-md"
                        onClick={(e) => handleExpandDay(day, e)}
                      >
                        <span>Ver</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">
                      Sem agendamentos
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedDay && format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {selectedDayAppointments.length > 0 ? (
              selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => {
                    onAppointmentClick(appointment);
                    setIsModalOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(appointment.data_hora), "HH:mm")}
                        </span>
                        <Badge className={`${statusColors[appointment.status]} text-xs`} variant="secondary">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {appointment.cliente_nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.tipo_tratamento}
                      </p>
                      {appointment.profissional && (
                        <p className="text-xs text-gray-500">
                          Profissional: {appointment.profissional}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum agendamento para este dia
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
