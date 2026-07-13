import {
  GetPublicMenuApiV1MenusPublicCodeGetData,
  getPublicMenuApiV1MenusPublicCodeGet,
  MenuResponsePublic,
} from "@/client-services";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PathOf } from "@/types/query.type";
import { useQuery } from "@tanstack/react-query";

type Payload = PathOf<GetPublicMenuApiV1MenusPublicCodeGetData>;

export const useGetPublicMenuByQRCode = ({ code }: Payload) => {
  return useQuery<MenuResponsePublic | null | undefined, Error>({
    queryKey: [QUERY_KEYS.PUBLIC_MENU, code],
    enabled: !!code,
    queryFn: async () => {
      const { data, error } = await getPublicMenuApiV1MenusPublicCodeGet({
        path: { code },
      });
      if (error) {
        throw error as Error;
      }
      return data;
    },
  });
};
