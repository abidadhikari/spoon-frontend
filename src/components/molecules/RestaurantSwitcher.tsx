"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookOpen, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";
import { useMemo } from "react";

export function RestaurantSwitcher() {
  const { isMobile } = useSidebar();
  const { restaurantId } = useParams();
  const navigate = useRouter();
  const { data: restaurantsData } = useGetAllRestaurants();

  const restaurantList =
    restaurantsData?.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      alias: restaurant.alias,
    })) ?? [];

  const activeRestaurant = useMemo(() => {
    if (!restaurantsData?.length) return null;

    return (
      restaurantsData.find((r) => r.id === restaurantId) ?? restaurantsData[0]
    );
  }, [restaurantsData, restaurantId]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {activeRestaurant?.name}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Restaurants
              </DropdownMenuLabel>
              {restaurantList?.map((restaurant, index) => (
                <DropdownMenuItem
                  key={restaurant.name + index}
                  onClick={() => {
                    navigate.replace(`/dashboard/restaurants/${restaurant.id}`);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <BookOpen />
                  </div>
                  {restaurant.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add restaurant
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
