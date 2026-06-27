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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const createMenuItem = usePostCreateMenuItem();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricingType, setPricingType] = useState("FIXED");
  const [isVisible, setIsVisible] = useState(true);

  const [prices, setPrices] = useState([
    {
      label: "",
      price: 0,
    },
  ]);

  const addPrice = () => {
    setPrices((prev) => [...prev, { label: "", price: 0 }]);
  };

  const removePrice = (index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePrice = (
    index: number,
    field: "label" | "price",
    value: string,
  ) => {
    const copy = [...prices];

    copy[index] = {
      ...copy[index],
      [field]: field === "price" ? Number(value) : value,
    };

    setPrices(copy);
  };

  const handleSubmit = async () => {
    await createMenuItem.mutateAsync({
      path: {
        restaurant_id: restaurantId,
        menu_id: menuId,
        submenu_id: submenuId,
      },
      body: {
        name,
        description,
        pricing_type: pricingType,
        is_visible: isVisible,
        prices,
      },
    });

    setOpen(false);

    setName("");
    setDescription("");
    setPrices([{ label: "", price: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Menu Item</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Menu Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Pricing Type</Label>

            <select
              className="w-full rounded-md border p-2"
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value)}
            >
              <option value="FIXED">FIXED</option>
              <option value="VARIABLE">VARIABLE</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            Visible
          </label>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <Label>Prices</Label>

              <Button type="button" variant="outline" onClick={addPrice}>
                + Add Price
              </Button>
            </div>

            <div className="space-y-3">
              {prices.map((price, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    placeholder="Label"
                    value={price.label}
                    onChange={(e) =>
                      updatePrice(index, "label", e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Price"
                    value={price.price}
                    onChange={(e) =>
                      updatePrice(index, "price", e.target.value)
                    }
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removePrice(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            disabled={createMenuItem.isPending}
            onClick={handleSubmit}
          >
            {createMenuItem.isPending ? "Creating..." : "Create Menu Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
