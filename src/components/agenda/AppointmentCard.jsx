import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Clock, User } from "lucide-react";

import { motion } from "framer-motion";

import { format } from "date-fns";



export default function AppointmentCard({ appointment, onClick }) {

  const statusColors = {

    agendado: "bg-blue-100 text-blue-800",

    confirmado: "bg-green-100 text-green-800",

    realizado: "bg-purple-100 text-purple-800",

    cancelado: "bg-red-100 text-red-800",

    faltou: "bg-orange-100 text-orange-800"

  };



  return (

    <motion.div

      whileHover={{ scale: 1.02 }}

      onClick={onClick}

    >

      <Card className="border-purple-100 hover:shadow-lg transition-all cursor-pointer">
        <CardContent className="p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold truncate flex-1 mr-2" title={appointment.cliente_nome}>
              {appointment.cliente_nome}
            </h3>
            <Badge className={statusColors[appointment.status]} variant="secondary">
              {appointment.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2 truncate" title={appointment.tipo_tratamento}>
            {appointment.tipo_tratamento}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {format(new Date(appointment.data_hora), "HH:mm")}
            </span>
            {appointment.profissional && (
              <span className="flex items-center gap-1 truncate" title={appointment.profissional}>
                <User className="w-3 h-3" />
                {appointment.profissional}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

    </motion.div>

  );

}