"use client";
import {
  createRestaurantApiV1RestaurantsCreatePost,
  CreateRestaurantApiV1RestaurantsCreatePostData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<CreateRestaurantApiV1RestaurantsCreatePostData>;

export const usePostCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } = await createRestaurantApiV1RestaurantsCreatePost({
        body,
      });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Restaurant created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_RESTAURANTS],
      });
    },
    onError: () => {
      toast.error("Failed to create restaurant. Please try again.");
    },
  });
};
