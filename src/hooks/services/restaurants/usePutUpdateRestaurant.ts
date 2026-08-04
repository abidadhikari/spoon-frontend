"use client";
import {
  updateRestaurantApiV1RestaurantsRestaurantIdPut,
  UpdateRestaurantApiV1RestaurantsRestaurantIdPutData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<UpdateRestaurantApiV1RestaurantsRestaurantIdPutData>;
type PathType = PathOf<UpdateRestaurantApiV1RestaurantsRestaurantIdPutData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePutUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await updateRestaurantApiV1RestaurantsRestaurantIdPut({
          body: payload.body,
          path: payload.path,
        });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Restaurant updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_RESTAURANTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_RESTAURANT, variables.path.restaurant_id],
      });
    },
    onError: () => {
      toast.error("Failed to update restaurant. Please try again.");
    },
  });
};
