"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { QrCode } from "lucide-react";

import { useGetMenuById } from "@/hooks/services/menus/useGetMenuById";
import { usePatchUpdateSubmenuOrder } from "@/hooks/services/submenus/usePatchUpdateSubmenuOrder";
import { usePatchUpdateMenuItemOrder } from "@/hooks/services/menuitems/usePatchUpdateMenuItemOrder";
import { useDeleteMenuItem } from "@/hooks/services/menuitems/useDeleteMenuItem";
import { QUERY_KEYS } from "@/constants/query-keys";
import { reorderByClosestEdge } from "@/lib/reorder";
import { Badge } from "@/components/atoms/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/organisms/ConfirmDialog";
import AddSubMenuDialog from "@/components/organisms/AddSubMenuDialog";
import SortableSubmenu from "@/components/SortableSubmenu";
import type { MenuItemResponse, SubMenuResponse } from "@/client-services";

export default function Page() {
  const { restaurantId, menuId } = useParams();
  const restaurant_id = restaurantId as string;
  const menu_id = menuId as string;

  console.log("restaurant_id", restaurant_id);
  console.log("menu_id", menu_id);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useGetMenuById({
    restaurant_id: restaurant_id,
    menu_id,
  });

  const [submenus, setSubmenus] = useState<SubMenuResponse[]>(
    data?.submenus ?? [],
  );
  const [prevData, setPrevData] = useState(data);
  const [itemToDelete, setItemToDelete] = useState<{
    submenuId: string;
    item: MenuItemResponse;
  } | null>(null);

  const reorderSubmenus = usePatchUpdateSubmenuOrder();
  const reorderItems = usePatchUpdateMenuItemOrder();
  const deleteMenuItem = useDeleteMenuItem();

  if (data !== prevData) {
    setPrevData(data);
    setSubmenus(data?.submenus ?? []);
  }

  const refreshMenu = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: [QUERY_KEYS.SINGLE_MENU, restaurant_id, menu_id],
    });
  }, [queryClient, restaurant_id, menu_id]);

  const handleSubmenuReorder = useCallback(
    (sourceSubmenuId: string, targetSubmenuId: string, edge: Edge | null) => {
      const reordered = reorderByClosestEdge({
        list: submenus,
        sourceId: sourceSubmenuId,
        targetId: targetSubmenuId,
        closestEdge: edge,
      });

      if (reordered === submenus) return;

      setSubmenus(reordered);
      reorderSubmenus
        .mutateAsync({
          path: { restaurant_id: restaurant_id, menu_id },
          body: {
            new_order: reordered.map((submenu, orderIndex) => ({
              item_id: submenu.id,
              order_index: orderIndex,
            })),
          },
        })
        .catch(() => refreshMenu());
    },
    [menu_id, refreshMenu, reorderSubmenus, restaurant_id, submenus],
  );

  const handleItemReorder = useCallback(
    (
      submenuId: string,
      sourceItemId: string,
      targetItemId: string,
      edge: Edge | null,
    ) => {
      const submenu = submenus.find((entry) => entry.id === submenuId);
      if (!submenu) return;

      const items = submenu.menu_items ?? [];
      const reorderedItems = reorderByClosestEdge({
        list: items,
        sourceId: sourceItemId,
        targetId: targetItemId,
        closestEdge: edge,
      });

      if (reorderedItems === items) return;

      setSubmenus((current) =>
        current.map((entry) =>
          entry.id === submenuId
            ? { ...entry, menu_items: reorderedItems }
            : entry,
        ),
      );

      reorderItems
        .mutateAsync({
          path: {
            restaurant_id: restaurant_id,
            menu_id,
            submenu_id: submenuId,
          },
          body: {
            new_order: reorderedItems.map((item, orderIndex) => ({
              item_id: item.id,
              order_index: orderIndex,
            })),
          },
        })
        .catch(() => refreshMenu());
    },
    [menu_id, refreshMenu, reorderItems, restaurant_id, submenus],
  );

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    await deleteMenuItem.mutateAsync({
      restaurant_id: restaurant_id,
      menu_id,
      submenu_id: itemToDelete.submenuId,
      menu_item_id: itemToDelete.item.id,
    });

    setItemToDelete(null);
  };

  const qrImageUrl = useMemo(
    () =>
      data?.qr
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/q/${data.qr.id}`
        : null,
    [data?.qr],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-5">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-3 h-10 w-full" />
              <Skeleton className="mt-2 h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Failed to load menu: {error?.message ?? "Unknown error"}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      <section className="rounded-xl border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-semibold">
                {data.name}
              </h1>
              <Badge tone={data.is_visible ? "green" : "zinc"}>
                {data.is_visible ? "Visible" : "Hidden"}
              </Badge>
            </div>

            {data.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {data.description}
              </p>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              Drag sections by their handle to reorder. Items can only be
              reordered inside their own section.
            </p>
          </div>

          <AddSubMenuDialog restaurantId={restaurant_id} menuId={menu_id} />
        </div>

        {qrImageUrl && (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/50 p-3">
            <Image
              src={qrImageUrl}
              alt={`QR code for ${data.name}`}
              width={64}
              height={64}
              unoptimized
              className="size-16 rounded bg-white object-contain p-1"
            />
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <QrCode className="size-4" />
                QR Code: {data.qr?.code}
              </div>
              <div className="mt-1">Views: {data.qr?.views}</div>
            </div>
          </div>
        )}
      </section>

      {/* <pre>{JSON.stringify(data?.submenus, null, 2)}</pre> */}

      {submenus.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="font-heading text-base font-medium">
            No submenus yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a submenu to start organizing your menu items.
          </p>
          <div className="mt-4">
            <AddSubMenuDialog restaurantId={restaurant_id} menuId={menu_id} />
          </div>
        </div>
      ) : (
        <section className="space-y-4">
          {submenus.map((submenu) => (
            <SortableSubmenu
              key={submenu.id}
              submenu={submenu}
              restaurantId={restaurant_id}
              menuId={menu_id}
              onReorderSubmenu={handleSubmenuReorder}
              onReorderItem={handleItemReorder}
              onRequestDelete={(item) =>
                setItemToDelete({ submenuId: submenu.id, item })
              }
            />
          ))}
        </section>
      )}

      <ConfirmDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
        }}
        title="Delete menu item"
        description={`Are you sure you want to delete "${itemToDelete?.item.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMenuItem.isPending}
        onConfirm={handleDeleteItem}
      />
    </main>
  );
}
