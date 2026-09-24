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
import type { MenuItemResponse, SubMenuResponse } from "@/client-services";
import EditSubMenuDialog from "@/components/organisms/EditSubMenuDialog";
import AddMenuItemDialog from "@/components/organisms/AddMenuItemDialog";
import { Badge } from "@/components/atoms/Badge";

type SortableSubmenuProps = {
  submenu: SubMenuResponse;
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

export default function SortableSubmenu({
  submenu,
  restaurantId,
  menuId,
  onReorderSubmenu,
  onReorderItem,
  onRequestDelete,
}: SortableSubmenuProps) {
  const submenuRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const itemCount = submenu.menu_items?.length ?? 0;
  const existingLabels = Array.from(
    new Map(
      (submenu.menu_items ?? [])
        .filter((item) => item.pricing_type === "VARIABLE")
        .flatMap((item) => item.prices ?? [])
        .map((price) => price.label.trim())
        .filter(Boolean)
        .map((label) => [label.toLowerCase(), label]),
    ).values(),
  );

  const variableMenuItems =
    submenu.menu_items?.filter((item) => item.pricing_type === "VARIABLE") ??
    [];
  const variableLabels = Array.from(
    new Map(
      variableMenuItems
        .flatMap((item) => item.prices ?? [])
        .map((price) => price.label.trim())
        .filter(Boolean)
        .map((label) => [label.toLowerCase(), label]),
    ).values(),
  );

  useEffect(() => {
    const element = submenuRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({
          type: dragTypes.submenu,
          submenuId: submenu.id,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => isSubmenuDragData(source.data),
        getData: ({ input, element: dropTargetElement }) =>
          attachClosestEdge(
            { type: dragTypes.submenu, submenuId: submenu.id },
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
          if (!isSubmenuDragData(source.data)) return;
          onReorderSubmenu(
            source.data.submenuId,
            submenu.id,
            extractClosestEdge(self.data),
          );
        },
      }),
    );
  }, [onReorderSubmenu, submenu.id]);

  return (
    <section
      ref={submenuRef}
      className={`relative rounded-lg border bg-card p-4 shadow-sm transition ${
        isDragging
          ? "opacity-40"
          : closestEdge
            ? "border-accent ring-2 ring-accent/20"
            : "border-border"
      }`}
    >
      <DropIndicator edge={closestEdge} />

      <header className="mb-4 flex items-center gap-3 border-b border-border pb-3">
        <button
          ref={handleRef}
          type="button"
          aria-label={`Drag ${submenu.title}`}
          className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <ListOrdered className="h-4 w-4 text-accent" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-semibold text-foreground">
              {submenu.title}
            </h2>
            <Badge tone={submenu.is_visible ? "green" : "zinc"}>
              {submenu.is_visible ? "Visible" : "Hidden"}
            </Badge>
          </div>

          {submenu.description && (
            <p className="truncate text-xs text-muted-foreground">
              {submenu.description}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} · position{" "}
            {submenu.order_index}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <EditSubMenuDialog
            restaurantId={restaurantId}
            menuId={menuId}
            submenu={submenu}
          />
          <AddMenuItemDialog
            restaurantId={restaurantId}
            menuId={menuId}
            submenuId={submenu.id}
            existingLabels={existingLabels}
          />
        </div>
      </header>

      <MenuItemList
        submenuId={submenu.id}
        restaurantId={restaurantId}
        menuId={menuId}
        items={submenu.menu_items}
        onReorder={onReorderItem}
        onRequestDelete={onRequestDelete}
      />
    </section>
  );
}
