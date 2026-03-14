import React, { useState } from "react";
import { receipts } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, Search } from "lucide-react";
import type { DocStatus } from "@/lib/mockData";

const statusOptions: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "Draft", value: "draft" },
  { label: "Waiting", value: "waiting" },
  { label: "Ready", value: "ready" },
  { label: "Done", value: "done" },
  { label: "Cancelled", value: "cancelled" },
];

export default function Receipts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = receipts.filter((r) => {
    const matchSearch = r.ref.toLowerCase().includes(search.toLowerCase()) || r.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || r.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Receipts</h1>
          <p className="text-sm text-muted-foreground">Incoming stock from suppliers</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Receipt
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ref or supplier…"
            className="h-8 w-56 rounded border border-border bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-1">
          {statusOptions.map((s) => (
            <button key={s.value} onClick={() => setStatus(s.value)}
              className={`h-7 px-2.5 rounded text-xs font-medium transition-colors ${status === s.value ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Reference", "Supplier", "Warehouse", "Date", "Items", "Total (USD)", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-4 py-2.5 font-mono text-xs text-primary">{r.ref}</td>
                <td className="px-4 py-2.5 font-medium">{r.supplier}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.warehouse}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-2.5 tabular-nums">{r.items}</td>
                <td className="px-4 py-2.5 font-semibold tabular-nums">${r.total.toLocaleString()}</td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status as DocStatus} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No receipts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
