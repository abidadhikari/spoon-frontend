"use client";

import {
  getMyDetailsApiV1AuthGetMyDetailsGet,
  UserResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetMyDetails = () => {
  return useQuery<UserResponse | null | undefined, Error>({
    queryKey: [QUERY_KEYS.MY_DETAILS],
    queryFn: async () => {
      const { data, error } = await getMyDetailsApiV1AuthGetMyDetailsGet();
      if (error) {
        throw error as Error;
      }
      return (data as UserResponse) ?? null;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
