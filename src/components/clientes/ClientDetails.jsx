import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit, User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientDetails({ client, onClose, onEdit }) {
  const statusColors = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-gray-100 text-gray-800",
    lead: "bg-blue-100 text-blue-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white">
          <div className="flex items-center justify-between">
            <CardTitle>Detalhes do Cliente</CardTitle>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onEdit(client)}
                className="text-white hover:bg-white/20"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#823a80] to-[#c43c8b] flex items-center justify-center text-white text-2xl font-bold">
              {client.nome_completo?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.nome_completo}</h2>
              <Badge className={statusColors[client.status]}>
                {client.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#823a80]" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#823a80]" />
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="font-medium">{client.telefone}</p>
              </div>
            </div>
            {client.data_nascimento && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#823a80]" />
                <div>
                  <p className="text-xs text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">
                    {format(new Date(client.data_nascimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
            {client.tipo_pele && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-[#823a80]" />
                <div>
                  <p className="text-xs text-gray-500">Tipo de Pele</p>
                  <p className="font-medium">{client.tipo_pele}</p>
                </div>
              </div>
            )}
          </div>

          {client.observacoes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{client.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}