"use client";

import { useParams } from "next/navigation";
import { useGetMenuById } from "@/hooks/services/menus/useGetMenuById";
import { usePostCreateSubMenu } from "@/hooks/services/submenus/usePostCreateSubMenu";
import AddSubMenuDialog from "@/components/organisms/AddSubMenuDialog";
import AddMenuItemDialog from "@/components/organisms/AddMenuItemDialog";
import { Button } from "@/components/atoms/Button";
import { useDeleteMenuItem } from "@/hooks/services/menuitems/useDeleteMenuItem";
import { Trash } from "lucide-react";
import EditMenuItemDialog from "@/components/organisms/EditMenuItemDialog";
import EditSubMenuDialog from "@/components/organisms/EditSubMenuDialog";

export default function Page() {
  const { id, menuId } = useParams();

  const { data, isLoading, error } = useGetMenuById({
    restaurant_id: id as string,
    menu_id: menuId as string,
  });

  const { mutate: createSubMenu, isLoading: isCreatingSubMenu } =
    usePostCreateSubMenu();

  const { mutate: deleteMenuItem, isPending: isDeletingMenuItem } =
    useDeleteMenuItem();

  if (!id || !menuId) {
    return (
      <div className="p-8 text-center text-red-500">
        Invalid restaurant or menu ID.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load menu.</div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      {/* Header */}
      <AddSubMenuDialog menuId={menuId as string} restaurantId={id as string} />
      <section className=" border bg-indigo-300 p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{data.name}</h1>

        {data.description && (
          <p className="mt-2 text-gray-600">{data.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>
            Status:{" "}
            <span
              className={
                data.is_visible
                  ? "font-medium text-green-600"
                  : "font-medium text-red-500"
              }
            >
              {data.is_visible ? "Visible" : "Hidden"}
            </span>
          </span>

          <span>QR Code: {data.qr?.code}</span>

          <span>Views: {data.qr?.views}</span>
        </div>
      </section>

      {/* Submenus */}
      <section className="space-y-8">
        {data?.submenus?.map((submenu) => (
          <div
            key={submenu.id}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{submenu.title}</h2>

                {submenu.description && (
                  <p className="mt-1 text-gray-500">{submenu.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <EditSubMenuDialog
                  restaurantId={id as string}
                  menuId={menuId as string}
                  submenu={submenu}
                />

                <AddMenuItemDialog
                  restaurantId={id as string}
                  menuId={menuId as string}
                  submenuId={submenu.id}
                />
              </div>
            </div>

            {submenu?.menu_items?.length === 0 ? (
              <p className="text-sm text-gray-400">No menu items available.</p>
            ) : (
              <div className="space-y-5">
                {submenu?.menu_items?.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>

                            {item.description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <EditMenuItemDialog
                              restaurantId={id as string}
                              menuId={menuId as string}
                              submenuId={submenu.id}
                              item={item}
                            />

                            <Button
                              type="button"
                              size="icon"
                              onClick={() =>
                                deleteMenuItem({
                                  restaurant_id: id as string,
                                  menu_id: menuId as string,
                                  submenu_id: submenu.id as string,
                                  menu_item_id: item.id as string,
                                })
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <span className="rounded bg-gray-100 px-3 py-1 text-xs font-medium">
                        {item.pricing_type}
                      </span>
                    </div>

                    {item?.prices?.length > 0 && (
                      <div className="mt-4 divide-y">
                        {item?.prices?.map((price) => (
                          <div
                            key={price.label}
                            className="flex justify-between py-2"
                          >
                            <span>{price.label}</span>

                            <span className="font-semibold">
                              Rs. {price.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
