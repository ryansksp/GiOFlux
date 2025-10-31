import React, { useState, useEffect, useCallback } from "react";
import { databaseService } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../components/common/StatCard";
import RecentClients from "../components/common/RecentClients";
import UpcomingAppointments from "../components/common/UpcomingAppointments";
import RevenueChart from "../components/common/RevenueChart";
import { LoadingStats, LoadingChart } from "../components/ui/loading";
import { format, startOfMonth, endOfMonth, isWithinInterval, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { canAccessFinancial } from "../utils/formatters";
import { useAuth } from "../contexts/AuthContext";

// Utilitário para converter qualquer tipo de data do Firestore
const parseAnyDateUtil = (d) => {
  if (!d) return null;
  if (d?.toDate) return d.toDate();
  if (d?.seconds) return new Date(d.seconds * 1000);
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export default function Dashboard() {
  const { user: authUser, userProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [canViewFinancial, setCanViewFinancial] = useState(false);

  // Memoizar função parseAnyDate para evitar recriação em cada render
  const parseAnyDate = useCallback((d) => {
    if (!d) return null;
    if (d?.toDate) return d.toDate();
    if (d?.seconds) return new Date(d.seconds * 1000);
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await databaseService.getCurrentUser();
        setUser(currentUser);
        setCanViewFinancial(canAccessFinancial(currentUser));
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  // Otimização: Paralelizar queries do Dashboard com Promise.all
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard-data', user?.uid, canViewFinancial],
    queryFn: async () => {
      if (!user?.uid) return { clientes: [], agendamentos: [], transacoes: [], tratamentos: [] };

      const queries = [
        databaseService.getClients(user.uid, {}),
        databaseService.getAppointments(user.uid, {}),
        databaseService.getTreatments(user.uid, {})
      ];

      // Adicionar transações apenas se o usuário pode visualizar financeiro
      if (canViewFinancial) {
        queries.push(databaseService.getTransactions(user.uid, {}));
      }

      const results = await Promise.all(queries);

      return {
        clientes: results[0].success ? results[0].data : [],
        agendamentos: results[1].success ? results[1].data : [],
        tratamentos: results[2].success ? results[2].data : [],
        transacoes: canViewFinancial && results[3] ? (results[3].success ? results[3].data : []) : []
      };
    },
    initialData: { clientes: [], agendamentos: [], transacoes: [], tratamentos: [] },
    enabled: !!user,
  });

  // Extrair dados das queries paralelizadas
  const { clientes, agendamentos, transacoes, tratamentos } = dashboardData;
  const loadingClientes = loadingDashboard;
  const loadingAgendamentos = loadingDashboard;
  const loadingTransacoes = loadingDashboard;
  const loadingTratamentos = loadingDashboard;

  const now = new Date();
  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };

  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;
  const agendamentosHoje = agendamentos.filter(a => {
    const data = parseAnyDate(a.data_hora);
    return data && format(data, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
  }).length;

  const receitaUltimos30Dias = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
    .filter(t => {
      const data = parseAnyDate(t.data_transacao);
      return data && data >= subDays(now, 29);
    })
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const receitaMes = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
    .filter(t => {
      const data = parseAnyDate(t.data_transacao);
      return data && isWithinInterval(data, mesAtual);
    })
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const tratamentosMes = tratamentos.filter(t => {
    const data = parseAnyDate(t.data_tratamento);
    return data && isWithinInterval(data, mesAtual);
  }).length;

  const nomeUsuario = user?.displayName || userProfile?.displayName || (user?.email ? user.email.split("@")[0] : "Usuário");

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600">
          {authUser ? `Olá, ${nomeUsuario}!` : 'Visão geral da sua clínica'}
        </p>
      </div>

      {loadingDashboard ? (
        <LoadingStats count={canViewFinancial ? 4 : 3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Clientes Ativos" value={clientesAtivos} icon={Users} gradient="from-purple-500 to-purple-600" loading={false} />
          <StatCard title="Agendamentos Hoje" value={agendamentosHoje} icon={Calendar} gradient="from-pink-500 to-pink-600" loading={false} />
          {canViewFinancial && (
            <StatCard title="Receita (30 dias)" value={receitaUltimos30Dias} isCurrency={true} icon={DollarSign} gradient="from-purple-600 to-pink-600" loading={false} />
          )}
          <StatCard title="Procedimentos Mês" value={tratamentosMes} icon={Activity} gradient="from-pink-600 to-purple-600" loading={false} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {canViewFinancial && (
          <div className="lg:col-span-2">
            {loadingDashboard ? (
              <LoadingChart />
            ) : (
              <RevenueChart transacoes={transacoes} loading={false} />
            )}
          </div>
        )}
        <div className={canViewFinancial ? "" : "lg:col-span-3"}>
          <RecentClients clientes={clientes} loading={loadingClientes} />
        </div>
      </div>

      <UpcomingAppointments agendamentos={agendamentos} loading={loadingAgendamentos} />
    </div>
  );
}
