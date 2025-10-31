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
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "../../utils/formatters";

// Função helper para converter e normalizar qualquer tipo de data
const parseAnyDate = (data) => {
  if (!data) return null;
  // Prioriza o método .toDate() do Firestore Timestamp
  if (typeof data.toDate === 'function') {
    return data.toDate();
  }
  // Fallback para Timestamps com { seconds, nanoseconds }
  if (typeof data.seconds === 'number') {
    return new Date(data.seconds * 1000);
  }
  // Tenta converter strings ou números
  const date = new Date(data);
  // Retorna nulo se a data for inválida para evitar quebras
  return isNaN(date.getTime()) ? null : date;
};

export default function MonthlyChart({ transacoes = [], loading }) {
  const now = new Date();
  const seisMesesAtras = subMonths(now, 5); // Últimos 6 meses incluindo o atual
  const meses = eachMonthOfInterval({ start: seisMesesAtras, end: now });

  console.log("Transações recebidas no gráfico mensal:", transacoes);

  const chartData = meses.map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);

    // Filtra as transações que ocorreram no mês específico
    const monthTransactions = transacoes.filter((t) => {
      // Validações básicas do objeto de transação
      if (!t || !t.valor) return false;

      // Normaliza os campos para comparação (ignora maiúsculas/minúsculas)
      const tipo = (t.tipo || "").toLowerCase();
      const status = (t.status || "").toLowerCase();

      if (tipo !== "receita" || status !== "confirmado") {
        return false;
      }

      // Converte a data da transação de forma segura
      const transactionDate = parseAnyDate(t.data_transacao);
      if (!transactionDate) {
        return false;
      }

      // Verifica se a data está dentro do mês
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    // Soma o valor total das transações do mês
    const receita = monthTransactions.reduce((sum, t) => sum + (t.valor || 0), 0);

    return {
      mes: format(monthStart, "MMM/yy", { locale: ptBR }), // Jan/24, Fev/24, etc.
      receita: receita,
      mesCompleto: format(monthStart, "MMMM yyyy", { locale: ptBR }),
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const valor = payload[0].value;
      const mes = payload[0].payload.mesCompleto;
      return (
        <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{mes}</p>
          {valor > 0 ? (
            <p className="text-sm text-green-600">Receita: {formatCurrency(valor)}</p>
          ) : (
            <p className="text-sm text-gray-500">Sem receita</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calcular total dos últimos 6 meses
  const totalMeses = chartData.reduce((sum, month) => sum + month.receita, 0);

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Receita dos Últimos 6 Meses</span>
          <span className="text-sm font-normal text-gray-600">
            Total: {formatCurrency(totalMeses)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-center text-gray-500">Carregando dados do gráfico...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e7ff" />
              <XAxis dataKey="mes" stroke="#823a80" fontSize={12} />
              <YAxis
                stroke="#823a80"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(233, 213, 255, 0.4)' }} />
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
