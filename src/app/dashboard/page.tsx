"use client";
import { useGetAllRestaurants } from "@/hooks/services/restaurants/useGetAllRestaurants";

const Page = () => {
  const { data } = useGetAllRestaurants();

  return (
    <div>
      <h1>RESTAURANTS : {data?.length || "-"}</h1>
    </div>
  );
};

export default Page;
