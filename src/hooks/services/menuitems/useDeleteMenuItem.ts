"use client";
import {
  deleteMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdDelete,
  DeleteMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdDeleteData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PathType =
  PathOf<DeleteMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdDeleteData>;

type Payload = PathType;

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await deleteMenuItemApiV1MenuItemsRestaurantIdMenuIdSubmenuIdMenuItemIdDelete(
          {
            path: payload,
          },
        );
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Menu item deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_MENU],
      });
    },
    onError: () => {
      toast.error("Failed to delete menu item. Please try again.");
    },
  });
};
