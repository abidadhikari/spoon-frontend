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
import { MenuResponse, MenuResponseWithSubmenus } from "@/client-services";
import { DEFAULT_MENU_TEMPLATE_ID } from "@/constants/menu-template";
import { Pencil } from "lucide-react";

type Props = {
  restaurantId: string;
  menu: MenuResponse | MenuResponseWithSubmenus;
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
        menu_configuration: { template_id: values.template_id },
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Edit Menu
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
            template_id:
              menu.menu_configuration?.template_id ?? DEFAULT_MENU_TEMPLATE_ID,
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
