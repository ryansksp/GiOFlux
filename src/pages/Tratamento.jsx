import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Calendar, DollarSign, User, FileText } from "lucide-react";
import { databaseService } from "@/services/database";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Tratamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    cliente_id: "",
    tipo_tratamento: "",
    area_tratada: "",
    data_tratamento: "",
    profissional: "",
    valor: "",
    status_pagamento: "pendente",
    sessao_numero: "",
    total_sessoes: "",
    observacoes: "",
    foto_antes: "",
    foto_depois: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // Buscar clientes para o select
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const result = await databaseService.getClients(user?.uid);
      return result.success ? result.data : [];
    },
    initialData: [],
    enabled: !!userProfile,
  });

  // Buscar tratamento existente se for edição
  const { data: tratamento } = useQuery({
    queryKey: ['tratamento', id],
    queryFn: async () => {
      if (!id) return null;
      const result = await databaseService.getTreatments(user?.uid, { id });
      return result.success && result.data.length > 0 ? result.data[0] : null;
    },
    initialData: null,
    enabled: !!userProfile && !!id,
  });

  useEffect(() => {
    if (tratamento) {
      // Função para formatar data para datetime-local input
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          // Formatar para yyyy-MM-ddThh:mm (formato esperado pelo datetime-local)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
          console.warn("Erro ao formatar data:", error);
          return "";
        }
      };

      setFormData({
        cliente_id: tratamento.cliente_id || "",
        tipo_tratamento: tratamento.tipo_tratamento || "",
        area_tratada: tratamento.area_tratada || "",
        data_tratamento: formatDateForInput(tratamento.data_tratamento),
        profissional: tratamento.profissional || "",
        valor: tratamento.valor || "",
        status_pagamento: tratamento.status_pagamento || "pendente",
        sessao_numero: tratamento.sessao_numero || "",
        total_sessoes: tratamento.total_sessoes || "",
        observacoes: tratamento.observacoes || "",
        foto_antes: tratamento.foto_antes || "",
        foto_depois: tratamento.foto_depois || ""
      });
    }
  }, [tratamento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const treatmentData = {
        ...formData,
        userId: user?.uid,
        valor: parseFloat(formData.valor) || 0,
        sessao_numero: parseInt(formData.sessao_numero) || 1,
        total_sessoes: parseInt(formData.total_sessoes) || 1,
        data_tratamento: formData.data_tratamento ? new Date(formData.data_tratamento).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let result;
      if (id) {
        result = await databaseService.updateTreatment(id, treatmentData);
      } else {
        result = await databaseService.createTreatment(treatmentData);
      }

      if (result.success) {
        console.log("Tratamento salvo com sucesso:", result.data);
        console.log("Status de pagamento:", formData.status_pagamento);
        console.log("Tratamento anterior:", tratamento);

        // Se o status foi alterado para "pago" e não havia transação, criar uma
        if (formData.status_pagamento === "pago" && (!tratamento || tratamento.status_pagamento !== "pago")) {
          const clientName = clientes.find(c => c.id === formData.cliente_id)?.nome_completo || "Cliente não encontrado";

          const transactionData = {
            tipo: "receita",
            descricao: `Pagamento - ${formData.tipo_tratamento} - ${clientName}`,
            valor: parseFloat(formData.valor) || 0,
            metodo_pagamento: "dinheiro", // padrão
            data_transacao: formData.data_tratamento ? new Date(formData.data_tratamento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: "confirmado",
            categoria: "tratamento",
            cliente_id: formData.cliente_id,
            userId: user?.uid,
            tratamento_id: id || result.data?.id // ID do tratamento criado
          };

          try {
            const transactionResult = await databaseService.createTransaction(transactionData);
            if (!transactionResult.success) {
              console.error("Erro ao criar transação:", transactionResult.error);
            }
          } catch (transactionError) {
            console.error("Erro inesperado ao criar transação:", transactionError);
          }
        }

        toast.success(id ? "Procedimento atualizado com sucesso!" : "Procedimento criado com sucesso!");
        navigate("/procedimentos");
      } else {
        console.error("Erro ao salvar procedimento:", result.error);
        toast.error("Erro ao salvar procedimento: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao salvar procedimento:", error);
      toast.error("Erro ao salvar procedimento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/procedimentos");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">
            {id ? "Editar Procedimento" : "Novo Procedimento"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Atualize as informações do procedimento" : "Registre um novo procedimento realizado"}
          </p>
        </div>

        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {id ? "Editar Procedimento" : "Novo Procedimento"}
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente_id" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Cliente *
                </Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                  required
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Tratamento e Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_tratamento">Tipo de Procedimento *</Label>
                  <Select
                    value={formData.tipo_tratamento}
                    onValueChange={(value) => setFormData({ ...formData, tipo_tratamento: value })}
                    required
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Depilação a Laser - Face">Depilação a Laser - Face</SelectItem>
                      <SelectItem value="Depilação a Laser - Corpo">Depilação a Laser - Corpo</SelectItem>
                      <SelectItem value="Rejuvenescimento Facial">Rejuvenescimento Facial</SelectItem>
                      <SelectItem value="Tratamento de Manchas">Tratamento de Manchas</SelectItem>
                      <SelectItem value="Peeling">Peeling</SelectItem>
                      <SelectItem value="Bioestimulador de Colágeno">Bioestimulador de Colágeno</SelectItem>
                      <SelectItem value="Harmonização Facial">Harmonização Facial</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area_tratada">Área Tratada</Label>
                  <Input
                    id="area_tratada"
                    value={formData.area_tratada}
                    onChange={(e) => setFormData({ ...formData, area_tratada: e.target.value })}
                    placeholder="Ex: Braços, pernas, rosto..."
                    className="border-purple-200"
                  />
                </div>
              </div>

              {/* Data e Profissional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_tratamento" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data do Procedimento *
                  </Label>
                  <Input
                    id="data_tratamento"
                    type="datetime-local"
                    value={formData.data_tratamento}
                    onChange={(e) => setFormData({ ...formData, data_tratamento: e.target.value })}
                    required
                    className="border-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profissional">Profissional</Label>
                  <Input
                    id="profissional"
                    value={formData.profissional}
                    onChange={(e) => setFormData({ ...formData, profissional: e.target.value })}
                    placeholder="Nome do profissional"
                    className="border-purple-200"
                  />
                </div>
              </div>

              {/* Valor e Status de Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor (R$)
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0.00"
                    className="border-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_pagamento">Status do Pagamento</Label>
                  <Select
                    value={formData.status_pagamento}
                    onValueChange={(value) => setFormData({ ...formData, status_pagamento: value })}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sessões */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessao_numero">Sessão Número</Label>
                  <Input
                    id="sessao_numero"
                    type="number"
                    value={formData.sessao_numero}
                    onChange={(e) => setFormData({ ...formData, sessao_numero: e.target.value })}
                    placeholder="1"
                    className="border-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_sessoes">Total de Sessões</Label>
                  <Input
                    id="total_sessoes"
                    type="number"
                    value={formData.total_sessoes}
                    onChange={(e) => setFormData({ ...formData, total_sessoes: e.target.value })}
                    placeholder="1"
                    className="border-purple-200"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações sobre o procedimento..."
                  className="border-purple-200"
                  rows={3}
                />
              </div>

              {/* Fotos (placeholders para futura implementação) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foto_antes">Foto Antes (URL)</Label>
                  <Input
                    id="foto_antes"
                    value={formData.foto_antes}
                    onChange={(e) => setFormData({ ...formData, foto_antes: e.target.value })}
                    placeholder="URL da foto antes"
                    className="border-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto_depois">Foto Depois (URL)</Label>
                  <Input
                    id="foto_depois"
                    value={formData.foto_depois}
                    onChange={(e) => setFormData({ ...formData, foto_depois: e.target.value })}
                    placeholder="URL da foto depois"
                    className="border-purple-200"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 bg-gray-50">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#823a80] to-[#c43c8b]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
