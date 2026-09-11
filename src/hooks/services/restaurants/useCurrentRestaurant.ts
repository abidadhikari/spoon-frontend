"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import { useGetAllRestaurants } from "./useGetAllRestaurants";
import type { RestaurantResponse } from "@/client-services";

export const CURRENT_RESTAURANT_STORAGE_KEY = "current_restaurant_id";

export function setCurrentRestaurantId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_RESTAURANT_STORAGE_KEY, id);
    window.dispatchEvent(new Event("storage"));
  }
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => {
  return localStorage.getItem(CURRENT_RESTAURANT_STORAGE_KEY);
};

const getServerSnapshot = () => null;

export const useCurrentRestaurant = () => {
  const params = useParams();
  const {
    data: restaurantsData,
    isLoading,
    error,
    refetch,
  } = useGetAllRestaurants();
  const storedId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const routeRestaurantId = params?.restaurantId as string | undefined;
  const targetId = routeRestaurantId ?? storedId;

  const currentRestaurant = useMemo<RestaurantResponse | null>(() => {
    if (!restaurantsData || restaurantsData.length === 0) {
      return null;
    }
    if (targetId) {
      const found = restaurantsData.find((r) => r.id === targetId);
      if (found) {
        return found;
      }
    }
    return restaurantsData[0];
  }, [restaurantsData, targetId]);

  useEffect(() => {
    if (currentRestaurant?.id && typeof window !== "undefined") {
      localStorage.setItem(CURRENT_RESTAURANT_STORAGE_KEY, currentRestaurant.id);
    }
  }, [currentRestaurant?.id]);

  return {
    currentRestaurant,
    restaurantId: currentRestaurant?.id,
    restaurants: restaurantsData ?? [],
    isLoading,
    error,
    refetch,
  };
};
