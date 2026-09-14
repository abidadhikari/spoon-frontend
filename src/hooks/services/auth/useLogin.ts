"use client";
import {
  loginApiV1AuthLoginPost,
  LoginApiV1AuthLoginPostData,
  LoginResponse,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

type BodyType = BodyOf<LoginApiV1AuthLoginPostData>;

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } = await loginApiV1AuthLoginPost({ body });
      if (error || !data) {
        throw error;
      }
      return data as LoginResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      // Invalidate get-me so it refetches with the new token
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
    // No onError toast — the form handles error display inline
  });
};
