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
import { GripVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DropIndicator from "@/components/DropIndicator";
import { dragTypes, isMenuItemDragData } from "@/lib/dragTypes";
import type { MenuItemResponse } from "@/client-services";
import EditMenuItemDialog from "@/components/organisms/EditMenuItemDialog";
import { Badge } from "@/components/atoms/Badge";

type SortableMenuItemProps = {
  item: MenuItemResponse;
  submenuId: string;
  restaurantId: string;
  menuId: string;
  existingLabels: string[];
  onReorder: (
    sourceItemId: string,
    targetItemId: string,
    edge: Edge | null,
  ) => void;
  onRequestDelete: (item: MenuItemResponse) => void;
};

export default function SortableMenuItem({
  item,
  submenuId,
  restaurantId,
  menuId,
  existingLabels,
  onReorder,
  onRequestDelete,
}: SortableMenuItemProps) {
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
        canDrop: ({ source }) =>
          isMenuItemDragData(source.data) &&
          source.data.submenuId === submenuId,
        getData: ({ input, element: dropTargetElement }) =>
          attachClosestEdge(
            { type: dragTypes.menuItem, itemId: item.id, submenuId },
            {
              input,
              element: dropTargetElement,
              allowedEdges: ["top", "bottom"],
            },
          ),
        onDragEnter: ({ self }) =>
          setClosestEdge(extractClosestEdge(self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: ({ source, self }) => {
          setClosestEdge(null);
          if (
            !isMenuItemDragData(source.data) ||
            source.data.submenuId !== submenuId
          ) {
            return;
          }
          onReorder(source.data.itemId, item.id, extractClosestEdge(self.data));
        },
      }),
    );
  }, [item.id, onReorder, submenuId]);

  return (
    <li
      ref={itemRef}
      className={`relative flex items-center gap-3 rounded-lg border bg-white px-3 py-3 shadow-sm transition ${
        isDragging
          ? "opacity-40"
          : closestEdge
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200"
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

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            {item.name}
          </span>
          {item.pricing_type && <Badge tone="zinc">{item.pricing_type}</Badge>}
        </div>

        {item.description && (
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {item.description}
          </p>
        )}

        {item.prices && item.prices.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {item.prices.map((price) => (
              <span
                key={price.label}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {price.label}: Rs. {price.price}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <EditMenuItemDialog
          restaurantId={restaurantId}
          menuId={menuId}
          submenuId={submenuId}
          item={item}
          existingLabels={existingLabels}
        />

        <button
          type="button"
          aria-label={`Delete ${item.name}`}
          onClick={() => onRequestDelete(item)}
          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
