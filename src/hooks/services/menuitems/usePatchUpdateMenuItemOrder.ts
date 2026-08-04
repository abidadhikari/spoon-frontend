"use client";
import {
  updateMenuItemsOrderApiV1MenuItemsRestaurantIdMenuIdSubmenuIdOrderPatch,
  UpdateMenuItemsOrderApiV1MenuItemsRestaurantIdMenuIdSubmenuIdOrderPatchData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType =
  BodyOf<UpdateMenuItemsOrderApiV1MenuItemsRestaurantIdMenuIdSubmenuIdOrderPatchData>;
type PathType =
  PathOf<UpdateMenuItemsOrderApiV1MenuItemsRestaurantIdMenuIdSubmenuIdOrderPatchData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePatchUpdateMenuItemOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await updateMenuItemsOrderApiV1MenuItemsRestaurantIdMenuIdSubmenuIdOrderPatch(
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
    onSuccess: (_data, variables) => {
      toast.success("Menu item order updated.");
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.SINGLE_MENU,
          variables.path.restaurant_id,
          variables.path.menu_id,
        ],
      });
    },
    onError: () => {
      toast.error("Failed to update menu item order. Please try again.");
    },
  });
};
