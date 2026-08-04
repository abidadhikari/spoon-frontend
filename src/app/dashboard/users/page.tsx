"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/organisms/ConfirmDialog";
import { useGetAllUsers } from "@/hooks/services/users/useGetAllUsers";
import { useDeleteUser } from "@/hooks/services/users/useDeleteUser";
import type { UserUnrestrictedResponse } from "@/client-services";

const Page = () => {
  const { data, isLoading, error, refetch } = useGetAllUsers();
  const deleteUser = useDeleteUser();
  const [userToDelete, setUserToDelete] =
    useState<UserUnrestrictedResponse | null>(null);

  const handleDelete = async () => {
    if (!userToDelete) return;
    await deleteUser.mutateAsync({ id: userToDelete.id });
    setUserToDelete(null);
  };

  const users = data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users registered on the platform.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load users: {error.message}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading ? (
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
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={user.is_verified ? "green" : "orange"}
                    >
                      {user.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={userToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null);
        }}
        title="Delete user"
        description={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteUser.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Page;
