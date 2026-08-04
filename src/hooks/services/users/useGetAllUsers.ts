import {
  getAllUsersApiV1UsersGet,
  UserUnrestrictedResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  return useQuery<UserUnrestrictedResponse[] | null | undefined, Error>({
    queryKey: [QUERY_KEYS.ALL_USERS],
    queryFn: async () => {
      const { data, error } = await getAllUsersApiV1UsersGet();
      if (error) {
        throw error as Error;
      }
      return data ?? [];
    },
  });
};
