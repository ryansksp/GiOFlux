import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "../../utils/formatters";

export default function RevenueChart({ transacoes = [], loading }) {
  const now = new Date();
  const quinzeDiasAtras = subDays(now, 14); // Últimos 15 dias incluindo hoje
  const days = eachDayOfInterval({ start: quinzeDiasAtras, end: now });

  console.log("Transações no gráfico:", transacoes);
  console.log("Dias do gráfico:", days);

  const chartData = days.map((day) => {
    // Filtra transações do dia
    const dayTransactions = transacoes.filter((t) => {
      if (
        !t ||
        !t.data_transacao ||
        t.tipo !== "receita" ||
        t.status !== "confirmado"
      )
        return false;

      let transactionDate;
      try {
        // Detecta e converte Firestore Timestamp ou string ISO
        transactionDate = t.data_transacao?.seconds
          ? new Date(t.data_transacao.seconds * 1000)
          : new Date(t.data_transacao);
        if (isNaN(transactionDate)) return false;
      } catch {
        return false;
      }

      // Comparação apenas de dia/mês/ano (ignora horário/timezone)
      return (
        transactionDate.getDate() === day.getDate() &&
        transactionDate.getMonth() === day.getMonth() &&
        transactionDate.getFullYear() === day.getFullYear()
      );
    });

    const total = dayTransactions.reduce((sum, t) => sum + (t.valor || 0), 0);

    console.log(
      `Dia ${format(day, "dd/MM")}: ${dayTransactions.length} transações, total: ${total}`
    );

    return {
      dia: format(day, "dd/MM", { locale: ptBR }),
      receita: total,
    };
  });

  console.log("Dados do gráfico:", chartData);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
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
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e7ff" />
              <XAxis dataKey="dia" stroke="#823a80" />
              <YAxis
                stroke="#823a80"
                tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
              />
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
        )}
      </CardContent>
    </Card>
  );
}
