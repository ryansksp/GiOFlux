import React, { useState } from "react";
import { databaseService } from "@/services/database";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { LoadingCard } from "../components/ui/loading";

import ClientForm from "../components/clientes/ClientForm";
import ClientCard from "../components/clientes/ClientCard";
import ClientDetails from "../components/clientes/ClientDetails";



export default function Clientes() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [sortBy, setSortBy] = useState("data-desc");

  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  const getOrderBy = (sortOption) => {
    switch (sortOption) {
      case "nome-asc":
        return ['nome_completo', 'asc'];
      case "nome-desc":
        return ['nome_completo', 'desc'];
      case "data-asc":
        return ['createdAt', 'asc'];
      case "data-desc":
      default:
        return ['createdAt', 'desc'];
    }
  };

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes', sortBy],
    queryFn: async () => {
      // Sempre buscar sem ordenação do Firestore primeiro
      const result = await databaseService.getClients(user?.uid, {});
      if (result.success) {
        // Sempre aplicar ordenação local
        let sortedData = [...result.data];
        switch (sortBy) {
          case "nome-asc":
            sortedData.sort((a, b) => (a.nome_completo || '').localeCompare(b.nome_completo || ''));
            break;
          case "nome-desc":
            sortedData.sort((a, b) => (b.nome_completo || '').localeCompare(a.nome_completo || ''));
            break;
          case "data-asc":
            sortedData.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return dateA - dateB;
            });
            break;
          case "data-desc":
          default:
            sortedData.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return dateB - dateA;
            });
            break;
        }
        return sortedData;
      }
      return [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      console.log('Enviando dados para criação:', { ...data, user_id: user?.uid });
      return databaseService.createClient({ ...data, user_id: user?.uid });
    },    
    onSuccess: (result) => {
      console.log('Cliente criado com sucesso:', result);
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setShowForm(false);
      setEditingClient(null);
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => databaseService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setShowForm(false);
      setEditingClient(null);
      setSelectedClient(null);
    },
  });

  const handleSubmit = (data) => {
    console.log('Dados do formulário:', data);
    if (editingClient) {
      console.log('Atualizando cliente:', editingClient.id);
      updateMutation.mutate({ id: editingClient.id, data });
    } else {
      console.log('Criando novo cliente');
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
        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 border-purple-200 focus:border-purple-400">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome-asc">Nome A-Z</SelectItem>
              <SelectItem value="nome-desc">Nome Z-A</SelectItem>
              <SelectItem value="data-desc">Data mais recente</SelectItem>
              <SelectItem value="data-asc">Data mais antiga</SelectItem>
            </SelectContent>
          </Select>
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

              setSelectedClient(null);

              setShowForm(true);

            }}

          />

        )}

      </AnimatePresence>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton cards
          Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))
        ) : (
          <AnimatePresence>
            {filteredClientes.map((cliente) => (
              <ClientCard
                key={cliente.id}
                client={cliente}
                onClick={() => setSelectedClient(cliente)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>



      {filteredClientes.length === 0 && !isLoading && (

        <div className="text-center py-12">

          <p className="text-gray-500">Nenhum cliente encontrado</p>

        </div>

      )}

    </div>

  );

}
