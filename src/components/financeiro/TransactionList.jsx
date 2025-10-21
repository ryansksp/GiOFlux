import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "../../utils/formatters";

export default function TransactionList({ transacoes, loading, onEdit }) {
  const statusColors = {
    pendente: "bg-yellow-100 text-yellow-800",
    confirmado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800"
  };

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.slice(0, 10).map((transacao) => (
                <TableRow key={transacao.id} className="hover:bg-purple-50 transition-colors">
                  <TableCell>
                    {format(new Date(transacao.data_transacao), "dd MMM yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{transacao.descricao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transacao.tipo === 'receita' ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="capitalize">{transacao.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`font-semibold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transacao.valor)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[transacao.status]}>
                      {transacao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(transacao)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
