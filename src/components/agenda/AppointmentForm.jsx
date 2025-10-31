import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { X, Save } from "lucide-react";

import { motion } from "framer-motion";



export default function AppointmentForm({ appointment, clientes, onSubmit, onCancel, isLoading }) {

  const [formData, setFormData] = useState(appointment || {

    cliente_id: "",

    cliente_nome: "",

    data_hora: "",

    tipo_tratamento: "",

    profissional: "",

    sala: "",

    duracao_minutos: 60,

    status: "agendado",

    observacoes: ""

  });



  const handleClientChange = (clienteId) => {

    const cliente = clientes.find(c => c.id === clienteId);

    setFormData({

      ...formData,

      cliente_id: clienteId,

      cliente_nome: cliente?.nome_completo || ""

    });

  };



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

          <CardTitle>{appointment ? "Editar Agendamento" : "Novo Agendamento"}</CardTitle>

        </CardHeader>

        <form onSubmit={handleSubmit}>

          <CardContent className="p-6 space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="cliente">Cliente *</Label>

                <Select

                  value={formData.cliente_id}

                  onValueChange={handleClientChange}

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

              <div className="space-y-2">

                <Label htmlFor="data_hora">Data e Hora *</Label>

                <Input

                  id="data_hora"

                  type="datetime-local"

                  value={formData.data_hora}

                  onChange={(e) => setFormData({...formData, data_hora: e.target.value})}

                  required

                  className="border-purple-200"

                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_tratamento">Tipo de Procedimento *</Label>
                <Input
                  id="tipo_tratamento"
                  value={formData.tipo_tratamento}
                  onChange={(e) => setFormData({...formData, tipo_tratamento: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>

              <div className="space-y-2">

                <Label htmlFor="profissional">Profissional</Label>

                <Input

                  id="profissional"

                  value={formData.profissional}

                  onChange={(e) => setFormData({...formData, profissional: e.target.value})}

                  className="border-purple-200"

                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="sala">Sala</Label>

                <Input

                  id="sala"

                  value={formData.sala}

                  onChange={(e) => setFormData({...formData, sala: e.target.value})}

                  className="border-purple-200"

                />

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

                    <SelectItem value="agendado">Agendado</SelectItem>

                    <SelectItem value="confirmado">Confirmado</SelectItem>

                    <SelectItem value="realizado">Realizado</SelectItem>

                    <SelectItem value="cancelado">Cancelado</SelectItem>

                    <SelectItem value="faltou">Faltou</SelectItem>

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