import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import TransactionForm from "../components/financeiro/TransactionForm";
import TransactionList from "../components/financeiro/TransactionList";
import FinancialStats from "../components/financeiro/FinancialStats";
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
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const { data: transacoes = [], isLoading } = useQuery({
    queryKey: ["transacoes"],
    queryFn: async () => {
      if (!userProfile?.uid) return [];
      const result = await databaseService.getTransactions(userProfile.uid, {
        orderBy: ["data_transacao", "desc"],
      });
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  // ================= MUTATIONS =================
  const createMutation = useMutation({
    mutationFn: (data) =>
      databaseService.createTransaction({ ...data, userId: userProfile?.uid }),
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

  // ================= FILTROS =================
  const now = new Date();
  const mesAtual = { start: startOfMonth(now), end: endOfMonth(now) };
  const transacoesMes = transacoes.filter((t) => {
    const data = parseAnyDate(t.data_transacao);
    return data && isWithinInterval(data, mesAtual);
  });

  // ================= RENDER =================
  return (
    <ProtectedRoute
      requiredRole="gerente"
      message="Apenas gerentes e administradores têm acesso"
    >
      <div className="space-y-4 p-4 md:p-8">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="default"
          className="mb-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Fechar Formulário" : "Nova Transação"}
        </Button>

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
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FinancialStats transacoes={transacoesMes} />

        <TransactionList
          transacoes={transacoesMes}
          loading={isLoading}
          onEdit={(t) => {
            setEditingTransaction(t);
            setShowForm(true);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
