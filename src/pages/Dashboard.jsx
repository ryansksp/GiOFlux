import React, { useState, useEffect } from "react";

import { base44 } from "@/api/base44Client";

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

import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

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

        const currentUser = await base44.auth.me();

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

    queryFn: () => base44.entities.Cliente.list('-created_date'),

    initialData: [],

  });



  const { data: agendamentos = [], isLoading: loadingAgendamentos } = useQuery({

    queryKey: ['agendamentos'],

    queryFn: () => base44.entities.Agendamento.list('-data_hora'),

    initialData: [],

  });



  const { data: transacoes = [], isLoading: loadingTransacoes } = useQuery({

    queryKey: ['transacoes'],

    queryFn: () => canViewFinancial ? base44.entities.Transacao.list('-data_transacao') : Promise.resolve([]),

    initialData: [],

    enabled: canViewFinancial,

  });



  const { data: tratamentos = [], isLoading: loadingTratamentos } = useQuery({

    queryKey: ['tratamentos'],

    queryFn: () => base44.entities.Tratamento.list('-data_tratamento'),

    initialData: [],

  });



  const now = new Date();

  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };



  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;

  const agendamentosHoje = agendamentos.filter(a => 

    format(new Date(a.data_hora), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

  ).length;



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

            title="Receita do Mês"

            value={receitaMes}

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