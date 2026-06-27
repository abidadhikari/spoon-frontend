"use client";
import {
  createMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdPost,
  CreateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdPostData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType =
  BodyOf<CreateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdPostData>;
type PathType =
  PathOf<CreateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdPostData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePostCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await createMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdPost({
          body: payload.body,
          path: payload.path,
        });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Menu item created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_MENU],
      });
    },
    onError: () => {
      toast.error("Failed to create menu item. Please try again.");
    },
  });
};
