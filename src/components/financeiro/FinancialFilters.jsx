import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancialFilters({
  periodoSelecionado,
  onPeriodoChange,
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange
}) {
  const opcoesPeriodo = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: 'personalizado', label: 'Personalizado' }
  ];

  const handlePeriodoClick = (periodo) => {
    onPeriodoChange(periodo);
  };

  return (
    <Card className="border-purple-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-700">Período:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {opcoesPeriodo.map((opcao) => (
              <Button
                key={opcao.value}
                variant={periodoSelecionado === opcao.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodoClick(opcao.value)}
                className={periodoSelecionado === opcao.value ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {opcao.label}
              </Button>
            ))}
          </div>

          {periodoSelecionado === 'personalizado' && (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="data-inicio" className="text-sm">De:</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio ? format(dataInicio, 'yyyy-MM-dd') : ''}
                  onChange={(e) => onDataInicioChange(e.target.value ? new Date(e.target.value) : null)}
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="data-fim" className="text-sm">Até:</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim ? format(dataFim, 'yyyy-MM-dd') : ''}
                  onChange={(e) => onDataFimChange(e.target.value ? new Date(e.target.value) : null)}
                  className="w-32"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
