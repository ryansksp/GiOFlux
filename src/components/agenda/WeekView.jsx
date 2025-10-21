import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppointmentCard from "./AppointmentCard";

export default function WeekView({ weekDays, currentDate, agendamentos, onDateClick, onAppointmentClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((day) => {
        const dayAppointments = agendamentos.filter(a => 
          isSameDay(new Date(a.data_hora), day)
        );
        
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
              <div className="space-y-2">
                {dayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appointment);
                    }}
                  />
                ))}
                {dayAppointments.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Sem agendamentos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}