import TemplateTest, {
  TemplateTestData,
} from "@/components/organisms/TemplateTest";
import TemplateWrapper from "@/components/organisms/TemplateWrapper";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

const dummy: TemplateTestData = {
  id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
  created_at: "2026-06-22T11:03:45.657610Z",
  updated_at: "2026-06-25T07:57:49.543676Z",
  name: "mitho menu",
  description: "string",
  is_visible: true,
  qr: {
    id: "094ebc42-fb4b-4a05-a4f3-929886b39666",
    created_at: "2026-06-22T11:03:45.657610Z",
    updated_at: "2026-06-22T11:03:45.657610Z",
    menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
    restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
    code: "64GPTP",
    views: 0,
  },
  restaurant: {
    id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
    created_at: "2026-06-22T07:38:53.846673Z",
    updated_at: "2026-06-22T08:06:49.584896Z",
    name: "string",
    alias: "string",
    description: "string",
    owner_id: "f47bc2f3-6afc-40b6-bfea-de3c9947c5d4",
  },
  submenus: [
    {
      id: "02ed0143-0149-4dd0-be3c-0d55a71f5ba8",
      title: "DARUUUUUUUUUUUUUUUUU",
      description: "string",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [],
    },
    {
      id: "8d555c06-bee3-441d-a006-cd6b0c58cc2a",
      title: "MOMO",
      description: "string",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [],
    },
    {
      id: "51d47a14-3be2-4269-b1c9-e3b97d430813",
      title: "WOW Drinks",
      description: "THis is Wow Drinks",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [],
    },
    {
      id: "62db3e3b-c643-42c2-a287-b440add70627",
      title: "WOW Icecreams",
      description: "",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [
        {
          name: "Chocolate IcCrea",
          description: "mitho wala",
          pricing_type: "FIXED",
          is_visible: true,
          prices: [
            { label: "one scoop", price: 130 },
            { label: "two scoop", price: 150 },
          ],
          prices_config: null,
          id: "acf7d414-15d6-4b3c-a032-1dcbba21726b",
        },
      ],
    },
    {
      id: "2ba4a794-cd6b-4cc6-9802-708c83e9eac2",
      title: "my Menu123",
      description: "string",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [],
    },
    {
      id: "0e242e82-cabc-4a8e-9986-4896fc026f7b",
      title: "MOMO",
      description: "",
      is_visible: true,
      menu_id: "23661183-c0b2-4ed2-b9e0-02a49643355f",
      restaurant_id: "ef72e9d2-ac80-425b-b9a2-021e5ea96def",
      menu_items: [
        {
          name: "Chicken Momo",
          description: "",
          pricing_type: "FIXED",
          is_visible: true,
          prices: [
            { label: "Steam", price: 170 },
            { label: "Fried", price: 225 },
            { label: "Kothey", price: 300 },
          ],
          prices_config: null,
          id: "a7033aed-c8ea-4e47-a5bb-07bbbb1dd919",
        },
        {
          name: "Buff Momo",
          description: "",
          pricing_type: "FIXED",
          is_visible: true,
          prices: [
            { label: "Steam", price: 150 },
            { label: "Fried", price: 225 },
          ],
          prices_config: null,
          id: "eb34b31a-f231-4dd9-a95d-0b1de6a238ab",
        },
      ],
    },
  ],
};

export default async function Page({ params }: Props) {
  const { code } = await params;
  console.log(code);

  // return <div>{code}</div>;
  // return <TemplateTest menu={dummy} />;
  return <TemplateWrapper code={code} />;
}
