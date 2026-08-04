"use client";
import {
  deleteUserApiV1UsersIdDelete,
  DeleteUserApiV1UsersIdDeleteData,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PathType = PathOf<DeleteUserApiV1UsersIdDeleteData>;

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: PathType) => {
      const { data, error } = await deleteUserApiV1UsersIdDelete({
        path,
      });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_USERS],
      });
    },
    onError: () => {
      toast.error("Failed to delete user. Please try again.");
    },
  });
};
