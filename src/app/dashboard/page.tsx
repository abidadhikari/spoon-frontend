"use client";
import { RestaurantResponse } from "@/client-services";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";
import Link from "next/link";

const Page = () => {
  const { data, isLoading, error } = useGetAllRestaurants();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <section className="grid grid-cols-3 gap-4">
          {data.map((restaurant: RestaurantResponse) => (
            <Link
              href={`/dashboard/restaurants/${restaurant.id}`}
              key={restaurant.id}
            >
              <div className="border rounded-sm p-4 w-full bg-green-600">
                {restaurant.name}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default Page;
