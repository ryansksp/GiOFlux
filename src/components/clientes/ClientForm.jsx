import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientForm({ client, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(client || {
    nome_completo: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    cpf: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    tipo_pele: "",
    observacoes: "",
    status: "lead",
    origem: "site"
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
          <CardTitle>{client ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_pele">Tipo de Pele</Label>
                <Select
                  value={formData.tipo_pele}
                  onValueChange={(value) => setFormData({...formData, tipo_pele: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Tipo I", "Tipo II", "Tipo III", "Tipo IV", "Tipo V", "Tipo VI"].map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Select
                  value={formData.origem}
                  onValueChange={(value) => setFormData({...formData, origem: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="border-purple-200"
                rows={3}
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