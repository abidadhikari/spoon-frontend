import {
  getMenusApiV1MenusRestaurantIdGet,
  GetMenusApiV1MenusRestaurantIdGetData,
  MenuPaginatedResponse,
  MenuResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf, QueryOf } from "@/types/query.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type PathPayload = PathOf<GetMenusApiV1MenusRestaurantIdGetData>;
type QueryPayload = QueryOf<GetMenusApiV1MenusRestaurantIdGetData>;

/**
 * Fetches paginated menus for a restaurant.
 * Returns the full MenuPaginatedResponse (with .data array + .pagination).
 * Consumers should access .data for the menu list.
 */
export const useGetAllMenus = (
  path: PathPayload,
  query?: QueryPayload,
  options?: { enabled?: boolean },
) => {
  const enabled =
    options?.enabled !== undefined ? options.enabled : !!path.restaurant_id;

  return useQuery<MenuPaginatedResponse | null | undefined, Error>({
    queryKey: [
      QUERY_KEYS.ALL_MENUS,
      path.restaurant_id,
      query?.page,
      query?.page_size,
    ],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await getMenusApiV1MenusRestaurantIdGet({
        path,
        query,
      });
      if (error) throw error as Error;
      return data;
    },
  });
};

/**
 * Convenience helper — returns the flat array of menus (or []).
 * Use this where you only need the list and don't care about pagination.
 */
export const useGetAllMenusList = (
  path: PathPayload,
  options?: { enabled?: boolean },
): {
  data: MenuResponse[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  const result = useGetAllMenus(path, { page: 1, page_size: 100 }, options);
  return {
    data: result.data?.data ?? [],
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};
