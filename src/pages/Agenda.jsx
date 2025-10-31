import React, { useState } from "react";

import { databaseService } from "@/services/database";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

import { format, addDays, startOfWeek, isSameDay } from "date-fns";

import { ptBR } from "date-fns/locale";

import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../contexts/AuthContext";



import AppointmentForm from "../components/agenda/AppointmentForm";



import WeekView from "../components/agenda/WeekView";



export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewMode, setViewMode] = useState("week");

  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const result = await databaseService.getAppointments(user?.uid, {});
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const result = await databaseService.getClients(user?.uid);
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const createMutation = useMutation({
    mutationFn: (data) => databaseService.createAppointment({ ...data, userId: user?.uid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => databaseService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };



  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));



  const todayAppointments = agendamentos.filter(a => 

    isSameDay(new Date(a.data_hora), currentDate)

  );



  return (

    <div className="p-4 md:p-8 space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">

            Agenda

          </h1>

          <p className="text-gray-600 mt-1">Gerencie seus agendamentos</p>

        </div>

        <Button 

          onClick={() => {

            setEditingAppointment(null);

            setShowForm(true);

          }}

          className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90 transition-opacity shadow-lg"

        >

          <Plus className="w-4 h-4 mr-2" />

          Novo Agendamento

        </Button>

      </div>



      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-purple-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            className="text-[#823a80] hover:bg-purple-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Hoje
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>



      <AnimatePresence mode="wait">

        {showForm && (

          <AppointmentForm

            appointment={editingAppointment}

            clientes={clientes}

            onSubmit={handleSubmit}

            onCancel={() => {

              setShowForm(false);

              setEditingAppointment(null);

            }}

            isLoading={createMutation.isPending || updateMutation.isPending}

          />

        )}

      </AnimatePresence>



      <WeekView

        weekDays={weekDays}

        currentDate={currentDate}

        agendamentos={agendamentos}

        onDateClick={(date) => setCurrentDate(date)}

        onAppointmentClick={(appointment) => {

          setEditingAppointment(appointment);

          setShowForm(true);

        }}

      />

    </div>

  );

}