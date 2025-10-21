import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export default function TreatmentStats({ tratamentos, loading }) {
  const totalTratamentos = tratamentos.length;
  const valorTotal = tratamentos.reduce((sum, t) => sum + (t.valor || 0), 0);
  const ticketMedio = totalTratamentos > 0 ? valorTotal / totalTratamentos : 0;

  const stats = [
    {
      title: "Total de Tratamentos",
      value: totalTratamentos,
      icon: Activity,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Receita Total",
      value: formatCurrency(valorTotal),
      icon: DollarSign,
      gradient: "from-pink-500 to-pink-600"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(ticketMedio),
      icon: TrendingUp,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
