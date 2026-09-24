"use client";

import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyDetails } from "@/hooks/services/auth/useGetMyDetails";
import { formatDate } from "@/lib/date";

const AccountPage = () => {
  const { data: user, error, isLoading, refetch } = useGetMyDetails();
  const fullName = [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const displayName = fullName || user?.name || "Account";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your account details and access status.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load account details: {error.message}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : user ? (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b">
            <div className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand-foreground">
              <span className="text-lg font-semibold">{initial}</span>
            </div>
            <div>
              <CardTitle>{displayName}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-x-8 gap-y-5 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">First name</dt>
              <dd className="mt-1 font-medium">{user.first_name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last name</dt>
              <dd className="mt-1 font-medium">{user.last_name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd className="mt-1 font-medium">{user.app_role}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium">{user.status || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="mt-1 font-medium">
                {formatDate(user.created_at)}
              </dd>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand-foreground">
            <UserRound className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold">
            Account details unavailable
          </h2>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
