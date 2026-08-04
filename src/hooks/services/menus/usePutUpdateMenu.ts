"use client";
import {
  updateMenuApiV1MenusRestaurantIdMenuIdPut,
  UpdateMenuApiV1MenusRestaurantIdMenuIdPutData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<UpdateMenuApiV1MenusRestaurantIdMenuIdPutData>;
type PathType = PathOf<UpdateMenuApiV1MenusRestaurantIdMenuIdPutData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePutUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } = await updateMenuApiV1MenusRestaurantIdMenuIdPut({
        body: payload.body,
        path: payload.path,
      });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Menu updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.SINGLE_MENU,
          variables.path.restaurant_id,
          variables.path.menu_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_MENUS, variables.path.restaurant_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_RESTAURANT, variables.path.restaurant_id],
      });
    },
    onError: () => {
      toast.error("Failed to update menu. Please try again.");
    },
  });
};
