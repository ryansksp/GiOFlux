import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Activity, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "../../utils/formatters";

export default function TreatmentCard({ treatment, clientName }) {
  const statusColors = {
    pendente: "bg-yellow-100 text-yellow-800",
    pago: "bg-green-100 text-green-800",
    parcial: "bg-orange-100 text-orange-800"
  };

  return (
    <Card className="border-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{clientName}</h3>
            <p className="text-sm text-gray-600">{treatment.tipo_tratamento}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[treatment.status_pagamento]}>
              {treatment.status_pagamento}
            </Badge>
            <Edit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#823a80]" />
            <span>{format(new Date(treatment.data_tratamento), "dd MMM yyyy", { locale: ptBR })}</span>
          </div>
          {treatment.valor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-[#c43c8b]" />
              <span className="font-semibold">{formatCurrency(treatment.valor)}</span>
            </div>
          )}
          {treatment.sessao_numero && treatment.total_sessoes && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="w-4 h-4 text-[#823a80]" />
            <span>Sessão {treatment.sessao_numero} de {treatment.total_sessoes}</span>
            </div>
          )}
        </div>

        {treatment.profissional && (
          <div className="mt-4 pt-4 border-t border-purple-100">
            <p className="text-xs text-gray-500">
              Profissional: <span className="font-medium text-gray-700">{treatment.profissional}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
