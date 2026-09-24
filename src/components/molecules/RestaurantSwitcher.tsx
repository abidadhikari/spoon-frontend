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
import { BookOpen, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CURRENT_RESTAURANT_STORAGE_KEY,
  useCurrentRestaurant,
} from "@/hooks/services/restaurants/useCurrentRestaurant";
import { AddRestaurantDialog } from "@/components/organisms/AddRestaurantDialog";

export function RestaurantSwitcher() {
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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium shadow-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-accent data-popup-open:text-accent-foreground"
        aria-label="Select restaurant"
      >
        <div className="flex size-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
          <BookOpen className="size-4" />
        </div>
        <span className="max-w-48 truncate">{activeRestaurant?.name}</span>
        <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit"
        align="end"
        side="bottom"
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
  );
}
