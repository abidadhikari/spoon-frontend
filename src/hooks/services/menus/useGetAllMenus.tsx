import {
  getMenusApiV1MenusRestaurantIdGet,
  GetMenusApiV1MenusRestaurantIdGetData,
  MenuResponseWithRestaurant,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useQuery } from "@tanstack/react-query";

type Payload = PathOf<GetMenusApiV1MenusRestaurantIdGetData>;

export const useGetAllMenus = ({ restaurant_id }: Payload) => {
  return useQuery<MenuResponseWithRestaurant[] | null | undefined>({
    queryKey: [QUERY_KEYS.ALL_MENUS],
    enabled: !!restaurant_id,
    queryFn: async () => {
      const response = await getMenusApiV1MenusRestaurantIdGet({
        path: { restaurant_id },
      });
      return response.data ?? [];
    },
  });
};
