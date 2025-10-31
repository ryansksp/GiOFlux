import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { X, Save, AlertTriangle, Trash2 } from "lucide-react";

import { motion } from "framer-motion";

import { databaseService } from "@/services/database";

import { useAuth } from "../../contexts/AuthContext";



export default function AppointmentForm({ appointment, clientes, onSubmit, onCancel, onDelete, isLoading }) {

  const { user } = useAuth();

  const [formData, setFormData] = useState(() => {
    if (appointment) {
      // Format date for datetime-local input (remove timezone and seconds)
      const formattedAppointment = { ...appointment };
      if (appointment.data_hora) {
        // Convert to local datetime format for input (yyyy-MM-ddThh:mm)
        const date = new Date(appointment.data_hora);
        // Format as local date string without timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedAppointment.data_hora = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      return formattedAppointment;
    }

    return {
      cliente_id: "",
      cliente_nome: "",
      data_hora: "",
      servico: "",
      duracao_minutos: 60,
      valor: "",
      status: "agendado",
      observacoes: ""
    };
  });

  const [conflictAlert, setConflictAlert] = useState(null);

  const [isCheckingConflict, setIsCheckingConflict] = useState(false);



  const handleClientChange = (clienteId) => {

    const cliente = clientes.find(c => c.id === clienteId);

    setFormData({

      ...formData,

      cliente_id: clienteId,

      cliente_nome: cliente?.nome_completo || ""

    });

  };



  // Check for conflicts when date/time or duration changes

  useEffect(() => {

    const checkConflict = async () => {

      if (!formData.data_hora || !formData.duracao_minutos || !user?.uid) {

        setConflictAlert(null);

        return;

      }



      setIsCheckingConflict(true);

      try {

        const result = await databaseService.checkAppointmentConflict(

          user.uid,

          formData.data_hora,

          formData.duracao_minutos,

          appointment?.id // Exclude current appointment when editing

        );



        if (result.success && result.hasConflict) {

          setConflictAlert({

            type: 'warning',

            message: 'Há um conflito de horário com outro agendamento. Verifique a disponibilidade.'

          });

        } else {

          setConflictAlert(null);

        }

      } catch (error) {

        console.error('Erro ao verificar conflito:', error);

        setConflictAlert({

          type: 'error',

          message: 'Erro ao verificar disponibilidade de horário.'

        });

      } finally {

        setIsCheckingConflict(false);

      }

    };



    const debounceTimer = setTimeout(checkConflict, 500); // Debounce for better UX

    return () => clearTimeout(debounceTimer);

  }, [formData.data_hora, formData.duracao_minutos, user?.uid, appointment?.id]);



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
                <Label htmlFor="servico">Tipo de Procedimento *</Label>
                <Input
                  id="servico"
                  value={formData.servico}
                  onChange={(e) => setFormData({...formData, servico: e.target.value})}
                  required
                  className="border-purple-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao_minutos">Duração (minutos) *</Label>
                <Input
                  id="duracao_minutos"
                  type="number"
                  value={formData.duracao_minutos}
                  onChange={(e) => setFormData({...formData, duracao_minutos: parseInt(e.target.value) || 60})}
                  required
                  min="15"
                  max="480"
                  className="border-purple-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || ""})}
                  className="border-purple-200"
                  placeholder="0.00"
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

            {conflictAlert && (
              <Alert className={conflictAlert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={conflictAlert.type === 'warning' ? 'text-yellow-800' : 'text-red-800'}>
                  {conflictAlert.message}
                </AlertDescription>
              </Alert>
            )}

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

          <CardFooter className="flex justify-between items-center bg-gray-50">

            <div>

              {appointment && onDelete && (

                <Button

                  type="button"

                  variant="destructive"

                  onClick={() => onDelete(appointment.id)}

                  disabled={isLoading}

                  className="bg-red-600 hover:bg-red-700"

                >

                  <Trash2 className="w-4 h-4 mr-2" />

                  Excluir

                </Button>

              )}

            </div>

            <div className="flex gap-3">

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

            </div>

          </CardFooter>

        </form>

      </Card>

    </motion.div>

  );

}