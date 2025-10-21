import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ClientForm from "../components/clientes/ClientForm";
import ClientCard from "../components/clientes/ClientCard";
import ClientDetails from "../components/clientes/ClientDetails";

export default function Clientes() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const queryClient = useQueryClient();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Cliente.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setShowForm(false);
      setEditingClient(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Cliente.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setShowForm(false);
      setEditingClient(null);
      setSelectedClient(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.telefone?.includes(searchTerm);
    const matchesFilter = filterStatus === "todos" || cliente.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-gray-600 mt-1">Gerencie sua base de clientes</p>
        </div>
        <Button 
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2">
          {['todos', 'ativo', 'lead', 'inativo'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "bg-gradient-to-r from-[#823a80] to-[#c43c8b]" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <ClientForm
            client={editingClient}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onEdit={(client) => {
              setEditingClient(client);
              setShowForm(true);
              setSelectedClient(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredClientes.map((cliente) => (
            <ClientCard
              key={cliente.id}
              client={cliente}
              onClick={() => setSelectedClient(cliente)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredClientes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}