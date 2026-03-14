
-- ==========================================
-- StockFlow Full Database Schema
-- ==========================================

-- 1. Update-timestamp helper function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==========================================
-- 2. ENUMS
-- ==========================================
CREATE TYPE public.doc_status AS ENUM ('draft','waiting','ready','done','cancelled');
CREATE TYPE public.stock_status AS ENUM ('in_stock','low_stock','out_of_stock');
CREATE TYPE public.movement_type AS ENUM ('receipt','delivery','transfer','adjustment');

-- ==========================================
-- 3. CATEGORIES
-- ==========================================
CREATE TABLE public.categories (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_insert" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "categories_delete" ON public.categories FOR DELETE USING (true);

-- ==========================================
-- 4. WAREHOUSES
-- ==========================================
CREATE TABLE public.warehouses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  code       TEXT NOT NULL UNIQUE,
  address    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "warehouses_select" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "warehouses_insert" ON public.warehouses FOR INSERT WITH CHECK (true);
CREATE POLICY "warehouses_update" ON public.warehouses FOR UPDATE USING (true);
CREATE POLICY "warehouses_delete" ON public.warehouses FOR DELETE USING (true);
CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 5. PRODUCTS
-- ==========================================
CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  sku           TEXT NOT NULL UNIQUE,
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  uom           TEXT NOT NULL DEFAULT 'pcs',
  reorder_level INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_delete" ON public.products FOR DELETE USING (true);
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 6. STOCK (per product+warehouse)
-- ==========================================
CREATE TABLE public.stock (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  quantity     INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, warehouse_id)
);
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_select" ON public.stock FOR SELECT USING (true);
CREATE POLICY "stock_insert" ON public.stock FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_update" ON public.stock FOR UPDATE USING (true);
CREATE POLICY "stock_delete" ON public.stock FOR DELETE USING (true);
CREATE TRIGGER update_stock_updated_at
  BEFORE UPDATE ON public.stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 7. RECEIPTS (incoming from suppliers)
-- ==========================================
CREATE TABLE public.receipts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref          TEXT NOT NULL UNIQUE,
  supplier     TEXT NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  status       public.doc_status NOT NULL DEFAULT 'draft',
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "receipts_select" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "receipts_insert" ON public.receipts FOR INSERT WITH CHECK (true);
CREATE POLICY "receipts_update" ON public.receipts FOR UPDATE USING (true);
CREATE POLICY "receipts_delete" ON public.receipts FOR DELETE USING (true);
CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.receipt_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id   UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES public.products(id),
  quantity     INTEGER NOT NULL DEFAULT 0,
  unit_cost    NUMERIC(12,2),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.receipt_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "receipt_items_select" ON public.receipt_items FOR SELECT USING (true);
CREATE POLICY "receipt_items_insert" ON public.receipt_items FOR INSERT WITH CHECK (true);
CREATE POLICY "receipt_items_update" ON public.receipt_items FOR UPDATE USING (true);
CREATE POLICY "receipt_items_delete" ON public.receipt_items FOR DELETE USING (true);

-- ==========================================
-- 8. DELIVERIES (outgoing to customers)
-- ==========================================
CREATE TABLE public.deliveries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref           TEXT NOT NULL UNIQUE,
  customer      TEXT NOT NULL,
  warehouse_id  UUID NOT NULL REFERENCES public.warehouses(id),
  status        public.doc_status NOT NULL DEFAULT 'draft',
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deliveries_select" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "deliveries_insert" ON public.deliveries FOR INSERT WITH CHECK (true);
CREATE POLICY "deliveries_update" ON public.deliveries FOR UPDATE USING (true);
CREATE POLICY "deliveries_delete" ON public.deliveries FOR DELETE USING (true);
CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.delivery_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id  UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES public.products(id),
  quantity     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "delivery_items_select" ON public.delivery_items FOR SELECT USING (true);
CREATE POLICY "delivery_items_insert" ON public.delivery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "delivery_items_update" ON public.delivery_items FOR UPDATE USING (true);
CREATE POLICY "delivery_items_delete" ON public.delivery_items FOR DELETE USING (true);

-- ==========================================
-- 9. TRANSFERS (internal warehouse moves)
-- ==========================================
CREATE TABLE public.transfers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref               TEXT NOT NULL UNIQUE,
  from_warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  to_warehouse_id   UUID NOT NULL REFERENCES public.warehouses(id),
  status            public.doc_status NOT NULL DEFAULT 'draft',
  transfer_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transfers_select" ON public.transfers FOR SELECT USING (true);
CREATE POLICY "transfers_insert" ON public.transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "transfers_update" ON public.transfers FOR UPDATE USING (true);
CREATE POLICY "transfers_delete" ON public.transfers FOR DELETE USING (true);
CREATE TRIGGER update_transfers_updated_at
  BEFORE UPDATE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transfer_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id  UUID NOT NULL REFERENCES public.transfers(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES public.products(id),
  quantity     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transfer_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transfer_items_select" ON public.transfer_items FOR SELECT USING (true);
CREATE POLICY "transfer_items_insert" ON public.transfer_items FOR INSERT WITH CHECK (true);
CREATE POLICY "transfer_items_update" ON public.transfer_items FOR UPDATE USING (true);
CREATE POLICY "transfer_items_delete" ON public.transfer_items FOR DELETE USING (true);

-- ==========================================
-- 10. ADJUSTMENTS
-- ==========================================
CREATE TABLE public.adjustments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref          TEXT NOT NULL UNIQUE,
  product_id   UUID NOT NULL REFERENCES public.products(id),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  recorded_qty INTEGER NOT NULL,
  counted_qty  INTEGER NOT NULL,
  difference   INTEGER GENERATED ALWAYS AS (counted_qty - recorded_qty) STORED,
  status       public.doc_status NOT NULL DEFAULT 'draft',
  adj_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "adjustments_select" ON public.adjustments FOR SELECT USING (true);
CREATE POLICY "adjustments_insert" ON public.adjustments FOR INSERT WITH CHECK (true);
CREATE POLICY "adjustments_update" ON public.adjustments FOR UPDATE USING (true);
CREATE POLICY "adjustments_delete" ON public.adjustments FOR DELETE USING (true);
CREATE TRIGGER update_adjustments_updated_at
  BEFORE UPDATE ON public.adjustments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 11. STOCK LEDGER
-- ==========================================
CREATE TABLE public.stock_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id),
  warehouse_id    UUID NOT NULL REFERENCES public.warehouses(id),
  movement_type   public.movement_type NOT NULL,
  quantity_change INTEGER NOT NULL,
  balance_after   INTEGER NOT NULL,
  reference_id    UUID,
  reference_ref   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stock_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_ledger_select" ON public.stock_ledger FOR SELECT USING (true);
CREATE POLICY "stock_ledger_insert" ON public.stock_ledger FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_ledger_update" ON public.stock_ledger FOR UPDATE USING (true);
CREATE POLICY "stock_ledger_delete" ON public.stock_ledger FOR DELETE USING (true);

-- ==========================================
-- 12. INDEXES
-- ==========================================
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_stock_product ON public.stock(product_id);
CREATE INDEX idx_stock_warehouse ON public.stock(warehouse_id);
CREATE INDEX idx_receipt_items_receipt ON public.receipt_items(receipt_id);
CREATE INDEX idx_receipt_items_product ON public.receipt_items(product_id);
CREATE INDEX idx_delivery_items_delivery ON public.delivery_items(delivery_id);
CREATE INDEX idx_transfer_items_transfer ON public.transfer_items(transfer_id);
CREATE INDEX idx_stock_ledger_product ON public.stock_ledger(product_id);
CREATE INDEX idx_stock_ledger_warehouse ON public.stock_ledger(warehouse_id);
CREATE INDEX idx_stock_ledger_created ON public.stock_ledger(created_at DESC);
