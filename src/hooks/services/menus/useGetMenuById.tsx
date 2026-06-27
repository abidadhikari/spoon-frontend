import {
  getMenuByIdApiV1MenusRestaurantIdMenuIdGet,
  GetMenuByIdApiV1MenusRestaurantIdMenuIdGetData,
  MenuResponseWithRestaurant,
  MenuResponseWithSubmenus,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useQuery } from "@tanstack/react-query";

type Payload = PathOf<GetMenuByIdApiV1MenusRestaurantIdMenuIdGetData>;

export const useGetMenuById = ({ restaurant_id, menu_id }: Payload) => {
  return useQuery<MenuResponseWithSubmenus | null | undefined, Error>({
    queryKey: [QUERY_KEYS.SINGLE_MENU, restaurant_id, menu_id],
    enabled: !!restaurant_id && !!menu_id,
    queryFn: async () => {
      const { data, error } = await getMenuByIdApiV1MenusRestaurantIdMenuIdGet({
        path: { restaurant_id, menu_id },
      });
      if (error) {
        throw error as Error;
      }
      return data;
    },
  });
};
