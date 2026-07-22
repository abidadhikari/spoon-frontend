import RestaurantMenu from "@/components/organisms/RestaurantMenu";
import { TemplateProvider } from "@/context/TemplateProvider";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { code } = await params;
  return (
    <TemplateProvider templateId="elegant">
      <RestaurantMenu code={code} />
    </TemplateProvider>
  );
}
