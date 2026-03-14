import React, { useState } from "react";
import { products as mockProducts, categories } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Plus, Filter } from "lucide-react";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{mockProducts.length} products in catalog</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU…"
            className="h-8 w-60 rounded border border-border bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-muted-foreground" />
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="h-8 rounded border border-border bg-card px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option>All</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">SKU</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">UOM</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Reorder Lvl</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Warehouses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-4 py-2.5 font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-2.5"><span className="badge-muted">{p.category}</span></td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.uom}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{p.reorderLevel}</td>
                <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{p.stock}</td>
                <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {p.warehouses.length === 0 ? "—" : p.warehouses.map((w) => `${w.warehouse} (${w.qty})`).join(", ")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
