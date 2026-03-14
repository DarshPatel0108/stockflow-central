import React from "react";
import { cn } from "@/lib/utils";

type Status = "draft" | "waiting" | "ready" | "done" | "cancelled" | "in_stock" | "low_stock" | "out_of_stock";

const config: Record<Status, { label: string; cls: string }> = {
  draft:        { label: "Draft",        cls: "badge-muted" },
  waiting:      { label: "Waiting",      cls: "badge-warning" },
  ready:        { label: "Ready",        cls: "badge-primary" },
  done:         { label: "Done",         cls: "badge-success" },
  cancelled:    { label: "Cancelled",    cls: "badge-danger" },
  in_stock:     { label: "In Stock",     cls: "badge-success" },
  low_stock:    { label: "Low Stock",    cls: "badge-warning" },
  out_of_stock: { label: "Out of Stock", cls: "badge-danger" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const c = config[status] ?? { label: status, cls: "badge-muted" };
  return <span className={cn(c.cls, className)}>{c.label}</span>;
}
