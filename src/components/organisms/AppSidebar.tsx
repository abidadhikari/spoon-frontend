"use client";

import * as React from "react";

import AppLogo from "@/components/atoms/AppLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen, LayoutDashboard, Store, Users } from "lucide-react";
import { AppSidebarGroup } from "@/components/molecules/AppSidebarGroup";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useGetAllMenusList } from "@/hooks/services/menus/useGetAllMenus";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { restaurantId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRestaurantList =
    pathname === "/dashboard" && searchParams.get("view") === "list";

  const { data: menus } = useGetAllMenusList({
    restaurant_id: (restaurantId as string) ?? "",
  });

  const menuItems = menus.map((menu) => ({
    name: menu.name,
    url: `/dashboard/restaurants/${restaurantId}/menu/${menu.id}`,
    icon: <BookOpen />,
    active: pathname.startsWith(
      `/dashboard/restaurants/${restaurantId}/menu/${menu.id}`,
    ),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarGroup
          label="Workspace"
          items={[
            {
              name: "Restaurants",
              url: "/dashboard?view=list",
              icon: <Store />,
              active: isRestaurantList,
            },
          ]}
        />
        <AppSidebarGroup
          label="Workspace"
          items={[
            {
              name: "Dashboard",
              url: "/dashboard",
              icon: <LayoutDashboard />,
              active: pathname === "/dashboard" && !isRestaurantList,
            },

            {
              name: "Users",
              url: "/dashboard/users",
              icon: <Users />,
              active: pathname.startsWith("/dashboard/users"),
            },
          ]}
        />
        {restaurantId && <AppSidebarGroup label="Menus" items={menuItems} />}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
