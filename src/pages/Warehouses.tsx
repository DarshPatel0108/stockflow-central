import React from "react";
import { warehouses } from "@/lib/mockData";
import { Plus, MapPin, Boxes } from "lucide-react";

export default function Warehouses() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Warehouses</h1>
          <p className="text-sm text-muted-foreground">{warehouses.length} locations configured</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {warehouses.map((w) => (
          <div key={w.id} className="rounded border border-border bg-card shadow-card p-4 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{w.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">{w.code}</span>
              </div>
              <span className={`badge-${w.totalQty > 0 ? "success" : "muted"}`}>
                {w.totalQty > 0 ? "Active" : "Empty"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <MapPin size={11} />
              {w.address}
            </div>
            <div className="flex gap-4 pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="font-semibold">{w.totalItems}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Qty</p>
                <p className="font-semibold">{w.totalQty.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
