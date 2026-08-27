"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import SortableMenuItem from "@/components/SortableMenuItem";
import type { MenuItemResponse } from "@/client-services";

type MenuItemListProps = {
  submenuId: string;
  restaurantId: string;
  menuId: string;
  items?: MenuItemResponse[];
  onReorder: (
    submenuId: string,
    sourceItemId: string,
    targetItemId: string,
    edge: Edge | null,
  ) => void;
  onRequestDelete: (item: MenuItemResponse) => void;
};

export default function MenuItemList({
  submenuId,
  restaurantId,
  menuId,
  items = [],
  onReorder,
  onRequestDelete,
}: MenuItemListProps) {
  const existingLabels = Array.from(
    new Map(
      items
        .filter((item) => item.pricing_type === "VARIABLE")
        .flatMap((item) => item.prices ?? [])
        .map((price) => price.label.trim())
        .filter(Boolean)
        .map((label) => [label.toLowerCase(), label]),
    ).values(),
  );

  if (items.length === 0) {
    return (
      <p className="px-3 py-2 text-sm text-slate-400">
        No menu items available.
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Menu items">
      {items.map((item) => (
        <SortableMenuItem
          key={item.id}
          item={item}
          submenuId={submenuId}
          restaurantId={restaurantId}
          menuId={menuId}
          existingLabels={existingLabels}
          onReorder={(sourceItemId, targetItemId, edge) =>
            onReorder(submenuId, sourceItemId, targetItemId, edge)
          }
          onRequestDelete={onRequestDelete}
        />
      ))}
    </ul>
  );
}
