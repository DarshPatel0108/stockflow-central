import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ─── Products with stock ───────────────────────────────────────────────────
export function useProducts(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ["products", search, categoryId],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select(`
          id, name, sku, uom, reorder_level, created_at, updated_at,
          categories ( id, name ),
          stock ( quantity, warehouse_id, warehouses ( name ) )
        `)
        .order("name");

      if (search) q = q.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
      if (categoryId) q = q.eq("category_id", categoryId);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).map((p: any) => {
        const totalStock = (p.stock ?? []).reduce((s: number, r: any) => s + (r.quantity ?? 0), 0);
        let status: "in_stock" | "low_stock" | "out_of_stock" =
          totalStock === 0 ? "out_of_stock" :
          totalStock < p.reorder_level ? "low_stock" : "in_stock";
        return {
          ...p,
          category: p.categories?.name ?? "—",
          category_id: p.categories?.id,
          stock: totalStock,
          status,
          warehouses: (p.stock ?? []).map((s: any) => ({
            warehouse: s.warehouses?.name ?? "Unknown",
            qty: s.quantity,
          })),
        };
      });
    },
  });
}

// ─── Categories ────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

// ─── Warehouses with stock totals ─────────────────────────────────────────
export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouses")
        .select(`id, name, code, address, stock ( quantity, product_id )`)
        .order("name");
      if (error) throw error;
      return (data ?? []).map((w: any) => ({
        ...w,
        totalItems: new Set((w.stock ?? []).map((s: any) => s.product_id)).size,
        totalQty:   (w.stock ?? []).reduce((s: number, r: any) => s + (r.quantity ?? 0), 0),
      }));
    },
  });
}

// ─── Receipts ──────────────────────────────────────────────────────────────
export function useReceipts(search?: string, status?: string) {
  return useQuery({
    queryKey: ["receipts", search, status],
    queryFn: async () => {
      let q = supabase
        .from("receipts")
        .select(`
          id, ref, supplier, status, receipt_date, notes,
          warehouses ( name ),
          receipt_items ( id, quantity, unit_cost )
        `)
        .order("receipt_date", { ascending: false });

      if (search) q = q.or(`ref.ilike.%${search}%,supplier.ilike.%${search}%`);
      if (status && status !== "All") q = q.eq("status", status);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).map((r: any) => ({
        ...r,
        warehouse: r.warehouses?.name ?? "—",
        items: (r.receipt_items ?? []).length,
        total: (r.receipt_items ?? []).reduce(
          (s: number, i: any) => s + (i.quantity ?? 0) * (i.unit_cost ?? 0), 0
        ),
        date: r.receipt_date,
      }));
    },
  });
}

// ─── Deliveries ────────────────────────────────────────────────────────────
export function useDeliveries(search?: string, status?: string) {
  return useQuery({
    queryKey: ["deliveries", search, status],
    queryFn: async () => {
      let q = supabase
        .from("deliveries")
        .select(`
          id, ref, customer, status, delivery_date, notes,
          warehouses ( name ),
          delivery_items ( id )
        `)
        .order("delivery_date", { ascending: false });

      if (search) q = q.or(`ref.ilike.%${search}%,customer.ilike.%${search}%`);
      if (status && status !== "All") q = q.eq("status", status);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).map((d: any) => ({
        ...d,
        warehouse: d.warehouses?.name ?? "—",
        items: (d.delivery_items ?? []).length,
        date: d.delivery_date,
      }));
    },
  });
}

// ─── Transfers ─────────────────────────────────────────────────────────────
export function useTransfers(search?: string, status?: string) {
  return useQuery({
    queryKey: ["transfers", search, status],
    queryFn: async () => {
      let q = supabase
        .from("transfers")
        .select(`
          id, ref, status, transfer_date, notes,
          from_warehouse:warehouses!transfers_from_warehouse_id_fkey ( name ),
          to_warehouse:warehouses!transfers_to_warehouse_id_fkey ( name ),
          transfer_items ( id )
        `)
        .order("transfer_date", { ascending: false });

      if (status && status !== "All") q = q.eq("status", status);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).filter((t: any) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return t.ref?.toLowerCase().includes(s) ||
          t.from_warehouse?.name?.toLowerCase().includes(s) ||
          t.to_warehouse?.name?.toLowerCase().includes(s);
      }).map((t: any) => ({
        ...t,
        from: t.from_warehouse?.name ?? "—",
        to:   t.to_warehouse?.name ?? "—",
        items: (t.transfer_items ?? []).length,
        date: t.transfer_date,
      }));
    },
  });
}

// ─── Adjustments ───────────────────────────────────────────────────────────
export function useAdjustments(search?: string, status?: string) {
  return useQuery({
    queryKey: ["adjustments", search, status],
    queryFn: async () => {
      let q = supabase
        .from("adjustments")
        .select(`
          id, ref, status, adj_date, recorded_qty, counted_qty, difference, notes,
          products ( name, sku ),
          warehouses ( name )
        `)
        .order("adj_date", { ascending: false });

      if (status && status !== "All") q = q.eq("status", status);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).filter((a: any) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return a.ref?.toLowerCase().includes(s) ||
          a.products?.name?.toLowerCase().includes(s);
      }).map((a: any) => ({
        ...a,
        product:  a.products?.name ?? "—",
        warehouse: a.warehouses?.name ?? "—",
        recorded: a.recorded_qty,
        counted:  a.counted_qty,
        diff:     a.difference,
        date:     a.adj_date,
      }));
    },
  });
}

// ─── Stock Ledger ──────────────────────────────────────────────────────────
export function useLedger(search?: string, type?: string) {
  return useQuery({
    queryKey: ["ledger", search, type],
    queryFn: async () => {
      let q = supabase
        .from("stock_ledger")
        .select(`
          id, movement_type, quantity_change, balance_after, reference_ref, created_at, notes,
          products ( name, sku ),
          warehouses ( name )
        `)
        .order("created_at", { ascending: false })
        .limit(200);

      if (type && type !== "All") q = q.eq("movement_type", type);

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).filter((l: any) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return l.products?.name?.toLowerCase().includes(s) ||
          l.products?.sku?.toLowerCase().includes(s) ||
          l.reference_ref?.toLowerCase().includes(s);
      }).map((l: any) => ({
        ...l,
        product:   l.products?.name ?? "—",
        sku:       l.products?.sku ?? "—",
        warehouse: l.warehouses?.name ?? "—",
        type:      l.movement_type,
        change:    l.quantity_change,
        balance:   l.balance_after,
        ref:       l.reference_ref ?? "—",
        date:      l.created_at?.split("T")[0] ?? "—",
      }));
    },
  });
}

// ─── Dashboard KPIs ────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [productsRes, stockRes, receiptsRes, deliveriesRes, transfersRes, ledgerRes] =
        await Promise.all([
          supabase.from("products").select("id, reorder_level"),
          supabase.from("stock").select("product_id, quantity"),
          supabase.from("receipts").select("id, status"),
          supabase.from("deliveries").select("id, status"),
          supabase.from("transfers").select("id, status"),
          supabase.from("stock_ledger")
            .select("id, movement_type, quantity_change, balance_after, reference_ref, created_at, products(name,sku), warehouses(name)")
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

      const products = productsRes.data ?? [];
      const stockRows = stockRes.data ?? [];
      const receipts = receiptsRes.data ?? [];
      const deliveries = deliveriesRes.data ?? [];
      const transfers = transfersRes.data ?? [];
      const ledger = (ledgerRes.data ?? []).map((l: any) => ({
        ...l, product: l.products?.name ?? "—", sku: l.products?.sku ?? "—",
        warehouse: l.warehouses?.name ?? "—", type: l.movement_type,
        change: l.quantity_change, balance: l.balance_after, ref: l.reference_ref ?? "—",
        date: l.created_at?.split("T")[0] ?? "—",
      }));

      // Per-product totals
      const stockByProduct: Record<string, number> = {};
      for (const s of stockRows) {
        stockByProduct[s.product_id] = (stockByProduct[s.product_id] ?? 0) + s.quantity;
      }

      let inStock = 0, lowStock = 0, outOfStock = 0;
      for (const p of products) {
        const qty = stockByProduct[p.id] ?? 0;
        if (qty === 0) outOfStock++;
        else if (qty < p.reorder_level) lowStock++;
        else inStock++;
      }

      return {
        totalProducts: products.length,
        lowStock,
        outOfStock,
        pendingReceipts: receipts.filter((r) => ["waiting","ready"].includes(r.status)).length,
        pendingDeliveries: deliveries.filter((d) => ["waiting","ready"].includes(d.status)).length,
        scheduledTransfers: transfers.filter((t) => !["done","cancelled"].includes(t.status)).length,
        recentLedger: ledger,
      };
    },
  });
}

// ─── Warehouse distribution (for pie chart) ───────────────────────────────
export function useWarehouseDistribution() {
  return useQuery({
    queryKey: ["warehouse-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouses")
        .select("name, stock ( quantity )");
      if (error) throw error;
      return (data ?? []).map((w: any) => ({
        name:  w.name,
        value: (w.stock ?? []).reduce((s: number, r: any) => s + (r.quantity ?? 0), 0),
      }));
    },
  });
}
