import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionForm({ transaction, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(transaction || {
    tipo: "receita",
    descricao: "",
    valor: "",
    metodo_pagamento: "dinheiro",
    data_transacao: new Date().toISOString().split('T')[0],
    status: "confirmado",
    categoria: "tratamento"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      valor: parseFloat(formData.valor)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white">
          <CardTitle>{transaction ? "Editar Transação" : "Nova Transação"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  required
                  className="border-purple-200"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo_pagamento">Método de Pagamento *</Label>
                <Select
                  value={formData.metodo_pagamento}
                  onValueChange={(value) => setFormData({...formData, metodo_pagamento: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_transacao">Data *</Label>
                <Input
                  id="data_transacao"
                  type="date"
                  value={formData.data_transacao}
                  onChange={(e) => setFormData({...formData, data_transacao: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({...formData, categoria: value})}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tratamento">Tratamento</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="pacote">Pacote</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
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
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                required
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