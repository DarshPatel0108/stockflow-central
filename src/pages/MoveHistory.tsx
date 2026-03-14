import React, { useState } from "react";
import { ledger } from "@/lib/mockData";
import { Search, Filter } from "lucide-react";

const typeConfig = {
  receipt:    { label: "Receipt",    cls: "badge-success" },
  delivery:   { label: "Delivery",   cls: "badge-danger" },
  transfer:   { label: "Transfer",   cls: "badge-primary" },
  adjustment: { label: "Adjustment", cls: "badge-warning" },
};

const typeOptions = ["All", "receipt", "delivery", "transfer", "adjustment"];

export default function MoveHistory() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filtered = ledger.filter((l) => {
    const matchSearch = l.product.toLowerCase().includes(search.toLowerCase()) || l.sku.toLowerCase().includes(search.toLowerCase()) || l.ref.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (type === "All" || l.type === type);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold">Move History</h1>
        <p className="text-sm text-muted-foreground">Complete stock ledger — all movements logged</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product, SKU or ref…"
            className="h-8 w-60 rounded border border-border bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {typeOptions.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`h-7 px-2.5 rounded text-xs font-medium capitalize transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Date", "Product", "SKU", "Warehouse", "Type", "Change", "Balance", "Reference"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((l) => {
              const t = typeConfig[l.type];
              return (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-muted-foreground">{l.date}</td>
                  <td className="px-4 py-2.5 font-medium">{l.product}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{l.sku}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{l.warehouse}</td>
                  <td className="px-4 py-2.5"><span className={t.cls}>{t.label}</span></td>
                  <td className="px-4 py-2.5">
                    <span className={`font-semibold tabular-nums ${l.change > 0 ? "text-success" : "text-danger"}`}>
                      {l.change > 0 ? "+" : ""}{l.change}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums">{l.balance}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{l.ref}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No entries found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
