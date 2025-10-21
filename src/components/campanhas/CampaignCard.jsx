import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Bell, Calendar, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CampaignCard({ campaign, onEdit }) {
  const statusColors = {
    rascunho: "bg-gray-100 text-gray-800",
    agendada: "bg-blue-100 text-blue-800",
    enviada: "bg-green-100 text-green-800",
    cancelada: "bg-red-100 text-red-800"
  };

  const typeIcons = {
    email: Mail,
    sms: MessageSquare,
    whatsapp: MessageSquare,
    notificacao: Bell
  };

  const Icon = typeIcons[campaign.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
    >
      <Card className="border-purple-100 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#823a80] to-[#c43c8b]">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{campaign.nome}</h3>
                <p className="text-sm text-gray-500 capitalize">{campaign.tipo}</p>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onEdit(campaign)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.mensagem}</p>

          <div className="flex items-center justify-between">
            <Badge className={statusColors[campaign.status]}>
              {campaign.status}
            </Badge>
            {campaign.data_envio && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {format(new Date(campaign.data_envio), "dd MMM yyyy", { locale: ptBR })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-purple-100">
            <p className="text-xs text-gray-500">
              Segmento: <span className="font-medium text-gray-700">{campaign.segmento.replace(/_/g, ' ')}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}