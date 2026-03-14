import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  products, receipts, deliveries, transfers,
  stockTrend, warehouseDistribution, ledger
} from "@/lib/mockData";
import {
  Package, AlertTriangle, XCircle, ClipboardList, Truck,
  ArrowLeftRight, TrendingUp
} from "lucide-react";

const COLORS = ["hsl(243,75%,59%)", "hsl(160,84%,39%)", "hsl(38,92%,50%)"];

const typeIcon = {
  receipt:    <span className="badge-success">Receipt</span>,
  delivery:   <span className="badge-danger">Delivery</span>,
  transfer:   <span className="badge-primary">Transfer</span>,
  adjustment: <span className="badge-warning">Adjustment</span>,
};

export default function Dashboard() {
  const totalProducts   = products.length;
  const lowStock        = products.filter((p) => p.status === "low_stock").length;
  const outOfStock      = products.filter((p) => p.status === "out_of_stock").length;
  const pendingReceipts = receipts.filter((r) => ["waiting", "ready"].includes(r.status)).length;
  const pendingDeliveries = deliveries.filter((d) => ["waiting", "ready"].includes(d.status)).length;
  const scheduledTransfers = transfers.filter((t) => t.status !== "done" && t.status !== "cancelled").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Inventory overview · December 2024</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard title="Total Products"        value={totalProducts}   icon={<Package size={16} />} trend={{ value: 5, label: "vs last month" }} />
        <StatCard title="Low Stock"             value={lowStock}        icon={<AlertTriangle size={16} />} variant="warning" />
        <StatCard title="Out of Stock"          value={outOfStock}      icon={<XCircle size={16} />} variant="danger" />
        <StatCard title="Pending Receipts"      value={pendingReceipts} icon={<ClipboardList size={16} />} />
        <StatCard title="Pending Deliveries"    value={pendingDeliveries} icon={<Truck size={16} />} />
        <StatCard title="Scheduled Transfers"   value={scheduledTransfers} icon={<ArrowLeftRight size={16} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock movement area chart */}
        <div className="lg:col-span-2 rounded border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Stock Movements</h2>
              <p className="text-xs text-muted-foreground">Jul – Dec 2024</p>
            </div>
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stockTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="recv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(243,75%,59%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(243,75%,59%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="delv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160,84%,39%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215,16%,47%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,16%,47%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(214,32%,91%)", borderRadius: 6, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="receipts"    name="Receipts"    stroke="hsl(243,75%,59%)" fill="url(#recv)" strokeWidth={2} />
              <Area type="monotone" dataKey="deliveries"  name="Deliveries"  stroke="hsl(160,84%,39%)" fill="url(#delv)" strokeWidth={2} />
              <Area type="monotone" dataKey="adjustments" name="Adjustments" stroke="hsl(38,92%,50%)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouse distribution pie */}
        <div className="rounded border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-semibold mb-1">Warehouse Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">By quantity on hand</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={warehouseDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {warehouseDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(214,32%,91%)", borderRadius: 6, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {warehouseDistribution.map((w, i) => (
              <div key={w.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{w.name}</span>
                </div>
                <span className="font-medium">{w.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Low stock alerts */}
        <div className="rounded border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Low Stock Alerts</h2>
            <span className="badge-warning">{lowStock + outOfStock} items</span>
          </div>
          <div className="divide-y divide-border">
            {products.filter((p) => p.status !== "in_stock").map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku} · Reorder at {p.reorderLevel} {p.uom}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.status} />
                  <p className="text-xs text-muted-foreground mt-0.5">{p.stock} {p.uom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent movements */}
        <div className="rounded border border-border bg-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Movements</h2>
          </div>
          <div className="divide-y divide-border">
            {ledger.slice(0, 6).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.product}</p>
                  <p className="text-xs text-muted-foreground">{entry.ref} · {entry.warehouse}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  {typeIcon[entry.type]}
                  <span className={`text-sm font-semibold tabular-nums ${entry.change > 0 ? "text-success" : "text-danger"}`}>
                    {entry.change > 0 ? "+" : ""}{entry.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
