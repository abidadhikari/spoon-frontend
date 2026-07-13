"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/atoms/Button";

import MenuItemForm, {
  MenuItemFormValues,
} from "@/components/organisms/MenuItemForm";

import { usePatchUpdateMenuItem } from "@/hooks/services/menuitems/usePatchUpdateMenuItem";

import type { MenuItemResponse } from "@/client-services";

type Props = {
  restaurantId: string;
  menuId: string;
  submenuId: string;
  item: MenuItemResponse;
};

export default function EditMenuItemDialog({
  restaurantId,
  menuId,
  submenuId,
  item,
}: Props) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = usePatchUpdateMenuItem();

  const defaultValues = useMemo<MenuItemFormValues>(
    () => ({
      name: item.name,
      description: item.description ?? "",
      pricing_type: item.pricing_type ?? "FIXED",
      is_visible: item.is_visible ?? true,
      prices:
        item.prices?.map((price) => ({
          label: price.label,
          price: price.price,
        })) ?? [],
    }),
    [item],
  );

  const handleSubmit = async (values: MenuItemFormValues) => {
    await mutateAsync({
      path: {
        restaurant_id: restaurantId,
        menu_id: menuId,
        submenu_id: submenuId,
        menu_item_id: item.id,
      },
      body: {
        name: values.name,
        description: values.description,
        pricing_type: values.pricing_type,
        is_visible: values.is_visible,
        prices: values.prices,
      },
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>

        <MenuItemForm
          defaultValues={defaultValues}
          loading={isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
