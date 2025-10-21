import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserBadge() {
  const { userProfile, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!userProfile) return null;

  const roleConfig = {
    admin: {
      label: "Administrador",
      icon: Shield,
      className: "bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white border-none"
    },
    gerente: {
      label: "Gerente",
      icon: Star,
      className: "bg-purple-100 text-purple-800 border-purple-200"
    },
    consultora: {
      label: "Consultora",
      icon: User,
      className: "bg-pink-100 text-pink-800 border-pink-200"
    }
  };

  const config = roleConfig[userProfile.role] || roleConfig.consultora;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${config.className} border flex items-center gap-1.5 px-3 py-1`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="font-medium">{config.label}</span>
      </Badge>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
        className="h-6 w-6 p-0 hover:bg-gray-100"
        title="Atualizar perfil"
      >
        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
