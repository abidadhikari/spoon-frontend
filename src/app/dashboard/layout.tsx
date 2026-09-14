"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { Suspense } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

function AuthGatedDashboard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background: "var(--brand)",
              color: "var(--brand-foreground)",
            }}
            aria-hidden="true"
          >
            S
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Suspense>{children}</Suspense>
    </DashboardLayout>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGatedDashboard>{children}</AuthGatedDashboard>;
};

export default Layout;
