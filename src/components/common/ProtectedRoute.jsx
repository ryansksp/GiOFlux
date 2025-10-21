import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import { hasPermission } from "../../utils/formatters";

export default function ProtectedRoute({ children, requiredRole, message }) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  if (!userProfile || !hasPermission(userProfile, requiredRole)) {
    return (
      <div className="p-4 md:p-8">
        <Card className="max-w-2xl mx-auto mt-12 border-red-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              {message || "Você não tem permissão para acessar esta área."}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>Entre em contato com um administrador para solicitar acesso.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
