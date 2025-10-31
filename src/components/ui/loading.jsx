import React from "react";
import { Skeleton } from "./skeleton";

export const LoadingCard = ({ className = "" }) => (
  <div className={`border-purple-100 rounded-lg p-6 ${className}`}>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const LoadingTable = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const LoadingChart = ({ className = "" }) => (
  <div className={`border-purple-100 rounded-lg p-6 ${className}`}>
    <Skeleton className="h-64 w-full" />
  </div>
);

export const LoadingStats = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);
