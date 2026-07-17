"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import SortableMenuItem from "@/components/SortableMenuItem";
import type { MenuItem } from "@/types/menu";

type MenuItemListProps = {
  submenuId: string;
  items: MenuItem[];
  onReorder: (submenuId: string, sourceItemId: string, targetItemId: string, edge: Edge | null) => void;
};

export default function MenuItemList({ submenuId, items, onReorder }: MenuItemListProps) {
  return (
    <ul className="space-y-2" aria-label="Menu items">
      {items.map((item) => (
        <SortableMenuItem
          key={item.id}
          item={item}
          submenuId={submenuId}
          onReorder={(sourceItemId, targetItemId, edge) =>
            onReorder(submenuId, sourceItemId, targetItemId, edge)
          }
        />
      ))}
    </ul>
  );
}
