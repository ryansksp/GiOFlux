import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

import { formatCurrency } from "../../utils/formatters";



export default function FinancialStats({ transacoes, loading }) {

  const receitas = transacoes

    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')

    .reduce((sum, t) => sum + (t.valor || 0), 0);



  const despesas = transacoes

    .filter(t => t.tipo === 'despesa' && t.status === 'confirmado')

    .reduce((sum, t) => sum + (t.valor || 0), 0);



  const saldo = receitas - despesas;



  const stats = [

    {

      title: "Receitas",

      value: formatCurrency(receitas),

      icon: TrendingUp,

      gradient: "from-green-500 to-green-600",

      textColor: "text-green-600"

    },

    {

      title: "Despesas",

      value: formatCurrency(despesas),

      icon: TrendingDown,

      gradient: "from-red-500 to-red-600",

      textColor: "text-red-600"

    },

    {

      title: "Saldo",

      value: formatCurrency(saldo),

      icon: DollarSign,

      gradient: saldo >= 0 ? "from-purple-600 to-pink-600" : "from-gray-500 to-gray-600",

      textColor: saldo >= 0 ? "text-purple-600" : "text-gray-600"

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

                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>

              </div>

            </div>

          </CardContent>

        </Card>

      ))}

    </div>

  );

}