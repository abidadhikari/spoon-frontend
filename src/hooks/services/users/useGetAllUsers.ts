import {
  getAllUsersApiV1UsersRestaurantIdGet,
  GetAllUsersApiV1UsersRestaurantIdGetData,
  UserPaginatedResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf, QueryOf } from "@/types/query.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

type PathPayload = PathOf<GetAllUsersApiV1UsersRestaurantIdGetData>;
type QueryPayload = QueryOf<GetAllUsersApiV1UsersRestaurantIdGetData>;

export const useGetAllUsers = (
  path: PathPayload,
  query?: QueryPayload,
  options?: { enabled?: boolean },
) => {
  return useQuery<UserPaginatedResponse | null | undefined, Error>({
    queryKey: [QUERY_KEYS.ALL_USERS, path?.restaurant_id, query?.page, query?.page_size],
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await getAllUsersApiV1UsersRestaurantIdGet({
        path,
        query,
      });
      if (error) {
        throw error as Error;
      }
      return data;
    },
  });
};
