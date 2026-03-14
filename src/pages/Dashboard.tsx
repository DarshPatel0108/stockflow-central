import React from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDashboardStats, useWarehouseDistribution } from "@/hooks/useInventory";
import { stockTrend } from "@/lib/mockData";
import {
  Package, AlertTriangle, XCircle, ClipboardList, Truck,
  ArrowLeftRight, TrendingUp, Loader2
} from "lucide-react";

const COLORS = ["hsl(243,75%,59%)", "hsl(160,84%,39%)", "hsl(38,92%,50%)"];

const typeChip: Record<string, string> = {
  receipt:    "badge-success",
  delivery:   "badge-danger",
  transfer:   "badge-primary",
  adjustment: "badge-warning",
};
const typeLabel: Record<string, string> = {
  receipt: "Receipt", delivery: "Delivery", transfer: "Transfer", adjustment: "Adjustment"
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: wdist = [] } = useWarehouseDistribution();

  if (statsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Inventory overview · December 2024</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard title="Total Products"      value={stats?.totalProducts ?? 0}     icon={<Package size={16} />} trend={{ value: 5, label: "vs last month" }} />
        <StatCard title="Low Stock"           value={stats?.lowStock ?? 0}          icon={<AlertTriangle size={16} />} variant="warning" />
        <StatCard title="Out of Stock"        value={stats?.outOfStock ?? 0}        icon={<XCircle size={16} />} variant="danger" />
        <StatCard title="Pending Receipts"    value={stats?.pendingReceipts ?? 0}   icon={<ClipboardList size={16} />} />
        <StatCard title="Pending Deliveries"  value={stats?.pendingDeliveries ?? 0} icon={<Truck size={16} />} />
        <StatCard title="Scheduled Transfers" value={stats?.scheduledTransfers ?? 0} icon={<ArrowLeftRight size={16} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <Tooltip contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(214,32%,91%)", borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="receipts"    name="Receipts"    stroke="hsl(243,75%,59%)" fill="url(#recv)" strokeWidth={2} />
              <Area type="monotone" dataKey="deliveries"  name="Deliveries"  stroke="hsl(160,84%,39%)" fill="url(#delv)" strokeWidth={2} />
              <Area type="monotone" dataKey="adjustments" name="Adjustments" stroke="hsl(38,92%,50%)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-semibold mb-1">Warehouse Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">By quantity on hand</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={wdist} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {wdist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(214,32%,91%)", borderRadius: 6, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {wdist.map((w, i) => (
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

      {/* Recent movements */}
      <div className="rounded border border-border bg-card shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Movements</h2>
        </div>
        <div className="divide-y divide-border">
          {(stats?.recentLedger ?? []).map((entry: any) => (
            <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.product}</p>
                <p className="text-xs text-muted-foreground">{entry.ref} · {entry.warehouse}</p>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className={typeChip[entry.type] ?? "badge-muted"}>{typeLabel[entry.type] ?? entry.type}</span>
                <span className={`text-sm font-semibold tabular-nums ${entry.change > 0 ? "text-success" : "text-danger"}`}>
                  {entry.change > 0 ? "+" : ""}{entry.change}
                </span>
              </div>
            </div>
          ))}
          {(stats?.recentLedger ?? []).length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No movements yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
