"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";
import { useGetAllMenusList } from "@/hooks/services/menus/useGetAllMenus";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const { data: restaurants } = useGetAllRestaurants();
  const restaurantId = segments[2];
  const menuId = segments[4];

  const { data: menus } = useGetAllMenusList({
    restaurant_id: restaurantId ?? "",
  });

  const restaurant = restaurants?.find((r) => r.id === restaurantId);
  const menu = menus.find((m) => m.id === menuId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard" />}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments[1] === "users" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

        {restaurantId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {menuId ? (
                <BreadcrumbLink
                  render={
                    <Link href={`/dashboard/restaurants/${restaurantId}`} />
                  }
                >
                  {restaurant?.name ?? "Restaurant"}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  {restaurant?.name ?? "Restaurant"}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {menuId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{menu?.name ?? "Menu"}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
