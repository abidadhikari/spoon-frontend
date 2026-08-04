"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuForm, MenuFormValues } from "@/components/organisms/MenuForm";
import { usePutUpdateMenu } from "@/hooks/services/menus/usePutUpdateMenu";
import { MenuResponseWithRestaurant } from "@/client-services";

type Props = {
  restaurantId: string;
  menu: MenuResponseWithRestaurant;
};

export function EditMenuDialog({ restaurantId, menu }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = usePutUpdateMenu();

  const handleSubmit = async (values: MenuFormValues) => {
    await mutateAsync({
      path: { restaurant_id: restaurantId, menu_id: menu.id },
      body: {
        name: values.name,
        description: values.description || null,
        is_visible: values.is_visible,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit menu</DialogTitle>
          <DialogDescription>
            Update the details of {menu.name}.
          </DialogDescription>
        </DialogHeader>
        <MenuForm
          loading={isPending}
          submitLabel="Save changes"
          defaultValues={{
            name: menu.name,
            description: menu.description ?? "",
            is_visible: menu.is_visible ?? true,
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
