import React, { useState } from "react";
import { databaseService } from "@/services/database";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useAuth } from "../contexts/AuthContext";

import ProtectedRoute from "../components/common/ProtectedRoute";
import TransactionForm from "../components/financeiro/TransactionForm";
import TransactionList from "../components/financeiro/TransactionList";
import FinancialStats from "../components/financeiro/FinancialStats";



export default function Financeiro() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  const { data: transacoes = [], isLoading } = useQuery({
    queryKey: ['transacoes'],
    queryFn: async () => {
      const result = await databaseService.getTransactions(userProfile?.uid, { orderBy: ['data_transacao', 'desc'] });
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const createMutation = useMutation({
    mutationFn: (data) => databaseService.createTransaction({ ...data, userId: userProfile?.uid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      setShowForm(false);
      setEditingTransaction(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => databaseService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
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



  const now = new Date();

  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };



  const transacoesMes = transacoes.filter(t =>

    isWithinInterval(new Date(t.data_transacao), mesAtual)

  );



  return (

    <ProtectedRoute

      requiredRole="gerente"

      message="Apenas gerentes e administradores têm acesso ao módulo financeiro."

    >

      <div className="p-4 md:p-8 space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">

              Financeiro

            </h1>

            <p className="text-gray-600 mt-1">Controle de receitas e despesas</p>

          </div>

          <Button

            onClick={() => {

              setEditingTransaction(null);

              setShowForm(true);

            }}

            className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90 transition-opacity shadow-lg"

          >

            <Plus className="w-4 h-4 mr-2" />

            Nova Transação

          </Button>

        </div>



        <FinancialStats transacoes={transacoesMes} loading={isLoading} />



        <AnimatePresence mode="wait">

          {showForm && (

            <TransactionForm

              transaction={editingTransaction}

              onSubmit={handleSubmit}

              onCancel={() => {

                setShowForm(false);

                setEditingTransaction(null);

              }}

              isLoading={createMutation.isPending || updateMutation.isPending}

            />

          )}

        </AnimatePresence>



        <TransactionList

          transacoes={transacoes}

          loading={isLoading}

          onEdit={(transaction) => {

            setEditingTransaction(transaction);

            setShowForm(true);

          }}

        />

      </div>

    </ProtectedRoute>

  );

}
