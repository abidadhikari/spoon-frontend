import { Submenu } from "@/types/public-menu.type";

export interface PriceTableRow {
  name: string;
  description?: string;
  cells: (number | null)[];
  singlePrice: number | null;
}

export interface PriceTable {
  columns: string[];
  rows: PriceTableRow[];
}

export function buildPriceTable(submenu: Submenu): PriceTable {
  const items = submenu.menu_items.filter((i) => i.is_visible !== false);

  const columns: string[] = [];
  for (const item of items) {
    for (const p of item.prices ?? []) {
      if (!columns.includes(p.label)) columns.push(p.label);
    }
  }

  const rows: PriceTableRow[] = items.map((item) => {
    const byLabel = new Map((item.prices ?? []).map((p) => [p.label, p.price]));
    return {
      name: item.name,
      description: item.description,
      cells: columns.map((label) =>
        byLabel.has(label) ? byLabel.get(label)! : null,
      ),
      singlePrice:
        columns.length === 0 ? (item.prices?.[0]?.price ?? null) : null,
    };
  });

  return { columns, rows };
}
