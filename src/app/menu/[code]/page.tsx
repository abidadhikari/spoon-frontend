import RestaurantMenu from "@/components/organisms/RestaurantMenu";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { code } = await params;
  return <RestaurantMenu code={code} />;
}
