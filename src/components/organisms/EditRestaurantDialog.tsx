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
import { usePutUpdateRestaurant } from "@/hooks/services/restaurants/usePutUpdateRestaurant";
import { RestaurantResponse } from "@/client-services";

type Props = {
  restaurant: RestaurantResponse;
};

export function EditRestaurantDialog({ restaurant }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = usePutUpdateRestaurant();

  const handleSubmit = async (values: RestaurantFormValues) => {
    await mutateAsync({
      path: { restaurant_id: restaurant.id },
      body: {
        name: values.name,
        description: values.description || null,
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
          <DialogTitle>Edit restaurant</DialogTitle>
          <DialogDescription>
            Update the details of {restaurant.name}.
          </DialogDescription>
        </DialogHeader>
        <RestaurantForm
          showAlias={false}
          loading={isPending}
          defaultValues={{
            name: restaurant.name,
            description: restaurant.description ?? "",
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
