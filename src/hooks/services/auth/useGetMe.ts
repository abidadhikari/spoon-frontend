"use client";
import { useSyncExternalStore } from "react";
import { getMeApiV1AuthGetMeGet, UserResponse } from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

const subscribeToAuthStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getAuthTokenSnapshot = () =>
  !!window.localStorage.getItem("access_token");

const getServerAuthTokenSnapshot = () => false;

export const useGetMe = () => {
  const hasToken = useSyncExternalStore(
    subscribeToAuthStorage,
    getAuthTokenSnapshot,
    getServerAuthTokenSnapshot,
  );

  return useQuery<UserResponse | null | undefined, Error>({
    queryKey: [QUERY_KEYS.ME],
    enabled: hasToken,
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
