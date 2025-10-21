import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientCard({ client, onClick }) {
  const statusColors = {
    ativo: "bg-green-100 text-green-800 border-green-200",
    inativo: "bg-gray-100 text-gray-800 border-gray-200",
    lead: "bg-blue-100 text-blue-800 border-blue-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="border-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 border-2 border-purple-200">
              <AvatarFallback className="bg-gradient-to-br from-[#823a80] to-[#c43c8b] text-white text-lg">
                {client.nome_completo?.charAt(0) || <User className="w-6 h-6" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate group-hover:text-[#823a80] transition-colors">
                {client.nome_completo}
              </h3>
              <div className="space-y-1 mt-2">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.telefone}</span>
                </div>
              </div>
              <div className="mt-3">
                <Badge className={`${statusColors[client.status]} border`}>
                  {client.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}