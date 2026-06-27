"use client";
import {
  createSubmenuApiV1SubmenusRestaurantIdMenuIdPost,
  CreateSubmenuApiV1SubmenusRestaurantIdMenuIdPostData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { BodyOf, PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<CreateSubmenuApiV1SubmenusRestaurantIdMenuIdPostData>;
type PathType = PathOf<CreateSubmenuApiV1SubmenusRestaurantIdMenuIdPostData>;

type Payload = {
  body: BodyType;
  path: PathType;
};

export const usePostCreateSubMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data, error } =
        await createSubmenuApiV1SubmenusRestaurantIdMenuIdPost({
          body: payload.body,
          path: payload.path,
        });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Submenu created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_MENU],
      });
    },
    onError: () => {
      toast.error("Failed to create submenu. Please try again.");
    },
  });
};
