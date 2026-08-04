"use client";
import {
  updateSubmenuOrderApiV1SubmenusRestaurantIdMenuIdOrderPatch,
  UpdateSubmenuOrderApiV1SubmenusRestaurantIdMenuIdOrderPatchData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<UpdateSubmenuOrderApiV1SubmenusRestaurantIdMenuIdOrderPatchData>;
type PathType = PathOf<UpdateSubmenuOrderApiV1SubmenusRestaurantIdMenuIdOrderPatchData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePatchUpdateSubmenuOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await updateSubmenuOrderApiV1SubmenusRestaurantIdMenuIdOrderPatch({
          body: payload.body,
          path: payload.path,
        });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Submenu order updated.");
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.SINGLE_MENU,
          variables.path.restaurant_id,
          variables.path.menu_id,
        ],
      });
    },
    onError: () => {
      toast.error("Failed to update submenu order. Please try again.");
    },
  });
};
