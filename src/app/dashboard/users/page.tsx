"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllUsers } from "@/hooks/services/users/useGetAllUsers";
import { useCurrentRestaurant } from "@/hooks/services/restaurants/useCurrentRestaurant";
import { AppPagination } from "@/components/molecules/AppPagination";

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    currentRestaurant,
    isLoading: isLoadingRestaurant,
    error: restaurantError,
  } = useCurrentRestaurant();

  const { data, isLoading, error, refetch, isPlaceholderData } = useGetAllUsers(
    {
      restaurant_id: currentRestaurant?.id ?? "",
    },
    {
      page,
      page_size: pageSize,
    },
    {
      enabled: !isLoadingRestaurant && !!currentRestaurant?.id,
    },
  );

  const users = data?.data ?? [];
  const activeError = error ?? restaurantError;
  const isPageLoading = isLoading || isLoadingRestaurant;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users registered on the platform.
        </p>
      </div>

      {activeError ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load users: {activeError.message}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isPageLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-4">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="font-heading text-base font-medium">No users yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Users will appear here once they register.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className={isPlaceholderData ? "opacity-50" : ""}>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={user.is_verified ? "green" : "orange"}>
                        {user.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AppPagination
            pagination={data?.pagination}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1); // Reset to page 1 on page size change
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
