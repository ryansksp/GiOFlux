import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Calendar } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";

export default function FinancialStats({ transacoes, periodoSelecionado, loading }) {
  // Função helper para calcular período anterior
  const getPeriodoAnterior = (transacoes, periodoSelecionado) => {
    const now = new Date();
    let start, end, prevStart, prevEnd;

    switch (periodoSelecionado) {
      case 'hoje':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case 'semana':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        prevEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        break;
      case 'mes':
        start = startOfMonth(now);
        end = endOfMonth(now);
        prevStart = startOfMonth(subMonths(now, 1));
        prevEnd = endOfMonth(subMonths(now, 1));
        break;
      default:
        return { receitas: 0, despesas: 0, saldo: 0 };
    }

    const parseAnyDate = (d) => {
      if (!d) return null;
      if (d?.toDate) return d.toDate();
      if (d?.seconds) return new Date(d.seconds * 1000);
      const parsed = new Date(d);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const filtrarPorPeriodo = (trans, startDate, endDate) => {
      return trans.filter(t => {
        const data = parseAnyDate(t.data_transacao);
        return data && data >= startDate && data <= endDate;
      });
    };

    const transPrev = filtrarPorPeriodo(transacoes, prevStart, prevEnd);
    const receitasPrev = transPrev
      .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
      .reduce((sum, t) => sum + (t.valor || 0), 0);
    const despesasPrev = transPrev
      .filter(t => t.tipo === 'despesa' && t.status === 'confirmado')
      .reduce((sum, t) => sum + (t.valor || 0), 0);

    return {
      receitas: receitasPrev,
      despesas: despesasPrev,
      saldo: receitasPrev - despesasPrev
    };
  };

  // Função helper para parse de datas
  const parseAnyDate = (d) => {
    if (!d) return null;
    if (d?.toDate) return d.toDate();
    if (d?.seconds) return new Date(d.seconds * 1000);
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const receitas = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const despesas = transacoes
    .filter(t => t.tipo === 'despesa' && t.status === 'confirmado')
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const saldo = receitas - despesas;

  // Calcular período anterior
  const periodoAnterior = getPeriodoAnterior(transacoes, periodoSelecionado);

  // Calcular crescimento percentual
  const crescimentoReceitas = periodoAnterior.receitas > 0 ?
    ((receitas - periodoAnterior.receitas) / periodoAnterior.receitas) * 100 : 0;
  const crescimentoDespesas = periodoAnterior.despesas > 0 ?
    ((despesas - periodoAnterior.despesas) / periodoAnterior.despesas) * 100 : 0;
  const crescimentoSaldo = periodoAnterior.saldo !== 0 ?
    ((saldo - periodoAnterior.saldo) / Math.abs(periodoAnterior.saldo)) * 100 : 0;

  // Calcular médias
  const diasNoPeriodo = transacoes.length > 0 ? differenceInDays(
    new Date(Math.max(...transacoes.map(t => parseAnyDate(t.data_transacao)?.getTime() || 0))),
    new Date(Math.min(...transacoes.map(t => parseAnyDate(t.data_transacao)?.getTime() || Date.now())))
  ) + 1 : 1;

  const receitaMedia = receitas / Math.max(diasNoPeriodo, 1);
  const despesaMedia = despesas / Math.max(diasNoPeriodo, 1);

  const stats = [
    {
      title: "Receitas",
      value: formatCurrency(receitas),
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-600",
      crescimento: crescimentoReceitas,
      media: formatCurrency(receitaMedia)
    },
    {
      title: "Despesas",
      value: formatCurrency(despesas),
      icon: TrendingDown,
      gradient: "from-red-500 to-red-600",
      textColor: "text-red-600",
      crescimento: crescimentoDespesas,
      media: formatCurrency(despesaMedia)
    },
    {
      title: "Saldo",
      value: formatCurrency(saldo),
      icon: DollarSign,
      gradient: saldo >= 0 ? "from-purple-600 to-pink-600" : "from-gray-500 to-gray-600",
      textColor: saldo >= 0 ? "text-purple-600" : "text-gray-600",
      crescimento: crescimentoSaldo,
      media: null
    },
    {
      title: "Lucro Médio",
      value: formatCurrency(receitaMedia - despesaMedia),
      icon: BarChart3,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      crescimento: null,
      media: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                <p className={`text-lg font-bold ${stat.textColor}`}>{stat.value}</p>
                {stat.crescimento !== null && (
                  <p className={`text-xs ${stat.crescimento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.crescimento >= 0 ? '+' : ''}{stat.crescimento.toFixed(1)}% vs período anterior
                  </p>
                )}
                {stat.media && (
                  <p className="text-xs text-gray-500">
                    Média: {stat.media}/dia
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
