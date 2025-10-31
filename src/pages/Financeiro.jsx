import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, BarChart3, TrendingUp } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import TransactionForm from "../components/financeiro/TransactionForm";
import TransactionList from "../components/financeiro/TransactionList";
import FinancialStats from "../components/financeiro/FinancialStats";
import FinancialFilters from "../components/financeiro/FinancialFilters";
import RevenueChart from "../components/common/RevenueChart";
import WeeklyChart from "../components/financeiro/WeeklyChart";
import MonthlyChart from "../components/financeiro/MonthlyChart";
import { LoadingStats, LoadingChart, LoadingTable } from "../components/ui/loading";
import { databaseService } from "@/services/database";

// Função para lidar com qualquer tipo de data (Firestore, string, etc)
const parseAnyDate = (d) => {
  if (!d) return null;
  if (d?.toDate) return d.toDate();
  if (d?.seconds) return new Date(d.seconds * 1000);
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export default function Financeiro() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const { data: transacoes = [], isLoading } = useQuery({
    queryKey: ["transacoes"],
    queryFn: async () => {
      if (!user?.uid) return [];
      const result = await databaseService.getTransactions(user.uid, {});
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const result = await databaseService.getClients(user?.uid);
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  // ================= MUTATIONS =================
  const createMutation = useMutation({
    mutationFn: (data) =>
      databaseService.createTransaction({ ...data, userId: user?.uid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transacoes"] });
      setShowForm(false);
      setEditingTransaction(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => databaseService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transacoes"] });
      setShowForm(false);
      setEditingTransaction(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // ================= FILTROS DE PERÍODO =================
  const transacoesFiltradas = useMemo(() => {
    const now = new Date();
    let periodo = { start: null, end: null };

    switch (periodoSelecionado) {
      case 'hoje':
        periodo = { start: startOfDay(now), end: endOfDay(now) };
        break;
      case 'semana':
        periodo = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        break;
      case 'mes':
        periodo = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      case 'personalizado':
        if (dataInicio && dataFim) {
          periodo = { start: startOfDay(dataInicio), end: endOfDay(dataFim) };
        } else {
          return [];
        }
        break;
      default:
        periodo = { start: startOfMonth(now), end: endOfMonth(now) };
    }

    return transacoes.filter((t) => {
      const data = parseAnyDate(t.data_transacao);
      return data && isWithinInterval(data, periodo);
    });
  }, [transacoes, periodoSelecionado, dataInicio, dataFim]);

  // ================= RENDER =================
  return (
    <ProtectedRoute
      requiredRole="gerente"
      message="Apenas gerentes e administradores têm acesso"
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Header com botão de nova transação */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Fechar Formulário" : "Nova Transação"}
          </Button>
        </div>

        {/* Formulário de nova transação */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TransactionForm
                onSubmit={handleSubmit}
                editingTransaction={editingTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                  setShowForm(false);
                }}
                clientes={clientes}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <FinancialFilters
          periodoSelecionado={periodoSelecionado}
          onPeriodoChange={setPeriodoSelecionado}
          dataInicio={dataInicio}
          dataFim={dataFim}
          onDataInicioChange={setDataInicio}
          onDataFimChange={setDataFim}
        />

        {/* Estatísticas */}
        {isLoading ? (
          <LoadingStats count={4} />
        ) : (
          <FinancialStats
            transacoes={transacoesFiltradas}
            periodoSelecionado={periodoSelecionado}
            loading={false}
          />
        )}

        {/* Abas com diferentes visualizações */}
        <Tabs defaultValue="diario" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diario" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Diário
            </TabsTrigger>
            <TabsTrigger value="semanal" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Semanal
            </TabsTrigger>
            <TabsTrigger value="mensal" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Mensal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diario" className="space-y-6">
            {isLoading ? (
              <LoadingChart />
            ) : (
              <RevenueChart transacoes={transacoesFiltradas} loading={false} />
            )}
          </TabsContent>

          <TabsContent value="semanal" className="space-y-6">
            {isLoading ? (
              <LoadingChart />
            ) : (
              <WeeklyChart transacoes={transacoesFiltradas} loading={false} />
            )}
          </TabsContent>

          <TabsContent value="mensal" className="space-y-6">
            {isLoading ? (
              <LoadingChart />
            ) : (
              <MonthlyChart transacoes={transacoesFiltradas} loading={false} />
            )}
          </TabsContent>
        </Tabs>

        {/* Lista de transações */}
        {isLoading ? (
          <LoadingTable rows={5} columns={7} />
        ) : (
          <TransactionList
            transacoes={transacoesFiltradas}
            loading={false}
            onEdit={(t) => {
              setEditingTransaction(t);
              setShowForm(true);
            }}
            clientes={clientes}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
