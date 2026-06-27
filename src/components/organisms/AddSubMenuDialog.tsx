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
import { usePostCreateSubMenu } from "@/hooks/services/submenus/usePostCreateSubMenu";

type Props = {
  restaurantId: string;
  menuId: string;
};

export default function AddSubMenuDialog({ restaurantId, menuId }: Props) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const createSubMenu = usePostCreateSubMenu();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      await createSubMenu.mutateAsync({
        path: {
          restaurant_id: restaurantId,
          menu_id: menuId,
        },
        body: {
          title,
          description,
          is_visible: isVisible,
        },
      });

      setTitle("");
      setDescription("");
      setIsVisible(true);

      setOpen(false);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Submenu</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Submenu</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Drinks"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cold drinks and beverages..."
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            Visible
          </label>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={createSubMenu.isPending}
          >
            {createSubMenu.isPending ? "Creating..." : "Create Submenu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
