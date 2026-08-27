"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen, LayoutDashboard, Store, Users } from "lucide-react";
import { AppSidebarGroup } from "@/components/molecules/AppSidebarGroup";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { RestaurantSwitcher } from "@/components/molecules/RestaurantSwitcher";
import { useGetAllMenus } from "@/hooks/services/menus/useGetAllMenus";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { restaurantId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRestaurantList =
    pathname === "/dashboard" && searchParams.get("view") === "list";

  const { data: menus } = useGetAllMenus({
    restaurant_id: (restaurantId as string) ?? "",
  });

  const menuItems = (menus ?? []).map((menu) => ({
    name: menu.name,
    url: `/dashboard/restaurants/${restaurantId}/menu/${menu.id}`,
    icon: <BookOpen />,
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RestaurantSwitcher />
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
              active:
                (pathname === "/dashboard" && !isRestaurantList) ||
                pathname.startsWith("/dashboard/restaurants"),
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
