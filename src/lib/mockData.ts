export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type DocStatus = "draft" | "waiting" | "ready" | "done" | "cancelled";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  uom: string;
  reorderLevel: number;
  stock: number;
  status: StockStatus;
  warehouses: { warehouse: string; qty: number }[];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  totalItems: number;
  totalQty: number;
}

export interface Receipt {
  id: string;
  ref: string;
  supplier: string;
  warehouse: string;
  date: string;
  status: DocStatus;
  items: number;
  total: number;
}

export interface Delivery {
  id: string;
  ref: string;
  customer: string;
  warehouse: string;
  date: string;
  status: DocStatus;
  items: number;
}

export interface Transfer {
  id: string;
  ref: string;
  from: string;
  to: string;
  date: string;
  status: DocStatus;
  items: number;
}

export interface Adjustment {
  id: string;
  ref: string;
  product: string;
  warehouse: string;
  recorded: number;
  counted: number;
  diff: number;
  date: string;
  status: DocStatus;
}

export interface LedgerEntry {
  id: string;
  date: string;
  product: string;
  sku: string;
  warehouse: string;
  type: "receipt" | "delivery" | "transfer" | "adjustment";
  change: number;
  ref: string;
  balance: number;
}

export const categories = ["Steel", "Wood", "Electronics", "Furniture", "Chemicals", "Tools", "Packaging"];

export const products: Product[] = [
  { id: "P001", name: "Steel Rods 12mm", sku: "STL-ROD-12", category: "Steel", uom: "pcs", reorderLevel: 100, stock: 340, status: "in_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 200 }, { warehouse: "Annex B", qty: 140 }] },
  { id: "P002", name: "Office Chair Deluxe", sku: "FRN-CHR-01", category: "Furniture", uom: "pcs", reorderLevel: 20, stock: 8, status: "low_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 8 }] },
  { id: "P003", name: "Copper Wire 2.5mm", sku: "ELC-CW-25", category: "Electronics", uom: "roll", reorderLevel: 50, stock: 0, status: "out_of_stock", warehouses: [] },
  { id: "P004", name: "MDF Board 18mm", sku: "WD-MDF-18", category: "Wood", uom: "sheet", reorderLevel: 30, stock: 75, status: "in_stock", warehouses: [{ warehouse: "Annex B", qty: 75 }] },
  { id: "P005", name: "Epoxy Resin 1L", sku: "CHM-EPX-1L", category: "Chemicals", uom: "bottle", reorderLevel: 40, stock: 12, status: "low_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 12 }] },
  { id: "P006", name: "Power Drill 18V", sku: "TL-DRL-18V", category: "Tools", uom: "pcs", reorderLevel: 5, stock: 23, status: "in_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 23 }] },
  { id: "P007", name: "Bubble Wrap Roll", sku: "PKG-BW-50", category: "Packaging", uom: "roll", reorderLevel: 20, stock: 0, status: "out_of_stock", warehouses: [] },
  { id: "P008", name: "Hex Bolt M8", sku: "STL-BLT-M8", category: "Steel", uom: "box", reorderLevel: 200, stock: 850, status: "in_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 500 }, { warehouse: "Annex B", qty: 350 }] },
  { id: "P009", name: "Standing Desk 140cm", sku: "FRN-DSK-14", category: "Furniture", uom: "pcs", reorderLevel: 10, stock: 3, status: "low_stock", warehouses: [{ warehouse: "Annex B", qty: 3 }] },
  { id: "P010", name: "Cable Tie Pack 100", sku: "ELC-CT-100", category: "Electronics", uom: "pack", reorderLevel: 50, stock: 420, status: "in_stock", warehouses: [{ warehouse: "Main Warehouse", qty: 420 }] },
];

export const warehouses: Warehouse[] = [
  { id: "W001", name: "Main Warehouse", code: "WH-MAIN", address: "123 Industrial Blvd, Zone A", totalItems: 7, totalQty: 2228 },
  { id: "W002", name: "Annex B", code: "WH-ANNEX-B", address: "45 Storage Lane, Zone B", totalItems: 5, totalQty: 793 },
  { id: "W003", name: "Production Floor", code: "WH-PROD", address: "12 Factory Rd, Zone C", totalItems: 0, totalQty: 0 },
];

export const receipts: Receipt[] = [
  { id: "R001", ref: "REC/2024/001", supplier: "Apex Steel Co.", warehouse: "Main Warehouse", date: "2024-12-01", status: "done", items: 3, total: 18500 },
  { id: "R002", ref: "REC/2024/002", supplier: "Electra Supplies", warehouse: "Main Warehouse", date: "2024-12-03", status: "ready", items: 2, total: 4200 },
  { id: "R003", ref: "REC/2024/003", supplier: "Wood World", warehouse: "Annex B", date: "2024-12-05", status: "waiting", items: 1, total: 3750 },
  { id: "R004", ref: "REC/2024/004", supplier: "Chem Direct", warehouse: "Main Warehouse", date: "2024-12-08", status: "draft", items: 4, total: 9100 },
  { id: "R005", ref: "REC/2024/005", supplier: "Apex Steel Co.", warehouse: "Main Warehouse", date: "2024-12-10", status: "done", items: 2, total: 12000 },
];

export const deliveries: Delivery[] = [
  { id: "D001", ref: "DEL/2024/001", customer: "Global Builders Inc.", warehouse: "Main Warehouse", date: "2024-12-02", status: "done", items: 2 },
  { id: "D002", ref: "DEL/2024/002", customer: "OfficeSpace Ltd.", warehouse: "Main Warehouse", date: "2024-12-04", status: "ready", items: 5 },
  { id: "D003", ref: "DEL/2024/003", customer: "TechParts SA", warehouse: "Main Warehouse", date: "2024-12-06", status: "waiting", items: 1 },
  { id: "D004", ref: "DEL/2024/004", customer: "HomeFurnish Co.", warehouse: "Annex B", date: "2024-12-09", status: "draft", items: 3 },
];

export const transfers: Transfer[] = [
  { id: "T001", ref: "TRF/2024/001", from: "Main Warehouse", to: "Production Floor", date: "2024-12-03", status: "done", items: 2 },
  { id: "T002", ref: "TRF/2024/002", from: "Annex B", to: "Main Warehouse", date: "2024-12-07", status: "ready", items: 3 },
  { id: "T003", ref: "TRF/2024/003", from: "Main Warehouse", to: "Annex B", date: "2024-12-10", status: "draft", items: 1 },
];

export const adjustments: Adjustment[] = [
  { id: "A001", ref: "ADJ/2024/001", product: "Steel Rods 12mm", warehouse: "Main Warehouse", recorded: 220, counted: 200, diff: -20, date: "2024-12-01", status: "done" },
  { id: "A002", ref: "ADJ/2024/002", product: "Office Chair Deluxe", warehouse: "Main Warehouse", recorded: 6, counted: 8, diff: +2, date: "2024-12-05", status: "done" },
  { id: "A003", ref: "ADJ/2024/003", product: "MDF Board 18mm", warehouse: "Annex B", recorded: 80, counted: 75, diff: -5, date: "2024-12-09", status: "draft" },
];

export const ledger: LedgerEntry[] = [
  { id: "L001", date: "2024-12-10", product: "Steel Rods 12mm", sku: "STL-ROD-12", warehouse: "Main Warehouse", type: "receipt", change: +50, ref: "REC/2024/005", balance: 200 },
  { id: "L002", date: "2024-12-09", product: "MDF Board 18mm", sku: "WD-MDF-18", warehouse: "Annex B", type: "adjustment", change: -5, ref: "ADJ/2024/003", balance: 75 },
  { id: "L003", date: "2024-12-07", product: "Hex Bolt M8", sku: "STL-BLT-M8", warehouse: "Annex B", type: "transfer", change: +150, ref: "TRF/2024/002", balance: 350 },
  { id: "L004", date: "2024-12-06", product: "Copper Wire 2.5mm", sku: "ELC-CW-25", warehouse: "Main Warehouse", type: "delivery", change: -30, ref: "DEL/2024/003", balance: 0 },
  { id: "L005", date: "2024-12-05", product: "Office Chair Deluxe", sku: "FRN-CHR-01", warehouse: "Main Warehouse", type: "adjustment", change: +2, ref: "ADJ/2024/002", balance: 8 },
  { id: "L006", date: "2024-12-04", product: "Power Drill 18V", sku: "TL-DRL-18V", warehouse: "Main Warehouse", type: "delivery", change: -5, ref: "DEL/2024/002", balance: 23 },
  { id: "L007", date: "2024-12-03", product: "Steel Rods 12mm", sku: "STL-ROD-12", warehouse: "Production Floor", type: "transfer", change: +40, ref: "TRF/2024/001", balance: 40 },
  { id: "L008", date: "2024-12-02", product: "Steel Rods 12mm", sku: "STL-ROD-12", warehouse: "Main Warehouse", type: "delivery", change: -20, ref: "DEL/2024/001", balance: 150 },
  { id: "L009", date: "2024-12-01", product: "Steel Rods 12mm", sku: "STL-ROD-12", warehouse: "Main Warehouse", type: "receipt", change: +100, ref: "REC/2024/001", balance: 170 },
  { id: "L010", date: "2024-12-01", product: "Steel Rods 12mm", sku: "STL-ROD-12", warehouse: "Main Warehouse", type: "adjustment", change: -20, ref: "ADJ/2024/001", balance: 70 },
];

export const stockTrend = [
  { month: "Jul", receipts: 420, deliveries: 310, adjustments: 15 },
  { month: "Aug", receipts: 380, deliveries: 290, adjustments: 22 },
  { month: "Sep", receipts: 510, deliveries: 430, adjustments: 8 },
  { month: "Oct", receipts: 620, deliveries: 510, adjustments: 31 },
  { month: "Nov", receipts: 480, deliveries: 460, adjustments: 12 },
  { month: "Dec", receipts: 560, deliveries: 390, adjustments: 25 },
];

export const warehouseDistribution = [
  { name: "Main Warehouse", value: 2228 },
  { name: "Annex B", value: 793 },
  { name: "Production Floor", value: 40 },
];
