"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      <Suspense>{children}</Suspense>
    </DashboardLayout>
  );
};

export default Layout;
