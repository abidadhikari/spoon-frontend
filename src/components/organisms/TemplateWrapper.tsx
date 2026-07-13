"use client";

import TemplateTest from "@/components/organisms/TemplateTest";
import { useGetPublicMenuByQRCode } from "@/hooks/services/public/useGetPublicMenuByQRCode";

const TemplateWrapper = ({ code }: { code: string }) => {
  const { data, isLoading } = useGetPublicMenuByQRCode({ code });
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center italic text-stone-500">
        Loading menu...
      </div>
    );
  }
  return <TemplateTest menu={data || {}} />;
};

export default TemplateWrapper;
