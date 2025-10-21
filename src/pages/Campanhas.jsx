import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CampaignForm from "../components/campanhas/CampaignForm";
import CampaignCard from "../components/campanhas/CampaignCard";

export default function Campanhas() {
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const queryClient = useQueryClient();

  const { data: campanhas = [], isLoading } = useQuery({
    queryKey: ['campanhas'],
    queryFn: () => base44.entities.Campanha.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Campanha.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanhas'] });
      setShowForm(false);
      setEditingCampaign(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Campanha.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanhas'] });
      setShowForm(false);
      setEditingCampaign(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">
            Campanhas
          </h1>
          <p className="text-gray-600 mt-1">Marketing e comunicação com clientes</p>
        </div>
        <Button 
          onClick={() => {
            setEditingCampaign(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <CampaignForm
            campaign={editingCampaign}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCampaign(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {campanhas.map((campanha) => (
            <CampaignCard
              key={campanha.id}
              campaign={campanha}
              onEdit={(campaign) => {
                setEditingCampaign(campaign);
                setShowForm(true);
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {campanhas.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma campanha criada ainda</p>
        </div>
      )}
    </div>
  );
}