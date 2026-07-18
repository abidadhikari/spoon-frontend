"use client";
import { useGetAllMenus } from "@/hooks/services/menus/useGetAllMenus";
import { useGetRestaurantById } from "@/hooks/services/restaurants/useGetRestaurantById";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const { restaurantId } = useParams();
  const { data } = useGetRestaurantById({
    restaurant_id: restaurantId as string,
  });
  const { data: menus } = useGetAllMenus({
    restaurant_id: restaurantId as string,
  });
  return (
    <div>
      <section>
        <h1 className="text-2xl font-bold">Restaurant Details</h1>
        <div className="mt-4">Name: {data?.name}</div>
        <div className="mt-4">Description: {data?.description}</div>
        <div className="mt-4">Menus: {data?.menus?.length}</div>
      </section>

      <section>
        <h1 className="text-2xl font-bold mt-8">Restaurant Menus</h1>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {menus?.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/restaurants/${restaurantId}/menu/${menu.id}`}
              className="block mt-2 border p-4 rounded-md hover:bg-gray-400 "
            >
              <h2 className="text-xl font-semibold">{menu.name}</h2>
              <p>{menu.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
