"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookOpen, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CURRENT_RESTAURANT_STORAGE_KEY,
  useCurrentRestaurant,
} from "@/hooks/services/restaurants/useCurrentRestaurant";
import { AddRestaurantDialog } from "@/components/organisms/AddRestaurantDialog";

export function RestaurantSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useRouter();
  const { currentRestaurant: activeRestaurant, restaurants: restaurantsData } =
    useCurrentRestaurant();

  const restaurantList =
    restaurantsData?.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      alias: restaurant.alias,
    })) ?? [];

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
                    if (typeof window !== "undefined") {
                      localStorage.setItem(
                        CURRENT_RESTAURANT_STORAGE_KEY,
                        restaurant.id,
                      );
                    }
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
              <AddRestaurantDialog
                trigger={
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <PlusIcon className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add restaurant
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
