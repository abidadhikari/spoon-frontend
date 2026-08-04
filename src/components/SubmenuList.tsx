"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import SortableSubmenu from "@/components/SortableSubmenu";
import type { MenuItemResponse, SubMenuResponse } from "@/client-services";

type SubmenuListProps = {
  submenus: SubMenuResponse[];
  restaurantId: string;
  menuId: string;
  onReorderSubmenu: (
    sourceSubmenuId: string,
    targetSubmenuId: string,
    edge: Edge | null,
  ) => void;
  onReorderItem: (
    submenuId: string,
    sourceItemId: string,
    targetItemId: string,
    edge: Edge | null,
  ) => void;
  onRequestDelete: (item: MenuItemResponse) => void;
};

export default function SubmenuList({
  submenus,
  restaurantId,
  menuId,
  onReorderSubmenu,
  onReorderItem,
  onRequestDelete,
}: SubmenuListProps) {
  return (
    <div className="space-y-4">
      {submenus.map((submenu) => (
        <SortableSubmenu
          key={submenu.id}
          submenu={submenu}
          restaurantId={restaurantId}
          menuId={menuId}
          onReorderSubmenu={onReorderSubmenu}
          onReorderItem={onReorderItem}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}
