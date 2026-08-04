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
import {
  RestaurantForm,
  RestaurantFormValues,
} from "@/components/organisms/RestaurantForm";
import { usePostCreateRestaurant } from "@/hooks/services/restaurants/usePostCreateRestaurant";

type Props = {
  trigger?: React.ReactNode;
};

export function AddRestaurantDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = usePostCreateRestaurant();

  const handleSubmit = async (values: RestaurantFormValues) => {
    await mutateAsync({
      name: values.name,
      alias: values.alias,
      description: values.description || null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>New restaurant</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New restaurant</DialogTitle>
          <DialogDescription>
            Add a new restaurant to your workspace.
          </DialogDescription>
        </DialogHeader>
        <RestaurantForm loading={isPending} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
