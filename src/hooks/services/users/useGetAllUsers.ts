import {
  getAllUsersApiV1UsersGet,
  GetAllUsersApiV1UsersGetData,
  UserUnrestrictedResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { QueryOf } from "@/types/query.type";
import { useQuery } from "@tanstack/react-query";

type Payload = QueryOf<GetAllUsersApiV1UsersGetData>;

export const useGetAllUsers = (
  payload: Payload,
  options?: { enabled?: boolean },
) => {
  return useQuery<UserUnrestrictedResponse[] | null | undefined, Error>({
    queryKey: [QUERY_KEYS.ALL_USERS, payload?.org_id],
    enabled: options?.enabled,
    queryFn: async () => {
      const { data, error } = await getAllUsersApiV1UsersGet({
        query: payload,
      });
      if (error) {
        throw error as Error;
      }
      return data ?? [];
    },
  });
};

