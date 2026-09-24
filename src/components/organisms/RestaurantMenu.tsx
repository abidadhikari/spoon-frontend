"use client";

import { TemplateProvider, useTemplate } from "@/context/TemplateProvider";
import { useGetPublicMenuByQRCode } from "@/hooks/services/public/useGetPublicMenuByQRCode";
import type { IMenu } from "@/types/menu.type";

const RestaurantMenu = ({ code }: { code: string }) => {
  const { data, isLoading, error, refetch } = useGetPublicMenuByQRCode({
    code,
  });
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center italic text-stone-500">
        Loading menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-sm text-stone-600">This menu could not be loaded.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 text-sm font-semibold text-stone-900 underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  const templateId = data?.menu_configuration?.template_id;

  return (
    <TemplateProvider templateId={templateId}>
      <RenderedMenu menu={(data ?? {}) as IMenu} />
    </TemplateProvider>
  );
};

function RenderedMenu({ menu }: { menu: IMenu }) {
  const { template: Template } = useTemplate();
  return <Template menu={menu} />;
}

export default RestaurantMenu;
