"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon, StoreIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RestaurantCard,
  RestaurantCardSkeleton,
} from "@/components/organisms/RestaurantCard";
import { Metric } from "@/components/atoms/Metric";

import { AddRestaurantDialog } from "@/components/organisms/AddRestaurantDialog";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const { data, isLoading, error, refetch } = useGetAllRestaurants();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isListView = searchParams.get("view") === "list";

  const restaurants = useMemo(() => data ?? [], [data]);

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

  useEffect(() => {
    if (!isListView && !isLoading && !error && restaurants.length > 0) {
      router.replace(`/dashboard/restaurants/${restaurants[0].id}`);
    }
  }, [error, isListView, isLoading, restaurants, router]);

  const hasRestaurant =
    !isListView && !isLoading && !error && restaurants.length > 0;

  return (
    <div className="space-y-8">
      {hasRestaurant ? null : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-semibold">Workspace</h1>
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
          </div>
        </div>
      )}

      {hasRestaurant ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Opening your restaurant...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center shadow-xs bg-muted/20">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand-foreground mb-4">
                <StoreIcon className="size-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {restaurants.length === 0
                  ? "No restaurants yet"
                  : "No restaurants found"}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
                {restaurants.length === 0
                  ? "Create your first restaurant to start building menus, managing items, and generating QR codes."
                  : "We couldn't find any restaurants matching your search. Try a different term."}
              </p>
              {restaurants.length === 0 && (
                <div className="mt-6">
                  <AddRestaurantDialog
                    trigger={
                      <Button size="lg" className="shadow-sm">
                        New restaurant
                      </Button>
                    }
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
