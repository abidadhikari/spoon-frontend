"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import MenuItemForm, {
  MenuItemFormValues,
} from "@/components/organisms/MenuItemForm";

import { usePostCreateMenuItem } from "@/hooks/services/menuitems/usePostCreateMenuItem";

type Props = {
  restaurantId: string;
  menuId: string;
  submenuId: string;
};

export default function AddMenuItemDialog({
  restaurantId,
  menuId,
  submenuId,
}: Props) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = usePostCreateMenuItem();

  const handleSubmit = async (values: MenuItemFormValues) => {
    await mutateAsync({
      path: {
        restaurant_id: restaurantId,
        menu_id: menuId,
        submenu_id: submenuId,
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
        <Button size="sm">Add Menu Item</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Menu Item</DialogTitle>
        </DialogHeader>

        <MenuItemForm loading={isPending} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
