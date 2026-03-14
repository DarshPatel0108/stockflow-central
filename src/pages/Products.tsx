import React, { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useInventory";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Plus, Filter, Loader2 } from "lucide-react";

export default function Products() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts(search || undefined, categoryId || undefined);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products in catalog</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Product
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU…"
            className="h-8 w-60 rounded border border-border bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-muted-foreground" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="h-8 rounded border border-border bg-card px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">All Categories</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded border border-border bg-card shadow-card overflow-x-auto">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={20} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Product", "SKU", "Category", "UOM", "Reorder Lvl", "Stock", "Status", "Warehouses"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-2.5"><span className="badge-muted">{p.category}</span></td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.uom}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{p.reorder_level}</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{p.stock}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {p.warehouses.length === 0 ? "—" : p.warehouses.map((w: any) => `${w.warehouse} (${w.qty})`).join(", ")}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
