"use client";
import {
  UpdateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdPatchData,
  updateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdPatch,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType =
  BodyOf<UpdateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdPatchData>;
type PathType =
  PathOf<UpdateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdPatchData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePatchUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await updateMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdPatch(
          {
            body: payload.body,
            path: payload.path,
          },
        );
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Menu item updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_MENU],
      });
    },
    onError: () => {
      toast.error("Failed to update menu item. Please try again.");
    },
  });
};
