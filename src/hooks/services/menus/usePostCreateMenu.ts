"use client";
import {
  createMenuApiV1MenusRestaurantIdPost,
  CreateMenuApiV1MenusRestaurantIdPostData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<CreateMenuApiV1MenusRestaurantIdPostData>;
type PathType = PathOf<CreateMenuApiV1MenusRestaurantIdPostData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePostCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } = await createMenuApiV1MenusRestaurantIdPost({
        body: payload.body,
        path: payload.path,
      });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Menu created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_MENUS, variables.path.restaurant_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_RESTAURANT, variables.path.restaurant_id],
      });
    },
    onError: () => {
      toast.error("Failed to create menu. Please try again.");
    },
  });
};
