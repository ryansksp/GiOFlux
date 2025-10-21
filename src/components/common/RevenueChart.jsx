import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "../../utils/formatters";

export default function RevenueChart({ transacoes, loading }) {
  const now = new Date();
  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };

  const days = eachDayOfInterval(mesAtual);

  const chartData = days.slice(0, 15).map(day => {
    const dayTransactions = transacoes.filter(t =>
      t.tipo === 'receita' &&
      t.status === 'confirmado' &&
      format(new Date(t.data_transacao), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    const total = dayTransactions.reduce((sum, t) => sum + (t.valor || 0), 0);

    return {
      dia: format(day, 'dd', { locale: ptBR }),
      receita: total
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-gray-500">Receita</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg">Receita dos Últimos 15 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e7ff" />
            <XAxis dataKey="dia" stroke="#823a80" />
            <YAxis stroke="#823a80" tickFormatter={(value) => `R$ ${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="receita" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#823a80" />
                <stop offset="100%" stopColor="#c43c8b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
