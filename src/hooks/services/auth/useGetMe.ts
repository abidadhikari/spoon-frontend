"use client";
import { getMeApiV1AuthGetMeGet, UserResponse } from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  return useQuery<UserResponse | null | undefined, Error>({
    queryKey: [QUERY_KEYS.ME],
    enabled: typeof window !== "undefined" && !!localStorage.getItem("access_token"),
    queryFn: async () => {
      const { data, error } = await getMeApiV1AuthGetMeGet();
      if (error) {
        throw error as Error;
      }
      return data as UserResponse;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
