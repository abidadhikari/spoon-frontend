"use client";

import { useTemplate } from "@/context/TemplateProvider";
import { useGetPublicMenuByQRCode } from "@/hooks/services/public/useGetPublicMenuByQRCode";

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

  console.log(data);
  return <Template menu={data || {}} />;
};

export default RestaurantMenu;
