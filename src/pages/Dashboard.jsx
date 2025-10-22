import React, { useState, useEffect } from "react";

import { databaseService } from "@/services/database";

import { useQuery } from "@tanstack/react-query";

import {

  Users,

  Calendar,

  TrendingUp,

  DollarSign,

  Activity,

  Star,

  ArrowUp

} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { format, startOfMonth, endOfMonth, isWithinInterval, subDays } from "date-fns";

import { ptBR } from "date-fns/locale";

import { canAccessFinancial } from "../utils/formatters";

import StatCard from "../components/common/StatCard";
import RecentClients from "../components/common/RecentClients";
import UpcomingAppointments from "../components/common/UpcomingAppointments";
import RevenueChart from "../components/common/RevenueChart";



export default function Dashboard() {

  const [user, setUser] = useState(null);

  const [canViewFinancial, setCanViewFinancial] = useState(false);



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



  const { data: clientes = [], isLoading: loadingClientes } = useQuery({

    queryKey: ['clientes'],

    queryFn: async () => {

      const result = await databaseService.getClients(user?.uid, { orderBy: ['createdAt', 'desc'] });

      return result.success ? result.data : [];

    },

    initialData: [],

    enabled: !!user,

  });



  const { data: agendamentos = [], isLoading: loadingAgendamentos } = useQuery({

    queryKey: ['agendamentos'],

    queryFn: async () => {

      const result = await databaseService.getAppointments(user?.uid, { orderBy: ['data_hora', 'desc'] });

      return result.success ? result.data : [];

    },

    initialData: [],

    enabled: !!user,

  });



  const { data: transacoes = [], isLoading: loadingTransacoes } = useQuery({

    queryKey: ['transacoes'],

    queryFn: async () => {

      if (!canViewFinancial) return [];

      // Primeiro tenta o método normal
      let result = await databaseService.getTransactions(user?.uid, { orderBy: ['data_transacao', 'desc'] });

      // Se falhou devido ao índice, tenta buscar todas as transações e filtrar manualmente
      if (!result.success && result.error && result.error.includes('index')) {
        console.log('Tentando buscar todas as transações sem filtro...');
        try {
          const allResult = await databaseService.getAllTransactions('transactions');
          console.log('Resultado de getAllTransactions (transactions):', allResult);
          if (allResult.success && allResult.data) {
            // Filtra manualmente por userId
            const filteredData = allResult.data.filter(t => t && t.userId === user?.uid);
            console.log('Transações filtradas manualmente (transactions):', filteredData);
            result = { success: true, data: filteredData };
          } else {
            console.log('Falhou em transactions, tentando transacoes...');
            // Tenta na coleção 'transacoes'
            const altResult = await databaseService.getAllTransactions('transacoes');
            console.log('Resultado de getAllTransactions (transacoes):', altResult);
            if (altResult.success && altResult.data) {
              const filteredData = altResult.data.filter(t => t && t.userId === user?.uid);
              console.log('Transações filtradas da coleção "transacoes":', filteredData);
              result = { success: true, data: filteredData };
            }
          }
        } catch (error) {
          console.error('Erro no fallback de transações:', error);
        }
      }

      console.log('Transações carregadas:', result.data); // Debug

      return result.success ? result.data : [];

    },

    initialData: [],

    enabled: canViewFinancial && !!user,

  });



  const { data: tratamentos = [], isLoading: loadingTratamentos } = useQuery({

    queryKey: ['tratamentos'],

    queryFn: async () => {

      const result = await databaseService.getTreatments(user?.uid, { orderBy: ['data_tratamento', 'desc'] });

      return result.success ? result.data : [];

    },

    initialData: [],

    enabled: !!user,

  });



  const now = new Date();

  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };



  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;

  const agendamentosHoje = agendamentos.filter(a =>

    format(new Date(a.data_hora), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

  ).length;



  // Receita dos últimos 30 dias (mais útil para dashboard)
  const trintaDiasAtras = subDays(now, 29);
  const receitaUltimos30Dias = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
    .filter(t => new Date(t.data_transacao) >= trintaDiasAtras)
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  // Manter cálculo do mês atual para compatibilidade futura
  const receitaMes = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
    .filter(t => isWithinInterval(new Date(t.data_transacao), mesAtual))
    .reduce((sum, t) => sum + (t.valor || 0), 0);



  const tratamentosMes = tratamentos.filter(t =>

    isWithinInterval(new Date(t.data_tratamento), mesAtual)

  ).length;



  return (

    <div className="p-4 md:p-8 space-y-8">

      <div className="space-y-2">

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">

          Dashboard

        </h1>

        <p className="text-gray-600">

          {user ? `Olá, ${user.full_name}!` : 'Visão geral da sua clínica'}

        </p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard

          title="Clientes Ativos"

          value={clientesAtivos}

          icon={Users}

          gradient="from-purple-500 to-purple-600"

          loading={loadingClientes}

        />

        <StatCard

          title="Agendamentos Hoje"

          value={agendamentosHoje}

          icon={Calendar}

          gradient="from-pink-500 to-pink-600"

          loading={loadingAgendamentos}

        />

        {canViewFinancial && (
          <StatCard
            title="Receita (30 dias)"
            value={receitaUltimos30Dias}
            isCurrency={true}
            icon={DollarSign}
            gradient="from-purple-600 to-pink-600"
            loading={loadingTransacoes}
            trend="+12%"
          />
        )}

        <StatCard

          title="Tratamentos Mês"

          value={tratamentosMes}

          icon={Activity}

          gradient="from-pink-600 to-purple-600"

          loading={loadingTratamentos}

        />

      </div>



      <div className="grid lg:grid-cols-3 gap-6">

        {canViewFinancial && (

          <div className="lg:col-span-2">

            <RevenueChart transacoes={transacoes} loading={loadingTransacoes} />

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
