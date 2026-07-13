"use client";
import {
  SubMenuResponse,
  updateSubmenuApiV1SubmenusRestaurantIdMenuIdSubmenuIdPatch,
  UpdateSubmenuApiV1SubmenusRestaurantIdMenuIdSubmenuIdPatchData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType =
  BodyOf<UpdateSubmenuApiV1SubmenusRestaurantIdMenuIdSubmenuIdPatchData>;
type PathType =
  PathOf<UpdateSubmenuApiV1SubmenusRestaurantIdMenuIdSubmenuIdPatchData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePostUpdateSubMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await updateSubmenuApiV1SubmenusRestaurantIdMenuIdSubmenuIdPatch({
          body: payload.body,
          path: payload.path,
        });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Submenu updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_MENU],
      });
    },
    onError: () => {
      toast.error("Failed to update submenu. Please try again.");
    },
  });
};
