import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function CampaignForm({ campaign, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(campaign || {
    nome: "",
    tipo: "email",
    segmento: "todos",
    mensagem: "",
    data_envio: "",
    status: "rascunho"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white">
          <CardTitle>{campaign ? "Editar Campanha" : "Nova Campanha"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Campanha *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="segmento">Segmento *</Label>
                <Select
                  value={formData.segmento}
                  onValueChange={(value) => setFormData({...formData, segmento: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="novos_clientes">Novos Clientes</SelectItem>
                    <SelectItem value="clientes_ativos">Clientes Ativos</SelectItem>
                    <SelectItem value="clientes_inativos">Clientes Inativos</SelectItem>
                    <SelectItem value="aniversariantes">Aniversariantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_envio">Data de Envio</Label>
                <Input
                  id="data_envio"
                  type="date"
                  value={formData.data_envio}
                  onChange={(e) => setFormData({...formData, data_envio: e.target.value})}
                  className="border-purple-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem *</Label>
              <Textarea
                id="mensagem"
                value={formData.mensagem}
                onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                required
                className="border-purple-200"
                rows={6}
                placeholder="Digite sua mensagem aqui..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-gray-50">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-[#823a80] to-[#c43c8b]"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}