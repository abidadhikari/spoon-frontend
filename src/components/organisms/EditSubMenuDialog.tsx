"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { SubMenuResponse } from "@/client-services";
import { usePostUpdateSubMenu } from "@/hooks/services/submenus/usePostUpdateSubMenu";

type Props = {
  restaurantId: string;
  menuId: string;
  submenu: SubMenuResponse;
};

export default function EditSubMenuDialog({
  restaurantId,
  menuId,
  submenu,
}: Props) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = usePostUpdateSubMenu();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle(submenu.title);
      setDescription(submenu.description ?? "");
      setIsVisible(submenu.is_visible ?? true);
    }
  }, [open, submenu]);

  const handleSubmit = async () => {
    await mutateAsync({
      path: {
        restaurant_id: restaurantId,
        menu_id: menuId,
        submenu_id: submenu.id,
      },
      body: {
        title,
        description,
        is_visible: isVisible,
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

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Submenu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>

            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>

            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Updating..." : "Update Submenu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
