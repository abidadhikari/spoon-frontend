"use client";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { GripVertical, ListOrdered } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DropIndicator from "@/components/DropIndicator";
import MenuItemList from "@/components/MenuItemList";
import { dragTypes, isSubmenuDragData } from "@/lib/dragTypes";
import type { Submenu } from "@/types/menu.type";

type SortableSubmenuProps = {
  submenu: Submenu;
  onReorderSubmenu: (sourceSubmenuId: string, targetSubmenuId: string, edge: Edge | null) => void;
  onReorderItem: (submenuId: string, sourceItemId: string, targetItemId: string, edge: Edge | null) => void;
};

export default function SortableSubmenu({
  submenu,
  onReorderSubmenu,
  onReorderItem,
}: SortableSubmenuProps) {
  const submenuRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = submenuRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ type: dragTypes.submenu, submenuId: submenu.id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => isSubmenuDragData(source.data),
        getData: ({ input, element: dropTargetElement }) =>
          attachClosestEdge(
            { type: dragTypes.submenu, submenuId: submenu.id },
            { input, element: dropTargetElement, allowedEdges: ["top", "bottom"] },
          ),
        onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: ({ source, self }) => {
          setClosestEdge(null);
          if (!isSubmenuDragData(source.data)) return;

          onReorderSubmenu(source.data.submenuId, submenu.id, extractClosestEdge(self.data));
        },
      }),
    );
  }, [onReorderSubmenu, submenu.id]);

  return (
    <section
      ref={submenuRef}
      className={`relative rounded-xl border bg-slate-50 p-4 shadow-sm transition ${
        isDragging ? "opacity-40" : closestEdge ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <DropIndicator edge={closestEdge} />
      <header className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          ref={handleRef}
          type="button"
          aria-label={`Drag ${submenu.name}`}
          className="cursor-grab touch-none rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <ListOrdered className="h-4 w-4 text-blue-600" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-slate-900">{submenu.name}</h2>
          <p className="text-xs text-slate-500">
            {submenu.items.length} {submenu.items.length === 1 ? "item" : "items"} · position {submenu.orderIndex}
          </p>
        </div>
      </header>
      <MenuItemList submenuId={submenu.id} items={submenu.items} onReorder={onReorderItem} />
    </section>
  );
}
