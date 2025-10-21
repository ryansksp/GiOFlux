import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function UpcomingAppointments({ agendamentos, loading }) {
  const upcoming = agendamentos
    .filter(a => new Date(a.data_hora) > new Date())
    .slice(0, 5);

  const statusColors = {
    agendado: "bg-blue-100 text-blue-800",
    confirmado: "bg-green-100 text-green-800",
    realizado: "bg-purple-100 text-purple-800",
    cancelado: "bg-red-100 text-red-800",
    faltou: "bg-orange-100 text-orange-800"
  };

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcoming.map((agendamento) => (
            <div key={agendamento.id} className="flex items-center justify-between p-4 border border-purple-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <p className="font-semibold">{agendamento.cliente_nome}</p>
                <p className="text-sm text-gray-600">{agendamento.tipo_tratamento}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(agendamento.data_hora), "dd MMM", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(agendamento.data_hora), "HH:mm")}
                  </span>
                </div>
              </div>
              <Badge className={statusColors[agendamento.status]}>
                {agendamento.status}
              </Badge>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhum agendamento futuro</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}