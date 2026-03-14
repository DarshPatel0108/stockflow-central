import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "danger" | "success";
  trend?: { value: number; label: string };
}

const variants = {
  default: "border-border",
  warning: "border-warning/30 bg-warning-bg/40",
  danger:  "border-danger/30 bg-danger-bg/40",
  success: "border-success/30 bg-success-bg/40",
};

const iconVariants = {
  default: "bg-primary/10 text-primary",
  warning: "bg-warning-bg text-warning",
  danger:  "bg-danger-bg text-danger",
  success: "bg-success-bg text-success",
};

export default function StatCard({ title, value, subtitle, icon, variant = "default", trend }: StatCardProps) {
  return (
    <div className={cn("rounded border bg-card p-4 shadow-card flex flex-col gap-3", variants[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded", iconVariants[variant])}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span className={trend.value >= 0 ? "text-success" : "text-danger"}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
