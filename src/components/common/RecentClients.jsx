import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function RecentClients({ clientes, loading }) {
  const recentClientes = clientes.slice(0, 5);

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg">Clientes Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentClientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <Avatar className="border-2 border-purple-200">
                  <AvatarFallback className="bg-gradient-to-br from-[#823a80] to-[#c43c8b] text-white">
                    {cliente.nome_completo?.charAt(0) || <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{cliente.nome_completo}</p>
                  <p className="text-xs text-gray-500 truncate">{cliente.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}