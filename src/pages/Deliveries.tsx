import React, { useState } from "react";
import { useDeliveries } from "@/hooks/useInventory";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, Search, Loader2 } from "lucide-react";

const statusOptions = ["All", "draft", "waiting", "ready", "done", "cancelled"];

export default function Deliveries() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const { data: deliveries = [], isLoading } = useDeliveries(search || undefined, status);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Delivery Orders</h1>
          <p className="text-sm text-muted-foreground">Outgoing stock to customers</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Delivery
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ref or customer…"
            className="h-8 w-56 rounded border border-border bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusOptions.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`h-7 px-2.5 rounded text-xs font-medium capitalize transition-colors ${status === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded border border-border bg-card shadow-card overflow-x-auto">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-primary" size={20} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Reference", "Customer", "Warehouse", "Date", "Items", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deliveries.map((d: any) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{d.ref}</td>
                  <td className="px-4 py-2.5 font-medium">{d.customer}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d.warehouse}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-2.5 tabular-nums">{d.items}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
              {deliveries.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No deliveries found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
