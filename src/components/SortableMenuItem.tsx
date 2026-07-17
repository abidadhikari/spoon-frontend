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
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DropIndicator from "@/components/DropIndicator";
import { dragTypes, isMenuItemDragData } from "@/lib/dragTypes";
import type { MenuItem } from "@/types/menu";

type SortableMenuItemProps = {
  item: MenuItem;
  submenuId: string;
  onReorder: (sourceItemId: string, targetItemId: string, edge: Edge | null) => void;
};

export default function SortableMenuItem({ item, submenuId, onReorder }: SortableMenuItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = itemRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({
          type: dragTypes.menuItem,
          itemId: item.id,
          submenuId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return isMenuItemDragData(source.data) && source.data.submenuId === submenuId;
        },
        getData: ({ input, element: dropTargetElement }) =>
          attachClosestEdge(
            { type: dragTypes.menuItem, itemId: item.id, submenuId },
            { input, element: dropTargetElement, allowedEdges: ["top", "bottom"] },
          ),
        onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: ({ source, self }) => {
          setClosestEdge(null);
          if (!isMenuItemDragData(source.data) || source.data.submenuId !== submenuId) return;

          onReorder(source.data.itemId, item.id, extractClosestEdge(self.data));
        },
      }),
    );
  }, [item.id, onReorder, submenuId]);

  return (
    <li
      ref={itemRef}
      className={`relative flex items-center gap-3 rounded-lg border bg-white px-3 py-3 shadow-sm transition ${
        isDragging ? "opacity-40" : closestEdge ? "border-blue-300 bg-blue-50" : "border-slate-200"
      }`}
    >
      <DropIndicator edge={closestEdge} />
      <button
        ref={handleRef}
        type="button"
        aria-label={`Drag ${item.name}`}
        className="cursor-grab touch-none rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">{item.name}</span>
      <span className="text-xs tabular-nums text-slate-400">#{item.orderIndex}</span>
    </li>
  );
}
