import React, { useState } from "react";
import { databaseService } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import TreatmentCard from "../components/tratamentos/TreatmentCard";
import TreatmentStats from "../components/tratamentos/TreatmentStats";

export default function Tratamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("data_tratamento");
  const [sortOrder, setSortOrder] = useState("desc");

  const { user, userProfile } = useAuth();

  const { data: tratamentos = [], isLoading } = useQuery({
    queryKey: ['tratamentos'],
    queryFn: async () => {
      const result = await databaseService.getTreatments(user?.uid, {});
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

  const getClientName = (clientId) => {
    const client = clientes.find(c => c.id === clientId);
    return client?.nome_completo || "Cliente não encontrado";
  };

  // Ordenação dos tratamentos
  const sortedTratamentos = [...tratamentos].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'data_tratamento':
        aValue = new Date(a.data_tratamento);
        bValue = new Date(b.data_tratamento);
        break;
      case 'cliente':
        aValue = getClientName(a.cliente_id).toLowerCase();
        bValue = getClientName(b.cliente_id).toLowerCase();
        break;
      case 'tipo_tratamento':
        aValue = (a.tipo_tratamento || '').toLowerCase();
        bValue = (b.tipo_tratamento || '').toLowerCase();
        break;
      case 'valor':
        aValue = a.valor || 0;
        bValue = b.valor || 0;
        break;
      default:
        aValue = new Date(a.data_tratamento);
        bValue = new Date(b.data_tratamento);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const filteredTratamentos = sortedTratamentos.filter(t => {
    const clientName = getClientName(t.cliente_id);
    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.tipo_tratamento?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">
          Procedimentos
        </h1>
        <p className="text-gray-600 mt-1">Histórico de procedimentos realizados</p>
      </div>

      <TreatmentStats tratamentos={tratamentos} loading={isLoading} />

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por cliente ou tipo de procedimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-purple-200">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data_tratamento">Data do Procedimento</SelectItem>
                <SelectItem value="cliente">Nome do Cliente</SelectItem>
                <SelectItem value="tipo_tratamento">Tipo de Procedimento</SelectItem>
                <SelectItem value="valor">Valor</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="border-purple-200 hover:bg-purple-50"
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            </Button>
          </div>
        </div>

        <Button asChild className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:from-[#6b2f6b] hover:to-[#a33c8b] text-white">
          <Link to="/procedimento">
            <Plus className="w-4 h-4 mr-2" />
            Novo Procedimento
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTratamentos.map((tratamento) => (
            <motion.div
              key={tratamento.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/procedimento/${tratamento.id}`}>
                <TreatmentCard
                  treatment={tratamento}
                  clientName={getClientName(tratamento.cliente_id)}
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTratamentos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum procedimento encontrado</p>
        </div>
      )}
    </div>
  );
}
