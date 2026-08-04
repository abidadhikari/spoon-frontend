"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenuResponseWithRestaurant } from "@/client-services";
import { EditMenuDialog } from "@/components/organisms/EditMenuDialog";

type Props = {
  restaurantId: string;
  menu: MenuResponseWithRestaurant;
};

export function MenuCard({ restaurantId, menu }: Props) {
  return (
    <Card className="transition-colors hover:ring-foreground/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{menu.name}</CardTitle>
            <CardDescription>
              {menu.is_visible ? "Published" : "Hidden"}
            </CardDescription>
          </div>
          <Badge tone={menu.is_visible ? "green" : "zinc"}>
            {menu.is_visible ? "Visible" : "Hidden"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {menu.description || "No description yet."}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <Link
          href={`/dashboard/restaurants/${restaurantId}/menu/${menu.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          <BookOpen className="size-4" />
          Edit content
        </Link>
        <EditMenuDialog restaurantId={restaurantId} menu={menu} />
      </CardFooter>
    </Card>
  );
}
