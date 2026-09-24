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
import { MenuResponse } from "@/client-services";
import { EditMenuDialog } from "@/components/organisms/EditMenuDialog";
import { DEFAULT_MENU_TEMPLATE_NAME } from "@/constants/menu-template";
import { useGetAllMenuTemplates } from "@/hooks/services/menu-templates/useGetAllMenuTemplates";

type Props = {
  restaurantId: string;
  menu: MenuResponse;
};

export function MenuCard({ restaurantId, menu }: Props) {
  const { data: templates = [] } = useGetAllMenuTemplates();
  const templateId = menu.menu_configuration?.template_id;
  const templateName =
    templates.find((template) => template.id === templateId)?.display_name ??
    DEFAULT_MENU_TEMPLATE_NAME;

  return (
    <Card className="transition-colors hover:ring-accent/50 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{menu.name}</CardTitle>
            <CardDescription>
              {menu.is_visible ? "Published" : "Hidden"}
            </CardDescription>
            <p className="mt-1 text-xs text-muted-foreground">
              Template: {templateName}
            </p>
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
        >
          <BookOpen className="size-4" />
          Edit content
        </Link>
        <EditMenuDialog restaurantId={restaurantId} menu={menu} />
      </CardFooter>
    </Card>
  );
}
