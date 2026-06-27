import {
  readRestaurantsApiV1RestaurantsGet,
  RestaurantResponse,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetAllRestaurants = () => {
  return useQuery<RestaurantResponse[] | null | undefined>({
    queryKey: [QUERY_KEYS.ALL_RESTAURANTS],
    queryFn: async () => {
      const response = await readRestaurantsApiV1RestaurantsGet();
      return response.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
