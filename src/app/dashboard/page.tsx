"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

import { Metric } from "@/components/atoms/Metric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RestaurantCard,
  RestaurantCardSkeleton,
} from "@/components/organisms/RestaurantCard";
import { AddRestaurantDialog } from "@/components/organisms/AddRestaurantDialog";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";
import { getMenusApiV1MenusRestaurantIdGet } from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";

const Page = () => {
  const { data, isLoading, error, refetch } = useGetAllRestaurants();
  const [search, setSearch] = useState("");

  const restaurants = useMemo(() => data ?? [], [data]);

  const menuQueries = useQueries({
    queries: restaurants.map((restaurant) => ({
      queryKey: [QUERY_KEYS.ALL_MENUS, restaurant.id],
      queryFn: async () => {
        const response = await getMenusApiV1MenusRestaurantIdGet({
          path: { restaurant_id: restaurant.id },
        });
        return response.data ?? [];
      },
      enabled: !!restaurant.id,
    })),
  });

  const totalMenus = useMemo(
    () => menuQueries.reduce((sum, q) => sum + ((q.data as unknown[] | undefined)?.length ?? 0), 0),
    [menuQueries],
  );

  const filteredRestaurants = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return restaurants;
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.alias.toLowerCase().includes(term) ||
        (restaurant.description ?? "").toLowerCase().includes(term),
    );
  }, [restaurants, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Restaurants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your restaurants and their digital menus.
          </p>
        </div>
        <AddRestaurantDialog />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:max-w-xl">
        <Metric
          label="Restaurants"
          value={isLoading ? "—" : restaurants.length}
        />
        <Metric label="Menus" value={isLoading ? "—" : totalMenus} />
      </div>

      {error ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load restaurants: {error.message}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants by name or alias..."
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <RestaurantCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <h3 className="font-heading text-base font-medium">
                {restaurants.length === 0
                  ? "No restaurants yet"
                  : "No restaurants found"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {restaurants.length === 0
                  ? "Create your first restaurant to start building menus."
                  : "Try a different search term."}
              </p>
              {restaurants.length === 0 && (
                <div className="mt-4">
                  <AddRestaurantDialog
                    trigger={<Button>New restaurant</Button>}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
