"use client";

import { useTemplate } from "@/context/TemplateProvider";
import { useGetPublicMenuByQRCode } from "@/hooks/services/public/useGetPublicMenuByQRCode";
import type { IMenu } from "@/types/menu.type";

const RestaurantMenu = ({ code }: { code: string }) => {
  const { template: Template } = useTemplate();

  const { data, isLoading } = useGetPublicMenuByQRCode({ code });
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center italic text-stone-500">
        Loading menu...
      </div>
    );
  }

  return <Template menu={(data ?? {}) as IMenu} />;
};

export default RestaurantMenu;
