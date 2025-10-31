import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatters";

export default function StatCard({ title, value, icon: Icon, gradient, loading, trend, isCurrency = false }) {
  if (loading) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-6">
          <div className="text-sm text-gray-500">Carregando...</div>
          <Skeleton className="h-20 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  const displayValue = isCurrency ? formatCurrency(value) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-purple-100 hover:shadow-lg transition-all duration-300 overflow-hidden relative group ${gradient ? `bg-gradient-to-br from-blue-500 to-blue-600` : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUp className="w-4 h-4" />
                {trend}
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
