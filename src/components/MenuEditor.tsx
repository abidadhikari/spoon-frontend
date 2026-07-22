"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { GripVertical } from "lucide-react";
import { useCallback, useState } from "react";
import SubmenuList from "@/components/SubmenuList";
import { withMenuItemOrderIndexes, withSubmenuOrderIndexes } from "@/lib/orderIndex";
import { reorderByClosestEdge } from "@/lib/reorder";
import { sampleMenu } from "@/lib/sampleData";
import type { Menu } from "@/types/menu.type";

export default function MenuEditor() {
  const [menu, setMenu] = useState<Menu>(sampleMenu);

  const handleSubmenuReorder = useCallback(
    (sourceSubmenuId: string, targetSubmenuId: string, edge: Edge | null) => {
      setMenu((currentMenu) => {
        const reordered = reorderByClosestEdge({
          list: currentMenu.submenus,
          sourceId: sourceSubmenuId,
          targetId: targetSubmenuId,
          closestEdge: edge,
        });

        if (reordered === currentMenu.submenus) return currentMenu;
        return { ...currentMenu, submenus: withSubmenuOrderIndexes(reordered) };
      });
    },
    [],
  );

  const handleMenuItemReorder = useCallback(
    (submenuId: string, sourceItemId: string, targetItemId: string, edge: Edge | null) => {
      setMenu((currentMenu) => {
        const submenu = currentMenu.submenus.find((entry) => entry.id === submenuId);
        if (!submenu) return currentMenu;

        const reorderedItems = reorderByClosestEdge({
          list: submenu.items,
          sourceId: sourceItemId,
          targetId: targetItemId,
          closestEdge: edge,
        });

        if (reorderedItems === submenu.items) return currentMenu;
        return {
          ...currentMenu,
          submenus: currentMenu.submenus.map((entry) =>
            entry.id === submenuId
              ? { ...entry, items: withMenuItemOrderIndexes(reorderedItems) }
              : entry,
          ),
        };
      });
    },
    [],
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-lg">
        <p className="mb-2 text-sm font-medium text-blue-200">Menu editor</p>
        <h1 className="text-2xl font-semibold tracking-tight">{menu.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Drag a section by its handle to reorder the menu. Items can only be reordered inside their own section.
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <GripVertical className="h-4 w-4" />
        Use the drag handles to sort
      </div>
      <SubmenuList
        submenus={menu.submenus}
        onReorderSubmenu={handleSubmenuReorder}
        onReorderItem={handleMenuItemReorder}
      />
    </div>
  );
}
