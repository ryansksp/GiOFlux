import React, { useState } from "react";
import { databaseService } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

import TreatmentCard from "../components/tratamentos/TreatmentCard";
import TreatmentStats from "../components/tratamentos/TreatmentStats";



export default function Tratamentos() {
  const [searchTerm, setSearchTerm] = useState("");

  const { userProfile } = useAuth();

  const { data: tratamentos = [], isLoading } = useQuery({
    queryKey: ['tratamentos'],
    queryFn: async () => {
      const result = await databaseService.getTreatments(userProfile?.uid, { orderBy: 'data_tratamento', orderDirection: 'desc' });
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const result = await databaseService.getClients(userProfile?.uid);
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });



  const getClientName = (clientId) => {

    const client = clientes.find(c => c.id === clientId);

    return client?.nome_completo || "Cliente não encontrado";

  };



  const filteredTratamentos = tratamentos.filter(t => {

    const clientName = getClientName(t.cliente_id);

    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||

           t.tipo_tratamento?.toLowerCase().includes(searchTerm.toLowerCase());

  });



  return (

    <div className="p-4 md:p-8 space-y-6">

      <div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">

          Tratamentos

        </h1>

        <p className="text-gray-600 mt-1">Histórico de procedimentos realizados</p>

      </div>



      <TreatmentStats tratamentos={tratamentos} loading={isLoading} />



      <div className="relative">

        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

        <Input

          placeholder="Buscar por cliente ou tipo de tratamento..."

          value={searchTerm}

          onChange={(e) => setSearchTerm(e.target.value)}

          className="pl-10 border-purple-200 focus:border-purple-400"

        />

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <AnimatePresence>

          {filteredTratamentos.map((tratamento) => (

            <TreatmentCard

              key={tratamento.id}

              treatment={tratamento}

              clientName={getClientName(tratamento.cliente_id)}

            />

          ))}

        </AnimatePresence>

      </div>



      {filteredTratamentos.length === 0 && !isLoading && (

        <div className="text-center py-12">

          <p className="text-gray-500">Nenhum tratamento encontrado</p>

        </div>

      )}

    </div>

  );

}