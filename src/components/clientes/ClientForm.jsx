import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { X, Save, MapPin } from "lucide-react";

import { motion } from "framer-motion";



export default function ClientForm({ client, onSubmit, onCancel, isLoading }) {

  const [formData, setFormData] = useState(client ? {

    nome_completo: client.nome_completo || "",

    email: client.email || "",

    telefone: client.telefone || "",

    data_nascimento: client.data_nascimento || "",

    cpf: client.cpf || "",

    endereco: client.endereco || "",

    numero: client.numero || "",

    cidade: client.cidade || "",

    estado: client.estado || "",

    cep: client.cep || "",

    tipo_pele: client.tipo_pele || "",

    observacoes: client.observacoes || "",

    status: client.status || "lead",

    origem: client.origem || "site"

  } : {

    nome_completo: "",

    email: "",

    telefone: "",

    data_nascimento: "",

    cpf: "",

    endereco: "",

    numero: "",

    cidade: "",

    estado: "",

    cep: "",

    tipo_pele: "",

    observacoes: "",

    status: "lead",

    origem: "site"

  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleCepChange = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');

    setFormData(prev => ({ ...prev, cep: cleanCep }));
    setCepError('');

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado. Verifique se o CEP está correto.');
        } else {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao consultar CEP. Tente novamente.');
      } finally {
        setIsLoadingCep(false);
      }
    } else if (cleanCep.length > 8) {
      setCepError('CEP deve ter exatamente 8 dígitos.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário enviado com dados:', formData);
    onSubmit(formData);
  };



  return (

    <motion.div

      initial={{ opacity: 0, y: -20 }}

      animate={{ opacity: 1, y: 0 }}

      exit={{ opacity: 0, y: -20 }}

      className="bg-white rounded-lg shadow-lg"

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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className={`border-purple-200 pr-10 ${cepError ? 'border-red-500' : ''}`}
                    placeholder="00000-000"
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                  {!isLoadingCep && formData.cep && !cepError && (
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  )}
                </div>
                {cepError && (
                  <p className="text-sm text-red-600 mt-1">{cepError}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  className="border-purple-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="border-purple-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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