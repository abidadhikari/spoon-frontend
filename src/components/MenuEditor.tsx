"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { GripVertical } from "lucide-react";
import { useCallback, useState } from "react";
import SubmenuList from "@/components/SubmenuList";
import { reorderByClosestEdge } from "@/lib/reorder";
import type {
  MenuItemResponse,
  SubMenuResponse,
} from "@/client-services";

const initialSubmenus: SubMenuResponse[] = [
  {
    id: "submenu-favourites",
    title: "House Favourites",
    description: null,
    is_visible: true,
    menu_id: "menu-brunch",
    restaurant_id: "restaurant-1",
    order_index: 0,
    menu_items: [
      {
        id: "item-avocado-toast",
        name: "Smashed Avocado Toast",
        description: null,
        order_index: 0,
      },
      {
        id: "item-french-toast",
        name: "Brioche French Toast",
        description: null,
        order_index: 1,
      },
      {
        id: "item-eggs-benedict",
        name: "Eggs Benedict",
        description: null,
        order_index: 2,
      },
    ],
  },
  {
    id: "submenu-sides",
    title: "Sides & Extras",
    description: null,
    is_visible: true,
    menu_id: "menu-brunch",
    restaurant_id: "restaurant-1",
    order_index: 1,
    menu_items: [
      {
        id: "item-hash-browns",
        name: "Crispy Hash Browns",
        description: null,
        order_index: 0,
      },
      {
        id: "item-bacon",
        name: "Maple-glazed Bacon",
        description: null,
        order_index: 1,
      },
    ],
  },
];

export default function MenuEditor() {
  const [submenus, setSubmenus] = useState<SubMenuResponse[]>(initialSubmenus);

  const handleSubmenuReorder = useCallback(
    (sourceSubmenuId: string, targetSubmenuId: string, edge: Edge | null) => {
      setSubmenus((current) => {
        const reordered = reorderByClosestEdge({
          list: current,
          sourceId: sourceSubmenuId,
          targetId: targetSubmenuId,
          closestEdge: edge,
        });

        if (reordered === current) return current;
        return reordered.map((submenu, orderIndex) => ({
          ...submenu,
          order_index: orderIndex,
        }));
      });
    },
    [],
  );

  const handleMenuItemReorder = useCallback(
    (
      submenuId: string,
      sourceItemId: string,
      targetItemId: string,
      edge: Edge | null,
    ) => {
      setSubmenus((current) =>
        current.map((submenu) => {
          if (submenu.id !== submenuId) return submenu;

          const items = submenu.menu_items ?? [];
          const reorderedItems = reorderByClosestEdge({
            list: items,
            sourceId: sourceItemId,
            targetId: targetItemId,
            closestEdge: edge,
          });

          if (reorderedItems === items) return submenu;
          return {
            ...submenu,
            menu_items: reorderedItems.map((item, orderIndex) => ({
              ...item,
              order_index: orderIndex,
            })),
          };
        }),
      );
    },
    [],
  );

  const handleDeleteItem = useCallback((item: MenuItemResponse) => {
    setSubmenus((current) =>
      current.map((submenu) => ({
        ...submenu,
        menu_items: (submenu.menu_items ?? []).filter(
          (entry) => entry.id !== item.id,
        ),
      })),
    );
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-lg">
        <p className="mb-2 text-sm font-medium text-blue-200">Menu editor</p>
        <h1 className="text-2xl font-semibold tracking-tight">Weekend Brunch</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Drag a section by its handle to reorder the menu. Items can only be
          reordered inside their own section.
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <GripVertical className="h-4 w-4" />
        Use the drag handles to sort
      </div>

      <SubmenuList
        submenus={submenus}
        restaurantId="restaurant-1"
        menuId="menu-brunch"
        onReorderSubmenu={handleSubmenuReorder}
        onReorderItem={handleMenuItemReorder}
        onRequestDelete={handleDeleteItem}
      />
    </div>
  );
}
