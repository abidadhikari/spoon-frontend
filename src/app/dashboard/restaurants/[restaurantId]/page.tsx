"use client";

import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";

import { Metric } from "@/components/atoms/Metric";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuCard } from "@/components/organisms/MenuCard";
import { AddMenuDialog } from "@/components/organisms/AddMenuDialog";
import { useGetRestaurantById } from "@/hooks/services/restaurants/useGetRestaurantById";
import { useGetAllMenusList } from "@/hooks/services/menus/useGetAllMenus";

const Page = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    error: restaurantError,
    refetch: refetchRestaurant,
  } = useGetRestaurantById({ restaurant_id: restaurantId });

  const {
    data: menus,
    isLoading: isLoadingMenus,
    error: menusError,
    refetch: refetchMenus,
  } = useGetAllMenusList({ restaurant_id: restaurantId });

  const isLoading = isLoadingRestaurant || isLoadingMenus;
  const error = restaurantError ?? menusError;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {isLoading ? "Loading..." : (restaurant?.name ?? "Restaurant")}
          </h1>
          {restaurant && (
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="zinc">{restaurant.alias}</Badge>
              <span className="text-sm text-muted-foreground">
                {restaurant.description || "No description yet."}
              </span>
            </div>
          )}
        </div>
        <AddMenuDialog restaurantId={restaurantId} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:max-w-xl">
        <Metric label="Menus" value={isLoading ? "—" : menus.length} />
      </div>

      {error ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load menus: {error.message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              refetchRestaurant();
              refetchMenus();
            }}
          >
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-4 h-8 w-24" />
            </div>
          ))}
        </div>
      ) : menus.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <MenuCard key={menu.id} restaurantId={restaurantId} menu={menu} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center shadow-xs bg-muted/20">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand-foreground mb-4">
            <BookOpen className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            No menus yet
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
            Create your first menu to start adding categories, items, and
            pricing for this restaurant.
          </p>
          <div className="mt-6">
            <AddMenuDialog
              restaurantId={restaurantId}
              trigger={
                <Button size="lg" className="shadow-sm">
                  New menu
                </Button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
