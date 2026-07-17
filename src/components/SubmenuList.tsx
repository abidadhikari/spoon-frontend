"use client";

import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import SortableSubmenu from "@/components/SortableSubmenu";
import type { Submenu } from "@/types/menu";

type SubmenuListProps = {
  submenus: Submenu[];
  onReorderSubmenu: (sourceSubmenuId: string, targetSubmenuId: string, edge: Edge | null) => void;
  onReorderItem: (submenuId: string, sourceItemId: string, targetItemId: string, edge: Edge | null) => void;
};

export default function SubmenuList({ submenus, onReorderSubmenu, onReorderItem }: SubmenuListProps) {
  return (
    <div className="space-y-4">
      {submenus.map((submenu) => (
        <SortableSubmenu
          key={submenu.id}
          submenu={submenu}
          onReorderSubmenu={onReorderSubmenu}
          onReorderItem={onReorderItem}
        />
      ))}
    </div>
  );
}
