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
import { usePostCreateMenu } from "@/hooks/services/menus/usePostCreateMenu";
import { DEFAULT_MENU_TEMPLATE_ID } from "@/constants/menu-template";

type Props = {
  trigger?: React.ReactNode;
  restaurantId: string;
};

export function AddMenuDialog({ restaurantId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = usePostCreateMenu();

  const handleSubmit = async (values: MenuFormValues) => {
    await mutateAsync({
      path: { restaurant_id: restaurantId },
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
        {trigger || <Button>New menu</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New menu</DialogTitle>
          <DialogDescription>
            Create a menu for this restaurant.
          </DialogDescription>
        </DialogHeader>
        <MenuForm
          loading={isPending}
          submitLabel="Create menu"
          onSubmit={handleSubmit}
          defaultValues={{ template_id: DEFAULT_MENU_TEMPLATE_ID }}
        />
      </DialogContent>
    </Dialog>
  );
}
