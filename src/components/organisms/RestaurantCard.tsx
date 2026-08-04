"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RestaurantResponse } from "@/client-services";
import { EditRestaurantDialog } from "@/components/organisms/EditRestaurantDialog";
import { useGetAllMenus } from "@/hooks/services/menus/useGetAllMenus";

export function RestaurantCard({ restaurant }: { restaurant: RestaurantResponse }) {
  const { data: menus } = useGetAllMenus({
    restaurant_id: restaurant.id,
  });

  return (
    <Card className="transition-colors hover:ring-foreground/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{restaurant.alias}</CardDescription>
          </div>
          <Badge tone="zinc">{menus?.length ?? 0} menus</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {restaurant.description || "No description yet."}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <Link
          href={`/dashboard/restaurants/${restaurant.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          <BookOpen className="size-4" />
          Open menus
        </Link>
        <EditRestaurantDialog restaurant={restaurant} />
      </CardFooter>
    </Card>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}
