"use client";

import { usePathname } from "next/navigation";
import {
  getAllTemplatesApiV1MenuTemplatesGet,
  TemplateSchema,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useGetMe } from "@/hooks/services/auth/useGetMe";
import { useQuery } from "@tanstack/react-query";

export const useGetAllMenuTemplates = () => {
  const pathname = usePathname();
  const { data: user, isLoading: isAuthLoading } = useGetMe();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthenticated = Boolean(user) && !isAuthLoading;

  return useQuery<TemplateSchema[], Error>({
    queryKey: [QUERY_KEYS.ALL_MENU_TEMPLATES],
    enabled: isDashboard && isAuthenticated,
    queryFn: async () => {
      const { data, error } = await getAllTemplatesApiV1MenuTemplatesGet();
      if (error) {
        throw error as Error;
      }
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
