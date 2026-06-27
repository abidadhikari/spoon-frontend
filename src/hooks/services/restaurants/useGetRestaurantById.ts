import {
  readRestaurantByIdApiV1RestaurantsRestaurantIdGet,
  ReadRestaurantByIdApiV1RestaurantsRestaurantIdGetData,
  ResturantResponseWithMenus,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useQuery } from "@tanstack/react-query";

type Payload = PathOf<ReadRestaurantByIdApiV1RestaurantsRestaurantIdGetData>;

export const useGetRestaurantById = ({ restaurant_id }: Payload) => {
  return useQuery<ResturantResponseWithMenus | null | undefined, Error>({
    queryKey: [QUERY_KEYS.SINGLE_RESTAURANT, restaurant_id],
    enabled: !!restaurant_id,
    queryFn: async () => {
      const { data, error } =
        await readRestaurantByIdApiV1RestaurantsRestaurantIdGet({
          path: { restaurant_id },
        });
      if (error) {
        throw error as Error;
      }
      return data;
    },
  });
};
